import type {Scenario} from "../harness/types.js";
import {existingTokenDacScenario} from "./existing-token-dac.js";
import {dealSingleAgentScenario} from "./deal-single-agent.js";
import {dealEvalPartialRewardScenario} from "./deal-eval-partial-reward.js";
import {dealEvalFullRewardScenario} from "./deal-eval-full-reward.js";
import {dealForceReturnScenario} from "./deal-force-return.js";

export const ALL_SCENARIOS: Scenario[] = [
  existingTokenDacScenario,
  dealSingleAgentScenario,
  dealEvalPartialRewardScenario,
  dealEvalFullRewardScenario,
  dealForceReturnScenario,
];

export {
  existingTokenDacScenario,
  dealSingleAgentScenario,
  dealEvalPartialRewardScenario,
  dealEvalFullRewardScenario,
  dealForceReturnScenario,
};
