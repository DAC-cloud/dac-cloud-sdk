# Indexer Client API

The `@dac-cloud/indexer` package provides a typed GraphQL client for the Envio indexer read-model.

## Creating a Client

```typescript
import { createIndexerClient } from "@dac-cloud/indexer";

const indexer = createIndexerClient("http://localhost:8080/v1/graphql");
```

## DAC Queries

```typescript
// Get DAC by composite ID
const dac = await indexer.dacs.getById("31337:0x...");

// Get DAC by address (tries both DACCell and DAC address)
const dac = await indexer.dacs.getByAddress("0x...");

// List all DACs
const dacs = await indexer.dacs.list({ limit: 10, offset: 0 });
```

## Deal Queries

```typescript
// Get deal by composite ID
const deal = await indexer.deals.getById("31337:0x...");

// Get deal by address (tries both deal address and cell address)
const deal = await indexer.deals.getByAddress("0x...");

// List deals in a DAC
const deals = await indexer.deals.listByDac("31337:0x...", { limit: 10 });

// List agent positions for a deal
const positions = await indexer.deals.listAgentPositions("31337:0x...");

// List governance accounts for a deal
const accounts = await indexer.deals.listGovernanceAccounts("31337:0x...");

// List related contracts for a deal
const contracts = await indexer.deals.listRelatedContracts("31337:0x...");
```

## Proposal Queries

```typescript
// Get proposal by ID
const proposal = await indexer.proposals.getById("31337:0x...");

// List proposals by DAC
const proposals = await indexer.proposals.listByDac("31337:0x...");

// List proposals by deal
const proposals = await indexer.proposals.listByDeal("31337:0x...");
```

## Treasury Queries

```typescript
// List capital calls
const calls = await indexer.capitalCalls.listByDac("31337:0x...");

// List treasury delegations
const delegations = await indexer.treasuryDelegations.listByDac("31337:0x...");

// List treasury actions by deal
const actions = await indexer.treasuryActions.listByDeal("31337:0x...");
```

## Key Entity Fields

### Deal

| Field | Type | Description |
|-------|------|-------------|
| `active` | boolean | Deal has been funded/approved |
| `closed` | boolean | Deal is permanently closed |
| `recovered` | boolean | Deal entered recovery mode |
| `currentStakedAmount` | string | Current total staked AgentTokens |
| `totalSlashedStakeAmount` | string | Total slashed across all evaluations |
| `totalRewardAllocatedAmount` | string | Total MainToken rewards allocated |
| `totalRewardClaimedAmount` | string | Total MainToken rewards claimed |
| `stakerCount` | string | Number of staked agents |
| `totalEvaluationCount` | string | Number of evaluations performed |

### DealAgentPosition

| Field | Type | Description |
|-------|------|-------------|
| `currentStakedAmount` | string | Agent's current stake |
| `totalStakedAmount` | string | Total ever staked |
| `totalReleasedAmount` | string | Released via unstake |
| `totalSlashedAmount` | string | Slashed via evaluation |
| `totalClaimedMainTokenAmount` | string | MainToken rewards claimed |
| `isActive` | boolean | Position still active |

## GraphQL Schema

The indexer schema is defined in `packages/indexer/src/queries/*.graphql`. After modifying queries, regenerate types:

```bash
npm run codegen --workspace @dac-cloud/indexer
```

## Related

- [SDK Overview](./overview.md)
- [Core Client API](./core-client.md)
