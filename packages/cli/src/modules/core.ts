import {
  buildChildDacCreateProposalProposal,
  buildChildDacReinvestProfitsProposal,
  buildChildDacReturnProfitsProposal,
  buildChildDacVoteProposalProposal,
  buildTreasuryApproveAgentSpendProposal,
  buildTreasuryAssignClaimerProposal,
  buildTreasuryDelegateVoteRightsProposal,
  buildTreasuryDirectSpendProposal,
  buildTreasuryPermit2SpendProposal,
  buildTreasuryReturnCapitalProposal,
  buildTreasuryRevokeAgentProposal,
  coreModule,
  DEAL_PROPOSAL_TYPE,
  CORE_DEAL_KIND,
  CORE_EVALUATOR_KIND,
  type ProposalParams,
} from "@dac-cloud/core";
const {
  encodeDacDealConfigFromJson,
  encodePermit2TreasuryDealConfigFromJson,
  encodeMilestoneEvaluatorConfigFromJson,
  encodeRevenueEvaluatorConfigFromJson,
} = coreModule;
import type {ProtocolManifest} from "@dac-cloud/manifests";
import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {z} from "zod";
import {asAddress, asBytes32, asBytes4, parseBoolText} from "../actions/shared";
import type {CliModuleSpec, ModuleDealProposalBuildContext} from "./types";

function normalizeHexData(value: string, label: string): Hex {
  return z.string().regex(/^0x[0-9a-fA-F]*$/).parse(value) as Hex;
}

function readAddressFromManifest(
  protocol: ProtocolManifest,
  key: string,
  label: string,
): Address | undefined {
  const raw = protocol[key];
  if (typeof raw !== "string") {
    return undefined;
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(raw)) {
    return undefined;
  }
  return asAddress(raw, label);
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

function toBytes32FromNumberish(value: string): Hex {
  if (value.startsWith("0x")) {
    return asBytes32(value, "bytes32") as Hex;
  }
  return numberToHex(BigInt(value), {size: 32});
}

function ensureArgsOrInput(
  args: string[],
  input: Record<string, unknown> | undefined,
  expected: number,
  hint: string,
): void {
  if (args.length !== expected && !input) {
    throw new Error(`${hint} requires positional args or --input json`);
  }
}

function isDecimalUint(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

async function buildDacDealRequestTrancheKernelHook(context: ModuleDealProposalBuildContext): Promise<ProposalParams | undefined> {
  const {args, input, resolver, indexer, resolvedDeal} = context;

  const capitalCallHashOption = resolver.resolveString("capital-call-hash")
    ?? (input && input["capitalCallHash"] !== undefined ? readStringField(input, "capitalCallHash", "--input") : undefined);
  const capitalCallNonceOption = resolver.resolveString("capital-call-nonce")
    ?? (input && input["capitalCallNonce"] !== undefined ? readBigIntField(input, "capitalCallNonce", "--input").toString() : undefined);

  let positionalNonce: string | undefined;
  let positionalRewards: bigint | undefined;

  if (!capitalCallHashOption && !capitalCallNonceOption) {
    if (args.length === 0 || !isDecimalUint(args[0])) {
      return undefined;
    }
    if (args.length > 2) {
      throw new Error("DACDeal request-tranche capital-call flow accepts <capitalCallNonce> [rewards].");
    }
    positionalNonce = args[0];
    positionalRewards = args[1] !== undefined ? BigInt(args[1]) : undefined;
  } else {
    if (args.length > 1) {
      throw new Error("When using --capital-call-hash/--capital-call-nonce, only optional [rewards] positional arg is allowed.");
    }
    positionalRewards = args[0] !== undefined ? BigInt(args[0]) : undefined;
  }

  const effectiveNonce = capitalCallNonceOption ?? positionalNonce;
  if (!capitalCallHashOption && !effectiveNonce) {
    return undefined;
  }

  if (!resolvedDeal.childDacAddress) {
    throw new Error("Capital-call based tranche request requires a DACDeal with childDacAddress in indexer.");
  }

  const normalizedHash = capitalCallHashOption
    ? asBytes32(capitalCallHashOption, "capital call hash").toLowerCase()
    : undefined;

  const childDac = await indexer.dacs.getByAddress(resolvedDeal.childDacAddress);
  if (!childDac) {
    throw new Error("Child DAC not found in indexer.");
  }

  const calls = await indexer.capitalCalls.listByDac(childDac.id, {limit: 500, offset: 0});
  const call = calls.find((entry) => {
    if (normalizedHash && entry.callHash.toLowerCase() !== normalizedHash) {
      return false;
    }
    if (effectiveNonce && BigInt(entry.nonce) !== BigInt(effectiveNonce)) {
      return false;
    }
    return true;
  });
  if (!call) {
    throw new Error("Matching child capital call not found.");
  }

  const amount = BigInt(call.cashAmount);
  const rewards = positionalRewards ?? (
    input?.rewards !== undefined
      ? readBigIntField(input, "rewards", "--input")
      : 0n
  );
  const callHash = asBytes32(call.callHash, "callHash") as Hex;

  return {
    typ: DEAL_PROPOSAL_TYPE.REQUEST_TRANCHE,
    target: asAddress(call.treasuryTokenAddress, "capital call treasury token"),
    i: numberToHex(amount, {size: 32}),
    data: encodeAbiParameters(
      [
        {name: "rewards", type: "uint256"},
        {name: "callHash", type: "bytes32"},
      ],
      [rewards, callHash],
    ),
  };
}

// Config encoders now delegate to @dac-cloud/core parsers.
// They handle JSON validation, type conversion, and ABI encoding in one step.
// Pre-encoded hex strings (0x...) are passed through.

function buildDirectSpendProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 3, "deal propose direct-spend");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const destination = args[1] ?? readStringField(input, "destination", "--input");
  const amount = args[2] !== undefined ? BigInt(args[2]) : readBigIntField(input, "amount", "--input");
  return buildTreasuryDirectSpendProposal(asAddress(token, "token"), asAddress(destination, "destination"), amount);
}

