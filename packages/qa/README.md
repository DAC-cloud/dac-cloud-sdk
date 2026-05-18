# `@dac-cloud/qa`

End-to-end QA harness for the DAC Cloud protocol. Spawns the `dac` CLI process per
step against a local Hardhat chain, Envio indexer, and DAC Cloud backend — covering
the full SDK + CLI + backend integration surface.

**Private package** — not published. Used internally to gate releases.

## Running

```bash
npm install
npm run build

node packages/qa/dist/index.js --config ./config.env
# or via the bin shim:
npx dac-qa --config ./config.env
```

### Filtering

```bash
# By scenario name (substring match)
node packages/qa/dist/index.js --filter deal-strike-out

# By tag (any tag matches)
node packages/qa/dist/index.js --tags evaluation
node packages/qa/dist/index.js --tags deal,treasury
```

### Agent reviewer

Set `ANTHROPIC_API_KEY` to enable Claude-based step review. Each scenario step (CLI
input/output, indexer snapshots, assertion results) is sent to Claude for an independent
consistency check.

```bash
ANTHROPIC_API_KEY=sk-... node packages/qa/dist/index.js
```

## Scenarios (29)

### DAC Lifecycle

| Scenario | Tags | Description |
|----------|------|-------------|
| `existing-token-dac-lifecycle` | dac, existing-token, hybrid | Oracle deploy, create, wrap, propose / vote / execute |
| `dac-agent-distributor` | dac, agent-tokens, distributor | Approve distributor, mint inventory, disable, direct mint comparison |
| `dac-burn-main-tokens` | dac, governance, mint, burn | Mint MainTokens to treasury, burn from treasury, verify balances |
| `legal-wrapper` | dac, legal-wrapper, governance | Set legal-wrapper, verify role on login, send legal messages |

### Deal Evaluation

| Scenario | Tags | Description |
|----------|------|-------------|
| `deal-single-agent` | deal, single-agent, slash | Full slash (100%) at 0 progress, auto-close, DAC recovery |
| `deal-eval-full-reward` | deal, full-reward, claim | 100% progress → full reward → claim |
| `deal-eval-partial-reward` | deal, partial-reward | Partial progress, reward + penalty split |
| `deal-eval-slash` | deal, slash, multi-agent | Two agents, 0% progress, full slash, two liquidators |
| `deal-eval-extension` | deal, extension | Milestone with extension configured, deadline extended once |
| `deal-multi-milestone` | deal, multi-milestone, multi-agent | Three agents, two milestones, sequential eval, proportional claims |
| `revenue-evaluator` | deal, revenue-evaluator | Revenue-based eval with 4 cycles, multi-tranche |

### Deal Governance

| Scenario | Tags | Description |
|----------|------|-------------|
| `deal-veto` | deal, veto, challenge | `vetoEnabled=true`, DAC challenges a deal proposal |
| `deal-strike-out` | deal, strike-out, multi-agent | Strike out agent (released, not slashed) via deal governance |
| `deal-approve-expired` | deal, approve-expired | Deal approval past deadline, create replacement |
| `deal-active-staking` | deal, active-staking, multi-agent | Post-approval add-stake flow + executionValidityDuration |

### Deal Treasury

| Scenario | Tags | Description |
|----------|------|-------------|
| `treasury-deal-agent` | deal, treasury, agent-spend | Direct-spend, agent spend rights, return-capital, revoke-agent |
| `deal-reward-pool` | deal, reward-pool | 30% pool allocation math, agent claim + pool claim with receipt verification |
| `permit2-treasury-flow` | deal, permit2, treasury | Permit2 two-layer approval + spend |
| `deal-force-return` | deal, force-return | Force return capital after deadline |
| `deal-unstake-after-close` | deal, unstake, multi-deal | Close deal, both agents unstake, two deals in one DAC |
| `deal-multi-deal-native-rewards` | deal, multi-deal, native | Multiple deals, native DAC rewards accumulate correctly |
| `deal-multi-deal-wrapped-rewards` | deal, multi-deal, wrapped | Multiple deals, existing-token DAC rewards (no rewardsLimit) |

### Cross-DAC Investment

