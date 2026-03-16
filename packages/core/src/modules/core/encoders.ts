import {encodeAbiParameters, type Hex} from "viem";
import type {MilestoneEvaluatorConfig, RevenueEvaluatorConfig} from "./types";

export function buildMilestoneEvaluatorConfig(config: MilestoneEvaluatorConfig): Hex {
  return encodeAbiParameters(
    [
      {
        type: "tuple",
        components: [
          {name: "rewardShare", type: "uint256"},
          {
            name: "milestones",
            type: "tuple[]",
            components: [
              {name: "milestoneType", type: "uint8"},
              {name: "token", type: "address"},
              {name: "oracle", type: "address"},
              {name: "valuationMode", type: "uint8"},
              {name: "fundingToken", type: "address"},
              {name: "expectedReturn", type: "uint256"},
              {name: "timestamp", type: "uint256"},
              {name: "rewardPercentage", type: "uint256"},
              {name: "rewardCurve", type: "int256[]"},
              {name: "penaltyCurve", type: "int256[]"},
              {name: "minPercentGrace", type: "uint256"},
              {name: "extension", type: "uint256"},
            ],
          },
        ],
      },
    ],
    [config],
  );
}

export function buildRevenueEvaluatorConfig(config: RevenueEvaluatorConfig): Hex {
  return encodeAbiParameters(
    [
      {
        type: "tuple",
        components: [
          {name: "rewardShare", type: "uint256"},
          {
            name: "schedule",
            type: "tuple",
            components: [
              {name: "token", type: "address"},
              {name: "duration", type: "uint256"},
              {name: "revenueProjectionMode", type: "uint8"},
              {name: "revenueProjection", type: "uint256"},
              {name: "curveCoeffs", type: "int256[]"},
              {name: "requirementCurveCoeffs", type: "int256[]"},
              {name: "maxCycleUnlockPercent", type: "uint256"},
              {name: "minCycleRevenuePercent", type: "uint256"},
              {name: "graceCycles", type: "uint256"},
              {name: "penaltyPerMiss", type: "uint256"},
              {name: "evaluationStart", type: "uint256"},
              {name: "autoClose", type: "bool"},
            ],
          },
        ],
      },
    ],
    [config],
  );
}
