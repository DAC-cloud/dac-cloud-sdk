# Governance Guide

DAC Cloud uses on-chain governance at two levels:

- **DAC governance** — MainToken (or WrappedMainToken) holders propose / vote / execute
  on DAC-level decisions.
- **Deal governance** — StakedAgent token holders (agents staked into a specific deal)
  govern that deal's internal state.

Both follow the same three-step pattern, with a few critical timing rules.

## The Propose → Vote → Execute Flow

```
        ┌────────┐        ┌───────┐        ┌────────────┐
        │ propose│ ─────► │ vote  │ ─────► │  execute   │
        └────────┘        └───────┘        └────────────┘
            │                 │                  │
   creates VotingProposal     │            within validity
   indexer records it         │            window after quorum
                              │
                  quorum auto-resolves
                  (Proposal._checkAndEmitResolution)
```

### Step 1 — Propose

```bash
# DAC-level
dac propose <type> [args...] --dac 0x<dac>

# Deal-level
dac deal propose <type> [args...] --deal 0x<deal>
```

A new `VotingProposal` contract is deployed and recorded in the indexer. The response
includes `proposalId` (numeric, per-scope) and `proposalAddress`.

### Step 2 — Vote

```bash
dac vote proposal <proposalId> <support>      --dac 0x<dac>
dac deal vote proposal <proposalId> <support> --deal 0x<deal>
```

`support` is one of `true`, `false`, `1`, `0`, `yes`, `no`. Voting power is the
voter's balance at the proposal's snapshot block.

### Step 3 — Execute

```bash
dac execute <proposalId>      --dac 0x<dac>
dac deal execute <proposalId> --deal 0x<deal>
```

## Execution Validity Window

**The single most important governance rule.**

Proposals auto-resolve **the moment quorum is reached** during voting — not when the
voting period ends. The contract emits a resolution event and sets `resolutionTime` to
the timestamp of the deciding vote.

The execution window is:

```
[resolutionTime, resolutionTime + executionValidityDuration]
```

Implication: for a deal with `votingDuration = 7 days` and
`executionValidityDuration = 1 day`, if quorum is reached on day 1 the proposal must be
executed **within the next day**, even though "voting" technically continues until day 7.

**Practical rules:**

1. **Don't wait for `endTime`** — execute as soon as the deciding vote lands.
2. **Vote smallest-first when quorum is close** — once quorum is met, subsequent votes
   are rejected. If multiple voters need to contribute and total voting power is just
   above quorum, sort voters by power ascending.
3. **For local testing**, advance only a short time between vote and execute (the QA
   harness uses 100s), not `votingDuration`.

## Voting Parameters

| Parameter | Description | Typical |
|-----------|-------------|---------|
| `quorumPercent` | Minimum participation for a normal proposal | 10-50% |
| `blockingPercent` | "No" votes needed to block (>= quorum threshold) | 25% |
| `highQuorumPercent` | Elevated quorum for governance-config proposals | 50-75% |
| `votingDuration` | Voting window (seconds). Defines the max window; quorum can end it early | 3600 (test) to 7d (prod) |
| `qualification` | Minimum voting balance to propose | 0-5% |
| `executionValidityDuration` | Execution window after resolution | 86400 (1 day) |

**Constraint:** if `blockingPercent = 0`, both `blockingOnAllProposals` and
`blockingOnHighQuorum` must be `false`.

## DAC Proposal Types — High vs Normal Quorum

**High-quorum DAC proposals** (use `highQuorumPercent`):

- All governance-config: `update-voting-config`, `update-governance-strategy`,
  `update-deal-creation-config`, `update-governance-oracle`, `update-legal-wrapper`
- Treasury reserve: `mint-main-tokens`, `burn-main-tokens`, `toggle-dividends`
- Dividends: `dividend-payout`
- Modules: `add-module`, `remove-module`

**Normal-quorum DAC proposals**: most token/agent/deal-interaction types
(`mint-agent-tokens`, `capital-call`, `recover-deal`, `deal-message`, `challenge-deal`,
etc.).

