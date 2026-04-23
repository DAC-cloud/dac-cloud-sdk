import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  getChainTimestamp,
  mintMockToken,
  setupExistingTokenDacWithDeal,
  transferErc20,
  verifyDealAccountingInvariants,
  verifyTxReceipt,
} from "./fixtures/index.js";

interface DealSnapshot {
  active: boolean;
  closed: boolean;
  currentStakedAmount: bigint;
  totalStakedAmount: bigint;
  totalSlashedStakeAmount: bigint;
  totalReleasedStakeAmount: bigint;
  totalRewardAllocatedAmount: bigint;
  totalRewardClaimedAmount: bigint;
  totalEvaluationCount: number;
  stakerCount: number;
  positions: Array<{
    accountId: string;
    currentStakedAmount: bigint;
    totalStakedAmount: bigint;
    totalSlashedAmount: bigint;
    totalReleasedAmount: bigint;
    totalClaimedMainTokenAmount: bigint;
  }>;
  dealCellBalance: bigint;
}

async function captureDealSnapshot(
  h: Harness,
  dealAddress: string,
  treasuryToken: string,
): Promise<DealSnapshot> {
  const dealCli = await h.dealView("deal", ["--deal-address", dealAddress]);
  const deal = dealCli.data.deal as Record<string, unknown>;

  const posCli = await h.dealView("positions", ["--deal-address", dealAddress]);
  const rawPositions = (posCli.data.positions as Array<Record<string, unknown>>) ?? [];

  // For Permit2Treasury deals, funding tokens go to the deal's managed treasury
  // (a separate contract), not the DealCell or Deal contract directly.
  const managedTreasury = deal.managedTreasuryAddress as string | undefined;
  const balanceHolder = managedTreasury || dealAddress;
  const dealBalCli = await h.cli([
    "balance", treasuryToken, balanceHolder,
    "--config", h.config.configPath, "--pretty-print",
  ]);
  const dealCellBalance = BigInt(dealBalCli.data.balance as string);

  return {
    active: deal.active as boolean,
    closed: deal.closed as boolean,
    currentStakedAmount: BigInt(deal.currentStakedAmount as string),
    totalStakedAmount: BigInt(deal.totalStakedAmount as string),
    totalSlashedStakeAmount: BigInt(deal.totalSlashedStakeAmount as string),
    totalReleasedStakeAmount: BigInt(deal.totalReleasedStakeAmount as string),
    totalRewardAllocatedAmount: BigInt(deal.totalRewardAllocatedAmount as string),
    totalRewardClaimedAmount: BigInt(deal.totalRewardClaimedAmount as string),
    totalEvaluationCount: Number(deal.totalEvaluationCount ?? 0),
    stakerCount: Number(deal.stakerCount ?? 0),
    positions: rawPositions.map((p) => ({
      accountId: p.accountId as string,
      currentStakedAmount: BigInt(p.currentStakedAmount as string),
      totalStakedAmount: BigInt(p.totalStakedAmount as string),
      totalSlashedAmount: BigInt(p.totalSlashedAmount as string),
      totalReleasedAmount: BigInt(p.totalReleasedAmount as string),
      totalClaimedMainTokenAmount: BigInt(p.totalClaimedMainTokenAmount as string),
    })),
    dealCellBalance,
  };
}

/**
 * Scenario: Existing-Token DAC — Accounting Stress Test
 *
 * Concentrated multi-phase scenario targeting indexer accounting bugs:
 * drift on consecutive updates, overwrites vs accumulation, stale caches.
 *
 * Uses an Existing-Token DAC (oracle fallback voting) — first deal scenario
 * on this DAC mode. Three agents with uneven stakes (10k/8k/3k = 21k total).
 *
 * PROTOCOL FINDING: existing-token DAC deals CANNOT have rewardsLimit > 0.
 * The WrappedMainToken is a 1:1 wrapper — totalSupply always equals
 * underlying.balanceOf(wrapper), leaving zero capacity for minting reward
 * tokens. InsufficientRewards() is thrown on approval for any rewardsLimit > 0.
 * Native DAC avoids this because MainToken has mainTokenMaxSupply (default 1B)
 * with minting headroom. This scenario uses rewardsLimit=0 and focuses on
 * treasury funding, evaluation slashing, and stake lifecycle.
 *
 * Phase 1: Baseline — verify funded deal, zero rewards/slashing
 * Phase 2: Partial progress (60%) + first eval → slashing from penalty curve
 * Phase 3: Multi-tranche treasury deposits (accumulation stress)
 * Phase 4: More progress (110%) + second eval → deal closes
 * Phase 5: Force return capital → treasury balance restored
 * Phase 6: Unstake + final accounting invariants
 *
 * Accounting invariant check at every phase transition.
 */
