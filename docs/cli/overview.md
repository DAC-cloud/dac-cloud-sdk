# CLI Overview

The `dac` CLI is the primary tool for operating DACs and Deals from the command line.
Every command prints a single JSON object to stdout — bigints are serialized as decimal
strings — making it equally suitable for humans (`--pretty-print`) and for automation
(`jq`, scripts, AI agents).

## Command Tree

```
dac
├── auth
│   ├── login                       Auto-login using private key (SIWE)
│   ├── challenge --from <addr>     Request SIWE message for external signing
│   ├── verify --signature <hex>    Submit external signature
│   ├── status                      Show current session
│   └── logout                      Revoke session + clear local state
│
├── discover                        List DACs the wallet belongs to (cross-chain)
│
├── create                          Deploy a native DAC
├── create-existing-token           Deploy an existing-token DAC (wrapped)
│
├── balance <token> <holder>        Read ERC20 balance for any token
├── delegate                        Delegate MainToken votes
├── wrap | unwrap                   Wrap/unwrap underlying ↔ wrapped main token
│
├── propose <type> [args...]        Create a DAC governance proposal
├── vote proposal <id> <support>    Vote on a DAC proposal
├── execute <id>                    Execute a passed DAC proposal
│
├── proposal                        Hybrid governance phase transitions
│   ├── activate-primary <id>
│   ├── begin-warmup <id>
│   ├── trigger-fallback <id>
│   ├── activate-fallback <id>
│   ├── vote-merkle <id> <support> <index> <amount> <proof>
│   └── state <id>                  Read-only phase + deadlines
│
├── oracle                          Governance oracle management
│   ├── deploy <admin> [publisher]
│   ├── set-publisher <publisher> <allowed>
│   ├── publish <proposalId> <snapshotBlock> <merkleRoot> <totalVotingPower>
│   ├── deactivate
│   └── status
│
├── join                            Fulfill a capital call
├── recover-treasury                Recover treasury accounting for a token
├── deposit-treasury                Donate ERC20 to DAC treasury (transfer + recover)
├── claim-dividend <proofFile>      Claim Merkle-tree dividends
│
├── legal-message <messageFile>     Send legal-wrapper message via DACCell
│
├── view [resource] [id]            Query DAC indexer state
│
└── deal
    ├── create <dealFile>           Create a deal (DAC proposal)
    ├── invite <invitee>            Whitelist an agent
    ├── stake <amount>              Stake AgentTokens into a deal (pre-approval)
    ├── unstake                     Unstake from a closed deal
    ├── delegate                    Delegate StakedAgent voting power
    ├── request <amount>            Approve agent tokens for post-approval add-stake
    │
    ├── propose <type> [args...]    Create a deal governance proposal
    ├── vote proposal <id> <support>
    ├── execute <id>
    │
    ├── evaluate [evaluatorId]      Trigger milestone/revenue evaluation
    ├── claim [evaluatorId]         Claim agent's MainToken rewards
    ├── claim-reward-pool [evaluatorId]   Claim the deal's collective reward pool
    ├── link-capital-call <id>      Link a `core:dac-deal` to a child capital call
    │
    ├── agent-spend <token> <dest> <amount>      Spend from deal treasury (with prior approval)
    ├── recover-profits <token>     Sweep non-funding tokens to deal treasury
    ├── receive-permit2 <token> <source> <amount>   Pull funds via Permit2
    │
    ├── legal-message [dealNumericId] <messageFile>   Send legal-wrapper message via DealManager
    ├── withdraw <dealNumericId>    Force return capital after deadline
    │
    └── view [resource] [id]        Query deal indexer state
```

## Global Flags

Set at the root command, inherited by all subcommands:

| Flag | Default | Description |
|------|---------|-------------|
| `--config <path>` | `./config.env` | Path to `.env`-format config file |
| `--private-key <hex>` | **required** | Wallet private key (use for write commands) |
| `--chain-id <number>` | `84532` (Base Sepolia) | Target chain ID |
| `--api-url <url>` | `https://api.dac.cloud` | DAC Cloud backend URL |
| `--dry-run` | off | Output unsigned transaction data, don't broadcast |
| `--from <address>` | — | Sender address (required with `--dry-run` if no private key) |
| `--pretty-print` | off | Indent JSON output |

