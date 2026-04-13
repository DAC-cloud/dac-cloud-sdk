import type {Scenario} from "../harness/types.js";
import {existingTokenDacScenario} from "./existing-token-dac.js";
import {dealSingleAgentScenario} from "./deal-single-agent.js";

export const ALL_SCENARIOS: Scenario[] = [
  existingTokenDacScenario,
  dealSingleAgentScenario,
];

export {existingTokenDacScenario, dealSingleAgentScenario};
