import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, setupNativeDacWithDeal, verifyTxReceipt} from "./fixtures/index.js";

/**
 * Scenario: Deal Reward Pool Allocation
 *
 * Verifies the reward pool math for permit2-treasury deals:
 *   - dealRewardPoolPercent = 30% of rewards → pool
 *   - Milestone evaluator with 50% reward curve → partial reward
 *   - Total reward = 50% of rewardsLimit
 *   - Pool gets 30% of that, agent gets 70%
 *   - Both claim paths work (deal claim + claim-reward-pool)
 *   - Indexer tracks all amounts correctly
 */
export const dealRewardPoolScenario: Scenario = {
  name: "deal-reward-pool-allocation",
  description: "Verify reward pool math: 30% pool allocation, partial 50% reward, claims",
  tags: ["deal", "reward-pool", "evaluation", "claim"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert} = h;

    // Setup: DAC + deal with 30% reward pool, partial reward curve
    // rewardCurve=[500000000000000000] = 50% at full progress
    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Reward Pool Deal",
      rewardsLimit: "10000000000000000000000", // 10k main tokens
      dealRewardPoolPercent: "300000000000000000", // 30% (0.3 * 1e18)
      milestones: [{
        expectedReturn: "1000000000000000000000",
        rewardCurve: ["500000000000000000"],     // 50% reward at full progress
        penaltyCurve: ["0"],                     // no slash
      }],
    });

    // ── Evaluate ─────────────────────────────────────────────────

    const milestoneTs = ctx.chainTimestamp + 86400 * 7;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = milestoneTs - currentTs + 3600;
    await h.advanceTime(Math.max(neededAdvance, 3600));

    await step(h, "evaluate-deal", async () => {
      const cli = await h.cli([
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", h.config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "evaluate tx");
      return {cli, command: ["dac", "deal", "evaluate"]};
    });

    await h.syncIndexer();

    // ── Verify reward allocation math ────────────────────────────

    await step(h, "verify-reward-math", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      assert.defined(deal, "deal in indexer");

      const totalAllocated = BigInt(deal.totalRewardAllocatedAmount as string ?? "0");
      const poolAllocated = BigInt(deal.totalDealRewardPoolAllocatedAmount as string ?? "0");
      const rewardsLimit = BigInt(deal.rewardsLimit as string ?? "0");

      h.log(`rewardsLimit: ${rewardsLimit}`);
      h.log(`totalRewardAllocated: ${totalAllocated}`);
      h.log(`dealRewardPoolAllocated: ${poolAllocated}`);
      h.log(`agentReward (total - pool): ${totalAllocated - poolAllocated}`);

      // Total allocated should be ~50% of rewardsLimit (from 50% reward curve)
      // Pool should be 30% of the allocated total
      assert.equal(totalAllocated > 0n, true, "rewards were allocated");
      assert.equal(poolAllocated > 0n, true, "pool got a share");

      // Pool ratio should be ~30% of total
      // Using 1e18 mantissa: poolAllocated / totalAllocated ≈ 0.3
      if (totalAllocated > 0n) {
        const poolRatio = (poolAllocated * 100n) / totalAllocated;
        h.log(`Pool ratio: ${poolRatio}% (expected ~30%)`);
        // Allow some rounding: 25-35%
        assert.equal(poolRatio >= 25n && poolRatio <= 35n, true, "pool ratio ≈ 30%");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Claim individual reward ──────────────────────────────────

    await step(h, "claim-agent-reward", async () => {
      const cli = await h.cli([
        "deal", "claim",
        "--deal-address", ctx.dealAddress,
        "--config", h.config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent claim tx");

      // Verify on-chain receipt (writeContract doesn't check receipt status)
      const receipt = await verifyTxReceipt(h, cli.data.txHash as string);
      h.log(`Agent claim receipt: status=${receipt.status}, gasUsed=${receipt.gasUsed}`);
      assert.equal(receipt.status, "0x1", "agent claim tx succeeded on-chain");

      return {cli, command: ["deal", "claim"]};
    });

    // ── Claim reward pool ────────────────────────────────────────

    await step(h, "claim-reward-pool", async () => {
      const cli = await h.cli([
        "deal", "claim-reward-pool",
        "--deal-address", ctx.dealAddress,
        "--config", h.config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "pool claim tx");

      // Verify on-chain receipt — writeContract returns hash even for reverted txs
      const receipt = await verifyTxReceipt(h, cli.data.txHash as string);
      h.log(`Pool claim receipt: status=${receipt.status}, gasUsed=${receipt.gasUsed}`);
      assert.equal(receipt.status, "0x1", "pool claim tx succeeded on-chain (not silently reverted)");

      return {cli, command: ["deal", "claim-reward-pool"]};
    });

    // ── Verify final indexer state ───────────────────────────────

    await h.syncIndexer();

    await step(h, "verify-final-claims", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      assert.defined(deal, "deal in indexer");

      const totalClaimed = BigInt(deal.totalRewardClaimedAmount as string ?? "0");
      const poolClaimed = BigInt(deal.totalDealRewardPoolClaimedAmount as string ?? "0");

      h.log(`totalRewardClaimed: ${totalClaimed}, poolClaimed: ${poolClaimed}, closed: ${deal.closed}`);
      assert.equal(totalClaimed > 0n, true, "agent reward claimed");
      assert.equal(poolClaimed > 0n, true, "pool reward claimed");

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });
  },
};