| Scenario | Tags | Description |
|----------|------|-------------|
| `dac-investment` | dac-deal, investment, dividends | Existing-token DAC invests in native DAC, two tranches, child-vote, dividends |
| `dac-deal-snapshot-vote` | dac-deal, snapshot, erc-1271 | Snapshot.org venue approval, vote sign, ERC-1271 verification |

### Oracle & Hybrid Governance

| Scenario | Tags | Description |
|----------|------|-------------|
| `oracle-governance` | oracle, governance, merkle | Oracle Merkle voting (3 voters), mixed voting, config proposals, oracle swap |
| `existing-token-accounting-stress` | existing-token, accounting | rewardsLimit=0 invariant, accounting cross-validation |

### Raw / Module

| Scenario | Tags | Description |
|----------|------|-------------|
| `deal-raw-module` | deal, raw-module | Raw hex proposal type, module factory verification |

### Dry-Run

| Scenario | Tags | Description |
|----------|------|-------------|
| `dry-run-lifecycle` | dry-run, multisig | Full DAC + deal lifecycle in `--dry-run` mode (no broadcast) |
| `dry-run-multi-tx` | dry-run, batching | Multi-transaction dry-run for Safe-style batching |

## Accounting Invariants

Four deal scenarios cross-validate via `verifyDealAccountingInvariants()`:

- `deal-eval-slash`
- `deal-eval-full-reward`
- `deal-strike-out`
- `deal-multi-milestone`

Invariants verified:

- `sum(positions.currentStakedAmount) == deal.currentStakedAmount`
- `sum(positions.totalSlashedAmount) == deal.totalSlashedStakeAmount`
- `sum(positions.totalReleasedAmount) == deal.totalReleasedStakeAmount`
- `sum(positions.totalClaimedMainTokenAmount) == deal.totalRewardClaimedAmount`
- `deal.totalRewardClaimedAmount <= deal.totalRewardAllocatedAmount`
- Per position: `currentStakedAmount + totalSlashedAmount + totalReleasedAmount == totalStakedAmount`

## Tacit-Knowledge Reference

The harness encodes many lifecycle gotchas as patterns rather than documentation —
the most important live in `src/scenarios/fixtures/common.ts`:

- `proposeVoteExecute` — canonical DAC flow with `syncIndexer()` between propose and vote
- `dealProposeVoteExecuteQuorum` — multi-voter deal flow, vote ascending by power,
  execute within ~100s of quorum (not `votingDuration`)
- `verifyTxReceipt` — checks `receipt.status === "0x1"` for paths where viem returns a
  hash on revert

User-facing distillations of these are in `docs/cli/governance.md` and
`docs/guides/deal-lifecycle.md`.

## Architecture

```
packages/qa/src/
  config.ts            Config parsing from env/flags
  runner.ts            Scenario executor (sequential, no chain reset between runs)
  harness/
    harness.ts         Test harness (cli, view, advanceTime, syncIndexer, assert)
    chain.ts           EVM RPC helpers (advanceTime, mineBlock, snapshot)
    cli-exec.ts        CLI process spawning
    indexer-sync.ts    Indexer polling
    assertions.ts      Assert API
    types.ts           TypeScript interfaces
  scenarios/
    index.ts           ALL_SCENARIOS registry
    fixtures/
      common.ts        Shared helpers (proposeVoteExecute, verifyDealAccountingInvariants, ...)
      setup-native-dac-deal.ts   DAC + deal setup fixture
      merkle.ts        Merkle tree builders (dividend + voting power)
      permit2.ts       Permit2 helpers
    *.ts               Individual scenario files (29 total)
  review/
    reviewer.ts        Claude API integration for agent review
```

## Adding a New Scenario

1. Create `packages/qa/src/scenarios/<name>.ts` exporting a `Scenario` object.
2. Register in `packages/qa/src/scenarios/index.ts` (add to `ALL_SCENARIOS` + named export).
3. Use existing fixtures (`setupNativeDacWithDeal`, `proposeVoteExecute`,
   `dealProposeVoteExecuteQuorum`) — they encode the timing/sync rules.
4. Add `verifyDealAccountingInvariants()` for scenarios that modify stake / reward state.
5. Add `verifyTxReceipt()` for operations where the CLI doesn't itself check receipt status.
6. Run with `--filter <your-scenario-name>` to iterate.
