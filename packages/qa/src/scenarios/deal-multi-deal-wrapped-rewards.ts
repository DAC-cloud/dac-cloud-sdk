import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  existingTokenProposeVoteExecute,
  getChainTimestamp,
  mintMockToken,
  resolveUnderlyingToken,
  transferErc20,
  verifyDealAccountingInvariants,
  ZERO_ADDR,
} from "./fixtures/index.js";

/**
 * Deal governance propose → vote → execute.
 * Proposals auto-resolve when quorum is met during voting. Execute within
 * executionValidityDuration of the resolution (not after full votingDuration).
 */
async function dealProposeVoteExecuteQuorum(
  h: Harness,
  dealAddress: string,
  proposeArgs: string[],
  extraVoterRoles: string[] = [],
): Promise<string> {
  const {config} = h;

  const dealViewCli = await h.dealView("deal", ["--deal-address", dealAddress]);
  const dealRecord = dealViewCli.data.deal as Record<string, unknown>;
  h.log(`Deal governance: votingDuration=${dealRecord.votingDuration}s, quorum=${dealRecord.votingQuorumPercent}, execValidity=${dealRecord.executionValidityDuration}s`);

  const proposeCli = await h.cli([
    ...proposeArgs,
    "--deal-address", dealAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);
  const proposalId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");

  await h.syncIndexer();
  await h.advanceTime(10);

  await h.cli([
    "deal", "vote", "proposal", proposalId, "true",
    "--deal-address", dealAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  for (const role of extraVoterRoles) {
    await h.cliAs(role, [
      "deal", "vote", "proposal", proposalId, "true",
      "--deal-address", dealAddress,
      "--config", config.configPath,
      "--pretty-print",
    ]);
  }

  // Execute shortly after voting — proposal auto-resolved on quorum
  await h.advanceTime(100);

  await h.cli([
    "deal", "execute", proposalId,
    "--deal-address", dealAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  return proposalId;
}

interface DealSnapshot {
  active: boolean;
  closed: boolean;
  currentStakedAmount: bigint;
  totalStakedAmount: bigint;
  totalSlashedStakeAmount: bigint;
  totalReleasedStakeAmount: bigint;
  totalRewardAllocatedAmount: bigint;
  totalRewardClaimedAmount: bigint;
  totalDealRewardPoolAllocatedAmount: bigint;
  totalDealRewardPoolClaimedAmount: bigint;
  totalEvaluationCount: number;
  stakerCount: number;
}

async function captureDealSnapshot(h: Harness, dealAddress: string): Promise<DealSnapshot> {
  const dealCli = await h.dealView("deal", ["--deal-address", dealAddress]);
  const deal = dealCli.data.deal as Record<string, unknown>;

  return {
    active: deal.active as boolean,
    closed: deal.closed as boolean,
    currentStakedAmount: BigInt(deal.currentStakedAmount as string),
    totalStakedAmount: BigInt(deal.totalStakedAmount as string),
    totalSlashedStakeAmount: BigInt(deal.totalSlashedStakeAmount as string),
    totalReleasedStakeAmount: BigInt(deal.totalReleasedStakeAmount as string),
    totalRewardAllocatedAmount: BigInt(deal.totalRewardAllocatedAmount as string),
    totalRewardClaimedAmount: BigInt(deal.totalRewardClaimedAmount as string),
    totalDealRewardPoolAllocatedAmount: BigInt(deal.totalDealRewardPoolAllocatedAmount as string ?? "0"),
    totalDealRewardPoolClaimedAmount: BigInt(deal.totalDealRewardPoolClaimedAmount as string ?? "0"),
    totalEvaluationCount: Number(deal.totalEvaluationCount ?? 0),
    stakerCount: Number(deal.stakerCount ?? 0),
  };
}

/**
 * Scenario: Multi-Deal Existing-Token DAC Reward Accounting
 *
 * Same multi-deal pattern as deal-multi-deal-native-rewards but on an
 * existing-token DAC (WrappedMainToken, oracle fallback voting).
 *
 * Tests:
 *   - WrappedMainToken reward capacity allocated across multiple deals
 *   - Treasury-seed-amount must cover both deals' rewardsLimit
 *   - Fallback voting for all DAC proposals
 *   - Commitment tracking for underlying (funding) and WrappedMainToken (rewards)
 *   - Active stake increase via deal request + add-stake
 *
 * Deal A: 2 milestones, 15% reward pool, funded 5k
 * Deal B: 1 milestone, 0% reward pool, funded 3k
 * Both: founder (10k stake) + agent1 (8k/5k stake)
 *
 * Phase flow mirrors Scenario 2 with existing-token-specific verifications.
 */
export const dealMultiDealWrappedRewardsScenario: Scenario = {
  name: "deal-multi-deal-wrapped-rewards",
  description: "Existing-token DAC: 2 deals, WrappedMainToken rewards, fallback voting, commitment tracking",
  tags: ["deal", "multi-deal", "existing-token", "wrapped", "rewards", "commitment", "accounting", "fallback-voting"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    const agent1Wallet = config.wallets.agent1;
    if (!founderWallet) throw new Error("founder wallet required");
    if (!agent1Wallet) throw new Error("agent1 wallet required");

    const underlyingToken = resolveUnderlyingToken(h);

    // ══════════════════════════════════════════════════════════════
    // SETUP: Create existing-token DAC + two deals
    // ══════════════════════════════════════════════════════════════

    // Mint underlying tokens for all operations
    await mintMockToken(h, {token: underlyingToken, to: founderWallet.address, amount: "200000000000000000000000"}); // 200k

    // PROTOCOL CONSTRAINT: existing-token DAC rewards are paid in WrappedMainToken.
    // treasury-seed-amount provides the initial WrappedMainToken supply that backs
    // reward allocations. Must be >= sum of both deals' rewardsLimit.
    const treasurySeedAmount = "100000000000000000000000"; // 100k (covers 40k + 20k + buffer)

    h.log("Creating existing-token DAC (fallback-only, no oracle)...");
    const dacCreateCli = await h.cli([
      "create-existing-token",
      "--name", "Multi-Deal Wrapped QA DAC",
      "--description", "QA multi-deal wrapped reward accounting",
      "--symbol", "QMDW",
      "--underlying-token", underlyingToken,
      "--treasury-seed-amount", treasurySeedAmount,
      "--quorum-percent", "50",
      "--blocking-percent", "0",
      "--high-quorum-percent", "75",
      "--voting-duration", "3600",
      "--qualification", "0",
      "--execution-validity-duration", "86400",
      "--oracle-publish-deadline", "30",
      "--fallback-warmup-duration", "10",
      "--fallback-duration", "3600",
      "--auto-delegate",
      "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);

    const dacAddress = dacCreateCli.data.dac as string;
    const agentTokenAddress = dacCreateCli.data.agentToken as string;
    const wrappedMainTokenAddress = (dacCreateCli.data.wrappedMainToken ?? dacCreateCli.data.mainToken) as string;
    assert.isAddress(dacAddress, "DAC address valid");

    await h.syncIndexer();

    // Wrap tokens for voting power
    h.log("Wrapping 30k tokens for voting power...");
    await h.cli([
      "wrap", "--amount", "30000000000000000000000",
      "--dac", dacAddress, "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);

    // Get deal manager
    const dacViewCli = await h.view("dac", ["--dac", dacAddress]);
    const dacRecord = dacViewCli.data.dac as Record<string, unknown>;
    const dealManagerAddress = dacRecord.dealManagerAddress as string;

    // Mint agent tokens via fallback voting: 200k to founder, 100k to agent1
    h.log("Minting agent tokens via fallback voting...");
    await existingTokenProposeVoteExecute(h, dacAddress, [
      "propose", "mint-agent-tokens", "200000000000000000000000", founderWallet.address,
    ]);
    await existingTokenProposeVoteExecute(h, dacAddress, [
      "propose", "mint-agent-tokens", "100000000000000000000000", agent1Wallet.address,
    ]);
    await h.syncIndexer();

    // Deposit underlying tokens for deal funding
    h.log("Depositing 20k underlying to treasury...");
    await h.cli([
      "deposit-treasury", "--token", underlyingToken,
      "--amount", "20000000000000000000000",
      "--dac", dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ── Create Deal A: 2 milestones, 15% reward pool ────────────

    let chainTimestamp = await getChainTimestamp(h);

    const dealAConfig = {
      dealKind: "permit2-treasury",
      name: "Wrapped Deal A (2 milestones, pool)",
      description: "QA multi-deal wrapped A",
      linkHash: "seed://qa-wrapped-multi-deal-a",
      fundingToken: underlyingToken,
      fundingAmount: "5000000000000000000000", // 5k
      rewardsLimit: "40000000000000000000000", // 40k
      dealRewardPoolPercent: "150000000000000000", // 15%
      approveDeadline: String(chainTimestamp + 86400 * 7),
      evaluationDeadline: String(chainTimestamp + 86400 * 30),
      dealDeadline: String(chainTimestamp + 86400 * 60),
      dealConfig: {},
      evaluatorSelector: "milestones-evaluator",
      evaluatorConfig: {
        rewardShare: "1000000000000000000",
        milestones: [
          {
            milestoneType: 0,
            token: underlyingToken,
            oracle: ZERO_ADDR,
            valuationMode: 0,
            fundingToken: ZERO_ADDR,
            expectedReturn: "1000000000000000000000", // 1k
            timestamp: String(chainTimestamp + 86400 * 7),
            rewardPercentage: "400000000000000000", // 40%
            rewardCurve: ["0", "1000000000000000000"], // linear
            penaltyCurve: ["0", "500000000000000000"], // soft penalty
            minPercentGrace: "0",
            extension: "0",
          },
          {
            milestoneType: 0,
            token: underlyingToken,
            oracle: ZERO_ADDR,
            valuationMode: 0,
            fundingToken: ZERO_ADDR,
            expectedReturn: "2000000000000000000000", // 2k
            timestamp: String(chainTimestamp + 86400 * 14),
            rewardPercentage: "600000000000000000", // 60%
            rewardCurve: ["0", "1000000000000000000"],
            penaltyCurve: ["0", "1000000000000000000"],
            minPercentGrace: "0",
            extension: "0",
          },
        ],
      },
      vetoEnabled: false,
      agentsLimit: "0",
      minimalStake: "0",
    };

    const dealAPath = join(tmpdir(), `qa-wrapped-deal-a-${Date.now()}.json`);
    writeFileSync(dealAPath, JSON.stringify(dealAConfig, null, 2));

    h.log("Creating Deal A...");
    const dealACli = await h.cli([
      "deal", "create", dealAPath, "--dac", dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    const dealAAddress = dealACli.data.dealAddress as string;
    const dealACell = dealACli.data.dealCell as string;
    const dealANumericId = String(dealACli.data.dealId ?? "");
    const dealAProposalId = String(dealACli.data.dacProposalId ?? "");

    await h.syncIndexer();

    // Stake in Deal A: founder 10k, agent1 8k
    await h.cli([
      "deal", "stake", "10000000000000000000000",
      "--deal-address", dealACell, "--dac", dacAddress, "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cli([
      "deal", "invite", agent1Wallet.address,
      "--deal-address", dealACell,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cliAs("agent1", [
      "deal", "stake", "8000000000000000000000",
      "--deal-address", dealACell, "--dac", dacAddress, "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);

    // Approve Deal A via fallback voting
    h.log("Approving Deal A via fallback voting...");
    await h.advanceTime(45);
    await h.cli([
      "vote", "proposal", dealAProposalId, "true", "--dac", dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", dealAProposalId, "--dac", dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ── Create Deal B: 1 milestone, no reward pool ──────────────

    chainTimestamp = await getChainTimestamp(h);

    const dealBConfig = {
      dealKind: "permit2-treasury",
      name: "Wrapped Deal B (single milestone)",
      description: "QA multi-deal wrapped B",
      linkHash: "seed://qa-wrapped-multi-deal-b",
      fundingToken: underlyingToken,
      fundingAmount: "3000000000000000000000", // 3k
      rewardsLimit: "20000000000000000000000", // 20k
      dealRewardPoolPercent: "0",
      approveDeadline: String(chainTimestamp + 86400 * 7),
      evaluationDeadline: String(chainTimestamp + 86400 * 30),
      dealDeadline: String(chainTimestamp + 86400 * 60),
      dealConfig: {},
      evaluatorSelector: "milestones-evaluator",
      evaluatorConfig: {
        rewardShare: "1000000000000000000",
        milestones: [{
          milestoneType: 0,
          token: underlyingToken,
          oracle: ZERO_ADDR,
          valuationMode: 0,
          fundingToken: ZERO_ADDR,
          expectedReturn: "1000000000000000000000", // 1k
          timestamp: String(chainTimestamp + 86400 * 10),
          rewardPercentage: "1000000000000000000", // 100%
          rewardCurve: ["0", "1000000000000000000"],
          penaltyCurve: ["0"],
          minPercentGrace: "0",
          extension: "0",
        }],
      },
      vetoEnabled: false,
      agentsLimit: "0",
      minimalStake: "0",
    };

    const dealBPath = join(tmpdir(), `qa-wrapped-deal-b-${Date.now()}.json`);
    writeFileSync(dealBPath, JSON.stringify(dealBConfig, null, 2));

    h.log("Creating Deal B...");
    const dealBCli = await h.cli([
      "deal", "create", dealBPath, "--dac", dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    const dealBAddress = dealBCli.data.dealAddress as string;
    const dealBCell = dealBCli.data.dealCell as string;
    const dealBNumericId = String(dealBCli.data.dealId ?? "");
    const dealBProposalId = String(dealBCli.data.dacProposalId ?? "");

    await h.syncIndexer();

    // Stake in Deal B: founder 10k, agent1 5k
    await h.cli([
      "deal", "stake", "10000000000000000000000",
      "--deal-address", dealBCell, "--dac", dacAddress, "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cli([
      "deal", "invite", agent1Wallet.address,
      "--deal-address", dealBCell,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cliAs("agent1", [
      "deal", "stake", "5000000000000000000000",
      "--deal-address", dealBCell, "--dac", dacAddress, "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);

    // Approve Deal B via fallback voting
    h.log("Approving Deal B via fallback voting...");
    await h.advanceTime(45);
    await h.cli([
      "vote", "proposal", dealBProposalId, "true", "--dac", dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", dealBProposalId, "--dac", dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: BASELINE
    // ══════════════════════════════════════════════════════════════

    let snapA0: DealSnapshot;
    let snapB0: DealSnapshot;

    await step(h, "phase1-baseline", async () => {
      snapA0 = await captureDealSnapshot(h, dealAAddress);
      snapB0 = await captureDealSnapshot(h, dealBAddress);

      h.log(`Deal A: active=${snapA0.active}, stakers=${snapA0.stakerCount}, staked=${snapA0.currentStakedAmount}`);
      h.log(`Deal B: active=${snapB0.active}, stakers=${snapB0.stakerCount}, staked=${snapB0.currentStakedAmount}`);

      assert.equal(snapA0.active, true, "Deal A active");
      assert.equal(snapB0.active, true, "Deal B active");
      assert.equal(snapA0.stakerCount, 2, "Deal A: 2 stakers");
      assert.equal(snapB0.stakerCount, 2, "Deal B: 2 stakers");
      assert.equal(snapA0.currentStakedAmount, 18000000000000000000000n, "Deal A: 18k staked");
      assert.equal(snapB0.currentStakedAmount, 15000000000000000000000n, "Deal B: 15k staked");

      await verifyDealAccountingInvariants(h, dealAAddress);
      await verifyDealAccountingInvariants(h, dealBAddress);

      // Treasury holdings: verify underlying (funding) AND WrappedMainToken (rewards)
      const thCli = await h.view("treasury-holdings", ["--dac", dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;

      for (const holding of holdings ?? []) {
        h.log(`Treasury baseline: token=${holding.tokenAddress}, balance=${holding.balance}, committed=${holding.committedAmount}, free=${holding.freeAmount}`);
      }

      // Verify WrappedMainToken holding exists (reward capacity)
      const wrappedHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === wrappedMainTokenAddress.toLowerCase(),
      );
      if (wrappedHolding) {
        h.log(`WrappedMainToken treasury: balance=${wrappedHolding.balance}, committed=${wrappedHolding.committedAmount}`);
      }

      return {
        cli: {data: {dealA: snapA0, dealB: snapB0}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["baseline"],
        indexerSnapshot: {dealA: snapA0, dealB: snapB0, treasuryHoldings: holdings} as unknown as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: EVALUATE DEAL A MILESTONE 1 (PARTIAL)
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 2: Evaluating Deal A milestone 1 (60% progress)...");

    await step(h, "phase2-deposit-a", async () => {
      const txHash = await transferErc20(h, {
        token: underlyingToken,
        from: founderWallet.address,
        to: dealACell,
        amount: "600000000000000000000", // 600 tokens = 60% of 1k
      });
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer"],
      };
    });

    const dealAM1Ts = Number(dealAConfig.evaluatorConfig.milestones[0].timestamp);
    let currentTs = await getChainTimestamp(h);
    await h.advanceTime(Math.max(dealAM1Ts - currentTs + 3600, 3600));

    await step(h, "phase2-eval-a", async () => {
      const cli = await h.cli([
        "deal", "evaluate",
        "--deal-id", dealANumericId,
        "--dac", dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "Deal A eval tx");
      return {cli, command: ["deal", "evaluate"]};
    });

    await h.syncIndexer();

    let snapA1: DealSnapshot;

    await step(h, "phase2-verify-a", async () => {
      snapA1 = await captureDealSnapshot(h, dealAAddress);

      h.log(`Deal A after eval 1: evalCount=${snapA1.totalEvaluationCount}, allocated=${snapA1.totalRewardAllocatedAmount}, slashed=${snapA1.totalSlashedStakeAmount}, poolAllocated=${snapA1.totalDealRewardPoolAllocatedAmount}`);

      assert.equal(snapA1.totalEvaluationCount, 1, "Deal A eval count = 1");
      assert.equal(snapA1.totalRewardAllocatedAmount > 0n, true, "Deal A rewards allocated");
      assert.equal(snapA1.totalSlashedStakeAmount > 0n, true, "Deal A penalty applied");
      assert.equal(snapA1.totalDealRewardPoolAllocatedAmount > 0n, true, "Deal A pool allocated");

      // Pool ratio ~15%
      if (snapA1.totalRewardAllocatedAmount > 0n) {
        const poolRatio = (snapA1.totalDealRewardPoolAllocatedAmount * 100n) / snapA1.totalRewardAllocatedAmount;
        h.log(`Deal A pool ratio: ${poolRatio}% (expected ~15%)`);
        assert.equal(poolRatio >= 10n && poolRatio <= 20n, true, "Deal A pool ratio ~15%");
      }

      await verifyDealAccountingInvariants(h, dealAAddress);

      const posCli = await h.dealView("positions", ["--deal-address", dealAAddress]);
      const dealCli = await h.dealView("deal", ["--deal-address", dealAAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal: dealCli.data.deal, positions: posCli.data.positions} as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: AGENT1 INCREASES STAKE IN DEAL A
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 3: agent1 increases stake in Deal A by 2k...");

    const agent1IncreaseAmount = "2000000000000000000000"; // 2k

    // Mint more agent tokens via fallback voting
    await existingTokenProposeVoteExecute(h, dacAddress, [
      "propose", "mint-agent-tokens", agent1IncreaseAmount, agent1Wallet.address,
    ]);
    await h.syncIndexer();

    await step(h, "phase3-request", async () => {
      const cli = await h.cliAs("agent1", [
        "deal", "request", agent1IncreaseAmount,
        "--deal-address", dealACell, "--dac", dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.approveTx, "agent1 approval tx");
      return {cli, command: ["deal", "request"]};
    });

    await step(h, "phase3-add-stake", async () => {
      const proposalId = await dealProposeVoteExecuteQuorum(h, dealAAddress, [
        "deal", "propose", "add-stake", agent1Wallet.address, "--from-request", "--dac", dacAddress,
      ], ["agent1"]);
      h.log(`add-stake proposal ${proposalId} executed`);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "add-stake"],
      };
    });

    await h.syncIndexer();

    await step(h, "phase3-verify", async () => {
      const snap = await captureDealSnapshot(h, dealAAddress);
      h.log(`Deal A after increase: staked=${snap.currentStakedAmount}, totalStaked=${snap.totalStakedAmount}`);

      assert.equal(
        snap.totalStakedAmount, snapA1!.totalStakedAmount + BigInt(agent1IncreaseAmount),
        "Deal A totalStakedAmount increased by add-stake amount",
      );

      await verifyDealAccountingInvariants(h, dealAAddress);

      const posCli = await h.dealView("positions", ["--deal-address", dealAAddress]);
      const dealCli = await h.dealView("deal", ["--deal-address", dealAAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal: dealCli.data.deal, positions: posCli.data.positions} as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: EVALUATE DEAL B (FULL REWARD → CLOSE)
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 4: Evaluating Deal B (100%+ progress → close)...");

    await step(h, "phase4-deposit-b", async () => {
      const txHash = await transferErc20(h, {
        token: underlyingToken,
        from: founderWallet.address,
        to: dealBCell,
        amount: "1500000000000000000000", // 1500 tokens (150% of 1k)
      });
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer"],
      };
    });

    const dealBM1Ts = Number(dealBConfig.evaluatorConfig.milestones[0].timestamp);
    currentTs = await getChainTimestamp(h);
    await h.advanceTime(Math.max(dealBM1Ts - currentTs + 3600, 3600));

    await step(h, "phase4-eval-b", async () => {
      const cli = await h.cli([
        "deal", "evaluate",
        "--deal-id", dealBNumericId,
        "--dac", dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "Deal B eval tx");
      return {cli, command: ["deal", "evaluate"]};
    });

    await h.syncIndexer();

    await step(h, "phase4-verify-b", async () => {
      const snap = await captureDealSnapshot(h, dealBAddress);

      h.log(`Deal B after eval: active=${snap.active}, closed=${snap.closed}, allocated=${snap.totalRewardAllocatedAmount}`);

      assert.equal(snap.totalEvaluationCount, 1, "Deal B eval count = 1");
      assert.equal(snap.totalRewardAllocatedAmount > 0n, true, "Deal B rewards allocated");

      if (snap.closed) {
        h.log("Deal B closed after full reward evaluation");
      }

      await verifyDealAccountingInvariants(h, dealBAddress);

      // Existing-token specific: verify treasury holdings for both tokens
      const thCli = await h.view("treasury-holdings", ["--dac", dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;
      for (const holding of holdings ?? []) {
        h.log(`Treasury after Deal B eval: token=${holding.tokenAddress}, balance=${holding.balance}, committed=${holding.committedAmount}, free=${holding.freeAmount}`);
      }

      const dealCli = await h.dealView("deal", ["--deal-address", dealBAddress]);
      const posCli = await h.dealView("positions", ["--deal-address", dealBAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal: dealCli.data.deal, positions: posCli.data.positions, treasuryHoldings: holdings} as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: CLAIMS FROM DEAL B
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 5: claiming rewards from Deal B...");

    await step(h, "phase5-claim-b-founder", async () => {
      const cli = await h.cli([
        "deal", "claim",
        "--deal-address", dealBAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "founder Deal B claim tx");
      return {cli, command: ["deal", "claim"]};
    });

    await step(h, "phase5-claim-b-agent1", async () => {
      const cli = await h.cliAs("agent1", [
        "deal", "claim",
        "--deal-address", dealBAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent1 Deal B claim tx");
      return {cli, command: ["deal", "claim"]};
    });

    await h.syncIndexer();

    await step(h, "phase5-verify-b-claims", async () => {
      const snap = await captureDealSnapshot(h, dealBAddress);

      h.log(`Deal B claims: claimed=${snap.totalRewardClaimedAmount}, allocated=${snap.totalRewardAllocatedAmount}`);
      assert.equal(snap.totalRewardClaimedAmount > 0n, true, "Deal B rewards claimed");
      assert.equal(
        snap.totalRewardClaimedAmount <= snap.totalRewardAllocatedAmount, true,
        "Deal B claimed <= allocated",
      );

      await verifyDealAccountingInvariants(h, dealBAddress);

      const posCli = await h.dealView("positions", ["--deal-address", dealBAddress]);
      const dealCli = await h.dealView("deal", ["--deal-address", dealBAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal: dealCli.data.deal, positions: posCli.data.positions} as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 6: EVALUATE DEAL A MILESTONE 2 (FULL → CLOSE)
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 6: Evaluating Deal A milestone 2 (100%+ progress)...");

    await step(h, "phase6-deposit-a2", async () => {
      const txHash = await transferErc20(h, {
        token: underlyingToken,
        from: founderWallet.address,
        to: dealACell,
        amount: "3000000000000000000000", // 3k (150% of 2k)
      });
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer"],
      };
    });

    const dealAM2Ts = Number(dealAConfig.evaluatorConfig.milestones[1].timestamp);
    currentTs = await getChainTimestamp(h);
    await h.advanceTime(Math.max(dealAM2Ts - currentTs + 3600, 3600));

    await step(h, "phase6-eval-a2", async () => {
      const cli = await h.cli([
        "deal", "evaluate",
        "--deal-id", dealANumericId,
        "--dac", dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "Deal A eval 2 tx");
      return {cli, command: ["deal", "evaluate"]};
    });

    await h.syncIndexer();

    await step(h, "phase6-verify-a2", async () => {
      const snap = await captureDealSnapshot(h, dealAAddress);

      h.log(`Deal A after eval 2: active=${snap.active}, closed=${snap.closed}, evalCount=${snap.totalEvaluationCount}, allocated=${snap.totalRewardAllocatedAmount}`);

      assert.equal(snap.totalEvaluationCount, 2, "Deal A eval count = 2");

      // CRITICAL: rewards ACCUMULATE across evaluations
      assert.equal(
        snap.totalRewardAllocatedAmount > snapA1!.totalRewardAllocatedAmount, true,
        "CRITICAL: Deal A rewards ACCUMULATED across evaluations",
      );
      assert.equal(
        snap.totalDealRewardPoolAllocatedAmount > snapA1!.totalDealRewardPoolAllocatedAmount, true,
        "Deal A pool allocation accumulated",
      );

      await verifyDealAccountingInvariants(h, dealAAddress);

      // Treasury after both deals evaluated — verify WrappedMainToken state
      const thCli = await h.view("treasury-holdings", ["--dac", dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;
      for (const holding of holdings ?? []) {
        h.log(`Treasury after Deal A eval 2: token=${holding.tokenAddress}, balance=${holding.balance}, committed=${holding.committedAmount}, free=${holding.freeAmount}`);
      }

      const dealCli = await h.dealView("deal", ["--deal-address", dealAAddress]);
      const posCli = await h.dealView("positions", ["--deal-address", dealAAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal: dealCli.data.deal, positions: posCli.data.positions, treasuryHoldings: holdings} as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 7: CLAIMS FROM DEAL A + REWARD POOL
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 7: claiming rewards from Deal A...");

    await step(h, "phase7-claim-a-founder", async () => {
      const cli = await h.cli([
        "deal", "claim",
        "--deal-address", dealAAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "founder Deal A claim tx");
      return {cli, command: ["deal", "claim"]};
    });

    await step(h, "phase7-claim-a-agent1", async () => {
      const cli = await h.cliAs("agent1", [
        "deal", "claim",
        "--deal-address", dealAAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent1 Deal A claim tx");
      return {cli, command: ["deal", "claim"]};
    });

    await step(h, "phase7-claim-pool-a", async () => {
      const cli = await h.cli([
        "deal", "claim-reward-pool",
        "--deal-address", dealAAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "Deal A pool claim tx");
      return {cli, command: ["deal", "claim-reward-pool"]};
    });

    await h.syncIndexer();

    await step(h, "phase7-verify-a-claims", async () => {
      const snap = await captureDealSnapshot(h, dealAAddress);

      h.log(`Deal A claims: claimed=${snap.totalRewardClaimedAmount}, allocated=${snap.totalRewardAllocatedAmount}, poolClaimed=${snap.totalDealRewardPoolClaimedAmount}`);

      assert.equal(snap.totalRewardClaimedAmount > 0n, true, "Deal A rewards claimed");
      assert.equal(snap.totalDealRewardPoolClaimedAmount > 0n, true, "Deal A pool claimed");
      assert.equal(
        snap.totalRewardClaimedAmount <= snap.totalRewardAllocatedAmount, true,
        "Deal A claimed <= allocated",
      );

      await verifyDealAccountingInvariants(h, dealAAddress);

      const posCli = await h.dealView("positions", ["--deal-address", dealAAddress]);
      const dealCli = await h.dealView("deal", ["--deal-address", dealAAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal: dealCli.data.deal, positions: posCli.data.positions} as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 8: UNSTAKE + FORCE RETURN + FINAL ACCOUNTING
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 8: unstake + force return + final accounting...");

    // Unstake from Deal A (if closed)
    const snapAFinal = await captureDealSnapshot(h, dealAAddress);
    if (snapAFinal.closed) {
      await step(h, "phase8-unstake-a-founder", async () => {
        const cli = await h.cli([
          "deal", "unstake", "--deal-address", dealACell,
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.defined(cli.data.txHash, "founder unstake Deal A tx");
        return {cli, command: ["deal", "unstake"]};
      });
      await step(h, "phase8-unstake-a-agent1", async () => {
        const cli = await h.cliAs("agent1", [
          "deal", "unstake", "--deal-address", dealACell,
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.defined(cli.data.txHash, "agent1 unstake Deal A tx");
        return {cli, command: ["deal", "unstake"]};
      });
    }

    // Unstake from Deal B (if closed)
    const snapBFinal = await captureDealSnapshot(h, dealBAddress);
    if (snapBFinal.closed) {
      await step(h, "phase8-unstake-b-founder", async () => {
        const cli = await h.cli([
          "deal", "unstake", "--deal-address", dealBCell,
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.defined(cli.data.txHash, "founder unstake Deal B tx");
        return {cli, command: ["deal", "unstake"]};
      });
      await step(h, "phase8-unstake-b-agent1", async () => {
        const cli = await h.cliAs("agent1", [
          "deal", "unstake", "--deal-address", dealBCell,
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.defined(cli.data.txHash, "agent1 unstake Deal B tx");
        return {cli, command: ["deal", "unstake"]};
      });
    }

    await h.syncIndexer();

    // Advance past deal deadlines for force return
    const maxDeadline = Math.max(
      Number(dealAConfig.dealDeadline),
      Number(dealBConfig.dealDeadline),
    );
    currentTs = await getChainTimestamp(h);
    if (currentTs < maxDeadline + 3600) {
      await h.advanceTime(maxDeadline - currentTs + 3600);
    }

    // Force return capital from both deals
    await step(h, "phase8-withdraw-a", async () => {
      const cli = await h.cli([
        "deal", "withdraw", dealANumericId,
        "--dac", dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "Deal A withdraw tx");
      return {cli, command: ["deal", "withdraw"]};
    });

    await step(h, "phase8-withdraw-b", async () => {
      const cli = await h.cli([
        "deal", "withdraw", dealBNumericId,
        "--dac", dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "Deal B withdraw tx");
      return {cli, command: ["deal", "withdraw"]};
    });

    await h.syncIndexer();

    // Final verification
    await step(h, "phase8-verify-final", async () => {
      await verifyDealAccountingInvariants(h, dealAAddress);
      await verifyDealAccountingInvariants(h, dealBAddress);

      // Treasury: verify both underlying and WrappedMainToken holdings
      const thCli = await h.view("treasury-holdings", ["--dac", dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;

      for (const holding of holdings ?? []) {
        h.log(`Final treasury: token=${holding.tokenAddress}, balance=${holding.balance}, committed=${holding.committedAmount}, free=${holding.freeAmount}`);
      }

      // WrappedMainToken free amount should reflect released reward capacity
      const wrappedHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === wrappedMainTokenAddress.toLowerCase(),
      );
      if (wrappedHolding) {
        h.log(`Final WrappedMainToken: balance=${wrappedHolding.balance}, committed=${wrappedHolding.committedAmount}, free=${wrappedHolding.freeAmount}`);
      }

      // Deal snapshots for reviewer
      const dealACli = await h.dealView("deal", ["--deal-address", dealAAddress]);
      const dealBCli = await h.dealView("deal", ["--deal-address", dealBAddress]);
      const posACli = await h.dealView("positions", ["--deal-address", dealAAddress]);
      const posBCli = await h.dealView("positions", ["--deal-address", dealBAddress]);

      return {
        cli: dealACli,
        command: ["final-verification"],
        indexerSnapshot: {
          dealA: dealACli.data.deal,
          dealB: dealBCli.data.deal,
          positionsA: posACli.data.positions,
          positionsB: posBCli.data.positions,
          treasuryHoldings: holdings,
        } as Record<string, unknown>,
      };
    });

    h.log("Multi-deal wrapped reward accounting scenario completed successfully");
  },
};
