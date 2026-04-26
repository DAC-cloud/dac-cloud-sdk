/**
 * Auth flow orchestration — auto-auth, challenge, verify.
 */
import {type Hex, type PrivateKeyAccount} from "viem";
import {requestNonce, verifySignature, type VerifyResponse} from "./api.js";
import {
  readCachedChallenge,
  readCachedToken,
  removeCachedChallenge,
  writeCachedChallenge,
  writeCachedToken,
  type CachedToken,
} from "./cache.js";

/**
 * Full auto-auth: nonce → sign → verify → cache.
 * Returns the JWT token and session details.
 */
export async function autoAuth(opts: {
  apiUrl: string;
  chainId: number;
  account: PrivateKeyAccount;
  dacs: string[];
}): Promise<VerifyResponse> {
  const {apiUrl, chainId, account, dacs} = opts;

  // 1. Request nonce
  const nonceRes = await requestNonce(apiUrl, account.address, chainId, dacs);

  // 2. Sign the SIWE message
  const signature = await account.signMessage({message: nonceRes.message}) as Hex;

  // 3. Verify with backend
  const verifyRes = await verifySignature(apiUrl, nonceRes.message, signature);

  // 4. Cache the token
  writeCachedToken({
    token: verifyRes.token,
    expiresAt: verifyRes.expiresAt,
    wallet: account.address,
    chainId,
    kind: verifyRes.session.kind,
  });

  return verifyRes;
}

/**
 * Challenge step: request nonce + SIWE message, cache it for later verification.
 * Returns the SIWE message to be signed externally.
 */
export async function requestChallenge(opts: {
  apiUrl: string;
  chainId: number;
  address: string;
  dacs: string[];
  configPath: string;
}): Promise<{message: string; expiresAt: string}> {
  const {apiUrl, chainId, address, dacs, configPath} = opts;

  const nonceRes = await requestNonce(apiUrl, address, chainId, dacs);

  writeCachedChallenge({
    message: nonceRes.message,
    address,
    chainId,
    dacs,
    expiresAt: nonceRes.expiresAt,
    configPath,
  });

  return {message: nonceRes.message, expiresAt: nonceRes.expiresAt};
}

/**
 * Verify step: read cached challenge, submit signature, get JWT.
 * Returns the config path to write the token to (from the cached challenge).
 */
export async function verifyChallenge(opts: {
  apiUrl: string;
  chainId: number;
  address: string;
  signature: Hex;
}): Promise<{verifyRes: VerifyResponse; configPath: string}> {
  const {apiUrl, chainId, address, signature} = opts;

  const challenge = readCachedChallenge(chainId, address);
  if (!challenge) {
    throw new Error(
      `No pending challenge found for ${address} on chain ${chainId}. ` +
      `Run 'dac auth challenge --from ${address}' first.`,
    );
  }

  const verifyRes = await verifySignature(apiUrl, challenge.message, signature);

  // Cache the token
  writeCachedToken({
    token: verifyRes.token,
    expiresAt: verifyRes.expiresAt,
    wallet: address,
    chainId,
    kind: verifyRes.session.kind,
  });

  // Clean up challenge file
  removeCachedChallenge(chainId, address);

  return {verifyRes, configPath: challenge.configPath};
}

/**
 * Decode JWT claims without verification.
 * JWT is base64url-encoded: header.payload.signature
 */
function decodeJwtClaims(token: string): {sub?: string; kind?: string} | undefined {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return undefined;
    return JSON.parse(Buffer.from(parts[1], "base64url").toString()) as {sub?: string; kind?: string};
  } catch {
    return undefined;
  }
}

function extractJwtSubject(token: string): string | undefined {
  return decodeJwtClaims(token)?.sub?.toLowerCase();
}

/**
 * Detect if a JWT is a guest token.
 * The backend doesn't include `kind` in JWT claims, but guest tokens have
 * a short TTL (30min) vs member tokens (30 days). We use the TTL heuristic:
 * if exp - iat < 1 hour, it's a guest token.
 */
function isGuestToken(token: string): boolean {
  const claims = decodeJwtClaims(token) as {iat?: number; exp?: number; kind?: string} | undefined;
  if (!claims) return false;
  // Check explicit kind first (future-proof if backend adds it)
  if (claims.kind) return claims.kind === "guest";
  // TTL heuristic: guest = 30min, member = 30 days
  if (claims.iat && claims.exp) {
    return (claims.exp - claims.iat) < 3600;
  }
  return false;
}

/**
 * Resolve a valid JWT for the current command.
 *
 * Resolution order:
 *   1. Config's DAC_AUTH_TOKEN (if valid and matches wallet)
 *   2. Cached token from ~/.dac/auth/ (for --private-key overrides)
 *   3. Auto-auth (if private key is available)
 *   4. Error with actionable message
 */
export async function resolveAuthToken(opts: {
  configToken?: string;
  configTokenExpires?: string;
  chainId: number;
  account?: PrivateKeyAccount;
  apiUrl: string;
  dacs: string[];
}): Promise<string> {
  const {configToken, configTokenExpires, chainId, account, apiUrl, dacs} = opts;

  // 1. Try config token — only if it matches the current wallet (or no wallet specified)
  if (configToken && configTokenExpires) {
    const expires = new Date(configTokenExpires).getTime();
    if (expires > Date.now()) {
      if (!account) {
        // No wallet to match against (dry-run without private key) — use config token
        return configToken;
      }
      const tokenWallet = extractJwtSubject(configToken);
      if (tokenWallet === account.address.toLowerCase()) {
        // Token matches wallet — but check if it's guest and we can promote to member
        if (isGuestToken(configToken) && dacs.length > 0) {
          // Guest token with DAC context available — re-auth as member
          const result = await autoAuth({apiUrl, chainId, account, dacs});
          return result.token;
        }
        return configToken;
      }
      // Config token is for a different wallet — fall through to cache/auto-auth
    }
  }

  // 2. Try cached token for this wallet
  if (account) {
    const cached = readCachedToken(chainId, account.address);
    if (cached) {
      // Promote guest → member if DAC context is available
      if (cached.kind === "guest" && dacs.length > 0) {
        const result = await autoAuth({apiUrl, chainId, account, dacs});
        return result.token;
      }
      return cached.token;
    }
  }

  // 3. Auto-auth if we have a private key
  if (account) {
    const result = await autoAuth({apiUrl, chainId, account, dacs});
    return result.token;
  }

  // 4. No way to auth
  const fromHint = opts.configToken ? " (token expired)" : "";
  throw new Error(
    `No valid auth token${fromHint}. ` +
    `Run 'dac auth login' (with private key) or ` +
    `'dac auth challenge --from <address>' (for external signing).`,
  );
}

/**
 * Read a cached token directly (no auto-auth fallback).
 * Used for status/logout where we just need the existing token.
 */
export function readExistingToken(
  configToken?: string,
  configTokenExpires?: string,
  chainId?: number,
  wallet?: string,
): CachedToken | undefined {
  // Try config token first
  if (configToken && configTokenExpires) {
    const expires = new Date(configTokenExpires).getTime();
    if (expires > Date.now()) {
      return {
        token: configToken,
        expiresAt: configTokenExpires,
        wallet: wallet ?? "",
        chainId: chainId ?? 0,
        kind: "member",
      };
    }
  }

  // Try cache
  if (chainId && wallet) {
    return readCachedToken(chainId, wallet);
  }

  return undefined;
}
