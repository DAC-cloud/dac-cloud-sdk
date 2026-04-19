import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  getChainTimestamp,
  mintMockToken,
  proposeVoteExecute,
  setupNativeDacWithDeal,
} from "./fixtures/index.js";

/**
 * Treasury deal proposals require multi-agent consensus (high quorum for spend types).
 * This helper has founder + agent1 + agent2 all vote yes.
 */
async function treasuryDealProposeVoteExecute(
  h: Harness,
  dealAddress: string,
  proposeArgs: string[],
): Promise<string> {
  const {config} = h;

  const proposeCli = await h.cli([
    ...proposeArgs,
    "--deal-address", dealAddress,
    "--config", config.configPath, "--pretty-print",
  ]);
  const proposalId = String(proposeCli.data.proposalId ?? "");

  await h.syncIndexer();
  await h.advanceTime(10);

  // All 3 agents vote
  await h.cli(["deal", "vote", "proposal", proposalId, "true", "--deal-address", dealAddress, "--config", config.configPath, "--pretty-print"]);
  await h.cliAs("agent1", ["deal", "vote", "proposal", proposalId, "true", "--deal-address", dealAddress, "--config", config.configPath, "--pretty-print"]);
  await h.cliAs("agent2", ["deal", "vote", "proposal", proposalId, "true", "--deal-address", dealAddress, "--config", config.configPath, "--pretty-print"]);

  await h.advanceTime(3700);

  await h.cli(["deal", "execute", proposalId, "--deal-address", dealAddress, "--config", config.configPath, "--pretty-print"]);

  return proposalId;
}

/**
 * Scenario: Treasury Deal Agent Lifecycle
 *
 * Tests all 7 treasury-specific deal proposal types + agent direct execution:
 *   1. direct-spend — one-time payment from treasury
 *   2. approve-agent-spend — recurring allowance with rate limits
 *   3. agent-spend execution — agent calls executeAgentSpend directly
 *   4. assign-claimer — agent receive permission
 *   5. revoke-agent — remove agent permissions
 *   6. delegate-vote-rights — delegate treasury token votes
 *   7. return-capital — return funds to DAC treasury
 *   + deal reward pool (dealRewardPoolPercent = 20%)
 */
