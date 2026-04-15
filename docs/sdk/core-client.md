# Core Client API

`DacCoreClient` is the main interface for interacting with DAC Cloud contracts via [viem](https://viem.sh).

## Creating a Client

```typescript
import { createDacCoreClient } from "@dac-cloud/core";

const core = createDacCoreClient({
  rpcUrl: "http://127.0.0.1:8545",
  chainId: 31337,
  privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
});
```

All write methods return a transaction hash (`Hex`). "Detailed" variants return additional decoded data from event logs.

## DAC Deployment

### `deployDac`

Deploy a native DAC with fresh governance and agent tokens.

```typescript
const result = await core.deployDac({
  config: {
    name: "My DAC",
    symbol: "MDAC",
    maxSupply: 10000000000000000000000000n,
    // ... full DACConfig
  },
  salt: "0x...",
});
// result: { txHash, dacCell, mainToken, agentToken, dealManager, assetController }
```

### `deployExistingTokenDac`

Deploy a DAC wrapping an existing ERC20 token.

### `deployGovernanceOracle`

Deploy a governance oracle for hybrid voting.

## Token Operations

| Method | Description |
|--------|-------------|
| `wrapMainToken({wrappedToken, amount})` | Wrap underlying tokens into MainToken |
| `wrapMainTokenTo({wrappedToken, recipient, amount})` | Wrap to a specific recipient |
| `unwrapMainToken({wrappedToken, amount})` | Unwrap MainToken back to underlying |
| `unwrapMainTokenTo({wrappedToken, recipient, amount})` | Unwrap to a specific recipient |
| `delegateVotes({token, delegatee})` | Delegate voting power for any ERC20Votes token |
| `approveErc20({token, spender, amount})` | Approve ERC20 allowance |
| `getErc20Allowance({token, owner, spender})` | Query ERC20 allowance (read-only) |

## DAC Governance

### `createDacManagementProposal`

Create a governance proposal at the DAC level.

```typescript
import { DAC_PROPOSAL_TYPE } from "@dac-cloud/core";

const result = await core.createDacManagementProposal({
  dacCell: "0x...",
  params: {
    typ: DAC_PROPOSAL_TYPE.MINT_AGENT_TOKENS,
    target: recipientAddress,
    i: encodedAmount,
    data: "0x",
  },
});
// result: { txHash, proposalId, proposalAddress }
```

### `voteProposal`

Vote on any proposal (DAC or deal level).

```typescript
await core.voteProposal({
  proposalAddress: "0x...",
  support: true,
});
```

### `executeDacProposal`

```typescript
await core.executeDacProposal({
  dacCell: "0x...",
  proposalId: 1n,
});
```

## Deal Operations

### `createDealProposal` / `createDealProposalDetailed`

Create a deal via DealManager. Returns deal addresses and IDs.

```typescript
const result = await core.createDealProposalDetailed({
  dealManager: "0x...",
  params: dealParams, // DealParams object
});
// result: { txHash, dealId, proposalId, dealCell, dealAddress, evaluatorAddress }
```

### `inviteAgentToDeal`

Whitelist an agent for staking. Caller must have invite rights.

```typescript
await core.inviteAgentToDeal({
  dealCell: "0x...",
  invitee: "0x...",
  grantInviteRight: false,
});
```

### `stakeAgentToDeal`

Stake AgentTokens into a deal. Must be called before deal approval.

```typescript
await core.stakeAgentToDeal({
  agentToken: "0x...",
  dealCell: "0x...",
  amount: 10000000000000000000000n,
});
```

### `unstakeFromDeal`

Unstake from a closed deal. Returns AgentTokens minus slashed amount.

```typescript
await core.unstakeFromDeal({ dealCell: "0x..." });
```

### `evaluateDeal`

Trigger milestone evaluation.

```typescript
await core.evaluateDeal({
  dealManager: "0x...",
  dealId: 1n,
  evaluatorId: 0n,
});
```

### `claimMainToken`

Claim unlocked MainToken rewards.

```typescript
await core.claimMainToken({
  dealCell: "0x...",
  evaluatorId: 0n,
});
```

### `forceReturnCapital`

Withdraw remaining capital after deal deadline.

```typescript
await core.forceReturnCapital({
  dealManager: "0x...",
  dealId: 1n,
});
```

## Deal Governance

### `createDealManagementProposal`

Create a deal-level governance proposal (requires StakedAgent tokens).

```typescript
const result = await core.createDealManagementProposal({
  dealAddress: "0x...", // Deal contract address (not cell!)
  params: proposalParams,
});
```

### `executeDealProposal` / `executeDealProposalDetailed`

Execute a passed deal proposal.

## Hybrid Governance

| Method | Description |
|--------|-------------|
| `setGovernanceOraclePublisher({oracle, publisher, allowed})` | Grant/revoke publisher role |
| `deactivateGovernanceOracle(oracle)` | Deactivate oracle |
| `publishGovernanceOracleSnapshot({oracle, proposalId, snapshotBlock, merkleRoot, totalVotingPower})` | Publish Merkle snapshot |
| `activateHybridPrimaryVoting(proposalAddress)` | Activate primary voting phase |
| `beginHybridFallbackWarmup(proposalAddress)` | Start fallback warmup |
| `triggerHybridEmergencyFallback(proposalAddress)` | Emergency fallback |
| `activateHybridFallbackVoting(proposalAddress)` | Activate fallback voting |
| `voteMerkle({proposalAddress, support, index, amount, proof})` | Vote with Merkle proof |

## Treasury

| Method | Description |
|--------|-------------|
| `fulfillCapitalCall({dacCell, call})` | Fulfill a capital call |
| `depositTreasury({dacCell, token, amount})` | Deposit to treasury |
| `recoverTreasury({dacCell, token})` | Recover treasury accounting |
| `claimDividend({dacCell, proposalId, index, receiver, amount, proof})` | Claim dividends |

## Related

- [SDK Overview](./overview.md)
- [Indexer Client API](./indexer-client.md)
- [Deal Lifecycle Guide](../guides/deal-lifecycle.md)
