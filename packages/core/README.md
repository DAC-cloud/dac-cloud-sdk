# `@dac-cloud/core`

Viem-based TypeScript SDK for the DAC Cloud protocol — ABIs, types, proposal builders,
and a high-level client.

## Install

```bash
npm install @dac-cloud/core @dac-cloud/manifests viem
```

## Usage

### Signing client

```typescript
import { createDacCoreClient, accountFromPrivateKey } from "@dac-cloud/core";
import { fetchManifest } from "@dac-cloud/manifests";
import { defineChain } from "viem";

const account = accountFromPrivateKey("0x...");
const protocol = await fetchManifest(31337, "https://api.dac.cloud");

const chain = defineChain({
  id: 31337,
  name: "dac-31337",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://api.dac.cloud/rpc/31337"] } },
});

const core = createDacCoreClient({
  chain,
  rpcUrl: "https://api.dac.cloud/rpc/31337",
  account,
  protocol,
  fetchOptions: { headers: { authorization: `Bearer ${jwt}` } },
});

// All write methods route through submitWrite — 50% gas buffer + receipt status check.
// A returned tx hash means the transaction was mined AND succeeded.
const { proposalId } = await core.createDacManagementProposal({
  dacCell: "0x...",
  params: buildMintAgentTokensProposal({ amount: 1n, recipient: "0x..." }),
});
```

The client exposes 45 methods covering DAC deployment, token operations, DAC and deal
governance, hybrid (oracle) governance, deal lifecycle, treasury, and legal-wrapper
messages. See [Core Client API](../../docs/sdk/core-client.md) for the full reference.

### Unsigned-tx builder (multisig / external signers)

```typescript
import { createDacTransactionBuilder } from "@dac-cloud/core";

const txBuilder = createDacTransactionBuilder({
  chainId: 31337,
  fromAddress: "0x<sender>",
  protocol,
});

const tx = txBuilder.createDacManagementProposal({ dacCell, params });
// tx is { chainId, from, to, data, value } — ready for Safe import or wallet.sendTransaction
```

See [Transaction Builder](../../docs/sdk/transaction-builder.md).

### Proposal builders

```typescript
import {
  buildMintAgentTokensProposal,
  buildStrikeOutAgentProposal,
  buildUpdateGovernanceStrategyProposal,
} from "@dac-cloud/core";

const params = buildMintAgentTokensProposal({
  amount: 100_000_000000000000000000n,
  recipient: "0x...",
});

await core.createDacManagementProposal({ dacCell: "0x...", params });
```

30+ builders cover every DAC and deal proposal type — see
[Core Client API → Proposal Builders](../../docs/sdk/core-client.md#proposal-builders).

### Selectors

```typescript
import {
  DAC_PROPOSAL_TYPE,
  DEAL_PROPOSAL_TYPE,
  CORE_DEAL_KIND,
  CORE_EVALUATOR_KIND,
  CORE_DEAL_PROPOSAL_TYPE,
} from "@dac-cloud/core";

DAC_PROPOSAL_TYPE.MINT_AGENT_TOKENS;     // bytes4 selector
DEAL_PROPOSAL_TYPE.STRIKE_OUT_AGENT;
CORE_DEAL_KIND.PERMIT2_TREASURY;
CORE_EVALUATOR_KIND.MILESTONES_EVALUATOR;
```

### ABIs and types

```typescript
import {
  dacCellAbi, dealManagerAbi, dealCellAbi, dealAbi,
  governanceOracleAbi, votingProposalAbi, hybridDacManagementProposalAbi,
  permit2TreasuryAbi, wrappedMainTokenAbi, agentTokenAbi, erc20VotesAbi, erc20Abi,
  dacFactoryAbi, assetControllerAbi, governanceSchemaAbi,
} from "@dac-cloud/core";

import type {
  DACConfig, NativeDacConfig, ExistingTokenDacConfig,
  GovernanceStrategyConfig, VotingConfig, DealCreationConfig,
  DealParams, CapitalCall, ProposalParams,
  HybridProposalState, PROPOSAL_PHASE, ASSET_CAPABILITY,
} from "@dac-cloud/core";
```

### Module helpers

```typescript
import { coreModule } from "@dac-cloud/core";

// Encode an evaluator config from JSON:
const data = coreModule.encodeMilestoneEvaluatorConfigFromJson({
  rewardShare: "1000000000000000000",
  milestones: [...],
});

// Snapshot.org ERC-1271 hash (matches DACDeal contract storage):
const hash = coreModule.computeSnapshotV1FinalHash(payload);
```

### Error decoding

```typescript
import { formatViemError } from "@dac-cloud/core";

try {
  await core.executeDacProposal({...});
} catch (err) {
  console.error(formatViemError(err));
  // → "DealIsNotApproved()" or "AllowanceExpired()" instead of raw selector
}
```

## Auth

`@dac-cloud/core` does not perform auth itself. When using the DAC Cloud backend proxy,
obtain a SIWE JWT and pass it via `fetchOptions.headers.authorization`. The CLI's
`packages/cli/src/auth/` module is a reference implementation.

## Notable Patterns

### `submitWrite` (internal)

All mutating client methods call `submitWrite`, which:

1. Estimates gas, then writes with `gas = estimate + estimate/2` (50% buffer for
   ERC20Votes checkpoint 63/64-rule attrition).
2. Waits for the receipt and throws if `status !== "success"`.

This means a returned tx hash is guaranteed to be a mined, successful transaction — no
need to check the receipt yourself.

### `*Detailed` variants

Methods like `createDealProposalDetailed`, `executeDealProposalDetailed` return
additional decoded event data on top of the base tx hash. Use them when you need
post-execution addresses (e.g. the deployed `dealCell` from a successful deal create).

## Build

```bash
npm install
npm run build
npm run typecheck
```

## Documentation

- [SDK Overview](../../docs/sdk/overview.md)
- [Core Client API](../../docs/sdk/core-client.md)
- [Transaction Builder](../../docs/sdk/transaction-builder.md)
- [Manifests](../../docs/sdk/manifests.md)
- [Indexer Client](../../docs/sdk/indexer-client.md)
