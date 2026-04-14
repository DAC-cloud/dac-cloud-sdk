import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, setupNativeDacWithDeal, transferErc20} from "./fixtures/index.js";

/**
 * Scenario: Deal Unstake After Close — Multi-Agent
 *
 * Creates a DAC with TWO deals in the same DAC for indexer diversity:
 * - Deal 1: Full reward → close → both agents unstake
 * - Deal 2: Left active (not evaluated)
 *
 * Tests:
 * - Unstake mechanics after deal close (AgentTokens returned, not burned)
 * - Multiple deals in one DAC (indexer deal list)
 * - Multiple agents unstaking from the same closed deal
 */
export const dealUnstakeAfterCloseScenario: Scenario = {
  name: "deal-unstake-after-close",
  description: "Two deals in one DAC → close deal 1 → both agents unstake",
  tags: ["deal", "unstake", "close", "multi-agent", "multi-deal"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const expectedReturn = "1000000000000000000000";
    const depositAmount = "1200000000000000000000"; // 120% of expected

    // ── Setup: DAC + Deal 1 with two agents ─────────────────────

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Unstake Deal 1",
      rewardsLimit: "100000000000000000000000",
      milestones: [{
        expectedReturn,
        rewardCurve: ["0"],
        penaltyCurve: ["0"],
        rewardPercentage: "1000000000000000000", // 100%
      }],
      extraAgents: [{
        role: "agent1",
        mintAmount: "50000000000000000000000",
        stakeAmount: "5000000000000000000000",
      }],
    });

    // ── Create Deal 2 in the same DAC (left active) ─────────────

    h.log("Creating second deal in the same DAC...");

    const {writeFileSync} = await import("node:fs");
    const {join} = await import("node:path");
    const {tmpdir} = await import("node:os");

    const chainTimestamp = ctx.chainTimestamp + 3710 + 10 + 3700; // account for time already advanced

    const deal2Config = {
      dealKind: "permit2-treasury",
      name: "Unstake Deal 2 (stays active)",
      description: "Second deal for indexer diversity",
      linkHash: "seed://qa-deal-2",
      fundingToken: ctx.treasuryToken,
      fundingAmount: "0",
      rewardsLimit: "50000000000000000000000",
      dealRewardPoolPercent: "0",
      approveDeadline: String(chainTimestamp + 86400 * 30),
      evaluationDeadline: String(chainTimestamp + 86400 * 60),
      dealDeadline: String(chainTimestamp + 86400 * 90),
      dealConfig: {},
      evaluatorSelector: "milestones-evaluator",
      evaluatorConfig: {
        rewardShare: "1000000000000000000",
        milestones: [{
          milestoneType: 0,
          token: ctx.treasuryToken,
          oracle: "0x0000000000000000000000000000000000000000",
          valuationMode: 0,
          fundingToken: "0x0000000000000000000000000000000000000000",
          expectedReturn: "500000000000000000000",
          timestamp: String(chainTimestamp + 86400 * 14),
          rewardPercentage: "1000000000000000000",
          rewardCurve: ["0", "1000000000000000000"],
          penaltyCurve: ["0", "1000000000000000000"],
          minPercentGrace: "0",
          extension: "0",
        }],
      },
      vetoEnabled: false,
      agentsLimit: "0",
      minimalStake: "0",
    };

    const deal2Path = join(tmpdir(), `qa-deal2-${Date.now()}.json`);
    writeFileSync(deal2Path, JSON.stringify(deal2Config, null, 2));

    await step(h, "create-deal-2", async () => {
      const args = [
        "deal", "create", deal2Path, "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.dealAddress, "deal 2 address");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Verify two deals in the DAC ─────────────────────────────

    await step(h, "verify-two-deals", async () => {
      const cli = await h.view("deals", ["--dac", ctx.dacAddress]);
      const deals = cli.data.deals as Array<Record<string, unknown>> | undefined;
      assert.defined(deals, "deals list");
      assert.gte(deals?.length ?? 0, 2, "at least 2 deals in DAC");
      h.log(`DAC has ${deals?.length ?? 0} deals`);
      return {cli, command: ["dac", "view", "deals"], indexerSnapshot: {deals} as Record<string, unknown>};
    });

    // ── Deposit + evaluate Deal 1 for full reward → close ───────

    h.log(`Depositing ${depositAmount} tokens to deal 1 cell ${ctx.dealCell}...`);

    await step(h, "deposit-deal-1", async () => {
      const txHash = await transferErc20(h, {
        token: ctx.treasuryToken,
        from: ctx.founderAddress,
        to: ctx.dealCell,
        amount: depositAmount,
      });
      assert.defined(txHash, "transfer tx hash");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer", ctx.treasuryToken, ctx.dealCell, depositAmount],
      };
    });

    const milestoneTs = ctx.chainTimestamp + 86400 * 7;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = milestoneTs - currentTs + 3600;
    await h.advanceTime(Math.max(neededAdvance, 3600));

    await step(h, "evaluate-deal-1-full-reward", async () => {
      const args = [
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "evaluate tx hash");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    await step(h, "verify-deal-1-closed", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal 1 after eval");

      if (deal) {
        h.log(`Deal 1 after eval: closed=${deal.closed}`);
        assert.equal(deal.closed, true, "deal 1 closed after full reward");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Founder unstakes from closed Deal 1 ─────────────────────

    await step(h, "founder-unstake", async () => {
      const args = [
        "deal", "unstake",
        "--deal-address", ctx.dealCell,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "founder unstake tx hash");
      return {cli, command: ["dac", ...args]};
    });

    // ── Agent1 unstakes from closed Deal 1 ──────────────────────

    await step(h, "agent1-unstake", async () => {
      const args = [
        "deal", "unstake",
        "--deal-address", ctx.dealCell,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cliAs("agent1", args);
      assert.defined(cli.data.txHash, "agent1 unstake tx hash");
      return {cli, command: ["dac [as agent1]", ...args]};
    });

    await h.syncIndexer();

    // ── Verify staker positions after unstake ────────────────────

    await step(h, "verify-unstake-positions", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal 1 after unstakes");

      if (deal) {
        h.log(`After unstakes: stakerCount=${deal.stakerCount}, currentStaked=${deal.currentStakedAmount}, released=${deal.totalReleasedStakeAmount}`);
        assert.equal(deal.currentStakedAmount, "0", "no stake remaining after both unstake");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });
  },
};
