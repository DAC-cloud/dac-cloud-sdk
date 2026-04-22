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

Governance configuration (all use high quorum):

| Type | Args | Description |
|------|------|-------------|
| `update-voting-config` | `<quorum> <blocking> <highQuorum> <duration> <qualification> [execDuration]` | Update voting parameters |
| `update-governance-strategy` | `<quorum> <highQuorum> <blocking> <duration> <qual> <execDur> <oraclePubDeadline> <fallbackWarmup> <fallbackDur> <blockAll> <blockHigh> <oraclePrimary>` | Update full governance strategy (existing-token DACs) |
| `update-deal-creation-config` | `<minAgentBalance> <minInitialAgentStake>` | Set deal creation requirements |
| `update-governance-oracle` | `<oracleAddress>` | Change governance oracle address |
| `update-legal-wrapper` | See `--input` | Update legal wrapper reference |

Token management:

| Type | Args | Description |
|------|------|-------------|
| `mint-agent-tokens` | `<amount> <recipient>` | Mint AgentTokens directly to an agent |
| `mint-agent-tokens-distributor` | `<amount> <distributor>` | Mint AgentTokens into distributor inventory |
| `disable-agent-distributor` | `<distributor>` | Revoke a distributor's role |
| `revoke-agent-tokens` | `<amount> <agent>` | Revoke AgentTokens from an agent |
| `mint-main-tokens` | `<amount>` | Mint MainTokens into treasury reserve |
| `burn-main-tokens` | `<amount>` | Burn MainTokens from treasury reserve |

Dividends and treasury:

| Type | Args | Description |
|------|------|-------------|
| `toggle-dividends` | `<true\|false>` | Enable/disable dividend capability |
| `dividend-payout` | `<token> <amount> <merkleRoot>` | Distribute dividends via Merkle tree |
| `capital-call` | `<recipient> <treasuryToken> <tokenAmount> <cashAmount>` | Issue capital call |
| `delegate-from-balance` | `<token> <delegatee> <amount>` | Delegate voting power from treasury balance |
| `deposit-treasury` | See treasury section below | Deposit ERC20 tokens to treasury |

Offchain and legal:

| Type | Args | Description |
|------|------|-------------|
| `approve-offchain-action` | `<actionHash>` | Approve an off-chain governance action |

Module management:

| Type | Args | Description |
|------|------|-------------|
| `add-module` | `<moduleFactory>` | Add a module to the DAC |
| `remove-module` | `<moduleFactory>` | Remove a module |
| `add-evaluator` | `<dealId> <evaluatorModule> <evaluatorConfig>` | Add evaluator to an existing deal |

Deal operations (DAC-level):

| Type | Args | Description |
|------|------|-------------|
| `recover-deal` | `<dealId> <liquidator> <liquidatorStake>` | Assign liquidator to a closed/slashed deal |
| `deal-message` | `<dealId> <kind> <message>` | Send governance message to a deal |
| `challenge-deal` | `<dealId> <dealProposalId>` | Veto a deal governance proposal (requires vetoEnabled) |
| `cast-veto-deal` | `<dealId> <dealProposalId>` | Alias for challenge-deal |

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
| `dacs` | List all DACs on chain |
| `proposals` | List DAC proposals |
| `proposal` | Single proposal by ID |
| `deals` | List deals in this DAC |
| `capital-calls` | Capital call history |
| `treasury-holdings` | Token balances in DAC treasury |
| `treasury-movements` | Treasury deposit/withdrawal history |
| `treasury-delegations` | Voting power delegations from treasury |
| `governance-oracles` | Oracle state for existing-token DACs |
| `accounts` | Governance accounts |
| `account` | Single account details |
| `wrapper-actions` | Legal wrapper action history |

```bash
dac view dac --dac 0x<dac>
dac view proposals --dac 0x<dac>
dac view deals --dac 0x<dac>
```

## Related

- [Deal Commands](./deal-commands.md)
- [Governance Guide](./governance.md)
- [CLI Overview](./overview.md)
