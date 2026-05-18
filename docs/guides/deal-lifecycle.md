# Guide: Deal Lifecycle

Walkthrough of a deal from creation through evaluation, claims, and recovery — covering
the practical gotchas mined from the QA harness.

```
Create  →  Invite + Stake  →  Approve  →  (Optionally) Active Staking  →  Evaluate  →  Claim / Unstake
                                                                              │
                                                                        (if slashed)
                                                                              ↓
                                                                          Recover
```

## 1. Prepare a Deal JSON

```json
{
  "dealKind": "core:permit2-treasury",
  "name": "Q2 Operations",
  "description": "Operational budget",
  "linkHash": "ipfs://Qm...",
  "fundingToken": "0x<usdc>",
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
      "token": "0x<usdc>",
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

Key encoding rules:

- **Percentages use 1e18 mantissa**: `300000000000000000` = 30%.
- **`rewardCurve`** is a polynomial: `[1e18]` is the constant 100% (always full reward
  regardless of progress); `[0, 1e18]` is linear `y = x` (50% reward at 50% progress).
- **`penaltyCurve`** likewise. `[0, 1e18]` means slash scales linearly with shortfall.
- **`rewardsLimit`** — maximum reward payout (in MainToken or WrappedMainToken). Both
  DAC modes support `> 0`, with different funding mechanics:
  - **Native DAC**: capacity is checked against `mainTokenMaxSupply` headroom. At claim,
    `mainToken.mint(agent, amount)` mints fresh tokens. No upfront treasury funding needed.
  - **Existing-Token DAC**: capacity is checked against `_freeBalance(WrappedMainToken)` in
    the AssetController. At approval, `rewardsLimit` of WMT is moved from free →
    `committedBalances`. At claim, `safeTransfer(agent, amount)` transfers pre-existing
    WMT from the controller. **You must pre-fund the treasury** with WMT (via
    `--treasury-seed-amount` at creation or `dac deposit-treasury --token <WMT>` later)
    so `_freeBalance(WMT) >= rewardsLimit` at approval time — otherwise approval reverts
    with `InsufficientRewards()`.
- **`vetoEnabled`** must be set at creation — can't be added later (except via
  `enable-veto-right` deal proposal, which requires deal approval).
- **`extensionPeriod`** > 0 lets the milestone deadline extend once if progress < 100%
  (no penalty applied for that cycle).

## 2. Create the Deal

```bash
dac deal create ./deal.json --dac 0x<dac> --config ./config.env --pretty-print
```

This creates a **DAC governance proposal** — the deal contract is deployed when the
proposal executes. The response includes the proposed `dealCell` and `dealAddress`.

## 3. Invite Agents (Whitelist)

Deals are `whitelistOnly=true` by default. **Invites must be issued before deal
approval** because staking requires `!isApproved()`.

```bash
# Founder invites agent1
dac deal invite 0x<agent1> --deal 0x<deal>

# Grant invite-right (transitive whitelisting)
dac deal invite 0x<agent2> --deal 0x<deal> --grant-invite-right
```

## 4. Stake (Pre-Approval)

```bash
# Founder stakes
dac deal stake 10000000000000000000000 \
  --deal 0x<deal> --dac 0x<dac> --auto-delegate --auto-approve

# Agent1 stakes using their own key
dac deal stake 5000000000000000000000 \
  --deal 0x<deal> --dac 0x<dac> --auto-delegate --auto-approve \
  --private-key 0x<agent1-key>
```

`--dac` is **required** so the CLI can resolve the AgentToken address.
`--auto-approve` runs ERC20 approve. `--auto-delegate` self-delegates StakedAgent
voting power (required to vote in deal governance).

## 5. Approve the Deal

The deal-create proposal still needs to pass:

```bash
dac vote proposal <proposalId> true --dac 0x<dac>
dac execute <proposalId> --dac 0x<dac>
```

After execution the deal is `active=true`. Pre-approval staking and invites are closed.

## 6. Active Staking (Post-Approval)

After approval, new agents join via the **stake request** flow — deal-governance gates
the addition.

```bash
# 1. New agent approves AgentTokens to the deal cell
dac deal request 5000000000000000000000 --deal 0x<deal> --dac 0x<dac> \
  --private-key 0x<new-agent-key>

