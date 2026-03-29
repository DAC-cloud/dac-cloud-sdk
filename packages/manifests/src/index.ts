import {readFile} from "node:fs/promises";
import {resolve} from "node:path";

export type ProtocolAddress = `0x${string}`;

export const PROTOCOL_MANIFEST_CORE_ADDRESS_KEYS = [
  "dacFactory",
  "coreModuleFactory",
  "permit2",
] as const;

export type ProtocolManifestCoreAddressKey = typeof PROTOCOL_MANIFEST_CORE_ADDRESS_KEYS[number];
export const PROTOCOL_MANIFEST_ADDRESS_KEYS = [
  "agentTokenFactory",
  "agentTokenImpl",
  "assetControllerFactory",
  "assetControllerImpl",
  "coreDealGovernanceFactory",
  "coreDealGovernanceImpl",
  "coreModuleFactory",
  "dacCellFactory",
  "dacCellImpl",
  "dacDealFactory",
  "dacDealImpl",
  "dacFactory",
  "dacGovernanceFactory",
  "dacGovernanceImpl",
  "dealCellFactory",
  "dealCellImpl",
  "dealManagerFactory",
  "dealManagerImpl",
  "existingAssetControllerFactory",
  "existingAssetControllerImpl",
  "governanceOracleFactory",
  "governanceOracleImpl",
  "governanceSchemaFactory",
  "governanceSchemaImpl",
  "hybridGovernanceSchemaFactory",
  "hybridGovernanceSchemaImpl",
  "hybridProposalFactory",
  "hybridProposalImpl",
  "mainTokenFactory",
  "mainTokenImpl",
  "milestoneEvaluatorFactory",
  "milestoneEvaluatorImpl",
  "moduleRegistryFactory",
  "moduleRegistryImpl",
  "permit2",
  "permit2TreasuryFactory",
  "revenueEvaluatorFactory",
  "revenueEvaluatorImpl",
  "stakedAgentFactory",
  "stakedAgentImpl",
  "treasuryDealFactory",
  "treasuryDealImpl",
  "wrappedMainTokenFactory",
  "wrappedMainTokenImpl",
] as const;

export type ProtocolManifestAddressKey = typeof PROTOCOL_MANIFEST_ADDRESS_KEYS[number];

export interface ProtocolManifest {
  chainId: number;
  blockNumber?: number;
  deployer?: ProtocolAddress;
  agentTokenFactory?: ProtocolAddress;
  agentTokenImpl?: ProtocolAddress;
  assetControllerFactory?: ProtocolAddress;
  assetControllerImpl?: ProtocolAddress;
  coreDealGovernanceFactory?: ProtocolAddress;
  coreDealGovernanceImpl?: ProtocolAddress;
  coreModuleFactory: ProtocolAddress;
  dacCellFactory?: ProtocolAddress;
  dacCellImpl?: ProtocolAddress;
  dacDealFactory?: ProtocolAddress;
  dacDealImpl?: ProtocolAddress;
  dacFactory: ProtocolAddress;
  dacGovernanceFactory?: ProtocolAddress;
  dacGovernanceImpl?: ProtocolAddress;
  dealCellFactory?: ProtocolAddress;
  dealCellImpl?: ProtocolAddress;
  dealManagerFactory?: ProtocolAddress;
  dealManagerImpl?: ProtocolAddress;
  existingAssetControllerFactory?: ProtocolAddress;
  existingAssetControllerImpl?: ProtocolAddress;
  governanceOracleFactory?: ProtocolAddress;
  governanceOracleImpl?: ProtocolAddress;
  governanceSchemaFactory?: ProtocolAddress;
  governanceSchemaImpl?: ProtocolAddress;
  hybridGovernanceSchemaFactory?: ProtocolAddress;
  hybridGovernanceSchemaImpl?: ProtocolAddress;
  hybridProposalFactory?: ProtocolAddress;
  hybridProposalImpl?: ProtocolAddress;
  mainTokenFactory?: ProtocolAddress;
  mainTokenImpl?: ProtocolAddress;
  milestoneEvaluatorFactory?: ProtocolAddress;
  milestoneEvaluatorImpl?: ProtocolAddress;
  moduleRegistryFactory?: ProtocolAddress;
  moduleRegistryImpl?: ProtocolAddress;
  permit2: ProtocolAddress;
  permit2TreasuryFactory?: ProtocolAddress;
  revenueEvaluatorFactory?: ProtocolAddress;
  revenueEvaluatorImpl?: ProtocolAddress;
  stakedAgentFactory?: ProtocolAddress;
  stakedAgentImpl?: ProtocolAddress;
  treasuryDealFactory?: ProtocolAddress;
  treasuryDealImpl?: ProtocolAddress;
  wrappedMainTokenFactory?: ProtocolAddress;
  wrappedMainTokenImpl?: ProtocolAddress;
  [key: string]: unknown;
}

export interface ManifestLocatorOptions {
  contractsRoot?: string;
  deploymentsDir?: string;
}

export function resolveDeploymentsDir(options: ManifestLocatorOptions = {}): string {
  if (options.deploymentsDir) {
    return options.deploymentsDir;
  }

  if (options.contractsRoot) {
    return resolve(options.contractsRoot, "deployments");
  }

  const fromEnv = process.env.DAC_CONTRACTS_ROOT;
  if (fromEnv) {
    return resolve(fromEnv, "deployments");
  }

  return resolve(process.cwd(), "../dac-cloud-contracts/deployments");
}

export async function loadJsonManifest<T>(path: string): Promise<T> {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as T;
}

export function resolveProtocolManifestPath(
  chainId: number,
  options: ManifestLocatorOptions = {},
): string {
  const deploymentsDir = resolveDeploymentsDir(options);
  return resolve(deploymentsDir, String(chainId), "protocol.json");
}

export function isProtocolAddress(value: unknown): value is ProtocolAddress {
  return typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value);
}

function assertProtocolManifest(manifest: ProtocolManifest): void {
  if (!Number.isInteger(manifest.chainId)) {
    throw new Error("Invalid protocol manifest: missing integer chainId");
  }

  for (const key of PROTOCOL_MANIFEST_CORE_ADDRESS_KEYS) {
    if (!isProtocolAddress(manifest[key])) {
      throw new Error(`Invalid protocol manifest: missing address '${key}'`);
    }
  }
}

export async function loadProtocolManifest(
  chainId: number,
  options: ManifestLocatorOptions = {},
): Promise<ProtocolManifest> {
  const protocolPath = resolveProtocolManifestPath(chainId, options);
  const manifest = await loadJsonManifest<ProtocolManifest>(protocolPath);
  assertProtocolManifest(manifest);
  return manifest;
}

export function requireProtocolAddress<TKey extends ProtocolManifestAddressKey>(
  manifest: ProtocolManifest,
  key: TKey,
): Extract<ProtocolManifest[TKey], ProtocolAddress> {
  const value = manifest[key];
  if (!isProtocolAddress(value)) {
    throw new Error(`Protocol manifest is missing required address '${String(key)}'`);
  }
  return value as Extract<ProtocolManifest[TKey], ProtocolAddress>;
}
