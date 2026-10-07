import type {DealParams} from "@dac-cloud/core";
import type {ProtocolManifest} from "@dac-cloud/manifests";
import {z} from "zod";
import {resolveDealKindSpec, resolveEvaluatorKindSpec} from "../modules/registry";
import type {DealKindSpec, EvaluatorKindSpec} from "../modules/types";
import {asAddress} from "./shared";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const bigintish = z.union([z.string(), z.number(), z.bigint()]);

const dealFileSchema = z.object({
  dealKind: z.string(),
  name: z.string(),
  description: z.string(),
  linkHash: z.string(),
  moduleFactory: z.string().optional(),
  governanceFactory: z.string().optional(),
  dealTarget: z.string().optional(),
  proposer: z.string().optional(),
  vetoEnabled: z.boolean().optional(),
  fundingToken: z.string(),
  fundingAmount: bigintish,
  rewardsLimit: bigintish.optional(),
  dealRewardPoolPercent: bigintish.optional(),
  approveDeadline: bigintish.optional(),
  evaluationDeadline: bigintish.optional(),
  dealDeadline: bigintish.optional(),
  dealConfig: z.unknown(),
  evaluatorSelector: z.string(),
  evaluatorConfig: z.unknown(),
  evaluatorModuleFactory: z.string().optional(),
  agentsLimit: bigintish.optional(),
  minimalStake: bigintish.optional(),
});

function parseBigNumberish(value: unknown, label: string): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`${label} must be a finite number`);
    }
    return BigInt(Math.trunc(value));
  }
  if (typeof value === "string") {
    return BigInt(value);
  }
  throw new Error(`${label} must be bigint-compatible`);
}

export interface ParsedDealFile {
  dealKind: DealKindSpec;
  evaluator: EvaluatorKindSpec;
  /** Explicit `governanceFactory` from the deal JSON, if any. */
  explicitGovernanceFactory?: string;
  /** Explicit `moduleFactory` from the deal JSON, if any. */
  explicitModuleFactory?: string;
  build(protocol: ProtocolManifest, proposerAddress: string, defaults?: {governanceFactory?: string}): DealParams;
}

/**
 * Parse a deal JSON (the `dac deal create` file format) into a DealParams builder.
 * Shared by `deal create` and the AgentDeal `host-create-deal` proposal.
 */
export function parseDealFile(content: unknown): ParsedDealFile {
  const parsed = dealFileSchema.parse(content);
  const now = BigInt(Math.floor(Date.now() / 1000));

  const dealKind = resolveDealKindSpec(parsed.dealKind);
  const evaluator = resolveEvaluatorKindSpec(parsed.evaluatorSelector);
  const dealConfig = dealKind.encodeConfig(parsed.dealConfig);
  const evaluatorConfig = evaluator.encodeConfig(parsed.evaluatorConfig);

  if (evaluator.moduleId === "custom" && !parsed.evaluatorModuleFactory) {
    throw new Error("'evaluatorModuleFactory' is required in deal JSON for custom evaluator kinds.");
  }

  function build(protocol: ProtocolManifest, proposerAddress: string, defaults?: {governanceFactory?: string}): DealParams {
    const moduleFactory = parsed.moduleFactory ?? dealKind.defaultModuleFactory?.(protocol);
    if (!moduleFactory) {
      throw new Error("'moduleFactory' is required in deal JSON for custom deal kinds.");
    }
    const governanceFactory = parsed.governanceFactory
      ?? defaults?.governanceFactory
      ?? dealKind.defaultGovernanceFactory?.(protocol);
    if (!governanceFactory) {
      throw new Error("'governanceFactory' is required in deal JSON for custom deal kinds. Provide 'governanceFactory' in deal JSON.");
    }
    const resolvedDealDeadline = parsed.dealDeadline ? parseBigNumberish(parsed.dealDeadline, "dealDeadline") : now + 30n * 24n * 60n * 60n;
    const resolvedEvaluationDeadline = parsed.evaluationDeadline ? parseBigNumberish(parsed.evaluationDeadline, "evaluationDeadline") : resolvedDealDeadline;
    return {
      dealKind: dealKind.selector, name: parsed.name, description: parsed.description, linkHash: parsed.linkHash,
      moduleFactory: asAddress(moduleFactory, "moduleFactory"), governanceFactory: asAddress(governanceFactory, "governanceFactory"),
      dealTarget: asAddress(parsed.dealTarget ?? ZERO_ADDRESS, "dealTarget"),
      proposer: asAddress(parsed.proposer ?? proposerAddress, "proposer"),
      vetoEnabled: parsed.vetoEnabled ?? false, fundingToken: asAddress(parsed.fundingToken, "fundingToken"),
      fundingAmount: parseBigNumberish(parsed.fundingAmount, "fundingAmount"),
      rewardsLimit: parsed.rewardsLimit ? parseBigNumberish(parsed.rewardsLimit, "rewardsLimit") : 500_000_000n,
      dealRewardPoolPercent: parsed.dealRewardPoolPercent ? parseBigNumberish(parsed.dealRewardPoolPercent, "dealRewardPoolPercent") : 0n,
      approveDeadline: parsed.approveDeadline ? parseBigNumberish(parsed.approveDeadline, "approveDeadline") : now + 7n * 24n * 60n * 60n,
      evaluationDeadline: resolvedEvaluationDeadline, dealDeadline: resolvedDealDeadline,
      dealConfig, evaluatorSelector: evaluator.selector, evaluatorConfig,
      evaluatorModuleFactory: asAddress(parsed.evaluatorModuleFactory ?? ZERO_ADDRESS, "evaluatorModuleFactory"),
      agentsLimit: parsed.agentsLimit ? parseBigNumberish(parsed.agentsLimit, "agentsLimit") : 0n,
      minimalStake: parsed.minimalStake ? parseBigNumberish(parsed.minimalStake, "minimalStake") : 0n,
    };
  }

  return {
    dealKind,
    evaluator,
    explicitGovernanceFactory: parsed.governanceFactory,
    explicitModuleFactory: parsed.moduleFactory,
    build,
  };
}
