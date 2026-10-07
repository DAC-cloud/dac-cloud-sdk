import {toFunctionSelector} from "viem";

export const CORE_DEAL_KIND = {
  DAC_DEAL: toFunctionSelector("createDACDeal()"),
  PERMIT2_TREASURY: toFunctionSelector("createPermit2TreasuryDeal()"),
  AGENT_DEAL: toFunctionSelector("createAgentDeal()"),
} as const;

export const CORE_EVALUATOR_KIND = {
  MILESTONES_EVALUATOR: toFunctionSelector("createMilestoneEvaluator()"),
  REVENUE_EVALUATOR: toFunctionSelector("createRevenueEvaluator()"),
} as const;

export const CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE = {
  REINVEST_PROFITS: toFunctionSelector("reinvestProfits()"),
  CREATE_DAC_PROPOSAL: toFunctionSelector("createDACManagementProposal()"),
  VOTE_DAC_PROPOSAL: toFunctionSelector("voteDACManagementProposal()"),
  RETURN_PROFITS: toFunctionSelector("returnProfits()"),
  APPROVE_VOTING_VENUE_VERSION: toFunctionSelector("approveVotingVenueVersion()"),
  EXTERNAL_VOTE_SIGN: toFunctionSelector("externalVoteSign()"),
  APPROVE_DIRECT_SPEND: toFunctionSelector("directSpend()"),
  APPROVE_PERMIT2_SPEND: toFunctionSelector("approvePermit2Spend()"),
  APPROVE_AGENT_SPEND: toFunctionSelector("approveAgentSpend()"),
  ASSIGN_CLAIMER: toFunctionSelector("assignClaimer()"),
  REVOKE_AGENT: toFunctionSelector("revokeAgent()"),
  RETURN_CAPITAL_TO_DAC: toFunctionSelector("returnCapitalToDAC()"),
  DELEGATE_VOTE_RIGHTS: toFunctionSelector("delegateVotingPower()"),
  HOST_STAKE: toFunctionSelector("hostStake()"),
  HOST_APPROVE_STAKE: toFunctionSelector("hostApproveStake()"),
  HOST_CREATE_DEAL: toFunctionSelector("hostCreateDeal()"),
  HOST_CREATE_PROPOSAL: toFunctionSelector("hostCreateProposal()"),
  HOST_VOTE: toFunctionSelector("hostVote()"),
  HOST_CLAIM_REWARD: toFunctionSelector("hostClaimReward()"),
  HOST_UNSTAKE: toFunctionSelector("hostUnstake()"),
  HOST_INVITE: toFunctionSelector("hostInvite()"),
  RETURN_ASSET_TO_DAC: toFunctionSelector("returnAssetToDAC()"),
} as const;

export const CORE_TREASURY_PROPOSAL_TYPE = {
  APPROVE_DIRECT_SPEND: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.APPROVE_DIRECT_SPEND,
  APPROVE_PERMIT2_SPEND: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.APPROVE_PERMIT2_SPEND,
  APPROVE_AGENT_SPEND: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.APPROVE_AGENT_SPEND,
  ASSIGN_CLAIMER: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.ASSIGN_CLAIMER,
  REVOKE_AGENT: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.REVOKE_AGENT,
  RETURN_CAPITAL_TO_DAC: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.RETURN_CAPITAL_TO_DAC,
  DELEGATE_VOTE_RIGHTS: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.DELEGATE_VOTE_RIGHTS,
} as const;

export const CORE_AGENT_DEAL_PROPOSAL_TYPE = {
  HOST_STAKE: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_STAKE,
  HOST_APPROVE_STAKE: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_APPROVE_STAKE,
  HOST_CREATE_DEAL: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_CREATE_DEAL,
  HOST_CREATE_PROPOSAL: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_CREATE_PROPOSAL,
  HOST_VOTE: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_VOTE,
  HOST_CLAIM_REWARD: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_CLAIM_REWARD,
  HOST_UNSTAKE: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_UNSTAKE,
  HOST_INVITE: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.HOST_INVITE,
  RETURN_ASSET_TO_DAC: CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE.RETURN_ASSET_TO_DAC,
} as const;
