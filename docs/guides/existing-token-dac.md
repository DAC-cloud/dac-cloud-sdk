# Guide: Existing-Token DAC

An existing-token DAC lets holders of a deployed ERC20 participate in DAC governance
without migrating their tokens. The DAC wraps the underlying token 1:1 into a
`WrappedMainToken` (ERC20Votes) and uses a `GovernanceOracle` to support voting by
unwrapped holders via Merkle snapshots.

```
Existing ERC20  ───►  Wrap  ───►  WrappedMainToken (ERC20Votes)
                                          │
                                  GovernanceOracle
                                  (Merkle snapshots)
```

- **Wrapped holders** vote directly via their WrappedMainToken balance.
- **Unwrapped holders** vote via Merkle proofs published by the oracle.
- **Fallback** path: if no oracle publishes a snapshot in time, voting falls back to
  wrapped-only after a warmup period.

## Differences from Native DAC

| | Native | Existing-Token |
|--|--------|----------------|
| Governance token | Fresh MainToken minted by factory | WrappedMainToken (1:1 around underlying) |
| Founder allocation | `--allocation` minted to founder | None — founder must `wrap` to gain voting power |
| Supply cap | `--max-supply` | Bounded by underlying token's circulating supply |
| Treasury seed | None at creation; deposit separately | `--treasury-seed-amount` of underlying wraps into treasury |
| Deal `rewardsLimit` | Can be > 0 (mintable headroom) | **Must be 0** — wrapped token has no minting headroom (1:1 invariant); reverts with `InsufficientRewards()` |
| Governance proposals | Single voting phase | Multi-phase: PrimaryVoting → FallbackWarmup → FallbackVoting |

## 1. (Optional) Deploy a Governance Oracle

If your DAC will support oracle-snapshot voting:

```bash
dac oracle deploy 0x<admin-address> --config ./config.env --pretty-print
# optionally pass an initial publisher: dac oracle deploy <admin> <publisher>
```

Output includes the oracle address.

If you skip the oracle, the DAC operates in **fallback-only** mode — wrapped holders
vote directly after the fallback warmup elapses.

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
  --fallback-warmup-duration 10 \
  --fallback-duration 3600 \
  --governance-oracle 0x<oracle-address> \
  --auto-delegate --auto-approve \
  --config ./config.env --pretty-print
```

Key flags:

| Flag | Description |
|------|-------------|
| `--underlying-token` | Existing ERC20 to wrap |
| `--treasury-seed-amount` | Underlying tokens wrapped into the DAC treasury at creation |
| `--governance-oracle` | Oracle address (omit for fallback-only) |
| `--oracle-publish-deadline` | Seconds the oracle has to publish after proposal creation |
| `--fallback-warmup-duration` | Warmup after deadline before fallback voting opens |
| `--fallback-duration` | Window during which fallback voting is open |
| `--oracle-primary-enabled` | Set true if oracle voting is primary (else fallback-only) |
| `--blocking-on-all-proposals` / `--blocking-on-high-quorum` | Apply blocking percent rule selectively |
| `--auto-approve` | Approve underlying ERC20 to wrapper before treasury seeding |

> **Constraint:** if `blockingPercent = 0`, both `blockingOnAllProposals` and
> `blockingOnHighQuorum` must be `false`.

## 3. Wrap Tokens

Token holders convert their existing ERC20 into voting-capable WrappedMainTokens:

```bash
dac wrap --amount 500000000000000000000 --dac 0x<dac> --auto-approve
```

`--auto-approve` performs the underlying-token approve to the WrappedMainToken contract
before wrapping.

To unwrap:

```bash
dac unwrap --amount 250000000000000000000 --dac 0x<dac>
```

> Founders need to wrap to acquire voting power — `create-existing-token` does **not**
> allocate tokens to the founder. Pair `--auto-delegate` at creation with a follow-up
> `wrap` to be able to propose immediately.

## 4. Hybrid Governance Flows

### Happy Path: Oracle Available (Primary Voting)

```bash
# 1. Create proposal
dac propose mint-agent-tokens 100000000000000000000000 0x<recipient> --dac 0x<dac>
# Note the returned proposalId and the snapshot reference block.

# 2. Oracle publishes a Merkle snapshot of unwrapped holders' balances at
#    `createdBlockNumber - 1`. The merkleRoot covers (index, receiver, amount) leaves.
#    snapshotBlock can be read from indexer.proposals.snapshotReference.
dac oracle publish <proposalId> <snapshotBlock> 0x<merkleRoot> <totalVotingPower> \
  --governance-oracle 0x<oracle>

# 3. Activate primary voting
dac proposal activate-primary <proposalId> --dac 0x<dac>

# 4. Wrapped holders vote directly
dac vote proposal <proposalId> true --dac 0x<dac>

# 5. Unwrapped holders vote via Merkle proof
dac proposal vote-merkle <proposalId> true <index> <amount> 0x<proof1>,0x<proof2> \
  --dac 0x<dac>
# `--proof` can also be `@./proof.json` referencing a JSON file with a proof array.

# 6. Execute promptly after quorum is reached
dac execute <proposalId> --dac 0x<dac>
```

> **Mixed voting** during PrimaryVoting: the same wallet can cast both a wrapped vote
> (via `vote proposal`) and a Merkle vote (via `vote-merkle`) — they tally separately
> because they represent different voting bases.

### Fallback Path: Oracle Misses Deadline

```bash
# 1. (after oraclePublishDeadline) Begin fallback warmup
dac proposal begin-warmup <proposalId> --dac 0x<dac>

