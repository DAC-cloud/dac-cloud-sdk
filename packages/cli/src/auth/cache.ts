/**
 * JWT token cache — persisted to ~/.dac/auth/ as JSON files.
 *
 * Two kinds of cached data:
 *   - Token cache: {chainId}-{wallet}.json — long-lived JWTs per wallet
 *   - Challenge files: challenge-{chainId}-{wallet}.json — short-lived SIWE challenges
 */
import {existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from "node:fs";
import {homedir} from "node:os";
import {join} from "node:path";

const AUTH_DIR = join(homedir(), ".dac", "auth");

function ensureDir(): void {
  if (!existsSync(AUTH_DIR)) {
    mkdirSync(AUTH_DIR, {recursive: true});
  }
}

// ── Token cache ──────────────────────────────────────────────────────

export interface CachedToken {
  token: string;
  expiresAt: string;
  wallet: string;
  chainId: number;
  kind: "member" | "guest";
}

function tokenPath(chainId: number, wallet: string): string {
  return join(AUTH_DIR, `${chainId}-${wallet.toLowerCase()}.json`);
}

export function readCachedToken(chainId: number, wallet: string): CachedToken | undefined {
  const path = tokenPath(chainId, wallet);
  if (!existsSync(path)) return undefined;

  try {
    const data = JSON.parse(readFileSync(path, "utf8")) as CachedToken;
    if (new Date(data.expiresAt).getTime() <= Date.now()) {
      unlinkSync(path);
      return undefined;
    }
    return data;
  } catch {
    return undefined;
  }
}

export function writeCachedToken(entry: CachedToken): void {
  ensureDir();
  writeFileSync(tokenPath(entry.chainId, entry.wallet), JSON.stringify(entry, null, 2), "utf8");
}

export function removeCachedToken(chainId: number, wallet: string): void {
  const path = tokenPath(chainId, wallet);
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

// ── Challenge cache (for challenge-response auth) ────────────────────

export interface CachedChallenge {
  message: string;
  address: string;
  chainId: number;
  dacs: string[];
  expiresAt: string;
  configPath: string;
}

function challengePath(chainId: number, wallet: string): string {
  return join(AUTH_DIR, `challenge-${chainId}-${wallet.toLowerCase()}.json`);
}

export function readCachedChallenge(chainId: number, wallet: string): CachedChallenge | undefined {
  const path = challengePath(chainId, wallet);
  if (!existsSync(path)) return undefined;

  try {
    const data = JSON.parse(readFileSync(path, "utf8")) as CachedChallenge;
    if (new Date(data.expiresAt).getTime() <= Date.now()) {
      unlinkSync(path);
      return undefined;
    }
    return data;
  } catch {
    return undefined;
  }
}

export function writeCachedChallenge(entry: CachedChallenge): void {
  ensureDir();
  writeFileSync(challengePath(entry.chainId, entry.address), JSON.stringify(entry, null, 2), "utf8");
}

export function removeCachedChallenge(chainId: number, wallet: string): void {
  const path = challengePath(chainId, wallet);
  if (existsSync(path)) {
    unlinkSync(path);
  }
}
