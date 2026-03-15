import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {DAC_PROPOSAL_TYPE} from "./selectors";
import type {ProposalParams} from "./types";

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
