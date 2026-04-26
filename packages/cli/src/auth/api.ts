/**
 * Backend auth API calls — nonce, verify, me, logout.
 */
import type {Hex} from "viem";

export interface NonceResponse {
  nonce: string;
  message: string;
  expiresAt: string;
}

export interface VerifyResponse {
  token: string;
  expiresAt: string;
  session: {
    wallet: string;
    chainId: number;
    kind: "member" | "guest";
    memberships: Array<{dac: string; roles: string[]}>;
  };
  warnings?: Array<{dac: string; reason: string}>;
}

export interface MeResponse {
  wallet: string;
  chainId: number;
  kind: "member" | "guest";
  expiresAt: string;
  memberships: Array<{dac: string; roles: string[]}>;
}

function apiBase(apiUrl: string): string {
  return apiUrl.replace(/\/+$/, "");
}

async function handleErrorResponse(response: Response): Promise<never> {
  let detail = "";
  try {
    const body = await response.json() as {error?: string; reason?: string; warnings?: unknown[]};
    if (body.error) {
      detail = body.error;
      if (body.reason) detail += `: ${body.reason}`;
      if (body.warnings && Array.isArray(body.warnings)) {
        detail += ` (warnings: ${JSON.stringify(body.warnings)})`;
      }
    }
  } catch {
    detail = await response.text().catch(() => "");
  }
  throw new Error(`Auth API error ${response.status}: ${detail || response.statusText}`);
}

export async function requestNonce(
  apiUrl: string,
  address: string,
  chainId: number,
  dacs: string[],
): Promise<NonceResponse> {
  const response = await fetch(`${apiBase(apiUrl)}/auth/nonce`, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({address, chainId, dacs}),
  });

  if (!response.ok) await handleErrorResponse(response);
  return response.json() as Promise<NonceResponse>;
}

export async function verifySignature(
  apiUrl: string,
  message: string,
  signature: Hex,
): Promise<VerifyResponse> {
  const response = await fetch(`${apiBase(apiUrl)}/auth/verify`, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({message, signature}),
  });

  if (!response.ok) await handleErrorResponse(response);
  return response.json() as Promise<VerifyResponse>;
}

export async function getMe(apiUrl: string, token: string): Promise<MeResponse> {
  const response = await fetch(`${apiBase(apiUrl)}/auth/me`, {
    headers: {authorization: `Bearer ${token}`},
  });

  if (!response.ok) await handleErrorResponse(response);
  return response.json() as Promise<MeResponse>;
}

export async function logout(apiUrl: string, token: string): Promise<void> {
  const response = await fetch(`${apiBase(apiUrl)}/auth/logout`, {
    method: "POST",
    headers: {authorization: `Bearer ${token}`},
  });

  if (!response.ok) await handleErrorResponse(response);
}
