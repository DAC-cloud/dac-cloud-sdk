import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, setupNativeDacWithDeal, transferErc20, verifyDealAccountingInvariants} from "./fixtures/index.js";

/**
 * Scenario: Deal Evaluation — Full Reward + Claim
 *
 * Creates a deal, deposits >= expectedReturn to the deal cell,
 * then evaluates. The milestone evaluator sees 100% progress:
 * - Progress >= SCALE → full reward (rewardPercentage = 100%)
 * - No penalty (progress met)
 * - rewardShare=100% + full reward → rewardsConvertedPct hits SCALE → implicit close
 *
 * After evaluation, the staker claims their rewards.
 */
export const dealEvalFullRewardScenario: Scenario = {
  name: "deal-eval-full-reward",
  description: "Deal with 100% progress → full reward → claim",
  tags: ["deal", "evaluation", "full-reward", "claim"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert} = h;
    const expectedReturn = "1000000000000000000000"; // 1000 tokens
    const depositAmount = "1200000000000000000000";   // 1200 tokens (120% to ensure >= expected)

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Full Reward Deal",
      rewardsLimit: "100000000000000000000000", // 100k
      milestones: [{
        expectedReturn,
        // Curves don't matter for full reward — progress >= SCALE takes the success branch
        rewardCurve: ["0"],
        penaltyCurve: ["0"],
        rewardPercentage: "1000000000000000000", // 100%
      }],
    });

    // ── Deposit tokens to deal cell to simulate full returns ─────

    h.log(`Depositing ${depositAmount} tokens to deal cell ${ctx.dealCell}...`);

    await step(h, "deposit-tokens-to-cell", async () => {
      const txHash = await transferErc20(h, {
        token: ctx.treasuryToken,
        from: ctx.founderAddress,
        to: ctx.dealCell,
        amount: depositAmount,
      });
      assert.defined(txHash, "transfer tx hash present");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer", ctx.treasuryToken, ctx.dealCell, depositAmount],
      };
    });

    // ── Evaluate deal ────────────────────────────────────────────

    // Advance past milestone — exact calculation avoids timing flakiness
    const milestoneTs = ctx.chainTimestamp + 86400 * 7;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = milestoneTs - currentTs + 3600;
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

    // ── Verify deal state after full reward ───────────────────────

    await step(h, "verify-deal-after-eval", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after evaluation");

      if (deal) {
        // With 100% progress + rewardShare=100%, the full reward converts all shares,
        // pushing rewardsConvertedPct to SCALE → implicit close via _performTransformation
        h.log(`Deal after eval: active=${deal.active}, closed=${deal.closed}`);
        assert.equal(deal.active, false, "deal closed after full reward (100% converted)");
        assert.equal(deal.closed, true, "deal closed (rewardsConvertedPct == SCALE)");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Claim rewards ────────────────────────────────────────────

    await step(h, "claim-rewards", async () => {
      const args = [
        "deal", "claim",
        "--deal", ctx.dealAddress,
        "--config", h.config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "claim tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Verify rewards claimed in indexer ─────────────────────────

    await step(h, "verify-rewards-claimed", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after claim");

      if (deal) {
        h.log(`After claim: allocated=${deal.totalRewardAllocatedAmount}, claimed=${deal.totalRewardClaimedAmount}`);
        assert.equal(BigInt(deal.totalRewardAllocatedAmount as string) > 0n, true, "rewards allocated > 0");
        assert.equal(BigInt(deal.totalRewardClaimedAmount as string) > 0n, true, "rewards claimed > 0");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Verify agent position shows claimed rewards ──────────────

    await step(h, "verify-agent-position-after-claim", async () => {
      const cli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = cli.data.positions as Array<Record<string, unknown>> | undefined;
      assert.defined(positions, "agent positions");

      if (positions && positions.length > 0) {
        const pos = positions[0];
        h.log(`Agent position: claimed=${pos.totalClaimedMainTokenAmount}`);
        assert.equal(BigInt(pos.totalClaimedMainTokenAmount as string) > 0n, true, "agent claimed main tokens > 0");
      }

      return {cli, command: ["deal", "view", "positions"], indexerSnapshot: {positions} as Record<string, unknown>};
    });

    // ── Cross-validate accounting invariants ─────────────────────

    await step(h, "verify-accounting-invariants", async () => {
      const {deal, positions} = await verifyDealAccountingInvariants(h, ctx.dealAddress);
      return {
        cli: {data: {action: "accounting-check"}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["accounting-invariants"],
        indexerSnapshot: {deal, positions} as Record<string, unknown>,
      };
    });
  },
};
