# DAC Cloud SDK

TypeScript SDK and CLI for the [DAC Cloud](https://dac.cloud) protocol — EVM smart contracts for Decentralized Autonomous Corporations.

## Packages

| Package | Description |
|---------|-------------|
| `@dac-cloud/core` | Viem-based contract client — ABIs, types, proposal builders |
| `@dac-cloud/indexer` | GraphQL client for the Envio indexer read-model |
| `@dac-cloud/cli` | Commander.js CLI tool (`dac` binary) |
| `@dac-cloud/manifests` | Contract deployment manifest loaders |
| `@dac-cloud/qa` | QA harness with 25 E2E scenarios and AI reviewer |

## Quick Start

```bash
npm install
npm run build

# Run the CLI
npx dac --help
npx dac create --name "My DAC" --symbol "MDAC" \
  --max-supply 10000000000000000000000000 \
  --allocation 1000000000000000000000000 \
  --treasury-token 0x<token> \
  --commitment 0 --default-quorum 50 \
  --auto-delegate --config ./config.env --pretty-print
```

## Configuration

Create a `config.env`:

```env
DAC_PRIVATE_KEY=0x<key>
DAC_RPC_URL=http://127.0.0.1:8545
DAC_INDEXER_URL=http://127.0.0.1:8080/v1/graphql
DAC_CHAIN_ID=31337
```

## Documentation

Full documentation is in [`docs/`](./docs/README.md):

- [Getting Started](./docs/getting-started.md) — Installation, configuration, first commands
- [CLI Reference](./docs/cli/overview.md) — Command structure, [DAC commands](./docs/cli/dac-commands.md), [deal commands](./docs/cli/deal-commands.md)
- [Governance Guide](./docs/cli/governance.md) — Propose / vote / execute flows, hybrid governance, veto
- [SDK Reference](./docs/sdk/overview.md) — [Core client API](./docs/sdk/core-client.md), [indexer client](./docs/sdk/indexer-client.md)
- [Guides](./docs/guides/deal-lifecycle.md) — [Native DAC](./docs/guides/native-dac.md), [deal lifecycle](./docs/guides/deal-lifecycle.md), [existing-token DAC](./docs/guides/existing-token-dac.md)

## Development

```bash
npm run build        # Build all packages
npm run typecheck    # Type-check all packages

# After changing GraphQL queries:
npm run codegen --workspace @dac-cloud/indexer

# Run QA scenarios (requires local Hardhat + Envio indexer):
node ./packages/qa/dist/index.js --config ./config.env
```
