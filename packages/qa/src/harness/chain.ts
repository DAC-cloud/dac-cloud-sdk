import type {QaConfig} from "./types.js";

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

export async function advanceTime(config: QaConfig, seconds: number): Promise<void> {
  if (!config.isLocalChain) {
    throw new Error("advanceTime is only available on local chains (Hardhat/Anvil)");
  }
  await rpcCall(config.rpcUrl, "evm_increaseTime", [seconds]);
  await rpcCall(config.rpcUrl, "evm_mine");
}

export async function mineBlock(config: QaConfig): Promise<void> {
  if (!config.isLocalChain) {
    throw new Error("mineBlock is only available on local chains (Hardhat/Anvil)");
  }
  await rpcCall(config.rpcUrl, "evm_mine");
}

export async function getBlockNumber(rpcUrl: string): Promise<bigint> {
  const result = await rpcCall(rpcUrl, "eth_blockNumber");
  return BigInt(result as string);
}

export async function snapshot(config: QaConfig): Promise<string> {
  if (!config.isLocalChain) {
    throw new Error("snapshot is only available on local chains");
  }
  return (await rpcCall(config.rpcUrl, "evm_snapshot")) as string;
}

export async function revert(config: QaConfig, snapshotId: string): Promise<void> {
  if (!config.isLocalChain) {
    throw new Error("revert is only available on local chains");
  }
  await rpcCall(config.rpcUrl, "evm_revert", [snapshotId]);
}
