# Governance Guide

DAC Cloud uses on-chain governance at two levels: **DAC governance** (MainToken holders) and **Deal governance** (StakedAgent token holders).

## Governance Flow

Both levels follow the same three-step pattern:

```
Propose  -->  Vote  -->  Execute
```

### Step 1: Propose

```bash
# DAC-level proposal
dac propose <type> [args...] --dac 0x<dac> --config ./config.env

# Deal-level proposal
dac deal propose <type> [args...] --deal 0x<deal> --config ./config.env
```

The propose transaction creates a VotingProposal contract. The response includes the `proposalId` used in subsequent steps.

### Step 2: Vote

After the voting delay (typically 1 block), token holders can vote:

```bash
# DAC-level vote
dac vote proposal <proposalId> true --dac 0x<dac>

# Deal-level vote
dac deal vote proposal <proposalId> true --deal 0x<deal>
```

The `--pre-vote-advance-seconds` flag can advance EVM time before voting (useful for local testing).

### Step 3: Execute

After the voting period ends and quorum is met:

```bash
# DAC-level execute
dac execute <proposalId> --dac 0x<dac>

# Deal-level execute
dac deal execute <proposalId> --deal 0x<deal>
```

The `--advance-seconds` flag can advance time before execution (local testing).

**Important: Execution Validity Window.** Proposals auto-resolve as soon as quorum is reached during voting (not when the voting period ends). The execution window is `[resolutionTime, resolutionTime + executionValidityDuration]`. For deal governance, where `votingDuration` may be 7 days but `executionValidityDuration` is only 1 day, you must execute promptly after the last needed vote — waiting for the full voting period to end may cause the execution window to expire.

## Voting Parameters

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| `quorumPercent` | Minimum participation for validity | 10-50% |
| `blockingPercent` | "No" votes needed to block | 25% |
| `highQuorumPercent` | Elevated quorum for critical proposals | 50-75% |
| `duration` | Voting period in seconds | 3600 (1 hour) for testnet |
| `qualification` | Minimum token balance to propose | 0-5% |
| `executionValidityDuration` | Window to execute after passing | 86400 (1 day) |

## DAC Proposal Types

See [DAC Commands > propose](./dac-commands.md#propose-proposaltype-args) for the full list.

Key types:
- `mint-agent-tokens` — Mint AgentTokens (needed before agents can stake into deals)
- `mint-main-tokens` / `burn-main-tokens` — Manage MainToken supply in treasury reserve
- `recover-deal` — Assign a liquidator to a slashed/closed deal
- `challenge-deal` — DAC-level veto of a deal governance proposal

**High quorum types** (use `highQuorumPercent` instead of `quorumPercent`):
All governance configuration proposals use high quorum: `update-governance-strategy`, `update-deal-creation-config`, `update-voting-config`, `update-legal-wrapper`, `update-governance-oracle`, `dividend-payout`, `add-module`, `remove-module`, `toggle-dividends`, `mint-main-tokens`, `burn-main-tokens`.

## Deal Proposal Types

See [Deal Commands > propose](./deal-commands.md#propose-proposaltype-args) for the full list.

Kernel deal proposal types:
- `update-voting-config`, `toggle-whitelist`, `toggle-early-returns` — Governance config (high quorum, allowed pre-approval)
- `enable-veto-right` — Enable DAC challenge capability (high quorum)
- `request-tranche` — Request funding from DAC treasury (normal quorum + blocking)
- `add-stake` — Add pending stake from a request (high quorum)
- `strike-out-agent` — Force-remove an agent, stake released not slashed (high quorum, always challengeable)

Module deal proposal types (core module):
- `direct-spend`, `permit2-spend` — Treasury operations
- `child-vote-proposal`, `child-create-proposal` — Cross-DAC governance via DAC deals
- `return-capital` — Return funds to parent DAC treasury

### Pre-Approval Proposals

Three deal proposal types can be created **before** the deal is approved:
- `update-voting-config`
- `toggle-whitelist`
- `toggle-early-returns`

All other types require the deal to be approved first (`DealIsNotApproved` error).

## Hybrid Governance (Existing-Token DACs)

Existing-token DACs use a multi-phase voting process with oracle snapshots. See [Existing-Token DAC Guide](../guides/existing-token-dac.md) for the full flow.

Phases:
1. **Primary Voting** — Oracle publishes Merkle snapshot, wrapped token holders vote directly
2. **Fallback Warmup** — If oracle misses deadline, warmup period begins
3. **Fallback Voting** — All MainToken holders vote (no oracle needed)

## DAC Challenge (Veto)

When a deal has `vetoEnabled=true`, the DAC can block deal governance proposals:

```bash
# 1. Agent creates deal proposal
dac deal propose toggle-early-returns true --deal 0x<deal>

# 2. DAC challenges it
dac propose challenge-deal <dealId> <dealProposalId> --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>

# 3. Deal proposal is now permanently blocked from execution
```

## Related

- [DAC Commands](./dac-commands.md)
- [Deal Commands](./deal-commands.md)
- [Native DAC Guide](../guides/native-dac.md)
