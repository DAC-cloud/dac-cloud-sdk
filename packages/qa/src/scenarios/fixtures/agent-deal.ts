import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {erc20Abi, erc20VotesAbi} from "@dac-cloud/core";
import {createPublicClient, http, type Address} from "viem";
import type {CliResult, Harness} from "../../harness/types.js";
import {getChainTimestamp, resolveUnderlyingToken, ZERO_ADDR} from "./common.js";

/**
 * Write a JSON payload to a temp file and return its path (CLI `--input` and
 * `deal create` take file paths).
 */
export function writeJsonFile(payload: unknown, label: string): string {
  const path = join(tmpdir(), `qa-${label}-${Date.now()}.json`);
  writeFileSync(path, JSON.stringify(payload, null, 2));
  return path;
}

/**
 * Propose → vote → execute a DAC proposal on a native DAC as a specific wallet role.
 */
export async function proposeVoteExecuteAs(
  h: Harness,
  role: string,
  dacAddress: string,
  proposeArgs: string[],
): Promise<string> {
  const {config} = h;

  const proposeCli = await h.cliAs(role, [
    ...proposeArgs,
    "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);
  const proposalId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");

  await h.syncIndexer();
  await h.advanceTime(10);

  await h.cliAs(role, [
    "vote", "proposal", proposalId, "true",
    "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  await h.advanceTime(3700);

  await h.cliAs(role, [
    "execute", proposalId,
    "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  return proposalId;
}

export interface DealCycleResult {
  proposalId: string;
  propose: CliResult;
  execute: CliResult;
}

/**
 * Propose → vote → execute a deal proposal as one wallet role that holds a
 * resolving share of the deal's stake.
 *
 * Executes ~70s after the proposal is created rather than after the full voting
 * duration: the vote resolves the proposal on quorum, and AgentDeal flows nest a
 * host proposal inside a home one — a HOST_VOTE that took a whole home voting
 * period to land would find the host proposal already closed.
 */
export async function dealProposeVoteExecuteAs(
  h: Harness,
  role: string,
  dealAddress: string,
  proposeArgs: string[],
  opts: {allowExecuteFailure?: boolean} = {},
): Promise<DealCycleResult> {
  const {config} = h;

  const propose = await h.cliAs(role, [
    ...proposeArgs,
    "--deal-address", dealAddress,
    "--config", config.configPath, "--pretty-print",
  ]);
  const proposalId = String(propose.data.proposalId ?? propose.data.id ?? "");

  await h.syncIndexer();
  await h.advanceTime(10);

  await h.cliAs(role, [
    "deal", "vote", "proposal", proposalId, "true",
    "--deal-address", dealAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  await h.advanceTime(60);

  const execute = await h.cliAs(role, [
    "deal", "execute", proposalId,
    "--deal-address", dealAddress,
    "--config", config.configPath, "--pretty-print",
  ], {allowFailure: opts.allowExecuteFailure});

  return {proposalId, propose, execute};
}

/**
 * Deal JSON (the `dac deal create` / `host-create-deal --input` format) with a
 * single holdings-mode milestone. Deadlines are relative to chain time.
 */
export async function buildMilestoneDealJson(
  h: Harness,
  opts: {
    dealKind: "permit2-treasury" | "agent-deal";
    name: string;
    dealTarget?: string;
    rewardsLimit?: string;
    expectedReturn?: string;
  },
): Promise<Record<string, unknown>> {
  const treasuryToken = resolveUnderlyingToken(h);
  const chainTimestamp = await getChainTimestamp(h);

  return {
    dealKind: opts.dealKind,
    name: opts.name,
    description: "QA automated agent-deal flow",
    linkHash: "seed://qa-agent-deal",
    ...(opts.dealTarget ? {dealTarget: opts.dealTarget} : {}),
    fundingToken: treasuryToken,
    fundingAmount: "0",
    rewardsLimit: opts.rewardsLimit ?? "1000000000000000000000",
    dealRewardPoolPercent: "0",
    approveDeadline: String(chainTimestamp + 86400 * 7),
    evaluationDeadline: String(chainTimestamp + 86400 * 15),
    dealDeadline: String(chainTimestamp + 86400 * 60),
    dealConfig: {},
    evaluatorSelector: "milestones-evaluator",
    evaluatorConfig: {
      rewardShare: "1000000000000000000",
      milestones: [{
        milestoneType: 0,
        token: treasuryToken,
        oracle: ZERO_ADDR,
        valuationMode: 0,
        fundingToken: ZERO_ADDR,
        expectedReturn: opts.expectedReturn ?? "1000000000000000000000",
        timestamp: String(chainTimestamp + 86400 * 7),
        rewardPercentage: "1000000000000000000",
        rewardCurve: ["0"],
        penaltyCurve: ["1000000000000000000"],
        minPercentGrace: "0",
        extension: "0",
        excludePrincipal: false,
      }],
    },
    vetoEnabled: false,
    agentsLimit: "0",
    minimalStake: "0",
  };
}

export interface NativeDacContext {
  dacAddress: string;
  mainTokenAddress: string;
  agentTokenAddress: string;
  dealManagerAddress: string;
  treasuryHolderAddress: string;
  founderAddress: string;
}

/**
 * Create a native DAC as `role`, fulfil the root capital call and self-delegate.
 */
export async function createNativeDacAs(
  h: Harness,
  role: string,
  opts: {name: string; symbol: string},
): Promise<NativeDacContext> {
  const {config} = h;
  const wallet = config.wallets[role];
  if (!wallet) throw new Error(`Wallet role "${role}" not found in config`);

  const createCli = await h.cliAs(role, [
    "create",
    "--name", opts.name,
    "--description", "QA automated agent-deal testing",
    "--symbol", opts.symbol,
    "--max-supply", "10000000000000000000000000",
    "--default-quorum", "50",
    "--allocation", "1000000000000000000000000",
    "--treasury-token", resolveUnderlyingToken(h),
    "--commitment", "0",
    "--auto-delegate",
    "--config", config.configPath, "--pretty-print",
  ]);
  const dacAddress = createCli.data.dac as string;

  await h.syncIndexer();

  await h.cliAs(role, [
    "join", "--dac", dacAddress, "--auto-approve",
    "--config", config.configPath, "--pretty-print",
  ]);
  await h.cliAs(role, [
    "delegate", "--delegatee", wallet.address, "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  await h.syncIndexer();

  const dacViewCli = await h.view("dac", ["--dac", dacAddress]);
  const dacRecord = dacViewCli.data.dac as Record<string, unknown>;

  return {
    dacAddress,
    mainTokenAddress: createCli.data.mainToken as string,
    agentTokenAddress: createCli.data.agentToken as string,
    dealManagerAddress: dacRecord.dealManagerAddress as string,
    treasuryHolderAddress: (dacRecord.treasuryHolderAddress ?? dacRecord.assetControllerAddress) as string,
    founderAddress: wallet.address,
  };
}

export interface AgentDealContext {
  dealAddress: string;
  dealCell: string;
  dealNumericId: string;
  dealProposalId: string;
}

/**
 * Create an agent-deal in `home` bound to `hostDacAddress`, stake the home
 * founder's agent tokens into it and approve it through home DAC governance.
 *
 * `role` must be the home DAC founder (holds the home agent tokens and the vote).
 */
export async function createApprovedAgentDeal(
  h: Harness,
  role: string,
  home: NativeDacContext,
  hostDacAddress: string,
  opts: {name?: string; stakeAmount?: string} = {},
): Promise<AgentDealContext> {
  const {assert, config} = h;

  const dealJson = await buildMilestoneDealJson(h, {
    dealKind: "agent-deal",
    name: opts.name ?? "QA Agent Deal",
    dealTarget: hostDacAddress,
  });

  const dealCli = await h.cliAs(role, [
    "deal", "create", writeJsonFile(dealJson, "agent-deal"), "--dac", home.dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);
  const dealAddress = dealCli.data.dealAddress as string;
  const dealCell = dealCli.data.dealCell as string;
  const dealNumericId = String(dealCli.data.dealId ?? "");
  const dealProposalId = String(dealCli.data.dacProposalId ?? "");
  assert.isAddress(dealAddress, "agent-deal address");
  assert.isAddress(dealCli.data.governanceFactory, "agent-deal governance factory resolved");

  await h.syncIndexer();

  await h.cliAs(role, [
    "deal", "stake", opts.stakeAmount ?? "10000000000000000000000",
    "--deal-address", dealCell, "--dac", home.dacAddress, "--auto-delegate",
    "--config", config.configPath, "--pretty-print",
  ]);

  await h.advanceTime(10);
  await h.cliAs(role, [
    "vote", "proposal", dealProposalId, "true", "--dac", home.dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);
  await h.advanceTime(3700);
  await h.cliAs(role, [
    "execute", dealProposalId, "--dac", home.dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  await h.syncIndexer();

  return {dealAddress, dealCell, dealNumericId, dealProposalId};
}

function publicClient(h: Harness) {
  return createPublicClient({transport: http(h.config.localRpcUrl)});
}

export async function readErc20Balance(h: Harness, token: string, holder: string): Promise<bigint> {
  return publicClient(h).readContract({
    address: token as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [holder as Address],
  });
}

export async function readErc20Allowance(h: Harness, token: string, owner: string, spender: string): Promise<bigint> {
  return publicClient(h).readContract({
    address: token as Address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner as Address, spender as Address],
  });
}

export async function readVotes(h: Harness, votesToken: string, account: string): Promise<bigint> {
  return publicClient(h).readContract({
    address: votesToken as Address,
    abi: erc20VotesAbi,
    functionName: "getVotes",
    args: [account as Address],
  });
}

/** Lowercased action types recorded by the indexer for an agent-deal. */
export async function listAgentActionTypes(h: Harness, dealAddress: string): Promise<string[]> {
  const cli = await h.dealView("agent-actions", ["--deal-address", dealAddress, "--limit", "100"]);
  const actions = (cli.data.agentActions as Array<Record<string, unknown>> | undefined) ?? [];
  return actions.map((entry) => String(entry.actionType));
}

export function sameAddress(a: unknown, b: unknown): boolean {
  return typeof a === "string" && typeof b === "string" && a.toLowerCase() === b.toLowerCase();
}
