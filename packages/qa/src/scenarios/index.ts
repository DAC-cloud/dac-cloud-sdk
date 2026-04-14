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
};
