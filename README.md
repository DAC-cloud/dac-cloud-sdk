# DAC Cloud SDK

TypeScript SDK and CLI for the [DAC Cloud](https://dac.cloud) protocol — EVM smart contracts for **D**ecentralized **A**utonomous **C**orporations.

## Packages

| Package | Description |
|---------|-------------|
| `@dac-cloud/core` | Viem-based contract client — ABIs, types, proposal builders, signed transactions, unsigned tx builder |
| `@dac-cloud/indexer` | Typed GraphQL client for the Envio indexer read-model |
| `@dac-cloud/manifests` | Per-chain protocol manifest loader (deployed contract addresses) |
| `@dac-cloud/cli` | Commander.js CLI (`dac` binary) — JSON-first, automation/agent-friendly |
| `@dac-cloud/qa` | Internal E2E QA harness with 29 scenarios and AI reviewer (private, not published) |

## Quick Start

```bash
npm install
npm run build

# First-time auth (signs a SIWE message with your private key)
dac auth login --config ./config.env

# Deploy a native DAC
dac create \
  --name "My DAC" --description "Operations" --symbol "MDAC" \
  --treasury-token 0x4A679253410272dd5232B3Ff7cF5dbB88f295319 \
  --commitment 0 \
  --allocation 1000000000000000000000000 \
  --max-supply 10000000000000000000000000 \
  --default-quorum 50 \
  --auto-delegate \
  --config ./config.env --pretty-print
```

## Configuration

The CLI talks to a backend at `--api-url` (default `https://api.dac.cloud`). The backend
proxies:
- **RPC** at `${apiUrl}/rpc/${chainId}` — every read/write call routes through it
- **GraphQL** at `${apiUrl}/graphql` — read-model is exposed through the same auth boundary
- **Protocol manifest** at `${apiUrl}/manifest/${chainId}` — deployed contract addresses per chain

Every authenticated request carries a JWT `Authorization: Bearer <token>` header, obtained
via SIWE (`dac auth login`). The token is stored in `config.env` as `DAC_AUTH_TOKEN`/`DAC_AUTH_EXPIRES`
and mirrored to `~/.dac/auth/{chainId}-{wallet}.json` for cross-config reuse.

`config.env`:

```env
DAC_PRIVATE_KEY=0x...
DAC_CHAIN_ID=31337
DAC_API_URL=http://localhost:3500          # local backend; omit for production
# DAC_AUTH_TOKEN / DAC_AUTH_EXPIRES are written by `dac auth login`
```

## Documentation

Full docs live in [`docs/`](./docs/README.md):

- [Getting Started](./docs/getting-started.md) — install, configure, first auth + first DAC
- **CLI**: [Overview](./docs/cli/overview.md), [Auth & Backend](./docs/cli/auth-and-backend.md), [DAC commands](./docs/cli/dac-commands.md), [Deal commands](./docs/cli/deal-commands.md), [Governance](./docs/cli/governance.md)
- **SDK**: [Overview](./docs/sdk/overview.md), [Core client](./docs/sdk/core-client.md), [Indexer client](./docs/sdk/indexer-client.md), [Manifests](./docs/sdk/manifests.md), [Transaction builder](./docs/sdk/transaction-builder.md)
- **Guides**: [Native DAC](./docs/guides/native-dac.md), [Existing-token DAC](./docs/guides/existing-token-dac.md), [Deal lifecycle](./docs/guides/deal-lifecycle.md)

## Development

```bash
npm run build        # Build all packages
npm run typecheck    # Type-check all packages

# After changing GraphQL queries:
npm run codegen --workspace @dac-cloud/indexer

# Run QA scenarios (requires local Hardhat + Envio indexer + backend):
node ./packages/qa/dist/index.js --config ./config.env
```

## License

Apache-2.0 (see [LICENSE](./LICENSE) when added).
