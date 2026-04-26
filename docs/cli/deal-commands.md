# Deal Commands Reference

All commands below are prefixed with `dac deal`. Example: `dac deal create ./deal.json --dac 0x...`

## Deal Selector

Every deal command accepts a unified set of identifiers. Pass **any one** — the CLI resolves the correct internal address automatically:

```
--deal <address>         Deal contract or cell address
--deal-address <address> Same as --deal
--deal-cell <address>    Cell address directly
--deal-id <id>           Indexer ID or numeric ID (requires --dac)
```

## Deal Lifecycle

### `create <dealFile>`

Create a deal from a JSON configuration file. This creates a DAC governance proposal — the deal becomes active once approved.

```bash
dac deal create ./deal.json --dac 0x<dac> --config ./config.env --pretty-print
```

**Deal JSON format:**

```json
{
  "dealKind": "permit2-treasury",
  "name": "My Deal",
  "description": "Deal description",
  "linkHash": "seed://my-deal",
  "fundingToken": "0x<erc20>",
  "fundingAmount": "0",
  "rewardsLimit": "100000000000000000000000",
  "approveDeadline": "1735689600",
  "evaluationDeadline": "1736899200",
  "dealDeadline": "1738108800",
  "dealConfig": {},
  "evaluatorSelector": "milestones-evaluator",
  "evaluatorConfig": {
    "rewardShare": "1000000000000000000",
    "milestones": [{
      "milestoneType": 0,
      "token": "0x<erc20>",
      "expectedReturn": "1000000000000000000000",
      "timestamp": "1736294400",
      "rewardPercentage": "1000000000000000000",
      "rewardCurve": ["0"],
      "penaltyCurve": ["0", "1000000000000000000"]
    }]
  },
  "vetoEnabled": false,
  "agentsLimit": "0",
  "minimalStake": "0"
}
```

See [Deal Lifecycle Guide](../guides/deal-lifecycle.md) for a complete walkthrough.

### `invite <invitee>`

Invite an agent to the deal's whitelist. Deals are created with `whitelistOnly=true` — agents must be invited before they can stake.

```bash
dac deal invite 0x<agent> --deal 0x<deal> --config ./config.env
```

| Option | Description |
|--------|-------------|
| `--grant-invite-right` | Allow the invitee to invite others |

The deal proposer has invite rights by default. Must be called **before** deal approval (staking requires `!isApproved()`).

### `stake <amount>`

Stake AgentTokens into a deal. Must be done before the deal is approved.

```bash
dac deal stake 10000000000000000000000 \
  --deal 0x<deal> --dac 0x<dac> --auto-delegate --config ./config.env
```

### `unstake`

Unstake from a closed deal. Agent receives their AgentTokens back (minus any slashed amount).

```bash
dac deal unstake --deal 0x<deal> --config ./config.env
```

