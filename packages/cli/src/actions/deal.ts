import {resolve as resolvePath} from "node:path";
import {
  DEAL_PROPOSAL_TYPE,
  buildEnableDealChallengeRightProposal,
  buildStrikeOutAgentProposal,
  buildUpdateDealVotingConfigProposal,
  normalizePercentInput,
  type DealParams,
  type ProposalParams,
} from "@dac-cloud/core";
import {type Command} from "commander";
import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {z} from "zod";
import {
  asAddress,
  asBytes4,
  dacAddressFromCompositeId,
  parseBoolText,
  resolveDacRecordOrThrow,
  resolveDealIdOrThrow,
  resolveDealProposalByNumericIdOrThrow,
  resolveDealRecordOrThrow,
  resolvePage,
  viewProposalByIdOrThrow,
} from "./shared";
import {
  listKnownModuleDealProposalTypes,
  resolveDealKindSpec,
  resolveKernelDealProposalHook,
  resolveDealProposalType,
  resolveEvaluatorKindSpec,
} from "../modules/registry";
import {addCommandHelp, applyOptions} from "../cli/options";
import type {OptionResolver} from "../runtime/config";
import {advanceTime, makeCoreContext, makeDryRunContext, makeIndexer} from "../runtime/chain";
import {printJson, readJsonFile} from "../runtime/io";

function isDryRun(resolver: OptionResolver): boolean {
  return resolver.resolveBoolean("dry-run", false);
}

function requireNArgs(args: string[], expected: number, hint: string): void {
  if (args.length !== expected) {
    throw new Error(`${hint}. Expected ${expected} args, got ${args.length}.`);
  }
}

function parseBigNumberish(value: unknown, label: string): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`${label} must be a finite number`);
    }
    return BigInt(Math.trunc(value));
  }
  if (typeof value === "string") {
    return BigInt(value);
  }
  throw new Error(`${label} must be bigint-compatible`);
}

