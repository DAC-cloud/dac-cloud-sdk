# Indexer Client API

`@dac-cloud/indexer` exposes a typed GraphQL client backed by `graphql-request`. It
queries the Envio indexer read-model — directly, or through the DAC Cloud backend proxy
at `${apiUrl}/graphql` (recommended for production, since it enforces JWT auth).

## Creating a Client

```typescript
import { createIndexerClient } from "@dac-cloud/indexer";

const indexer = createIndexerClient({
  url: "https://api.dac.cloud/graphql",
  headers: { authorization: `Bearer ${jwt}` },
  timeoutMs: 15_000,  // default
  // fetchFn: customFetch,
});
```

`IndexerClientConfig`:

```typescript
interface IndexerClientConfig {
  url: string;
  headers?: Record<string, string>;
  timeoutMs?: number;     // default 15_000
  fetchFn?: typeof fetch; // override for testing
}
```

The client signature is an **object** — `createIndexerClient({url})`, not
`createIndexerClient(url)`.

## Composite IDs

Indexer entities are keyed by **composite IDs** of the form `"{chainId}:{address}"`,
e.g. `"31337:0x5fbdb2315678afecb367f032d93f642f64180aa3"`. All addresses passed to
by-address lookups are lowercased internally — you can pass checksummed or lowercased
forms interchangeably.

Numeric per-DAC / per-deal IDs (e.g. proposal numeric IDs) require the parent composite
ID for context.

## Pagination

List methods accept `ListQueryArgs`:

```typescript
type ListQueryArgs = { limit?: number; offset?: number };
// defaults: limit=25, offset=0
```

## Namespaces

### `client.dacs`

| Method | Returns |
|--------|---------|
| `getById(id)` | `Dac` or `null` |
| `getByAddress(address)` | `Dac` or `null` (matches either `dacAddress` or `cellAddress`) |
| `list(args?)` | `Dac[]` |

### `client.deals`

| Method | Returns |
|--------|---------|
| `getById(id)` | `Deal` or `null` |
| `getByAddress(address)` | `Deal` or `null` (matches `dealAddress` or `cellAddress`) |
| `listByDac(dacId, args?)` | `Deal[]` |
| `listRelatedContracts(dealId, args?)` | `DealRelatedContract[]` |
| `listGovernanceAccounts(dealId, args?)` | `DealGovernanceAccount[]` |
| `listAgentPositions(dealId, args?)` | `DealAgentPosition[]` |

### `client.proposals`

| Method | Returns |
|--------|---------|
| `getById(id)` | `Proposal` |
| `getByAddress(proposalAddress)` | `Proposal` |
| `getByDacAndNumericId(dacId, numericId)` | `Proposal` or `null` |
| `getByDealAndNumericId(dealId, numericId)` | `Proposal` or `null` |
| `getDacProposal(proposalId)` | `DacProposal` (nested phase events, snapshots, merkle votes, challenged deals) |
| `getDealProposal(proposalId)` | `DealProposal` (nested challenges) |
| `listByDac(dacId, args?)` | `Proposal[]` |
| `listByDeal(dealId, args?)` | `Proposal[]` |
| `listDacProposalsByDac(dacId, args?)` | `DacProposal[]` |
| `listDealProposalsByDeal(dealId, args?)` | `DealProposal[]` |

### `client.accounts`

| Method | Returns |
|--------|---------|
| `getByAddress(address)` | `Account` with nested `mainTokenHoldings`, `dacGovernanceAccounts`, `dacAgents`, `dealAgentPositions`, `dealGovernanceAccounts` |

### `client.treasury`

| Method | Returns |
|--------|---------|
| `listCapitalCallsByDac(dacId, args?)` | `CapitalCall[]` |
| `listHoldingsByDac(dacId, args?)` | `TreasuryHolding[]` |
| `listMovementsByDac(dacId, args?)` | `TreasuryMovement[]` |
| `listDelegationsByDac(dacId, args?)` | `DacTreasuryDelegation[]` |
| `listActionsByDeal(dealId, args?)` | `TreasuryAction[]` |