After a full slash (100%), all tokens are burned — unstake will revert with `NoStake()`. See [Deal Recovery](#deal-recovery).

### `request <amount>`

Request to stake in an active (already approved) deal. Creates an ERC20 approval that a staked agent can convert via `deal propose add-stake`.

```bash
dac deal request 5000000000000000000000 --deal 0x<deal> --dac 0x<dac>
```

Already-staked agents can also request to increase their stake — the position accumulates.

After the request, a staked agent must create an `add-stake` proposal:

```bash
# Using --from-request reads the approved amount from the on-chain allowance
dac deal propose add-stake 0x<agent> --from-request --dac 0x<dac> --deal 0x<deal>

# Or specify the amount explicitly
dac deal propose add-stake 0x<agent> 5000000000000000000000 --deal 0x<deal>
```

Note: `--dac` is **required** with `--from-request` to resolve the AgentToken address for allowance lookup.

## Deal Governance

Deals have their own governance — staked agents (holders of StakedAgent tokens) can propose, vote, and execute deal-level changes.

### `propose <proposalType> [args...]`

| Type | Args | Description |
|------|------|-------------|
| `update-voting-config` | `<quorum> <blocking> <highQuorum> <duration> <qualification> [execDuration]` | Update governance parameters |
| `toggle-whitelist` | `<true\|false>` | Enable/disable agent whitelist |
| `toggle-early-returns` | `<true\|false>` | Allow/disallow early capital returns |
| `enable-veto-right` | (none) | Enable DAC challenge capability |
| `request-tranche` | `<token> <amount> [rewards]` | Request funding tranche from DAC |
| `add-stake` | `<agent> <amount>` or `<agent> --from-request --dac <dac>` | Add pending stake from a request |
| `strike-out-agent` | `<agent>` | Force-remove an agent (stake released, not slashed) |

**Module deal proposal types** (core module — prefix `core:` optional):

| Type | Args | Description |
|------|------|-------------|
| `direct-spend` | `<token> <destination> <amount>` | Transfer tokens from deal treasury |
| `permit2-spend` | `<token> <destination> <amount>` | Transfer tokens via Permit2 |
| `return-capital` | `<token> <amount>` | Return capital to DAC treasury |
| `approve-agent-spend` | `<agent> <token> <amount>` | Approve an agent to spend deal funds |
| `assign-claimer` | `<agent> <evaluatorId>` | Assign a claimer role |
| `revoke-agent` | `<agent>` | Revoke an agent's spend rights |
| `delegate-vote-rights` | `<token> <delegatee>` | Delegate deal's voting power in child DAC |
| `child-create-proposal` | `<typ> <target> <i> <data>` | Create proposal in child DAC via deal |
| `child-vote-proposal` | `<proposalId> <support>` | Vote on child DAC proposal via deal |
| `child-return-profits` | `<token> <amount>` | Return profits from child DAC |
| `child-reinvest-profits` | `<token> <amount> <capitalCallHash>` | Reinvest profits into child DAC |

```bash
dac deal propose toggle-whitelist false --deal 0x<deal> --config ./config.env
dac deal propose core:direct-spend 0x<token> 0x<dest> 1000 --deal 0x<deal>
```

Note: `toggle-whitelist`, `toggle-early-returns`, and `update-voting-config` can be proposed **before** deal approval. All other types require the deal to be approved.

### `vote proposal <proposalId> <support>`

```bash
dac deal vote proposal 1 true --deal 0x<deal>
```

### `execute <proposalId>`

```bash
dac deal execute 1 --deal 0x<deal>
```

## Evaluation and Claims

### `evaluate [evaluatorId]`

Trigger milestone evaluation for a deal. Can be called by any staked agent, or by any MainToken holder after the deal deadline passes.

```bash
dac deal evaluate --deal-id 1 --dac 0x<dac> --config ./config.env
```

The evaluator checks each milestone's progress and produces actions:
- **Full progress** (>= 100%): Reward unlocked immediately (regardless of deadline)
- **Deadline passed, partial progress**: Penalty applied + optional extension
- **Deadline passed, extension configured**: Deadline extended (one-time, no penalty)

### `claim [evaluatorId]`

Claim unlocked MainToken rewards. Each staked agent claims their proportional share.

```bash
dac deal claim --deal 0x<deal> --config ./config.env
```

### `claim-reward-pool [evaluatorId]`

Claim the deal's collective reward pool allocation (set by `dealRewardPoolPercent` at deal creation). Called by a staked agent on behalf of the deal contract.

```bash
dac deal claim-reward-pool --deal 0x<deal> --config ./config.env
```

### `withdraw <dealNumericId>`

Force return capital from the deal to the DAC treasury. Does **not** close the deal.

```bash
dac deal withdraw 1 --dac 0x<dac> --config ./config.env
```

Requires either: deal deadline has passed, or all agents have unstaked (for closed deals before the deadline).

### `link-capital-call <capitalCallId>`

Link a DAC deal to an existing capital call in the child DAC. Must be called by a staked agent before deal approval.

```bash
dac deal link-capital-call 3 --deal 0x<deal> --config ./config.env
```

## Deal Recovery

After a full slash where all StakedAgent tokens are burned (`totalSupply=0`), the deal can be recovered via **DAC governance** (not deal governance):

```bash
# Appoint a liquidator with minted StakedAgent tokens
dac propose recover-deal <dealId> <liquidator> <liquidatorStake> --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>
```

The `liquidatorStake` must be > 0. StakedAgent tokens are minted directly to the liquidator — no AgentToken transfer needed. The liquidator can then use deal governance to manage remaining capital.

## Data Queries

### `view [resource] [id]`

| Resource | Description |
|----------|-------------|
| `deal` | Deal details (default) |
| `proposals` | List deal governance proposals |
| `proposal` | Single proposal by ID |
| `positions` | Agent staking positions (stake, slash, claim amounts) |
| `treasury-actions` | Treasury action history |

```bash
dac deal view deal --deal 0x<deal>
dac deal view positions --deal 0x<deal>
dac deal view proposals --deal 0x<deal>
```

## Related

- [DAC Commands](./dac-commands.md)
- [Deal Lifecycle Guide](../guides/deal-lifecycle.md)
- [Governance Guide](./governance.md)