function readStringField(input: Record<string, unknown> | undefined, key: string, label: string): string {
  const value = input?.[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing string field '${key}' in ${label}`);
  }
  return value;
}

function readBigIntField(input: Record<string, unknown> | undefined, key: string, label: string): bigint {
  const value = input?.[key];
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.trunc(value));
  if (typeof value === "string" && value.length > 0) return BigInt(value);
  throw new Error(`Missing bigint field '${key}' in ${label}`);
}

function readBoolField(input: Record<string, unknown> | undefined, key: string, label: string): boolean {
  const value = input?.[key];
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return parseBoolText(value);
  throw new Error(`Missing bool field '${key}' in ${label}`);
}

/** Standard deal selector options — use in every deal subcommand's applyOptions. */
const DEAL_SELECTOR_OPTIONS = [
  "deal-id", "deal-address", "deal", "deal-cell",
] as const;

async function cmdCreate(resolver: OptionResolver, dealFile: string): Promise<void> {
  const dacRecord = await resolveDacRecordOrThrow(resolver);
  const dac = dacRecord.address;

  if (!dacRecord.dealManagerAddress) {
    throw new Error("DAC deal manager address is missing in indexer.");
  }
  const dealManager = dacRecord.dealManagerAddress;

  const content = await readJsonFile<Record<string, unknown>>(resolvePath(dealFile));

  const schema = z.object({
    dealKind: z.string(),
    name: z.string(),
    description: z.string(),
    linkHash: z.string(),
    moduleFactory: z.string().optional(),
    governanceFactory: z.string().optional(),
    dealTarget: z.string().optional(),
    proposer: z.string().optional(),
    vetoEnabled: z.boolean().optional(),
    fundingToken: z.string(),
    fundingAmount: z.union([z.string(), z.number(), z.bigint()]),
    rewardsLimit: z.union([z.string(), z.number(), z.bigint()]).optional(),
    dealRewardPoolPercent: z.union([z.string(), z.number(), z.bigint()]).optional(),
    approveDeadline: z.union([z.string(), z.number(), z.bigint()]).optional(),
    evaluationDeadline: z.union([z.string(), z.number(), z.bigint()]).optional(),
    dealDeadline: z.union([z.string(), z.number(), z.bigint()]).optional(),
    dealConfig: z.unknown(),
    evaluatorSelector: z.string(),
    evaluatorConfig: z.unknown(),
    evaluatorModuleFactory: z.string().optional(),
    agentsLimit: z.union([z.string(), z.number(), z.bigint()]).optional(),
    minimalStake: z.union([z.string(), z.number(), z.bigint()]).optional(),
  });

  const parsed = schema.parse(content);
  const now = BigInt(Math.floor(Date.now() / 1000));

  const dealKind = resolveDealKindSpec(parsed.dealKind);
  const evaluator = resolveEvaluatorKindSpec(parsed.evaluatorSelector);
  const dealConfig = dealKind.encodeConfig(parsed.dealConfig);
  const evaluatorConfig = evaluator.encodeConfig(parsed.evaluatorConfig);

  function buildDealParams(protocol: {coreModuleFactory: unknown; coreDealGovernanceFactory?: unknown}, proposerAddress: string): DealParams {
    const defaultCoreGovernanceFactory = typeof protocol.coreDealGovernanceFactory === "string"
      ? protocol.coreDealGovernanceFactory : undefined;
    const moduleFactory = parsed.moduleFactory ?? dealKind.defaultModuleFactory?.(protocol as never) ?? String(protocol.coreModuleFactory);
    const governanceFactory = parsed.governanceFactory ?? dealKind.defaultGovernanceFactory?.(protocol as never) ?? defaultCoreGovernanceFactory;
    if (!governanceFactory) {
      throw new Error("Missing governanceFactory. Provide 'governanceFactory' in deal JSON or configure it in module/protocol manifest.");
    }
    const resolvedDealDeadline = parsed.dealDeadline ? parseBigNumberish(parsed.dealDeadline, "dealDeadline") : now + 30n * 24n * 60n * 60n;
    const resolvedEvaluationDeadline = parsed.evaluationDeadline ? parseBigNumberish(parsed.evaluationDeadline, "evaluationDeadline") : resolvedDealDeadline;
    return {
      dealKind: dealKind.selector, name: parsed.name, description: parsed.description, linkHash: parsed.linkHash,
      moduleFactory: asAddress(moduleFactory, "moduleFactory"), governanceFactory: asAddress(governanceFactory, "governanceFactory"),
      dealTarget: asAddress(parsed.dealTarget ?? "0x0000000000000000000000000000000000000000", "dealTarget"),
      proposer: asAddress(parsed.proposer ?? proposerAddress, "proposer"),
      vetoEnabled: parsed.vetoEnabled ?? false, fundingToken: asAddress(parsed.fundingToken, "fundingToken"),
      fundingAmount: parseBigNumberish(parsed.fundingAmount, "fundingAmount"),
      rewardsLimit: parsed.rewardsLimit ? parseBigNumberish(parsed.rewardsLimit, "rewardsLimit") : 500_000_000n,
      dealRewardPoolPercent: parsed.dealRewardPoolPercent ? parseBigNumberish(parsed.dealRewardPoolPercent, "dealRewardPoolPercent") : 0n,
      approveDeadline: parsed.approveDeadline ? parseBigNumberish(parsed.approveDeadline, "approveDeadline") : now + 7n * 24n * 60n * 60n,
      evaluationDeadline: resolvedEvaluationDeadline, dealDeadline: resolvedDealDeadline,
      dealConfig, evaluatorSelector: evaluator.selector, evaluatorConfig,
      evaluatorModuleFactory: asAddress(parsed.evaluatorModuleFactory ?? "0x0000000000000000000000000000000000000000", "evaluatorModuleFactory"),
      agentsLimit: parsed.agentsLimit ? parseBigNumberish(parsed.agentsLimit, "agentsLimit") : 0n,
      minimalStake: parsed.minimalStake ? parseBigNumberish(parsed.minimalStake, "minimalStake") : 0n,
    };
  }

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const dealParams = buildDealParams(ctx.protocol, ctx.fromAddress);
    const transaction = ctx.txBuilder.createDealProposal({dealManager, params: dealParams});
    printJson({action: "deal.create", dryRun: true, dac, dealManager, transaction,
      moduleId: dealKind.moduleId, evaluatorModuleId: evaluator.moduleId});
    return;
  }

  const {account, core, protocol} = await makeCoreContext(resolver);
  const dealParams = buildDealParams(protocol, account.address);

  const created = await core.createDealProposalDetailed({dealManager, params: dealParams});

  printJson({
    action: "deal.create", dac, dealManager, proposer: account.address,
    txHash: created.txHash, dealId: created.dealId, dacProposalId: created.proposalId,
    dealCell: created.dealCell, dealAddress: created.dealAddress, evaluatorAddress: created.evaluatorAddress,
    moduleId: dealKind.moduleId, evaluatorModuleId: evaluator.moduleId,
    approveDeadline: dealParams.approveDeadline, evaluationDeadline: dealParams.evaluationDeadline,
    dealDeadline: dealParams.dealDeadline, rewardsLimit: dealParams.rewardsLimit,
  });
}

async function cmdInvite(resolver: OptionResolver, inviteeText: string): Promise<void> {
  const invitee = asAddress(inviteeText, "Invitee address");
  const grantInviteRight = resolver.resolveBoolean("grant-invite-right", false);
  const dealRecord = await resolveDealRecordOrThrow(resolver);
  const dealCell = dealRecord.cellAddress;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.inviteAgentToDeal({dealCell, invitee, grantInviteRight});
    printJson({action: "deal.invite", dryRun: true, deal: dealRecord.dealAddress, dealCell, invitee, grantInviteRight, transaction});
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const txHash = await core.inviteAgentToDeal({dealCell, invitee, grantInviteRight});

  printJson({action: "deal.invite", inviter: account.address, deal: dealRecord.dealAddress, dealCell, invitee, grantInviteRight, txHash,
    nextStep: "Invited agent can now stake into the deal with `dac deal stake`."});
}

async function cmdStake(resolver: OptionResolver, amountText: string): Promise<void> {
  let amount: bigint;
  try { amount = BigInt(amountText); } catch {
    throw new Error(`Invalid stake amount "${amountText}". Provide a numeric value (e.g. 10000000000000000000000).`);
  }
  const dealRecord = await resolveDealRecordOrThrow(resolver);
  const dealCell = dealRecord.cellAddress;
  const dacRecord = await resolveDacRecordOrThrow(resolver);
  const dac = dacRecord.address;

  if (!dacRecord.agentTokenAddress) {
    throw new Error("DAC agent token address is missing in indexer.");
  }
  const agentToken = dacRecord.agentTokenAddress;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transactions = [ctx.txBuilder.stakeAgentToDeal({agentToken, dealCell, amount})];
    const stakeToken = dealRecord.stakeTokenAddress;
    if (resolver.resolveBoolean("auto-delegate", false) && stakeToken) {
      transactions.push(ctx.txBuilder.delegateVotes({token: stakeToken, delegatee: ctx.fromAddress}));
    }
    printJson({action: "deal.stake", dryRun: true, dac, dealCell, agentToken, amount, transactions});
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const txHash = await core.stakeAgentToDeal({agentToken, dealCell, amount});
  const stakeToken = resolver.resolveString("stake-token")
    ? asAddress(resolver.requireString("stake-token"), "stake token")
    : dealRecord.stakeTokenAddress;

  const autoDelegate = resolver.resolveBoolean("auto-delegate", false);
  let delegateTx: Hex | undefined;
  if (autoDelegate && stakeToken) {
    delegateTx = await core.delegateVotes({token: stakeToken, delegatee: account.address});
  }

  printJson({action: "deal.stake", staker: account.address, dac, dealCell, agentToken, stakeToken, amount, txHash, delegateTx});
}

async function cmdUnstake(resolver: OptionResolver): Promise<void> {
  const resolved = await resolveDealRecordOrThrow(resolver);
  const dealCell = resolved.cellAddress;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.unstakeFromDeal({dealCell});
    printJson({action: "deal.unstake", dryRun: true, deal: resolved.dealAddress, dealCell, transaction});
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const txHash = await core.unstakeFromDeal({dealCell});
  printJson({action: "deal.unstake", staker: account.address, deal: resolved.dealAddress, dealCell, txHash});
}

async function cmdDelegate(resolver: OptionResolver): Promise<void> {
  const {account, core} = await makeCoreContext(resolver);
  const dealRecord = await resolveDealRecordOrThrow(resolver);

  const stakeTokenFromOption = resolver.resolveString("stake-token");
  const stakeToken = stakeTokenFromOption
    ? asAddress(stakeTokenFromOption, "stake token")
    : dealRecord.stakeTokenAddress;

  if (!stakeToken) {
    throw new Error(
      `Deal stake token address is missing in indexer for deal ${dealRecord.dealAddress}. `
      + `Pass --stake-token explicitly.`,
    );
  }

  const delegatee = asAddress(resolver.resolveString("delegatee", account.address) ?? account.address, "delegatee");
  const txHash = await core.delegateVotes({token: stakeToken, delegatee});

  printJson({
    action: "deal.delegate",
    delegator: account.address,
    deal: dealRecord.dealAddress,
    dealCell: dealRecord.cellAddress,
    stakeToken,
    delegatee,
    txHash,
  });
}

async function cmdRequest(resolver: OptionResolver, amountText: string): Promise<void> {
  let amount: bigint;
  try { amount = BigInt(amountText); } catch {
    throw new Error(`Invalid request amount "${amountText}". Provide a numeric value.`);
  }
  const {core, account} = await makeCoreContext(resolver);
  const resolved = await resolveDealRecordOrThrow(resolver);
  const dacRecord = await resolveDacRecordOrThrow(resolver);
  const dacAddress = dacRecord.address;

  if (!dacRecord.agentTokenAddress) {
    throw new Error("DAC agent token address is missing in indexer.");
  }

  const agentToken = dacRecord.agentTokenAddress;
  const approveTx = await core.approveErc20({
    token: agentToken,
    spender: resolved.cellAddress,
    amount,
  });

  printJson({
    action: "deal.request",
    requester: account.address,
    dealId: resolved.id,
    deal: resolved.dealAddress,
    dealCell: resolved.cellAddress,
    dac: dacAddress,
    agentToken,
    amount,
    approveTx,
    nextStep: "A currently staked agent must create `deal propose add-stake <agent> <amount>` and pass quorum.",
  });
}

const BASE_DEAL_PROPOSAL_TYPE_LIST = [
  "update-voting-config",
  "toggle-whitelist",
  "toggle-early-returns",
  "enable-veto-right",
  "request-tranche",
  "add-stake",
  "strike-out-agent",
] as const;

const BASE_DEAL_PROPOSAL_TYPES = new Set<string>(BASE_DEAL_PROPOSAL_TYPE_LIST);

async function cmdPropose(resolver: OptionResolver, proposalTypeRaw: string, args: string[]): Promise<void> {
  const resolved = await resolveDealRecordOrThrow(resolver);
  const dealAddress = resolved.dealAddress;
  const indexer = makeIndexer(resolver);
  const inputPath = resolver.resolveString("input");
  const input = inputPath ? await readJsonFile<Record<string, unknown>>(resolvePath(inputPath)) : undefined;
  const resolvedType = resolveDealProposalType(proposalTypeRaw);
  const proposalType = resolvedType.canonicalType;

  if (resolvedType.moduleIdHint && !resolvedType.spec && BASE_DEAL_PROPOSAL_TYPES.has(proposalType)) {
    throw new Error(`'${proposalTypeRaw}' is a kernel deal proposal type. Remove module prefix.`);
  }

  // Lazy core context — only created when hooks/modules need it
  let _coreCtx: Awaited<ReturnType<typeof makeCoreContext>> | undefined;
  async function getCoreContext() {
    if (!_coreCtx) _coreCtx = await makeCoreContext(resolver);
    return _coreCtx;
  }

  let params: ProposalParams | undefined;

  const kernelHook = resolveKernelDealProposalHook(proposalType, resolved.kindSelector);
  if (kernelHook) {
    const {core} = await getCoreContext();
    params = await kernelHook.build({
      args,
      input,
      resolver,
      core,
      indexer,
      resolvedDeal: resolved,
    });
  }

  if (!params && proposalType === "update-voting-config") {
    if (args.length !== 5 && args.length !== 6 && !input) {
      throw new Error("deal propose update-voting-config requires positional args or --input json");
    }
    const quorumPercent = normalizePercentInput(args[0] ?? readStringField(input, "quorumPercent", "--input"));
    const blockingPercent = normalizePercentInput(args[1] ?? readStringField(input, "blockingPercent", "--input"));
    const highQuorumPercent = normalizePercentInput(args[2] ?? readStringField(input, "highQuorumPercent", "--input"));
    const duration = args[3] !== undefined ? BigInt(args[3]) : readBigIntField(input, "duration", "--input");
    const qualification = normalizePercentInput(args[4] ?? (input?.qualification !== undefined ? String(readBigIntField(input, "qualification", "--input")) : "0"));
    const executionValidityDuration = args[5] !== undefined
      ? BigInt(args[5])
      : input?.executionValidityDuration !== undefined
        ? readBigIntField(input, "executionValidityDuration", "--input")
        : duration;
    params = buildUpdateDealVotingConfigProposal({
      quorumPercent,
      blockingPercent,
      highQuorumPercent,
      duration,
      qualification,
      executionValidityDuration,
    });
  } else if (!params && proposalType === "toggle-whitelist") {
    if (args.length !== 1 && !input) {
      throw new Error("deal propose toggle-whitelist requires positional arg or --input json");
    }
    const enabled = args[0] !== undefined ? parseBoolText(args[0]) : readBoolField(input, "enabled", "--input");
    params = {
      typ: DEAL_PROPOSAL_TYPE.TOGGLE_WHITELIST,
      target: "0x0000000000000000000000000000000000000000",
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters([{name: "enabled", type: "bool"}], [enabled]),
    };
  } else if (!params && proposalType === "toggle-early-returns") {
    if (args.length !== 1 && !input) {
      throw new Error("deal propose toggle-early-returns requires positional arg or --input json");
    }
    const enabled = args[0] !== undefined ? parseBoolText(args[0]) : readBoolField(input, "enabled", "--input");
    params = {
      typ: DEAL_PROPOSAL_TYPE.TOGGLE_EARLY_RETURNS,
      target: "0x0000000000000000000000000000000000000000",
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters([{name: "enabled", type: "bool"}], [enabled]),
    };
  } else if (!params && proposalType === "enable-veto-right") {
    requireNArgs(args, 0, "deal propose enable-veto-right requires no args");
    params = buildEnableDealChallengeRightProposal();
  } else if (!params && proposalType === "request-tranche") {
    if ((args.length !== 2 && args.length !== 3) && !input) {
      throw new Error("deal propose request-tranche requires <token> <amount> [rewards] or --input json");
    }
    const token = args[0] ?? readStringField(input, "token", "--input");
    const amount = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "amount", "--input");
    const rewards = args[2] !== undefined ? BigInt(args[2]) : (
      input?.rewards !== undefined
        ? readBigIntField(input, "rewards", "--input")
        : 0n
    );
    params = {
      typ: DEAL_PROPOSAL_TYPE.REQUEST_TRANCHE,
      target: asAddress(token, "token"),
      i: numberToHex(amount, {size: 32}),
      data: encodeAbiParameters([{name: "rewards", type: "uint256"}], [rewards]),
    };
  } else if (!params && proposalType === "add-stake") {
    const fromRequest = resolver.resolveBoolean("from-request", false);
    if (!fromRequest && args.length !== 2 && !input) {
      throw new Error("deal propose add-stake requires positional args or --input json");
    }
    if (fromRequest && args.length < 1 && !input) {
      throw new Error("deal propose add-stake --from-request expects <agent> [amount] or --input");
    }
    if (fromRequest && args.length > 2) {
      throw new Error("deal propose add-stake --from-request expects <agent> [amount]");
    }

    const agent = asAddress(
      args[0] ?? readStringField(input, "agent", "--input"),
      "agent",
    );
    let amount: bigint;
    if (fromRequest) {
      if (args[1]) {
        amount = BigInt(args[1]);
      } else if (input?.["amount"] !== undefined) {
        amount = readBigIntField(input, "amount", "--input");
      } else {
        const dacAddress = resolver.resolveString(["cell-address", "dac-address"])
          ? asAddress(resolver.requireString(["cell-address", "dac-address"]), "DAC address")
          : dacAddressFromCompositeId(resolved.dacId);
        const dacRecord = await resolveDacRecordOrThrow(resolver);
        if (!dacRecord.agentTokenAddress) {
          throw new Error("DAC agent token address is missing in indexer.");
        }
        const agentToken = dacRecord.agentTokenAddress;
        const {core: allowanceCore} = await getCoreContext();
        amount = await allowanceCore.getErc20Allowance({
          token: agentToken,
          owner: agent,
          spender: resolved.cellAddress,
        });
      }
      if (amount <= 0n) {
        throw new Error("No pending stake request allowance found. Agent must call `deal request <amount>` first.");
      }
    } else {
      amount = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "amount", "--input");
    }

    params = {
      typ: DEAL_PROPOSAL_TYPE.ADD_STAKE,
      target: agent,
      i: numberToHex(amount, {size: 32}),
      data: "0x",
    };
  } else if (!params && proposalType === "strike-out-agent") {
    requireNArgs(args, 1, "deal propose strike-out-agent requires <agent>");
    params = buildStrikeOutAgentProposal(asAddress(args[0], "agent"));
  } else if (!params) {
    const moduleProposal = resolvedType.spec;
    if (!moduleProposal) {
      const supportedKernel = [...BASE_DEAL_PROPOSAL_TYPES].sort((a, b) => a.localeCompare(b));
      const supportedModule = listKnownModuleDealProposalTypes();
      throw new Error(
        `Unsupported deal proposal type '${proposalTypeRaw}'. `
        + `Kernel types: ${supportedKernel.join(", ")}. `
        + `Module types: ${supportedModule.join(", ")}.`,
      );
    }
    const {core: moduleCore} = await getCoreContext();
    params = await moduleProposal.build({
      args,
      input,
      resolver,
      core: moduleCore,
      indexer,
      resolvedDeal: resolved,
    });
  }

  if (!params) {
    throw new Error(`Unable to build proposal params for type '${proposalTypeRaw}'.`);
  }

  const outputType = resolvedType.spec
    ? `${resolvedType.spec.moduleId}:${resolvedType.spec.key}`
    : proposalType;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.createDealManagementProposal({dealAddress, params: params!});
    printJson({action: "deal.propose", dryRun: true, deal: dealAddress, proposalType: outputType, transaction});
    return;
  }

  const {core: submitCore} = await getCoreContext();
  const created = await submitCore.createDealManagementProposal({dealAddress, params: params!});

  printJson({
    action: "deal.propose",
    deal: dealAddress,
    proposalType: outputType,
    txHash: created.txHash,
    proposalId: created.proposalId,
    proposalAddress: created.proposalAddress,
  });
}

async function cmdVoteProposal(resolver: OptionResolver, proposalIdText: string, supportText: string): Promise<void> {
  const proposal = await resolveDealProposalByNumericIdOrThrow(resolver, proposalIdText);
  const resolved = await resolveDealRecordOrThrow(resolver);
  const dealAddress = resolved.dealAddress;
  const proposalId = BigInt(proposalIdText);
  const support = parseBoolText(supportText);

  if (!proposal.proposalAddress) {
    throw new Error(`Deal proposal #${proposalIdText} is missing proposalAddress in indexer`);
  }
  const proposalAddress = asAddress(proposal.proposalAddress, "Proposal address");

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.voteProposal({proposalAddress, support});
    printJson({action: "deal.vote.proposal", dryRun: true, deal: dealAddress, proposalId, proposalAddress, support, transaction});
    return;
  }

  const {core, rpcUrl} = await makeCoreContext(resolver);
  const preVoteAdvanceSeconds = resolver.resolveNumber("pre-vote-advance-seconds", 1) ?? 1;
  await advanceTime(rpcUrl, preVoteAdvanceSeconds);
  const txHash = await core.voteProposal({proposalAddress, support});
  printJson({action: "deal.vote.proposal", deal: dealAddress, proposalId, proposalAddress, support, txHash});
}

