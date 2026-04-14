import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, setupNativeDacWithDeal, transferErc20} from "./fixtures/index.js";

/**
 * Scenario: Deal Multi-Milestone — Sequential Evaluation
 *
 * Creates a deal with TWO milestones and THREE agents:
 * - Milestone 1: expectedReturn=1000, rewardPercentage=50%, timestamp=+7d
 * - Milestone 2: expectedReturn=3000, rewardPercentage=50%, timestamp=+14d
 *
 * Important: milestones share the same token, so the evaluator checks
 * `balanceOf(cell) / expectedReturn` for each. If progress >= SCALE (100%),
 * the milestone triggers immediately regardless of deadline. To test sequential
 * evaluation, milestone 2 needs a higher expectedReturn so the first deposit
 * doesn't accidentally satisfy both.
 *
 * Flow:
 * 1. Deposit 1200 tokens → milestone 1 sees 120% → reward (50%)
 * 2. Deposit 2000 more → total 3200 → milestone 2 sees 106% → reward (50%) → close
 *
 * Three agents (founder + agent1 + agent2) stake for maximum indexer diversity.
 */
export const dealMultiMilestoneScenario: Scenario = {
  name: "deal-multi-milestone",
  description: "Three agents, two milestones → sequential eval → cumulative close",
  tags: ["deal", "evaluation", "multi-milestone", "multi-agent"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert} = h;
    const milestone1Expected = "1000000000000000000000";  // 1000 tokens
    const milestone2Expected = "3000000000000000000000";  // 3000 tokens (higher — prevents early trigger)
    const deposit1 = "1200000000000000000000";            // 1200 tokens → 120% of milestone 1, only 40% of milestone 2
    const deposit2 = "2000000000000000000000";            // 2000 more → total 3200 → 106% of milestone 2

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Multi-Milestone Deal",
      rewardsLimit: "200000000000000000000000", // 200k to cover both milestones
      milestones: [
        {
          expectedReturn: milestone1Expected,
          rewardCurve: ["0"],
          penaltyCurve: ["0"],
          rewardPercentage: "500000000000000000", // 50% of reward share
          timestampDelta: 86400 * 7, // +7 days
        },
        {
          expectedReturn: milestone2Expected,
          rewardCurve: ["0"],
          penaltyCurve: ["0"],
          rewardPercentage: "500000000000000000", // remaining 50%
          timestampDelta: 86400 * 14, // +14 days
        },
      ],
      extraAgents: [
        {role: "agent1", mintAmount: "30000000000000000000000", stakeAmount: "8000000000000000000000"},
        {role: "agent2", mintAmount: "20000000000000000000000", stakeAmount: "3000000000000000000000"},
      ],
    });

    // ── Verify three stakers ─────────────────────────────────────

    await step(h, "verify-three-stakers", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal exists");

      if (deal) {
        h.log(`Pre-eval: stakerCount=${deal.stakerCount}, totalStaked=${deal.currentStakedAmount}`);
        assert.equal(Number(deal.stakerCount), 3, "three stakers");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Deposit for milestone 1 ──────────────────────────────────

    h.log(`Depositing ${deposit1} for milestone 1 (120% of m1, 40% of m2)...`);

    await step(h, "deposit-milestone-1", async () => {
      const txHash = await transferErc20(h, {
        token: ctx.treasuryToken,
        from: ctx.founderAddress,
        to: ctx.dealCell,
        amount: deposit1,
      });
      assert.defined(txHash, "transfer tx hash");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer"],
      };
    });

    // ── Evaluate milestone 1 ─────────────────────────────────────

    // Advance past milestone 1 — exact calculation
    const milestone1Ts = ctx.chainTimestamp + 86400 * 7;
    const currentTs1 = await getChainTimestamp(h);
    const neededAdvance1 = milestone1Ts - currentTs1 + 3600;
    await h.advanceTime(Math.max(neededAdvance1, 3600));

    await step(h, "evaluate-milestone-1", async () => {
      const args = [
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", h.config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "evaluate tx hash");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Verify deal still active after milestone 1 (50% converted) ─

    await step(h, "verify-after-milestone-1", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal after milestone 1");

      if (deal) {
        h.log(`After milestone 1: active=${deal.active}, closed=${deal.closed}, evalCount=${deal.totalEvaluationCount}, rewardsAllocated=${deal.rewardsAllocated}`);
        assert.equal(deal.active, true, "deal still active (50% converted)");
        assert.equal(deal.closed, false, "deal not closed yet");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Deposit for milestone 2 ──────────────────────────────────

    h.log(`Depositing ${deposit2} for milestone 2 (total will be 3200 → 106% of m2)...`);

    await step(h, "deposit-milestone-2", async () => {
      const txHash = await transferErc20(h, {
        token: ctx.treasuryToken,
        from: ctx.founderAddress,
        to: ctx.dealCell,
        amount: deposit2,
      });
      assert.defined(txHash, "transfer tx hash");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer"],
      };
    });

    // ── Evaluate milestone 2 ─────────────────────────────────────

    // Advance past milestone 2 — exact calculation
    const milestone2Ts = ctx.chainTimestamp + 86400 * 14;
    const currentTs2 = await getChainTimestamp(h);
    const neededAdvance2 = milestone2Ts - currentTs2 + 3600;
    await h.advanceTime(Math.max(neededAdvance2, 3600));

    await step(h, "evaluate-milestone-2", async () => {
      const args = [
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", h.config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "evaluate tx hash");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Verify deal closed after milestone 2 (100% converted) ────

    await step(h, "verify-closed-after-milestone-2", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal after milestone 2");

      if (deal) {
        h.log(`After milestone 2: active=${deal.active}, closed=${deal.closed}, evalCount=${deal.totalEvaluationCount}`);
        assert.equal(deal.active, false, "deal closed (100% converted)");
        assert.equal(deal.closed, true, "deal closed flag set");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Agent1 claims rewards ────────────────────────────────────

    await step(h, "agent1-claim-rewards", async () => {
      const args = [
        "deal", "claim",
        "--deal-address", ctx.dealAddress,
        "--config", h.config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cliAs("agent1", args);
      assert.defined(cli.data.txHash, "agent1 claim tx hash");
      return {cli, command: ["dac [as agent1]", ...args]};
    });

    await h.syncIndexer();

    // ── Verify rewards distributed ───────────────────────────────

    await step(h, "verify-rewards", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal after claims");

      if (deal) {
        h.log(`Rewards: allocated=${deal.totalRewardAllocatedAmount}, claimed=${deal.totalRewardClaimedAmount}`);
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });
  },
};
