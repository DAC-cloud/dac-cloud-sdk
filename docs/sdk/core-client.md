# Core Client API

`DacCoreClient` is the signing client for DAC Cloud contracts — viem-based, returns
transaction hashes for writes, decoded data for `*Detailed` variants, plain values for
reads.

## Creating a Client

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
```

`fetchOptions` is forwarded to viem's HTTP transport — use it to inject the SIWE JWT
required by the backend proxy.

## The `submitWrite` Contract

All mutating methods route through an internal `submitWrite` helper that:

1. Calls `estimateContractGas`, then `writeContract` with `gas = estimate + estimate/2`
   (50% buffer). This buffer absorbs ERC20Votes checkpoint variance — the OpenZeppelin
   63/64-rule attrition during voting checkpoints can otherwise cause out-of-gas.
2. Waits for the receipt and **throws if `status !== "success"`** — viem's `writeContract`
   returns a hash even on revert, so this is the only way to guarantee success.

Therefore: a tx hash returned by any `DacCoreClient` method is the hash of a **mined,
successful** transaction. You don't need to manually check the receipt.

## Method Reference

The client exposes 45 methods grouped below.

### DAC Deployment

| Method | Description |
|--------|-------------|
| `deployDac({ config, salt? })` | Deploy a native DAC. Returns `DeployDacResult` (txHash, dacCell, mainToken, agentToken, dealManager, assetController) |
| `deployExistingTokenDac({ config, salt? })` | Deploy an existing-token DAC. Returns wrappedMainToken in addition to the above |
| `deployGovernanceOracle({ admin, publisher?, salt? })` | Deploy a GovernanceOracle |

### Token Operations

| Method | Description |
|--------|-------------|
| `wrapMainToken({ wrappedToken, amount })` | Wrap underlying tokens to WrappedMainToken |
| `wrapMainTokenTo({ wrappedToken, recipient, amount })` | Wrap to a specific recipient |
| `unwrapMainToken({ wrappedToken, amount })` | Unwrap back to underlying |
| `unwrapMainTokenTo({ wrappedToken, recipient, amount })` | Unwrap to a specific recipient |
| `delegateVotes({ token, delegatee })` | Delegate voting power for any ERC20Votes token |
| `approveErc20({ token, spender, amount })` | ERC20 approve |
| `transferErc20({ token, to, amount })` | ERC20 transfer |
| `getErc20Allowance({ token, owner, spender })` | Read allowance |
| `getErc20Balance({ token, owner })` | Read balance |

### DAC Governance

| Method | Description |
|--------|-------------|
| `createDacManagementProposal({ dacCell, params })` | Create DAC proposal. Returns `{txHash, proposalId, proposalAddress}` |
| `voteProposal({ proposalAddress, support })` | Vote on any proposal (DAC or deal) |
| `executeDacProposal({ dacCell, proposalId })` | Execute a passed DAC proposal |

```typescript
import { DAC_PROPOSAL_TYPE, buildMintAgentTokensProposal } from "@dac-cloud/core";

const params = buildMintAgentTokensProposal({
  amount: 100_000_000000000000000000n,
  recipient: "0x...",
});

