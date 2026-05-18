# DAC Cloud SDK Documentation

TypeScript SDK and CLI for the DAC Cloud protocol — EVM smart contracts for Decentralized Autonomous Corporations.

## Quick Links

| Section | Description |
|---------|-------------|
| [Getting Started](./getting-started.md) | Install, authenticate, deploy your first DAC |
| **CLI Reference** | |
| [CLI Overview](./cli/overview.md) | Command tree, config resolution, global flags |
| [Auth & Backend](./cli/auth-and-backend.md) | SIWE login, dry-run, backend proxy, discover |
| [DAC Commands](./cli/dac-commands.md) | Deploy, governance, treasury, hybrid voting, oracle |
| [Deal Commands](./cli/deal-commands.md) | Deal lifecycle, staking, evaluation, claims |
| [Governance Guide](./cli/governance.md) | Propose/vote/execute, validity windows, hybrid flows, veto |
| **SDK Reference** | |
| [SDK Overview](./sdk/overview.md) | Package structure, install, build |
| [Core Client API](./sdk/core-client.md) | `DacCoreClient` — full method reference (45 methods) |
| [Indexer Client API](./sdk/indexer-client.md) | GraphQL client — namespaces, entities, queries |
| [Manifests](./sdk/manifests.md) | Protocol manifest schema and loader |
| [Transaction Builder](./sdk/transaction-builder.md) | Unsigned-tx flows for multisig and external signers |
| **Guides** | |
| [Native DAC Lifecycle](./guides/native-dac.md) | End-to-end: create, govern, manage a native DAC |
| [Deal Lifecycle](./guides/deal-lifecycle.md) | Create, stake, evaluate, claim, recover |
| [Existing-Token DAC](./guides/existing-token-dac.md) | Wrap, oracle governance, hybrid voting |

## Package Structure

```
packages/
  manifests/   @dac-cloud/manifests  — Protocol manifest types + HTTP loader
  core/        @dac-cloud/core       — Viem-based contract client (ABIs, types, builders, tx-builder)
  indexer/     @dac-cloud/indexer     — Typed GraphQL client for the Envio read-model
  cli/         @dac-cloud/cli        — Commander.js CLI (`dac` binary)
  qa/          @dac-cloud/qa         — Private E2E QA harness (not published)
```

Dependency flow: `cli → core → manifests`, `cli → indexer`. The CLI also depends on `manifests` and `auth` modules under `cli/src/auth`.

## Protocol Concepts

| Concept | Description |
|---------|-------------|
| **DACCell** | Micro-kernel: identity, proposal routing, treasury custody, module registry |
| **MainToken** | ERC20Votes governance token (native DAC) — receives initial founder allocation |
| **WrappedMainToken** | ERC20Votes wrapper around an existing ERC20 (existing-token DAC) — 1:1 |
| **AgentToken** | Non-transferable operator token, minted via governance, staked into deals |
| **StakedAgent** | Non-transferable in-deal position token (voting power inside a deal) |
| **DealManager** | Deal lifecycle: create, approve, evaluate, recover |
| **DealCell** | Per-deal state: stake, whitelist, evaluator, rewards |
| **GovernanceOracle** | Bridge for existing-token DACs — publishes Merkle snapshots for primary voting |
| **AssetController** | Treasury custody, capital calls, dividends, agent distributors |
| **CoreModule** | Default deal-kind module — `permit2-treasury`, `dac-deal` selectors, treasury proposal types |
| **LegalWrapper** | Off-chain legal entity wrapper; carries operating agreement + message log |

### Two DAC Modes

- **Native DAC** (`dac create`) — Fresh MainToken/AgentToken pair, founder allocation upfront, straightforward governance with `defaultQuorum`/`mainTokenMaxSupply`.
- **Existing-Token DAC** (`dac create-existing-token`) — Wraps an existing ERC20 (1:1) and uses a GovernanceOracle for hybrid voting. Founder receives no tokens at creation; must `wrap` to gain voting power.

### Two Deal Kinds (Core Module)

- **`core:permit2-treasury`** — Treasury deal funded via Permit2; standard agent staking, claims, slashing.
- **`core:dac-deal`** — Cross-DAC investment vehicle that holds child-DAC tokens; supports child-DAC governance forwarding, Snapshot.org ERC-1271, dividends.

### Two Evaluators

- **`core:milestones-evaluator`** — Time-based + quantitative-progress milestones with reward and penalty curves.
- **`core:revenue-evaluator`** — Multi-cycle revenue distribution with tranche-based rewards.

Both are extensible — see [SDK Overview](./sdk/overview.md) for adding custom module factories and evaluator selectors.

## Backend Architecture

The CLI and SDK both talk to **the DAC Cloud backend** (default `https://api.dac.cloud`, override with `--api-url`). The backend:

1. **Proxies RPC** — `${apiUrl}/rpc/${chainId}` — applies auth, rate-limit, and routing to chain providers.
2. **Proxies GraphQL** — `${apiUrl}/graphql` — wraps the Envio indexer with the same auth boundary.
3. **Serves manifests** — `${apiUrl}/manifest/${chainId}` — deployed contract addresses per chain.
4. **Issues sessions** — SIWE-based auth at `/auth/{nonce,verify,me,logout}`, plus `/discover` for cross-chain wallet inventory.

All authenticated calls carry `Authorization: Bearer <JWT>`. See [Auth & Backend](./cli/auth-and-backend.md) for the full flow.