# 2. An existing staked agent proposes add-stake
dac deal propose add-stake 0x<new-agent> --from-request --dac 0x<dac> --deal 0x<deal>

# 3. Staked agents vote (cast smallest-first to avoid quorum-cutoff)
dac deal vote proposal <proposalId> true --deal 0x<deal>
dac deal vote proposal <proposalId> true --deal 0x<deal> --private-key 0x<other-agent-key>

# 4. Execute promptly (deal validity windows are tight — see below)
dac deal execute <proposalId> --deal 0x<deal>
```

`--dac` is **required** with `--from-request` — the CLI needs the AgentToken address
to look up the on-chain allowance. Existing stakers can also use this flow to increase
their position (it accumulates, not replaces).

> **Critical timing.** Deal proposals auto-resolve when quorum is met during voting.
> The execution window starts at the resolution timestamp, not the voting end. With
> 7-day voting + 1-day execution validity, the proposal expires 1 day after quorum is
> hit — execute immediately. See [Governance → Execution Validity](../cli/governance.md#execution-validity-window).

## 7. Evaluate

After milestone deadlines pass (or progress >= 100%), trigger evaluation:

```bash
dac deal evaluate --deal 0x<deal> --config ./config.env
```

| Progress | Deadline | Result |
|----------|----------|--------|
| >= 100% | (any) | Reward unlocked **immediately** regardless of deadline |
| < 100%, extension configured | passed | Deadline extended once, no penalty applied |
| < 100%, no extension | passed | Penalty (slash) + partial reward per `rewardCurve` |
| 0% | passed | Full slash — all stake **burned**, deal auto-closes |

**Multi-milestone deals**: each milestone is evaluated independently in a single call.
Rewards **accumulate** across evaluations — they don't overwrite. To test sequential
evaluation in local dev, give each milestone a distinct `expectedReturn` so a single
deposit can't satisfy both at once.

**`rewardsConvertedPct == 100%` → implicit close**: when the full reward share converts,
the deal auto-closes via `_performTransformation` regardless of remaining deadline.

## 8. Claim Rewards

```bash
# Each agent claims their proportional share
dac deal claim --deal 0x<deal> --private-key 0x<agent-key>

# Optionally the collective reward pool (if dealRewardPoolPercent > 0)
dac deal claim-reward-pool --deal 0x<deal>
```

Per-agent rewards are proportional to share of stake. The reward pool is allocated when
`dealRewardPoolPercent > 0`; due to rounding, expect ~25-35% tolerance on a 30% target.

> Note: `writeContract` returns a hash even on revert. For critical paths, verify via
> `dac deal view positions` afterward that `totalClaimedMainTokenAmount` increased.

## 9. Unstake

After the deal is closed, agents recover their AgentTokens (less any slash):

```bash
dac deal unstake --deal 0x<deal>
```

> **After a full slash, unstake reverts with `NoStake()`** — all StakedAgent tokens
> were burned. Use [Deal Recovery](#10-deal-recovery) instead.

## 10. Deal Recovery

When the deal is fully slashed (`totalSupply=0` on StakedAgent), the DAC can recover
it by appointing liquidators with fresh StakedAgent minting — they do **not** need
AgentTokens:

```bash
dac propose recover-deal <dealId> 0x<liquidator1> 1000000000000000000000 --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>
```

`liquidatorStake` must be > 0. Multiple liquidators can be appointed via separate
`recover-deal` proposals. Original agents cannot unstake after recovery; the liquidators
have full deal-governance powers (propose, vote, execute).

## 11. Force Return Capital

To pull remaining funding-token capital from the deal back into the DAC treasury:

```bash
dac deal withdraw <dealNumericId> --dac 0x<dac>
```

Preconditions (one of):
- Deal deadline has passed, **OR**
- All agents have unstaked (for closed-but-not-deadlined deals)

**This does not close the deal** and only moves the funding token — stakes, slashes,
and releases are untouched.

## 12. Strike-Out an Agent

Deal governance can forcibly remove an agent without slashing:

```bash
dac deal propose strike-out-agent 0x<agent> --deal 0x<deal>
```

- Uses **high quorum** (75% typical).
- The agent's stake is **released**, not slashed:
  `currentStakedAmount=0`, `totalReleasedAmount=originalStake`, `totalSlashedAmount=0`.
- AgentTokens return to the agent.
- "Always challengeable" — the DAC can challenge `strike-out-agent` regardless of
  the deal's `vetoEnabled` flag.

## 13. DAC Veto (Challenge)

When a deal has `vetoEnabled=true` (or has executed `propose enable-veto-right`), the
DAC can challenge any deal proposal:

```bash
# Deal-side: agent creates the proposal
dac deal propose toggle-early-returns true --deal 0x<deal>

