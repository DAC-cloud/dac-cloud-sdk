import type {DacCoreClient, ProposalParams} from "@dac-cloud/core";
import type {IndexerClient} from "@dac-cloud/indexer";
import type {ProtocolManifest} from "@dac-cloud/manifests";
import type {Address, Hex} from "viem";
import type {ResolvedDealRecord} from "../actions/shared";
import type {OptionResolver} from "../runtime/config";

export interface DealKindSpec {
  moduleId: string;
  key: string;
  selector: Hex;
  aliases: string[];
  encodeConfig(config: unknown): Hex;
  defaultModuleFactory?(protocol: ProtocolManifest): Address | undefined;
  defaultGovernanceFactory?(protocol: ProtocolManifest): Address | undefined;
}

export interface EvaluatorKindSpec {
  moduleId: string;
  key: string;
  selector: Hex;
  aliases: string[];
  encodeConfig(config: unknown): Hex;
}

export interface ModuleDealProposalBuildContext {
  args: string[];
  input?: Record<string, unknown>;
  resolver: OptionResolver;
  core: DacCoreClient;
  indexer: IndexerClient;
  resolvedDeal: ResolvedDealRecord;
}

export interface ModuleDealProposalSpec {
  moduleId: string;
  key: string;
  aliases: string[];
  build(context: ModuleDealProposalBuildContext): ProposalParams | Promise<ProposalParams>;
}

export interface KernelDealProposalHookSpec {
  moduleId: string;
  key: string;
  dealKindSelectors: Hex[];
  build(context: ModuleDealProposalBuildContext): ProposalParams | undefined | Promise<ProposalParams | undefined>;
}

export interface CliModuleSpec {
  moduleId: string;
  dealKinds: DealKindSpec[];
  evaluatorKinds: EvaluatorKindSpec[];
  dealProposalTypes: ModuleDealProposalSpec[];
  kernelDealProposalHooks?: KernelDealProposalHookSpec[];
}

export interface ResolvedDealProposalType {
  raw: string;
  canonicalType: string;
  moduleIdHint?: string;
  spec?: ModuleDealProposalSpec;
}
