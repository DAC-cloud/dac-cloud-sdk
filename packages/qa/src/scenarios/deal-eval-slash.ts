import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, setupNativeDacWithDeal} from "./fixtures/index.js";

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
  },
};
