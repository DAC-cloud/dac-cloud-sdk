# DAC Cloud SDK Documentation

TypeScript SDK and CLI for the DAC Cloud protocol — EVM smart contracts for Decentralized Autonomous Corporations.

## Quick Links

| Section | Description |
|---------|-------------|
| [Getting Started](./getting-started.md) | Installation, configuration, first commands |
| **CLI Reference** | |
| [CLI Overview](./cli/overview.md) | Command structure, configuration, output format |
| [DAC Commands](./cli/dac-commands.md) | Create DACs, governance, treasury, tokens |
| [Deal Commands](./cli/deal-commands.md) | Deal lifecycle, staking, evaluation, claims |
| [Governance Guide](./cli/governance.md) | Propose / vote / execute flows |
| **SDK Reference** | |
| [SDK Overview](./sdk/overview.md) | Package architecture, installation |
| [Core Client API](./sdk/core-client.md) | `DacCoreClient` method reference |
| [Indexer Client API](./sdk/indexer-client.md) | GraphQL read-model client |
| **Guides** | |
| [Native DAC Lifecycle](./guides/native-dac.md) | End-to-end: create, govern, manage a native DAC |
| [Deal Lifecycle](./guides/deal-lifecycle.md) | Create deal, stake, evaluate, claim, recover |
| [Existing-Token DAC](./guides/existing-token-dac.md) | Wrap tokens, oracle governance, hybrid voting |

## Package Structure

```
packages/
  manifests/   @dac-cloud/manifests  Contract deployment manifest loaders
  core/        @dac-cloud/core       Viem-based contract client (ABIs, types, proposals)
  indexer/     @dac-cloud/indexer     GraphQL client for Envio indexer read-model
  cli/         @dac-cloud/cli        Commander.js CLI tool (bin: dac)
  qa/          @dac-cloud/qa         QA harness and E2E scenario tests
```

Dependencies flow: `cli -> core -> manifests`, `cli -> indexer`.

## Protocol Concepts

| Concept | Description |
|---------|-------------|
| **DACCell** | Micro-kernel contract: identity, proposal routing, metadata, treasury |
| **MainToken** | ERC20Votes governance token for the DAC |
| **AgentToken** | Non-transferable operator token staked into deals |
| **DealManager** | Deal lifecycle: creation, approval, evaluation, recovery |
| **DealCell** | Per-deal state: staking, whitelist, rewards, close/recovery |
| **GovernanceOracle** | Bridge for existing-token DACs: Merkle snapshot voting |
| **AssetController** | Treasury custody, capital calls, dividends |

### Two DAC Modes

- **Native DAC** — Fresh MainToken + AgentToken, straightforward governance
- **Existing-Token DAC** — Wraps an existing ERC20 with GovernanceOracle for hybrid voting
