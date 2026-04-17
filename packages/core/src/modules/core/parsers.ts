/**
 * JSON config parsers for core module deal and evaluator configs.
 *
 * These accept raw `unknown` input (e.g. from JSON files, MCP tool calls, or frontend forms),
 * validate with zod, and return typed objects ready for the wire encoders.
 *
 * Each parser also accepts pre-encoded hex strings (0x...) as passthrough.
 */

import {encodeAbiParameters, type Address, type Hex} from "viem";
import {z} from "zod";
import {buildMilestoneEvaluatorConfig, buildRevenueEvaluatorConfig} from "./encoders";
import type {DACDealConfig, MilestoneEvaluatorConfig, RevenueEvaluatorConfig} from "./types";

function asAddress(value: string, label: string): Address {
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(`Invalid address for ${label}: ${value}`);
  }
  return value as Address;
}

function parseBigNumberish(value: unknown, label: string): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`${label} must be a finite number`);
    return BigInt(Math.trunc(value));
  }
  if (typeof value === "string") return BigInt(value);
  throw new Error(`${label} must be bigint-compatible`);
}

function parseBigintArray(value: unknown, label: string): bigint[] {
  const list = z.array(z.union([z.string(), z.number(), z.bigint()])).parse(value);
  return list.map((entry, index) => parseBigNumberish(entry, `${label}[${index}]`));
}

const bigintish = z.union([z.string(), z.number(), z.bigint()]);

// ---- DAC Deal Config ----

const dacDealConfigSchema = z.object({
  managedEquity: bigintish,
  config: z.string().regex(/^0x[0-9a-fA-F]*$/).optional(),
});

export function parseDacDealConfig(input: unknown): DACDealConfig {
  const parsed = dacDealConfigSchema.parse(input);
  return {
    managedEquity: parseBigNumberish(parsed.managedEquity, "managedEquity"),
    config: (parsed.config ?? "0x") as Hex,
  };
}

// ---- Milestone Evaluator Config ----

const milestoneSchema = z.object({
  milestoneType: z.number().int(),
  token: z.string(),
  oracle: z.string(),
  valuationMode: z.number().int(),
  fundingToken: z.string(),
  expectedReturn: bigintish,
  timestamp: bigintish,
  rewardPercentage: bigintish,
  rewardCurve: z.array(bigintish),
  penaltyCurve: z.array(bigintish),
  minPercentGrace: bigintish,
  extension: bigintish,
});

const milestoneEvaluatorConfigSchema = z.object({
  rewardShare: bigintish,
  milestones: z.array(milestoneSchema),
});

export function parseMilestoneEvaluatorConfig(input: unknown): MilestoneEvaluatorConfig {
  const parsed = milestoneEvaluatorConfigSchema.parse(input);
  return {
    rewardShare: parseBigNumberish(parsed.rewardShare, "rewardShare"),
    milestones: parsed.milestones.map((item) => ({
      milestoneType: item.milestoneType,
      token: asAddress(item.token, "milestone token"),
      oracle: asAddress(item.oracle, "milestone oracle"),
      valuationMode: item.valuationMode,
      fundingToken: asAddress(item.fundingToken, "milestone fundingToken"),
      expectedReturn: parseBigNumberish(item.expectedReturn, "expectedReturn"),
      timestamp: parseBigNumberish(item.timestamp, "timestamp"),
      rewardPercentage: parseBigNumberish(item.rewardPercentage, "rewardPercentage"),
      rewardCurve: parseBigintArray(item.rewardCurve, "rewardCurve"),
      penaltyCurve: parseBigintArray(item.penaltyCurve, "penaltyCurve"),
      minPercentGrace: parseBigNumberish(item.minPercentGrace, "minPercentGrace"),
      extension: parseBigNumberish(item.extension, "extension"),
    })),
  };
}

/**
 * Parse and ABI-encode milestone evaluator config from raw JSON input.
 * Accepts either a JSON object or a pre-encoded hex string.
 */
