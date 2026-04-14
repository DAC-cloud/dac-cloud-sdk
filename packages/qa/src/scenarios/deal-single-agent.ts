import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {setupNativeDacWithDeal} from "./fixtures/index.js";

/**
 * Scenario: Single-Agent Deal — Full Slash
 *
 * Creates a deal with rewardCurve=[0] penaltyCurve=[1e18].
 * At 0 progress, evaluation produces a 100% slash → all stake burned → auto-close.
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

    // ── Evaluate deal ────────────────────────────────────────────

    // Advance past milestone timestamp (7 days)
    await h.advanceTime(86400 * 8);

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

    // ── Verify deal closed after full slash ───────────────────────

    await step(h, "verify-deal-closed", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after evaluation");
      if (deal) {
        assert.equal(deal.closed, true, "deal closed after full slash");
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