There is **no** `--rpc-url` or `--indexer-url` — both are derived from `--api-url` and
`--chain-id` (`${apiUrl}/rpc/${chainId}` and `${apiUrl}/graphql`). See
[Auth & Backend](./auth-and-backend.md).

## Config Resolution

Options are resolved in priority order:

1. **CLI flags** (highest priority)
2. **`--config <path>`** file (`.env` syntax)
3. **`./config.env`** in working directory
4. **Process environment** — `KEY=...` or `DAC_KEY=...` variants

Camel/dashed names are normalized. Both `PRIVATE_KEY` and `DAC_PRIVATE_KEY` work.
Common keys:

| CLI flag | Env variable |
|----------|--------------|
| `--private-key` | `PRIVATE_KEY` or `DAC_PRIVATE_KEY` |
| `--chain-id` | `CHAIN_ID` or `DAC_CHAIN_ID` |
| `--api-url` | `API_URL` or `DAC_API_URL` |
| `--cell-address` / `--dac` | `CELL_ADDRESS` or `DAC_CELL_ADDRESS` |
| (auth, internal) | `DAC_AUTH_TOKEN` / `DAC_AUTH_EXPIRES` |

## DAC Selector

Most DAC-scoped commands accept any of these to identify the target:

```
--dac <address>          (most common alias)
--dac-address <address>
--cell-address <address>
```

All three resolve the same `DACCell` address.

## Deal Selector

Deal commands accept a unified set of identifiers — pass **any one**:

```
--deal <address>         Deal contract OR cell address
--deal-address <address> Same as --deal
--deal-cell <address>    Deal cell address
--deal-id <id>           Indexer composite ID (e.g. "31337:0x...") or numeric ID
```

When `--deal-id` is a bare numeric ID (e.g. `1`), the CLI requires `--dac` for context
to disambiguate.

## Output Format

All commands print a **single JSON object** per invocation. Every response carries an
`action` field identifying the operation, plus operation-specific data:

```json
{"action":"dac.create","dac":"0x...","mainToken":"0x...","agentToken":"0x...","txHash":"0x..."}
```

`--pretty-print` adds indentation. Bigints are serialized as decimal strings (not numbers,
not JSON numbers with precision loss). Errors write to stderr and exit with non-zero.

## Help

```bash
dac --help              # top-level commands
dac auth --help         # auth subcommands
dac propose --help      # DAC proposal types
dac deal --help         # deal subcommands
dac deal propose --help # deal proposal types
dac oracle --help       # oracle subcommands
dac proposal --help     # hybrid governance subcommands
dac view --help         # view resources
```

Each command's help shows resolved option groups: which combinations are required (e.g.
`{mode: "allOf", options: ["name", "description", "treasury-token", ...]}` for `dac create`).

## Common Flags Per Command

| Flag | Available on |
|------|--------------|
| `--auto-delegate` | `create`, `create-existing-token`, `deal stake` |
| `--auto-approve` | `create-existing-token`, `join`, `wrap`, `deal stake`, `deposit-treasury` |
| `--input <jsonFile>` | `propose`, `deal propose` (for complex / multi-field types) |
| `--dac` | All deal commands needing AgentToken lookup; required with `propose add-stake --from-request` |
| `--governance-oracle` | `oracle set-publisher`, `oracle publish`, `oracle deactivate` |

## Common Patterns

### Governance — three steps

```bash
dac propose <type> [args...] --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>
```

Same shape for deal governance: `dac deal propose ...`, `dac deal vote proposal ...`,
`dac deal execute ...`. See [Governance](./governance.md) for execution-window pitfalls.

### Read state from indexer

```bash
dac view dac --dac 0x<dac>
dac view proposals --dac 0x<dac>
dac view deals --dac 0x<dac>
dac deal view deal --deal 0x<deal>
dac deal view positions --deal 0x<deal>
```

All `view` resources hit the backend GraphQL proxy. See command pages for the full list.

### Dry-run

```bash
dac create ... --dry-run --from 0x<sender>
```

Emits unsigned `TransactionRequest` objects (no broadcast). See
[Auth & Backend → Dry-Run](./auth-and-backend.md#dry-run-and-auth).

## Related

- [DAC Commands](./dac-commands.md)
- [Deal Commands](./deal-commands.md)
- [Auth & Backend](./auth-and-backend.md)
- [Governance Guide](./governance.md)
- [Getting Started](../getting-started.md)
