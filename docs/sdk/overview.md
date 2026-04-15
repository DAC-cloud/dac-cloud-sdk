# SDK Overview

The DAC Cloud SDK is a TypeScript monorepo with four public packages.

## Packages

### @dac-cloud/core

The main SDK package. Provides a [viem](https://viem.sh)-based client for interacting with DAC Cloud smart contracts.

```typescript
import { createDacCoreClient } from "@dac-cloud/core";

const core = createDacCoreClient({
  rpcUrl: "http://127.0.0.1:8545",
  chainId: 31337,
  privateKey: "0xac0974...",
});
```

See [Core Client API](./core-client.md) for the full method reference.

**Key exports:**
- `createDacCoreClient()` — Factory function
- `DacCoreClient` — Client interface
- Contract ABIs (`dacCellAbi`, `dealManagerAbi`, `dealCellAbi`, `dealAbi`, etc.)
- Proposal builders (`buildUpdateDealVotingConfigProposal`, `buildStrikeOutAgentProposal`, etc.)
- Selectors (`DAC_PROPOSAL_TYPE`, `DEAL_PROPOSAL_TYPE`)
- Type definitions (`DACConfig`, `DealParams`, `ProposalParams`, etc.)

### @dac-cloud/indexer

GraphQL client for the Envio indexer read-model. Provides typed queries for DACs, deals, proposals, agent positions, and more.

```typescript
import { createIndexerClient } from "@dac-cloud/indexer";

const indexer = createIndexerClient("http://localhost:8080/v1/graphql");
const deal = await indexer.deals.getByAddress("0x...");
```

See [Indexer Client API](./indexer-client.md) for the full method reference.

### @dac-cloud/manifests

Contract deployment manifest loaders. Used internally by `@dac-cloud/core` to resolve deployed contract addresses per chain.

### @dac-cloud/qa

QA harness and E2E scenario tests. Not published — used for internal testing.

## Dependency Graph

```
cli  -->  core  -->  manifests
 |
 +---->  indexer
```

## Installation

```bash
# From npm (when published)
npm install @dac-cloud/core @dac-cloud/indexer

# From source
git clone <repo-url>
cd dac-cloud-sdk
npm install
npm run build
```

## Building

```bash
npm run build        # Build all packages
npm run typecheck    # Type-check all packages
npm run codegen --workspace @dac-cloud/indexer  # Regenerate GraphQL types
```

## Related

- [Core Client API](./core-client.md)
- [Indexer Client API](./indexer-client.md)
- [CLI Overview](../cli/overview.md)
