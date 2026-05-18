# DAC Commands Reference

All commands below are prefixed with `dac`. Examples assume you have an active session
(see [Auth & Backend](./auth-and-backend.md)) and a `config.env` file with
`DAC_PRIVATE_KEY` and `DAC_API_URL`.

## DAC Deployment

### `create`

Deploy a **native** DAC — fresh MainToken (ERC20Votes) and AgentToken.

```bash
dac create \
  --name "Acme DAC" \
  --description "Operations" \
  --symbol "ACME" \
  --max-supply 10000000000000000000000000 \
  --default-quorum 50 \
  --allocation 1000000000000000000000000 \
  --treasury-token 0x<erc20> \
  --commitment 0 \
  --auto-delegate \
  --config ./config.env --pretty-print
```

| Flag | Required | Description |
|------|----------|-------------|
| `--name` | yes | DAC display name |
| `--description` | yes | DAC description |
| `--treasury-token` | yes | Treasury ERC20 token address |
| `--commitment` | yes | Founder capital commitment to treasury (wei, 0 for none) |
| `--allocation` | yes | Initial MainToken allocation minted to founder (wei) |
| `--symbol` | no | MainToken symbol (default `DAC`, truncated to 8 chars) |
| `--max-supply` | no | MainToken `mainTokenMaxSupply` cap (wei) |
| `--default-quorum` | no | Default quorum percentage 0-100 |
| `--dividends-enabled` | no | Enable dividend capability flag |
| `--defer-birth-role` | no | Defer the founder's birth-role grant (advanced) |
| `--referral-uid` | no | Salt-derived referral attribution ID |
| `--auto-delegate` | no | Self-delegate MainToken voting power after creation |

### `create-existing-token`

Deploy an **existing-token** DAC — wraps an existing ERC20 (1:1) with `GovernanceOracle`
support for hybrid voting.

```bash
dac create-existing-token \
  --name "Wrapped DAC" --description "Operations" --symbol "WDAC" \
  --underlying-token 0x<erc20> \
  --treasury-seed-amount 1000000000000000000000 \
  --quorum-percent 50 \
  --blocking-percent 25 \
  --high-quorum-percent 75 \
  --voting-duration 3600 \
  --qualification 0 \
  --execution-validity-duration 86400 \
  --oracle-publish-deadline 600 \
  --fallback-warmup-duration 10 \
  --fallback-duration 3600 \
  --governance-oracle 0x<oracle> \
  --auto-delegate --auto-approve \
  --config ./config.env --pretty-print
```

Required: `--name --description --underlying-token --treasury-seed-amount`.

Hybrid strategy params: `--quorum-percent --blocking-percent --high-quorum-percent
--voting-duration --qualification --execution-validity-duration --oracle-publish-deadline
--fallback-warmup-duration --fallback-duration --blocking-on-all-proposals
--blocking-on-high-quorum --oracle-primary-enabled --governance-oracle`.

> **Existing-token quirks:**
> - Founder gets **no tokens** at creation — must `dac wrap --amount ...` to acquire voting power.
> - Treasury holds WrappedMainTokens, not underlying. Deals that need underlying funding require a separate `deposit-treasury` of the underlying token.
> - `mainTokenMaxSupply` is implicitly bounded by underlying supply — deals can't have `rewardsLimit > 0` because there's no minting headroom (reverts with `InsufficientRewards()`).

See [Existing-Token DAC Guide](../guides/existing-token-dac.md).

## Token Operations

### `delegate`

Delegate MainToken voting power.

```bash
dac delegate --delegatee 0x<address> --dac 0x<dac>
```

### `wrap` / `unwrap` (existing-token only)

```bash
dac wrap   --amount 1000000000000000000000 --dac 0x<dac> --auto-approve
dac unwrap --amount 500000000000000000000  --dac 0x<dac>
```

`--auto-approve` performs the prerequisite ERC20 approve on the underlying token before
wrapping. Without it you'll see `InsufficientAllowance`.

### `balance <token> <holder>`

Read any ERC20 balance — convenience wrapper for debugging.

```bash
dac balance 0x<erc20> 0x<holder>
```

## DAC Governance

### `propose <proposalType> [args...]`

Create a DAC governance proposal. Most types accept positional arguments **or**
`--input <jsonFile>` for complex payloads. See [Governance](./governance.md) for the
propose/vote/execute pattern, quorum auto-resolution, and the execution validity window.

#### Governance configuration (all high-quorum)

