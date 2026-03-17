import {resolve as resolvePath} from "node:path";
import {
  DEAL_PROPOSAL_TYPE,
  type DealParams,
  type ProposalParams,
} from "@dac-cloud/core";
import {type Command} from "commander";
import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {z} from "zod";
import {
  asAddress,
  asBytes4,
  asBytes32,
  dacAddressFromCompositeId,
  parseBoolText,
  resolveDealIdOrThrow,
  resolveDealRecordOrThrow,
  resolvePage,
  viewProposalByIdOrThrow,
} from "./shared";
import {
  listKnownModuleDealProposalTypes,
  resolveDealKindSpec,
  resolveDealProposalType,
  resolveEvaluatorKindSpec,
} from "../modules/registry";
import type {OptionResolver} from "../runtime/config";
import {advanceTime, makeCoreContext, makeIndexer} from "../runtime/chain";
import {printJson, readJsonFile} from "../runtime/io";

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

async function resolveDealAddressForWrite(resolver: OptionResolver): Promise<Address> {
  const direct = resolver.resolveString(["deal-address", "deal"]);
  if (direct) {
    return asAddress(direct, "Deal address");
  }

  return (await resolveDealRecordOrThrow(resolver)).dealAddress;
}

async function resolveDealCellAddressForStake(resolver: OptionResolver): Promise<Address> {
  const direct = resolver.resolveString("deal-cell");
  if (direct) {
    return asAddress(direct, "Deal cell");
  }
  return (await resolveDealRecordOrThrow(resolver)).cellAddress;
}

async function cmdCreate(resolver: OptionResolver, dealFile: string): Promise<void> {
  const {account, core, protocol} = await makeCoreContext(resolver);

  const dac = asAddress(
    resolver.requireString(["cell-address", "dac-address"], "--cell-address is required for deal create"),
    "DAC address",
  );

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
    approveDeadline: z.union([z.string(), z.number(), z.bigint()]).optional(),
    dealDeadline: z.union([z.string(), z.number(), z.bigint()]).optional(),
    dealConfig: z.unknown(),
    evaluatorSelector: z.string(),
    evaluatorConfig: z.unknown(),
  });

  const parsed = schema.parse(content);
  const now = (await core.publicClient.getBlock()).timestamp;

  const dealKind = resolveDealKindSpec(parsed.dealKind);
  const evaluator = resolveEvaluatorKindSpec(parsed.evaluatorSelector);
  const dealConfig = dealKind.encodeConfig(parsed.dealConfig);
  const evaluatorConfig = evaluator.encodeConfig(parsed.evaluatorConfig);

  const defaultCoreGovernanceFactory = typeof protocol.coreDealGovernanceFactory === "string"
    ? protocol.coreDealGovernanceFactory
    : undefined;
  const moduleFactory = parsed.moduleFactory
    ?? dealKind.defaultModuleFactory?.(protocol)
    ?? String(protocol.coreModuleFactory);
  const governanceFactory = parsed.governanceFactory
    ?? dealKind.defaultGovernanceFactory?.(protocol)
    ?? defaultCoreGovernanceFactory;

  if (!governanceFactory) {
    throw new Error(
      "Missing governanceFactory. Provide 'governanceFactory' in deal JSON or configure it in module/protocol manifest.",
    );
  }

  const dealParams: DealParams = {
    dealKind: dealKind.selector,
    name: parsed.name,
    description: parsed.description,
    linkHash: parsed.linkHash,
    moduleFactory: asAddress(moduleFactory, "moduleFactory"),
    governanceFactory: asAddress(governanceFactory, "governanceFactory"),
    dealTarget: asAddress(parsed.dealTarget ?? "0x0000000000000000000000000000000000000000", "dealTarget"),
    proposer: asAddress(parsed.proposer ?? account.address, "proposer"),
    vetoEnabled: parsed.vetoEnabled ?? false,
    fundingToken: asAddress(parsed.fundingToken, "fundingToken"),
    fundingAmount: parseBigNumberish(parsed.fundingAmount, "fundingAmount"),
    rewardsLimit: parsed.rewardsLimit ? parseBigNumberish(parsed.rewardsLimit, "rewardsLimit") : 500_000_000n,
    approveDeadline: parsed.approveDeadline ? parseBigNumberish(parsed.approveDeadline, "approveDeadline") : now + 7n * 24n * 60n * 60n,
    dealDeadline: parsed.dealDeadline ? parseBigNumberish(parsed.dealDeadline, "dealDeadline") : now + 30n * 24n * 60n * 60n,
    dealConfig,
    evaluatorSelector: evaluator.selector,
    evaluatorConfig,
  };

  const dealManager = await core.getDealManager(dac);
  const created = await core.createDealProposalDetailed({dealManager, params: dealParams});

  printJson({
    action: "deal.create",
    dac,
    dealManager,
    proposer: account.address,
    txHash: created.txHash,
    dealId: created.dealId,
    dacProposalId: created.proposalId,
    dealCell: created.dealCell,
    dealAddress: created.dealAddress,
    evaluatorAddress: created.evaluatorAddress,
    moduleId: dealKind.moduleId,
    evaluatorModuleId: evaluator.moduleId,
  });
}