async function cmdExecute(resolver: OptionResolver, proposalIdText: string): Promise<void> {
  const resolved = await resolveDealRecordOrThrow(resolver);
  const dealAddress = resolved.dealAddress;
  const proposalId = BigInt(proposalIdText);

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.executeDealProposal({dealAddress, proposalId});
    printJson({action: "deal.execute", dryRun: true, deal: dealAddress, proposalId, transaction});
    return;
  }

  const {core, rpcUrl} = await makeCoreContext(resolver);
  const proposal = await resolveDealProposalByNumericIdOrThrow(resolver, proposalIdText);
  const proposalAddress = proposal.proposalAddress ? asAddress(proposal.proposalAddress, "Proposal address") : undefined;

  const advanceSeconds = resolver.resolveNumber("advance-seconds", 0) ?? 0;
  if (advanceSeconds > 0) {
    await advanceTime(rpcUrl, advanceSeconds);
  }

  const details = await core.executeDealProposalDetailed({dealAddress, proposalId});
  printJson({
    action: "deal.execute", deal: dealAddress, proposalId, proposalAddress,
    txHash: details.txHash, dacProposalId: details.dacProposalId, trancheId: details.trancheId,
    childProposalId: details.childProposalId, childVoteProposalId: details.childVoteProposalId,
  });
}

