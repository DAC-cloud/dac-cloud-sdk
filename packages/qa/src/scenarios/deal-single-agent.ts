import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, proposeVoteExecute, setupNativeDacWithDeal} from "./fixtures/index.js";

/**
 * Scenario: Single-Agent Deal — Full Slash
 *
 * Creates a deal with rewardCurve=[0] penaltyCurve=[1e18].
 * At 0 progress, evaluation produces a 100% slash → all stake burned → auto-close.
 * After full slash: no unstake possible (tokens burned), so DAC recovers the deal
 * via governance → liquidator assigned → forceReturnCapital.
 */
export const dealSingleAgentScenario: Scenario = {
  name: "deal-single-agent-lifecycle",
  description: "Create DAC → deal → stake → approve → evaluate (full slash) → verify closed",
  tags: ["deal", "single-agent", "lifecycle", "evaluation", "slash"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain for time manipulation. Skipping.");
      return;
    }

    const {assert} = h;

    // Setup: DAC + approved deal with full-slash milestone config
    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Full Slash Deal",
      milestones: [{
        expectedReturn: "1000000000000000000000",
        rewardCurve: ["0"],           // no reward at 0 progress
        penaltyCurve: ["1000000000000000000"],  // 100% slash
      }],
    });

    // ── Discover: guest JWT (outsider wallet never used in scenarios) ──

    await step(h, "discover-guest", async () => {
      const cli = await h.cliAs("outsider", [
        "discover", "--chain-id", String(h.config.chainId),
        "--config", h.config.configPath, "--pretty-print",
      ]);
      assert.equal(cli.data.action, "discover", "discover action");
      // outsider has never interacted with any DAC — should see 0
      assert.equal(cli.data.totalDacs, 0, "outsider wallet discovers 0 DACs");
      h.log(`Guest discover: totalDacs=${cli.data.totalDacs}`);
      return {cli, command: ["dac", "discover"]};
    });

    // ── Discover: member JWT (founder has main + staked-agent) ──

    await step(h, "discover-member", async () => {
      const cli = await h.cli([
        "discover", "--chain-id", String(h.config.chainId),
        "--config", h.config.configPath, "--pretty-print",
      ]);
      assert.equal(cli.data.action, "discover", "discover action");
      assert.gte(Number(cli.data.totalDacs), 1, "founder discovers at least 1 DAC");

      const byChain = cli.data.byChain as Record<string, Array<Record<string, unknown>>> | undefined;
      assert.defined(byChain, "byChain present");

      const chainDacs = byChain?.[String(h.config.chainId)];
      assert.defined(chainDacs, "chain DACs present");
      assert.gte(chainDacs?.length ?? 0, 1, "at least 1 DAC on chain");

      // Find our DAC by address
      const ourDac = chainDacs?.find(
        (d) => String(d.address).toLowerCase() === ctx.dacAddress.toLowerCase(),
      );
      assert.defined(ourDac, "our DAC found in discover results");

      if (ourDac) {
        const roles = ourDac.roles as string[];
        h.log(`Discover roles for founder: ${JSON.stringify(roles)}`);
        assert.equal(roles.includes("main"), true, "founder has 'main' role");
        // Founder staked all agent tokens → walletAgent=0, but staked-agent role if currentStakedAmount > 0
        assert.equal(roles.includes("staked-agent"), true, "founder has 'staked-agent' role");
      }

      return {cli, command: ["dac", "discover"], indexerSnapshot: {byChain} as Record<string, unknown>};
    });

    // ── Evaluate deal ────────────────────────────────────────────

    // Advance past milestone timestamp — use exact calculation to avoid timing flakiness
    const milestoneTs = ctx.chainTimestamp + 86400 * 7;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = milestoneTs - currentTs + 3600; // 1 hour past milestone
    h.log(`Chain time: ${currentTs}, milestone: ${milestoneTs}, advancing ${neededAdvance}s`);
    await h.advanceTime(Math.max(neededAdvance, 3600));

    await step(h, "evaluate-deal", async () => {
      const args = [
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", h.config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "evaluate tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Verify deal closed + slash amounts ─────────────────────────

    await step(h, "verify-deal-closed", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after evaluation");
      if (deal) {
        assert.equal(deal.closed, true, "deal closed after full slash");
        assert.equal(deal.currentStakedAmount, "0", "all stake slashed");
        assert.equal(deal.totalSlashedStakeAmount, "10000000000000000000000", "total slashed = original stake");
      }
      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Verify agent position shows slash ────────────────────────
    // After full slash, all stake is burned — agents cannot unstake (NoStake).

    await step(h, "verify-agent-position", async () => {
      const cli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = cli.data.positions as Array<Record<string, unknown>> | undefined;
      assert.defined(positions, "agent positions in indexer");
      assert.gte(positions?.length ?? 0, 1, "at least 1 agent position");

      if (positions && positions.length > 0) {
        const pos = positions[0];
        h.log(`Agent position: staked=${pos.currentStakedAmount}, slashed=${pos.totalSlashedAmount}, released=${pos.totalReleasedAmount}`);
        assert.equal(pos.currentStakedAmount, "0", "position stake is 0");
        assert.equal(BigInt(pos.totalSlashedAmount as string) > 0n, true, "slashed amount > 0");
      }

      return {cli, command: ["deal", "view", "positions"], indexerSnapshot: {positions} as Record<string, unknown>};
    });

    // ── DAC recovers the slashed deal ────────────────────────────
    // After full slash (totalSupply=0), the deal is recoverable.
    // DAC governance assigns a liquidator who can then return capital.

    h.log("Recovering slashed deal via DAC governance...");

    await step(h, "recover-deal", async () => {
      const proposalId = await proposeVoteExecute(h, ctx.dacAddress, [
        "propose", "recover-deal",
        ctx.dealNumericId,           // dealId
        ctx.founderAddress,          // liquidator = founder
        "1000000000000000000000",    // liquidatorStake (1k — minted directly, no AgentToken needed)
      ]);
      assert.defined(proposalId, "recover proposal id");
      return {
        cli: {data: {action: "recover-deal", proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "recover-deal"],
      };
    });

    await h.syncIndexer();

    // ── Verify deal marked as recovered ──────────────────────────

    await step(h, "verify-deal-recovered", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal after recovery");

      if (deal) {
        h.log(`After recovery: closed=${deal.closed}, recovered=${deal.recovered}`);
        assert.equal(deal.closed, true, "deal still closed");
        assert.equal(deal.recovered, true, "deal marked as recovered");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Verify deals list ────────────────────────────────────────

    await step(h, "verify-deals-list", async () => {
      const cli = await h.view("deals", ["--dac", ctx.dacAddress]);
      const deals = cli.data.deals as Array<Record<string, unknown>> | undefined;
      assert.defined(deals, "deals found in indexer");
      assert.gte(deals?.length ?? 0, 1, "at least 1 deal");
      return {cli, command: ["dac", "view", "deals"], indexerSnapshot: {deals} as Record<string, unknown>};
    });
  },
};