export function encodeMilestoneEvaluatorConfigFromJson(input: unknown): Hex {
  if (typeof input === "string" && input.startsWith("0x")) return input as Hex;
  return buildMilestoneEvaluatorConfig(parseMilestoneEvaluatorConfig(input));
}

// ---- Revenue Evaluator Config ----

const revenueScheduleSchema = z.object({
  token: z.string(),
  duration: bigintish,
  revenueProjectionMode: z.number().int(),
  revenueProjection: bigintish,
  curveCoeffs: z.array(bigintish),
  requirementCurveCoeffs: z.array(bigintish),
  maxCycleUnlockPercent: bigintish,
  minCycleRevenuePercent: bigintish,
  graceCycles: bigintish,
  penaltyPerMiss: bigintish,
  evaluationStart: bigintish,
  autoClose: z.boolean(),
});

const revenueEvaluatorConfigSchema = z.object({
  rewardShare: bigintish,
  schedule: revenueScheduleSchema,
});

export function parseRevenueEvaluatorConfig(input: unknown): RevenueEvaluatorConfig {
  const parsed = revenueEvaluatorConfigSchema.parse(input);
  return {
    rewardShare: parseBigNumberish(parsed.rewardShare, "rewardShare"),
    schedule: {
      token: asAddress(parsed.schedule.token, "schedule token"),
      duration: parseBigNumberish(parsed.schedule.duration, "duration"),
      revenueProjectionMode: parsed.schedule.revenueProjectionMode,
      revenueProjection: parseBigNumberish(parsed.schedule.revenueProjection, "revenueProjection"),
      curveCoeffs: parseBigintArray(parsed.schedule.curveCoeffs, "curveCoeffs"),
      requirementCurveCoeffs: parseBigintArray(parsed.schedule.requirementCurveCoeffs, "requirementCurveCoeffs"),
      maxCycleUnlockPercent: parseBigNumberish(parsed.schedule.maxCycleUnlockPercent, "maxCycleUnlockPercent"),
      minCycleRevenuePercent: parseBigNumberish(parsed.schedule.minCycleRevenuePercent, "minCycleRevenuePercent"),
      graceCycles: parseBigNumberish(parsed.schedule.graceCycles, "graceCycles"),
      penaltyPerMiss: parseBigNumberish(parsed.schedule.penaltyPerMiss, "penaltyPerMiss"),
      evaluationStart: parseBigNumberish(parsed.schedule.evaluationStart, "evaluationStart"),
      autoClose: parsed.schedule.autoClose,
    },
  };
}

/**
 * Parse and ABI-encode revenue evaluator config from raw JSON input.
 * Accepts either a JSON object or a pre-encoded hex string.
 */
export function encodeRevenueEvaluatorConfigFromJson(input: unknown): Hex {
  if (typeof input === "string" && input.startsWith("0x")) return input as Hex;
  return buildRevenueEvaluatorConfig(parseRevenueEvaluatorConfig(input));
}

// ---- Permit2 Treasury Deal Config ----

export function encodePermit2TreasuryDealConfigFromJson(input: unknown): Hex {
  if (typeof input === "string" && input.startsWith("0x")) return input as Hex;
  const parsed = z.object({label: z.string().optional(), value: z.string().optional()}).catch({}).parse(input);
  const value = parsed.value ?? parsed.label ?? "dac-cli treasury config";
  return encodeAbiParameters([{name: "value", type: "string"}], [value]);
}

// ---- DAC Deal Config (JSON → encoded) ----

export function encodeDacDealConfigFromJson(input: unknown): Hex {
  if (typeof input === "string" && input.startsWith("0x")) return input as Hex;
  const config = parseDacDealConfig(input);
  return encodeAbiParameters(
    [{
      name: "value",
      type: "tuple",
      components: [
        {name: "managedEquity", type: "uint256"},
        {name: "config", type: "bytes"},
      ],
    }],
    [config],
  );
}