const { proposalId } = await core.createDacManagementProposal({
  dacCell: "0x...",
  params,
});
```

### Hybrid Governance

For existing-token DACs with a GovernanceOracle.

| Method | Description |
|--------|-------------|
| `setGovernanceOraclePublisher({ oracle, publisher, allowed })` | Grant/revoke publisher role |
| `deactivateGovernanceOracle(oracle)` | Deactivate the oracle (admin/publisher) |
| `publishGovernanceOracleSnapshot({ oracle, proposalId, snapshotBlock, merkleRoot, totalVotingPower })` | Publish Merkle snapshot |
| `activateHybridPrimaryVoting(proposalAddress)` | Activate primary phase after snapshot |
| `beginHybridFallbackWarmup(proposalAddress)` | Begin fallback warmup after oracle missed |
| `triggerHybridEmergencyFallback(proposalAddress)` | Emergency fallback (oracle deactivated mid-flight) |
| `activateHybridFallbackVoting(proposalAddress)` | Activate fallback voting after warmup |
| `voteMerkle({ proposalAddress, support, index, amount, proof })` | Vote with Merkle proof |

### Deal Lifecycle

| Method | Description |
|--------|-------------|
| `createDealProposal({ dealManager, params })` | Create a deal (returns `{txHash, proposalId}`) |
| `createDealProposalDetailed({ dealManager, params })` | Same but also returns deal addresses post-execution |
| `inviteAgentToDeal({ dealCell, invitee, grantInviteRight? })` | Whitelist an agent (pre-approval) |
| `stakeAgentToDeal({ agentToken, dealCell, amount })` | Stake AgentTokens (pre-approval) |
| `unstakeFromDeal({ dealCell })` | Unstake from a closed deal |
| `claimMainToken({ dealCell, evaluatorId })` | Claim agent's MainToken rewards |
| `claimDealRewardPool({ dealCell, evaluatorId })` | Claim deal's collective reward pool |
| `evaluateDeal({ dealManager, dealId, evaluatorId })` | Trigger evaluation |
| `forceReturnCapital({ dealManager, dealId })` | Force-return capital after deadline |
| `setRootCapitalCallID({ dealAddress, capitalCallId })` | Link a `core:dac-deal` to child capital call |
| `recoverProfits({ dealAddress, token })` | Sweep non-funding tokens into deal accounting |

### Deal Governance

| Method | Description |
|--------|-------------|
| `createDealManagementProposal({ dealAddress, params })` | Create deal proposal (uses Deal contract, not DealCell) |
| `executeDealProposal({ dealAddress, proposalId })` | Execute a passed deal proposal |
| `executeDealProposalDetailed({ dealAddress, proposalId })` | Same + decoded event data |

### Treasury

| Method | Description |
|--------|-------------|
| `depositTreasury({ dacCell, token, amount })` | Transfer + recover treasury accounting |
| `recoverTreasury({ dacCell, token })` | Recover treasury accounting (no transfer) |
| `fulfillCapitalCall({ dacCell, call })` | Fulfill an open capital call |
| `claimDividend({ dacCell, proposalId, index, receiver, amount, proof })` | Permissionless dividend claim |

### Permit2 Treasury (deal-side)

| Method | Description |
|--------|-------------|
| `executeAgentSpend({ dealAddress, token, destination, amount })` | Execute pre-approved agent spend |
| `executeReceivePermit2({ dealAddress, token, source, amount })` | Pull funds via Permit2 (caller must hold `assign-claimer` role) |

### Legal Wrapper

| Method | Description |
|--------|-------------|
| `sendDacLegalWrapperMessage({ dacCell, kind, message })` | Send legal message via DACCell |
| `sendDealLegalWrapperMessage({ dealManager, dealId, kind, message })` | Send legal message via DealManager |

## Exposed Properties

- `core.walletClient` — viem `WalletClient` (for advanced/direct calls)
- `core.protocol` — the `ProtocolManifest` the client was initialized with

## Proposal Builders

`@dac-cloud/core` exports 30+ builder functions that produce `ProposalParams` ready for
`createDacManagementProposal` / `createDealManagementProposal`. Example categories:

**DAC-scoped:** `buildMintAgentTokensProposal`, `buildMintAgentTokensDistributorProposal`,
`buildDisableAgentDistributorProposal`, `buildRevokeAgentTokensProposal`,
`buildMintMainTokensReserveProposal`, `buildBurnMainTokensReserveProposal`,
`buildCapitalCallProposal`, `buildDelegateVoteRightsProposal`,
`buildUpdateDacVotingConfigProposal`, `buildUpdateGovernanceStrategyProposal`,
`buildUpdateDealCreationConfigProposal`, `buildUpdateGovernanceOracleProposal`,
`buildChallengeDealProposal`.

**Deal-scoped:** `buildUpdateDealVotingConfigProposal`, `buildStrikeOutAgentProposal`,
`buildEnableDealChallengeRightProposal`.

**Treasury / module:** `buildTreasuryDirectSpendProposal`,
`buildTreasuryPermit2SpendProposal`, `buildTreasuryReturnCapitalProposal`,
`buildTreasuryApproveAgentSpendProposal`, `buildTreasuryAssignClaimerProposal`,
`buildTreasuryRevokeAgentProposal`, `buildTreasuryDelegateVoteRightsProposal`.

**Child-DAC / Snapshot.org venue:** `buildChildDacCreateProposalProposal`,
`buildChildDacVoteProposalProposal`, `buildChildDacReturnProfitsProposal`,
`buildChildDacReinvestProfitsProposal`, `buildApproveVotingVenueVersionProposal`,
`buildExternalVoteSignProposal`, `buildSnapshotV1VoteSignProposal`,
`encodeSnapshotV1Payload`.

Each builder accepts strongly-typed args and returns:

```typescript
interface ProposalParams {
  typ: `0x${string}`;    // bytes4 selector
  target: `0x${string}`; // typed address target
  i: bigint;             // numeric parameter (e.g. amount)
  data: `0x${string}`;   // ABI-encoded payload
}
```

## Selectors

```typescript
import {
  DAC_PROPOSAL_TYPE,
  DEAL_PROPOSAL_TYPE,
  CORE_DEAL_KIND,
  CORE_EVALUATOR_KIND,
  CORE_DEAL_PROPOSAL_TYPE,
} from "@dac-cloud/core";