async function cmdStake(resolver: OptionResolver, amountText: string): Promise<void> {
  const {account, core} = await makeCoreContext(resolver);
  const amount = BigInt(amountText);
  const dealCell = await resolveDealCellAddressForStake(resolver);
  const dac = asAddress(
    resolver.requireString(["cell-address", "dac-address"], "--cell-address is required for deal stake"),
    "DAC address",
  );

  const agentToken = await core.getAgentToken(dac);
  const txHash = await core.stakeAgentToDeal({agentToken, dealCell, amount});
  const stakeToken = await core.getStakeToken({dealCell});

  const autoDelegate = resolver.resolveBoolean("auto-delegate", false);
  let delegateTx: Hex | undefined;
  if (autoDelegate) {
    delegateTx = await core.delegateVotes({token: stakeToken, delegatee: account.address});
  }

  printJson({
    action: "deal.stake",
    staker: account.address,
    dac,
    dealCell,
    agentToken,
    stakeToken,
    amount,
    txHash,
    delegateTx,
  });
}

async function cmdUnstake(resolver: OptionResolver): Promise<void> {
  const {account, core} = await makeCoreContext(resolver);
  const dealCell = await resolveDealCellAddressForStake(resolver);
  const txHash = await core.unstakeFromDeal({dealCell});

  printJson({
    action: "deal.unstake",
    staker: account.address,
    dealCell,
    txHash,
  });
}

async function cmdDelegate(resolver: OptionResolver): Promise<void> {
  const {account, core} = await makeCoreContext(resolver);

  const stakeTokenFromOption = resolver.resolveString("stake-token");
  const stakeToken = stakeTokenFromOption
    ? asAddress(stakeTokenFromOption, "stake token")
    : await core.getStakeToken({dealCell: await resolveDealCellAddressForStake(resolver)});

  const delegatee = asAddress(resolver.resolveString("delegatee", account.address) ?? account.address, "delegatee");
  const txHash = await core.delegateVotes({token: stakeToken, delegatee});
  const votes = await core.getVotes({token: stakeToken, account: delegatee});

  printJson({
    action: "deal.delegate",
    stakeToken,
    delegatee,
    txHash,
    votes,
  });
}

