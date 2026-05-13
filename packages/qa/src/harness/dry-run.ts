import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  type Address,
  type Hex,
  type PublicClient,
  type TransactionReceipt,
  type WalletClient,
} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {execCli} from "./cli-exec.js";
import type {CliOpts, CliResult, QaConfig} from "./types.js";

/**
 * A single transaction request emitted by the CLI in --dry-run mode.
 * Matches `TransactionRequest` in @dac-cloud/core (bigints serialized as strings
 * by `printJson`).
 */
export interface DryRunTx {
  to: Address;
  from: Address;
  data: Hex;
  value: string | number;
  chainId: number;
}

export interface DryRunSubmitResult {
  cliData: Record<string, unknown>;
  receipts: TransactionReceipt[];
}

interface RoleClients {
  wallet: WalletClient;
  address: Address;
}

/**
 * Build a viem chain definition that matches the QA local chain.
 */
function buildChain(config: QaConfig) {
  return defineChain({
    id: config.chainId,
    name: `dac-qa-${config.chainId}`,
    nativeCurrency: {name: "ETH", symbol: "ETH", decimals: 18},
    rpcUrls: {
      default: {http: [config.localRpcUrl]},
      public: {http: [config.localRpcUrl]},
    },
  });
}

/**
 * Extract dry-run transaction(s) from CLI output, regardless of whether the
 * command emitted a single `transaction` or a `transactions: [...]` array.
 */
function extractDryRunTxs(data: Record<string, unknown>): DryRunTx[] {
  if (Array.isArray(data.transactions)) {
    return data.transactions as DryRunTx[];
  }
  if (data.transaction && typeof data.transaction === "object") {
    return [data.transaction as DryRunTx];
  }
  throw new Error(
    `Dry-run output has no 'transaction' or 'transactions' field. Got keys: ${Object.keys(data).join(", ")}`,
  );
}

/**
 * Create a submitDryRun helper closure that signs and broadcasts dry-run output
 * via viem. Caches per-role wallet clients and reuses a single public client.
 */
export function createSubmitDryRun(
  config: QaConfig,
  log: (msg: string) => void,
): (role: string, args: string[], opts?: CliOpts) => Promise<DryRunSubmitResult> {
  const chain = buildChain(config);
  const publicClient: PublicClient = createPublicClient({chain, transport: http(config.localRpcUrl)});
  const roleCache = new Map<string, RoleClients>();

  function clientsFor(role: string): RoleClients {
    const cached = roleCache.get(role);
    if (cached) return cached;

    const wallet = config.wallets[role];
    if (!wallet) {
      throw new Error(`Unknown wallet role: "${role}". Available: ${Object.keys(config.wallets).join(", ")}`);
    }

    const account = privateKeyToAccount(wallet.privateKey as Hex);
    const walletClient = createWalletClient({account, chain, transport: http(config.localRpcUrl)});
    const entry: RoleClients = {wallet: walletClient, address: account.address};
    roleCache.set(role, entry);
    return entry;
  }

  return async function submitDryRun(role: string, args: string[], opts?: CliOpts): Promise<DryRunSubmitResult> {
    const {address} = clientsFor(role);

    const dryRunArgs = [...args, "--dry-run", "--from", address];
    log(`$ dac [dry-run as ${role}] ${dryRunArgs.join(" ")}`);

    const cli = await execCli(config, dryRunArgs, opts);
    if (cli.exitCode !== 0) {
      throw new Error(`Dry-run CLI failed (exit ${cli.exitCode}): ${cli.stderr || cli.stdout}`.slice(0, 800));
    }

    const action = String(cli.data.action ?? "unknown");
    const txs = extractDryRunTxs(cli.data);
    log(`  → dry-run ${action}: ${txs.length} tx(s) to submit`);

    const {wallet} = clientsFor(role);
    const receipts: TransactionReceipt[] = [];
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      const value = BigInt(tx.value ?? 0);
      const hash = await wallet.sendTransaction({
        account: wallet.account!,
        chain,
        to: tx.to,
        data: tx.data,
        value,
      });
      const receipt = await publicClient.waitForTransactionReceipt({hash});
      if (receipt.status !== "success") {
        throw new Error(
          `Dry-run tx ${i + 1}/${txs.length} for action '${action}' reverted (tx=${hash})`,
        );
      }
      log(`  ✓ tx ${i + 1}/${txs.length} mined: ${hash} (gas ${receipt.gasUsed})`);
      receipts.push(receipt);
    }

    return {cliData: cli.data, receipts};
  };
}

export type {CliResult};
