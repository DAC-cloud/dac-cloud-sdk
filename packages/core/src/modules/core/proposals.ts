import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE, CORE_TREASURY_PROPOSAL_TYPE} from "./selectors";
import {VENUE_SNAPSHOT_V1, type SnapshotV1Payload, type TreasurySpendAllowance} from "./types";
import {DEAL_PARAMS_ABI_COMPONENTS} from "../../encoding";
import type {DealParams, ProposalParams} from "../../types";

function toBytes32FromUint(value: bigint): Hex {
  return numberToHex(value, {size: 32});
}

function ensureUint48(value: bigint, name: string): number {
  const max = (1n << 48n) - 1n;
  if (value < 0n || value > max) {
    throw new Error(`${name} must be within uint48 range`);
  }
  return Number(value);
}

export function buildTreasuryDirectSpendProposal(
  token: Address,
  destination: Address,
  amount: bigint,
): ProposalParams {
  return {
    typ: CORE_TREASURY_PROPOSAL_TYPE.APPROVE_DIRECT_SPEND,
    target: token,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [{name: "destination", type: "address"}, {name: "amount", type: "uint160"}],
      [destination, amount],
    ),
  };
}

export function buildTreasuryPermit2SpendProposal(
  token: Address,
  spender: Address,
  amount: bigint,
  expiration: bigint,
): ProposalParams {
  return {
    typ: CORE_TREASURY_PROPOSAL_TYPE.APPROVE_PERMIT2_SPEND,
    target: token,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "spender", type: "address"},
        {name: "amount", type: "uint160"},
        {name: "expiration", type: "uint48"},
      ],
      [spender, amount, ensureUint48(expiration, "expiration")],
    ),
  };
}

export function buildTreasuryApproveAgentSpendProposal(
  token: Address,
  agent: Address,
  destination: Address,
  allowance: TreasurySpendAllowance,
): ProposalParams {
  return {
    typ: CORE_TREASURY_PROPOSAL_TYPE.APPROVE_AGENT_SPEND,
    target: token,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "agent", type: "address"},
        {name: "destination", type: "address"},
        {
          name: "allowance",
          type: "tuple",
          components: [
            {name: "totalAmount", type: "uint160"},
            {name: "singleTxAmount", type: "uint160"},
            {name: "clockLimit", type: "uint256"},
            {name: "duration", type: "uint256"},
          ],
        },
      ],
      [agent, destination, allowance],
    ),
  };
}

export function buildTreasuryAssignClaimerProposal(
  agent: Address,
  token: Address,
  counterparty: Address,
  amount: bigint,
): ProposalParams {
  return {
    typ: CORE_TREASURY_PROPOSAL_TYPE.ASSIGN_CLAIMER,
    target: agent,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "token", type: "address"},
        {name: "counterparty", type: "address"},
        {name: "amount", type: "uint160"},
      ],
      [token, counterparty, amount],
    ),
  };
}

export function buildTreasuryRevokeAgentProposal(
  token: Address,
  agent: Address,
  counterparty: Address,
): ProposalParams {
  return {
    typ: CORE_TREASURY_PROPOSAL_TYPE.REVOKE_AGENT,
    target: token,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "agent", type: "address"},
        {name: "counterparty", type: "address"},
      ],
      [agent, counterparty],
    ),
  };
}

export function buildTreasuryReturnCapitalProposal(
  token: Address,
  amount: bigint,
): ProposalParams {
  return {
    typ: CORE_TREASURY_PROPOSAL_TYPE.RETURN_CAPITAL_TO_DAC,
    target: token,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters([{name: "amount", type: "uint256"}], [amount]),
  };
}

export function buildTreasuryDelegateVoteRightsProposal(
  token: Address,
  delegatee: Address,
): ProposalParams {
  return {
    typ: CORE_TREASURY_PROPOSAL_TYPE.DELEGATE_VOTE_RIGHTS,
    target: token,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [{name: "token", type: "address"}, {name: "delegatee", type: "address"}],
      [token, delegatee],
    ),
  };
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export function buildChildDacCreateProposalProposal(childProposal: ProposalParams): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.CREATE_DAC_PROPOSAL,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {
          name: "childProposal",
          type: "tuple",
          components: [
            {name: "typ", type: "bytes4"},
            {name: "target", type: "address"},
            {name: "i", type: "bytes32"},
            {name: "data", type: "bytes"},
          ],
        },
      ],
      [childProposal],
    ),
  };
}

export function buildChildDacVoteProposalProposal(
  childProposalId: bigint,
  support: boolean,
): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.VOTE_DAC_PROPOSAL,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(childProposalId),
    data: encodeAbiParameters([{name: "support", type: "bool"}], [support]),
  };
}

export function buildChildDacReturnProfitsProposal(
  token: Address,
  amount: bigint,
): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.RETURN_PROFITS,
    target: token,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters([{name: "amount", type: "uint256"}], [amount]),
  };
}

export function buildChildDacReinvestProfitsProposal(
  token: Address,
  amount: bigint,
  capitalCallHash: Hex,
): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.REINVEST_PROFITS,
    target: token,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "amount", type: "uint256"},
        {name: "capitalCallHash", type: "bytes32"},
      ],
      [amount, capitalCallHash],
    ),
  };
}

