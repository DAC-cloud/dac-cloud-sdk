import {
  buildApproveVotingVenueVersionProposal,
  buildChildDacCreateProposalProposal,
  buildChildDacReinvestProfitsProposal,
  buildChildDacReturnProfitsProposal,
  buildChildDacVoteProposalProposal,
  buildExternalVoteSignProposal,
  buildHostApproveStakeProposal,
  buildHostClaimRewardProposal,
  buildHostCreateDealProposal,
  buildHostCreateProposalProposal,
  buildHostInviteProposal,
  buildHostStakeProposal,
  buildHostUnstakeProposal,
  buildHostVoteProposal,
  buildReturnAssetToDacProposal,
  buildSnapshotV1VoteSignProposal,
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
const {VENUE_SNAPSHOT_V1} = coreModule;
const {
  encodeAgentDealConfigFromJson,
  encodeDacDealConfigFromJson,
  encodePermit2TreasuryDealConfigFromJson,
  encodeMilestoneEvaluatorConfigFromJson,
  encodeRevenueEvaluatorConfigFromJson,
} = coreModule;
import type {ProtocolManifest} from "@dac-cloud/manifests";
import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {z} from "zod";
import {parseDealFile} from "../actions/deal-params";
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

async function buildPermit2SpendProposal(context: ModuleDealProposalBuildContext): Promise<ProposalParams> {
  const {args, input, core, resolvedDeal} = context;
  ensureArgsOrInput(args, input, 4, "deal propose permit2-spend");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const spender = args[1] ?? readStringField(input, "spender", "--input");
  const amount = args[2] !== undefined ? BigInt(args[2]) : readBigIntField(input, "amount", "--input");
  const expiration = args[3] !== undefined ? BigInt(args[3]) : readBigIntField(input, "expiration", "--input");

  // The allowance must outlive the vote: the contract reverts PermitExpirationTooShort
  // unless expiration > block.timestamp + votingConfig.duration. Checked against chain
  // time, which is what the contract compares to.
  const [votingConfig, chainTime] = await Promise.all([
    core.getDealVotingConfig({dealAddress: resolvedDeal.dealAddress}),
    core.getChainTime(),
  ]);
  const minExpiration = chainTime + votingConfig.duration;
  if (expiration <= minExpiration) {
    throw new Error(
      `PermitExpirationTooShort: expiration ${expiration} must be greater than chain time ${chainTime} `
      + `+ deal voting duration ${votingConfig.duration} (= ${minExpiration}).`,
    );
  }

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

// Resolve a CLI-supplied venue identifier: the literal "snapshot-v1" maps to
// the keccak256 discriminator known to the DACDeal contract; everything else
// must be a bytes32 hex (for future / fork venues).
function resolveVenueId(raw: string): Hex {
  if (raw === "snapshot-v1" || raw === "snapshot_v1") {
    return VENUE_SNAPSHOT_V1 as Hex;
  }
  return asBytes32(raw, "venueId") as Hex;
}

function readSnapshotV1Payload(
  input: Record<string, unknown> | undefined,
  resolvedDealAddress: string,
): {
  version: string;
  from: string;
  space: string;
  timestamp: bigint;
  proposal: string;
  choice: number;
  reason: string;
  app: string;
  metadata: string;
  expiry: bigint;
} {
  if (!input) {
    throw new Error("deal propose snapshot-vote-sign requires --input json with the Vote payload");
  }
  const choiceRaw = input["choice"];
  if (typeof choiceRaw !== "number" && typeof choiceRaw !== "string") {
    throw new Error("snapshot-vote-sign payload requires numeric 'choice'");
  }
  const choice = typeof choiceRaw === "number" ? choiceRaw : Number(choiceRaw);
  if (!Number.isInteger(choice) || choice < 0 || choice > 0xffffffff) {
    throw new Error("snapshot-vote-sign 'choice' must fit in uint32");
  }
  const fromRaw = typeof input["from"] === "string" && (input["from"] as string).length > 0
    ? (input["from"] as string)
    : resolvedDealAddress;
  return {
    version: readStringField(input, "version", "snapshot-vote-sign --input"),
    from: fromRaw.toLowerCase(),
    space: readStringField(input, "space", "snapshot-vote-sign --input"),
    timestamp: readBigIntField(input, "timestamp", "snapshot-vote-sign --input"),
    proposal: readStringField(input, "proposal", "snapshot-vote-sign --input"),
    choice,
    reason: typeof input["reason"] === "string" ? (input["reason"] as string) : "",
    app: typeof input["app"] === "string" ? (input["app"] as string) : "dac-cloud",
    metadata: typeof input["metadata"] === "string" ? (input["metadata"] as string) : "",
    expiry: readBigIntField(input, "expiry", "snapshot-vote-sign --input"),
  };
}

function buildApproveVenueVersionCmd(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 3, "deal propose approve-venue-version");
  const venueRaw = args[0] ?? readStringField(input, "venueId", "--input");
  const version = args[1] ?? readStringField(input, "version", "--input");
  const allowed = args[2] !== undefined ? parseBoolText(args[2]) : readBoolField(input, "allowed", "--input");
  return buildApproveVotingVenueVersionProposal(resolveVenueId(venueRaw), version, allowed);
}

function buildSnapshotVoteSignCmd(context: ModuleDealProposalBuildContext): ProposalParams {
  const {input, resolvedDeal} = context;
  const payload = readSnapshotV1Payload(input, resolvedDeal.dealAddress);
  return buildSnapshotV1VoteSignProposal(payload);
}

function buildExternalVoteSignCmd(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 2, "deal propose external-vote-sign");
  const venueRaw = args[0] ?? readStringField(input, "venueId", "--input");
  const payloadHex = args[1] ?? readStringField(input, "payload", "--input");
  return buildExternalVoteSignProposal(
    resolveVenueId(venueRaw),
    normalizeHexData(payloadHex, "external-vote-sign payload"),
  );
}

