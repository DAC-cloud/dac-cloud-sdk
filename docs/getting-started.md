# Getting Started

This guide walks you from a fresh checkout to a deployed DAC in about five minutes.

## Prerequisites

- Node.js 20+ and npm
- A wallet private key (for local dev, Anvil/Hardhat account #0 works out of the box)
- Access to a DAC Cloud backend — production is `https://api.dac.cloud`; for local dev see [Local Development](#local-development)

## Installation

```bash
git clone <repo-url>
cd dac-cloud-sdk
npm install
npm run build
```

Either run the CLI directly (`node packages/cli/dist/index.js`) or link it as a global binary:

```bash
npm link --workspace @dac-cloud/cli
dac --help
```

## Configuration

The CLI resolves options in priority order:

1. **CLI flags** — `--api-url https://api.dac.cloud`
2. **`--config <path>`** file (`.env` syntax) — `--config ./config.env`
3. **`./config.env`** in the current directory
4. **Process environment** — `DAC_API_URL=...` / `API_URL=...`

### Config file format

`config.env`:

```env
DAC_PRIVATE_KEY=0x<your-32-byte-hex-key>
DAC_CHAIN_ID=84532
DAC_API_URL=https://api.dac.cloud
# Auth fields are written automatically by `dac auth login`:
# DAC_AUTH_TOKEN=<jwt>
# DAC_AUTH_EXPIRES=<iso8601>
```

### Defaults

| Option | Default |
|--------|---------|
| `--chain-id` | `84532` (Base Sepolia) |
| `--api-url` | `https://api.dac.cloud` |
| `--private-key` | **required** — no default; supply via flag, config, or `DAC_PRIVATE_KEY` env var |

The CLI **does not** accept `--rpc-url` or `--indexer-url` directly; both are derived from
`--api-url` and `--chain-id`. The backend proxies RPC at `${apiUrl}/rpc/${chainId}` and
GraphQL at `${apiUrl}/graphql`. See [Auth & Backend](./cli/auth-and-backend.md).

## First Login

Every command needs a valid JWT. Get one with:

```bash
dac auth login --config ./config.env
```

This signs a SIWE message with your `DAC_PRIVATE_KEY`, exchanges it for a JWT, and writes
`DAC_AUTH_TOKEN`/`DAC_AUTH_EXPIRES` back into the config file. Subsequent commands pick
it up automatically.

For wallets where the private key is **not** available locally (hardware wallets, multisig,
external signers), use the challenge/verify flow — see [Auth & Backend](./cli/auth-and-backend.md).

## Deploy a Native DAC

```bash
dac create \
  --name "My DAC" \
  --description "An operations DAC" \
  --symbol "MDAC" \
  --max-supply 10000000000000000000000000 \
  --default-quorum 50 \
  --allocation 1000000000000000000000000 \
  --treasury-token 0x4A679253410272dd5232B3Ff7cF5dbB88f295319 \
  --commitment 0 \
  --auto-delegate \
  --config ./config.env \
  --pretty-print
```

What this deploys:
- **DACCell** (micro-kernel — proposal routing, identity)
- **MainToken** (ERC20Votes governance token)
- **AgentToken** (non-transferable operator token)
- **DealManager**, **AssetController**, **GovernanceSchema**

`--auto-delegate` delegates founder votes to self so you can propose immediately.

## Mint AgentTokens (Governance)

Agents need AgentTokens to stake into deals. Minting goes through governance:

```bash
dac propose mint-agent-tokens 100000000000000000000000 0x<agent> \
  --dac 0x<dac> --config ./config.env --pretty-print

dac vote proposal 1 true --dac 0x<dac> --config ./config.env
dac execute 1 --dac 0x<dac> --config ./config.env
```

> **Tip — Execution validity window.** A proposal auto-resolves the moment quorum is reached.
> The execution window is `[resolutionTime, resolutionTime + executionValidityDuration]`,
> not `[endTime, ...]`. For deal governance where voting duration may be 7 days but
> validity duration is 1 day, execute promptly after the deciding vote — see
> [Governance Guide](./cli/governance.md#execution-validity-window).

## View State

```bash
dac view dac --dac 0x<dac> --pretty-print
dac view proposals --dac 0x<dac>
dac view deals --dac 0x<dac>
```

`dac view` reads from the indexer (via the backend GraphQL proxy). All write commands
return JSON; you can pipe outputs with `--pretty-print` for human reading or omit it for
single-line JSON suitable for `jq` and automation.

## Output Format

All CLI commands print a single JSON object to stdout. Bigints are serialized as decimal
strings. Every response includes an `action` field identifying the operation:

```json
{
  "action": "dac.create",
  "dac": "0x...",
  "mainToken": "0x...",
  "agentToken": "0x...",
  "dealManager": "0x...",
  "assetController": "0x...",
  "txHash": "0x..."
}
```

## Dry-Run Mode

Preview transactions without broadcasting (useful for multisig batching, gas estimation,
or contract review):

```bash
dac create --name "Test" --description "Preview" --symbol "T" \
  --treasury-token 0x... --commitment 0 --allocation 1000000000000000000000000 \
  --dry-run --from 0x<sender-address> --pretty-print
```

Dry-run mode emits unsigned `TransactionRequest` data (to, data, value, chainId) suitable
for a Safe transaction builder or external signer. The CLI still needs a valid JWT — see
[Auth & Backend](./cli/auth-and-backend.md#dry-run-and-auth).

## Local Development

For local development you need:

| Component | Default endpoint | Source |
|-----------|------------------|--------|
| EVM chain | Hardhat / Anvil at port 8545 | [`dac-cloud-contracts`](#) `npm run node` |
| Envio indexer | `http://localhost:8080/v1/graphql` | [`dac-cloud-indexer`](#) `pnpm dev` |
| Backend | `http://localhost:3500` | [`dac-cloud-backend`](#) `npm run dev` |

Set `DAC_API_URL=http://localhost:3500` in `config.env`. The backend will proxy `/rpc/31337`
to your local Anvil and `/graphql` to your local Envio.

## Next Steps

- [CLI Overview](./cli/overview.md) — full command tree
- [Auth & Backend](./cli/auth-and-backend.md) — SIWE, challenge/verify, discover, dry-run
- [Native DAC Guide](./guides/native-dac.md) — end-to-end DAC walkthrough
- [Deal Lifecycle Guide](./guides/deal-lifecycle.md) — create and manage deals
- [SDK Overview](./sdk/overview.md) — programmatic access (Node/server-side)
