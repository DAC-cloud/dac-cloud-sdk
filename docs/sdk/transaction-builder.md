# Transaction Builder

`createDacTransactionBuilder` is the **unsigned-transaction** counterpart to
`createDacCoreClient`. It mirrors the client's method set but returns
`TransactionRequest` objects instead of broadcasting and waiting for receipts. Use it
when the signer is external — a hardware wallet, multisig (Safe), browser extension,
custodian, or any other system that owns the private key.

The CLI's `--dry-run` flag uses this internally.

## Creating a Builder

```typescript
import { createDacTransactionBuilder } from "@dac-cloud/core";
import { fetchManifest } from "@dac-cloud/manifests";

const protocol = await fetchManifest(31337, "https://api.dac.cloud");

const txBuilder = createDacTransactionBuilder({
  chainId: 31337,
  fromAddress: "0x<sender>",
  protocol,
});
```

`DacTxBuilderOptions`:

```typescript
interface DacTxBuilderOptions {
  chainId: number;
  fromAddress: `0x${string}`;
  protocol: ProtocolManifest;
}
```

Unlike `createDacCoreClient`, the builder needs **no RPC URL, no account, and no auth**
— it never talks to the network. Everything happens in memory.

## Output Shape

Every method returns a `TransactionRequest`:

```typescript
interface TransactionRequest {
  chainId: number;
  from: `0x${string}`;
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
  // gas fields are omitted — the signer should estimate
}
```

For methods that produce multiple transactions (e.g. `wrapMainToken` may need
`approveErc20` first), the builder returns an array:

```typescript
const txs: TransactionRequest[] = await txBuilder.wrapMainToken({...});
// or: txs is a single TransactionRequest, depending on the method.
```

Check the method's signature — write-equivalent methods that involve a prerequisite
allowance return `TransactionRequest[]`; pure write methods return a single
`TransactionRequest`.

## Mirroring the Core Client

The builder exposes the same method set as `DacCoreClient`. Examples:

```typescript
const deployTx = txBuilder.deployDac({ config, salt });
const proposeTx = txBuilder.createDacManagementProposal({ dacCell, params });
const voteTx = txBuilder.voteProposal({ proposalAddress, support: true });
const executeTx = txBuilder.executeDacProposal({ dacCell, proposalId });
```

Method signatures match `DacCoreClient` exactly — switching from broadcast to dry-run
is purely a constructor swap.

## Use Cases

### Safe Transaction Builder

Generate a batch of transactions ready to import into a Safe multisig:

```typescript
const txs = [
  txBuilder.createDacManagementProposal({...}),
  txBuilder.voteProposal({...}),
];
const safeBatch = txs.map(tx => ({
  to: tx.to,
  data: tx.data,
  value: tx.value.toString(),
  operation: 0,
}));
fs.writeFileSync("safe-batch.json", JSON.stringify(safeBatch, null, 2));
```

### Browser Wallet (wagmi / viem WalletClient)

```typescript
const tx = txBuilder.createDealProposal({...});
const hash = await walletClient.sendTransaction({
  to: tx.to, data: tx.data, value: tx.value,
});
```

### CLI Dry-Run

```bash
dac propose mint-agent-tokens 1000000000000000000000 0x<agent> \
  --dac 0x<dac> --dry-run --from 0x<sender> --pretty-print
```

Output:

```json
{
  "action": "dac.propose.mint-agent-tokens",
  "dryRun": true,
  "dac": "0x...",
  "proposalType": "mint-agent-tokens",
  "transaction": {
    "chainId": 31337,
    "from": "0x...",
    "to": "0x...",   // DACCell.createManagementProposal
    "data": "0x...",
    "value": "0"
  }
}
```

## Auth in Dry-Run Mode

The CLI still requires a valid JWT when running `--dry-run`, because the **manifest
fetch** routes through the backend. If you use `createDacTransactionBuilder` directly
from your own code with an already-cached manifest, no auth is needed.

## What the Builder Doesn't Do

- **No gas estimation** — gas fields are omitted; the signer is responsible.
- **No receipt waiting** — there's no broadcast.
- **No `submitWrite` semantics** — when you broadcast the resulting tx yourself, viem
  may return a hash on revert. Always check the receipt status after broadcasting if
  you need failure detection.
- **No nonce management** — `nonce` is not set. The signer must inject one for
  long-running batches.

## Related

- [Core Client API](./core-client.md) — the signing equivalent
- [Manifests](./manifests.md)
- [Auth & Backend — Dry-Run](../cli/auth-and-backend.md#dry-run-and-auth)