async function cmdEvaluate(resolver: OptionResolver, evaluatorIdText?: string): Promise<void> {
  const resolved = await resolveDealRecordOrThrow(resolver);
  const evaluatorId = evaluatorIdText ? BigInt(evaluatorIdText) : (resolver.resolveBigInt("evaluator-id", 0n) ?? 0n);
  const dacRecord = await resolveDacRecordOrThrow(resolver);
  if (!dacRecord.dealManagerAddress) {
    throw new Error("DAC deal manager address is missing in indexer.");
  }
  const dealManager = dacRecord.dealManagerAddress;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.evaluateDeal({dealManager, dealId: resolved.dealNumericId, evaluatorId});
    printJson({action: "deal.evaluate", dryRun: true, dealId: resolved.id, dealManager, evaluatorId, transaction});
    return;
  }

  const {core, account} = await makeCoreContext(resolver);
  const txHash = await core.evaluateDeal({dealManager, dealId: resolved.dealNumericId, evaluatorId});
  printJson({
    action: "deal.evaluate", caller: account.address, dealId: resolved.id,
    dealNumericId: resolved.dealNumericId, dealAddress: resolved.dealAddress,
    dealCell: resolved.cellAddress, dealManager, evaluatorId, txHash,
  });
}

async function cmdClaim(resolver: OptionResolver, evaluatorIdText?: string): Promise<void> {
  const resolved = await resolveDealRecordOrThrow(resolver);
  const dealCell = resolved.cellAddress;
  const evaluatorId = evaluatorIdText ? BigInt(evaluatorIdText) : (resolver.resolveBigInt("evaluator-id", 0n) ?? 0n);

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.claimMainToken({dealCell, evaluatorId});
    printJson({action: "deal.claim", dryRun: true, deal: resolved.dealAddress, dealCell, evaluatorId, transaction});
    return;
  }

  const {core, account} = await makeCoreContext(resolver);
  const txHash = await core.claimMainToken({dealCell, evaluatorId});
  printJson({action: "deal.claim", caller: account.address, deal: resolved.dealAddress, dealCell, evaluatorId, txHash});
}

