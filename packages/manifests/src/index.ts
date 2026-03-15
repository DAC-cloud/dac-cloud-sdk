import {readFile} from "node:fs/promises";
import {resolve} from "node:path";

export interface ProtocolManifest {
  chainId: number;
  dacFactory: `0x${string}`;
  coreModuleFactory: `0x${string}`;
  permit2: `0x${string}`;
  [key: string]: unknown;
}

export interface DeploymentManifest {
  chainId: number;
  blockNumber?: number;
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

export async function loadProtocolManifest(
  chainId: number,
  options: ManifestLocatorOptions = {},
): Promise<ProtocolManifest> {
  const deploymentsDir = resolveDeploymentsDir(options);
  const protocolPath = resolve(deploymentsDir, String(chainId), "protocol.json");
  return loadJsonManifest<ProtocolManifest>(protocolPath);
}

export async function loadNamedDeploymentManifest(
  chainId: number,
  fileName: string,
  options: ManifestLocatorOptions = {},
): Promise<DeploymentManifest> {
  const deploymentsDir = resolveDeploymentsDir(options);
  const fullPath = resolve(deploymentsDir, String(chainId), fileName);
  return loadJsonManifest<DeploymentManifest>(fullPath);
}

export async function tryLoadBasicDacSeed(
  chainId: number,
  label = "seed",
  options: ManifestLocatorOptions = {},
): Promise<DeploymentManifest | null> {
  const fileName = `basic-dac-${label}.json`;
  try {
    return await loadNamedDeploymentManifest(chainId, fileName, options);
  } catch {
    return null;
  }
}
