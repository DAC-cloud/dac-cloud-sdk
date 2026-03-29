import {toFunctionSelector} from "viem";
import {
  CORE_DEAL_KIND as CORE_DEAL_KIND_FROM_MODULE,
  CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE,
  CORE_EVALUATOR_KIND as CORE_EVALUATOR_KIND_FROM_MODULE,
  CORE_TREASURY_PROPOSAL_TYPE as CORE_TREASURY_PROPOSAL_TYPE_FROM_MODULE,
} from "./modules/core/selectors";

export const CORE_DEAL_KIND = CORE_DEAL_KIND_FROM_MODULE;

export const CORE_EVALUATOR_KIND = CORE_EVALUATOR_KIND_FROM_MODULE;

export const DEAL_PROPOSAL_TYPE = {
  UPDATE_VOTING_CONFIG: toFunctionSelector("updateVotingConfig()"),
  REQUEST_TRANCHE: toFunctionSelector("requestTranche()"),
  ADD_STAKE: toFunctionSelector("addStake()"),
  PERMIT_UNSTAKE: toFunctionSelector("permitUnstake()"),
  ENABLE_VETO_RIGHT: toFunctionSelector("enableVetoRight()"),
  ENABLE_CHALLENGE_RIGHT: toFunctionSelector("enableVetoRight()"),
  TOGGLE_WHITELIST: toFunctionSelector("toggleWhitelist()"),
  TOGGLE_EARLY_RETURNS: toFunctionSelector("toggleEarlyReturns()"),
  PERMIT_EVALUATOR_ADD: toFunctionSelector("permitEvaluatorAdd()"),
} as const;

export const CORE_DEAL_PROPOSAL_TYPE = CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE;

export const CORE_TREASURY_PROPOSAL_TYPE = CORE_TREASURY_PROPOSAL_TYPE_FROM_MODULE;

export const DAC_PROPOSAL_TYPE = {
  UPDATE_VOTING_CONFIG: toFunctionSelector("updateVotingConfig()"),
  UPDATE_GOVERNANCE_STRATEGY: toFunctionSelector("updateGovernanceStrategy()"),
  UPDATE_DEAL_CREATION_CONFIG: toFunctionSelector("updateDealCreationConfig()"),
  UPDATE_GOVERNANCE_ORACLE: toFunctionSelector("updateGovernanceOracle()"),
  UPDATE_LEGAL_WRAPPER: toFunctionSelector("updateLegalWrapper()"),
  APPROVE_OFFCHAIN_ACTION: toFunctionSelector("approveOffchainAction()"),
  MINT_MAIN_TOKENS: toFunctionSelector("mintToken()"),
  BURN_MAIN_TOKENS: toFunctionSelector("burnToken()"),
  MINT_AGENT_TOKENS: toFunctionSelector("mintAgentToken()"),
  REVOKE_AGENT_TOKENS: toFunctionSelector("revokeAgentToken()"),
  TOGGLE_DIVIDENDS: toFunctionSelector("toggleDividends()"),
  DIVIDEND_PAYOUT: toFunctionSelector("dividendPayout()"),
  CAPITAL_CALL: toFunctionSelector("capitalCall()"),
  ADD_MODULE: toFunctionSelector("addModuleFactory()"),
  REMOVE_MODULE: toFunctionSelector("removeModuleFactory()"),
  APPROVE_DEAL: toFunctionSelector("approveDeal()"),
  APPROVE_TRANCHE: toFunctionSelector("approveTranche()"),
  RECOVER_DEAL: toFunctionSelector("recoverDeal()"),
  DEAL_MESSAGE: toFunctionSelector("passDealMessage()"),
  CAST_VETO_DEAL: toFunctionSelector("castVetoForDealProposal()"),
  CHALLENGE_DEAL: toFunctionSelector("castVetoForDealProposal()"),
  ADD_EVALUATOR: toFunctionSelector("addDealEvaluator()"),
  DELEGATE_VOTE_RIGHTS: toFunctionSelector("delegateVotingPower()"),
} as const;
