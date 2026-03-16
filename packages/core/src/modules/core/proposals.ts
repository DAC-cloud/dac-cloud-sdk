import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE, CORE_TREASURY_PROPOSAL_TYPE} from "./selectors";
import type {TreasurySpendAllowance} from "./types";
import type {ProposalParams} from "../../types";

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
