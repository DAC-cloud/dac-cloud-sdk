/**
 * CLI commands: dac auth login | challenge | verify | status | logout
 */
import {Command} from "commander";
import {accountFromPrivateKey} from "@dac-cloud/core";
import type {Hex} from "viem";
import {applyOptions, type OptionKey} from "../cli/options.js";
import {loadOptionResolver, writeConfigKey, removeConfigKey} from "../runtime/config.js";
import {resolveApiUrl} from "../runtime/chain.js";
import {printJson} from "../runtime/io.js";
import {getMe, logout as apiLogout} from "./api.js";
import {autoAuth, requestChallenge, verifyChallenge, readExistingToken} from "./flows.js";
import {removeCachedToken} from "./cache.js";

const AUTH_OPTIONS: OptionKey[] = ["config", "chain-id", "api-url", "private-key", "pretty-print"];

function collectDacs(opts: Record<string, unknown>): string[] {
  const raw = opts.dac ?? opts.dacAddress ?? opts.cellAddress;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  return [String(raw)];
}

export function registerAuthCommands(
  program: Command,
  resolverFactory: typeof loadOptionResolver,
): void {
  const auth = program
    .command("auth")
    .description("Authentication — login, challenge/verify, status, logout");

  // ── dac auth login ─────────────────────────────────────────────────
  const loginCmd = auth
    .command("login")
    .description("Auto-login using private key from config (SIWE sign + verify)")
    .option("--dac <address...>", "DAC addresses to scope the session to");
  applyOptions(loginCmd, AUTH_OPTIONS);
  loginCmd.action(async function handleLogin(this: Command) {
    const opts = this.optsWithGlobals();
    const resolver = await resolverFactory(opts);
    const chainId = resolver.resolveNumber("chain-id") ?? 31337;
    const apiUrl = resolveApiUrl(resolver);
    const privateKey = resolver.requireString("private-key",
      "Login requires a private key. Use 'dac auth challenge' for external signing.");
    const account = accountFromPrivateKey(privateKey as Hex);
    const dacs = collectDacs(opts);

    // Also pull DAC_ADDRESS from config as fallback scope
    const configDac = resolver.resolveString("dac-address") ?? resolver.resolveString("dac");
    if (configDac && !dacs.includes(configDac)) {
      dacs.push(configDac);
    }

    const result = await autoAuth({apiUrl, chainId, account, dacs});

    // Write token back to config
    const configPath = resolver.resolveString("config") ?? "./config.env";
    writeConfigKey(configPath, "DAC_AUTH_TOKEN", result.token);
    writeConfigKey(configPath, "DAC_AUTH_EXPIRES", result.expiresAt);

    printJson({
      ok: true,
      wallet: result.session.wallet,
      kind: result.session.kind,
      expiresAt: result.expiresAt,
      memberships: result.session.memberships,
      warnings: result.warnings,
    });
  });

  // ── dac auth challenge ─────────────────────────────────────────────
  const challengeCmd = auth
    .command("challenge")
    .description("Request SIWE challenge message for external signing")
    .option("--dac <address...>", "DAC addresses to scope the session to");
  applyOptions(challengeCmd, ["config", "chain-id", "api-url", "from", "pretty-print"]);
  challengeCmd.action(async function handleChallenge(this: Command) {
    const opts = this.optsWithGlobals();
    const resolver = await resolverFactory(opts);
    const chainId = resolver.resolveNumber("chain-id") ?? 31337;
    const apiUrl = resolveApiUrl(resolver);
    const configPath = resolver.resolveString("config") ?? "./config.env";

    const address = resolver.requireString("from",
      "'dac auth challenge' requires --from <address> to identify the wallet.");
    const dacs = collectDacs(opts);

    const configDac = resolver.resolveString("dac-address") ?? resolver.resolveString("dac");
    if (configDac && !dacs.includes(configDac)) {
      dacs.push(configDac);
    }

    const {message, expiresAt} = await requestChallenge({
      apiUrl,
      chainId,
      address,
      dacs,
      configPath,
    });

    // Print human-readable output for the user to sign
    process.stderr.write(`\nSign this message with wallet ${address}:\n`);
    process.stderr.write(`${"─".repeat(60)}\n`);
    process.stderr.write(`${message}\n`);
    process.stderr.write(`${"─".repeat(60)}\n`);
    process.stderr.write(`\nExpires: ${expiresAt}\n`);
    process.stderr.write(`\nThen run:\n  dac auth verify --signature 0x<sig> --config ${configPath}\n\n`);

    // JSON output for programmatic use
    printJson({
      ok: true,
      message,
      address,
      chainId,
      expiresAt,
    });
  });

  // ── dac auth verify ────────────────────────────────────────────────
  const verifyCmd = auth
    .command("verify")
    .description("Complete auth with externally-signed SIWE message")
    .requiredOption("--signature <hex>", "Signed SIWE message (0x-prefixed hex)");
  applyOptions(verifyCmd, ["config", "chain-id", "api-url", "from", "pretty-print"]);
  verifyCmd.action(async function handleVerify(this: Command) {
    const opts = this.optsWithGlobals();
    const resolver = await resolverFactory(opts);
    const chainId = resolver.resolveNumber("chain-id") ?? 31337;
    const apiUrl = resolveApiUrl(resolver);
    const address = resolver.requireString("from",
      "'dac auth verify' requires --from <address> to locate the pending challenge.");
    const signature = String(opts.signature) as Hex;

    const {verifyRes, configPath} = await verifyChallenge({
      apiUrl,
      chainId,
      address,
      signature,
    });

    // Write token to the config that was used during challenge
    const targetConfig = resolver.resolveString("config") ?? configPath;
    writeConfigKey(targetConfig, "DAC_AUTH_TOKEN", verifyRes.token);
    writeConfigKey(targetConfig, "DAC_AUTH_EXPIRES", verifyRes.expiresAt);

    printJson({
      ok: true,
      wallet: verifyRes.session.wallet,
      kind: verifyRes.session.kind,
      expiresAt: verifyRes.expiresAt,
      memberships: verifyRes.session.memberships,
      warnings: verifyRes.warnings,
    });
  });

  // ── dac auth status ────────────────────────────────────────────────
  const statusCmd = auth
    .command("status")
    .description("Show current auth session details");
  applyOptions(statusCmd, AUTH_OPTIONS);
  statusCmd.action(async function handleStatus(this: Command) {
    const opts = this.optsWithGlobals();
    const resolver = await resolverFactory(opts);
    const apiUrl = resolveApiUrl(resolver);

    const configToken = resolver.resolveString("auth-token");
    const configExpires = resolver.resolveString("auth-expires");

    const cached = readExistingToken(configToken, configExpires);
    if (!cached) {
      printJson({authenticated: false, error: "No valid auth token found."});
      return;
    }

    try {
      const me = await getMe(apiUrl, cached.token);
      printJson({
        authenticated: true,
        wallet: me.wallet,
        chainId: me.chainId,
        kind: me.kind,
        expiresAt: me.expiresAt,
        memberships: me.memberships,
      });
    } catch (err) {
      printJson({
        authenticated: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  // ── dac auth logout ────────────────────────────────────────────────
  const logoutCmd = auth
    .command("logout")
    .description("Revoke current session and remove token from config");
  applyOptions(logoutCmd, AUTH_OPTIONS);
  logoutCmd.action(async function handleLogout(this: Command) {
    const opts = this.optsWithGlobals();
    const resolver = await resolverFactory(opts);
    const apiUrl = resolveApiUrl(resolver);
    const chainId = resolver.resolveNumber("chain-id") ?? 31337;
    const configPath = resolver.resolveString("config") ?? "./config.env";

    const configToken = resolver.resolveString("auth-token");
    const configExpires = resolver.resolveString("auth-expires");

    const cached = readExistingToken(configToken, configExpires);
    if (cached?.token) {
      try {
        await apiLogout(apiUrl, cached.token);
      } catch {
        // Session may already be revoked — continue cleanup
      }
    }

    // Remove from config file
    removeConfigKey(configPath, "DAC_AUTH_TOKEN");
    removeConfigKey(configPath, "DAC_AUTH_EXPIRES");

    // Remove from cache
    if (cached?.wallet) {
      removeCachedToken(chainId, cached.wallet);
    }

    printJson({ok: true, loggedOut: true});
  });
}
