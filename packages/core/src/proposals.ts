import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {DAC_PROPOSAL_TYPE, DEAL_PROPOSAL_TYPE} from "./selectors";
import {AGENT_TOKEN_MINT_ACTION, type AgentTokenMintAction} from "./types";
import type {DealCreationConfig, GovernanceStrategyConfig, ProposalParams, VotingConfig} from "./types";
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

export function buildMintAgentTokensDistributorProposal(distributor: Address, amount: bigint): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.MINT_AGENT_TOKENS,
    target: distributor,
    i: toBytes32FromUint(amount),
    data: encodeAbiParameters(
      [{name: "action", type: "uint8"}],
      [AGENT_TOKEN_MINT_ACTION.DISTRIBUTOR_INVENTORY],
    ),
  };
}

export function buildDisableAgentDistributorProposal(distributor: Address): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.MINT_AGENT_TOKENS,
    target: distributor,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [{name: "action", type: "uint8"}],
      [AGENT_TOKEN_MINT_ACTION.DISTRIBUTOR_DISABLE],
    ),
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

export function buildUpdateDacVotingConfigProposal(config: VotingConfig): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.UPDATE_VOTING_CONFIG,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
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
          {name: "executionValidityDuration", type: "uint256"},
        ],
      }],
      [config],
    ),
  };
}

export function buildUpdateDealVotingConfigProposal(config: VotingConfig): ProposalParams {
  return {
    typ: DEAL_PROPOSAL_TYPE.UPDATE_VOTING_CONFIG,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
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
          {name: "executionValidityDuration", type: "uint256"},
        ],
      }],
      [config],
    ),
  };
}

export function buildUpdateGovernanceStrategyProposal(config: GovernanceStrategyConfig): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.UPDATE_GOVERNANCE_STRATEGY,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [{
        name: "config",
        type: "tuple",
        components: [
          {name: "quorumPercent", type: "uint256"},
          {name: "highQuorumPercent", type: "uint256"},
          {name: "blockingPercent", type: "uint256"},
          {name: "duration", type: "uint256"},
          {name: "qualification", type: "uint256"},
          {name: "executionValidityDuration", type: "uint256"},
          {name: "oraclePublishDeadline", type: "uint256"},
          {name: "fallbackWarmupDuration", type: "uint256"},
          {name: "fallbackDuration", type: "uint256"},
          {name: "blockingOnAllProposals", type: "bool"},
          {name: "blockingOnHighQuorum", type: "bool"},
          {name: "oraclePrimaryEnabled", type: "bool"},
        ],
      }],
      [config],
    ),
  };
}

export function buildUpdateDealCreationConfigProposal(config: DealCreationConfig): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.UPDATE_DEAL_CREATION_CONFIG,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [{
        name: "config",
        type: "tuple",
        components: [
          {name: "minAgentBalance", type: "uint256"},
          {name: "minInitialAgentStake", type: "uint256"},
        ],
      }],
      [config],
    ),
  };
}

export function buildUpdateGovernanceOracleProposal(oracle: Address): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.UPDATE_GOVERNANCE_ORACLE,
    target: oracle,
    i: toBytes32FromUint(0n),
    data: "0x",
  };
}

export function buildStrikeOutAgentProposal(agent: Address): ProposalParams {
  return {
    typ: DEAL_PROPOSAL_TYPE.STRIKE_OUT_AGENT,
    target: agent,
    i: toBytes32FromUint(0n),
    data: "0x",
  };
}

export function buildEnableDealChallengeRightProposal(): ProposalParams {
  return {
    typ: DEAL_PROPOSAL_TYPE.ENABLE_CHALLENGE_RIGHT,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: "0x",
  };
}

export function buildChallengeDealProposal(dealId: bigint, dealProposalId: bigint): ProposalParams {
  return {
    typ: DAC_PROPOSAL_TYPE.CHALLENGE_DEAL,
    target: ZERO_ADDRESS,
    i: toBytes32FromUint(0n),
    data: encodeAbiParameters(
      [{name: "dealId", type: "uint256"}, {name: "dealProposalId", type: "uint256"}],
      [dealId, dealProposalId],
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
