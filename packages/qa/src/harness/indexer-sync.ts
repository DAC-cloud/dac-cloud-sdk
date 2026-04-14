import type {QaConfig} from "./types.js";
import {getBlockNumber} from "./chain.js";

/**
 * Wait for the indexer to catch up to the current chain head.
 *
 * Strategy: query the indexer's internal status endpoint for its latest indexed
 * block, and compare to the chain's current block number. Poll until they match
 * (or timeout). This works for both local and testnet chains.
 *
 * Fallback: if the indexer doesn't expose a block-height endpoint, we use a
 * simple time-based wait.
 */
export async function syncIndexer(config: QaConfig, opts?: {timeoutMs?: number}): Promise<void> {
  const timeout = opts?.timeoutMs ?? config.indexerSyncTimeoutMs;
  const poll = config.indexerPollIntervalMs;
  const deadline = Date.now() + timeout;

  // Mine an empty block to create a boundary. The indexer must process this
  // block (which contains no events) AFTER the preceding blocks with events.
  // This ensures that when we see this block as "processed", all prior block
  // data is fully committed to the indexer's data tables.
  if (config.isLocalChain) {
    const {mineBlock} = await import("./chain.js");
    await mineBlock(config);
  }

  // Get current chain block (includes the freshly mined boundary block)
  const chainBlock = await getBlockNumber(config.rpcUrl);

  // Try to poll indexer block height via its internal query
  while (Date.now() < deadline) {
    try {
      const indexerBlock = await getIndexerBlockHeight(config.indexerUrl);
      if (indexerBlock !== null && indexerBlock >= chainBlock) {
        return;
      }
    } catch {
      // Indexer might not support this query — fall through to time-based wait
    }
    await sleep(poll);
  }

  // Final fallback: just wait a bit more and hope for the best
  await sleep(Math.min(2000, timeout));
}

async function getIndexerBlockHeight(indexerUrl: string): Promise<bigint | null> {
  // Envio HyperIndex exposes chain metadata. Try the standard query.
  const query = `{ chain_metadata { latest_processed_block } }`;

  try {
    const res = await fetch(indexerUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({query}),
    });
    const json = (await res.json()) as {
      data?: {chain_metadata?: Array<{latest_processed_block: number}>};
    };
    const block = json.data?.chain_metadata?.[0]?.latest_processed_block;
    if (block !== undefined) {
      return BigInt(block);
    }
  } catch {
    // Not available
  }

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
