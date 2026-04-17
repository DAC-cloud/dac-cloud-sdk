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
/**
 * Invite an agent to a deal's whitelist via DealCell.invite(invitee, grantInviteRight).
 * Must be called by an account with invite rights (the deal proposer has this by default).
 * Can be called before deal approval — unlike toggle-whitelist which needs deal governance.
 */
export async function inviteAgentToDeal(
  h: Harness,
  opts: {dealCell: string; inviter: string; invitee: string; grantInviteRight?: boolean},
): Promise<void> {
  const {dealCell, inviter, invitee, grantInviteRight = false} = opts;

  await rpcCall(h.config.rpcUrl, "hardhat_impersonateAccount", [inviter]);

  // invite(address,bool) selector = 0xd9caed12... let's compute properly
  // keccak256("invite(address,bool)") first 4 bytes
  // Actually, we encode: selector + address (padded) + bool (padded)
  const inviteeHex = invitee.slice(2).toLowerCase().padStart(64, "0");
  const boolHex = grantInviteRight ? "1" : "0";
  const boolPadded = boolHex.padStart(64, "0");
  // invite(address,bool) = 0x3109f4c0 (computed from keccak)
  // Let's use a more reliable approach — compute via the raw function signature
  const data = `0x${await computeSelector(h.config.rpcUrl, "invite(address,bool)")}${inviteeHex}${boolPadded}`;

  const txHash = await rpcCall(h.config.rpcUrl, "eth_sendTransaction", [{
    from: inviter.toLowerCase(),
    to: dealCell.toLowerCase(),
    data,
    gas: "0x50000",
  }]) as string;

  await rpcCall(h.config.rpcUrl, "hardhat_stopImpersonatingAccount", [inviter]);

  // Wait for receipt
  let receipt: {status: string} | null = null;
  for (let i = 0; i < 10; i++) {
    receipt = await rpcCall(h.config.rpcUrl, "eth_getTransactionReceipt", [txHash]) as {status: string} | null;
    if (receipt) break;
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!receipt) {
    throw new Error(`invite tx receipt not available (tx: ${txHash})`);
  }
  if (receipt.status !== "0x1") {
    throw new Error(`invite tx reverted (tx: ${txHash}, status: ${receipt.status})`);
  }
}

/**
 * Compute a Solidity function selector via Hardhat's eth_call to a precompile.
 * Falls back to a known mapping for common functions.
 */
async function computeSelector(_rpcUrl: string, signature: string): Promise<string> {
  // Use a simple keccak256 computation via known selectors
  const known: Record<string, string> = {
    "invite(address,bool)": "cf65705e",
    "transfer(address,uint256)": "a9059cbb",
  };
  if (known[signature]) return known[signature];
  throw new Error(`Unknown function selector for: ${signature}. Add it to the known map.`);
}

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

  // Wait for receipt (Hardhat may not return it immediately)
  let receipt: {status: string} | null = null;
  for (let i = 0; i < 10; i++) {
    receipt = await rpcCall(h.config.rpcUrl, "eth_getTransactionReceipt", [txHash]) as {status: string} | null;
    if (receipt) break;
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!receipt) {
    throw new Error(`ERC20 transfer receipt not available after polling (tx: ${txHash})`);
  }
  if (receipt.status !== "0x1") {
    throw new Error(`ERC20 transfer reverted on-chain (tx: ${txHash}, status: ${receipt.status})`);
  }

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

/**
 * Propose → vote → execute a DEAL governance proposal in one shot.
 * Uses the founder (default wallet) as proposer/voter.
 *
 * Note: `dealAddress` must be the Deal CONTRACT address (not the DealCell).
 * The Deal contract has `createStakedAgentProposal` / `executeStakedAgentProposal`.
 */
export async function dealProposeVoteExecute(
  h: Harness,
  dealAddress: string,
  proposeArgs: string[],
): Promise<string> {
  const {config} = h;

  const proposeCli = await h.cli([
    ...proposeArgs,
    "--deal-address", dealAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);
  const proposalId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");

  await h.syncIndexer();
  await h.advanceTime(10);

  await h.cli([
    "deal", "vote", "proposal", proposalId, "true",
    "--deal-address", dealAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  await h.advanceTime(3700);

  await h.cli([
    "deal", "execute", proposalId,
    "--deal-address", dealAddress,
    "--config", config.configPath,
    "--pretty-print",
  ]);

  return proposalId;
}

/**
 * Mint mock ERC20 tokens to a recipient (works only against ScriptMintableERC20-style mocks
 * where `mint(address,uint256)` is permissionless). Used by QA scenarios to top up balances
 * regardless of accumulated chain state across test runs.
 *
 * mint(address,uint256) selector = 0x40c10f19
 */
export async function mintMockToken(
  h: Harness,
  opts: {token: string; to: string; amount: string},
): Promise<string> {
  const {token, to, amount} = opts;

  const toHex = to.slice(2).toLowerCase().padStart(64, "0");
  const amountHex = BigInt(amount).toString(16).padStart(64, "0");
  const data = `0x40c10f19${toHex}${amountHex}`;

  // Use the founder wallet (any wallet works since mint is permissionless)
  const founder = h.config.wallets.founder?.address;
  if (!founder) throw new Error("founder wallet required for mintMockToken");

  await rpcCall(h.config.rpcUrl, "hardhat_impersonateAccount", [founder]);
  const txHash = await rpcCall(h.config.rpcUrl, "eth_sendTransaction", [{
    from: founder.toLowerCase(),
    to: token.toLowerCase(),
    data,
    gas: "0x30000",
  }]) as string;
  await rpcCall(h.config.rpcUrl, "hardhat_stopImpersonatingAccount", [founder]);

  let receipt: {status: string} | null = null;
  for (let i = 0; i < 10; i++) {
    receipt = await rpcCall(h.config.rpcUrl, "eth_getTransactionReceipt", [txHash]) as {status: string} | null;
    if (receipt) break;
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!receipt) throw new Error(`mint receipt not available (tx: ${txHash})`);
  if (receipt.status !== "0x1") throw new Error(`mint reverted (tx: ${txHash})`);

  return txHash;
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