| Type | Args | Description |
|------|------|-------------|
| `update-voting-config` | `<quorum> <blocking> <highQuorum> <duration> <qualification> [execDuration]` | Native DAC voting parameters |
| `update-governance-strategy` | `--input` JSON | Full hybrid strategy (existing-token) — 12 fields |
| `update-deal-creation-config` | `<minAgentBalance> <minInitialAgentStake>` | Deal-creation gating |
| `update-governance-oracle` | `<oracleAddress>` | Swap governance oracle |
| `update-legal-wrapper` | `--input` JSON | Legal-wrapper contract + operating-agreement IPFS hash |

#### Token management

| Type | Args | Description |
|------|------|-------------|
| `mint-agent-tokens` | `<amount> <recipient>` | Mint AgentTokens directly to an agent |
| `mint-agent-tokens-distributor` | `<amount> <distributor>` | Mint into a distributor's inventory |
| `disable-agent-distributor` | `<distributor>` | Revoke a distributor role |
| `revoke-agent-tokens` | `<amount> <agent>` | Burn AgentTokens from an agent |
| `mint-main-tokens` | `<amount>` | Mint into treasury reserve (high quorum) |
| `burn-main-tokens` | `<amount>` | Burn from treasury reserve (high quorum) |

#### Treasury / dividends

| Type | Args | Description |
|------|------|-------------|
| `toggle-dividends` | `<true\|false>` | Toggle dividend capability |
| `dividend-payout` | `<token> <amount> <merkleRoot>` | Issue dividend Merkle tree |
| `capital-call` | `<recipient> <treasuryToken> <tokenAmount> <cashAmount>` | Issue capital call (nonce = proposalId) |
| `delegate-from-balance` | `<token> <delegatee> <amount>` | Delegate IVotes-compatible treasury holdings |

#### Offchain / governance hooks

| Type | Args | Description |
|------|------|-------------|
| `approve-offchain-action` | `<actionHash>` | Approve an off-chain governance action by hash |

#### Module management

| Type | Args | Description |
|------|------|-------------|
| `add-module` | `<moduleFactory>` | Attach a module factory to the DAC |
| `remove-module` | `<moduleFactory>` | Detach a module factory |
| `add-evaluator` | `<dealId> <evaluatorModule> <evaluatorConfig>` | Bolt an evaluator onto an existing deal |

#### Deal interaction (DAC-side)

| Type | Args | Description |
|------|------|-------------|
| `recover-deal` | `<dealId> <liquidator> <liquidatorStake>` | Mint StakedAgent to a liquidator for a fully-slashed deal |
| `deal-message` | `<dealId> <kind> <message>` | Send governance message to a deal |
| `challenge-deal` | `<dealId> <dealProposalId>` | Veto a deal proposal (deal must have `vetoEnabled`) |
| `cast-veto-deal` | (alias) | Alias of `challenge-deal` |

#### Raw proposal type

You can pass a raw `0x<bytes4>` selector with `--input <jsonFile>` to encode an arbitrary
proposal type. JSON keys: `target`, `i` (uint256, decimal), `data` (hex).

### `vote proposal <proposalId> <support>`

```bash
dac vote proposal 1 true --dac 0x<dac>
```

`support` is `true` / `false` / `1` / `0` / `yes` / `no`.

### `execute <proposalId>`

```bash
dac execute 1 --dac 0x<dac>
```

Execute a proposal that has passed quorum and is within the execution validity window
(`[resolutionTime, resolutionTime + executionValidityDuration]`).

> **Heads up.** If the proposal has expired, the CLI may exit with code 0 and empty
> output — verify state with `dac view proposal <id>` before assuming success.

## Hybrid Governance Phase Transitions

For existing-token DACs with a `GovernanceOracle`:

### `proposal activate-primary <id>`

After the oracle publishes a snapshot, activate the primary voting phase so unwrapped
holders can vote via Merkle proofs.

### `proposal begin-warmup <id>`

After `oraclePublishDeadline` passes without a snapshot, begin the fallback warmup.

### `proposal activate-fallback <id>`

After `fallbackWarmupDuration` elapses, activate the fallback voting phase. **Note:**
the first vote in fallback mode auto-attempts the phase transition, so you typically
don't need to call this explicitly if the warmup deadline has passed.

### `proposal trigger-fallback <id>`

Emergency fallback when the oracle is deactivated mid-flight.

### `proposal vote-merkle <id> <support> <index> <amount> <proof>`

Vote during primary phase using a Merkle proof from the oracle's published snapshot.
`<proof>` is a comma-separated list of hex hashes OR `@path/to/proof.json` referencing a
JSON file containing the proof array.

