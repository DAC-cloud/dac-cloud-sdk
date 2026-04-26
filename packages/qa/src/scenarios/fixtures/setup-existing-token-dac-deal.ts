import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {step} from "../../harness/index.js";
import type {Harness} from "../../harness/types.js";
import {getChainTimestamp, mintMockToken, resolveUnderlyingToken, ZERO_ADDR} from "./common.js";
import type {DealContext, DealSetupOptions, MilestoneConfig} from "./setup-native-dac-deal.js";

export interface ExistingTokenDealContext extends DealContext {
  wrappedMainTokenAddress: string;
  underlyingTokenAddress: string;
}

/**
 * Propose → vote → execute a DAC proposal on an existing-token DAC using the fallback voting path.
 *
 * Key difference from native `proposeVoteExecute`: existing-token proposals start in
 * AwaitingOracleSnapshot phase. We must advance past oracle-publish-deadline + fallback-warmup
 * before the first vote auto-transitions the proposal to FallbackVoting.
 *
 * Assumes the DAC was created with oracle-publish-deadline=30, fallback-warmup-duration=10.
 */
export async function existingTokenProposeVoteExecute(
  h: Harness,
  dacAddress: string,
  proposeArgs: string[],
): Promise<string> {
  const {config} = h;

  const proposeCli = await h.cli([
    ...proposeArgs,
    "--dac", dacAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);
  const proposalId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");

  await h.syncIndexer();

  // Advance past oracle-publish-deadline (30s) + fallback-warmup (10s) + buffer
  await h.advanceTime(45);

  // Vote — first vote auto-transitions from AwaitingOracleSnapshot → FallbackVoting
  await h.cli([
    "vote", "proposal", proposalId, "true",
    "--dac", dacAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  // Advance past voting duration (3600s)
  await h.advanceTime(3700);

  await h.cli([
    "execute", proposalId,
    "--dac", dacAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  return proposalId;
}

/**
 * Set up an existing-token DAC with an approved deal, ready for evaluation or other lifecycle actions.
 *
 * Flow: mint underlying → create-existing-token DAC (no oracle, fallback-only) → wrap → mint agent tokens
 *       (fallback voting) → create deal → stake → approve deal (fallback voting) → verify active.
 *
 * Uses fallback voting path (no oracle configured). The DAC is created with short
 * oracle-publish-deadline (30s) and fallback-warmup (10s) for fast test execution.
 */
export async function setupExistingTokenDacWithDeal(h: Harness, opts: DealSetupOptions = {}): Promise<ExistingTokenDealContext> {
  const {assert, config} = h;
  const founderWallet = config.wallets.founder;
  if (!founderWallet) throw new Error("founder wallet required");

  const underlyingToken = resolveUnderlyingToken(h);

  // ── Mint underlying tokens to founder (for treasury seed + wrapping + later ops) ──

  h.log("Minting underlying tokens for existing-token DAC setup...");
  await mintMockToken(h, {token: underlyingToken, to: founderWallet.address, amount: "100000000000000000000000"}); // 100k

  // ── Create existing-token DAC (fallback-only, no oracle) ──────

  h.log("Creating existing-token DAC...");
  const dacCreateCli = await h.cli([
    "create-existing-token",
    "--name", opts.dacName ?? "QA Existing Token Deal DAC",
    "--description", "QA automated existing-token deal testing",
    "--symbol", "QETD",
    "--underlying-token", underlyingToken,
    "--treasury-seed-amount", opts.treasurySeedAmount ?? "1000000000000000000000", // default 1000 tokens seed
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
    "--config", config.configPath,
    "--pretty-print",
  ]);

  const dacAddress = dacCreateCli.data.dac as string;
  const agentTokenAddress = dacCreateCli.data.agentToken as string;
  const mainTokenAddress = (dacCreateCli.data.mainToken ?? dacCreateCli.data.wrappedMainToken) as string;
  const wrappedMainTokenAddress = (dacCreateCli.data.wrappedMainToken ?? dacCreateCli.data.mainToken) as string;

  assert.isAddress(dacAddress, "DAC address valid");

  await h.syncIndexer();

  // ── Wrap additional tokens for voting power + reward capacity ──
  // For existing-token DAC, rewards are paid in WrappedMainToken. The
  // AssetController needs WrappedMainToken supply to back reward allocations.
  // We wrap a generous amount to cover both governance and reward needs.

  h.log("Wrapping tokens for voting power + reward capacity...");
  await h.cli([
    "wrap", "--amount", "20000000000000000000000", // 20k tokens
    "--dac", dacAddress, "--auto-approve",
    "--config", config.configPath, "--pretty-print",
  ]);

  // ── Get deal manager ──────────────────────────────────────────

  const dacViewCli = await h.view("dac", ["--dac", dacAddress]);
  const dacRecord = dacViewCli.data.dac as Record<string, unknown>;
  const dealManagerAddress = dacRecord.dealManagerAddress as string;

  // ── Mint agent tokens (fallback voting) ────────────────────────

  const mintAmount = opts.agentMintAmount ?? "100000000000000000000000";
  h.log(`Minting ${mintAmount} agent tokens via fallback voting...`);

  await existingTokenProposeVoteExecute(h, dacAddress, [
    "propose", "mint-agent-tokens", mintAmount, founderWallet.address,
  ]);

  await h.syncIndexer();

  // ── Create deal ───────────────────────────────────────────────

  const chainTimestamp = await getChainTimestamp(h);

  const approveDeadlineDelta = opts.approveDeadlineDelta ?? 86400 * 7;
  const evaluationDeadlineDelta = opts.evaluationDeadlineDelta ?? 86400 * 15;
  const dealDeadlineDelta = opts.dealDeadlineDelta ?? 86400 * 60;

  const defaultMilestone: MilestoneConfig = {
    expectedReturn: "1000000000000000000000",
    rewardCurve: ["0"],
    penaltyCurve: ["1000000000000000000"],
  };
  const milestones = (opts.milestones ?? [defaultMilestone]).map((m) => ({
    milestoneType: m.milestoneType ?? 0,
    token: m.token ?? underlyingToken,
    oracle: m.oracle ?? ZERO_ADDR,
    valuationMode: m.valuationMode ?? 0,
    fundingToken: m.fundingToken ?? ZERO_ADDR,
    expectedReturn: m.expectedReturn,
    timestamp: String(m.timestamp ?? chainTimestamp + (m.timestampDelta ?? 86400 * 7)),
    rewardPercentage: m.rewardPercentage ?? "1000000000000000000",
    rewardCurve: m.rewardCurve ?? ["0"],
    penaltyCurve: m.penaltyCurve ?? ["1000000000000000000"],
    minPercentGrace: m.minPercentGrace ?? "0",
    extension: m.extension ?? "0",
  }));

  const dealConfig = {
    dealKind: "permit2-treasury",
    name: opts.dealName ?? "QA Test Deal",
    description: "QA automated deal (existing-token DAC)",
    linkHash: "seed://qa-existing-token-deal",
    fundingToken: underlyingToken,
    fundingAmount: opts.fundingAmount ?? "0",
    rewardsLimit: opts.rewardsLimit ?? "100000000000000000000000",
    dealRewardPoolPercent: opts.dealRewardPoolPercent ?? "0",
    approveDeadline: String(chainTimestamp + approveDeadlineDelta),
    evaluationDeadline: String(chainTimestamp + evaluationDeadlineDelta),
    dealDeadline: String(chainTimestamp + dealDeadlineDelta),
    dealConfig: {},
    evaluatorSelector: "milestones-evaluator",
    evaluatorConfig: {
      rewardShare: opts.rewardShare ?? "1000000000000000000",
      milestones,
    },
    vetoEnabled: opts.vetoEnabled ?? false,
    agentsLimit: "0",
    minimalStake: "0",
  };

  const dealConfigPath = join(tmpdir(), `qa-existing-token-deal-${Date.now()}.json`);
  writeFileSync(dealConfigPath, JSON.stringify(dealConfig, null, 2));

  h.log("Creating deal...");

  const dealCli = await h.cli([
    "deal", "create", dealConfigPath, "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  const dealAddress = dealCli.data.dealAddress as string;
  const dealCell = dealCli.data.dealCell as string;
  const dealNumericId = String(dealCli.data.dealId ?? "");
  const dealProposalId = String(dealCli.data.dacProposalId ?? "");

  // ── Stake before approval ─────────────────────────────────────

  await h.syncIndexer();

  const stakeAmount = opts.stakeAmount ?? "10000000000000000000000";
  h.log(`Staking ${stakeAmount} agent tokens...`);

  await h.cli([
    "deal", "stake", stakeAmount,
    "--deal-address", dealCell, "--dac", dacAddress, "--auto-delegate",
    "--config", config.configPath, "--pretty-print",
  ]);

  // ── Extra agents: invite + mint + stake (before approval) ──────

  for (const agent of opts.extraAgents ?? []) {
    const wallet = config.wallets[agent.role];
    if (!wallet) throw new Error(`Wallet role "${agent.role}" not found in config`);

    h.log(`Agent ${agent.role} (${wallet.address}) inviting, minting, and staking...`);

    // Invite agent to deal whitelist
    await h.cli([
      "deal", "invite", wallet.address,
      "--deal-address", dealCell,
      "--config", config.configPath,
      "--pretty-print",
    ]);

    // Mint agent tokens for this agent (fallback voting)
    const agentMint = agent.mintAmount ?? mintAmount;
    await existingTokenProposeVoteExecute(h, dacAddress, [
      "propose", "mint-agent-tokens", agentMint, wallet.address,
    ]);

    await h.syncIndexer();

    // Stake into the deal
    const agentStake = agent.stakeAmount ?? stakeAmount;
    await h.cliAs(agent.role, [
      "deal", "stake", agentStake,
      "--deal-address", dealCell, "--dac", dacAddress, "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);
  }

  // ── Approve deal (fallback voting) ────────────────────────────

  if (opts.skipApproval) {
    h.log("Skipping deal approval (skipApproval=true)");

    return {
      dacAddress,
      agentTokenAddress,
      mainTokenAddress,
      dealManagerAddress,
      dealAddress,
      dealCell,
      dealNumericId,
      dealProposalId,
      treasuryToken: underlyingToken,
      chainTimestamp,
      founderAddress: founderWallet.address,

      wrappedMainTokenAddress,
      underlyingTokenAddress: underlyingToken,
    };
  }

  h.log("Approving deal via fallback voting...");

  // Advance past oracle-publish-deadline + fallback-warmup + buffer
  await h.advanceTime(45);

  await h.cli([
    "vote", "proposal", dealProposalId, "true", "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);
  await h.advanceTime(3700);
  await h.cli([
    "execute", dealProposalId, "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  await h.syncIndexer();

  // ── Verify deal is active ─────────────────────────────────────

  const verifyCli = await h.dealView("deal", ["--deal-address", dealAddress]);
  const deal = verifyCli.data.deal as Record<string, unknown>;
  assert.equal(deal.active, true, "deal is active after approval");
  assert.equal(deal.closed, false, "deal is not closed");

  h.log(`Deal ready: address=${dealAddress}, cell=${dealCell}, numericId=${dealNumericId}`);

  return {
    dacAddress,
    agentTokenAddress,
    mainTokenAddress,
    dealManagerAddress,
    dealAddress,
    dealCell,
    dealNumericId,
    dealProposalId,
    treasuryToken: underlyingToken,
    chainTimestamp,
    founderAddress: founderWallet.address,
    wrappedMainTokenAddress,
    underlyingTokenAddress: underlyingToken,
  };
}