async function cmdRequest(resolver: OptionResolver, amountText: string): Promise<void> {
  const amount = BigInt(amountText);
  const {core, account} = await makeCoreContext(resolver);
  const resolved = await resolveDealRecordOrThrow(resolver);
  const dacAddress = resolver.resolveString(["cell-address", "dac-address"])
    ? asAddress(resolver.requireString(["cell-address", "dac-address"]), "DAC address")
    : dacAddressFromCompositeId(resolved.dacId);

  const agentToken = await core.getAgentToken(dacAddress);
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

const BASE_DEAL_PROPOSAL_TYPES = new Set<string>([
  "update-voting-config",
  "toggle-whitelist",
  "toggle-early-returns",
  "enable-veto-right",
  "request-tranche",
  "add-stake",
]);

async function cmdPropose(resolver: OptionResolver, proposalTypeRaw: string, args: string[]): Promise<void> {
  const {core} = await makeCoreContext(resolver);
  const dealAddress = await resolveDealAddressForWrite(resolver);
  const resolved = await resolveDealRecordOrThrow(resolver);
  const indexer = makeIndexer(resolver);
  const inputPath = resolver.resolveString("input");
  const input = inputPath ? await readJsonFile<Record<string, unknown>>(resolvePath(inputPath)) : undefined;
  const resolvedType = resolveDealProposalType(proposalTypeRaw);
  const proposalType = resolvedType.canonicalType;

  if (resolvedType.moduleIdHint && !resolvedType.spec && BASE_DEAL_PROPOSAL_TYPES.has(proposalType)) {
    throw new Error(`'${proposalTypeRaw}' is a kernel deal proposal type. Remove module prefix.`);
  }

  let params: ProposalParams;

  if (proposalType === "update-voting-config") {
    if (args.length !== 5 && !input) {
      throw new Error("deal propose update-voting-config requires positional args or --input json");
    }
    const quorumPercent = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "quorumPercent", "--input");
    const blockingPercent = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "blockingPercent", "--input");
    const highQuorumPercent = args[2] !== undefined ? BigInt(args[2]) : readBigIntField(input, "highQuorumPercent", "--input");
    const duration = args[3] !== undefined ? BigInt(args[3]) : readBigIntField(input, "duration", "--input");
    const qualification = args[4] !== undefined ? BigInt(args[4]) : readBigIntField(input, "qualification", "--input");
    params = {
      typ: DEAL_PROPOSAL_TYPE.UPDATE_VOTING_CONFIG,
      target: "0x0000000000000000000000000000000000000000",
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters(
        [{
          name: "config",
          type: "tuple",
          components: [
            {name: "quorumPercent", type: "uint256"},
            {name: "blockingPercent", type: "uint256"},
            {name: "highQuorumPercent", type: "uint256"},
            {name: "duration", type: "uint256"},
            {name: "qualification", type: "uint256"},
          ],
        }],
        [{
          quorumPercent,
          blockingPercent,
          highQuorumPercent,
          duration,
          qualification,
        }],
      ),
    };
  } else if (proposalType === "toggle-whitelist") {
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
  } else if (proposalType === "toggle-early-returns") {
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
  } else if (proposalType === "enable-veto-right") {
    requireNArgs(args, 0, "deal propose enable-veto-right requires no args");
    params = {
      typ: DEAL_PROPOSAL_TYPE.ENABLE_VETO_RIGHT,
      target: "0x0000000000000000000000000000000000000000",
      i: numberToHex(0n, {size: 32}),
      data: "0x",
    };
  } else if (proposalType === "request-tranche") {
    const capitalCallHashOption = resolver.resolveString("capital-call-hash")
      ?? (input ? readStringField(input, "capitalCallHash", "--input") : undefined);
    const capitalCallNonceOption = resolver.resolveString("capital-call-nonce")
      ?? (resolved.childDacAddress && args.length === 1 ? args[0] : undefined);
    const capitalCallNonceFromInput = input && input["capitalCallNonce"] !== undefined
      ? readBigIntField(input, "capitalCallNonce", "--input").toString()
      : undefined;
    const effectiveCapitalCallNonce = capitalCallNonceOption ?? capitalCallNonceFromInput;
    if (capitalCallHashOption || effectiveCapitalCallNonce) {
      if (!resolved.childDacAddress) {
        throw new Error("Capital-call based tranche request requires a DACDeal with childDacAddress in indexer.");
      }
      const childDac = await indexer.dacs.getByAddress(resolved.childDacAddress);
      if (!childDac) {
        throw new Error("Child DAC not found in indexer.");
      }
      const calls = await indexer.capitalCalls.listByDac(childDac.id, {limit: 500, offset: 0});
      const call = calls.find((entry) => {
        if (capitalCallHashOption && entry.callHash.toLowerCase() !== capitalCallHashOption.toLowerCase()) {
          return false;
        }
        if (effectiveCapitalCallNonce && BigInt(entry.nonce) !== BigInt(effectiveCapitalCallNonce)) {
          return false;
        }
        return true;
      });
      if (!call) {
        throw new Error("Matching child capital call not found.");
      }

      const amount = BigInt(call.cashAmount);
      const callHash = asBytes32(call.callHash, "callHash") as Hex;
      params = {
        typ: DEAL_PROPOSAL_TYPE.REQUEST_TRANCHE,
        target: asAddress(call.treasuryTokenAddress, "capital call treasury token"),
        i: numberToHex(amount, {size: 32}),
        data: encodeAbiParameters(
          [
            {name: "fundingAmount", type: "uint256"},
            {name: "callHash", type: "bytes32"},
          ],
          [amount, callHash],
        ),
      };
    } else {
      if (args.length !== 2 && !input) {
        throw new Error("deal propose request-tranche requires positional args or --input json");
      }
      const token = args[0] ?? readStringField(input, "token", "--input");
      const amount = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "amount", "--input");
      params = {
        typ: DEAL_PROPOSAL_TYPE.REQUEST_TRANCHE,
        target: asAddress(token, "token"),
        i: numberToHex(amount, {size: 32}),
        data: "0x",
      };
    }
  } else if (proposalType === "add-stake") {
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
        const agentToken = await core.getAgentToken(dacAddress);
        amount = await core.getErc20Allowance({
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
  } else {
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
    params = await moduleProposal.build({
      args,
      input,
      resolver,
      core,
      indexer,
      resolvedDeal: resolved,
    });
  }

  const created = await core.createDealManagementProposal({dealAddress, params});

  const outputType = resolvedType.spec
    ? `${resolvedType.spec.moduleId}:${resolvedType.spec.key}`
    : proposalType;

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
  const {core, rpcUrl} = await makeCoreContext(resolver);
  const dealAddress = await resolveDealAddressForWrite(resolver);
  const proposalId = BigInt(proposalIdText);
  const support = parseBoolText(supportText);

  const proposalAddress = await core.getDealProposalVotingAddress({dealAddress, proposalId});
  const preVoteAdvanceSeconds = resolver.resolveNumber("pre-vote-advance-seconds", 1) ?? 1;
  await advanceTime(rpcUrl, preVoteAdvanceSeconds);

  const voteTx = await core.voteProposal({proposalAddress, support});
  const status = await core.checkProposalOutcome({proposalAddress});

  printJson({
    action: "deal.vote.proposal",
    deal: dealAddress,
    proposalId,
    proposalAddress,
    support,
    voteTx,
    status,
  });
}

async function cmdExecute(resolver: OptionResolver, proposalIdText: string): Promise<void> {
  const {core, rpcUrl} = await makeCoreContext(resolver);
  const dealAddress = await resolveDealAddressForWrite(resolver);
  const proposalId = BigInt(proposalIdText);

  const proposalAddress = await core.getDealProposalVotingAddress({dealAddress, proposalId});

  let status = await core.checkProposalOutcome({proposalAddress});
  if (!status.resolved) {
    const advanceSeconds = resolver.resolveNumber("advance-seconds", 0) ?? 0;
    if (advanceSeconds > 0) {
      await advanceTime(rpcUrl, advanceSeconds);
      status = await core.checkProposalOutcome({proposalAddress});
    }
  }

  if (!status.resolved) {
    throw new Error("Deal proposal is not resolved yet. Pass --advance-seconds to advance local chain time.");
  }
  if (!status.outcome) {
    throw new Error("Deal proposal resolved with negative outcome.");
  }

  const details = await core.executeDealProposalDetailed({dealAddress, proposalId});

  printJson({
    action: "deal.execute",
    deal: dealAddress,
    proposalId,
    proposalAddress,
    txHash: details.txHash,
    dacProposalId: details.dacProposalId,
    trancheId: details.trancheId,
    childProposalId: details.childProposalId,
    childVoteProposalId: details.childVoteProposalId,
  });
}

async function cmdEvaluate(resolver: OptionResolver, evaluatorIdText?: string): Promise<void> {
  const {core, account} = await makeCoreContext(resolver);
  const resolved = await resolveDealRecordOrThrow(resolver);
  const evaluatorId = evaluatorIdText ? BigInt(evaluatorIdText) : (resolver.resolveBigInt("evaluator-id", 0n) ?? 0n);
  const dacAddress = resolver.resolveString(["cell-address", "dac-address"])
    ? asAddress(resolver.requireString(["cell-address", "dac-address"]), "DAC address")
    : dacAddressFromCompositeId(resolved.dacId);
  const dealManager = await core.getDealManager(dacAddress);

  const txHash = await core.evaluateDeal({
    dealManager,
    dealId: resolved.dealNumericId,
    evaluatorId,
  });

  printJson({
    action: "deal.evaluate",
    caller: account.address,
    dealId: resolved.id,
    dealNumericId: resolved.dealNumericId,
    dealAddress: resolved.dealAddress,
    dealCell: resolved.cellAddress,
    dealManager,
    evaluatorId,
    txHash,
  });
}

async function cmdClaim(resolver: OptionResolver, evaluatorIdText?: string): Promise<void> {
  const {core, account} = await makeCoreContext(resolver);
  const dealCell = await resolveDealCellAddressForStake(resolver);
  const evaluatorId = evaluatorIdText ? BigInt(evaluatorIdText) : (resolver.resolveBigInt("evaluator-id", 0n) ?? 0n);
  const txHash = await core.claimMainToken({dealCell, evaluatorId});

  printJson({
    action: "deal.claim",
    caller: account.address,
    dealCell,
    evaluatorId,
    txHash,
  });
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

  const dealManager = await core.getDealManager(dacAddress);
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
  const dealId = BigInt(dealNumericIdText);
  const dac = asAddress(
    resolver.requireString(["cell-address", "dac-address"], "--cell-address is required for deal withdraw"),
    "DAC address",
  );
  const dealManager = await core.getDealManager(dac);
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

  const resource = z.enum(["deal", "proposal", "proposals", "treasury-actions"]).catch("deal").parse(resourceRaw ?? "deal");

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

  const dealId = await resolveDealIdOrThrow(resolver);
  const treasuryActions = await client.treasuryActions.listByDeal(dealId, page);
  printJson({action: "deal.view.treasury-actions", dealId, count: treasuryActions.length, treasuryActions});
}

export function registerDealCommands(program: Command, resolverFactory: (options: Record<string, unknown>) => Promise<OptionResolver>): void {
  const deal = program.command("deal").description("Deal-level operations");

  deal
    .command("create <dealFile>")
    .description("Create a deal from JSON file")
    .action(async function handleCreate(dealFile: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdCreate(resolver, dealFile);
    });

  deal
    .command("stake <amount>")
    .description("Stake AgentToken into a deal")
    .action(async function handleStake(amount: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdStake(resolver, amount);
    });

  deal
    .command("unstake")
    .description("Unstake from a deal after permit/close rules are satisfied")
    .action(async function handleUnstake() {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdUnstake(resolver);
    });

  deal
    .command("delegate")
    .description("Delegate StakedAgent voting power")
    .action(async function handleDelegate() {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdDelegate(resolver);
    });

  deal
    .command("request <amount>")
    .description("Request stake in active deal (AgentToken approve -> StakeRequested)")
    .action(async function handleRequest(amount: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdRequest(resolver, amount);
    });

  deal
    .command("propose <proposalType> [args...]")
    .description("Create a deal governance proposal")
    .action(async function handlePropose(proposalType: string, args: string[]) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdPropose(resolver, proposalType, args);
    });

  const vote = deal.command("vote").description("Vote deal proposals");
  vote
    .command("proposal <proposalId> <support>")
    .description("Vote for a deal proposal")
    .action(async function handleVote(proposalId: string, support: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdVoteProposal(resolver, proposalId, support);
    });

  deal
    .command("execute <proposalId>")
    .description("Execute a passed deal proposal")
    .action(async function handleExecute(proposalId: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdExecute(resolver, proposalId);
    });

  deal
    .command("evaluate [evaluatorId]")
    .description("Evaluate a deal via DealManager.evaluateDeal")
    .action(async function handleEvaluate(evaluatorId: string | undefined) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdEvaluate(resolver, evaluatorId);
    });

  deal
    .command("claim [evaluatorId]")
    .description("Claim unlocked MainToken rewards from deal cell")
    .action(async function handleClaim(evaluatorId: string | undefined) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdClaim(resolver, evaluatorId);
    });

  deal
    .command("legal-message [dealNumericId] <messageFile>")
    .description("Send legal wrapper message via DealManager.legalWrapperMessage")
    .action(async function handleLegalMessage(dealNumericId: string | undefined, messageFile: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdLegalMessage(resolver, messageFile, dealNumericId);
    });

  deal
    .command("withdraw <dealNumericId>")
    .description("Force return capital after deadline via DealManager.forceReturnCapital")
    .action(async function handleWithdraw(dealNumericId: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdWithdraw(resolver, dealNumericId);
    });

  deal
    .command("view [resource] [id]")
    .description("View deal/indexer state")
    .action(async function handleView(resource: string | undefined, id: string | undefined) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdView(resolver, resource, id);
    });
}
