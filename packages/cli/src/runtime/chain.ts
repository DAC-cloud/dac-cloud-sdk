import {
  accountFromPrivateKey,
  createDacCoreClient,
  createDacTransactionBuilder,
  type DacCoreClient,
  type DacTransactionBuilder,
  type TxExecutor,
} from "@dac-cloud/core";
import {createIndexerClient} from "@dac-cloud/indexer";
import {fetchManifest, type ProtocolManifest} from "@dac-cloud/manifests";
import {defineChain, type Address, type Hex, type PrivateKeyAccount} from "viem";
import {resolveAuthToken} from "../auth/flows.js";
import {resolveConfigPath, type OptionResolver} from "./config";
import {assertTbaControl, executorFromSpec, resolveTbaSpec, tbaAuthOptions, type TbaSpec} from "./tba";

const DEFAULT_API_URL = "https://api.dac.cloud";
const DEFAULT_CHAIN_ID = 84532;

export interface CoreContext {
  chainId: number;
  apiUrl: string;
  /** The signer. With a token-bound account this is the NFT owner. */
  account: PrivateKeyAccount;
  /** The protocol-level actor: the ERC-6551 account when one is configured, else the signer. */
  actor: Address;
  executor: TxExecutor;
  tba?: TbaSpec;
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

/**
 * Options for `resolveAuthToken` derived from the command's config: stored token,
 * DAC scope, token-bound session, and the config file to persist a session to.
 * A `--private-key` passed on the command line is a wallet override whose session
 * must stay out of the config file (cache only), so no path is given then.
 */
export function authOptionsFromResolver(
  resolver: OptionResolver,
  args: {chainId: number; account?: PrivateKeyAccount; dacs?: string[]; tba?: TbaSpec},
): Parameters<typeof resolveAuthToken>[0] {
  const {chainId, account} = args;
  const tba = args.tba ?? resolveTbaSpec(resolver, chainId);
  return {
    configToken: resolver.resolveString("auth-token"),
    configTokenExpires: resolver.resolveString("auth-expires"),
    configPath: resolver.hasCliOption("private-key") ? undefined : resolveConfigPath(resolver),
    chainId,
    account,
    apiUrl: resolveApiUrl(resolver),
    dacs: args.dacs ?? collectDacsFromResolver(resolver),
    ...tbaAuthOptions(tba, chainId),
  };
}

function authHeaders(token: string): Record<string, string> {
  return {authorization: `Bearer ${token}`};
}

export async function makeCoreContext(resolver: OptionResolver): Promise<CoreContext> {
  const chainId = resolver.resolveNumber("chain-id") ?? DEFAULT_CHAIN_ID;
  const apiUrl = resolveApiUrl(resolver);
  const rpcUrl = deriveRpcUrl(apiUrl, chainId);

  const privateKey = resolver.requireString(
    "private-key",
    "Missing --private-key. Pass --private-key <hex>, set DAC_PRIVATE_KEY in your config, or export DAC_PRIVATE_KEY in the environment.",
  ) as Hex;
  const account = accountFromPrivateKey(privateKey);
  const tba = resolveTbaSpec(resolver, chainId);
  const executor = executorFromSpec(tba);

  const authToken = await resolveAuthToken(authOptionsFromResolver(resolver, {chainId, account, tba}));

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
    executor,
  });

  if (tba) {
    await assertTbaControl(core, tba, account.address);
  }

  return {
    chainId,
    apiUrl,
    account,
    actor: tba?.account ?? account.address,
    executor,
    tba,
    protocol,
    core,
  };
}

export interface ReadOnlyCoreContext {
  chainId: number;
  protocol: ProtocolManifest;
  core: DacCoreClient;
}

/** Core client for on-chain reads; a private key is optional (used only for auth). */
export async function makeReadOnlyCoreContext(resolver: OptionResolver): Promise<ReadOnlyCoreContext> {
  const chainId = resolver.resolveNumber("chain-id") ?? DEFAULT_CHAIN_ID;
  const apiUrl = resolveApiUrl(resolver);
  const rpcUrl = deriveRpcUrl(apiUrl, chainId);

  const privateKeyRaw = resolver.resolveString("private-key");
  const account = privateKeyRaw ? accountFromPrivateKey(privateKeyRaw as Hex) : undefined;

  const authToken = await resolveAuthToken(authOptionsFromResolver(resolver, {chainId, account}));

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
    protocol,
    fetchOptions: {headers: authHeaders(authToken)},
  });

  return {chainId, protocol, core};
}

export interface DryRunContext {
  chainId: number;
  apiUrl: string;
  /** The signer of the emitted transactions (NFT owner for a token-bound account). */
  fromAddress: Address;
  /** The protocol-level actor: the ERC-6551 account when one is configured, else `fromAddress`. */
  actor: Address;
  executor: TxExecutor;
  tba?: TbaSpec;
  protocol: ProtocolManifest;
  txBuilder: DacTransactionBuilder;
}

export async function makeDryRunContext(resolver: OptionResolver): Promise<DryRunContext> {
  const chainId = resolver.resolveNumber("chain-id") ?? DEFAULT_CHAIN_ID;
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

  const tba = resolveTbaSpec(resolver, chainId);
  const executor = executorFromSpec(tba);

  // Dry-run requires a valid token but can work without a private key. A
  // configured key that is not the --from sender must not sign a token-bound
  // session either: only the NFT owner's signature is accepted by the account.
  const authAccount = tba && account && account.address.toLowerCase() !== fromAddress.toLowerCase()
    ? undefined
    : account;
  await resolveAuthToken(authOptionsFromResolver(resolver, {chainId, account: authAccount, tba}));

  const protocol = await fetchManifest(chainId, apiUrl);
  const txBuilder = createDacTransactionBuilder({chainId, fromAddress, protocol, executor});

  return {chainId, apiUrl, fromAddress, actor: txBuilder.actor, executor, tba, protocol, txBuilder};
}

export async function makeIndexer(resolver: OptionResolver) {
  const apiUrl = resolveApiUrl(resolver);
  const chainId = resolver.resolveNumber("chain-id") ?? DEFAULT_CHAIN_ID;
  const indexerUrl = deriveGraphqlUrl(apiUrl);

  const privateKeyRaw = resolver.resolveString("private-key");
  const account = privateKeyRaw ? accountFromPrivateKey(privateKeyRaw as Hex) : undefined;

  const authToken = await resolveAuthToken(authOptionsFromResolver(resolver, {chainId, account}));

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
