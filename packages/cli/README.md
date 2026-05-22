# `@dac-cloud/cli`

JSON-first CLI for operating DACs and Deals on the DAC Cloud protocol.

The CLI is designed for automation and AI-agent workflows first: every command prints
one JSON object to stdout. Bigints are serialized as decimal strings.

Binary: `dac`. Built on Commander.js. Talks to a **DAC Cloud backend** that proxies
RPC, GraphQL, and serves protocol manifests — see
[Auth & Backend](../../docs/cli/auth-and-backend.md).

## Build and Run

From repo root:

```bash
npm install
npm run build -w @dac-cloud/cli
```

Then either:

```bash
node packages/cli/dist/index.js --help
# or link as a global binary:
npm link --workspace @dac-cloud/cli
dac --help
```

## Quick Start

```bash
# First-time authentication (signs a SIWE message with --private-key)
dac auth login --config ./config.env

# Deploy a native DAC
dac create --name "My DAC" --description "Ops" --symbol "MDAC" \
  --treasury-token 0x... --commitment 0 --allocation 1000000000000000000000000 \
  --auto-delegate --config ./config.env --pretty-print

# View it
dac view dac --dac 0x<dac> --pretty-print
```

## Configuration

Resolution order:

1. CLI flags
2. `--config <path>` file
3. `./config.env`
4. Process environment (`KEY=` or `DAC_KEY=` variants both work)

```env
DAC_PRIVATE_KEY=0x<your-32-byte-hex-key>
DAC_CHAIN_ID=84532
DAC_API_URL=https://api.dac.cloud
# Auth fields are written automatically by `dac auth login`:
# DAC_AUTH_TOKEN=<jwt>
# DAC_AUTH_EXPIRES=<iso8601>
```

### Defaults

- `--chain-id`: `84532` (Base Sepolia)
- `--api-url`: `https://api.dac.cloud`
- `--private-key`: **required** — no default; supply via flag, config, or `DAC_PRIVATE_KEY` env var

The CLI does **not** accept `--rpc-url` or `--indexer-url`; both are derived from
`--api-url` and `--chain-id` (`${apiUrl}/rpc/${chainId}` and `${apiUrl}/graphql`).

## Global Flags

| Flag | Purpose |
|------|---------|
| `--config <path>` | Path to `.env` config |
| `--private-key <hex>` | Wallet private key |
| `--chain-id <number>` | Target chain |
| `--api-url <url>` | Backend URL |
| `--dry-run` | Emit unsigned tx, don't broadcast |
| `--from <address>` | Sender (required for dry-run without private key) |
| `--pretty-print` | Format JSON output |

## Command Tree

```
dac
├── auth {login, challenge, verify, status, logout}
├── discover
├── create | create-existing-token
├── balance <token> <holder>
├── delegate | wrap | unwrap
├── propose <type> | vote proposal | execute
├── proposal {activate-primary, begin-warmup, trigger-fallback, activate-fallback,
│              vote-merkle, state}
├── oracle {deploy, set-publisher, publish, deactivate, status}
├── join | recover-treasury | deposit-treasury | claim-dividend
├── legal-message
├── view [resource] [id]
└── deal
    ├── create | invite | stake | unstake | delegate | request
    ├── propose | vote proposal | execute
    ├── evaluate | claim | claim-reward-pool
    ├── link-capital-call | agent-spend | recover-profits | receive-permit2
    ├── legal-message | withdraw
    └── view [resource] [id]
```

## Authentication

The CLI requires a SIWE-issued JWT for every command. `dac auth login` signs the
challenge with `--private-key` and writes the token into `config.env`. For wallets
where the key isn't local (hardware wallets, multisig), use the two-step
challenge / verify flow. See [Auth & Backend](../../docs/cli/auth-and-backend.md).

```bash
dac auth login                              # private-key sign
dac auth challenge --from 0x<wallet>        # request SIWE message
dac auth verify --signature 0x<sig> --from 0x<wallet>
dac auth status                             # current session
dac auth logout                             # revoke + clear local state

dac discover                                # list DACs the wallet belongs to
```

## DAC Proposal Types

- Governance config: `update-voting-config`, `update-governance-strategy`,
  `update-deal-creation-config`, `update-governance-oracle`, `update-legal-wrapper`
- Tokens: `mint-agent-tokens`, `mint-agent-tokens-distributor`,
  `disable-agent-distributor`, `revoke-agent-tokens`, `mint-main-tokens`,
  `burn-main-tokens`