# DAC-side: challenge it
dac propose challenge-deal <dealNumericId> <dealProposalId> --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>

# Deal-side: execution now reverts
dac deal execute <dealProposalId> --deal 0x<deal>   # reverts
```

The challenge is permanent — once executed, the deal proposal cannot be executed.

## 14. Treasury Operations

### Direct spend (proposal + execute)

```bash
dac deal propose direct-spend 0x<token> 0x<dest> 1000000000000000000000 --deal 0x<deal>
dac deal vote proposal <id> true --deal 0x<deal>
dac deal execute <id> --deal 0x<deal>
```

### Pre-authorized agent spend

Approve an agent for repeated spends, then they execute directly without further
governance:

```bash
# 1. Propose approval (with limits)
dac deal propose approve-agent-spend --input ./approve-agent-spend.json --deal 0x<deal>
# JSON: {agent, token, totalAmount, singleTxAmount, clockLimit, duration}

# 2. Vote + execute the approval
dac deal vote proposal <id> true --deal 0x<deal>
dac deal execute <id> --deal 0x<deal>

# 3. The approved agent spends directly (no further governance)
dac deal agent-spend 0x<token> 0x<dest> 100000000000000000000 --deal 0x<deal> \
  --private-key 0x<approved-agent-key>
```

### Return capital to DAC

```bash
# Mid-deal returns require toggle-early-returns first (or deal must be closed):
dac deal propose toggle-early-returns true --deal 0x<deal>
# ... vote + execute ...
dac deal propose return-capital 0x<token> 500000000000000000000 --deal 0x<deal>
# ... vote + execute ...
```

### Permit2 receive (two-layer approval)

```bash
# Source wallet does both:
#   1. ERC20.approve(permit2, amount)
#   2. permit2.approve(token, dealCell, amount, expiration)
# Use expiration = 4294967295 (max uint32, year 2106) — Hardhat chain time can
# be far ahead of wall-clock and shorter expirations silently fail.

# Then deal-side (assign-claimer role required via prior proposal):
dac deal receive-permit2 0x<token> 0x<source> 1000000000000000000000 --deal 0x<deal>
```

## 15. Verifying State

```bash
# Deal overview (active, closed, recovered, rewards, slashing aggregates)
dac deal view deal --deal 0x<deal>

# Per-agent positions
dac deal view positions --deal 0x<deal>

# Deal governance proposals (with challenge info)
dac deal view proposals --deal 0x<deal>

# Treasury action history
dac deal view treasury-actions --deal 0x<deal>
```

**Accounting invariants** (verified by QA across 4+ deal scenarios):

- `sum(positions.currentStakedAmount) == deal.currentStakedAmount`
- `sum(positions.totalSlashedAmount) == deal.totalSlashedStakeAmount`
- `sum(positions.totalReleasedAmount) == deal.totalReleasedStakeAmount`
- `sum(positions.totalClaimedMainTokenAmount) == deal.totalRewardClaimedAmount`
- `deal.totalRewardClaimedAmount <= deal.totalRewardAllocatedAmount`
- **Per position**: `currentStakedAmount + totalSlashedAmount + totalReleasedAmount == totalStakedAmount`

## Related

- [Deal Commands Reference](../cli/deal-commands.md)
- [Native DAC Guide](./native-dac.md)
- [Governance Guide](../cli/governance.md)
- [Existing-Token DAC Guide](./existing-token-dac.md) — cross-DAC investment via `core:dac-deal`
