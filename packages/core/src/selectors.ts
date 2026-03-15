import {toFunctionSelector} from "viem";

export const CORE_DEAL_KIND = {
  DAC_DEAL: toFunctionSelector("createDACDeal()"),
  PERMIT2_TREASURY: toFunctionSelector("createPermit2TreasuryDeal()"),
} as const;

export const DAC_PROPOSAL_TYPE = {
  UPDATE_VOTING_CONFIG: toFunctionSelector("updateVotingConfig()"),
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
  ADD_EVALUATOR: toFunctionSelector("addDealEvaluator()"),
  DELEGATE_VOTE_RIGHTS: toFunctionSelector("delegateVotingPower()"),
} as const;
