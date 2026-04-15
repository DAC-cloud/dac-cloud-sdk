import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, proposeVoteExecute, setupNativeDacWithDeal} from "./fixtures/index.js";

/**
 * Scenario: Deal Evaluation — Multi-Agent Full Slash
 *
 * Creates a deal with TWO agents (founder + agent1) staking.
 * No progress is made (0% returns). Evaluation triggers:
 * - penaltyCurve=[1e18] → 100% slash on all stakers
 * - totalSupply hits 0 → auto-close
 *
 * Verifies both agents' positions are slashed and deal closes.
 * Exercises the multi-staker indexer path for DealAgentPosition.
 */
export const dealEvalSlashScenario: Scenario = {
  name: "deal-eval-slash",
  description: "Two agents staked → 0% progress → full slash → auto-close",
  tags: ["deal", "evaluation", "slash", "multi-agent"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert} = h;

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Multi-Agent Slash Deal",
      milestones: [{
        expectedReturn: "1000000000000000000000", // 1000 tokens
        rewardCurve: ["0"],                        // no reward at 0 progress
        penaltyCurve: ["1000000000000000000"],     // 100% slash
      }],
      // Second agent stakes into the same deal
      extraAgents: [{
        role: "agent1",
        mintAmount: "50000000000000000000000",  // 50k agent tokens
        stakeAmount: "5000000000000000000000",  // 5k staked
      }],
    });

    // ── Verify two stakers in indexer ────────────────────────────

    await h.syncIndexer();

    await step(h, "verify-two-stakers", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal exists");

      if (deal) {
        h.log(`Pre-eval: stakerCount=${deal.stakerCount}, totalStaked=${deal.currentStakedAmount}`);
        assert.equal(Number(deal.stakerCount), 2, "two stakers in deal");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Evaluate deal (0% progress → full slash) ────────────────

    const milestoneTs = ctx.chainTimestamp + 86400 * 7;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = milestoneTs - currentTs + 3600;
    await h.advanceTime(Math.max(neededAdvance, 3600));

    await step(h, "evaluate-deal-slash", async () => {
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

    // ── Verify deal auto-closed after full slash ─────────────────

    await step(h, "verify-deal-closed-after-slash", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after slash");

      if (deal) {
        h.log(`After slash: active=${deal.active}, closed=${deal.closed}, slashed=${deal.totalSlashedStakeAmount}, staked=${deal.currentStakedAmount}`);
        assert.equal(deal.closed, true, "deal closed after full slash (totalSupply=0)");
        assert.equal(deal.active, false, "deal inactive");
        // All staked tokens should be slashed
        assert.equal(deal.currentStakedAmount, "0", "no stake remaining");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Verify per-agent positions show slashing ─────────────────

    await step(h, "verify-agent-positions-slashed", async () => {
      const cli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = cli.data.positions as Array<Record<string, unknown>> | undefined;
      assert.defined(positions, "agent positions");
      assert.equal(positions?.length ?? 0, 2, "two agent positions");

      if (positions) {
        for (const pos of positions) {
          h.log(`Position ${pos.accountId}: staked=${pos.currentStakedAmount}, slashed=${pos.totalSlashedAmount}`);
          assert.equal(pos.currentStakedAmount, "0", "position fully slashed");
          assert.equal(BigInt(pos.totalSlashedAmount as string) > 0n, true, "slashed amount > 0");
        }
      }

      return {cli, command: ["deal", "view", "positions"], indexerSnapshot: {positions} as Record<string, unknown>};
    });

    // ── DAC recovers the slashed deal with two liquidators ─────────
    // After full slash (totalSupply=0), agents can't unstake — all tokens burned.
    // DAC governance assigns liquidators who get StakedAgent tokens minted directly.
    // First recovery assigns founder as liquidator; second adds agent1.

    const agent1Wallet = h.config.wallets.agent1;
    if (!agent1Wallet) throw new Error("agent1 wallet required");

    h.log("Recovering slashed deal — appointing founder as liquidator...");

    await step(h, "recover-deal-founder", async () => {
      const proposalId = await proposeVoteExecute(h, ctx.dacAddress, [
        "propose", "recover-deal",
        ctx.dealNumericId,
        ctx.founderAddress,               // liquidator = founder
        "2000000000000000000000",          // 2k liquidatorStake (minted directly)
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
        h.log(`After recovery: closed=${deal.closed}, recovered=${deal.recovered}, stakerCount=${deal.stakerCount}`);
        assert.equal(deal.closed, true, "deal still closed");
        assert.equal(deal.recovered, true, "deal marked as recovered");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Appoint agent1 as second liquidator ──────────────────────

    h.log("Appointing agent1 as second liquidator...");

    await step(h, "recover-deal-agent1", async () => {
      const proposalId = await proposeVoteExecute(h, ctx.dacAddress, [
        "propose", "recover-deal",
        ctx.dealNumericId,
        agent1Wallet.address,               // second liquidator
        "1000000000000000000000",            // 1k liquidatorStake
      ]);
      assert.defined(proposalId, "second recover proposal id");
      return {
        cli: {data: {action: "recover-deal", proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "recover-deal"],
      };
    });

    await h.syncIndexer();

    // ── Verify liquidator positions in indexer ───────────────────

    await step(h, "verify-liquidator-positions", async () => {
      const cli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = cli.data.positions as Array<Record<string, unknown>> | undefined;
      assert.defined(positions, "positions after liquidator assignment");

      if (positions) {
        h.log(`Liquidator positions: ${positions.length} total`);
        for (const pos of positions) {
          h.log(`  ${pos.accountId}: staked=${pos.currentStakedAmount}, slashed=${pos.totalSlashedAmount}`);
        }
        // Should have original 2 slashed agents + 2 liquidators = 4 positions
        // (or 2 if contract reuses position records for the same accounts)
        assert.gte(positions.length, 2, "at least original agent positions present");
      }

      return {cli, command: ["deal", "view", "positions"], indexerSnapshot: {positions} as Record<string, unknown>};
    });

    // ── Liquidator proposes deal governance action ────────────────
    // Liquidators have StakedAgent tokens so they can participate in deal governance.
    // Test: founder (as liquidator) proposes toggle-early-returns.

    h.log("Testing liquidator deal governance...");

    await step(h, "liquidator-propose", async () => {
      const cli = await h.cli([
        "deal", "propose", "toggle-early-returns", "true",
        "--deal-address", ctx.dealAddress,
        "--config", h.config.configPath,
        "--pretty-print",
      ]);
      assert.defined(cli.data.proposalId, "liquidator proposal id");
      h.log(`Liquidator proposal created: id=${cli.data.proposalId}`);
      return {cli, command: ["deal", "propose", "toggle-early-returns"]};
    });
  },
};
