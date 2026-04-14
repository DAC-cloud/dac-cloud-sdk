import type {Harness} from "../../harness/types.js";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

export {ZERO_ADDR};

/**
 * Get the current chain block timestamp (EVM time, not wall clock).
 */
export async function getChainTimestamp(h: Harness): Promise<number> {
  const res = await fetch(h.config.rpcUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({jsonrpc: "2.0", id: 1, method: "eth_getBlockByNumber", params: ["latest", false]}),
  });
  const json = (await res.json()) as {result?: {timestamp: string}};
  return Number(BigInt(json.result?.timestamp ?? "0"));
}

/**
 * Resolve an ERC20 token address for testing.
 */
export async function resolveUnderlyingToken(h: Harness): Promise<string> {
  if (h.config.chainId === 84532) {
    return "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia USDC
  }
  return "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB"; // Local Hardhat mock
}

/**
 * Transfer ERC20 tokens from a funded account to a recipient.
 * Uses eth_sendTransaction via Hardhat's auto-impersonation for the sender.
 *
 * For simulating deal progress: transfer the milestone token to the deal cell
 * so that `IERC20(token).balanceOf(cell)` reflects returns.
 */
export async function transferErc20(
  h: Harness,
  opts: {token: string; from: string; to: string; amount: string},
): Promise<string> {
  const {token, from, to, amount} = opts;

  // Impersonate the sender (Hardhat only)
  await rpcCall(h.config.rpcUrl, "hardhat_impersonateAccount", [from]);

  // ERC20.transfer(to, amount) selector = 0xa9059cbb
  const amountHex = BigInt(amount).toString(16).padStart(64, "0");
  const toHex = to.slice(2).toLowerCase().padStart(64, "0");
  const data = `0xa9059cbb${toHex}${amountHex}`;

  const txHash = await rpcCall(h.config.rpcUrl, "eth_sendTransaction", [{
    from: from.toLowerCase(),
    to: token.toLowerCase(),
    data,
    gas: "0x30000",
  }]) as string;

  await rpcCall(h.config.rpcUrl, "hardhat_stopImpersonatingAccount", [from]);

  return txHash;
}

/**
 * Propose → vote → execute a DAC proposal in one shot.
 * Returns the proposal numeric ID.
 */
export async function proposeVoteExecute(
  h: Harness,
  dacAddress: string,
  proposeArgs: string[],
): Promise<string> {
  const {config} = h;

  const proposeCli = await h.cli([
    ...proposeArgs,
    "--dac", dacAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);
  const proposalId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");

  await h.syncIndexer();
  await h.advanceTime(10);

  await h.cli([
    "vote", "proposal", proposalId, "true",
    "--dac", dacAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  await h.advanceTime(3700);

  await h.cli([
    "execute", proposalId,
    "--dac", dacAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  return proposalId;
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
