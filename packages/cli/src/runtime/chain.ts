import {resolve} from "node:path";
import {
  accountFromPrivateKey,
  createDacCoreClient,
  createDacTransactionBuilder,
  type DacCoreClient,
  type DacTransactionBuilder,
} from "@dac-cloud/core";
import {createIndexerClient} from "@dac-cloud/indexer";
import {loadProtocolManifest, type ProtocolManifest} from "@dac-cloud/manifests";
import {defineChain, type Address, type Hex, type PrivateKeyAccount} from "viem";
import type {OptionResolver} from "./config";

export const DEFAULT_ANVIL_PK_0 =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as Hex;

export interface CoreContext {
  chainId: number;
  rpcUrl: string;
  contractsRoot: string;
  account: PrivateKeyAccount;
  protocol: ProtocolManifest;
  core: DacCoreClient;
}

export async function makeCoreContext(resolver: OptionResolver): Promise<CoreContext> {
  const chainId = resolver.resolveNumber("chain-id", 31337) ?? 31337;
  const rpcUrl = resolver.resolveString("rpc-url", "http://127.0.0.1:8545") ?? "http://127.0.0.1:8545";
  const contractsRoot = resolve(
    resolver.resolveString("contracts-root", process.env.DAC_CONTRACTS_ROOT ?? "../dac-cloud-contracts")
      ?? "../dac-cloud-contracts",
  );

  const privateKey = (resolver.resolveString("private-key", DEFAULT_ANVIL_PK_0) ?? DEFAULT_ANVIL_PK_0) as Hex;
  const account = accountFromPrivateKey(privateKey);

  const chain = defineChain({
    id: chainId,
    name: `dac-${chainId}`,
    nativeCurrency: {name: "ETH", symbol: "ETH", decimals: 18},
    rpcUrls: {
      default: {http: [rpcUrl]},
      public: {http: [rpcUrl]},
    },
  });

  const protocol = await loadProtocolManifest(chainId, {contractsRoot});
  const core = createDacCoreClient({chain, rpcUrl, account, protocol});

  return {
    chainId,
    rpcUrl,
    contractsRoot,
    account,
    protocol,
    core,
  };
}

export interface DryRunContext {
  chainId: number;
  contractsRoot: string;
  fromAddress: Address;
  protocol: ProtocolManifest;
  txBuilder: DacTransactionBuilder;
}

export async function makeDryRunContext(resolver: OptionResolver): Promise<DryRunContext> {
  const chainId = resolver.resolveNumber("chain-id", 31337) ?? 31337;
  const contractsRoot = resolve(
    resolver.resolveString("contracts-root", process.env.DAC_CONTRACTS_ROOT ?? "../dac-cloud-contracts")
      ?? "../dac-cloud-contracts",
  );

  const fromRaw = resolver.resolveString("from");
  const privateKeyRaw = resolver.resolveString("private-key");

  let fromAddress: Address;
  if (fromRaw) {
    fromAddress = fromRaw as Address;
  } else if (privateKeyRaw) {
    fromAddress = accountFromPrivateKey(privateKeyRaw as Hex).address;
  } else {
    throw new Error("--dry-run requires --from <address> or --private-key to derive sender address");
  }

  const protocol = await loadProtocolManifest(chainId, {contractsRoot});
  const txBuilder = createDacTransactionBuilder({chainId, fromAddress, protocol});

  return {chainId, contractsRoot, fromAddress, protocol, txBuilder};
}

export function makeIndexer(resolver: OptionResolver) {
  const indexerUrl = resolver.resolveString("indexer-url", "http://127.0.0.1:8080/v1/graphql")
    ?? "http://127.0.0.1:8080/v1/graphql";
  return createIndexerClient({url: indexerUrl});
}

async function rpcCall<T>(rpcUrl: string, method: string, params: unknown[]): Promise<T> {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });

  const payload = await response.json() as {result?: T; error?: {message?: string}};
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message ?? `RPC call failed: ${method}`);
  }

  return payload.result as T;
}

export async function advanceTime(rpcUrl: string, seconds: number): Promise<void> {
  if (seconds <= 0) {
    return;
  }

  await rpcCall<string>(rpcUrl, "evm_increaseTime", [seconds]);
  await rpcCall<string>(rpcUrl, "evm_mine", []);
}

export function listQueryPage(resolver: OptionResolver): {limit?: number; offset?: number} {
  const limit = resolver.resolveNumber(["query-limit", "limit"]);
  const offset = resolver.resolveNumber(["query-offset", "offset"]);
  return {
    limit: Number.isFinite(limit) ? limit : undefined,
    offset: Number.isFinite(offset) ? offset : undefined,
  };
}