### `client.oracle`

| Method | Returns |
|--------|---------|
| `listByDac(dacId, args?)` | `GovernanceOracle[]` with nested `publishers` |

### `client.wrapper`

Wrap/unwrap activity (per WrappedMainToken movements).

| Method | Returns |
|--------|---------|
| `listByDac(dacId, args?)` | `WrapperAction[]` |

### `client.legalWrapper`

| Method | Returns |
|--------|---------|
| `listMessagesByDac(dacId, args?)` | `DacLegalWrapperMessage[]` |
| `listStatesByDac(dacId, args?)` | `DacLegalWrapperState[]` |

### Compat aliases

```typescript
client.capitalCalls.listByDac;          // alias of treasury.listCapitalCallsByDac
client.treasuryActions.listByDeal;       // alias of treasury.listActionsByDeal
```

### Escape Hatch

```typescript
const data = await client.rawQuery<MyType>(`
  query MyCustomQuery { ... }
`, { ...variables });
```

`rawQuery` lets you reach `@derivedFrom` collections that don't have dedicated client
methods (e.g. `Dac.modules`, `Dac.agentDistributors`, `Dac.dividendPayouts`,
`Dac.controlledAddresses`, etc.).

## Key Entity Fields

### `Dac`

Identity: `id`, `chainId`, `address`, `mode` (`NATIVE` | `EXISTING_TOKEN`), `name`,
`description`, `symbol`.

Addresses: `mainTokenAddress`, `wrappedMainTokenAddress`, `underlyingTokenAddress`,
`agentTokenAddress`, `dealManagerAddress`, `moduleRegistryAddress`,
`assetControllerAddress`, `governanceSchemaAddress`, `governanceOracleAddress`,
`treasuryHolderAddress`, `legalWrapperAddress`, `coreModuleFactoryAddress`.

Governance params: `votingQuorumPercent`, `votingBlockingPercent`,
`votingHighQuorumPercent`, `votingDuration`, `votingQualification`,
`executionValidityDuration`, `fallbackWarmupDuration`, `fallbackDuration`,
`blockingOnAllProposals`, `blockingOnHighQuorum`, `oraclePrimaryEnabled`.

Capabilities: `supportsMint`, `supportsBurn`, `supportsCapitalCall`, `supportsWrap`,
`supportsUnwrap`, `supportsReserveBackedClaims`, `dividendsEnabled`, `started`.

Counters: `proposalCount`, `executedProposalCount`, `dealCount`, `activeDealCount`,
`moduleCount`, `capitalCallCount`, `mainTokenHolderCount`, `releasedMainTokenAmount`,
`mainTokenObligations`.

### `Deal`

Identifiers: `id`, `dacId`, `dealNumericId`, `proposalNumericId`, `kindSelector`,
`cellAddress`, `dealAddress`, `evaluatorAddress`, `moduleFactoryAddress`,
`evaluatorFactoryAddress`.

Governance: `votingQuorumPercent`, `votingBlockingPercent`, `votingHighQuorumPercent`,
`votingDuration`, `executionValidityDuration`, `qualification`.

Staking aggregates: `totalAgentTokens`, `stakerCount`, `currentStakedAmount`,
`totalStakedAmount`, `totalReleasedStakeAmount`, `totalSlashedStakeAmount`,
`totalRewardAllocatedAmount`, `totalRewardClaimedAmount`, `dealRewardPoolPercent`.

Child-DAC (for `core:dac-deal`): `childDacAddress`, `childDacId`, `childMainTokenAddress`,
`childAgentTokenAddress`.

Lifecycle: `active`, `closed`, `recovered`, `approveDeadline`, `evaluationDeadline`,
`dealDeadline`.

### `DealAgentPosition`