function buildPermit2SpendProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 4, "deal propose permit2-spend");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const spender = args[1] ?? readStringField(input, "spender", "--input");
  const amount = args[2] !== undefined ? BigInt(args[2]) : readBigIntField(input, "amount", "--input");
  const expiration = args[3] !== undefined ? BigInt(args[3]) : readBigIntField(input, "expiration", "--input");
  return buildTreasuryPermit2SpendProposal(
    asAddress(token, "token"),
    asAddress(spender, "spender"),
    amount,
    expiration,
  );
}

function buildReturnCapitalProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 2, "deal propose return-capital");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const amount = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "amount", "--input");
  return buildTreasuryReturnCapitalProposal(asAddress(token, "token"), amount);
}

function buildApproveAgentSpendProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 7, "deal propose approve-agent-spend");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const agent = args[1] ?? readStringField(input, "agent", "--input");
  const destination = args[2] ?? readStringField(input, "destination", "--input");
  const totalAmount = args[3] !== undefined ? BigInt(args[3]) : readBigIntField(input, "totalAmount", "--input");
  const singleTxAmount = args[4] !== undefined ? BigInt(args[4]) : readBigIntField(input, "singleTxAmount", "--input");
  const clockLimit = args[5] !== undefined ? BigInt(args[5]) : readBigIntField(input, "clockLimit", "--input");
  const duration = args[6] !== undefined ? BigInt(args[6]) : readBigIntField(input, "duration", "--input");
  return buildTreasuryApproveAgentSpendProposal(
    asAddress(token, "token"),
    asAddress(agent, "agent"),
    asAddress(destination, "destination"),
    {
      totalAmount,
      singleTxAmount,
      clockLimit,
      duration,
    },
  );
}

function buildAssignClaimerProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 4, "deal propose assign-claimer");
  const agent = args[0] ?? readStringField(input, "agent", "--input");
  const token = args[1] ?? readStringField(input, "token", "--input");
  const counterparty = args[2] ?? readStringField(input, "counterparty", "--input");
  const amount = args[3] !== undefined ? BigInt(args[3]) : readBigIntField(input, "amount", "--input");
  return buildTreasuryAssignClaimerProposal(
    asAddress(agent, "agent"),
    asAddress(token, "token"),
    asAddress(counterparty, "counterparty"),
    amount,
  );
}

function buildRevokeAgentProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 3, "deal propose revoke-agent");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const agent = args[1] ?? readStringField(input, "agent", "--input");
  const counterparty = args[2] ?? readStringField(input, "counterparty", "--input");
  return buildTreasuryRevokeAgentProposal(
    asAddress(token, "token"),
    asAddress(agent, "agent"),
    asAddress(counterparty, "counterparty"),
  );
}

function buildDelegateVoteRightsProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 2, "deal propose delegate-vote-rights");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const delegatee = args[1] ?? readStringField(input, "delegatee", "--input");
  return buildTreasuryDelegateVoteRightsProposal(asAddress(token, "token"), asAddress(delegatee, "delegatee"));
}

function buildChildCreateProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 4, "deal propose child-create-proposal");
  const typ = args[0] ?? readStringField(input, "typ", "--input");
  const target = args[1] ?? readStringField(input, "target", "--input");
  const iValue = args[2] ?? readStringField(input, "i", "--input");
  const data = args[3] ?? readStringField(input, "data", "--input");
  return buildChildDacCreateProposalProposal({
    typ: asBytes4(typ, "child typ") as Hex,
    target: asAddress(target, "child target"),
    i: toBytes32FromNumberish(iValue),
    data: normalizeHexData(data, "child data"),
  });
}

function buildChildVoteProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 2, "deal propose child-vote-proposal");
  const childProposalId = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "childProposalId", "--input");
  const support = args[1] !== undefined ? parseBoolText(args[1]) : readBoolField(input, "support", "--input");
  return buildChildDacVoteProposalProposal(childProposalId, support);
}

function buildChildReturnProfitsProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 2, "deal propose child-return-profits");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const amount = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "amount", "--input");
  return buildChildDacReturnProfitsProposal(asAddress(token, "token"), amount);
}

function buildChildReinvestProfitsProposal(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 3, "deal propose child-reinvest-profits");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const amount = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "amount", "--input");
  const capitalCallHash = args[2] ?? readStringField(input, "capitalCallHash", "--input");
  return buildChildDacReinvestProfitsProposal(
    asAddress(token, "token"),
    amount,
    asBytes32(capitalCallHash, "capitalCallHash") as Hex,
  );
}

export const coreCliModule: CliModuleSpec = {
  moduleId: "core",
  dealKinds: [
    {
      moduleId: "core",
      key: "permit2-treasury",
      selector: CORE_DEAL_KIND.PERMIT2_TREASURY,
      aliases: ["permit2-treasury", "permit2_treasury", "treasury-deal"],
      encodeConfig: encodePermit2TreasuryDealConfigFromJson,
      defaultModuleFactory: (protocol) => readAddressFromManifest(protocol, "coreModuleFactory", "coreModuleFactory"),
      defaultGovernanceFactory: (protocol) => readAddressFromManifest(protocol, "coreDealGovernanceFactory", "coreDealGovernanceFactory"),
    },
    {
      moduleId: "core",
      key: "dac-deal",
      selector: CORE_DEAL_KIND.DAC_DEAL,
      aliases: ["dac-deal", "dac_deal"],
      encodeConfig: encodeDacDealConfigFromJson,
      defaultModuleFactory: (protocol) => readAddressFromManifest(protocol, "coreModuleFactory", "coreModuleFactory"),
      defaultGovernanceFactory: (protocol) => readAddressFromManifest(protocol, "coreDealGovernanceFactory", "coreDealGovernanceFactory"),
    },
  ],
  evaluatorKinds: [
    {
      moduleId: "core",
      key: "milestones-evaluator",
      selector: CORE_EVALUATOR_KIND.MILESTONES_EVALUATOR,
      aliases: ["milestones-evaluator", "milestones_evaluator"],
      encodeConfig: encodeMilestoneEvaluatorConfigFromJson,
    },
    {
      moduleId: "core",
      key: "revenue-evaluator",
      selector: CORE_EVALUATOR_KIND.REVENUE_EVALUATOR,
      aliases: ["revenue-evaluator", "revenue_evaluator"],
      encodeConfig: encodeRevenueEvaluatorConfigFromJson,
    },
  ],
  dealProposalTypes: [
    {moduleId: "core", key: "direct-spend", aliases: ["direct-spend"], build: buildDirectSpendProposal},
    {moduleId: "core", key: "permit2-spend", aliases: ["permit2-spend"], build: buildPermit2SpendProposal},
    {moduleId: "core", key: "return-capital", aliases: ["return-capital"], build: buildReturnCapitalProposal},
    {moduleId: "core", key: "approve-agent-spend", aliases: ["approve-agent-spend"], build: buildApproveAgentSpendProposal},
    {moduleId: "core", key: "assign-claimer", aliases: ["assign-claimer"], build: buildAssignClaimerProposal},
    {moduleId: "core", key: "revoke-agent", aliases: ["revoke-agent"], build: buildRevokeAgentProposal},
    {moduleId: "core", key: "delegate-vote-rights", aliases: ["delegate-vote-rights"], build: buildDelegateVoteRightsProposal},
    {moduleId: "core", key: "child-create-proposal", aliases: ["child-create-proposal"], build: buildChildCreateProposal},
    {moduleId: "core", key: "child-vote-proposal", aliases: ["child-vote-proposal"], build: buildChildVoteProposal},
    {moduleId: "core", key: "child-return-profits", aliases: ["child-return-profits"], build: buildChildReturnProfitsProposal},
    {moduleId: "core", key: "child-reinvest-profits", aliases: ["child-reinvest-profits"], build: buildChildReinvestProfitsProposal},
  ],
  kernelDealProposalHooks: [
    {
      moduleId: "core",
      key: "request-tranche",
      dealKindSelectors: [CORE_DEAL_KIND.DAC_DEAL],
      build: buildDacDealRequestTrancheKernelHook,
    },
  ],
};
