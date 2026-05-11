import type {Address, Hex} from "viem";
import {keccak256, toBytes} from "viem";

export interface DACDealConfig {
  managedEquity: bigint;
  config: `0x${string}`;
}

// keccak256("snapshot-v1") — discriminator for snapshot.org single-choice Vote payloads,
// matches DACDeal.VENUE_SNAPSHOT_V1 in dac-cloud-contracts.
export const VENUE_SNAPSHOT_V1: Hex = keccak256(toBytes("snapshot-v1"));

// snapshot.org single-choice Vote payload (snapshot.js Vote type 1). Fields mirror
// the contract's SnapshotV1Payload struct verbatim. `from` is a string (lowercased
// hex of the signing contract / Deal address) to match snapshot.js convention.
export interface SnapshotV1Payload {
  version: string;
  from: string;
  space: string;
  timestamp: bigint;
  proposal: string;
  choice: number;
  reason: string;
  app: string;
  metadata: string;
  expiry: bigint;
}

// viem-ready EIP-712 typed-data shape for off-chain Snapshot signing parity. Fill
// `domain.version` from the payload before signing; the snapshot domain has no
// chainId and no verifyingContract.
export const SNAPSHOT_VOTE_EIP712 = {
  primaryType: "Vote" as const,
  types: {
    Vote: [
      {name: "from", type: "string"},
      {name: "space", type: "string"},
      {name: "timestamp", type: "uint64"},
      {name: "proposal", type: "string"},
      {name: "choice", type: "uint32"},
      {name: "reason", type: "string"},
      {name: "app", type: "string"},
      {name: "metadata", type: "string"},
    ],
  },
} as const;

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
