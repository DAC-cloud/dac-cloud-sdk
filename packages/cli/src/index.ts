#!/usr/bin/env node
import {randomBytes} from "node:crypto";
import {resolve} from "node:path";
import {accountFromPrivateKey, createDacCoreClient, type DACConfig} from "@dac-cloud/core";
import {loadProtocolManifest, tryLoadBasicDacSeed} from "@dac-cloud/manifests";
import {defineChain, type Hex} from "viem";

const DEFAULT_ANVIL_PK_0 =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as Hex;

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const maybeValue = argv[i + 1];
    if (!maybeValue || maybeValue.startsWith("--")) {
      out[key] = "true";
      continue;
    }
    out[key] = maybeValue;
    i += 1;
  }
  return out;
}

function toBigIntArg(value: string | undefined, fallback: bigint): bigint {
  if (!value) return fallback;
  return BigInt(value);
}

function usage() {
  process.stdout.write(
    [
      "dac CLI",
      "",
      "Commands:",
      "  dac create-dacs --count 10 [--rpc-url http://127.0.0.1:8545] [--chain-id 31337]",
      "",
      "Important flags:",
      "  --contracts-root /path/to/dac-cloud-contracts",
      "  --private-key 0x... (defaults to Anvil account #0)",
      "  --treasury-token 0x... (auto-fallback from basic-dac-seed manifest)",
      "",
    ].join("\n"),
  );
}

async function createDacs(args: Record<string, string>) {
  const chainId = Number(args["chain-id"] ?? "31337");
  const rpcUrl = args["rpc-url"] ?? "http://127.0.0.1:8545";
  const count = Number(args.count ?? "1");

  if (!Number.isFinite(count) || count < 1) {
    throw new Error("--count should be a positive integer");
  }

  const contractsRoot = resolve(args["contracts-root"] ?? process.env.DAC_CONTRACTS_ROOT ?? "../dac-cloud-contracts");
  const privateKey = (args["private-key"] as Hex | undefined) ?? DEFAULT_ANVIL_PK_0;
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
  const basicSeed = await tryLoadBasicDacSeed(chainId, "seed", {contractsRoot});

  const treasuryToken = (args["treasury-token"] ?? (basicSeed?.treasuryToken as string | undefined)) as `0x${string}` | undefined;
  if (!treasuryToken) {
    throw new Error("Treasury token is required. Pass --treasury-token or ensure basic-dac-seed manifest exists.");
  }

  const core = createDacCoreClient({
    chain,
    rpcUrl,
    account,
    protocol,
  });

  process.stdout.write(`Using founder ${account.address}\n`);
  process.stdout.write(`Using DACFactory ${protocol.dacFactory}\n`);

  for (let i = 0; i < count; i += 1) {
    const label = `${args.prefix ?? "stress"}-${i}`;
    const config: DACConfig = {
      symbol: (args.symbol ?? "DAC").slice(0, 8),
      name: `${args.name ?? "DAC Stress"} ${i}`,
      description: `${args.description ?? "Load generation DAC"} #${i}`,
      mainTokenMaxSupply: toBigIntArg(args["max-supply"], 1_000_000n * 10n ** 18n),
      defaultQuorum: toBigIntArg(args["default-quorum"], 2_000_000_000n),
      founder: account.address,
      founderAllocation: toBigIntArg(args["founder-allocation"], 100_000n * 10n ** 18n),
      treasuryToken,
      founderCommitment: toBigIntArg(args["founder-commitment"], 0n),
      dividendsEnabled: args.dividends === "true",
    };

    const salt = (`0x${randomBytes(32).toString("hex")}`) as Hex;
    const result = await core.deployDac({config, salt});

    process.stdout.write(
      JSON.stringify({
        action: "create-dac",
        label,
        txHash: result.txHash,
        dac: result.dac,
        mainToken: result.mainToken,
        agentToken: result.agentToken,
      }) + "\n",
    );
  }
}

async function main() {
  const [, , command, ...rawArgs] = process.argv;
  const args = parseArgs(rawArgs);

  if (!command || command === "-h" || command === "--help" || command === "help") {
    usage();
    return;
  }

  if (command === "create-dacs") {
    await createDacs(args);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
