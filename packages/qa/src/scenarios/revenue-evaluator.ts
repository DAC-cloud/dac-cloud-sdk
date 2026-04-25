import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  getChainTimestamp,
  mintMockToken,
  proposeVoteExecute,
  dealProposeVoteExecute,
  resolveUnderlyingToken,
  verifyDealAccountingInvariants,
} from "./fixtures/index.js";

/**
 * Scenario: Revenue Evaluator Lifecycle
 *
 * Tests the revenue-based evaluator across evaluation cycles.
 * Revenue is measured via `getReturnedCapital(token)` on the deal cell,
 * which is updated when the treasury returns capital via `return-capital`
 * proposals. So the flow is:
 *   1. Deal funded → treasury holds tokens
 *   2. Staked agents propose `return-capital` → treasury sends tokens back
 *      through deal → deal cell, updating returnedCapital
 *   3. Evaluator reads returnedCapital as "revenue"
 *
 * Contract rule: once a deal is closed (e.g. after a penalty slash that
 * reduces totalSupply to 0), no further evaluations are possible.
 *
 * Cycles:
 *   Cycle 1: Revenue returned → reward unlocked
 *   Cycle 2: No return (missed) → within grace, no penalty
 *   Cycle 3: No return again → penalty applied (may close deal)
 *   If deal still open after cycle 3:
 *     Cycle 4: Revenue returned → recovery
 *
 * After cycles complete: claim rewards, verify accounting invariants.
 */