// Whitelist a (venueId, version) pair on a DACDeal so EXTERNAL_VOTE_SIGN can
// approve payloads at that version. High quorum, blocking allowed in the
// factory — treat this as an admin-tier change.
export function buildApproveVotingVenueVersionProposal(
  venueId: Hex,
  version: string,
  allowed: boolean,
): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.APPROVE_VOTING_VENUE_VERSION,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "venueId", type: "bytes32"},
        {name: "version", type: "string"},
        {name: "allowed", type: "bool"},
      ],
      [venueId, version, allowed],
    ),
  };
}

// Generic external vote-sign builder: caller supplies the venueId discriminator
// and a venue-specific ABI-encoded payload. Use buildSnapshotV1VoteSignProposal
// for the common snapshot.org case.
export function buildExternalVoteSignProposal(venueId: Hex, payload: Hex): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.EXTERNAL_VOTE_SIGN,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "venueId", type: "bytes32"},
        {name: "payload", type: "bytes"},
      ],
      [venueId, payload],
    ),
  };
}

export function encodeSnapshotV1Payload(p: SnapshotV1Payload): Hex {
  return encodeAbiParameters(
    [
      {
        type: "tuple",
        components: [
          {name: "version", type: "string"},
          {name: "from", type: "string"},
          {name: "space", type: "string"},
          {name: "timestamp", type: "uint64"},
          {name: "proposal", type: "string"},
          {name: "choice", type: "uint32"},
          {name: "reason", type: "string"},
          {name: "app", type: "string"},
          {name: "metadata", type: "string"},
          {name: "expiry", type: "uint64"},
        ],
      },
    ],
    [p],
  );
}

export function buildSnapshotV1VoteSignProposal(p: SnapshotV1Payload): ProposalParams {
  return buildExternalVoteSignProposal(VENUE_SNAPSHOT_V1, encodeSnapshotV1Payload(p));
}

// ---- AgentDeal (home DAC acts as an agent inside a host DAC) ----
//
// `hostDealCell` is always the DealCell address of a deal registered in the
// bound host DAC; the contract validates it at proposal creation and again at
// execution (InvalidDealAddress otherwise).

const HOST_DEAL_AMOUNT_ABI = [
  {name: "hostDealCell", type: "address"},
  {name: "amount", type: "uint256"},
] as const;

// Pre-approval staking: moves host agent tokens held by the AgentDeal into the
// host deal and self-delegates the resulting StakedAgent. High quorum, veto.
export function buildHostStakeProposal(hostDealCell: Address, amount: bigint): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_STAKE,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(HOST_DEAL_AMOUNT_ABI, [hostDealCell, amount]),
  };
}

// Post-approval staking: approves the host deal to pull stake through a host
// ADD_STAKE proposal and delegates the future stake. High quorum, veto.
export function buildHostApproveStakeProposal(hostDealCell: Address, amount: bigint): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_APPROVE_STAKE,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(HOST_DEAL_AMOUNT_ABI, [hostDealCell, amount]),
  };
}

// Originates a new deal in the host DAC. `proposer` is overwritten on-chain
// with the AgentDeal address; `governanceFactory` must be accepted by the host
// deal's module (see `dealAcceptsGovernanceFactory`). High quorum, veto.
export function buildHostCreateDealProposal(hostDealParams: DealParams): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_CREATE_DEAL,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [{name: "hostDealParams", type: "tuple", components: DEAL_PARAMS_ABI_COMPONENTS}],
      [hostDealParams],
    ),
  };
}

export function buildHostCreateProposalProposal(hostDealCell: Address, hostParams: ProposalParams): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_CREATE_PROPOSAL,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "hostDealCell", type: "address"},
        {
          name: "hostParams",
          type: "tuple",
          components: [
            {name: "typ", type: "bytes4"},
            {name: "target", type: "address"},
            {name: "i", type: "bytes32"},
            {name: "data", type: "bytes"},
          ],
        },
      ],
      [hostDealCell, hostParams],
    ),
  };
}

export function buildHostVoteProposal(
  hostDealCell: Address,
  hostProposalId: bigint,
  support: boolean,
): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_VOTE,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "hostDealCell", type: "address"},
        {name: "hostProposalId", type: "uint256"},
        {name: "support", type: "bool"},
      ],
      [hostDealCell, hostProposalId, support],
    ),
  };
}

// Claims host main-token rewards onto the AgentDeal; route them home with
// buildReturnAssetToDacProposal.
export function buildHostClaimRewardProposal(hostDealCell: Address, evaluatorId: bigint): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_CLAIM_REWARD,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "hostDealCell", type: "address"},
        {name: "evaluatorId", type: "uint256"},
      ],
      [hostDealCell, evaluatorId],
    ),
  };
}

export function buildHostUnstakeProposal(hostDealCell: Address): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_UNSTAKE,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters([{name: "hostDealCell", type: "address"}], [hostDealCell]),
  };
}

export function buildHostInviteProposal(
  hostDealCell: Address,
  invitee: Address,
  grantInviteRight: boolean,
): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_INVITE,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [
        {name: "hostDealCell", type: "address"},
        {name: "invitee", type: "address"},
        {name: "grantInviteRight", type: "bool"},
      ],
      [hostDealCell, invitee, grantInviteRight],
    ),
  };
}

// Routes an earned (foreign) asset held by the AgentDeal to the home treasury.
// The home main token is refused on-chain (NotAllowed).
export function buildReturnAssetToDacProposal(token: Address, amount: bigint): ProposalParams {
  return {
    typ: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.RETURN_ASSET_TO_DAC,
    target: token,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters([{name: "amount", type: "uint256"}], [amount]),
  };
}
