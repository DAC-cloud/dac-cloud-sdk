# `@dac-cloud/indexer`

Typed GraphQL query client for the DAC Cloud Envio indexer read-model.

## Install

```bash
npm install @dac-cloud/indexer
```

## Usage

```typescript
import { createIndexerClient } from "@dac-cloud/indexer";

const indexer = createIndexerClient({
  url: "https://api.dac.cloud/graphql",
  headers: { authorization: `Bearer ${jwt}` },
  // timeoutMs: 15_000,  // default
});

const dac = await indexer.dacs.getByAddress("0x...");
const proposals = await indexer.proposals.listByDac("31337:0x...", { limit: 50 });
const positions = await indexer.deals.listAgentPositions("31337:0x...");
```

Pass `headers.authorization` with a SIWE-issued JWT (see
[Auth & Backend](../../docs/cli/auth-and-backend.md)) when querying through the
DAC Cloud backend proxy. For direct queries to a local Envio (no backend), `headers`
is optional.

## Namespaces

- `client.dacs` — `getById`, `getByAddress`, `list`
- `client.deals` — `getById`, `getByAddress`, `listByDac`, `listRelatedContracts`,
  `listGovernanceAccounts`, `listAgentPositions`
- `client.proposals` — DAC/deal proposal queries, by composite ID or numeric ID,
  with nested phase events / oracle snapshots / merkle votes / challenges
- `client.accounts` — `getByAddress`
- `client.treasury` — `listCapitalCallsByDac`, `listHoldingsByDac`,
  `listMovementsByDac`, `listDelegationsByDac`, `listActionsByDeal`
- `client.oracle` — `listByDac` (with publishers)
- `client.wrapper` — wrap/unwrap actions (`listByDac`)
- `client.legalWrapper` — `listMessagesByDac`, `listStatesByDac`
- `client.capitalCalls` / `client.treasuryActions` — compat aliases
- `client.rawQuery(query, variables?)` — escape hatch for arbitrary GraphQL

See [Indexer Client API](../../docs/sdk/indexer-client.md) for full method docs and
entity shapes.

## Composite IDs

Indexer entities are keyed by `"{chainId}:{address}"` (e.g.
`"31337:0x5fbdb2..."`). Addresses are lower-cased internally — pass either casing.

## Codegen

After editing any `.graphql` file in `src/queries/`:

```bash
INDEXER_SCHEMA_URL=http://127.0.0.1:8080/v1/graphql \
  npm run codegen --workspace @dac-cloud/indexer
```

This regenerates `src/generated/graphql.ts` with `*Document`, `*Query`, and
`*QueryVariables` types for every operation. Generated types are re-exported from the
package root.

## Build

```bash
npm install
npm run build
npm run typecheck
```