- Treasury / dividends: `toggle-dividends`, `dividend-payout`, `capital-call`,
  `delegate-from-balance`
- Modules: `add-module`, `remove-module`, `add-evaluator`
- Deals: `recover-deal`, `deal-message`, `challenge-deal` (alias `cast-veto-deal`)
- Offchain: `approve-offchain-action`
- Raw: `0x<bytes4>` selector via `--input` JSON

## Deal Proposal Types

**Kernel**: `update-voting-config`, `toggle-whitelist`, `toggle-early-returns`,
`enable-veto-right`, `request-tranche`, `add-stake`, `strike-out-agent`.

**Core module** (`core:` prefix optional):
`direct-spend`, `permit2-spend`, `return-capital`, `approve-agent-spend`,
`assign-claimer`, `revoke-agent`, `delegate-vote-rights`, `child-create-proposal`,
`child-vote-proposal`, `child-return-profits`, `child-reinvest-profits`,
`approve-venue-version`, `snapshot-vote-sign`, `external-vote-sign`.

## Deal Kinds (Core Module)

- `core:permit2-treasury` (aliases: `permit2-treasury`, `treasury-deal`)
- `core:dac-deal` (alias: `dac-deal`)

## Evaluator Kinds

- `core:milestones-evaluator`
- `core:revenue-evaluator`

## `--input` JSON Files

Complex proposals accept a JSON file via `--input <path>`. The flag is a **file path**,
not inline JSON.

Files also accepted by: `legal-message`, `claim-dividend`, `deal create`,
`deal legal-message`, `deal propose snapshot-vote-sign`, `deal propose
approve-agent-spend`, etc.

### Deal create JSON

```json
{
  "dealKind": "core:permit2-treasury",
  "name": "Q2 Ops",
  "description": "Operations budget",
  "linkHash": "ipfs://...",
  "fundingToken": "0x...",
  "fundingAmount": "1000000",
  "rewardsLimit": "500000000",
  "approveDeadline": "1710000000",
  "evaluationDeadline": "1710600000",
  "dealDeadline": "1711200000",
  "dealConfig": "0x",
  "evaluatorSelector": "core:milestones-evaluator",
  "evaluatorConfig": "0x",
  "vetoEnabled": false,
  "agentsLimit": "0",
  "minimalStake": "0"
}
```

Deadline defaults: `evaluationDeadline` → `dealDeadline`; `dealDeadline` → `now + 30d`;
`approveDeadline` → `now + 7d`.

### Legal message JSON

DAC-level (`dac legal-message`):

```json
{ "kind": "0x12345678", "message": "0x..." }
```

Deal-level (`dac deal legal-message`):

```json
{ "dealId": "1", "kind": "0x12345678", "message": "0x..." }
```

`dealId` can be omitted if `--deal-id` / `--deal-address` is provided.

### Claim dividend JSON

```json
{
  "proposalId": "12",
  "index": "0",
  "receiver": "0x...",
  "amount": "1000000000000000000000",
  "proof": ["0x...", "0x..."]
}
```

## Tranche Request Flow (DACDeal)

```bash
# By child capital-call nonce (= the proposal ID that created the call)
dac deal propose request-tranche <nonce> [rewards] --deal 0x<deal>

# By callHash
dac deal propose request-tranche [rewards] --deal 0x<deal> --capital-call-hash <bytes32>

# By explicit nonce flag
dac deal propose request-tranche [rewards] --deal 0x<deal> --capital-call-nonce <n>
```

For `core:dac-deal` request-tranche, the CLI sets `target` from the child capital
call's treasury token, `i` from `cashAmount`, and `data = abi.encode(rewards, callHash)`.

## Helpful Patterns

```bash
dac --help                  # top-level
dac auth --help
dac propose --help
dac deal --help
dac deal propose --help
dac oracle --help
dac proposal --help         # hybrid governance phases
dac view --help
```

## Full Documentation

Detailed docs in [`docs/`](../../docs/README.md):

- [CLI Overview](../../docs/cli/overview.md)
- [Auth & Backend](../../docs/cli/auth-and-backend.md)
- [DAC Commands](../../docs/cli/dac-commands.md)
- [Deal Commands](../../docs/cli/deal-commands.md)
- [Governance Guide](../../docs/cli/governance.md)
- [Native DAC Guide](../../docs/guides/native-dac.md)
- [Existing-Token DAC Guide](../../docs/guides/existing-token-dac.md)
- [Deal Lifecycle Guide](../../docs/guides/deal-lifecycle.md)