async function cmdLegalMessage(resolver: OptionResolver, messageFile: string, dealNumericIdText?: string): Promise<void> {
  const {core, account} = await makeCoreContext(resolver);
  const payload = await readJsonFile<Record<string, unknown>>(resolvePath(messageFile));

  const kind = asBytes4(readStringField(payload, "kind", messageFile), "legal message kind");
  const message = z.string().regex(/^0x[0-9a-fA-F]*$/).parse(readStringField(payload, "message", messageFile)) as Hex;

  let dealId: bigint;
  let dacAddress: Address;

  if (dealNumericIdText) {
    dealId = BigInt(dealNumericIdText);
    dacAddress = asAddress(
      resolver.requireString(["cell-address", "dac-address"], "--cell-address is required when passing explicit dealNumericId"),
      "DAC address",
    );
  } else if (payload["dealId"] !== undefined) {
    dealId = readBigIntField(payload, "dealId", messageFile);
    dacAddress = asAddress(
      resolver.requireString(["cell-address", "dac-address"], "--cell-address is required when dealId is provided in message file"),
      "DAC address",
    );
  } else {
    const resolved = await resolveDealRecordOrThrow(resolver);
    dealId = resolved.dealNumericId;
    dacAddress = resolver.resolveString(["cell-address", "dac-address"])
      ? asAddress(resolver.requireString(["cell-address", "dac-address"]), "DAC address")
      : dacAddressFromCompositeId(resolved.dacId);
  }

  const dacRecord = await resolveDacRecordOrThrow(resolver);
  if (!dacRecord.dealManagerAddress) {
    throw new Error("DAC deal manager address is missing in indexer.");
  }
  const dealManager = dacRecord.dealManagerAddress;
  const txHash = await core.sendDealLegalWrapperMessage({
    dealManager,
    dealId,
    kind,
    message,
  });

  printJson({
    action: "deal.legal-message",
    caller: account.address,
    dac: dacAddress,
    dealManager,
    dealId,
    kind,
    message,
    txHash,
  });
}

