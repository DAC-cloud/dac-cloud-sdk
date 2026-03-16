import type {Address} from "viem";

export interface DACDealConfig {
  managedEquity: bigint;
  capitalCallId: bigint;
  config: `0x${string}`;
}

export interface TreasurySpendAllowance {
  totalAmount: bigint;
  singleTxAmount: bigint;
  clockLimit: bigint;
  duration: bigint;
}

export interface Milestone {
  milestoneType: number;
  token: Address;
  oracle: Address;
  valuationMode: number;
  fundingToken: Address;
  expectedReturn: bigint;
  timestamp: bigint;
  rewardPercentage: bigint;
  rewardCurve: bigint[];
  penaltyCurve: bigint[];
  minPercentGrace: bigint;
  extension: bigint;
}

export interface RevenueSchedule {
  token: Address;
  duration: bigint;
  revenueProjectionMode: number;
  revenueProjection: bigint;
  curveCoeffs: bigint[];
  requirementCurveCoeffs: bigint[];
  maxCycleUnlockPercent: bigint;
  minCycleRevenuePercent: bigint;
  graceCycles: bigint;
  penaltyPerMiss: bigint;
  evaluationStart: bigint;
  autoClose: boolean;
}

export interface MilestoneEvaluatorConfig {
  rewardShare: bigint;
  milestones: Milestone[];
}

export interface RevenueEvaluatorConfig {
  rewardShare: bigint;
  schedule: RevenueSchedule;
}
