import type {Harness} from "../../harness/types.js";

/**
 * Get the Permit2 contract address from QA config.
 */
export function getPermit2Address(h: Harness): string {
  return h.config.tokens.permit2;
}

/**
 * Approve the Permit2 contract to spend tokens on behalf of an owner.
 * Uses hardhat_impersonateAccount to call ERC20.approve(permit2, amount).
 */
export async function approvePermit2(
  h: Harness,
  opts: {token: string; owner: string; amount: string},
): Promise<void> {
  const {token, owner, amount} = opts;
  const permit2 = h.config.tokens.permit2;

  await rpcCall(h.config.rpcUrl, "hardhat_impersonateAccount", [owner]);

  // ERC20.approve(address,uint256) selector = 0x095ea7b3
  const spenderHex = permit2.slice(2).toLowerCase().padStart(64, "0");
  const amountHex = BigInt(amount).toString(16).padStart(64, "0");
  const data = `0x095ea7b3${spenderHex}${amountHex}`;

  const txHash = await rpcCall(h.config.rpcUrl, "eth_sendTransaction", [{
    from: owner.toLowerCase(),
    to: token.toLowerCase(),
    data,
    gas: "0x30000",
  }]) as string;

  await rpcCall(h.config.rpcUrl, "hardhat_stopImpersonatingAccount", [owner]);

  let receipt: {status: string} | null = null;
  for (let i = 0; i < 10; i++) {
    receipt = await rpcCall(h.config.rpcUrl, "eth_getTransactionReceipt", [txHash]) as {status: string} | null;
    if (receipt) break;
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!receipt || receipt.status !== "0x1") {
    throw new Error(`Permit2 approve failed (tx: ${txHash}, status: ${receipt?.status})`);
  }
}

/**
 * Approve a spender within Permit2's internal allowance system.
 * The source calls permit2.approve(token, spender, amount, expiration).
 * This is separate from the ERC20.approve that grants Permit2 itself token access.
 *
 * approve(address,address,uint160,uint48) selector = 0x87517c45
 */
export async function approvePermit2Allowance(
  h: Harness,
  opts: {token: string; owner: string; spender: string; amount: string; expiration?: number},
): Promise<void> {
  const {token, owner, spender, amount} = opts;
  const permit2 = h.config.tokens.permit2;
  // Use a very high expiration to avoid AllowanceExpired errors (chain time may be far ahead of wall clock)
  const expiration = opts.expiration ?? 4294967295; // max uint32 — year 2106

  await rpcCall(h.config.rpcUrl, "hardhat_impersonateAccount", [owner]);

  // permit2.approve(address token, address spender, uint160 amount, uint48 expiration)
  const tokenHex = token.slice(2).toLowerCase().padStart(64, "0");
  const spenderHex = spender.slice(2).toLowerCase().padStart(64, "0");
  const amountHex = BigInt(amount).toString(16).padStart(64, "0");
  const expHex = BigInt(expiration).toString(16).padStart(64, "0");
  const data = `0x87517c45${tokenHex}${spenderHex}${amountHex}${expHex}`;

  const txHash = await rpcCall(h.config.rpcUrl, "eth_sendTransaction", [{
    from: owner.toLowerCase(),
    to: permit2.toLowerCase(),
    data,
    gas: "0x50000",
  }]) as string;

  await rpcCall(h.config.rpcUrl, "hardhat_stopImpersonatingAccount", [owner]);

  let receipt: {status: string} | null = null;
  for (let i = 0; i < 10; i++) {
    receipt = await rpcCall(h.config.rpcUrl, "eth_getTransactionReceipt", [txHash]) as {status: string} | null;
    if (receipt) break;
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!receipt || receipt.status !== "0x1") {
    throw new Error(`Permit2 allowance approve failed (tx: ${txHash}, status: ${receipt?.status})`);
  }
}

async function rpcCall(rpcUrl: string, method: string, params: unknown[] = []): Promise<unknown> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({jsonrpc: "2.0", id: 1, method, params}),
  });
  const json = (await res.json()) as {result?: unknown; error?: {message: string}};
  if (json.error) {
    throw new Error(`RPC ${method} failed: ${json.error.message}`);
  }
  return json.result;
}