| Field | Description |
|-------|-------------|
| `accountId` | Composite ID — match with `accountId.toLowerCase().includes(walletAddr.toLowerCase())`, not equality |
| `currentStakedAmount` | Active stake |
| `totalStakedAmount` | Total ever staked (immutable) |
| `totalReleasedAmount` | Released via unstake / strike-out |
| `totalSlashedAmount` | Slashed via evaluation |
| `totalClaimedMainTokenAmount` | Rewards claimed |
| `isActive` | Position still active |

Invariant: `currentStakedAmount + totalSlashedAmount + totalReleasedAmount == totalStakedAmount`.

### `Proposal`

`proposalAddress`, `scope` (`DAC` | `DEAL`), `dacId`/`dealId`, `proposalNumericId`,
`kindSelector`, `kindName`, `targetAddress`, `data1`, `data2`, `tokenAddress`,
voting power, quorum, snapshot info, lifecycle flags (`resolved`, `passed`, `executed`,
`currentPhase`, `executionDeadline`).

### `DacProposal` / `DealProposal`

Wrapper entities adding scope-specific fields:

- `DacProposal` → nested `proposal`, `phaseEvents` (`ProposalPhaseEvent`),
  `oracleSnapshots` (per-publisher snapshots), `merkleVotes`, `challengedDeals`.
- `DealProposal` → `challengeable`, `challenged`, `challengeCount`, nested `challenges`
  (DAC challenge records).

### Treasury Entities

- **`TreasuryHolding`** — per-token: `balance`, `committedAmount`, `freeAmount`,
  `creditedAmount`, `debitedAmount`.
- **`TreasuryMovement`** — `direction` (in/out), `movementType`, `amount`,
  `counterpartyAddress`, optional `dealId`/`proposalNumericId`.
- **`DacTreasuryDelegation`** — `delegatedTokenAddress`, `delegateeAddress`, `active`.
- **`TreasuryAction`** (deal-side) — `actionType`, `agent`, `sourceAddress`,
  `destinationAddress`, `amount`, `dealSize`.
- **`CapitalCall`** — `callHash`, `recipient`, `treasuryTokenAddress`, `tokenAmount`,
  `cashAmount`, fulfillment totals. **`callHash`** and the `proposalNumericId` of the
  creating proposal are typically equal (the contract reuses the proposal ID as nonce).

### `GovernanceOracle`

`address`, `active`, nested `publishers` array with `publisherAddress` + `allowed`.

### `WrapperAction`

`tokenAddress`, `caller`, `recipient`, `actionType` (`WRAP` | `UNWRAP`), `amount`.

### `DacLegalWrapperState` / `DacLegalWrapperMessage`

- **State**: `wrapperAddress`, `operatingAgreementIpfs`, `registeredAgent`, `data`.
- **Message**: `messageKind` (bytes4), `message` (hex bytes), block metadata.

## GraphQL Codegen

Queries live in `packages/indexer/src/queries/*.graphql`:

| File | Operations |
|------|------------|
| `dacs.graphql` | `GetDacById`, `GetDacByAddress`, `ListDacs` |
| `deals.graphql` | Deals + related contracts + governance accounts + agent positions |
| `governance.graphql` | All proposal queries (DAC/deal/composite views) |
| `treasury.graphql` | Capital calls, holdings, movements, delegations, deal actions |
| `oracle.graphql` | Governance oracles + wrapper actions |
| `accounts.graphql` | `GetAccountByAddress` with nested fragments |
| `legal.graphql` | Legal-wrapper messages + states |
| `deal-vote-sign.graphql` | Snapshot.org venue versions + external votes (not wired to client; use `rawQuery`) |

After editing any `.graphql` file:

```bash
INDEXER_SCHEMA_URL=http://127.0.0.1:8080/v1/graphql \
  npm run codegen --workspace @dac-cloud/indexer
```

Generated types land in `packages/indexer/src/generated/graphql.ts` — `*Document`,
`*Query`, `*QueryVariables` for every operation. All are re-exported from
`@dac-cloud/indexer` for direct use with `rawQuery` or external `graphql-request`
clients.

## Related

- [SDK Overview](./overview.md)
- [Core Client API](./core-client.md)
- [Manifests](./manifests.md)
