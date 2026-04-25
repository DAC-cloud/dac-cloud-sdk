import type {Scenario} from "../harness/types.js";
import {existingTokenDacScenario} from "./existing-token-dac.js";
import {dealSingleAgentScenario} from "./deal-single-agent.js";
import {dealEvalPartialRewardScenario} from "./deal-eval-partial-reward.js";
import {dealEvalFullRewardScenario} from "./deal-eval-full-reward.js";
import {dealForceReturnScenario} from "./deal-force-return.js";
import {dealEvalSlashScenario} from "./deal-eval-slash.js";
import {dealEvalExtensionScenario} from "./deal-eval-extension.js";
import {dealUnstakeAfterCloseScenario} from "./deal-unstake-after-close.js";
import {dealMultiMilestoneScenario} from "./deal-multi-milestone.js";
import {dealVetoScenario} from "./deal-veto.js";
import {dealApproveExpiredScenario} from "./deal-approve-expired.js";
import {dealRawModuleScenario} from "./deal-raw-module.js";
import {dacInvestmentScenario} from "./dac-investment.js";
import {treasuryDealAgentScenario} from "./treasury-deal-agent.js";
import {dealRewardPoolScenario} from "./deal-reward-pool.js";
import {revenueEvaluatorScenario} from "./revenue-evaluator.js";
import {permit2TreasuryFlowScenario} from "./permit2-treasury-flow.js";
import {oracleGovernanceScenario} from "./oracle-governance.js";
import {dealStrikeOutScenario} from "./deal-strike-out.js";
import {dacAgentDistributorScenario} from "./dac-agent-distributor.js";
import {dacBurnMainTokensScenario} from "./dac-burn-main-tokens.js";
import {existingTokenAccountingStressScenario} from "./existing-token-accounting-stress.js";
import {dealActiveStakingScenario} from "./deal-active-staking.js";
import {dealMultiDealNativeRewardsScenario} from "./deal-multi-deal-native-rewards.js";
import {dealMultiDealWrappedRewardsScenario} from "./deal-multi-deal-wrapped-rewards.js";

export const ALL_SCENARIOS: Scenario[] = [
  existingTokenDacScenario,
  dealSingleAgentScenario,
  dealEvalPartialRewardScenario,
  dealEvalFullRewardScenario,
  dealForceReturnScenario,
  dealEvalSlashScenario,
  dealEvalExtensionScenario,
  dealUnstakeAfterCloseScenario,
  dealMultiMilestoneScenario,
  dealVetoScenario,
  dealApproveExpiredScenario,
  dealRawModuleScenario,
  dacInvestmentScenario,
  treasuryDealAgentScenario,
  dealRewardPoolScenario,
  revenueEvaluatorScenario,
  permit2TreasuryFlowScenario,
  oracleGovernanceScenario,
  dealStrikeOutScenario,
  dacAgentDistributorScenario,
  dacBurnMainTokensScenario,
  existingTokenAccountingStressScenario,
  dealActiveStakingScenario,
  dealMultiDealNativeRewardsScenario,
  dealMultiDealWrappedRewardsScenario,
];

export {
  existingTokenDacScenario,
  dealSingleAgentScenario,
  dealEvalPartialRewardScenario,
  dealEvalFullRewardScenario,
  dealForceReturnScenario,
  dealEvalSlashScenario,
  dealEvalExtensionScenario,
  dealUnstakeAfterCloseScenario,
  dealMultiMilestoneScenario,
  dealVetoScenario,
  dealApproveExpiredScenario,
  dealRawModuleScenario,
  dacInvestmentScenario,
  treasuryDealAgentScenario,
  dealRewardPoolScenario,
  revenueEvaluatorScenario,
  permit2TreasuryFlowScenario,
  oracleGovernanceScenario,
  dealStrikeOutScenario,
  dacAgentDistributorScenario,
  dacBurnMainTokensScenario,
  existingTokenAccountingStressScenario,
  dealActiveStakingScenario,
  dealMultiDealNativeRewardsScenario,
  dealMultiDealWrappedRewardsScenario,
};
