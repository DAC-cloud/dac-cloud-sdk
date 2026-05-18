# Deal Commands Reference

All commands below are prefixed with `dac deal`. They operate on a single deal identified
via the **deal selector** (any one of `--deal`, `--deal-address`, `--deal-cell`, `--deal-id`).
Many commands also need a `--dac` for AgentToken / governance context — see notes below.

## Deal Selector

```
--deal <address>          Deal contract OR cell address
--deal-address <address>  Same as --deal
--deal-cell <address>     Deal cell address
--deal-id <id>            Composite ID ("31337:0x...") OR numeric ID (requires --dac)
```

> **DealCell vs Deal contract.** Some commands need the cell (stake/unstake/request),
> others need the deal contract (propose/vote/execute). The CLI resolves the correct
> address automatically — pass whichever you have.

## Deal Lifecycle

### `create <dealFile>`

Create a deal from a JSON config. This creates a **DAC governance proposal** — the deal
contract is deployed once the proposal passes and executes.

```bash
dac deal create ./deal.json --dac 0x<dac> --config ./config.env --pretty-print
```

**Deal JSON schema (`core:permit2-treasury`):**

```json
{
  "dealKind": "core:permit2-treasury",
  "name": "Ops Budget Q2",
  "description": "Q2 operations funding",
  "linkHash": "ipfs://...",
  "fundingToken": "0x<erc20>",
  "fundingAmount": "1000000000000000000000",
  "rewardsLimit": "500000000000000000000",
  "approveDeadline": "1735689600",
  "evaluationDeadline": "1736899200",
  "dealDeadline": "1738108800",
  "dealConfig": "0x",
  "evaluatorSelector": "core:milestones-evaluator",
  "evaluatorConfig": {
    "rewardShare": "1000000000000000000",
    "dealRewardPoolPercent": "300000000000000000",
    "milestones": [{
      "milestoneType": 0,
      "token": "0x<erc20>",
      "expectedReturn": "1000000000000000000000",
      "timestamp": "1736294400",
      "rewardPercentage": "500000000000000000",
      "rewardCurve": ["1000000000000000000"],
      "penaltyCurve": ["0", "1000000000000000000"],
      "extensionPeriod": 0
    }]
  },
  "vetoEnabled": false,
  "agentsLimit": "0",
  "minimalStake": "0"
}
```

| Field | Notes |
|-------|-------|
| `dealKind` | `core:permit2-treasury` or `core:dac-deal`. Aliases (`permit2-treasury`, `dac-deal`, `treasury-deal`) also accepted |
| `evaluatorSelector` | `core:milestones-evaluator` or `core:revenue-evaluator` |
| `evaluatorConfig` | Object form (parsed by core module) or pre-encoded `0x` hex |
| `rewardCurve` / `penaltyCurve` | Polynomials with 1e18 mantissa. `[1e18]` = constant 100%; `[0, 1e18]` = linear `y = x` |
| `rewardPercentage` | Per-milestone share, 1e18 = 100% |
| `dealRewardPoolPercent` | Fraction of rewards allocated to the deal's collective pool (1e18 = 100%) |
| `approveDeadline` | Defaults to `now + 7d` |
| `evaluationDeadline` | Defaults to `dealDeadline` |
| `dealDeadline` | Defaults to `now + 30d` |
| `vetoEnabled` | If false, DAC cannot `challenge-deal` later. Must be set at creation |
| `linkHash` | Off-chain reference; not interpreted by contracts |

For `core:dac-deal`, additional fields apply to the child-DAC investment vehicle —
see the [Existing-Token DAC Guide](../guides/existing-token-dac.md).

### `invite <invitee>`

Whitelist an agent for staking. Deals default to `whitelistOnly=true`. The proposer
holds initial invite rights; can be granted to others via `--grant-invite-right`.