// ---- AgentDeal ----

// Host deals are addressed by DealCell on-chain; accept the Deal address too and
// map it through the indexer.
async function resolveHostDealCell(context: ModuleDealProposalBuildContext, raw: string): Promise<Address> {
  const address = asAddress(raw, "hostDealCell");
  const found = await context.indexer.deals.getByAddress(address);
  return found?.cellAddress ? asAddress(found.cellAddress, "hostDealCell") : address;
}

async function buildHostStakeCmd(context: ModuleDealProposalBuildContext): Promise<ProposalParams> {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 2, "deal propose host-stake");
  const hostDealCell = await resolveHostDealCell(context, args[0] ?? readStringField(input, "hostDealCell", "--input"));
  const amount = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "amount", "--input");
  return buildHostStakeProposal(hostDealCell, amount);
}

async function buildHostApproveStakeCmd(context: ModuleDealProposalBuildContext): Promise<ProposalParams> {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 2, "deal propose host-approve-stake");
  const hostDealCell = await resolveHostDealCell(context, args[0] ?? readStringField(input, "hostDealCell", "--input"));
  const amount = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "amount", "--input");
  return buildHostApproveStakeProposal(hostDealCell, amount);
}

async function buildHostCreateDealCmd(context: ModuleDealProposalBuildContext): Promise<ProposalParams> {
  const {input, core, resolvedDeal} = context;
  if (!input) {
    throw new Error("deal propose host-create-deal requires --input <deal.json> (same format as `dac deal create`)");
  }
  const dealFile = parseDealFile(input);
  const moduleFactoryRaw = dealFile.explicitModuleFactory ?? dealFile.dealKind.defaultModuleFactory?.(core.protocol);
  const onchainGovernanceFactory = !dealFile.explicitGovernanceFactory && moduleFactoryRaw
    ? await core.getDealGovernanceFactory({moduleFactory: asAddress(moduleFactoryRaw, "moduleFactory")})
    : undefined;
  // `proposer` is overwritten on-chain with the AgentDeal address; set it here so the
  // encoded params read the same as what the host deal manager will receive.
  const hostDealParams = dealFile.build(core.protocol, resolvedDeal.dealAddress, {governanceFactory: onchainGovernanceFactory});
  hostDealParams.proposer = resolvedDeal.dealAddress;

  const accepted = await core.dealAcceptsGovernanceFactory({
    moduleFactory: hostDealParams.moduleFactory,
    dealKind: hostDealParams.dealKind,
    governanceFactory: hostDealParams.governanceFactory,
  });
  if (accepted === false) {
    throw new Error(
      `GovernanceFactoryNotAccepted: module ${hostDealParams.moduleFactory} does not accept governanceFactory `
      + `${hostDealParams.governanceFactory} for the host deal.`,
    );
  }
  return buildHostCreateDealProposal(hostDealParams);
}

async function buildHostCreateProposalCmd(context: ModuleDealProposalBuildContext): Promise<ProposalParams> {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 5, "deal propose host-create-proposal");
  const hostDealCell = await resolveHostDealCell(context, args[0] ?? readStringField(input, "hostDealCell", "--input"));
  const typ = args[1] ?? readStringField(input, "typ", "--input");
  const target = args[2] ?? readStringField(input, "target", "--input");
  const iValue = args[3] ?? readStringField(input, "i", "--input");
  const data = args[4] ?? readStringField(input, "data", "--input");
  return buildHostCreateProposalProposal(hostDealCell, {
    typ: asBytes4(typ, "host typ") as Hex,
    target: asAddress(target, "host target"),
    i: toBytes32FromNumberish(iValue),
    data: normalizeHexData(data, "host data"),
  });
}

