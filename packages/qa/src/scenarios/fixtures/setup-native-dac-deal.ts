import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {step} from "../../harness/index.js";
import type {Harness} from "../../harness/types.js";
import {getChainTimestamp, proposeVoteExecute, resolveUnderlyingToken, ZERO_ADDR} from "./common.js";

export interface MilestoneConfig {
  milestoneType?: number;
  token?: string;       // defaults to treasuryToken
  oracle?: string;
  valuationMode?: number;
  fundingToken?: string;
  expectedReturn: string;
  timestamp?: number;    // absolute; defaults to chainTimestamp + 7 days
  timestampDelta?: number; // relative to chainTimestamp (overrides timestamp default if set)
  rewardPercentage?: string;
  rewardCurve?: string[];
  penaltyCurve?: string[];
  minPercentGrace?: string;
  extension?: string;
}

export interface AgentStakeConfig {
  /** Wallet role name (e.g. "agent1") — must exist in config.wallets */
  role: string;
  /** Mint amount for this agent (default: same as agentMintAmount) */
  mintAmount?: string;
  /** Stake amount for this agent (default: same as stakeAmount) */
  stakeAmount?: string;
}

export interface DealSetupOptions {
  /** DAC name (default: "QA Deal DAC") */
  dacName?: string;
  /** Deal name (default: "QA Test Deal") */
  dealName?: string;
  /** Agent token mint amount (default: 100k * 1e18) */
  agentMintAmount?: string;
  /** Stake amount (default: 10k * 1e18) */
  stakeAmount?: string;
  /** Deal funding amount from treasury (default: "0") */
  fundingAmount?: string;
  /** Rewards limit for the deal (default: "100000000000000000000000" = 100k) */
  rewardsLimit?: string;
  /** Deal reward pool percent in mantissa (default: "0") */
  dealRewardPoolPercent?: string;
  /** Milestones for the evaluator */
  milestones?: MilestoneConfig[];
  /** Reward share for evaluator (default: 1e18 = 100%) */
  rewardShare?: string;
  /** Approve deadline in seconds from chainTimestamp (default: 7 days) */
  approveDeadlineDelta?: number;
  /** Evaluation deadline in seconds from chainTimestamp (default: 15 days) */
  evaluationDeadlineDelta?: number;
  /** Deal deadline in seconds from chainTimestamp (default: 60 days) */
  dealDeadlineDelta?: number;
  /** Enable veto (default: false) */
  vetoEnabled?: boolean;
  /** Additional agents to join DAC, mint tokens, and stake into the deal */
  extraAgents?: AgentStakeConfig[];
  /** Skip deal approval — leave the deal in pending state (default: false) */
  skipApproval?: boolean;
  /** Treasury seed amount for existing-token DAC (default: "1000000000000000000000" = 1k).
   *  For deals with rewards, this must be >= rewardsLimit since it's the only way to
   *  fund the AssetController's mainToken balance. Ignored for native DAC. */
  treasurySeedAmount?: string;
}

export interface DealContext {
  dacAddress: string;
  agentTokenAddress: string;
  mainTokenAddress: string;
  dealManagerAddress: string;
  dealAddress: string;
  dealCell: string;
  dealNumericId: string;
  dealProposalId: string;
  treasuryToken: string;
  chainTimestamp: number;
  founderAddress: string;
}

/**
 * Set up a native DAC with an approved deal, ready for evaluation or other lifecycle actions.
 *
 * Flow: create DAC → join → delegate → mint agent tokens → propose/vote/execute →
 *       create deal → stake → propose/vote/execute deal approval → verify active.
 */