# 2. After fallback-warmup-duration elapses, fallback voting can be activated.
#    Note: the first vote in fallback mode auto-attempts the phase transition,
#    so step 3 is often optional.
dac proposal activate-fallback <proposalId> --dac 0x<dac>   # optional

# 3. Wrapped holders vote
dac vote proposal <proposalId> true --dac 0x<dac>

# 4. Execute
dac execute <proposalId> --dac 0x<dac>
```

### Emergency Fallback

If the oracle is deactivated while a proposal is in PrimaryVoting:

```bash
dac proposal trigger-fallback <proposalId> --dac 0x<dac>
```

## 5. Inspect Proposal State

```bash
dac proposal state <proposalId> --dac 0x<dac>
```

Returns current phase (`Created`, `PrimaryVoting`, `FallbackWarmup`, `FallbackVoting`,
`Resolved`, `Executed`), deadlines, vote tallies, and whether execution is allowed.

## 6. Oracle Management

```bash
# Show oracle state from indexer
dac oracle status --dac 0x<dac>

# Grant a publisher role
dac oracle set-publisher 0x<publisher> true --dac 0x<dac>

# Revoke
dac oracle set-publisher 0x<publisher> false --dac 0x<dac>

# Deactivate the oracle entirely (triggers emergency fallback for in-flight proposals)
dac oracle deactivate --dac 0x<dac>
```

To swap to a new oracle, propose `update-governance-oracle <newAddress>`:

```bash
dac propose update-governance-oracle 0x<newOracle> --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>
```

## 7. Treasury Deposits (Underlying Token Funding)

For deals that need to disburse the underlying token (not the wrapped form), the
treasury must hold the underlying directly:

```bash
dac deposit-treasury --token 0x<underlying-erc20> --amount 5000000000000000000000 \
  --dac 0x<dac> --auto-approve
```

The wrap operation puts underlying into the WrappedMainToken contract (not into
the DAC treasury), so a separate `deposit-treasury` is required to fund deals.

## 8. Cross-DAC Investment via `core:dac-deal`

An existing-token DAC can invest in another DAC (typically a native sub-DAC) using a
`core:dac-deal`:

1. **Set up the child DAC** (e.g. `dac create` with desired voting duration **larger**
   than the investor's deal voting + execution time — otherwise the parent can't vote
   in time. Example: investee voting 14400s when investor deal voting is 7200s.)
2. **Configure the investee DAC** to accept the investor's WrappedMainToken in its
   treasury.
3. **Propose a `core:dac-deal`** in the investor DAC, configured with the child DAC
   reference.
4. **Link a capital call**: `dac deal link-capital-call <capitalCallId> --deal 0x<deal>`
   (pre-approval).
5. **Approve and stake** as usual.
6. **Request tranches** from the child DAC:
   ```bash
   dac deal propose request-tranche <capitalCallNonce> [rewards] --deal 0x<deal>
   # Or by hash:
   dac deal propose request-tranche [rewards] --deal 0x<deal> --capital-call-hash 0x<bytes32>
   ```
   The CLI auto-fills `target`, `i`, and `data` from the child capital call.
7. **Forward child-DAC governance** via `child-vote-proposal`:
   ```bash
   dac deal propose child-vote-proposal <childProposalId> true --deal 0x<deal>
   # ... deal vote + execute, then the deal contract casts its vote ...
   dac deal execute <id> --deal 0x<deal>
   # Then execute the child proposal in the child DAC
   ```

8. **Distribute dividends**: the parent DAC's `claim-dividend` is permissionless, so a
   parent admin can claim on behalf of the deal contract (which can't call itself).

The capital call nonce equals the child proposal ID that created the call — the
contract reuses the proposal ID as the call nonce.

## 9. Snapshot.org Voting via ERC-1271 (Advanced)

A `core:dac-deal` can sign Snapshot.org Vote payloads via the deal's ERC-1271 interface,
allowing the deal to participate in child-DAC governance using a familiar off-chain
voting venue.

```bash
# 1. Approve the venue version (high-quorum deal proposal)
dac deal propose approve-venue-version "snapshot-v1" "0.1.4" "true" --deal 0x<deal>

# 2. Pre-approve a specific Vote payload via --input
dac deal propose snapshot-vote-sign --input ./snapshot-vote.json --deal 0x<deal>

# 3. After execution, the deal's ERC-1271 isValidSignature returns 0x1626ba7e
#    for the exact approved payload (and 0xffffffff for any tampered version)
```

> **EIP-712 domain note:** Snapshot.org uses `{name:"snapshot", version:<payload.version>}`
> with **no chainId** and **no verifyingContract**. The off-chain
> `coreModule.computeSnapshotV1FinalHash` helper mirrors the contract's stored hash —
> use it from the SDK to verify your payload before submitting.

Revocation: propose `approve-venue-version "snapshot-v1" "0.1.4" "false"`. After this,
new `snapshot-vote-sign` proposals can be created but execution reverts.

## Related

- [Native DAC Guide](./native-dac.md) — simpler governance, no wrap layer
- [Governance Guide](../cli/governance.md) — execution validity, multi-voter patterns
- [DAC Commands Reference](../cli/dac-commands.md)
- [Deal Commands Reference](../cli/deal-commands.md)
