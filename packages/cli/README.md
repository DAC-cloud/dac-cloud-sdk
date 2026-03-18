# `@dac-cloud/cli`

JSON-first CLI for operating DACs and Deals.

The CLI is designed for automation and AI-agent workflows first: every command prints one JSON line to stdout.

## Build and Run

From repo root:

```bash
npm install
npm run build -w @dac-cloud/cli
```

Run examples:

```bash
node packages/cli/dist/index.js --help
node packages/cli/dist/index.js create --help
node packages/cli/dist/index.js deal --help
```

## Command Layout

```bash
dac <subject?> <action> [args...] [--flags]
```

- No subject means DAC-level command (`dac create`, `dac propose`, ...).
- `deal` subject means deal-level command (`dac deal create`, `dac deal propose`, ...).

## Config and Params Resolution

CLI options are resolved in this order:

1. CLI flags
2. `--config <path>` file (`.env` syntax)
3. `./config.env`
4. process environment

Keys support both plain and `DAC_` prefixed variants.

- `rpc-url` -> `RPC_URL` or `DAC_RPC_URL`
- `private-key` -> `PRIVATE_KEY` or `DAC_PRIVATE_KEY`
- `cell-address` -> `CELL_ADDRESS` or `DAC_CELL_ADDRESS`

Both dashed and camelCase CLI option names are accepted internally.

### Default Values

If not provided by flags/config/env:

- `chain-id`: `31337`
- `rpc-url`: `http://127.0.0.1:8545`
- `indexer-url`: `http://127.0.0.1:8080/v1/graphql`
- `private-key`: anvil account #0
- `contracts-root`: `${DAC_CONTRACTS_ROOT}` or `../dac-cloud-contracts`

## Global Flags

Global (root) flags are infrastructure/runtime related:

- `--config <path>`
- `--private-key <hex>`
- `--chain-id <number>`
- `--rpc-url <url>`
- `--contracts-root <path>`
- `--indexer-url <url>`

Operation-specific flags are declared on each subcommand.
Use `dac <command> --help` to see full options and resolved requirement groups for that command.

All outputs are JSON; bigint values are serialized as decimal strings.

## DAC Commands

- `dac create`
- `dac delegate`
- `dac propose <proposalType> [args...]`
- `dac vote proposal <proposalId> <support>`
- `dac execute <proposalId>`
- `dac join`
- `dac recover-treasury`
- `dac deposit-treasury`
- `dac legal-message <messageFile>`
- `dac claim-dividend <proofFile>`
- `dac view [dac|proposal|proposals|deals|capital-calls] [id]`

### DAC Proposal Types

- `update-voting-config`
- `update-legal-wrapper`
- `approve-offchain-action`
- `mint-agent-tokens`
- `revoke-agent-tokens`
- `mint-main-tokens`
- `burn-main-tokens`
- `toggle-dividends`
- `dividend-payout`
- `delegate-from-balance`
- `capital-call`
- `add-module`
- `remove-module`
- `recover-deal`
- `deal-message`
- `cast-veto-deal`
- `add-evaluator`

## Deal Commands

- `dac deal create <dealFile>`
- `dac deal stake <amount>`
- `dac deal request <amount>`
- `dac deal unstake`
- `dac deal delegate`
- `dac deal propose <proposalType> [args...]`
- `dac deal vote proposal <proposalId> <support>`
- `dac deal execute <proposalId>`
- `dac deal evaluate [evaluatorId]`
- `dac deal claim [evaluatorId]`
- `dac deal legal-message [dealNumericId] <messageFile>`
- `dac deal withdraw <dealNumericId>`
- `dac deal view [deal|proposal|proposals|treasury-actions] [id]`

### Kernel Deal Proposal Types

- `update-voting-config`
- `toggle-whitelist`
- `toggle-early-returns`
- `enable-veto-right`
- `request-tranche`
- `add-stake`

### Module Deal Proposal Types (current core module)

- `core:direct-spend`
- `core:permit2-spend`
- `core:return-capital`
- `core:approve-agent-spend`
- `core:assign-claimer`
- `core:revoke-agent`
- `core:delegate-vote-rights`
- `core:child-create-proposal`
- `core:child-vote-proposal`
- `core:child-return-profits`
- `core:child-reinvest-profits`

Module prefix is optional when unambiguous.

## `--input` JSON Mode

Many complex operations support `--input <jsonFile>` instead of positional args.

Examples:

- `dac propose update-voting-config --input ./vote-config.json`
- `dac deal propose update-voting-config --input ./deal-vote-config.json`
- `dac deal propose core:approve-agent-spend --input ./approve-agent-spend.json`

## Deal Create JSON Schema (practical)

`dac deal create <dealFile>` expects:

```json
{
  "dealKind": "core:permit2-treasury",
  "name": "Treasury Deal",
  "description": "Ops budget",
  "linkHash": "ipfs://...",
  "fundingToken": "0x...",
  "fundingAmount": "1000000",
  "rewardsLimit": "500000000",
  "approveDeadline": "1710000000",
  "evaluationDeadline": "1710600000",
  "dealDeadline": "1711200000",
  "dealConfig": "0x",
  "evaluatorSelector": "core:milestones-evaluator",
  "evaluatorConfig": "0x"
}
```

Notes:

- `evaluationDeadline` defaults to `dealDeadline` if omitted.
- `dealDeadline` defaults to `now + 30 days` if omitted.
- `approveDeadline` defaults to `now + 7 days` if omitted.

## Stake Request Flow

`dac deal request <amount>` only performs ERC20 `approve` to the deal cell.

A staked agent must then create and pass:

```bash
dac deal propose add-stake <agent> <amount>
```

Or source pending allowance automatically:

```bash
dac deal propose add-stake <agent> --from-request
```

## Tranche Request Flow

### Generic deals

```bash
dac deal propose request-tranche <token> <amount> [rewards]
```

### DACDeal (capital-call linked)

```bash
# by child capital-call nonce
dac deal propose request-tranche <capitalCallNonce> [rewards]

# by child capital-call hash
dac deal propose request-tranche [rewards] --capital-call-hash <bytes32>

# by explicit nonce flag
dac deal propose request-tranche [rewards] --capital-call-nonce <uint256>
```

For DACDeal request-tranche, CLI sets:

- `target` from child capital call treasury token
- `i` from child capital call `cashAmount`
- `data = abi.encode(rewards, callHash)`

## Legal Message JSON Files

DAC-level:

```json
{
  "kind": "0x12345678",
  "message": "0x"
}
```

Deal-level (`dac deal legal-message`):

```json
{
  "dealId": "1",
  "kind": "0x12345678",
  "message": "0x"
}
```

`dealId` can be omitted if `--deal-id` / `--deal-address` is provided.

## Claim Dividend JSON

`dac claim-dividend <proofFile>` expects:

```json
{
  "proposalId": "12",
  "index": "0",
  "receiver": "0x...",
  "amount": "1000",
  "proof": [
    "0x...",
    "0x..."
  ]
}
```

## Helpful Patterns

Inspect available commands and help text:

```bash
dac --help
dac propose --help
dac deal --help
dac deal propose --help
```

Use time-advance flags for local anvil governance testing:

```bash
dac vote proposal <id> true --pre-vote-advance-seconds 1
dac execute <id> --advance-seconds 604801
```
