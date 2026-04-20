# Getting Started

## Installation

```bash
git clone <repo-url>
cd dac-cloud-sdk
npm install
npm run build
```

The CLI is available as `npx dac` or via the `dac` binary after linking:

```bash
npm link --workspace @dac-cloud/cli
dac --help
```

## Configuration

The CLI resolves options in priority order:

1. **CLI flags** (highest) — `--rpc-url http://...`
2. **Config file** — `--config ./config.env` or `./config.env` in cwd
3. **Environment variables** (lowest) — `RPC_URL=http://...` or `DAC_RPC_URL=http://...`

### Config File Format

Create a `config.env` file:

```env
DAC_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
DAC_RPC_URL=http://127.0.0.1:8545
DAC_INDEXER_URL=http://127.0.0.1:8080/v1/graphql
DAC_CHAIN_ID=31337
```

### Defaults (Local Development)

| Option | Default |
|--------|---------|
| `--chain-id` | `31337` |
| `--rpc-url` | `http://127.0.0.1:8545` |
| `--indexer-url` | `http://127.0.0.1:8080/v1/graphql` |
| `--private-key` | Hardhat account #0 |

## Quick Start: Create a Native DAC

```bash
# 1. Create the DAC
dac create \
  --name "My DAC" \
  --description "A test DAC" \
  --symbol "MDAC" \
  --max-supply 10000000000000000000000000 \
  --default-quorum 50 \
  --allocation 1000000000000000000000000 \
  --treasury-token 0x4A679253410272dd5232B3Ff7cF5dbB88f295319 \
  --commitment 0 \
  --auto-delegate \
  --config ./config.env \
  --pretty-print

# 2. View the DAC
dac view dac --dac 0x<dac-address>

# 3. Propose minting agent tokens
dac propose mint-agent-tokens 100000000000000000000000 0x<recipient> \
  --dac 0x<dac-address> --config ./config.env --pretty-print

# 4. Vote and execute
dac vote proposal 1 true --dac 0x<dac-address> --config ./config.env --pretty-print
dac execute 1 --dac 0x<dac-address> --config ./config.env --pretty-print
```

## Output Format

All CLI commands output JSON. Use `--pretty-print` for formatted output.

Every response includes an `action` field identifying the operation:

```json
{
  "action": "dac.create",
  "dac": "0x...",
  "mainToken": "0x...",
  "agentToken": "0x...",
  "txHash": "0x..."
}
```

## Dry-Run Mode

Preview transactions without broadcasting:

```bash
dac create --name "Test" --symbol "T" ... --dry-run --from 0x<address>
```

Returns unsigned transaction data for multisig or manual submission.

## Next Steps

- [CLI Overview](./cli/overview.md) — Command structure and patterns
- [Native DAC Guide](./guides/native-dac.md) — Full DAC lifecycle walkthrough
- [Deal Lifecycle Guide](./guides/deal-lifecycle.md) — Create and manage deals
