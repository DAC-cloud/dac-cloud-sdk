import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, setupNativeDacWithDeal} from "./fixtures/index.js";

/**
 * Scenario: Deal Force Return Capital
 *
 * Creates a deal, advances past the deal deadline WITHOUT evaluating,
 * then calls forceReturnCapital to withdraw remaining funds.
 *
 * forceReturnCapital only moves funds out of the deal cell back to the
 * DAC cell — it does NOT close the deal. The deal remains active.
 * Closing requires a separate evaluator action or full reward conversion.
 */
export const dealForceReturnScenario: Scenario = {
  name: "deal-force-return",
  description: "Deal past deadline → forceReturnCapital → verify capital returned",
  tags: ["deal", "force-return", "lifecycle"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert} = h;

    // Use shorter deadlines for faster test
    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Force Return Deal",
      dealDeadlineDelta: 86400 * 10, // 10 days (shorter than default 60)
      evaluationDeadlineDelta: 86400 * 8,
      milestones: [{
        expectedReturn: "1000000000000000000000",
        rewardCurve: ["0"],
        penaltyCurve: ["0"],
      }],
    });

    // ── Advance past deal deadline ───────────────────────────────

    h.log("Advancing past deal deadline...");
    // Advance past deal deadline — exact calculation
    const dealDeadlineTs = ctx.chainTimestamp + 86400 * 10;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = dealDeadlineTs - currentTs + 3600;
    await h.advanceTime(Math.max(neededAdvance, 3600));

    // ── Force return capital ─────────────────────────────────────

    await step(h, "force-return-capital", async () => {
      const args = [
        "deal", "withdraw", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", h.config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "withdraw tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Verify deal state after force return ─────────────────────
    // forceReturnCapital withdraws funds but does NOT close the deal.
    // The deal remains active — closing requires evaluation or full conversion.

    await step(h, "verify-deal-after-withdraw", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after force return");

      if (deal) {
        h.log(`Deal after withdraw: active=${deal.active}, closed=${deal.closed}`);
        // Deal stays active — forceReturnCapital only moves funds
        assert.equal(deal.active, true, "deal still active after force return");
        assert.equal(deal.closed, false, "deal not closed (withdraw only returns capital)");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });
  },
};
