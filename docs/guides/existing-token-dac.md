# Guide: Existing-Token DAC

This guide covers creating a DAC that wraps an existing ERC20 token, using oracle-based hybrid governance.

## Overview

An existing-token DAC lets holders of an already-deployed ERC20 participate in DAC governance without migrating their tokens. The architecture:

```
Existing ERC20  -->  Wrap  -->  WrappedMainToken (ERC20Votes)
                                      |
                              GovernanceOracle
                              (Merkle snapshots)
```

**Wrapped holders** vote directly via their WrappedMainToken balance.
**Unwrapped holders** vote via Merkle proofs published by the oracle.

## 1. Deploy Governance Oracle

```bash
dac oracle deploy 0x<admin-address> --config ./config.env --pretty-print
```

The oracle admin controls publisher access. Save the returned oracle address.

## 2. Create the DAC

```bash
dac create-existing-token \
  --name "Wrapped Token DAC" \
  --description "Governance for existing token holders" \
  --symbol "WDAC" \
  --underlying-token 0x<existing-erc20> \
  --treasury-seed-amount 1000000000000000000000 \
  --quorum-percent 50 \
  --blocking-percent 25 \
  --high-quorum-percent 75 \
  --voting-duration 3600 \
  --qualification 0 \
  --execution-validity-duration 86400 \
  --oracle-publish-deadline 600 \
  --fallback-warmup-duration 300 \
  --fallback-duration 3600 \
  --governance-oracle 0x<oracle-address> \
  --auto-delegate \
  --auto-approve \
  --config ./config.env \
  --pretty-print
```

Key parameters:
- `--oracle-publish-deadline` — Time the oracle has to publish a snapshot after proposal creation
- `--fallback-warmup-duration` — Warmup period before fallback voting activates
- `--fallback-duration` — Duration of fallback voting phase

## 3. Wrap Tokens

Token holders wrap their existing ERC20 into the WrappedMainToken:

```bash
dac wrap --amount 500000000000000000000 --dac 0x<dac> --auto-approve
```

To unwrap:

```bash
dac unwrap --amount 250000000000000000000 --dac 0x<dac>
```

## 4. Hybrid Governance Flow

### Happy Path (Oracle Available)

```bash
# 1. Create proposal
dac propose mint-agent-tokens 100000000000000000000000 0x<recipient> --dac 0x<dac>

# 2. Oracle publishes snapshot (off-chain process)
dac oracle publish <proposalId> <snapshotBlock> <merkleRoot> <totalVotingPower> \
  --dac 0x<dac>

# 3. Activate primary voting
dac proposal activate-primary <proposalId> --dac 0x<dac>

# 4. Wrapped holders vote directly
dac vote proposal <proposalId> true --dac 0x<dac>

# 5. Unwrapped holders vote via Merkle proof
dac proposal vote-merkle <proposalId> true <index> <amount> <proof...> --dac 0x<dac>

# 6. Execute after voting period
dac execute <proposalId> --dac 0x<dac>
```

### Fallback Path (Oracle Misses Deadline)

```bash
# 1. After oracle deadline passes, begin warmup
dac proposal begin-warmup <proposalId> --dac 0x<dac>

# 2. After warmup, activate fallback voting
dac proposal activate-fallback <proposalId> --dac 0x<dac>

# 3. All MainToken holders can now vote directly
dac vote proposal <proposalId> true --dac 0x<dac>

# 4. Execute
dac execute <proposalId> --dac 0x<dac>
```

### Emergency Fallback

If the oracle is deactivated while a proposal is in primary voting:

```bash
dac proposal trigger-fallback <proposalId> --dac 0x<dac>
```

## 5. Check Proposal State

```bash
dac proposal state <proposalId> --dac 0x<dac>
```

Shows current phase, deadlines, vote counts, and whether the proposal is executable.

## 6. Oracle Management

```bash
# Check oracle status
dac oracle status --dac 0x<dac>

# Add/remove publishers
dac oracle set-publisher 0x<publisher> true --dac 0x<dac>

# Deactivate oracle (triggers emergency fallback for active proposals)
dac oracle deactivate --dac 0x<dac>
```

## Related

- [Native DAC Guide](./native-dac.md) — Simpler governance without oracle
- [Governance Guide](../cli/governance.md) — General governance patterns
- [DAC Commands Reference](../cli/dac-commands.md)
