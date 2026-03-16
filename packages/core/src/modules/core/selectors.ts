import {toFunctionSelector} from "viem";

export const CORE_DEAL_KIND = {
  DAC_DEAL: toFunctionSelector("createDACDeal()"),
  PERMIT2_TREASURY: toFunctionSelector("createPermit2TreasuryDeal()"),
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
  APPROVE_DIRECT_SPEND: toFunctionSelector("directSpend()"),
  APPROVE_PERMIT2_SPEND: toFunctionSelector("approvePermit2Spend()"),
  APPROVE_AGENT_SPEND: toFunctionSelector("approveAgentSpend()"),
  ASSIGN_CLAIMER: toFunctionSelector("assignClaimer()"),
  REVOKE_AGENT: toFunctionSelector("revokeAgent()"),
  RETURN_CAPITAL_TO_DAC: toFunctionSelector("returnCapitalToDAC()"),
  DELEGATE_VOTE_RIGHTS: toFunctionSelector("delegateVotingPower()"),
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
