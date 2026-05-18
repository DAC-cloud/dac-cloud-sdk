# Manifests

`@dac-cloud/manifests` defines the **protocol manifest** — the JSON document that lists
every deployed DAC Cloud contract on a given chain. The SDK and CLI consume manifests
to know where to send transactions; without one, no client method can run.

## What's in a Manifest

```typescript
interface ProtocolManifest {
  chainId: number;

  // Required core addresses:
  dacFactory: `0x${string}`;
  coreModuleFactory: `0x${string}`;
  permit2: `0x${string}`;

  // 40 optional addresses covering factories, implementations, evaluator/module
  // libraries, and standalone deployments:
  dacCellImplementation?: `0x${string}`;
  mainTokenImplementation?: `0x${string}`;
  agentTokenImplementation?: `0x${string}`;
  dealManagerImplementation?: `0x${string}`;
  dealCellImplementation?: `0x${string}`;
  dealImplementation?: `0x${string}`;
  governanceSchemaImplementation?: `0x${string}`;
  governanceOracleImplementation?: `0x${string}`;
  assetControllerImplementation?: `0x${string}`;
  votingProposalImplementation?: `0x${string}`;
  hybridProposalImplementation?: `0x${string}`;
  permit2TreasuryFactory?: `0x${string}`;
  dacDealFactory?: `0x${string}`;
  milestonesEvaluatorFactory?: `0x${string}`;
  revenueEvaluatorFactory?: `0x${string}`;
  // ... (43 address fields total)

  // Optional metadata:
  blockNumber?: number;
  deployer?: `0x${string}`;
}
```

The full key set is exported as `PROTOCOL_MANIFEST_ADDRESS_KEYS`; the required-core
subset is `PROTOCOL_MANIFEST_CORE_ADDRESS_KEYS` (3 keys).

## Loading a Manifest

```typescript
import { fetchManifest } from "@dac-cloud/manifests";

const protocol = await fetchManifest(31337, "https://api.dac.cloud");
```

`fetchManifest(chainId, apiUrl)` issues a GET to `${apiUrl}/manifest/${chainId}`, parses
the JSON, validates required fields (`chainId` is an integer, all 3 core addresses are
valid `0x...`), and returns the typed `ProtocolManifest`. Throws on missing manifest,
network error, or schema violation.

There is **no local-file loader** and **no bundled manifest** — manifests are always
fetched from a running backend. For air-gapped or offline development, run the
[`dac-cloud-backend`](#) locally and point `--api-url` at it.

## Using the Manifest

The manifest is required input for both client and tx-builder constructors:

```typescript
import { createDacCoreClient, createDacTransactionBuilder } from "@dac-cloud/core";

const core = createDacCoreClient({
  chain, rpcUrl, account, protocol,
  fetchOptions: { headers: { authorization: `Bearer ${jwt}` } },
});

const txBuilder = createDacTransactionBuilder({
  chainId, fromAddress, protocol,
});
```

Inside the SDK, methods read the relevant address from `options.protocol`:

```typescript
// In core.deployDac:
const factory = options.protocol.dacFactory;        // required core key
```

Optional-field methods use the `requireProtocolAddress` helper to convert an undefined
field into a clear error:

```typescript
import { requireProtocolAddress } from "@dac-cloud/manifests";

const factory = requireProtocolAddress(protocol, "permit2TreasuryFactory");
// Throws "Manifest is missing required address: permit2TreasuryFactory" if undefined
```

This lets clients fail fast with a meaningful error when running against a partial
deployment (e.g. testnet that hasn't deployed the revenue evaluator yet).

## Type Guards

```typescript
import { isProtocolAddress } from "@dac-cloud/manifests";

if (isProtocolAddress(addr)) {
  // typed as 0x${string}
}
```

`isProtocolAddress(value)` returns `true` for any string matching `^0x[0-9a-fA-F]{40}$`
(case-insensitive). Use it when accepting addresses from untrusted JSON.

## Multi-Chain

Manifests are per-chain by design — each `fetchManifest` call selects one chain via the
URL path segment. The CLI runs one fetch per command (`makeCoreContext` /
`makeDryRunContext` / `makeIndexer`) using `--chain-id`. There is no global registry of
chains in this package; the backend owns the list of supported chains.

To work across chains in one process:

```typescript
const [manifest31337, manifest84532] = await Promise.all([
  fetchManifest(31337, apiUrl),
  fetchManifest(84532, apiUrl),
]);
```

## Schema Source of Truth

There is no JSON schema file shipped with the package — the source of truth is the TypeScript
interface in `packages/manifests/src/index.ts`. Backend implementations should serve a
JSON object satisfying:

- `chainId: integer`
- `dacFactory`, `coreModuleFactory`, `permit2`: valid 20-byte hex addresses
- All other fields: optional, must be valid 20-byte hex addresses when present
- Open-ended: additional keys are allowed (the interface has `[key: string]: unknown`)

## Environment Variables / Search Paths

`@dac-cloud/manifests` itself reads no env vars and searches no filesystem paths. The
CLI layer provides `apiUrl` via `--api-url` / `DAC_API_URL` (default
`https://api.dac.cloud`).

## Related

- [SDK Overview](./overview.md)
- [Core Client API](./core-client.md)
- [Auth & Backend](../cli/auth-and-backend.md) — backend architecture and endpoint layout