export const revenueEvaluatorScenario: Scenario = {
  name: "revenue-evaluator-lifecycle",
  description: "Revenue evaluator: cycles with revenue returns, misses, penalties, and optional recovery",
  tags: ["deal", "revenue-evaluator", "evaluation", "cycles", "penalty"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    if (!founderWallet) throw new Error("founder wallet required");

    const underlyingToken = await resolveUnderlyingToken(h);
    await mintMockToken(h, {token: underlyingToken, to: founderWallet.address, amount: "1000000000000000000000000"});

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: SETUP — DAC + funded deal with revenue evaluator
    // ══════════════════════════════════════════════════════════════

    const createCli = await h.cli([
      "create",
      "--name", "Revenue Eval DAC",
      "--description", "QA revenue evaluator testing",
      "--symbol", "REV",
      "--max-supply", "10000000000000000000000000",
      "--default-quorum", "50",
      "--allocation", "1000000000000000000000000",
      "--treasury-token", underlyingToken,
      "--commitment", "0",
      "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);
    const dacAddress = createCli.data.dac as string;

    await h.cli(["join", "--dac", dacAddress, "--auto-approve", "--config", config.configPath, "--pretty-print"]);
    await h.cli(["delegate", "--delegatee", founderWallet.address, "--dac", dacAddress, "--config", config.configPath, "--pretty-print"]);
    await h.syncIndexer();

    await proposeVoteExecute(h, dacAddress, [
      "propose", "mint-agent-tokens", "100000000000000000000000", founderWallet.address,
    ]);
    await h.syncIndexer();

    // Deposit underlying to DAC treasury (needed for deal funding)
    h.log("Depositing underlying to DAC treasury...");
    await h.cli([
      "deposit-treasury", "--token", underlyingToken,
      "--amount", "10000000000000000000000", // 10k
      "--dac", dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    const chainTimestamp = await getChainTimestamp(h);
    const cycleDuration = 3600;
    const revenueTarget = "1000000000000000000000"; // 1k per cycle target

    const dealConfig = {
      dealKind: "permit2-treasury",
      name: "Revenue Eval Deal",
      description: "Revenue evaluator QA deal",
      linkHash: "seed://qa-revenue-eval",
      fundingToken: underlyingToken,
      fundingAmount: "5000000000000000000000", // 5k funding → goes to treasury on approval
      rewardsLimit: "100000000000000000000000",
      dealRewardPoolPercent: "0",
      approveDeadline: String(chainTimestamp + 10000), // after governance completes (~8000s)
      evaluationDeadline: String(chainTimestamp + 86400 * 60),
      dealDeadline: String(chainTimestamp + 86400 * 90),
      dealConfig: {},
      evaluatorSelector: "revenue-evaluator",
      evaluatorConfig: {
        rewardShare: "1000000000000000000",
        schedule: {
          token: underlyingToken,
          duration: String(cycleDuration),
          revenueProjectionMode: 0,
          revenueProjection: revenueTarget,
          curveCoeffs: ["0", "1000000000000000000"],      // linear: y = x
          requirementCurveCoeffs: ["1000000000000000000"], // constant target
          maxCycleUnlockPercent: "250000000000000000",     // 25% per cycle
          minCycleRevenuePercent: "500000000000000000",    // 50% min to not miss
          graceCycles: "1",
          penaltyPerMiss: "200000000000000000",            // 20% penalty
          evaluationStart: String(chainTimestamp + 12000), // starts AFTER approveDeadline so cycles don't accumulate during time-advance
          autoClose: false,
        },
      },
      agentsLimit: "0",
      minimalStake: "0",
    };

    const dealConfigPath = join(tmpdir(), `qa-revenue-deal-${Date.now()}.json`);
    writeFileSync(dealConfigPath, JSON.stringify(dealConfig, null, 2));

    const dealCli = await h.cli([
      "deal", "create", dealConfigPath, "--dac", dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    const dealAddress = dealCli.data.dealAddress as string;
    const dealCell = dealCli.data.dealCell as string;
    const dealNumericId = String(dealCli.data.dealId ?? "");
    const dealProposalId = String(dealCli.data.dacProposalId ?? "");
    h.log(`Revenue deal: address=${dealAddress}, cell=${dealCell}`);

    await h.syncIndexer();
    await h.cli([
      "deal", "stake", "10000000000000000000000",
      "--deal-address", dealCell, "--dac", dacAddress, "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);

    await h.advanceTime(10);
    await h.cli(["vote", "proposal", dealProposalId, "true", "--dac", dacAddress, "--config", config.configPath, "--pretty-print"]);
    await h.advanceTime(3700);
    await h.cli(["execute", dealProposalId, "--dac", dacAddress, "--config", config.configPath, "--pretty-print"]);
    await h.syncIndexer();
    // Treasury now has 5k underlying from the deal funding

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: EVALUATION CYCLES
    // ══════════════════════════════════════════════════════════════

    // Enable early returns so return-capital works before deal deadline
    h.log("Enabling early returns on the deal...");
    await dealProposeVoteExecute(h, dealAddress, [
      "deal", "propose", "toggle-early-returns", "true",
    ]);

    // Advance past approveDeadline (10000) + evaluationStart (12000)
    const evalStartTs = chainTimestamp + 12000;
    const nowForStart = await getChainTimestamp(h);
    if (nowForStart < evalStartTs) {
      const jumpNeeded = evalStartTs - nowForStart + 60;
      h.log(`Advancing ${jumpNeeded}s past evaluation start...`);
      await h.advanceTime(jumpNeeded);
    }

    // ── Cycle 1: Return capital as "revenue" → reward ─────────────
    h.log("Cycle 1: Returning capital as revenue...");
    await dealProposeVoteExecute(h, dealAddress, [
      "deal", "propose", "return-capital", underlyingToken, revenueTarget,
    ]);

    await h.advanceTime(cycleDuration + 60);

    await step(h, "evaluate-cycle-1", async () => {
      const cli = await h.cli([
        "deal", "evaluate", "--deal-id", dealNumericId, "--dac", dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "cycle 1 evaluate tx");
      return {cli, command: ["deal", "evaluate"]};
    });

    await h.syncIndexer();
    await step(h, "verify-cycle-1", async () => {
      const cli = await h.dealView("deal", ["--deal-address", dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      const allocated = BigInt(deal.totalRewardAllocatedAmount as string ?? "0");
      h.log(`After cycle 1: rewardsAllocated=${allocated}, evals=${deal.totalEvaluationCount}, closed=${deal.closed}`);
      assert.equal(allocated > 0n, true, "rewards allocated after cycle 1");
      assert.equal(deal.closed, false, "deal still open after cycle 1");

      const posCli = await h.dealView("positions", ["--deal-address", dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>> | undefined;
      if (positions) {
        for (const p of positions) {
          h.log(`  position: accountId=${p.accountId}, staked=${p.currentStakedAmount}, slashed=${p.totalSlashedAmount}`);
        }
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: {deal, positions} as Record<string, unknown>};
    });

    // ── Cycle 2: Miss (no return) → within grace ──────────────────
    h.log("Cycle 2: No revenue return (miss, within grace)...");
    await h.advanceTime(cycleDuration + 60);

    await step(h, "evaluate-cycle-2-miss", async () => {
      const cli = await h.cli([
        "deal", "evaluate", "--deal-id", dealNumericId, "--dac", dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "cycle 2 evaluate tx");
      return {cli, command: ["deal", "evaluate"]};
    });

    await h.syncIndexer();
    await step(h, "verify-cycle-2", async () => {
      const cli = await h.dealView("deal", ["--deal-address", dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      h.log(`After cycle 2 (miss): evals=${deal.totalEvaluationCount}, closed=${deal.closed}, slashed=${deal.totalSlashedStakeAmount}`);
      assert.equal(deal.closed, false, "deal still open after 1 miss (within grace)");
      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Cycle 3: Miss again → penalty applied ─────────────────────
    h.log("Cycle 3: No revenue again (penalty expected)...");
    await h.advanceTime(cycleDuration + 60);

    await step(h, "evaluate-cycle-3-penalty", async () => {
      const cli = await h.cli([
        "deal", "evaluate", "--deal-id", dealNumericId, "--dac", dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "cycle 3 evaluate tx");
      return {cli, command: ["deal", "evaluate"]};
    });

    await h.syncIndexer();

    let dealClosedAfterPenalty = false;
    await step(h, "verify-cycle-3", async () => {
      const cli = await h.dealView("deal", ["--deal-address", dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      const slashed = BigInt(deal.totalSlashedStakeAmount as string ?? "0");
      dealClosedAfterPenalty = deal.closed === true;
      h.log(`After cycle 3 (penalty): slashed=${slashed}, evals=${deal.totalEvaluationCount}, closed=${deal.closed}, active=${deal.active}`);
      assert.equal(slashed > 0n, true, "stake slashed after penalty");

      const posCli = await h.dealView("positions", ["--deal-address", dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>> | undefined;
      if (positions) {
        for (const p of positions) {
          h.log(`  position: accountId=${p.accountId}, staked=${p.currentStakedAmount}, slashed=${p.totalSlashedAmount}, released=${p.totalReleasedAmount}`);
        }
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: {deal, positions} as Record<string, unknown>};
    });

    // ── Cycle 4: Conditional — only if deal is still open ─────────
    // Contract rule: once closed, no more evaluations are possible.
    if (dealClosedAfterPenalty) {
      h.log("Deal closed after penalty — skipping cycle 4 (contract prevents further evaluations).");

      // Verify that attempting to evaluate a closed deal fails
      await step(h, "verify-closed-deal-no-eval", async () => {
        const cli = await h.cli([
          "deal", "evaluate", "--deal-id", dealNumericId, "--dac", dacAddress,
          "--config", config.configPath, "--pretty-print",
        ], {allowFailure: true});
        h.log(`Evaluate closed deal: exitCode=${cli.exitCode}`);
        assert.equal(cli.exitCode !== 0, true, "evaluation of closed deal should fail");
        return {cli, command: ["deal", "evaluate"]};
      });
    } else {
      h.log("Cycle 4: Returning capital as revenue (recovery)...");
      await dealProposeVoteExecute(h, dealAddress, [
        "deal", "propose", "return-capital", underlyingToken, revenueTarget,
      ]);

      await h.advanceTime(cycleDuration + 60);

      await step(h, "evaluate-cycle-4-recovery", async () => {
        const cli = await h.cli([
          "deal", "evaluate", "--deal-id", dealNumericId, "--dac", dacAddress,
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.defined(cli.data.txHash, "cycle 4 evaluate tx");
        return {cli, command: ["deal", "evaluate"]};
      });

      await h.syncIndexer();
      await step(h, "verify-cycle-4", async () => {
        const cli = await h.dealView("deal", ["--deal-address", dealAddress]);
        const deal = cli.data.deal as Record<string, unknown>;
        const allocated = BigInt(deal.totalRewardAllocatedAmount as string ?? "0");
        h.log(`After cycle 4 (recovery): rewardsAllocated=${allocated}, evals=${deal.totalEvaluationCount}`);
        return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
      });
    }

    // ── Claim rewards ────────────────────────────────────────────
    await step(h, "claim-rewards", async () => {
      const cli = await h.cli([
        "deal", "claim", "--deal-address", dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "claim tx");
      return {cli, command: ["deal", "claim"]};
    });

    // ── Final verification + accounting invariants ───────────────
    await h.syncIndexer();
    await step(h, "verify-final", async () => {
      const cli = await h.dealView("deal", ["--deal-address", dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      const totalClaimed = BigInt(deal.totalRewardClaimedAmount as string ?? "0");
      const totalAllocated = BigInt(deal.totalRewardAllocatedAmount as string ?? "0");
      const totalSlashed = BigInt(deal.totalSlashedStakeAmount as string ?? "0");
      const evalCount = Number(deal.totalEvaluationCount ?? 0);
      h.log(`Final: evals=${evalCount}, allocated=${totalAllocated}, claimed=${totalClaimed}, slashed=${totalSlashed}, closed=${deal.closed}`);

      // At minimum 3 cycles if deal closed after penalty, 4 if recovery happened
      const minCycles = dealClosedAfterPenalty ? 3 : 4;
      assert.gte(evalCount, minCycles, `at least ${minCycles} evaluation cycles`);
      assert.equal(totalClaimed > 0n, true, "rewards claimed");
      assert.equal(totalClaimed <= totalAllocated, true, "claimed <= allocated");

      // Per-position snapshot
      const posCli = await h.dealView("positions", ["--deal-address", dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>> | undefined;
      if (positions) {
        for (const p of positions) {
          h.log(`  final position: accountId=${p.accountId}, staked=${p.currentStakedAmount}, slashed=${p.totalSlashedAmount}, claimed=${p.totalClaimedMainTokenAmount}`);
        }
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: {deal, positions} as Record<string, unknown>};
    });

    await step(h, "verify-accounting-invariants", async () => {
      const {deal, positions} = await verifyDealAccountingInvariants(h, dealAddress);
      return {
        cli: {data: {action: "accounting-check"}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["accounting-invariants"],
        indexerSnapshot: {deal, positions} as Record<string, unknown>,
      };
    });
  },
};