async function buildHostVoteCmd(context: ModuleDealProposalBuildContext): Promise<ProposalParams> {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 3, "deal propose host-vote");
  const hostDealCell = await resolveHostDealCell(context, args[0] ?? readStringField(input, "hostDealCell", "--input"));
  const hostProposalId = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "hostProposalId", "--input");
  const support = args[2] !== undefined ? parseBoolText(args[2]) : readBoolField(input, "support", "--input");
  return buildHostVoteProposal(hostDealCell, hostProposalId, support);
}

async function buildHostClaimRewardCmd(context: ModuleDealProposalBuildContext): Promise<ProposalParams> {
  const {args, input} = context;
  if (args.length !== 1 && args.length !== 2 && !input) {
    throw new Error("deal propose host-claim-reward requires <hostDeal> [evaluatorId] or --input json");
  }
  const hostDealCell = await resolveHostDealCell(context, args[0] ?? readStringField(input, "hostDealCell", "--input"));
  const evaluatorId = args[1] !== undefined
    ? BigInt(args[1])
    : input?.evaluatorId !== undefined ? readBigIntField(input, "evaluatorId", "--input") : 0n;
  return buildHostClaimRewardProposal(hostDealCell, evaluatorId);
}

async function buildHostUnstakeCmd(context: ModuleDealProposalBuildContext): Promise<ProposalParams> {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 1, "deal propose host-unstake");
  const hostDealCell = await resolveHostDealCell(context, args[0] ?? readStringField(input, "hostDealCell", "--input"));
  return buildHostUnstakeProposal(hostDealCell);
}

async function buildHostInviteCmd(context: ModuleDealProposalBuildContext): Promise<ProposalParams> {
  const {args, input} = context;
  if (args.length !== 2 && args.length !== 3 && !input) {
    throw new Error("deal propose host-invite requires <hostDeal> <invitee> [grantInviteRight] or --input json");
  }
  const hostDealCell = await resolveHostDealCell(context, args[0] ?? readStringField(input, "hostDealCell", "--input"));
  const invitee = args[1] ?? readStringField(input, "invitee", "--input");
  const grantInviteRight = args[2] !== undefined
    ? parseBoolText(args[2])
    : input?.grantInviteRight !== undefined ? readBoolField(input, "grantInviteRight", "--input") : false;
  return buildHostInviteProposal(hostDealCell, asAddress(invitee, "invitee"), grantInviteRight);
}

function buildReturnAssetCmd(context: ModuleDealProposalBuildContext): ProposalParams {
  const {args, input} = context;
  ensureArgsOrInput(args, input, 2, "deal propose return-asset");
  const token = args[0] ?? readStringField(input, "token", "--input");
  const amount = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "amount", "--input");
  return buildReturnAssetToDacProposal(asAddress(token, "token"), amount);
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
    {
      moduleId: "core",
      key: "agent-deal",
      selector: CORE_DEAL_KIND.AGENT_DEAL,
      aliases: ["agent-deal", "agent_deal"],
      encodeConfig: encodeAgentDealConfigFromJson,
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
    {moduleId: "core", key: "approve-venue-version", aliases: ["approve-venue-version", "approve-snapshot-version"], build: buildApproveVenueVersionCmd},
    {moduleId: "core", key: "snapshot-vote-sign", aliases: ["snapshot-vote-sign", "snapshot-v1-vote"], build: buildSnapshotVoteSignCmd},
    {moduleId: "core", key: "external-vote-sign", aliases: ["external-vote-sign"], build: buildExternalVoteSignCmd},
    {moduleId: "core", key: "host-stake", aliases: ["host-stake"], build: buildHostStakeCmd},
    {moduleId: "core", key: "host-approve-stake", aliases: ["host-approve-stake"], build: buildHostApproveStakeCmd},
    {moduleId: "core", key: "host-create-deal", aliases: ["host-create-deal"], build: buildHostCreateDealCmd},
    {moduleId: "core", key: "host-create-proposal", aliases: ["host-create-proposal"], build: buildHostCreateProposalCmd},
    {moduleId: "core", key: "host-vote", aliases: ["host-vote"], build: buildHostVoteCmd},
    {moduleId: "core", key: "host-claim-reward", aliases: ["host-claim-reward"], build: buildHostClaimRewardCmd},
    {moduleId: "core", key: "host-unstake", aliases: ["host-unstake"], build: buildHostUnstakeCmd},
    {moduleId: "core", key: "host-invite", aliases: ["host-invite"], build: buildHostInviteCmd},
    {moduleId: "core", key: "return-asset", aliases: ["return-asset", "return-asset-to-dac"], build: buildReturnAssetCmd},
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