async function cmdWithdraw(resolver: OptionResolver, dealNumericIdText: string): Promise<void> {
  const {core, account} = await makeCoreContext(resolver);
  let dealId: bigint;
  try { dealId = BigInt(dealNumericIdText); } catch {
    throw new Error(`Invalid deal numeric ID "${dealNumericIdText}". Provide a numeric value.`);
  }
  const dacRecord = await resolveDacRecordOrThrow(resolver);
  const dac = dacRecord.address;
  if (!dacRecord.dealManagerAddress) {
    throw new Error("DAC deal manager address is missing in indexer.");
  }
  const dealManager = dacRecord.dealManagerAddress;
  const txHash = await core.forceReturnCapital({dealManager, dealId});

  printJson({
    action: "deal.withdraw",
    caller: account.address,
    dac,
    dealManager,
    dealId,
    txHash,
  });
}

async function cmdView(resolver: OptionResolver, resourceRaw?: string, id?: string): Promise<void> {
  const client = makeIndexer(resolver);
  const page = resolvePage(resolver);

  const resource = z.enum(["deal", "proposal", "proposals", "positions", "treasury-actions"]).catch("deal").parse(resourceRaw ?? "deal");

  if (resource === "deal") {
    const dealId = id ?? resolver.resolveString(["deal-id", "id"]);
    const address = resolver.resolveString(["deal-address", "address"]);

    if (!dealId && !address) {
      throw new Error("Provide deal id/address via positional id, --deal-id, or --deal-address");
    }

    const deal = dealId ? await client.deals.getById(dealId) : await client.deals.getByAddress(address as string);
    if (!deal) {
      throw new Error("Deal not found in indexer");
    }

    printJson({action: "deal.view", deal});
    return;
  }

  if (resource === "proposal") {
    if (!id) {
      throw new Error("deal view proposal requires <proposalId>");
    }

    const proposal = await viewProposalByIdOrThrow(resolver, id);
    printJson({action: "deal.view.proposal", proposal});
    return;
  }

  if (resource === "proposals") {
    const dealId = await resolveDealIdOrThrow(resolver);
    const proposals = await client.proposals.listByDeal(dealId, page);
    printJson({action: "deal.view.proposals", dealId, count: proposals.length, proposals});
    return;
  }

  if (resource === "positions") {
    const dealId = await resolveDealIdOrThrow(resolver);
    const positions = await client.deals.listAgentPositions(dealId, page);
    printJson({action: "deal.view.positions", dealId, count: positions.length, positions});
    return;
  }

  const dealId = await resolveDealIdOrThrow(resolver);
  const treasuryActions = await client.treasuryActions.listByDeal(dealId, page);
  printJson({action: "deal.view.treasury-actions", dealId, count: treasuryActions.length, treasuryActions});
}