DAC_PROPOSAL_TYPE.MINT_AGENT_TOKENS;           // bytes4 selector
DEAL_PROPOSAL_TYPE.STRIKE_OUT_AGENT;
CORE_DEAL_KIND.PERMIT2_TREASURY;               // createPermit2TreasuryDeal selector
CORE_EVALUATOR_KIND.MILESTONES_EVALUATOR;
CORE_DEAL_PROPOSAL_TYPE.APPROVE_AGENT_SPEND;
```

All selectors are `0x<bytes4>` strings derived from `viem.toFunctionSelector(signature)`.

## Module Helpers (`coreModule` Namespace)

```typescript
import { coreModule } from "@dac-cloud/core";

// Parse/encode JSON evaluator configs:
const encoded = coreModule.encodeMilestoneEvaluatorConfigFromJson(jsonObject);

// Snapshot.org ERC-1271 hash mirror (matches DACDeal contract storage):
const hash = coreModule.computeSnapshotV1FinalHash(snapshotV1Payload);
```

Available encoders / parsers:
- `parseDacDealConfig`, `parseMilestoneEvaluatorConfig`, `parseRevenueEvaluatorConfig`
- `encodeDacDealConfigFromJson`, `encodePermit2TreasuryDealConfigFromJson`
- `encodeMilestoneEvaluatorConfigFromJson`, `encodeRevenueEvaluatorConfigFromJson`
- `buildMilestoneEvaluatorConfig`, `buildRevenueEvaluatorConfig`

Types: `DACDealConfig`, `TreasurySpendAllowance`, `Milestone`,
`MilestoneEvaluatorConfig`, `RevenueSchedule`, `RevenueEvaluatorConfig`,
`SnapshotV1Payload`.

## Errors

`formatViemError(error)` decodes custom-error selectors against the union of
`dacErrorSignatures`, `commonOZErrorSignatures`, and `commonErrorSignatures`. Use this
to convert opaque revert data into readable messages.

```typescript
import { formatViemError } from "@dac-cloud/core";

try {
  await core.executeDacProposal({ dacCell, proposalId: 1n });
} catch (err) {
  console.error(formatViemError(err));
  // → "DealIsNotApproved()" instead of "0x4f6b1b39..."
}
```

## Utilities

```typescript
import { randomSalt, referralUidToSalt, percentToScale } from "@dac-cloud/core";

const salt = referralUidToSalt("campaign-42");   // deterministic
const random = randomSalt();                      // CSPRNG bytes32
const fifty = percentToScale(50);                 // 500000000000000000n (50% as 1e18)
```

## Related

- [SDK Overview](./overview.md)
- [Indexer Client API](./indexer-client.md)
- [Transaction Builder](./transaction-builder.md) — unsigned-tx variant for multisig
- [Manifests](./manifests.md)
- [Deal Lifecycle Guide](../guides/deal-lifecycle.md)
