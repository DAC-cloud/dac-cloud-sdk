import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, setupNativeDacWithDeal, transferErc20} from "./fixtures/index.js";

/**
 * Scenario: Deal Evaluation — Milestone Extension
 *
 * Creates a deal with a milestone that has extension + minPercentGrace.
 * At first evaluation: partial progress above grace threshold → extension granted.
 * After extension: deposits more tokens → second evaluation with full progress.
 *
 * Tests the grace/extension path in MilestoneBasedEvaluator:
 * - progress > minPercentGrace AND extension > 0 → deadline extended (no reward/penalty)
 * - Second eval after extended deadline + full deposit → full reward → close
 */
export const dealEvalExtensionScenario: Scenario = {
  name: "deal-eval-extension",
  description: "Partial progress → milestone extension → full reward on re-eval",
  tags: ["deal", "evaluation", "extension", "milestone"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert} = h;
    const expectedReturn = "1000000000000000000000"; // 1000 tokens
    const partialDeposit = "600000000000000000000";   // 600 tokens (60% progress)
    const topUpDeposit = "600000000000000000000";     // 600 more → total 1200 (120%)

    const extensionDelta = 86400 * 7; // 7-day extension

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Extension Deal",
      rewardsLimit: "100000000000000000000000",
      milestones: [{
        expectedReturn,
        rewardCurve: ["0"],
        penaltyCurve: ["0", "1000000000000000000"], // linear penalty
        rewardPercentage: "1000000000000000000",    // 100%
        minPercentGrace: "500000000000000000",      // 50% — progress must exceed this for extension
        extension: String(extensionDelta),           // 7-day extension
      }],
    });

    // The milestone timestamp is ctx.chainTimestamp + 7 days (default)
    const milestoneTs = ctx.chainTimestamp + 86400 * 7;
    const extendedTs = milestoneTs + extensionDelta; // after extension: +14 days from chainTimestamp

    // ── Deposit 60% to simulate partial progress ────────────────

    h.log(`Depositing ${partialDeposit} tokens (60% of expected)...`);

    await step(h, "deposit-partial", async () => {
      const txHash = await transferErc20(h, {
        token: ctx.treasuryToken,
        from: ctx.founderAddress,
        to: ctx.dealCell,
        amount: partialDeposit,
      });
      assert.defined(txHash, "transfer tx hash");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer", ctx.treasuryToken, ctx.dealCell, partialDeposit],
      };
    });

    // ── First evaluation: should trigger extension ──────────────

    // Advance past original milestone timestamp
    const ts1 = await getChainTimestamp(h);
    const neededAdvance1 = milestoneTs - ts1 + 3600; // 1 hour past milestone
    h.log(`Chain time: ${ts1}, milestone: ${milestoneTs}, advancing ${neededAdvance1}s`);
    await h.advanceTime(neededAdvance1);

    await step(h, "evaluate-triggers-extension", async () => {
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

    // ── Verify deal still active (extension granted, not slashed) ─

    await step(h, "verify-deal-extended", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after extension eval");

      if (deal) {
        h.log(`After extension eval: active=${deal.active}, closed=${deal.closed}, evalCount=${deal.totalEvaluationCount}`);
        assert.equal(deal.active, true, "deal still active after extension");
        assert.equal(deal.closed, false, "deal not closed");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Top up deposit to exceed expectedReturn ─────────────────

    h.log(`Topping up ${topUpDeposit} tokens to exceed expected return...`);

    await step(h, "deposit-topup", async () => {
      const txHash = await transferErc20(h, {
        token: ctx.treasuryToken,
        from: ctx.founderAddress,
        to: ctx.dealCell,
        amount: topUpDeposit,
      });
      assert.defined(txHash, "transfer tx hash");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer", ctx.treasuryToken, ctx.dealCell, topUpDeposit],
      };
    });

    // ── Second evaluation: full reward → close ──────────────────

    // Advance past extended milestone timestamp
    const ts2 = await getChainTimestamp(h);
    const neededAdvance2 = extendedTs - ts2 + 3600; // 1 hour past extended deadline
    h.log(`Chain time: ${ts2}, extended milestone: ${extendedTs}, advancing ${neededAdvance2}s`);
    await h.advanceTime(Math.max(neededAdvance2, 3600));

    await step(h, "evaluate-after-extension", async () => {
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

    // ── Verify deal closed after full reward ─────────────────────

    await step(h, "verify-deal-closed-full-reward", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after second eval");

      if (deal) {
        h.log(`After second eval: active=${deal.active}, closed=${deal.closed}, evalCount=${deal.totalEvaluationCount}`);
        assert.equal(deal.active, false, "deal closed after full reward");
        assert.equal(deal.closed, true, "deal closed flag set");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });
  },
};
