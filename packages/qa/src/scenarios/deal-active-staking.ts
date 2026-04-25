import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  getChainTimestamp,
  mintMockToken,
  proposeVoteExecute,
  setupNativeDacWithDeal,
  transferErc20,
  verifyDealAccountingInvariants,
} from "./fixtures/index.js";

/**
 * Deal governance propose → vote → execute.
 *
 * KEY INSIGHT: Deal proposals auto-resolve when quorum is met during voting
 * (Proposal.sol:_checkAndEmitResolution is called on each vote). The execution
 * window starts from resolutionTime (= vote timestamp) and lasts
 * executionValidityDuration seconds. We must execute shortly after voting,
 * NOT after the full votingDuration — otherwise the execution window expires.
 *
 * @param extraVoterRoles - additional wallet roles that should also vote "true"
 */
async function dealProposeVoteExecuteQuorum(
  h: Harness,
  dealAddress: string,
  proposeArgs: string[],
  extraVoterRoles: string[] = [],
): Promise<string> {
  const {config} = h;

  // Log governance config for debugging
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

  // Founder votes
  await h.cli([
    "deal", "vote", "proposal", proposalId, "true",
    "--deal-address", dealAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  // Additional voters — when all stakers vote, quorum is met and proposal auto-resolves
  for (const role of extraVoterRoles) {
    await h.cliAs(role, [
      "deal", "vote", "proposal", proposalId, "true",
      "--deal-address", dealAddress,
      "--config", config.configPath,
      "--pretty-print",
    ]);
  }

  // Execute immediately — proposal already resolved on quorum.
  // Only advance a small buffer (not full votingDuration!) to stay within
  // the executionValidityDuration window from resolutionTime.
  await h.advanceTime(100);

  await h.cli([
    "deal", "execute", proposalId,
    "--deal-address", dealAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  return proposalId;
}

/**
 * Scenario: Active Deal Staking (Request + Add-Stake)
 *
 * Tests the post-approval staking flow: `deal request` → `deal propose add-stake` → vote → execute.
 * Exercises two key paths:
 *   1. Already-staked agent increasing their stake (position accumulation)
 *   2. New agent joining an active deal (new position creation)
 *
 * Also tests that rewards after evaluation are proportional to the updated (not original) stakes,
 * and that all accounting invariants hold through each stake mutation.
 *
 * Flow:
 *   Phase 1: Baseline — 2 stakers (founder 10k, agent1 5k)
 *   Phase 2: agent1 increases stake by 3k → position accumulates to 8k
 *   Phase 3: agent2 joins via request flow → new position with 4k
 *   Phase 4: Evaluate milestone → rewards proportional to 10k/8k/4k
 *   Phase 5: Claims + unstake + final accounting
 */
export const dealActiveStakingScenario: Scenario = {
  name: "deal-active-staking",
  description: "Post-approval staking: agent increase stake + new agent joins via request → add-stake → evaluate → claim",
  tags: ["deal", "staking", "add-stake", "request", "active-deal", "governance", "multi-agent"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    const agent1Wallet = config.wallets.agent1;
    const agent2Wallet = config.wallets.agent2;
    if (!founderWallet) throw new Error("founder wallet required");
    if (!agent1Wallet) throw new Error("agent1 wallet required");
    if (!agent2Wallet) throw new Error("agent2 wallet required");

    // accountId in the indexer is a composite ID (e.g. "31337-0xabc..."), match with includes()
    const findPos = (positions: Array<Record<string, unknown>> | undefined, address: string) =>
      positions?.find((p) => String(p.accountId ?? "").toLowerCase().includes(address.toLowerCase()));

    const founderStake = "10000000000000000000000"; // 10k
    const agent1InitialStake = "5000000000000000000000"; // 5k
    const agent1IncreaseAmount = "3000000000000000000000"; // 3k
    const agent2StakeAmount = "4000000000000000000000"; // 4k

    // ═════════════════���════════════════════════════════════════════
    // SETUP: Native DAC + deal with founder + agent1 pre-staked
    // ���═══════════════���════════════════════════════���════════════════

    // Deal governance auto-resolves on quorum (all stakers vote), so proposals
    // execute within seconds of voting — no need to push milestones far out.
    const ctx = await setupNativeDacWithDeal(h, {
      dacName: "Active Staking QA DAC",
      dealName: "Active Staking Deal",
      stakeAmount: founderStake,
      rewardsLimit: "100000000000000000000000", // 100k
      milestones: [{
        expectedReturn: "1000000000000000000000", // 1000 tokens
        rewardCurve: ["0", "1000000000000000000"], // linear full reward
        penaltyCurve: ["0"], // no penalty
        timestampDelta: 86400 * 7,
      }],
      extraAgents: [
        {role: "agent1", mintAmount: "50000000000000000000000", stakeAmount: agent1InitialStake},
      ],
    });

    // ════���═══════════════════════════════════���═════════════════════
    // PHASE 1: BASELINE
    // ══════════════��═══════════════════════════════════════════════

    await step(h, "phase1-baseline", async () => {
      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = dealCli.data.deal as Record<string, unknown>;
      assert.defined(deal, "deal in indexer");

      h.log(`Baseline: active=${deal.active}, stakers=${deal.stakerCount}, staked=${deal.currentStakedAmount}`);

      assert.equal(deal.active, true, "deal active");
      assert.equal(deal.closed, false, "deal not closed");
      assert.equal(Number(deal.stakerCount), 2, "two initial stakers");

      const expectedTotal = BigInt(founderStake) + BigInt(agent1InitialStake); // 15k
      assert.equal(
        BigInt(deal.currentStakedAmount as string), expectedTotal,
        "total staked = 15k (10k + 5k)",
      );

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      // Capture positions
      const posCli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>> | undefined;
      assert.defined(positions, "positions snapshot");
      assert.equal(positions?.length, 2, "2 positions");

      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal, positions} as Record<string, unknown>,
      };
    });

    // ════════��═════════════════════════════════════════��═══════════
    // PHASE 2: ALREADY-STAKED AGENT INCREASES STAKE
    // ════════════════���═══════════════════════════════════���═════════

    h.log("Phase 2: agent1 increases stake by 3k via request + add-stake...");

    // Mint more agent tokens to agent1 (they need tokens to approve)
    await step(h, "phase2-mint-agent1-extra", async () => {
      const proposalId = await proposeVoteExecute(h, ctx.dacAddress, [
        "propose", "mint-agent-tokens", agent1IncreaseAmount, agent1Wallet.address,
      ]);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "mint-agent-tokens"],
      };
    });

    await h.syncIndexer();

    // agent1 calls deal request (approves agent tokens to deal cell)
    await step(h, "phase2-request-increase", async () => {
      const cli = await h.cliAs("agent1", [
        "deal", "request", agent1IncreaseAmount,
        "--deal-address", ctx.dealCell, "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.approveTx, "agent1 approval tx");
      h.log(`agent1 request: approveTx=${cli.data.approveTx}`);
      return {cli, command: ["deal", "request"]};
    });

    // Founder proposes add-stake for agent1 via deal governance
    // Both founder + agent1 vote to ensure quorum is met
    await step(h, "phase2-add-stake-proposal", async () => {
      const proposalId = await dealProposeVoteExecuteQuorum(h, ctx.dealAddress, [
        "deal", "propose", "add-stake", agent1Wallet.address, "--from-request", "--dac", ctx.dacAddress,
      ], ["agent1"]);
      h.log(`add-stake proposal ${proposalId} executed for agent1`);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "add-stake"],
      };
    });

    await h.syncIndexer();

    // Verify agent1 position updated
    await step(h, "phase2-verify-increase", async () => {
      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = dealCli.data.deal as Record<string, unknown>;

      const posCli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>> | undefined;

      const agent1Pos = findPos(positions, agent1Wallet.address);

      assert.defined(agent1Pos, "agent1 position exists");
      if (agent1Pos) {
        const agent1Total = BigInt(agent1Pos.totalStakedAmount as string);
        const agent1Current = BigInt(agent1Pos.currentStakedAmount as string);
        const expectedAgent1 = BigInt(agent1InitialStake) + BigInt(agent1IncreaseAmount); // 8k

        h.log(`agent1 position: total=${agent1Total}, current=${agent1Current}, expected=${expectedAgent1}`);
        assert.equal(agent1Total, expectedAgent1, "agent1 totalStakedAmount = 8k (5k + 3k)");
        assert.equal(agent1Current, expectedAgent1, "agent1 currentStakedAmount = 8k");
      }

      // Deal-level totals
      const expectedDealTotal = BigInt(founderStake) + BigInt(agent1InitialStake) + BigInt(agent1IncreaseAmount); // 18k
      assert.equal(
        BigInt(deal.currentStakedAmount as string), expectedDealTotal,
        "deal currentStakedAmount = 18k",
      );
      assert.equal(Number(deal.stakerCount), 2, "still 2 stakers (increase, not new staker)");

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal, positions} as Record<string, unknown>,
      };
    });

    // ═══════════��══════════════════════════════════════��═══════════
    // PHASE 3: NEW AGENT JOINS VIA REQUEST FLOW
    // ══════════════��══════════════════════════════��════════════════

    h.log("Phase 3: agent2 joins active deal via request + add-stake...");

    // Mint agent tokens for agent2
    await step(h, "phase3-mint-agent2", async () => {
      const proposalId = await proposeVoteExecute(h, ctx.dacAddress, [
        "propose", "mint-agent-tokens", "50000000000000000000000", agent2Wallet.address,
      ]);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "mint-agent-tokens"],
      };
    });

    await h.syncIndexer();

    // Invite agent2 to deal whitelist
    await step(h, "phase3-invite-agent2", async () => {
      const cli = await h.cli([
        "deal", "invite", agent2Wallet.address,
        "--deal-address", ctx.dealCell,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "invite tx");
      h.log(`agent2 invited to deal: txHash=${cli.data.txHash}`);
      return {cli, command: ["deal", "invite"]};
    });

    // agent2 requests stake
    await step(h, "phase3-request-stake", async () => {
      const cli = await h.cliAs("agent2", [
        "deal", "request", agent2StakeAmount,
        "--deal-address", ctx.dealCell, "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.approveTx, "agent2 approval tx");
      h.log(`agent2 request: approveTx=${cli.data.approveTx}`);
      return {cli, command: ["deal", "request"]};
    });

    // Founder proposes add-stake for agent2 via deal governance
    // agent2 isn't staked yet so only founder + agent1 vote
    await step(h, "phase3-add-stake-proposal", async () => {
      const proposalId = await dealProposeVoteExecuteQuorum(h, ctx.dealAddress, [
        "deal", "propose", "add-stake", agent2Wallet.address, "--from-request", "--dac", ctx.dacAddress,
      ], ["agent1"]);
      h.log(`add-stake proposal ${proposalId} executed for agent2`);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "add-stake"],
      };
    });

    await h.syncIndexer();

    // Verify new position created
    await step(h, "phase3-verify-new-staker", async () => {
      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = dealCli.data.deal as Record<string, unknown>;

      const posCli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>> | undefined;

      assert.equal(positions?.length, 3, "3 positions (founder + agent1 + agent2)");
      assert.equal(Number(deal.stakerCount), 3, "3 stakers");

      const agent2Pos = findPos(positions, agent2Wallet.address);
      assert.defined(agent2Pos, "agent2 position created");
      if (agent2Pos) {
        h.log(`agent2 position: total=${agent2Pos.totalStakedAmount}, current=${agent2Pos.currentStakedAmount}`);
        assert.equal(
          BigInt(agent2Pos.totalStakedAmount as string), BigInt(agent2StakeAmount),
          "agent2 totalStakedAmount = 4k",
        );
      }

      // Deal-level: 10k + 8k + 4k = 22k
      const expectedTotal = BigInt(founderStake) + BigInt(agent1InitialStake) + BigInt(agent1IncreaseAmount) + BigInt(agent2StakeAmount);
      h.log(`Deal total staked: ${deal.currentStakedAmount}, expected: ${expectedTotal}`);
      assert.equal(
        BigInt(deal.currentStakedAmount as string), expectedTotal,
        "deal currentStakedAmount = 22k (10k + 8k + 4k)",
      );

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal, positions} as Record<string, unknown>,
      };
    });

    // ═══════��═════════════════════════════════��════════════════════
    // PHASE 4: EVALUATE WITH UPDATED STAKES
    // ═════════════════��════════════════════════════════════════════

    h.log("Phase 4: evaluating deal with updated stake distribution...");

    // Mint + transfer tokens for 100%+ progress
    const underlyingToken = ctx.treasuryToken;
    await mintMockToken(h, {token: underlyingToken, to: founderWallet.address, amount: "10000000000000000000000"});

    await step(h, "phase4-deposit", async () => {
      const txHash = await transferErc20(h, {
        token: underlyingToken,
        from: founderWallet.address,
        to: ctx.dealCell,
        amount: "1500000000000000000000", // 1500 tokens (150% of 1000 expectedReturn)
      });
      assert.defined(txHash, "transfer tx");
      return {
        cli: {data: {action: "transfer", txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["transfer"],
      };
    });

    // Advance past milestone
    const milestoneTs = ctx.chainTimestamp + 86400 * 7;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = milestoneTs - currentTs + 3600;
    await h.advanceTime(Math.max(neededAdvance, 3600));

    await step(h, "phase4-evaluate", async () => {
      const cli = await h.cli([
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "evaluate tx");
      return {cli, command: ["deal", "evaluate"]};
    });

    await h.syncIndexer();

    await step(h, "phase4-verify", async () => {
      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = dealCli.data.deal as Record<string, unknown>;

      h.log(`After eval: active=${deal.active}, closed=${deal.closed}, evalCount=${deal.totalEvaluationCount}, allocated=${deal.totalRewardAllocatedAmount}`);

      assert.equal(Number(deal.totalEvaluationCount), 1, "evaluation count = 1");
      assert.equal(BigInt(deal.totalRewardAllocatedAmount as string) > 0n, true, "rewards allocated");

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      // Per-position snapshot for reviewer
      const posCli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>> | undefined;

      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal, positions} as Record<string, unknown>,
      };
    });

    // ═════════════════════════════���═══════════════════════════════���
    // PHASE 5: CLAIMS + UNSTAKE + FINAL ACCOUNTING
    // ══════��════════════════════════════════════���══════════════════

    h.log("Phase 5: claims + unstake...");

    // All 3 agents claim rewards
    await step(h, "phase5-claim-founder", async () => {
      const cli = await h.cli([
        "deal", "claim",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "founder claim tx");
      return {cli, command: ["deal", "claim"]};
    });

    await step(h, "phase5-claim-agent1", async () => {
      const cli = await h.cliAs("agent1", [
        "deal", "claim",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent1 claim tx");
      return {cli, command: ["deal", "claim"]};
    });

    await step(h, "phase5-claim-agent2", async () => {
      const cli = await h.cliAs("agent2", [
        "deal", "claim",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent2 claim tx");
      return {cli, command: ["deal", "claim"]};
    });

    await h.syncIndexer();

    // Verify claims — proportional to updated stakes
    await step(h, "phase5-verify-claims", async () => {
      const posCli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>> | undefined;
      assert.defined(positions, "positions after claims");

      const founderPos = findPos(positions, founderWallet.address);
      const agent1Pos = findPos(positions, agent1Wallet.address);
      const agent2Pos = findPos(positions, agent2Wallet.address);

      if (founderPos && agent1Pos && agent2Pos) {
        const founderClaimed = BigInt(founderPos.totalClaimedMainTokenAmount as string);
        const agent1Claimed = BigInt(agent1Pos.totalClaimedMainTokenAmount as string);
        const agent2Claimed = BigInt(agent2Pos.totalClaimedMainTokenAmount as string);

        h.log(`Claims: founder=${founderClaimed}, agent1=${agent1Claimed}, agent2=${agent2Claimed}`);

        // All should have claimed something
        assert.equal(founderClaimed > 0n, true, "founder claimed rewards");
        assert.equal(agent1Claimed > 0n, true, "agent1 claimed rewards");
        assert.equal(agent2Claimed > 0n, true, "agent2 claimed rewards");

        // Proportionality check: founder(10k) > agent1(8k) > agent2(4k)
        assert.equal(founderClaimed > agent1Claimed, true, "founder (10k) claimed more than agent1 (8k)");
        assert.equal(agent1Claimed > agent2Claimed, true, "agent1 (8k) claimed more than agent2 (4k)");
      }

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {positions} as Record<string, unknown>,
      };
    });

    // All 3 agents unstake
    await step(h, "phase5-unstake-founder", async () => {
      const cli = await h.cli([
        "deal", "unstake",
        "--deal-address", ctx.dealCell,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "founder unstake tx");
      return {cli, command: ["deal", "unstake"]};
    });

    await step(h, "phase5-unstake-agent1", async () => {
      const cli = await h.cliAs("agent1", [
        "deal", "unstake",
        "--deal-address", ctx.dealCell,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent1 unstake tx");
      return {cli, command: ["deal", "unstake"]};
    });

    await step(h, "phase5-unstake-agent2", async () => {
      const cli = await h.cliAs("agent2", [
        "deal", "unstake",
        "--deal-address", ctx.dealCell,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent2 unstake tx");
      return {cli, command: ["deal", "unstake"]};
    });

    await h.syncIndexer();

    // Final verification
    await step(h, "phase5-final-verify", async () => {
      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = dealCli.data.deal as Record<string, unknown>;

      const posCli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>> | undefined;

      h.log(`Final: staked=${deal.currentStakedAmount}, released=${deal.totalReleasedStakeAmount}`);

      assert.equal(BigInt(deal.currentStakedAmount as string), 0n, "all unstaked");

      // Per-position conservation
      for (const p of positions ?? []) {
        const current = BigInt(p.currentStakedAmount as string);
        const slashed = BigInt(p.totalSlashedAmount as string);
        const released = BigInt(p.totalReleasedAmount as string);
        const total = BigInt(p.totalStakedAmount as string);

        assert.equal(current, 0n, `${p.accountId} currentStakedAmount = 0`);
        assert.equal(released > 0n, true, `${p.accountId} released > 0`);
        assert.equal(
          current + slashed + released, total,
          `${p.accountId} stake conservation: current + slashed + released == totalStaked`,
        );
      }

      await verifyDealAccountingInvariants(h, ctx.dealAddress);

      return {
        cli: dealCli,
        command: ["deal", "view", "deal"],
        indexerSnapshot: {deal, positions} as Record<string, unknown>,
      };
    });

    h.log("Active staking scenario completed successfully");
  },
};
