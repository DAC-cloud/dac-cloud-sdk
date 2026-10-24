/**
 * Auth flow orchestration — auto-auth, challenge, verify.
 */
import {type Hex, type PrivateKeyAccount} from "viem";
import {getMe, requestNonce, verifySignature, type VerifyResponse} from "./api.js";
import {
  readCachedChallenge,
  readCachedToken,
  removeCachedChallenge,
  writeCachedChallenge,
  writeCachedToken,
  type CachedToken,
} from "./cache.js";
import {writeConfigKey} from "../runtime/config.js";

/**
 * Full auto-auth: nonce → sign → verify → cache.
 * Returns the JWT token and session details.
 */
export async function autoAuth(opts: {
  apiUrl: string;
  chainId: number;
  account: PrivateKeyAccount;
  dacs: string[];
  /**
   * Session wallet when it is not the signer: an ERC-6551 account whose NFT
   * owner (`account`) signs the SIWE message; the backend verifies it through
   * the account's ERC-1271 `isValidSignature`.
   */
  sessionAddress?: string;
  /**
   * Post-processes the owner's signature, e.g. ERC-6492 wrapping so a
   * counterfactual (not yet deployed) account can still be verified on-chain.
   */
  wrapSignature?: (signature: Hex) => Hex;
}): Promise<VerifyResponse> {
  const {apiUrl, chainId, account, dacs} = opts;
  const sessionWallet = opts.sessionAddress ?? account.address;

  // 1. Request nonce
  const nonceRes = await requestNonce(apiUrl, sessionWallet, chainId, dacs);

  // 2. Sign the SIWE message
  const rawSignature = await account.signMessage({message: nonceRes.message}) as Hex;
  const signature = opts.wrapSignature ? opts.wrapSignature(rawSignature) : rawSignature;

  // 3. Verify with backend
  let verifyRes: VerifyResponse;
  try {
    verifyRes = await verifySignature(apiUrl, nonceRes.message, signature);
  } catch (error) {
    // For a token-bound session the backend checks the owner's signature through the
    // account's ERC-1271, so a rejected signature almost always means "not the owner".
    if (opts.sessionAddress && error instanceof Error && /invalid_signature/.test(error.message)) {
      throw new Error(
        `Token-bound account ${sessionWallet} rejected the signature of ${account.address}: `
        + `the signer is not the NFT owner (or the account's derivation parameters are wrong). `
        + `Check with 'dac tba info'.`,
      );
    }
    throw error;
  }

  // 4. Cache the token
  writeCachedToken({
    token: verifyRes.token,
    expiresAt: verifyRes.expiresAt,
    wallet: sessionWallet,
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
 * Probe a token against the backend. Returns true if the session is still
 * valid; false otherwise. Errors are swallowed so callers can fall through
 * to the next auth source.
 */
async function validateToken(apiUrl: string, token: string): Promise<boolean> {
  try {
    await getMe(apiUrl, token);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve a valid JWT for the current command.
 *
 * Resolution order:
 *   1. Config's DAC_AUTH_TOKEN (if valid and matches wallet)
 *   2. Cached token from ~/.dac/auth/ (for --private-key overrides)
 *   3. Auto-auth (if private key is available)
 *   4. Error with actionable message
 *
 * Each stored-token source is probed against the backend (`/auth/me`) before
 * being returned — a token that's local-valid but server-revoked (e.g. after
 * a backend wipe) is treated as absent and we fall through to relogin.
 *
 * Any session this resolver obtains (or finds in the cache) for the config's
 * own wallet is written back to `configPath`, so a login is performed once —
 * never once per command. Guest → member promotion in particular used to
 * re-login on every DAC-scoped command because the guest token in the config
 * always won over the promoted token in the cache; the backend's auth rate
 * limit was then exhausted by the CLI itself.
 */
export async function resolveAuthToken(opts: {
  configToken?: string;
  configTokenExpires?: string;
  /**
   * Config file to persist a (re)obtained session for the config's own wallet
   * to. Omit when the private key was overridden on the command line: that
   * wallet's session must not replace the config's and lives in the cache only.
   */
  configPath?: string;
  chainId: number;
  account?: PrivateKeyAccount;
  apiUrl: string;
  dacs: string[];
  /** Session wallet when acting through an ERC-6551 account (see autoAuth). */
  sessionAddress?: string;
  wrapSignature?: (signature: Hex) => Hex;
}): Promise<string> {
  const {configToken, configTokenExpires, configPath, chainId, account, apiUrl, dacs, sessionAddress, wrapSignature} = opts;
  const sessionWallet = (sessionAddress ?? account?.address)?.toLowerCase();
  let staleTokenSeen = false;

  // The config is updated only for its own wallet: a token already in the config
  // for another wallet is left alone (same rule as a --private-key override).
  const configTokenWallet = configToken ? extractJwtSubject(configToken) : undefined;
  const persistToConfig = Boolean(configPath && sessionWallet && (!configTokenWallet || configTokenWallet === sessionWallet));
  const persist = (session: {token: string; expiresAt: string}): void => {
    if (!persistToConfig || !configPath) return;
    if (session.token === configToken) return;
    writeConfigKey(configPath, "DAC_AUTH_TOKEN", session.token);
    writeConfigKey(configPath, "DAC_AUTH_EXPIRES", session.expiresAt);
  };
  const login = async (): Promise<string> => {
    const result = await autoAuth({apiUrl, chainId, account: account!, dacs, sessionAddress, wrapSignature});
    persist(result);
    return result.token;
  };

  // 1. Try config token — only if it matches the current wallet (or no wallet specified)
  if (configToken && configTokenExpires) {
    const expires = new Date(configTokenExpires).getTime();
    if (expires > Date.now()) {
      if (!sessionWallet) {
        // No wallet to match against (dry-run without private key) — validate before use
        if (await validateToken(apiUrl, configToken)) return configToken;
        staleTokenSeen = true;
      } else if (configTokenWallet === sessionWallet) {
        // Token matches wallet — but check if it's guest and we can promote to member
        if (account && isGuestToken(configToken) && dacs.length > 0) {
          // A previous command may already have promoted this session: reuse it
          // (and heal the config) instead of logging in again.
          const cached = readCachedToken(chainId, sessionWallet);
          if (cached && cached.kind !== "guest" && await validateToken(apiUrl, cached.token)) {
            persist(cached);
            return cached.token;
          }
          return login();
        }
        if (await validateToken(apiUrl, configToken)) return configToken;
        staleTokenSeen = true;
      }
      // Config token is for a different wallet — fall through to cache/auto-auth
    }
  }

  // 2. Try cached token for this wallet
  if (sessionWallet) {
    const cached = readCachedToken(chainId, sessionWallet);
    if (cached) {
      // Promote guest → member if DAC context is available
      if (account && cached.kind === "guest" && dacs.length > 0) {
        return login();
      }
      if (await validateToken(apiUrl, cached.token)) {
        persist(cached);
        return cached.token;
      }
      staleTokenSeen = true;
    }
  }

  // 3. Auto-auth if we have a private key
  if (account) {
    return login();
  }

  // 4. No way to auth
  const fromHint = staleTokenSeen
    ? " (stored session no longer valid on backend)"
    : opts.configToken ? " (token expired)" : "";
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
