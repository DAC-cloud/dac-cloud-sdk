# SDK Overview

The DAC Cloud SDK is a TypeScript monorepo with four publishable packages plus a
private QA harness. All packages target ESM and ship `.d.ts` declarations.

## Packages

### @dac-cloud/core

The main SDK package — a [viem](https://viem.sh)-based client for the DAC Cloud
contracts. Exports:

- `createDacCoreClient(options)` — signing client (writes + reads). 45 methods covering
  every contract entrypoint.
- `createDacTransactionBuilder(options)` — unsigned-tx builder that mirrors the client's
  method set but returns `TransactionRequest` objects for multisig / external signers.
- `accountFromPrivateKey(privateKey)` — viem `PrivateKeyAccount` helper.
- All contract **ABIs** (`dacFactoryAbi`, `dacCellAbi`, `dealManagerAbi`, `dealCellAbi`,
  `dealAbi`, `governanceOracleAbi`, `votingProposalAbi`, `wrappedMainTokenAbi`,
  `permit2TreasuryAbi`, etc.).
- **Proposal builders** (`buildMintAgentTokensProposal`, `buildStrikeOutAgentProposal`,
  `buildUpdateGovernanceStrategyProposal`, …) — return `ProposalParams` ready to pass
  to `createDacManagementProposal` / `createDealManagementProposal`.
- **Selectors** — `DAC_PROPOSAL_TYPE`, `DEAL_PROPOSAL_TYPE`, `CORE_DEAL_KIND`,
  `CORE_EVALUATOR_KIND`, `CORE_DEAL_PROPOSAL_TYPE`, `CORE_TREASURY_PROPOSAL_TYPE`.
- **Types** — `DACConfig`, `NativeDacConfig`, `ExistingTokenDacConfig`,
  `GovernanceStrategyConfig`, `VotingConfig`, `DealCreationConfig`, `DealParams`,
  `CapitalCall`, `HybridProposalState`, `PROPOSAL_PHASE`, `ASSET_CAPABILITY`, …
- **`coreModule` namespace** — JSON parsers and encoders for the core module's
  evaluator configs (milestones, revenue), deal configs (permit2-treasury, dac-deal),
  plus Snapshot.org ERC-1271 helpers (`computeSnapshotV1FinalHash`, `SNAPSHOT_VOTE_EIP712`).
- **Utilities** — `formatViemError`, `randomSalt`, `referralUidToSalt`,
  `percentToScale`/`scaleToPercent` (1e18 mantissa math), `encodeExistingTokenConfig`.

```typescript
import { createDacCoreClient, accountFromPrivateKey } from "@dac-cloud/core";
import { fetchManifest } from "@dac-cloud/manifests";

const account = accountFromPrivateKey("0x...");
const protocol = await fetchManifest(31337, "https://api.dac.cloud");
const core = createDacCoreClient({
  chain,
  rpcUrl: "https://api.dac.cloud/rpc/31337",
  account,
  protocol,
  fetchOptions: { headers: { authorization: `Bearer ${jwt}` } },
});
```

See [Core Client API](./core-client.md) and [Transaction Builder](./transaction-builder.md).

### @dac-cloud/indexer

Typed GraphQL client for the Envio indexer read-model. Uses `graphql-request` with a
custom fetch that wraps `AbortController` for timeouts.

```typescript
import { createIndexerClient } from "@dac-cloud/indexer";

const indexer = createIndexerClient({
  url: "https://api.dac.cloud/graphql",
  headers: { authorization: `Bearer ${jwt}` },
});

const dac = await indexer.dacs.getByAddress("0x...");
const positions = await indexer.deals.listAgentPositions("31337:0x...");
```

Namespaces: `dacs`, `deals`, `proposals`, `accounts`, `treasury`, `oracle`, `wrapper`,
`legalWrapper`, plus compat aliases `capitalCalls` and `treasuryActions`. See
[Indexer Client API](./indexer-client.md).

### @dac-cloud/manifests

Per-chain protocol manifest types and HTTP loader.

```typescript
import { fetchManifest } from "@dac-cloud/manifests";

const protocol = await fetchManifest(31337, "https://api.dac.cloud");
// protocol.dacFactory, protocol.coreModuleFactory, protocol.permit2, ...
```

A manifest is a JSON object mapping a chain to its deployed contract addresses. 43
address fields are defined (3 required: `dacFactory`, `coreModuleFactory`, `permit2`).
See [Manifests](./manifests.md).

### @dac-cloud/cli

The `dac` CLI binary — a Commander.js wrapper around `@dac-cloud/core` + `@dac-cloud/indexer`
that adds SIWE auth, config-file resolution, and dry-run support. JSON-first output for
automation. See [CLI Overview](../cli/overview.md).

### @dac-cloud/qa (private)

E2E QA harness: 29 scenarios covering DAC + deal lifecycles, accounting invariants, and
an optional Claude-based agent reviewer. Not published. See
[QA package README](../../packages/qa/README.md).

## Dependency Graph

```
   cli  ───►  core  ───►  manifests
    │         │
    └─► indexer
```

`core` depends on `manifests` for typed manifest schemas; `cli` depends on `core`,
`indexer`, and `manifests` directly. `qa` depends on `cli` (it spawns the binary)
and `indexer` (it queries directly for assertions).

## Installation

```bash
# From npm (once published):
npm install @dac-cloud/core @dac-cloud/indexer @dac-cloud/manifests

# From source:
git clone <repo-url>
cd dac-cloud-sdk
npm install
npm run build
```

## Building

```bash
npm run build        # Build all packages (tsup)
npm run typecheck    # Type-check all packages (tsc --noEmit)

# After modifying packages/indexer/src/queries/*.graphql:
npm run codegen --workspace @dac-cloud/indexer
```

`tsup` outputs ESM with `.d.ts` declarations for each package's `src/index.ts`.

## Auth Note

The CLI handles auth automatically (`dac auth login`). When using the SDK directly:

1. Run a SIWE roundtrip to obtain a JWT — the CLI's `packages/cli/src/auth/` module is a
   reference implementation you can copy or import internally.
2. Pass the JWT via `fetchOptions.headers.authorization` to `createDacCoreClient` and
   via `headers` to `createIndexerClient`.

Manifest fetch (`fetchManifest`) currently does not require auth, but production
deployments may rate-limit unauthenticated requests.

## Versioning

All packages are currently at `0.1.0`. The packages will be released together — pin
their versions in lockstep until a stable major is announced.

## Related

- [Core Client API](./core-client.md)
- [Indexer Client API](./indexer-client.md)
- [Manifests](./manifests.md)
- [Transaction Builder](./transaction-builder.md)
- [CLI Overview](../cli/overview.md)