See [DAC Commands → propose](./dac-commands.md#propose-proposaltype-args) for the full type list.

## Deal Proposal Types — Pre-Approval Subset

Three deal proposal types can be created **before** the deal is approved:

- `update-voting-config`
- `toggle-whitelist`
- `toggle-early-returns`

All other types require the deal to be active (`DealIsNotApproved` error otherwise).

## Hybrid Governance (Existing-Token DACs)

Existing-token DACs use multi-phase voting because token holders may not have wrapped.

```
┌────────────────────────────┐
│   Proposal Created          │
└─────────────┬──────────────┘
              │
              ▼
       ┌─────────────────┐
       │  PrimaryVoting  │ ← Oracle publishes snapshot before deadline
       └──────┬──────────┘   • Wrapped holders vote directly
              │              • Unwrapped holders vote via `vote-merkle`
              │
   no snapshot by deadline?
              │
              ▼
       ┌─────────────────┐
       │ FallbackWarmup  │ ← `proposal begin-warmup`
       └──────┬──────────┘
              │
   warmup elapsed?
              │
              ▼
       ┌─────────────────┐
       │ FallbackVoting  │ ← `proposal activate-fallback` (or first vote auto-activates)
       └──────┬──────────┘   • Only wrapped holders vote (MainToken balance)
              │
              ▼
       ┌─────────────────┐
       │   Resolution     │
       │   Execute        │
       └─────────────────┘
```

**Emergency fallback** (`proposal trigger-fallback`) applies if the oracle is deactivated
while a proposal is in PrimaryVoting.

**Important:** during PrimaryVoting, the same wallet can cast **both** a wrapped vote
(`vote proposal`) and a Merkle vote (`vote-merkle`) — they tally separately because
they represent different voting bases (wrapped balance + unwrapped snapshot share).

**Computing `snapshotBlock`** for `oracle publish`: typically `createdBlockNumber - 1`,
which you can read from `indexer.proposals.snapshotReference`.

See [Existing-Token DAC Guide](../guides/existing-token-dac.md) for the full flow.

## DAC Challenge (Veto)

When a deal has `vetoEnabled = true` (or has run `propose enable-veto-right`), the DAC
can veto any specific deal proposal:

```bash
# 1. Agent creates a deal proposal
dac deal propose toggle-early-returns true --deal 0x<deal>

# 2. DAC challenges it
dac propose challenge-deal <dealNumericId> <dealProposalId> --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>

# 3. Deal proposal is now permanently blocked
dac deal execute <dealProposalId> --deal 0x<deal>   # reverts ProposalNotExecutable()
```

### Challenge state machine

**The challenge is registered the moment the DAC `propose challenge-deal` transaction
lands — not when the DAC vote passes or executes.** Filing a challenge immediately flips
`dealProposal.challenged=true` and suspends execution. The DAC vote then determines
whether the block becomes permanent or eventually lifts:

| Challenge state | Effect on deal proposal execution | Revert reason |
|---|---|---|
| No challenge | Available at `resolutionTime` (normal) | — |
| **Filed, unresolved** | Blocked indefinitely | `ProposalNotExecutable()` |
| **Resolved, failed** (voted down, where blocking permits) | Available at `max(deal.resolutionTime, challenge.resolutionTime)` | — |
| **Resolved, passed, NOT executed, NOT expired** | Blocked indefinitely | `ProposalNotExecutable()` |
| **Resolved, passed, EXECUTED** | Permanently blocked | `ProposalNotExecutable()` |
| **Resolved, passed, NOT executed, EXPIRED** (lapsed) | Available at challenge's `executionDeadline` | — |

The "lapsed challenge" outcome means a DAC that fails to enact its veto within
`executionValidityDuration` after passing the vote loses the block — the deal proposal
becomes executable again.

### Revert distinction (debugging)

When `dac deal execute <id>` reverts, the cause depends on which check failed:

- **`VoteNotPassed()`** — the deal proposal didn't reach quorum (or hasn't resolved yet).
  Sort voters smallest-first to avoid quorum-cutoff cases.
- **`ProposalNotExecutable()`** — quorum was reached, but the proposal is blocked by an
  active or executed DAC challenge.
- **`ProposalAlreadyExecuted()`** — already executed once.

Inspect `dealProposal.passed` and `dealProposal.challenged` in the indexer to disambiguate.

### Other notes

- **Challenges are single-shot** — a second `propose challenge-deal` on the same deal
  proposal reverts with `ProposalAlreadyChallenged()`. The challenge proposal itself
  may be filed any time before the deal proposal has executed or expired.
- **`strike-out-agent` is "always challengeable"** — the DAC can challenge it regardless
  of the deal's `vetoEnabled` flag, on the theory that removing a stakeholder is severe
  enough that the DAC always gets a final say.

## Multi-Voter Quorum Patterns

When several voters must participate:

```
Voter A: 30%
Voter B: 25%
Voter C: 20%   ← votes first
Voter D: 15%   ← votes second
                quorum = 50%, hits after C+D = 35%? no
                B votes third → 60% total, quorum hit, resolved
                A's vote (if cast last) is rejected
```

**Rule:** sort voters by voting power **ascending**. This ensures the largest holder
isn't excluded by an unexpected mid-vote resolution. The QA harness implements this
pattern in `dealProposeVoteExecuteQuorum`.

## Receipt Verification

`writeContract` returns a transaction hash even when the underlying transaction
reverts. The CLI uses a `submitWrite` helper that:

1. Estimates gas, then writes with a **50% buffer** to absorb ERC20Votes checkpoint
   variance (63/64-rule attrition during voting checkpoints).
2. Waits for the receipt and checks `status === "success"`, throwing if not.

This makes the CLI's `txHash` output reliable for standard flows. For low-level paths
that bypass `submitWrite` (rare), re-read state via `dac view ...` to confirm.

## Related

- [DAC Commands](./dac-commands.md)
- [Deal Commands](./deal-commands.md)
- [Native DAC Guide](../guides/native-dac.md)
- [Existing-Token DAC Guide](../guides/existing-token-dac.md)
- [Deal Lifecycle Guide](../guides/deal-lifecycle.md)