### `proposal state <id>`

Read-only — returns current phase, deadlines, vote tallies, and whether executable.

## Oracle Management

### `oracle deploy <admin> [publisher]`

Deploy a new `GovernanceOracle` via the factory. Returns the oracle address.

### `oracle set-publisher <publisher> <allowed>`

Grant or revoke publisher role. Requires `--governance-oracle <oracle>` or DAC selector
(if the oracle is configured on the DAC).

### `oracle publish <proposalId> <snapshotBlock> <merkleRoot> <totalVotingPower>`

Publish a snapshot for a specific proposal. `snapshotBlock` is typically
`createdBlockNumber - 1` (read from `indexer.proposals.snapshotReference`). `merkleRoot`
is a bytes32 hex.

### `oracle deactivate`

Admin/publisher action — deactivates the oracle. Active proposals fall back to emergency
fallback voting.

### `oracle status`

Read-only — shows oracle active state and publisher list from the indexer.

## Treasury

### `deposit-treasury`

Deposit ERC20 tokens into the DAC treasury (transfer + `recover-treasury` in one step).

```bash
dac deposit-treasury --token 0x<erc20> --amount 5000000000000000000000 \
  --dac 0x<dac> --auto-approve
```

`--auto-approve` runs the ERC20 approve to AssetController before the transfer.

### `recover-treasury`

Reconcile the treasury accounting for a token (no-op if balance and accounting agree).

```bash
dac recover-treasury --token 0x<erc20> --dac 0x<dac>
```

### `join`

Fulfill an open capital call. Most fields auto-resolve from the indexer; you can override:

```bash
dac join --dac 0x<dac> --auto-approve
# or explicit
dac join --dac 0x<dac> --recipient 0x... --treasury-token 0x... \
  --token-amount 1000... --cash-amount 0 --nonce 3 --auto-approve
```

### `claim-dividend <proofFile>`

Claim Merkle-tree dividends. The JSON file format:

```json
{
  "proposalId": "12",
  "index": "0",
  "receiver": "0x...",
  "amount": "1000000000000000000000",
  "proof": ["0x...", "0x..."]
}
```

`claimDividend` is **permissionless** — anyone can submit the proof, tokens go to
`receiver`. Useful for claiming on behalf of contracts that can't call themselves
(e.g., a parent DAC's deal — see [DAC investment scenario](../guides/existing-token-dac.md)).

## Legal Wrapper

### `legal-message <messageFile>`

Send a legal-wrapper message via the DACCell. The caller must equal the DAC's
`legalWrapperAddress` (granted via `update-legal-wrapper` governance proposal).

```bash
dac legal-message ./msg.json --dac 0x<dac>
```

Message JSON format:

```json
{ "kind": "0x12345678", "message": "0x<hex-payload>" }
```

`kind` is a bytes4 selector; `message` is opaque bytes interpreted off-chain.

## Indexer Queries — `dac view`

Read-only commands hitting the backend GraphQL proxy.

### `view [resource] [id]`

| Resource | Description |
|----------|-------------|
| `dac` (default) | DAC details, addresses, governance params, counters |
| `dacs` | List all DACs on this chain |
| `proposal <id>` | Single proposal by composite ID |
| `dac-proposal <id>` | DAC-specific proposal view (nested phase events, oracle snapshots, merkle votes, challenged deals) |
| `proposals` | List proposals for a DAC |
| `dac-proposals` | List `DacProposal` views for a DAC |
| `deals` | List deals in this DAC |
| `capital-calls` | Capital call history |
| `treasury-holdings` | Per-token treasury balances |
| `treasury-movements` | Treasury deposit/withdrawal history |
| `treasury-delegations` | Voting power delegations from treasury holdings |
| `governance-oracles` | Oracle state + publisher list |
| `wrapper-actions` | Wrap/unwrap activity log |
| `legal-wrapper-messages` | Legal-wrapper message log |
| `legal-wrapper-state` | Current legal-wrapper state (operatingAgreementIpfs, registeredAgent) |
| `account <address>` | Single account: holdings, agents, governance accounts, positions |

```bash
dac view dac --dac 0x<dac>
dac view proposals --dac 0x<dac> --query-limit 50
dac view account 0x<wallet>
```

Pagination: `--limit` / `--offset` (or `--query-limit` / `--query-offset`). Defaults to
25 items per page.

## Related

- [Deal Commands](./deal-commands.md)
- [Governance Guide](./governance.md)
- [Auth & Backend](./auth-and-backend.md)
- [Existing-Token DAC Guide](../guides/existing-token-dac.md)