export async function setupNativeDacWithDeal(h: Harness, opts: DealSetupOptions = {}): Promise<DealContext> {
  const {assert, config} = h;
  const founderWallet = config.wallets.founder;
  if (!founderWallet) throw new Error("founder wallet required");

  const treasuryToken = await resolveUnderlyingToken(h);

  // ── Create native DAC ──────────────────────────────────────────

  const createCli = await h.cli([
    "create",
    "--name", opts.dacName ?? "QA Deal DAC",
    "--description", "QA automated deal testing",
    "--symbol", "QDEAL",
    "--max-supply", "10000000000000000000000000",
    "--default-quorum", "50",
    "--allocation", "1000000000000000000000000",
    "--treasury-token", treasuryToken,
    "--commitment", "0",
    "--auto-delegate",
    "--config", config.configPath,
    "--pretty-print",
  ]);
  const dacAddress = createCli.data.dac as string;
  const agentTokenAddress = createCli.data.agentToken as string;
  const mainTokenAddress = createCli.data.mainToken as string;

  await h.syncIndexer();

  // ── Join + delegate ────────────────────────────────────────────

  await h.cli([
    "join", "--dac", dacAddress, "--auto-approve",
    "--config", config.configPath, "--pretty-print",
  ]);

  await h.cli([
    "delegate", "--delegatee", founderWallet.address, "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  await h.syncIndexer();

  // ── Get deal manager ───────────────────────────────────────────

  const dacViewCli = await h.view("dac", ["--dac", dacAddress]);
  const dacRecord = dacViewCli.data.dac as Record<string, unknown>;
  const dealManagerAddress = dacRecord.dealManagerAddress as string;

  // ── Mint agent tokens ──────────────────────────────────────────

  const mintAmount = opts.agentMintAmount ?? "100000000000000000000000";
  h.log(`Minting ${mintAmount} agent tokens...`);

  await proposeVoteExecute(h, dacAddress, [
    "propose", "mint-agent-tokens", mintAmount, founderWallet.address,
  ]);

  await h.syncIndexer();

  // ── Create deal ────────────────────────────────────────────────

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
    token: m.token ?? treasuryToken,
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
    description: "QA automated deal",
    linkHash: "seed://qa-deal",
    fundingToken: treasuryToken,
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

  const dealConfigPath = join(tmpdir(), `qa-deal-${Date.now()}.json`);
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

  // ── Stake before approval ──────────────────────────────────────

  await h.syncIndexer();

  const stakeAmount = opts.stakeAmount ?? "10000000000000000000000";
  h.log(`Staking ${stakeAmount} agent tokens...`);

  await h.cli([
    "deal", "stake", stakeAmount,
    "--deal-address", dealCell, "--dac", dacAddress, "--auto-delegate",
    "--config", config.configPath, "--pretty-print",
  ]);

  // ── Extra agents: invite + mint + stake (before approval) ───────
  // Staking requires !isApproved(), so agents must stake BEFORE deal approval.
  // The proposer (founder) has invite rights — use DealCell.invite() to whitelist
  // each agent, then mint their agent tokens via DAC governance, then they stake.

  for (const agent of opts.extraAgents ?? []) {
    const wallet = config.wallets[agent.role];
    if (!wallet) throw new Error(`Wallet role "${agent.role}" not found in config`);

    h.log(`Agent ${agent.role} (${wallet.address}) inviting, minting, and staking...`);

    // Invite agent to deal whitelist (founder has invite rights as proposer)
    await h.cli([
      "deal", "invite", wallet.address,
      "--deal-address", dealCell,
      "--config", config.configPath,
      "--pretty-print",
    ]);

    // Mint agent tokens for this agent (requires DAC governance)
    const agentMint = agent.mintAmount ?? mintAmount;
    await proposeVoteExecute(h, dacAddress, [
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

  // ── Approve deal ───────────────────────────────────────────────

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
      treasuryToken,
      chainTimestamp,
      founderAddress: founderWallet.address,
    };
  }

  h.log("Approving deal...");

  await h.advanceTime(10);
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

  // ── Verify deal is active ──────────────────────────────────────

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
    treasuryToken,
    chainTimestamp,
    founderAddress: founderWallet.address,
  };
}