```bash
dac deal invite 0x<agent>  --deal 0x<deal>
dac deal invite 0x<agent2> --deal 0x<deal> --grant-invite-right
```

**Must be called before deal approval** — staking requires `!isApproved()`.

### `stake <amount>`

Stake AgentTokens into a deal. **Pre-approval only.**

```bash
dac deal stake 10000000000000000000000 \
  --deal 0x<deal> --dac 0x<dac> --auto-delegate --auto-approve
```

| Flag | Purpose |
|------|---------|
| `--dac` | Required — needed to resolve the AgentToken address |
| `--auto-approve` | Approve AgentToken to DealCell |
| `--auto-delegate` | Delegate StakedAgent voting power to self (required for deal governance voting) |

After staking pre-approval is closed, agents can still join via `request` + `propose add-stake`
— see [Active Staking](../guides/deal-lifecycle.md#active-staking-post-approval).

### `unstake`

Unstake from a closed deal.

```bash
dac deal unstake --deal 0x<deal>
```

> **After a 100% slash all StakedAgent tokens are burned.** Unstake reverts with
> `NoStake()` — use [Deal Recovery](#deal-recovery) instead.

### `request <amount>`

Approve AgentTokens to the deal cell so a staked agent can convert via
`propose add-stake`. Works for both new agents and existing stakers (positions
accumulate).

```bash
dac deal request 5000000000000000000000 --deal 0x<deal> --dac 0x<dac>
```

Then a staked agent proposes:

```bash
# Sources the approved amount from the on-chain allowance
dac deal propose add-stake 0x<agent> --from-request --dac 0x<dac> --deal 0x<deal>

# Or specify the amount explicitly
dac deal propose add-stake 0x<agent> 5000000000000000000000 --deal 0x<deal>
```

`--dac` is **required** with `--from-request` to resolve the AgentToken address for the
allowance lookup.

### `delegate`

Delegate StakedAgent voting power inside a deal.

```bash
dac deal delegate --delegatee 0x<address> --deal 0x<deal>
```

## Deal Governance

### `propose <proposalType> [args...]`

Create a deal governance proposal — voted on by StakedAgent holders inside the deal.

#### Kernel proposal types

| Type | Args | Description |
|------|------|-------------|
| `update-voting-config` | `<quorum> <blocking> <highQuorum> <duration> <qualification> [execDuration]` | Deal voting parameters |
| `toggle-whitelist` | `<true\|false>` | Toggle whitelist-only mode (pre-approval) |
| `toggle-early-returns` | `<true\|false>` | Allow mid-deal capital returns to DAC |
| `enable-veto-right` | (none) | Grant the DAC the right to challenge deal proposals |
| `request-tranche` | `<token> <amount> [rewards]` | Request funding tranche from DAC treasury |
| `add-stake` | `<agent> <amount>` or `<agent> --from-request --dac <dac>` | Convert pending allowance into stake |
| `strike-out-agent` | `<agent>` | Force-remove an agent — stake **released** (not slashed). High quorum |

The first three (`update-voting-config`, `toggle-whitelist`, `toggle-early-returns`) can
be proposed **before** the deal is approved. All others require an approved deal.

#### Core-module proposal types

Invoke as `core:<type>` or bare `<type>` (the `core:` prefix is optional when unambiguous).

| Type | Args | Description |
|------|------|-------------|
| `direct-spend` | `<token> <destination> <amount>` | Transfer tokens from deal treasury |
| `permit2-spend` | `<token> <destination> <amount>` | Transfer via Permit2 |
| `return-capital` | `<token> <amount>` | Return capital to DAC treasury |
| `approve-agent-spend` | `<agent> <token> <amount>` (or `--input` for `singleTxAmount`/`clockLimit`/`duration`) | Pre-authorize an agent to spend deal funds |
| `assign-claimer` | `<agent> <evaluatorId>` | Assign a claimer role (e.g. for Permit2 receive) |
| `revoke-agent` | `<agent>` | Revoke an agent's spend rights |
| `delegate-vote-rights` | `<token> <delegatee>` | Delegate IVotes treasury holdings (requires IVotes-compatible token) |
| `child-create-proposal` | `<typ> <target> <i> <data>` | Create proposal in a child DAC (`core:dac-deal` only) |
| `child-vote-proposal` | `<proposalId> <support>` | Vote on a child-DAC proposal |
| `child-return-profits` | `<token> <amount>` | Return profits from child DAC investment |
| `child-reinvest-profits` | `<token> <amount> <capitalCallHash>` | Reinvest profits into child DAC |
| `approve-venue-version` | `<venueId> <version> <bool>` | Whitelist a Snapshot.org-style voting venue + version |
| `snapshot-vote-sign` | `--input <payload.json>` | Pre-approve a Snapshot.org Vote payload (DACDeal ERC-1271) |
| `external-vote-sign` | `--input` | Generic external vote signing |

For `request-tranche` on a `core:dac-deal`, you can pass the child capital call by
nonce or hash:

```bash
# By child capital-call nonce (which equals the child proposal ID)
dac deal propose request-tranche <nonce> [rewards] --deal 0x<deal>

# By hash
dac deal propose request-tranche [rewards] --deal 0x<deal> --capital-call-hash 0x<bytes32>

# By explicit nonce flag
dac deal propose request-tranche [rewards] --deal 0x<deal> --capital-call-nonce <n>
```

The CLI auto-resolves `target` (child capital call's treasury token), `i` (its
`cashAmount`), and `data` (`abi.encode(rewards, callHash)`).

### `vote proposal <proposalId> <support>`

```bash
dac deal vote proposal 1 true --deal 0x<deal>
```

> **Execute promptly after quorum.** Deal proposals auto-resolve when quorum is reached
> mid-vote (`Proposal._checkAndEmitResolution`). The execution validity window starts
> from the resolution timestamp, not the end of the voting period — for deals with
> 7-day voting and 1-day execution validity, don't `advanceTime(votingDuration)` before
> executing. See [Governance](./governance.md#execution-validity-window).

> **Vote smallest first when quorum is close.** Once quorum is met, subsequent votes
> are rejected. If multiple voters are participating, sort by voting power ascending.

### `execute <proposalId>`

```bash
dac deal execute 1 --deal 0x<deal>
```

## Evaluation and Claims

### `evaluate [evaluatorId]`

Trigger evaluation. Permissionless after deal deadline; any staked agent can call earlier.

```bash
dac deal evaluate --deal 0x<deal>
dac deal evaluate --deal 0x<deal> --evaluator-id 0
```

**Evaluator outcomes:**

| Progress | Deadline status | Action |
|----------|-----------------|--------|
| >= 100% | any | Reward unlocked immediately |
| < 100% with extension configured | passed | Deadline extended once, no penalty |
| < 100% no extension | passed | Penalty (slash) + partial reward per `rewardCurve` |
| 0% | passed | Full slash — all stake burned, deal auto-closes |

Multi-milestone deals evaluate each milestone independently in a single call. To
test sequential evaluation, give each milestone a different `expectedReturn` so
deposits can't satisfy them simultaneously.

### `claim [evaluatorId]`

Claim **your** unlocked MainToken rewards (proportional to your share of stake).

```bash
dac deal claim --deal 0x<deal>
```

> Note: `writeContract` returns a tx hash even on revert. For non-critical paths, verify
> success by re-reading position state via `dac deal view positions`.

### `claim-reward-pool [evaluatorId]`

Claim the deal's collective reward pool allocation (set by `dealRewardPoolPercent`).
Called by any staked agent on behalf of the deal contract.

```bash
dac deal claim-reward-pool --deal 0x<deal>
```

### `withdraw <dealNumericId>`

Force-return remaining funding capital from the deal cell to the DAC treasury. Does
**not** close the deal — and only moves the funding token, not stakes.

```bash
dac deal withdraw 1 --dac 0x<dac>
```

Preconditions (at least one):
- Deal deadline has passed, **OR**
- All agents have unstaked (for closed deals before the deadline)

### `link-capital-call <capitalCallId>`

For `core:dac-deal` only — link this deal to an existing capital call in the child DAC.
Must be called by a staked agent **before** deal approval.

```bash
dac deal link-capital-call 3 --deal 0x<deal>
```

## Treasury Operations

These execute pre-authorized treasury actions (set up via `propose approve-agent-spend`
or `propose assign-claimer` earlier).

### `agent-spend <token> <destination> <amount>`

```bash
dac deal agent-spend 0x<erc20> 0x<dest> 1000000000000000000000 --deal 0x<deal>
```

Requires a prior, still-valid `approve-agent-spend` proposal granting the caller spend
rights on `<token>` (respecting `totalAmount`, `singleTxAmount`, `clockLimit`, `duration`).

### `recover-profits <token>`

Sweep non-funding tokens that have accumulated in the deal cell back into the deal's
accounting (e.g. dividends earned by a `core:dac-deal`'s holdings).

```bash
dac deal recover-profits 0x<erc20> --deal 0x<deal>
```

### `receive-permit2 <token> <source> <amount>`

Pull funds via Permit2's two-layer approval. The caller must hold an `assign-claimer`
role; the source must have done the standard Permit2 two-step (`ERC20.approve(permit2)`
then `permit2.approve(token, dealCell, amount, expiration)`).

```bash
dac deal receive-permit2 0x<erc20> 0x<source> 1000000000000000000000 --deal 0x<deal>
```

> Set Permit2 expiration to `4294967295` (max uint32). Hardhat chain time can be far ahead
> of wall-clock; shorter expirations silently fail with `AllowanceExpired`.

## Legal Wrapper

### `legal-message [dealNumericId] <messageFile>`

Send a legal-wrapper message via `DealManager.legalWrapperMessage`. Caller must equal
the DAC's `legalWrapperAddress`.

```bash
dac deal legal-message 1 ./msg.json --dac-address 0x<dac>
# Or with deal selector:
dac deal legal-message ./msg.json --deal 0x<deal>
```

Message JSON format:

```json
{ "dealId": "1", "kind": "0x12345678", "message": "0x<hex>" }
```

`dealId` can be omitted if `--deal-id` / `--deal-address` is provided.

## Deal Recovery

After a full slash (`totalSupply=0` on StakedAgent), recover via DAC governance:

```bash
dac propose recover-deal <dealId> 0x<liquidator> <liquidatorStake> --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>
```

| Detail | Notes |
|--------|-------|
| `liquidatorStake` | Must be > 0 |
| AgentToken | **Not** required — StakedAgent is minted directly to the liquidator |
| Multiple liquidators | Issue separate `recover-deal` proposals |
| Original agents | Cannot unstake after recovery |
| Liquidator powers | Full deal governance (propose, vote, execute) |

## Indexer Queries — `dac deal view`

### `view [resource] [id]`

| Resource | Description |
|----------|-------------|
| `deal` (default) | Deal details: addresses, governance params, stake/reward/slash counters |
| `proposal <id>` | Single deal proposal by composite ID |
| `proposals` | List deal governance proposals (with challenge info) |
| `positions` | Per-agent staking positions (stake, slash, release, claim) |
| `treasury-actions` | Deal treasury action history |

```bash
dac deal view deal --deal 0x<deal>
dac deal view positions --deal 0x<deal>
dac deal view proposals --deal 0x<deal>
```

## Related

- [DAC Commands](./dac-commands.md)
- [Deal Lifecycle Guide](../guides/deal-lifecycle.md)
- [Governance Guide](./governance.md)
- [Auth & Backend](./auth-and-backend.md)
