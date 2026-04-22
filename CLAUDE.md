# DAC Cloud SDK

TypeScript monorepo: SDK and CLI for the DAC Cloud protocol (EVM smart contracts for Decentralized Autonomous Corporations).

## Build & Verify

```bash
npm run build        # Build all packages (tsup)
npm run typecheck    # Type-check all packages (tsc --noEmit)

# After changing GraphQL queries:
npm run codegen --workspace @dac-cloud/indexer
```

Always run `npm run typecheck` after making changes to verify correctness.

## Package Structure

```
packages/
  manifests/   @dac-cloud/manifests  — Contract deployment manifest loaders
  core/        @dac-cloud/core       — Viem-based contract client (ABIs, types, proposal builders, selectors)
  indexer/     @dac-cloud/indexer     — GraphQL client for Envio indexer read-model
  cli/         @dac-cloud/cli        — Commander.js CLI tool (bin: dac)
  qa/          @dac-cloud/qa         — E2E QA harness (21 scenarios, accounting invariants, agent reviewer)
```

Dependencies flow: `cli → core → manifests`, `cli → indexer`, `qa → cli`.

## Sources of Truth

- **Contract ABIs & interfaces**: `../dac-cloud-contracts/src/` (Foundry project)
- **Indexer GraphQL schema**: `../dac-cloud-indexer/schema.graphql`
- **Protocol documentation**: `../dac-cloud-contracts/docs/`
- **Version handoff docs**: `../dac-cloud-contracts/indexer-sdk-handoff-*.md`

When adapting to contract changes, always check the contract source and indexer schema for exact signatures and field names.

## Key Patterns

- **ABIs** in `core/src/abi.ts` use viem `parseAbi()` with string literals
- **Selectors** in `core/src/selectors.ts` use viem `toFunctionSelector()` from function signature strings
- **Proposal builders** in `core/src/proposals.ts` return `ProposalParams` (typ, target, i, data) using viem `encodeAbiParameters`
- **GraphQL queries** in `indexer/src/queries/*.graphql` — after editing, run codegen to regenerate types
- **CLI commands** use Commander.js; proposal types are data-driven from `DAC_PROPOSAL_TYPES` / `BASE_DEAL_PROPOSAL_TYPE_LIST` arrays
- **Module system** in `core/src/modules/` and `cli/src/modules/` — extensible deal kinds, evaluators, proposal types

## Local Development

- Chain: Hardhat local (chain ID 31337, RPC `http://127.0.0.1:8545`)
- Indexer: Envio at `http://localhost:8080/v1/graphql`
- Config: CLI reads from `./config.env` or `--config <path>` or env vars

## Protocol Concepts (Quick Reference)

- **DACCell**: Micro-kernel — identity, proposal routing, metadata
- **GovernanceSchema**: Native (ERC20Votes) or Hybrid (WrappedMainToken + GovernanceOracle)
- **AssetController**: Treasury custody, capital calls, dividends, agent distributor registry
- **DealManager**: Deal lifecycle, module validation, evaluator orchestration
- **MainToken/AgentToken**: Governance token + non-transferable operator token staked into Deals
- **Two modes**: Native DAC (fresh token) vs Existing-Token DAC (wrapped token + oracle)