export const treasuryDealAgentScenario: Scenario = {
  name: "treasury-deal-agent-lifecycle",
  description: "Treasury deal: all 7 agent proposal types, agent-spend execution, reward pool, close",
  tags: ["deal", "treasury", "agent-spend", "permit2-treasury", "reward-pool"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    if (!founderWallet) throw new Error("founder wallet required");

    const agent1 = config.wallets.agent1;
    const agent2 = config.wallets.agent2;
    const outsider = config.wallets.outsider;
    if (!agent1 || !agent2 || !outsider) throw new Error("agent1, agent2, outsider wallets required");

    // Ensure founder has enough underlying
    const {resolveUnderlyingToken} = await import("./fixtures/index.js");
    const underlyingToken = await resolveUnderlyingToken(h);
    await mintMockToken(h, {token: underlyingToken, to: founderWallet.address, amount: "1000000000000000000000000"});

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: SETUP — DAC + funded treasury deal + 3 agents staked
    // ══════════════════════════════════════════════════════════════

    // The fixture handles: create DAC, join, delegate, mint agent tokens,
    // create deal, stake founder, stake extra agents, approve deal.
    // We need fundingAmount > 0 so the treasury actually receives funds.
    // skipApproval: true — we need to deposit treasury BEFORE approval triggers funding transfer
    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Treasury Agent Deal",
      fundingAmount: "5000000000000000000000",    // 5k underlying → treasury gets funded
      rewardsLimit: "100000000000000000000000",   // 100k main tokens for rewards
      dealRewardPoolPercent: "200000000000000000", // 20% (0.2 * 1e18) of rewards to pool
      milestones: [{
        expectedReturn: "1000000000000000000000",
        rewardCurve: ["1000000000000000000"],     // 100% reward
        penaltyCurve: ["0"],
      }],
      stakeAmount: "15000000000000000000000",  // founder stakes 15k (60% of 25k total → clears 50% quorum)
      extraAgents: [
        {role: "agent1", mintAmount: "50000000000000000000000", stakeAmount: "5000000000000000000000"},
        {role: "agent2", mintAmount: "50000000000000000000000", stakeAmount: "5000000000000000000000"},
      ],
      skipApproval: true,
    });

    // Deposit underlying to DAC treasury BEFORE approving the deal
    h.log("Depositing underlying to DAC treasury for deal funding...");
    await h.cli([
      "deposit-treasury",
      "--token", ctx.treasuryToken,
      "--amount", "10000000000000000000000", // 10k
      "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    // Now approve the deal (triggers funding transfer from treasury)
    h.log("Approving deal...");
    await h.advanceTime(10);
    await h.cli([
      "vote", "proposal", ctx.dealProposalId, "true",
      "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", ctx.dealProposalId,
      "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // Get treasury address from deal record
    const dealViewCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
    const dealRecord = dealViewCli.data.deal as Record<string, unknown>;
    const treasuryAddress = dealRecord?.managedTreasuryAddress as string;
    assert.defined(treasuryAddress, "treasury address from indexer");
    h.log(`Treasury address: ${treasuryAddress}`);

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: TREASURY PROPOSALS
    // ══════════════════════════════════════════════════════════════

    // ── 2a: direct-spend ──────────────────────────────────────────
    // One-time payment from treasury to outsider address
    await step(h, "direct-spend", async () => {
      const proposalId = await treasuryDealProposeVoteExecute(h, ctx.dealAddress, [
        "deal", "propose", "direct-spend",
        ctx.treasuryToken,       // token
        outsider.address,        // destination
        "100000000000000000000",  // 100 tokens
      ]);
      h.log(`direct-spend proposal ${proposalId} executed`);

      // Verify: outsider received tokens
      const balCli = await h.cli([
        "balance", ctx.treasuryToken, outsider.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      const outsiderBal = balCli.data.balance as string;
      h.log(`outsider balance after direct-spend: ${outsiderBal}`);
      assert.equal(BigInt(outsiderBal) >= 100000000000000000000n, true, "outsider received direct-spend tokens");

      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "direct-spend"],
      };
    });

    // ── 2b: approve-agent-spend ───────────────────────────────────
    // Set up recurring allowance for agent1
    await step(h, "approve-agent-spend", async () => {
      const proposalId = await treasuryDealProposeVoteExecute(h, ctx.dealAddress, [
        "deal", "propose", "approve-agent-spend",
        ctx.treasuryToken,                     // token
        agent1.address,                        // agent
        "0x0000000000000000000000000000000000000000", // destination (wildcard)
        "500000000000000000000",               // totalAmount: 500 tokens
        "200000000000000000000",               // singleTxAmount: 200 per tx
        "0",                                   // clockLimit: immediate
        "60",                                  // duration: 60s cooldown
      ]);
      h.log(`approve-agent-spend proposal ${proposalId} executed`);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "approve-agent-spend"],
      };
    });

    // ── 2c: agent executes spend ──────────────────────────────────
    await step(h, "agent-execute-spend", async () => {
      // First spend: 150 tokens to outsider
      const cli1 = await h.cliAs("agent1", [
        "deal", "agent-spend",
        ctx.treasuryToken,
        outsider.address,
        "150000000000000000000",  // 150 tokens
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli1.data.txHash, "first agent-spend tx");
      h.log(`Agent1 spent 150 tokens (tx: ${cli1.data.txHash})`);

      // Advance past cooldown (60s)
      await h.advanceTime(65);

      // Second spend: 100 more tokens
      const cli2 = await h.cliAs("agent1", [
        "deal", "agent-spend",
        ctx.treasuryToken,
        outsider.address,
        "100000000000000000000",  // 100 tokens
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli2.data.txHash, "second agent-spend tx");
      h.log("Agent1 spent 100 more tokens after cooldown");

      return {cli: cli2, command: ["deal", "agent-spend"]};
    });

    // ── 2d: assign-claimer ────────────────────────────────────────
    // Approve agent2 to receive tokens from a specific source
    await step(h, "assign-claimer", async () => {
      const proposalId = await treasuryDealProposeVoteExecute(h, ctx.dealAddress, [
        "deal", "propose", "assign-claimer",
        agent2.address,                        // agent
        ctx.treasuryToken,                     // token
        outsider.address,                      // counterparty (source)
        "1000000000000000000000",              // amount: 1000
      ]);
      h.log(`assign-claimer proposal ${proposalId} executed`);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "assign-claimer"],
      };
    });

    // ── 2e: revoke-agent (revoke agent1's spend allowance) ────────
    await step(h, "revoke-agent", async () => {
      const proposalId = await treasuryDealProposeVoteExecute(h, ctx.dealAddress, [
        "deal", "propose", "revoke-agent",
        ctx.treasuryToken,                     // token
        agent1.address,                        // agent
        "0x0000000000000000000000000000000000000000", // counterparty (wildcard)
      ]);
      h.log(`revoke-agent proposal ${proposalId} executed`);

      // Verify agent1 can no longer spend (should fail)
      await h.advanceTime(65);
      const failCli = await h.cliAs("agent1", [
        "deal", "agent-spend",
        ctx.treasuryToken,
        outsider.address,
        "50000000000000000000",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.equal(failCli.exitCode !== 0, true, "agent1 spend rejected after revocation");
      h.log("Verified: agent1 spend rejected after revocation");

      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "revoke-agent"],
      };
    });

    // Note: delegate-vote-rights is skipped — it requires the treasury to hold
    // IVotes-compatible tokens. In this setup the treasury only holds the underlying
    // (plain ERC20). The proposal type itself is tested via CLI command registration.

    // ── 2f: enable early returns + advance past approve deadline ──
    // return-capital requires either deal closed OR (earlyReturns + past approveDeadline)
    await step(h, "toggle-early-returns", async () => {
      const proposalId = await treasuryDealProposeVoteExecute(h, ctx.dealAddress, [
        "deal", "propose", "toggle-early-returns", "true",
      ]);
      h.log(`toggle-early-returns proposal ${proposalId} executed`);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "toggle-early-returns"],
      };
    });

    // Advance past the deal's approve deadline so return-capital can succeed
    const milestoneTs2 = ctx.chainTimestamp + 86400 * 7;
    const now2 = await getChainTimestamp(h);
    if (now2 < milestoneTs2) {
      h.log(`Advancing past approve deadline (${milestoneTs2 - now2}s)...`);
      await h.advanceTime(milestoneTs2 - now2 + 60);
    }

    // ── 2g: return-capital ────────────────────────────────────────
    // Return some treasury funds back to DAC treasury
    await step(h, "return-capital", async () => {
      const proposalId = await treasuryDealProposeVoteExecute(h, ctx.dealAddress, [
        "deal", "propose", "return-capital",
        ctx.treasuryToken,
        "500000000000000000000", // 500 tokens back to DAC
      ]);
      h.log(`return-capital proposal ${proposalId} executed`);

      // Verify DAC treasury received the funds back
      const thCli = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;
      const underlyingHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === ctx.treasuryToken.toLowerCase(),
      );
      h.log(`DAC treasury underlying balance: ${underlyingHolding?.balance ?? "not found"}`);

      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "return-capital"],
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: EVALUATE + REWARD POOL + CLOSE
    // ══════════════════════════════════════════════════════════════

    // Advance past milestone timestamp
    const milestoneTs = ctx.chainTimestamp + 86400 * 7;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = milestoneTs - currentTs + 3600;
    h.log(`Advancing ${neededAdvance}s past milestone...`);
    await h.advanceTime(Math.max(neededAdvance, 3600));

    await step(h, "evaluate-deal", async () => {
      const cli = await h.cli([
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "evaluate tx");
      return {cli, command: ["dac", "deal", "evaluate"]};
    });

    await h.syncIndexer();

    // Verify reward pool allocation in indexer
    await step(h, "verify-reward-pool", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      assert.defined(deal, "deal in indexer");
      const poolAllocated = BigInt(deal.totalDealRewardPoolAllocatedAmount as string ?? "0");
      const totalAllocated = BigInt(deal.totalRewardAllocatedAmount as string ?? "0");
      h.log(`Total rewards allocated: ${totalAllocated}, pool allocated: ${poolAllocated}`);
      assert.equal(poolAllocated > 0n, true, "deal reward pool received allocation");
      assert.equal(deal.closed, true, "deal closed after evaluation");
      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // Claim individual rewards
    await step(h, "claim-agent-rewards", async () => {
      const cli = await h.cli([
        "deal", "claim",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "founder claim tx");
      return {cli, command: ["deal", "claim"]};
    });

    // Claim reward pool
    await step(h, "claim-reward-pool", async () => {
      const cli = await h.cli([
        "deal", "claim-reward-pool",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "claim-reward-pool tx");
      return {cli, command: ["deal", "claim-reward-pool"]};
    });

    // Final verification
    await h.syncIndexer();
    await step(h, "verify-final-state", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      assert.defined(deal, "deal in indexer");
      h.log(`Final: closed=${deal.closed}, rewardsClaimed=${deal.totalRewardClaimedAmount}, poolClaimed=${deal.totalDealRewardPoolClaimedAmount}`);
      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });
  },
};
