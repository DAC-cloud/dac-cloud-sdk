import {
  accountFromPrivateKey,
  createDacCoreClient,
  createDacTransactionBuilder,
  type DacCoreClient,
  type DacTransactionBuilder,
} from "@dac-cloud/core";
import {createIndexerClient} from "@dac-cloud/indexer";
import {fetchManifest, type ProtocolManifest} from "@dac-cloud/manifests";
import {defineChain, type Address, type Hex, type PrivateKeyAccount} from "viem";
import {resolveAuthToken} from "../auth/flows.js";
import type {OptionResolver} from "./config";

export const DEFAULT_ANVIL_PK_0 =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as Hex;

const DEFAULT_API_URL = "https://api.dac.cloud";

export interface CoreContext {
  chainId: number;
  apiUrl: string;
  account: PrivateKeyAccount;
  protocol: ProtocolManifest;
  core: DacCoreClient;
}

export function resolveApiUrl(resolver: OptionResolver): string {
  return resolver.resolveString("api-url", DEFAULT_API_URL) ?? DEFAULT_API_URL;
}

export function deriveRpcUrl(apiUrl: string, chainId: number): string {
  return `${apiUrl.replace(/\/+$/, "")}/rpc/${chainId}`;
}

export function deriveGraphqlUrl(apiUrl: string): string {
  return `${apiUrl.replace(/\/+$/, "")}/graphql`;
}

/**
 * Collect DAC addresses from command options for auth scoping.
 */
function collectDacsFromResolver(resolver: OptionResolver): string[] {
  const dacs: string[] = [];
  for (const key of ["dac-address", "dac", "cell-address"]) {
    const val = resolver.resolveString(key);
    if (val && !dacs.includes(val)) dacs.push(val);
  }
  return dacs;
}

function authHeaders(token: string): Record<string, string> {
  return {authorization: `Bearer ${token}`};
}

export async function makeCoreContext(resolver: OptionResolver): Promise<CoreContext> {
  const chainId = resolver.resolveNumber("chain-id") ?? 31337;
  const apiUrl = resolveApiUrl(resolver);
  const rpcUrl = deriveRpcUrl(apiUrl, chainId);

  const privateKey = (resolver.resolveString("private-key", DEFAULT_ANVIL_PK_0) ?? DEFAULT_ANVIL_PK_0) as Hex;
  const account = accountFromPrivateKey(privateKey);

  const authToken = await resolveAuthToken({
    configToken: resolver.resolveString("auth-token"),
    configTokenExpires: resolver.resolveString("auth-expires"),
    chainId,
    account,
    apiUrl,
    dacs: collectDacsFromResolver(resolver),
  });

  const chain = defineChain({
    id: chainId,
    name: `dac-${chainId}`,
    nativeCurrency: {name: "ETH", symbol: "ETH", decimals: 18},
    rpcUrls: {
      default: {http: [rpcUrl]},
      public: {http: [rpcUrl]},
    },
  });

  const protocol = await fetchManifest(chainId, apiUrl);
  const core = createDacCoreClient({
    chain,
    rpcUrl,
    account,
    protocol,
    fetchOptions: {headers: authHeaders(authToken)},
  });

  return {
    chainId,
    apiUrl,
    account,
    protocol,
    core,
  };
}

export interface DryRunContext {
  chainId: number;
  apiUrl: string;
  fromAddress: Address;
  protocol: ProtocolManifest;
  txBuilder: DacTransactionBuilder;
}

export async function makeDryRunContext(resolver: OptionResolver): Promise<DryRunContext> {
  const chainId = resolver.resolveNumber("chain-id") ?? 31337;
  const apiUrl = resolveApiUrl(resolver);

  const fromRaw = resolver.resolveString("from");
  const privateKeyRaw = resolver.resolveString("private-key");

  let fromAddress: Address;
  let account: PrivateKeyAccount | undefined;
  if (fromRaw) {
    fromAddress = fromRaw as Address;
    if (privateKeyRaw) {
      account = accountFromPrivateKey(privateKeyRaw as Hex);
    }
  } else if (privateKeyRaw) {
    account = accountFromPrivateKey(privateKeyRaw as Hex);
    fromAddress = account.address;
  } else {
    throw new Error("--dry-run requires --from <address> or --private-key to derive sender address");
  }

  // Dry-run requires a valid token but can work without a private key
  await resolveAuthToken({
    configToken: resolver.resolveString("auth-token"),
    configTokenExpires: resolver.resolveString("auth-expires"),
    chainId,
    account,
    apiUrl,
    dacs: collectDacsFromResolver(resolver),
  });

  const protocol = await fetchManifest(chainId, apiUrl);
  const txBuilder = createDacTransactionBuilder({chainId, fromAddress, protocol});

  return {chainId, apiUrl, fromAddress, protocol, txBuilder};
}

export async function makeIndexer(resolver: OptionResolver) {
  const apiUrl = resolveApiUrl(resolver);
  const chainId = resolver.resolveNumber("chain-id") ?? 31337;
  const indexerUrl = deriveGraphqlUrl(apiUrl);

  const privateKeyRaw = resolver.resolveString("private-key");
  const account = privateKeyRaw ? accountFromPrivateKey(privateKeyRaw as Hex) : undefined;

  const authToken = await resolveAuthToken({
    configToken: resolver.resolveString("auth-token"),
    configTokenExpires: resolver.resolveString("auth-expires"),
    chainId,
    account,
    apiUrl,
    dacs: collectDacsFromResolver(resolver),
  });

  return createIndexerClient({
    url: indexerUrl,
    headers: authHeaders(authToken),
  });
}

export function listQueryPage(resolver: OptionResolver): {limit?: number; offset?: number} {
  const limit = resolver.resolveNumber(["query-limit", "limit"]);
  const offset = resolver.resolveNumber(["query-offset", "offset"]);
  return {
    limit: Number.isFinite(limit) ? limit : undefined,
    offset: Number.isFinite(offset) ? offset : undefined,
  };
}
