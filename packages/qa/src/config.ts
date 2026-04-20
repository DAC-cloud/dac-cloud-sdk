import {readFileSync, existsSync} from "node:fs";
import {resolve} from "node:path";
import dotenv from "dotenv";
import type {QaConfig, TokenConfig, WalletConfig} from "./harness/types.js";

const DEFAULT_PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

/**
 * Hardhat default accounts (deterministic from mnemonic "test test test test test test test test test test test junk").
 * These are the standard 20 accounts available in Hardhat/Anvil.
 */
const HARDHAT_ACCOUNTS: WalletConfig[] = [
  {privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", label: "account0"},
  {privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", label: "account1"},
  {privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", label: "account2"},
  {privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", label: "account3"},
  {privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a", address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", label: "account4"},
  {privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba", address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", label: "account5"},
  {privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e", address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", label: "account6"},
  {privateKey: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356", address: "0x14dC79964da2C08dA15Fd353d30d9CBf55f12dB5", label: "account7"},
  {privateKey: "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97", address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", label: "account8"},
  {privateKey: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6", address: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", label: "account9"},
];

/**
 * Parse a simple KEY=VALUE .env file (for reading CLI config.env which
 * uses the same format but is NOT the QA .env — it's the CLI's config file).
 */
function parseCliConfigFile(path: string): Record<string, string> {
  const content = readFileSync(path, "utf-8");
  const vars: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    vars[key] = value;
  }
  return vars;
}

export interface QaConfigInput {
  /** Path to base config.env */
  configPath?: string;
  /** Extra wallet config files (role → path-to-env-with-private-key) */
  walletConfigs?: Record<string, string>;
  /** Direct wallet overrides */
  wallets?: Record<string, {privateKey: string; address: string}>;
  /** Override CLI binary path */
  cliBin?: string;
  /** Indexer sync timeout */
  indexerSyncTimeoutMs?: number;
  /** Indexer poll interval */
  indexerPollIntervalMs?: number;
  /** Force local chain mode */
  isLocalChain?: boolean;
  /** Anthropic API key for agent reviewer */
  reviewerApiKey?: string;
  /** Reviewer model (default: claude-haiku-4-5-20251001) */
  reviewerModel?: string;
}

export function loadQaConfig(input: QaConfigInput = {}): QaConfig {
  // ── Load QA .env (repo root) via dotenv ───────────────────────
  // This contains QA-specific vars: token addresses, permit2, etc.
  // dotenv loads from CWD/.env by default and populates process.env.
  dotenv.config();

  // ── Load CLI config.env (passed to CLI via --config flag) ─────
  // This contains RPC, indexer, chain ID, contracts root, private key.
  const configPath = resolve(input.configPath ?? "./config.env");
  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  const cliVars = parseCliConfigFile(configPath);

  // CLI config values (from config.env file)
  const rpcUrl = cliVars.DAC_RPC_URL || "http://127.0.0.1:8545";
  const indexerUrl = cliVars.DAC_INDEXER_URL || "http://127.0.0.1:8080/v1/graphql";
  const chainId = parseInt(cliVars.DAC_CHAIN_ID || "31337", 10);
  const contractsRoot = cliVars.DAC_CONTRACTS_ROOT || "";
  const privateKey = cliVars.DAC_PRIVATE_KEY || undefined;

  // Resolve CLI binary
  const cliBin = input.cliBin ?? resolve("./node_modules/.bin/dac");
  if (!existsSync(cliBin)) {
    throw new Error(`CLI binary not found: ${cliBin}. Run 'npm run build' first.`);
  }

  // Build wallet map
  const wallets: Record<string, WalletConfig> = {};
  const isLocal = input.isLocalChain ?? chainId === 31337;
  if (isLocal) {
    const roles = ["founder", "agent1", "agent2", "agent3", "agent4", "agent5", "publisher", "admin", "outsider", "treasury"];
    for (let i = 0; i < roles.length && i < HARDHAT_ACCOUNTS.length; i++) {
      wallets[roles[i]] = HARDHAT_ACCOUNTS[i];
    }
  }

  if (privateKey) {
    wallets.founder = {
      ...wallets.founder,
      privateKey,
      label: "founder",
    };
  }

  if (input.walletConfigs) {
    for (const [role, walletPath] of Object.entries(input.walletConfigs)) {
      const walletVars = parseCliConfigFile(resolve(walletPath));
      const wk = walletVars.DAC_PRIVATE_KEY;
      if (wk) {
        wallets[role] = {privateKey: wk, address: "", label: role};
      }
    }
  }

  if (input.wallets) {
    for (const [role, w] of Object.entries(input.wallets)) {
      wallets[role] = {privateKey: w.privateKey, address: w.address, label: role};
    }
  }

  // Token addresses — read from QA .env (process.env, populated by dotenv)
  const treasuryToken = process.env.DAC_TREASURY_TOKEN;
  if (!treasuryToken) {
    throw new Error("DAC_TREASURY_TOKEN is required in .env (underlying/treasury mock token address)");
  }
  const tokens: TokenConfig = {
    treasury: treasuryToken,
    secondary: process.env.DAC_SECONDARY_TOKEN || undefined,
    permit2: process.env.DAC_PERMIT2_ADDRESS || DEFAULT_PERMIT2_ADDRESS,
  };

  // Reviewer config
  let reviewer = undefined;
  const apiKey = input.reviewerApiKey ?? process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    reviewer = {
      apiKey,
      model: input.reviewerModel ?? "claude-haiku-4-5-20251001",
    };
  }

  return {
    cliBin,
    configPath,
    rpcUrl,
    indexerUrl,
    chainId,
    wallets,
    contractsRoot,
    tokens,
    indexerSyncTimeoutMs: input.indexerSyncTimeoutMs ?? 30_000,
    indexerPollIntervalMs: input.indexerPollIntervalMs ?? 1_000,
    isLocalChain: isLocal,
    reviewer,
  };
}