export function registerDealCommands(program: Command, resolverFactory: (options: Record<string, unknown>) => Promise<OptionResolver>): void {
  const deal = program.command("deal").description("Deal-level operations");

  const create = deal.command("create <dealFile>").description("Create a deal from JSON file");
  applyOptions(create, ["cell-address", "dac-address", "dac"]);
  addCommandHelp(create, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
    ],
    notes: [
      "dealFile must contain dealKind/evaluatorSelector and module-specific config payloads.",
    ],
    examples: [
      "dac deal create ./deal.json --cell-address 0x...",
    ],
  });
  create.action(async function handleCreate(dealFile: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdCreate(resolver, dealFile);
  });

  const stake = deal.command("stake <amount>").description("Stake AgentToken into a deal");
  applyOptions(stake, ["cell-address", "dac-address", "dac", ...DEAL_SELECTOR_OPTIONS, "auto-delegate"]);
  addCommandHelp(stake, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
      {mode: "oneOf", options: [...DEAL_SELECTOR_OPTIONS], label: "Deal selector"},
    ],
  });
  stake.action(async function handleStake(amount: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdStake(resolver, amount);
  });

  const invite = deal.command("invite <invitee>").description("Invite an agent to a deal's whitelist");
  applyOptions(invite, [...DEAL_SELECTOR_OPTIONS, "grant-invite-right"]);
  addCommandHelp(invite, {
    requirements: [
      {mode: "oneOf", options: [...DEAL_SELECTOR_OPTIONS], label: "Deal selector"},
    ],
    notes: ["Caller must have invite rights (the deal proposer has this by default)."],
  });
  invite.action(async function handleInvite(invitee: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdInvite(resolver, invitee);
  });

  const unstake = deal.command("unstake").description("Unstake from a deal after permit/close rules are satisfied");
  applyOptions(unstake, [...DEAL_SELECTOR_OPTIONS]);
  addCommandHelp(unstake, {
    requirements: [
      {mode: "oneOf", options: [...DEAL_SELECTOR_OPTIONS], label: "Deal selector"},
    ],
  });
  unstake.action(async function handleUnstake() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdUnstake(resolver);
  });

  const delegate = deal.command("delegate").description("Delegate StakedAgent voting power");
  applyOptions(delegate, ["stake-token", ...DEAL_SELECTOR_OPTIONS, "delegatee"]);
  addCommandHelp(delegate, {
    requirements: [
      {mode: "oneOf", options: ["stake-token", ...DEAL_SELECTOR_OPTIONS], label: "Stake token or deal selector"},
    ],
  });
  delegate.action(async function handleDelegate() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdDelegate(resolver);
  });

  const request = deal.command("request <amount>").description("Request stake in active deal (AgentToken approve -> StakeRequested)");
  applyOptions(request, ["cell-address", "dac-address", "dac", ...DEAL_SELECTOR_OPTIONS]);
  addCommandHelp(request, {
    requirements: [
      {mode: "oneOf", options: [...DEAL_SELECTOR_OPTIONS], label: "Deal selector"},
    ],
    notes: [
      "If DAC is omitted, CLI derives it from indexer deal metadata.",
    ],
  });
  request.action(async function handleRequest(amount: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdRequest(resolver, amount);
  });

  const propose = deal
    .command("propose <proposalType> [args...]")
    .description("Create a deal governance proposal");
  applyOptions(propose, [
    ...DEAL_SELECTOR_OPTIONS,
    "input",
    "from-request",
    "cell-address",
    "dac-address",
    "dac",
    "capital-call-hash",
    "capital-call-nonce",
  ]);
  addCommandHelp(propose, {
    requirements: [
      {mode: "oneOf", options: [...DEAL_SELECTOR_OPTIONS], label: "Deal selector"},
    ],
    notes: [
      "`--input` can replace positional args for complex payloads.",
      "`--from-request` applies to kernel `add-stake` proposal flow.",
    ],
  });
  const kernelTypes = BASE_DEAL_PROPOSAL_TYPE_LIST.join(", ");
  const moduleTypes = listKnownModuleDealProposalTypes().join(", ");
  propose.addHelpText("after", `
Kernel deal proposal types:
  ${kernelTypes}

Known module deal proposal types:
  ${moduleTypes}

Request-tranche usage:
  Generic: dac deal propose request-tranche <token> <amount> [rewards]
  DACDeal by call nonce: dac deal propose request-tranche <capitalCallNonce> [rewards]
  DACDeal by flags: dac deal propose request-tranche [rewards] --capital-call-hash <bytes32>
                    dac deal propose request-tranche [rewards] --capital-call-nonce <uint256>

Complex payloads can use --input <json> (for example update-voting-config, treasury module types).
`);
  propose.action(async function handlePropose(proposalType: string, args: string[]) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdPropose(resolver, proposalType, args);
    });

  const vote = deal.command("vote").description("Vote deal proposals");
  const voteProposal = vote.command("proposal <proposalId> <support>").description("Vote for a deal proposal");
  applyOptions(voteProposal, [...DEAL_SELECTOR_OPTIONS, "pre-vote-advance-seconds"]);
  addCommandHelp(voteProposal, {
    requirements: [
      {mode: "oneOf", options: [...DEAL_SELECTOR_OPTIONS], label: "Deal selector"},
    ],
  });
  voteProposal.action(async function handleVote(proposalId: string, support: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdVoteProposal(resolver, proposalId, support);
  });

  const execute = deal.command("execute <proposalId>").description("Execute a passed deal proposal");
  applyOptions(execute, [...DEAL_SELECTOR_OPTIONS, "advance-seconds"]);
  addCommandHelp(execute, {
    requirements: [
      {mode: "oneOf", options: [...DEAL_SELECTOR_OPTIONS], label: "Deal selector"},
    ],
  });
  execute.action(async function handleExecute(proposalId: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdExecute(resolver, proposalId);
  });

  const evaluate = deal.command("evaluate [evaluatorId]").description("Evaluate a deal via DealManager.evaluateDeal");
  applyOptions(evaluate, ["evaluator-id", ...DEAL_SELECTOR_OPTIONS, "cell-address", "dac-address", "dac"]);
  addCommandHelp(evaluate, {
    requirements: [
      {mode: "oneOf", options: [...DEAL_SELECTOR_OPTIONS], label: "Deal selector"},
    ],
  });
  evaluate.action(async function handleEvaluate(evaluatorId: string | undefined) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdEvaluate(resolver, evaluatorId);
  });

  const claim = deal.command("claim [evaluatorId]").description("Claim unlocked MainToken rewards from deal cell");
  applyOptions(claim, ["evaluator-id", ...DEAL_SELECTOR_OPTIONS]);
  addCommandHelp(claim, {
    requirements: [
      {mode: "oneOf", options: [...DEAL_SELECTOR_OPTIONS], label: "Deal selector"},
    ],
  });
  claim.action(async function handleClaim(evaluatorId: string | undefined) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdClaim(resolver, evaluatorId);
  });

  const legalMessage = deal.command("legal-message [dealNumericId] <messageFile>")
    .description("Send legal wrapper message via DealManager.legalWrapperMessage");
  applyOptions(legalMessage, [...DEAL_SELECTOR_OPTIONS, "cell-address", "dac-address", "dac"]);
  addCommandHelp(legalMessage, {
    notes: [
      "If dealNumericId is not provided, CLI resolves deal id from deal selector options.",
      "When explicit dealNumericId is used, pass DAC with --cell-address or --dac-address.",
    ],
  });
  legalMessage.action(async function handleLegalMessage(dealNumericId: string | undefined, messageFile: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdLegalMessage(resolver, messageFile, dealNumericId);
  });

  const withdraw = deal.command("withdraw <dealNumericId>")
    .description("Force return capital after deadline via DealManager.forceReturnCapital");
  applyOptions(withdraw, ["cell-address", "dac-address", "dac"]);
  addCommandHelp(withdraw, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address"], label: "DAC selector"},
    ],
  });
  withdraw.action(async function handleWithdraw(dealNumericId: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdWithdraw(resolver, dealNumericId);
  });

  const view = deal.command("view [resource] [id]").description("View deal/indexer state");
  applyOptions(view, ["deal-id", "id", "deal-address", "address", "query-limit", "query-offset", "limit", "offset"]);
  addCommandHelp(view, {
    notes: [
      "For resource=deal, provide deal id/address using positional [id], --deal-id, --deal-address, or --address.",
      "For resource=proposals/treasury-actions, deal id is resolved from --deal-id or deal address options.",
    ],
  });
  view.action(async function handleView(resource: string | undefined, id: string | undefined) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdView(resolver, resource, id);
  });
}
