# DAC Commands Reference

All commands below are prefixed with `dac`. Example: `dac create --name "My DAC" ...`

## DAC Deployment

### `create`

Deploy a native DAC with fresh MainToken and AgentToken.

```bash
dac create \
  --name "My DAC" \
  --description "Description" \
  --symbol "MDAC" \
  --max-supply 10000000000000000000000000 \
  --default-quorum 50 \
  --allocation 1000000000000000000000000 \
  --treasury-token 0x<erc20> \
  --commitment 0 \
  --auto-delegate \
  --config ./config.env
```

| Option | Required | Description |
|--------|----------|-------------|
| `--name` | Yes | DAC display name |
| `--symbol` | Yes | MainToken symbol |
| `--max-supply` | Yes | MainToken max supply (wei) |
| `--allocation` | Yes | Initial token allocation to creator (wei) |
| `--commitment` | Yes | Capital commitment amount (0 for none) |
| `--treasury-token` | Yes | Treasury ERC20 token address |
| `--description` | No | DAC description |
| `--default-quorum` | No | Default quorum percentage (0-100) |
| `--auto-delegate` | No | Auto-delegate votes to self after creation |

### `create-existing-token`

Deploy a DAC that wraps an existing ERC20 token with oracle-based hybrid governance.

```bash
dac create-existing-token \
  --name "Wrapped DAC" \
  --symbol "WDAC" \
  --underlying-token 0x<erc20> \
  --treasury-seed-amount 1000000000000000000000 \
  --governance-oracle 0x<oracle> \
  --auto-delegate --auto-approve \
  --config ./config.env
```

See [Existing-Token DAC Guide](../guides/existing-token-dac.md) for the full flow.

## Token Operations

### `delegate`

Delegate MainToken voting power.

```bash
dac delegate --delegatee 0x<address> --dac 0x<dac>
```

### `wrap` / `unwrap`

For existing-token DACs: convert between the underlying token and the wrapped MainToken.

```bash
dac wrap --amount 1000000000000000000000 --dac 0x<dac> --auto-approve
dac unwrap --amount 500000000000000000000 --dac 0x<dac>
```

## Governance

### `propose <proposalType> [args...]`

Create a DAC governance proposal. See [Governance Guide](./governance.md) for the full propose/vote/execute flow.

**DAC Proposal Types:**

| Type | Args | Description |
|------|------|-------------|
| `mint-agent-tokens` | `<amount> <recipient>` | Mint AgentTokens to an address |
| `set-metadata` | `<key> <value>` | Update DAC metadata |
| `dividend-payout` | `<token> <amount> <merkleRoot>` | Distribute dividends |
| `capital-call` | Complex | Issue capital call to members |
| `add-module` | `<moduleFactory>` | Add a module to the DAC |
| `remove-module` | `<moduleFactory>` | Remove a module |
| `recover-deal` | `<dealId> <liquidator> <liquidatorStake>` | Recover a closed/slashed deal |
| `deal-message` | `<dealId> <kind> <message>` | Send message to a deal |
| `challenge-deal` | `<dealId> <dealProposalId>` | Challenge a deal governance proposal |

### `vote proposal <proposalId> <support>`

Vote on a DAC proposal. `support` is `true` or `false`.

```bash
dac vote proposal 1 true --dac 0x<dac>
```

### `execute <proposalId>`

Execute a proposal that has passed quorum and voting period.

```bash
dac execute 1 --dac 0x<dac>
```

## Treasury

### `deposit-treasury`

Deposit ERC20 tokens into the DAC treasury.

```bash
dac deposit-treasury --token 0x<erc20> --amount 5000000000000000000000 --dac 0x<dac> --auto-approve
```

### `join`

Fulfill a capital call.

```bash
dac join --dac 0x<dac> --auto-approve
```

### `claim-dividend <proofFile>`

Claim dividends using a Merkle proof JSON file.

## Oracle Management

### `oracle deploy <admin> [publisher]`

Deploy a new GovernanceOracle contract.

### `oracle publish <proposalId> <snapshotBlock> <merkleRoot> <totalVotingPower>`

Publish a snapshot for hybrid governance voting.

### `oracle status`

Show current oracle state from indexer.

## Data Queries

### `view [resource] [id]`

Query DAC state from the indexer.

| Resource | Description |
|----------|-------------|
| `dac` | DAC details (default) |
| `proposals` | List DAC proposals |
| `proposal` | Single proposal by ID |
| `deals` | List deals in this DAC |
| `capital-call` | Capital call details |
| `accounts` | Governance accounts |

```bash
dac view dac --dac 0x<dac>
dac view proposals --dac 0x<dac>
dac view deals --dac 0x<dac>
```

## Related

- [Deal Commands](./deal-commands.md)
- [Governance Guide](./governance.md)
- [CLI Overview](./overview.md)
