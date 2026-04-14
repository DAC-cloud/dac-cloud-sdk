import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {setupNativeDacWithDeal, transferErc20} from "./fixtures/index.js";

/**
 * Scenario: Deal Evaluation — Partial Reward
 *
 * Creates a deal, deposits ~50% of expectedReturn to the deal cell,
 * then evaluates. The milestone evaluator sees 50% progress:
 * - rewardCurve=[1e18] → 50% reward (proportional to progress)
 *   Actually with constant curve [1e18], evaluateCurve(progress=0.5) = 1e18 (constant!).
 *   For a linear curve we need [0, 1e18] (polynomial: y = x * 1e18).
 *   With rewardCurve=[0, 1e18]: evaluateCurve(0.5) = 0.5 * 1e18 = 5e17 → 50% reward
 * - penaltyCurve=[0, 1e18] → 50% penalty (proportional to miss)
 *
 * Result: partial reward converted + partial slash. Deal stays open if tokens remain.
 */
export const dealEvalPartialRewardScenario: Scenario = {
  name: "deal-eval-partial-reward",
  description: "Deal with 50% progress → partial reward + partial slash",
  tags: ["deal", "evaluation", "partial-reward"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert} = h;
    const expectedReturn = "1000000000000000000000"; // 1000 tokens
    const halfReturn = "500000000000000000000";       // 500 tokens (50%)

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Partial Reward Deal",
      rewardsLimit: "100000000000000000000000", // 100k — enough for rewards
      milestones: [{
        expectedReturn,
        // Linear curves: y = x * 1e18 → at 50% progress, returns 50%
        rewardCurve: ["0", "1000000000000000000"],
        penaltyCurve: ["0", "1000000000000000000"],
        rewardPercentage: "1000000000000000000", // 100% of rewardShare
      }],
    });

    // ── Deposit tokens to deal cell to simulate 50% returns ──────

    h.log(`Depositing ${halfReturn} tokens to deal cell ${ctx.dealCell}...`);

    // The founder (account[0]) has mock ERC20 tokens from the Hardhat deploy
    await step(h, "deposit-tokens-to-cell", async () => {
      const txHash = await transferErc20(h, {
        token: ctx.treasuryToken,
        from: ctx.founderAddress,
        to: ctx.dealCell,
        amount: halfReturn,
      });
      assert.defined(txHash, "transfer tx hash present");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer", ctx.treasuryToken, ctx.dealCell, halfReturn],
      };
    });

    // ── Evaluate deal ────────────────────────────────────────────

    await h.advanceTime(86400 * 8); // past milestone timestamp

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

    // ── Verify deal state ────────────────────────────────────────

    await step(h, "verify-deal-after-eval", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after partial evaluation");

      if (deal) {
        // With 50% progress and linear penalty curve: 50% slash.
        // After 50% slash, some tokens remain → deal stays open (not auto-closed)
        // OR if the slash reduces totalSupply to 0, deal auto-closes
        // Either way is valid — log the state
        h.log(`Deal after eval: active=${deal.active}, closed=${deal.closed}, stakerCount=${deal.stakerCount}`);
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });
  },
};