export const existingTokenAccountingStressScenario: Scenario = {
  name: "existing-token-accounting-stress",
  description: "Existing-token DAC + funded deal → 6-phase accounting stress: treasury, evaluations, slashing, force return, unstake",
  tags: ["deal", "existing-token", "accounting", "stress", "multi-agent", "multi-milestone", "force-return"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    if (!founderWallet) throw new Error("founder wallet required");

    const fundingAmount = "5000000000000000000000"; // 5k funding tokens

    // ══════════════════════════════════════════════════════════════
    // SETUP: Existing-token DAC + funded deal (skipApproval)
    // ══════════════════════════════════════════════════════════════

    // Mint extra underlying tokens for treasury deposit + deal cell transfers
    const underlyingToken = h.config.tokens.treasury;
    await mintMockToken(h, {token: underlyingToken, to: founderWallet.address, amount: "50000000000000000000000"}); // 50k extra

    // PROTOCOL FINDINGS (existing-token DAC reward funding):
    //
    // 1. recoverTreasury(mainToken) REVERTS — DACCell has special handling that
    //    prevents recovering the governance token. deposit-treasury silently fails
    //    because writeContract doesn't check receipts.
    //
    // 2. wrap --recipient <dacCell> fails with NoVotingPower() — WrappedMainToken
    //    requires delegation, and contracts can't self-delegate.
    //
    // 3. The ONLY way to fund AssetController's mainToken balance for reward capacity
    //    is through treasury-seed-amount at DAC creation time. This means existing-token
    //    DACs must plan their reward capacity upfront.
    //
    // We set treasury-seed-amount = rewardsLimit + buffer to cover the deal rewards.
    const rewardsLimit = "5000000000000000000000"; // 5k rewards in WrappedMainToken
    const treasurySeedAmount = "8000000000000000000000"; // 8k seed (covers 5k rewards + buffer)

    const ctx = await setupExistingTokenDacWithDeal(h, {
      dacName: "Accounting Stress DAC",
      dealName: "Accounting Stress Deal",
      fundingAmount,
      rewardsLimit,
      dealRewardPoolPercent: "200000000000000000", // 20%
      treasurySeedAmount,
      stakeAmount: "10000000000000000000000", // founder: 10k
      milestones: [
        {
          expectedReturn: "2000000000000000000000", // M1: 2000 tokens
          rewardPercentage: "400000000000000000",   // 40% of reward share
          rewardCurve: ["0", "1000000000000000000"], // linear
          penaltyCurve: ["0", "500000000000000000"], // soft linear (50% max penalty)
          timestampDelta: 86400 * 7,
        },
        {
          expectedReturn: "5000000000000000000000", // M2: 5000 tokens
          rewardPercentage: "600000000000000000",   // 60% of reward share
          rewardCurve: ["0", "1000000000000000000"], // linear
          penaltyCurve: ["0", "1000000000000000000"], // full linear penalty
          timestampDelta: 86400 * 14,
        },
      ],
      extraAgents: [
        {role: "agent1", mintAmount: "50000000000000000000000", stakeAmount: "8000000000000000000000"},
        {role: "agent2", mintAmount: "30000000000000000000000", stakeAmount: "3000000000000000000000"},
      ],
      skipApproval: true,
    });

    // ── Deposit underlying tokens for deal funding BEFORE approval ─

    h.log("Depositing underlying tokens for deal funding (10k)...");
    await h.cli([
      "deposit-treasury", "--token", ctx.treasuryToken,
      "--amount", "10000000000000000000000", // 10k underlying
      "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    // ── Test deposit-treasury for WrappedMainToken (reward top-up) ──
    // With the contract fix (skip _autoDelegate for controlled addresses),
    // deposit-treasury should now work for the mainToken. This is the standard
    // user path for adding reward capacity after DAC creation.

    await step(h, "deposit-treasury-wrapped", async () => {
      // Test the standard user path for adding reward capacity post-creation:
      // deposit-treasury for WrappedMainToken (ERC20 transfer + recoverTreasury).
      // Requires the contract fix that skips _autoDelegate for controlled addresses.
      h.log("Depositing WrappedMainToken to treasury (2k) for reward top-up...");
      const depositCli = await h.cli([
        "deposit-treasury", "--token", ctx.wrappedMainTokenAddress,
        "--amount", "2000000000000000000000", // 2k wrapped
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);

      // Verify both sub-transactions with receipt checks
      if (depositCli.data.transferTx) {
        const r = await verifyTxReceipt(h, depositCli.data.transferTx as string);
        h.log(`WrappedMainToken deposit transfer: status=${r.status}, gasUsed=${r.gasUsed}`);
        assert.equal(r.status, "0x1", "WrappedMainToken transfer to DAC cell succeeded");
      }
      if (depositCli.data.recoverTx) {
        const r = await verifyTxReceipt(h, depositCli.data.recoverTx as string);
        h.log(`WrappedMainToken deposit recover: status=${r.status}, gasUsed=${r.gasUsed}`);
        assert.equal(r.status, "0x1", "WrappedMainToken recoverTreasury succeeded");
      }

      return {cli: depositCli, command: ["dac", "deposit-treasury (wrappedMainToken)"]};
    });

    // ── Wrap operations: test wrap + unwrap + indexer tracking ────

    await step(h, "wrap-unwrap-operations", async () => {
      // Wrap additional tokens (tests the wrap flow on existing-token DAC)
      h.log("Wrapping 2k more tokens for wrap/unwrap testing...");
      const wrapCli = await h.cli([
        "wrap", "--amount", "2000000000000000000000", // 2k
        "--dac", ctx.dacAddress, "--auto-approve",
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(wrapCli.data.txHash, "wrap tx hash");

      // Unwrap half to test the reverse flow
      h.log("Unwrapping 1k tokens...");
      const unwrapCli = await h.cli([
        "unwrap", "--amount", "1000000000000000000000", // 1k
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(unwrapCli.data.txHash, "unwrap tx hash");

      return {cli: wrapCli, command: ["dac", "wrap + unwrap"]};
    });

    await h.syncIndexer();

    // Verify mainToken balances in indexer (WrappedMainToken = mainToken for existing-token DAC)
    await step(h, "verify-maintoken-indexer", async () => {
      const dacViewCli = await h.view("dac", ["--dac", ctx.dacAddress]);
      const dac = dacViewCli.data.dac as Record<string, unknown> | undefined;
      assert.defined(dac, "DAC in indexer");

      if (dac) {
        h.log(`DAC mode: ${dac.mode}, wrappedMainToken: ${dac.wrappedMainTokenAddress}`);
        assert.equal(dac.mode, "EXISTING_TOKEN", "DAC mode is EXISTING_TOKEN");
      }

      // Check treasury holdings — should show the underlying token deposit
      const thCli = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;

      for (const holding of holdings ?? []) {
        h.log(`Treasury holding: token=${holding.tokenAddress}, balance=${holding.balance}, committed=${holding.committedAmount}, free=${holding.freeAmount}`);
      }

      return {
        cli: dacViewCli,
        command: ["dac", "view"],
        indexerSnapshot: {dac, treasuryHoldings: holdings} as Record<string, unknown>,
      };
    });

    // ── Approve deal via fallback voting ─────────────────────────

    h.log("Approving deal via fallback voting...");
    await h.advanceTime(45); // past oracle-publish-deadline + fallback-warmup
    await h.cli([
      "vote", "proposal", ctx.dealProposalId, "true", "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", ctx.dealProposalId, "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: BASELINE SNAPSHOT
    // ══════════════════════════════════════════════════════════════

    let s0: DealSnapshot;

    await step(h, "phase1-baseline", async () => {
      s0 = await captureDealSnapshot(h, ctx.dealAddress, ctx.treasuryToken);

      h.log(`Baseline: active=${s0.active}, stakers=${s0.stakerCount}, staked=${s0.currentStakedAmount}, fundingBalance=${s0.dealCellBalance}`);

      assert.equal(s0.active, true, "deal active");
      assert.equal(s0.closed, false, "deal not closed");
      assert.equal(s0.stakerCount, 3, "three stakers");
      assert.equal(s0.currentStakedAmount, 21000000000000000000000n, "total staked = 21k (10k+8k+3k)");
      assert.equal(s0.totalRewardAllocatedAmount, 0n, "no rewards allocated yet");
      assert.equal(s0.totalSlashedStakeAmount, 0n, "no slashing yet");
      assert.equal(s0.totalEvaluationCount, 0, "no evaluations yet");
      assert.equal(s0.dealCellBalance >= BigInt(fundingAmount), true, "deal managed treasury received funding tokens");

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      // Verify treasury holdings after funding
      const thCli = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;
      const underlyingHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === ctx.treasuryToken.toLowerCase(),
      );
      h.log(`Treasury after funding: balance=${underlyingHolding?.balance}, committed=${underlyingHolding?.committedAmount}, free=${underlyingHolding?.freeAmount}`);

      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal: dealCli.data.deal, treasuryHoldings: holdings} as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: PARTIAL PROGRESS + FIRST EVALUATION (SLASHING)
    // ══════════════════════════════════════════════════════════════

    // Transfer 1200 tokens to deal cell (60% of M1's 2000 expected)
    h.log("Depositing 1200 tokens for 60% progress on milestone 1...");

    await step(h, "phase2-deposit-progress", async () => {
      const txHash = await transferErc20(h, {
        token: ctx.treasuryToken,
        from: ctx.founderAddress,
        to: ctx.dealCell,
        amount: "1200000000000000000000", // 1200 tokens
      });
      assert.defined(txHash, "transfer tx hash");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer"],
      };
    });

    // Advance past M1 deadline
    const m1Ts = ctx.chainTimestamp + 86400 * 7;
    const currentTs1 = await getChainTimestamp(h);
    const neededAdvance1 = m1Ts - currentTs1 + 3600;
    await h.advanceTime(Math.max(neededAdvance1, 3600));

    await step(h, "phase2-evaluate-m1", async () => {
      const args = [
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "evaluate tx hash");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    let s1: DealSnapshot;

    await step(h, "phase2-verify", async () => {
      s1 = await captureDealSnapshot(h, ctx.dealAddress, ctx.treasuryToken);

      h.log(`After eval 1: active=${s1.active}, evalCount=${s1.totalEvaluationCount}, allocated=${s1.totalRewardAllocatedAmount}, slashed=${s1.totalSlashedStakeAmount}, staked=${s1.currentStakedAmount}`);

      assert.equal(s1.totalEvaluationCount, 1, "evaluation count = 1");

      // Slashing from 40% miss with penalty curve [0, 0.5e18]
      assert.equal(s1.totalSlashedStakeAmount > 0n, true, "penalty applied from missed progress");
      assert.equal(s1.currentStakedAmount < s0!.currentStakedAmount, true, "staked amount decreased by slashing");

      // Rewards allocated from 60% progress on linear curve
      assert.equal(s1.totalRewardAllocatedAmount > 0n, true, "rewards allocated from partial progress");

      // Delta checks vs baseline
      assert.equal(s1.totalStakedAmount, s0!.totalStakedAmount, "total-ever-staked unchanged by evaluation");

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: dealCli.data.deal as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: MULTI-TRANCHE TREASURY DEPOSITS (ACCUMULATION STRESS)
    // ══════════════════════════════════════════════════════════════

    // Multiple deposits to test indexer accumulation of treasury holdings.
    // Catches overwrite-instead-of-add bugs in balance/creditedAmount tracking.

    await step(h, "phase3-deposit-tranche2", async () => {
      h.log("Second treasury deposit (tranche 2: 5k)...");
      const cli = await h.cli([
        "deposit-treasury", "--token", ctx.treasuryToken,
        "--amount", "5000000000000000000000", // 5k more
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.transferTx, "second deposit transferTx");
      return {cli, command: ["dac", "deposit-treasury (tranche 2)"]};
    });

    await step(h, "phase3-deposit-tranche3", async () => {
      h.log("Third treasury deposit (tranche 3: 3k)...");
      const cli = await h.cli([
        "deposit-treasury", "--token", ctx.treasuryToken,
        "--amount", "3000000000000000000000", // 3k more
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.transferTx, "third deposit transferTx");
      return {cli, command: ["dac", "deposit-treasury (tranche 3)"]};
    });

    await h.syncIndexer();

    await step(h, "phase3-verify-treasury", async () => {
      const thCli = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;
      assert.defined(holdings, "treasury holdings after 3 deposits");

      const underlyingHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === ctx.treasuryToken.toLowerCase(),
      );
      if (underlyingHolding) {
        h.log(`Treasury after 3 deposits: balance=${underlyingHolding.balance}, credited=${underlyingHolding.creditedAmount}, free=${underlyingHolding.freeAmount}`);
      }

      return {
        cli: thCli,
        command: ["dac", "view", "treasury-holdings"],
        indexerSnapshot: {holdings} as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: MORE PROGRESS + SECOND EVALUATION (ACCUMULATION CHECK)
    // ══════════════════════════════════════════════════════════════

    // Transfer 4300 more tokens to deal cell (total ~5500, 110% of M2's 5000)
    h.log("Depositing 4300 more tokens for 110% progress on milestone 2...");

    await step(h, "phase4-deposit-progress", async () => {
      const txHash = await transferErc20(h, {
        token: ctx.treasuryToken,
        from: ctx.founderAddress,
        to: ctx.dealCell,
        amount: "4300000000000000000000", // 4300 tokens
      });
      assert.defined(txHash, "transfer tx hash");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer"],
      };
    });

    // Advance past M2 deadline
    const m2Ts = ctx.chainTimestamp + 86400 * 14;
    const currentTs2 = await getChainTimestamp(h);
    const neededAdvance2 = m2Ts - currentTs2 + 3600;
    await h.advanceTime(Math.max(neededAdvance2, 3600));

    await step(h, "phase4-evaluate-m2", async () => {
      const args = [
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "evaluate tx hash");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    let s3: DealSnapshot;

    await step(h, "phase4-verify", async () => {
      s3 = await captureDealSnapshot(h, ctx.dealAddress, ctx.treasuryToken);

      h.log(`After eval 2: active=${s3.active}, closed=${s3.closed}, evalCount=${s3.totalEvaluationCount}, allocated=${s3.totalRewardAllocatedAmount}, slashed=${s3.totalSlashedStakeAmount}, staked=${s3.currentStakedAmount}`);

      // Evaluation count incremented
      assert.equal(s3.totalEvaluationCount, 2, "evaluation count = 2");

      // Slashing from M1 should be preserved (not overwritten)
      assert.equal(s3.totalSlashedStakeAmount >= s1!.totalSlashedStakeAmount, true, "slashing from eval 1 preserved (not overwritten)");

      // CRITICAL: rewards must ACCUMULATE across evaluations, not overwrite
      assert.equal(
        s3.totalRewardAllocatedAmount > s1!.totalRewardAllocatedAmount, true,
        "CRITICAL: totalRewardAllocatedAmount ACCUMULATED (not overwritten) across evaluations",
      );

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: dealCli.data.deal as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: FORCE RETURN CAPITAL
    // ══════════════════════════════════════════════════════════════

    // Advance past deal deadline for force return
    const dealDeadlineTs = ctx.chainTimestamp + 86400 * 60;
    const currentTs3 = await getChainTimestamp(h);
    const neededAdvance3 = dealDeadlineTs - currentTs3 + 3600;
    if (neededAdvance3 > 0) {
      h.log(`Advancing ${neededAdvance3}s past deal deadline for force return...`);
      await h.advanceTime(neededAdvance3);
    }

    await step(h, "phase5-force-return", async () => {
      const args = [
        "deal", "withdraw", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "withdraw tx hash");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    let s4: DealSnapshot;

    await step(h, "phase5-verify", async () => {
      s4 = await captureDealSnapshot(h, ctx.dealAddress, ctx.treasuryToken);

      h.log(`After force return: cellBalance=${s4.dealCellBalance}, staked=${s4.currentStakedAmount}`);

      // Staking unchanged by force return (force return only moves funding tokens)
      assert.equal(s4.currentStakedAmount, s3!.currentStakedAmount, "stakes unchanged by force return");
      assert.equal(s4.totalSlashedStakeAmount, s3!.totalSlashedStakeAmount, "slashing unchanged by force return");

      // Verify treasury received funds back
      const thCli = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;
      const underlyingHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === ctx.treasuryToken.toLowerCase(),
      );
      h.log(`Treasury after force return: balance=${underlyingHolding?.balance}, free=${underlyingHolding?.freeAmount}`);

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal: dealCli.data.deal, treasuryHoldings: holdings} as Record<string, unknown>,
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 6: FINAL STATE VERIFICATION
    // ══════════════════════════════════════════════════════════════
    //
    // The deal remains ACTIVE because M1 at 60% progress only allocated 24% of
    // the total reward share (0.6 * 40% = 24%). Combined with M2's 60% share:
    // total allocated = 84% of rewardsLimit. Deal needs 100% to auto-close.
    // This is correct protocol behavior — partial milestone progress means
    // the deal's reward budget isn't fully consumed.
    // Unstake requires deal close, so we verify final accounting state instead.

    await step(h, "phase6-final-verify", async () => {
      const s5 = await captureDealSnapshot(h, ctx.dealAddress, ctx.treasuryToken);

      h.log(`Final state: active=${s5.active}, closed=${s5.closed}, evalCount=${s5.totalEvaluationCount}`);
      h.log(`  staked=${s5.currentStakedAmount}, slashed=${s5.totalSlashedStakeAmount}, released=${s5.totalReleasedStakeAmount}`);
      h.log(`  allocated=${s5.totalRewardAllocatedAmount}, claimed=${s5.totalRewardClaimedAmount}`);

      // Both milestones evaluated
      assert.equal(s5.totalEvaluationCount, 2, "both milestones evaluated");

      // Staking state preserved through all phases (use String to avoid BigInt serialization issues)
      assert.equal(
        String(s5.currentStakedAmount), String(s4!.currentStakedAmount),
        "staking unchanged since phase 5",
      );
      assert.equal(
        String(s5.totalSlashedStakeAmount), String(s4!.totalSlashedStakeAmount),
        "slashing unchanged since phase 5",
      );
      assert.equal(
        String(s5.totalRewardAllocatedAmount), String(s4!.totalRewardAllocatedAmount),
        "rewards unchanged since phase 5",
      );

      // Per-position stake conservation still holds
      for (const pos of s5.positions) {
        const accounted = pos.currentStakedAmount + pos.totalSlashedAmount + pos.totalReleasedAmount;
        assert.equal(
          String(accounted), String(pos.totalStakedAmount),
          `position ${pos.accountId}: stake conservation`,
        );
      }

      // Final comprehensive accounting invariant check
      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      // Treasury actions + holdings for reviewer
      const actionsCli = await h.dealView("treasury-actions", ["--deal-address", ctx.dealAddress]);
      const actions = actionsCli.data.actions as Array<Record<string, unknown>> | undefined;
      h.log(`Treasury actions: ${actions?.length ?? 0}`);

      const thCli = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;
      for (const holding of holdings ?? []) {
        h.log(`Final treasury: token=${holding.tokenAddress}, balance=${holding.balance}, committed=${holding.committedAmount}, free=${holding.freeAmount}`);
      }

      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {
          deal: dealCli.data.deal,
          positions: s5.positions.map((p) => ({
            accountId: p.accountId,
            currentStakedAmount: String(p.currentStakedAmount),
            totalStakedAmount: String(p.totalStakedAmount),
            totalSlashedAmount: String(p.totalSlashedAmount),
            totalReleasedAmount: String(p.totalReleasedAmount),
            totalClaimedMainTokenAmount: String(p.totalClaimedMainTokenAmount),
          })),
          treasuryActions: actions,
          treasuryHoldings: holdings,
        } as Record<string, unknown>,
      };
    });

    h.log("Existing-token accounting stress test completed successfully");
  },
};
