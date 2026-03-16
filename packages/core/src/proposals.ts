import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {DAC_PROPOSAL_TYPE} from "./selectors";
import type {ProposalParams} from "./types";
import type {TreasurySpendAllowance} from "./modules/core/types";
import {
  buildChildDacCreateProposalProposal as buildChildDacCreateProposalProposalModule,
  buildChildDacReinvestProfitsProposal as buildChildDacReinvestProfitsProposalModule,
  buildChildDacReturnProfitsProposal as buildChildDacReturnProfitsProposalModule,
  buildChildDacVoteProposalProposal as buildChildDacVoteProposalProposalModule,
  buildTreasuryApproveAgentSpendProposal as buildTreasuryApproveAgentSpendProposalModule,
  buildTreasuryAssignClaimerProposal as buildTreasuryAssignClaimerProposalModule,
  buildTreasuryDelegateVoteRightsProposal as buildTreasuryDelegateVoteRightsProposalModule,
  buildTreasuryDirectSpendProposal as buildTreasuryDirectSpendProposalModule,
  buildTreasuryPermit2SpendProposal as buildTreasuryPermit2SpendProposalModule,
  buildTreasuryReturnCapitalProposal as buildTreasuryReturnCapitalProposalModule,
  buildTreasuryRevokeAgentProposal as buildTreasuryRevokeAgentProposalModule,
} from "./modules/core/proposals";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

function toBytes32FromUint(value: bigint): Hex {
  return numberToHex(value, {size: 32});
}

export function buildMintAgentTokensProposal(agent: Address, amount: bigint): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.MINT_AGENT_TOKENS,
    target: agent,
    i: toBytes32FromUint(amount),
    data: "0x",
  };
}

export function buildRevokeAgentTokensProposal(agent: Address, amount: bigint): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.REVOKE_AGENT_TOKENS,
    target: agent,
    i: toBytes32FromUint(amount),
    data: "0x",
  };
}

export function buildDelegateVoteRightsProposal(token: Address, delegatee: Address): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.DELEGATE_VOTE_RIGHTS,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [{name: "token", type: "address"}, {name: "delegatee", type: "address"}],
      [token, delegatee],
    ),
  };
}

export function buildMintMainTokensReserveProposal(amount: bigint): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.MINT_MAIN_TOKENS,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(amount),
    data: "0x",
  };
}

export function buildBurnMainTokensReserveProposal(amount: bigint): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.BURN_MAIN_TOKENS,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(amount),
    data: "0x",
  };
}

export function buildCapitalCallProposal(
  recipient: Address,
  treasuryToken: Address,
  tokenAmount: bigint,
  cashAmount: bigint,
): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.CAPITAL_CALL,
    target: recipient,
    i: toBytes32FromUint(tokenAmount),
    data: encodeAbiParameters(
      [{name: "treasuryToken", type: "address"}, {name: "cashAmount", type: "uint256"}],
      [treasuryToken, cashAmount],
    ),
  };
}

export function buildTreasuryDirectSpendProposal(
  token: Address,
  destination: Address,
  amount: bigint,
): ProposalParams {
  return buildTreasuryDirectSpendProposalModule(token, destination, amount);
}

export function buildTreasuryPermit2SpendProposal(
  token: Address,
  spender: Address,
  amount: bigint,
  expiration: bigint,
): ProposalParams {
  return buildTreasuryPermit2SpendProposalModule(token, spender, amount, expiration);
}

export function buildTreasuryReturnCapitalProposal(
  token: Address,
  amount: bigint,
): ProposalParams {
  return buildTreasuryReturnCapitalProposalModule(token, amount);
}

export function buildTreasuryApproveAgentSpendProposal(
  token: Address,
  agent: Address,
  destination: Address,
  allowance: TreasurySpendAllowance,
): ProposalParams {
  return buildTreasuryApproveAgentSpendProposalModule(token, agent, destination, allowance);
}

export function buildTreasuryAssignClaimerProposal(
  agent: Address,
  token: Address,
  counterparty: Address,
  amount: bigint,
): ProposalParams {
  return buildTreasuryAssignClaimerProposalModule(agent, token, counterparty, amount);
}

export function buildTreasuryRevokeAgentProposal(
  token: Address,
  agent: Address,
  counterparty: Address,
): ProposalParams {
  return buildTreasuryRevokeAgentProposalModule(token, agent, counterparty);
}

export function buildTreasuryDelegateVoteRightsProposal(
  token: Address,
  delegatee: Address,
): ProposalParams {
  return buildTreasuryDelegateVoteRightsProposalModule(token, delegatee);
}

export function buildChildDacCreateProposalProposal(childProposal: ProposalParams): ProposalParams {
  return buildChildDacCreateProposalProposalModule(childProposal);
}

export function buildChildDacVoteProposalProposal(childProposalId: bigint, support: boolean): ProposalParams {
  return buildChildDacVoteProposalProposalModule(childProposalId, support);
}

export function buildChildDacReturnProfitsProposal(token: Address, amount: bigint): ProposalParams {
  return buildChildDacReturnProfitsProposalModule(token, amount);
}

export function buildChildDacReinvestProfitsProposal(
  token: Address,
  amount: bigint,
  capitalCallHash: Hex,
): ProposalParams {
  return buildChildDacReinvestProfitsProposalModule(token, amount, capitalCallHash);
}
