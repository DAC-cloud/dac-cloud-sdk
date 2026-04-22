# `@dac-cloud/qa`

End-to-end QA harness for the DAC Cloud protocol. Runs scenario scripts against a local Hardhat chain with Envio indexer.

## Running

```bash
npm run build
node packages/qa/dist/index.js --config ./config.env

# Filter by name or tag
node packages/qa/dist/index.js --filter deal-strike-out
node packages/qa/dist/index.js --tags evaluation

# With agent reviewer
ANTHROPIC_API_KEY=sk-... node packages/qa/dist/index.js
```

## Scenarios (21)

### DAC Lifecycle

| Scenario | Tags | Description |
|----------|------|-------------|
| `existing-token-dac-lifecycle` | dac, existing-token, hybrid | Oracle deploy, create existing-token DAC, wrap, propose/vote/execute |
| `dac-agent-distributor` | dac, agent-tokens, distributor | Approve distributor, mint inventory, disable, direct mint comparison |
| `dac-burn-main-tokens` | dac, governance, mint, burn | Mint MainTokens to treasury, burn from treasury, verify indexer balances |

### Deal Evaluation

| Scenario | Tags | Description |
|----------|------|-------------|
| `deal-single-agent-lifecycle` | deal, single-agent, slash | Full slash (100%) at 0 progress, auto-close, DAC recovery |
| `deal-eval-full-reward` | deal, full-reward, claim | 100% progress, full reward, claim |
| `deal-eval-partial-reward` | deal, partial-reward | Partial progress, reward + penalty split |
| `deal-eval-slash` | deal, slash, multi-agent | Two agents, 0% progress, full slash, two liquidators |
| `deal-eval-extension` | deal, extension | Milestone with extension configured, deadline extended |
| `deal-multi-milestone` | deal, multi-milestone, multi-agent | Three agents, two milestones, sequential evaluation, proportional claims |
| `revenue-evaluator-lifecycle` | deal, revenue-evaluator | Revenue-based evaluation with 4 cycles, multi-tranche |

### Deal Governance

| Scenario | Tags | Description |
|----------|------|-------------|
| `deal-veto` | deal, veto, challenge | Deal with vetoEnabled, DAC challenges a deal proposal |
| `deal-strike-out` | deal, strike-out, multi-agent | Strike out agent via deal governance (stake released, not slashed) |
| `deal-approve-expired` | deal, approve-expired | Deal approval past deadline, create replacement |

### Deal Treasury

| Scenario | Tags | Description |
|----------|------|-------------|
| `treasury-deal-agent-lifecycle` | deal, treasury, agent-spend | Direct-spend, agent spend rights, return-capital, revoke-agent |
| `deal-reward-pool-allocation` | deal, reward-pool | 30% pool allocation math, agent claim + pool claim with receipt verification |
| `permit2-treasury-flow` | deal, permit2, treasury | Permit2 receive + spend operations |
| `deal-force-return` | deal, force-return | Force return capital after deadline |
| `deal-unstake-after-close` | deal, unstake, multi-deal | Close deal, both agents unstake, two deals in one DAC |

### Cross-DAC Investment

| Scenario | Tags | Description |
|----------|------|-------------|
| `dac-investment` | dac-deal, investment, dividends | Existing-token DAC invests in native DAC, two tranches, child-vote governance, dividends |

### Oracle & Hybrid Governance

| Scenario | Tags | Description |
|----------|------|-------------|
| `oracle-governance` | oracle, governance, merkle | Oracle merkle voting (3 voters), mixed voting (merkle + wrapped), governance config proposals, oracle swap |

### Raw/Module

| Scenario | Tags | Description |
|----------|------|-------------|
| `deal-raw-module` | deal, raw-module | Raw hex proposal type, module factory verification |

## Accounting Invariants

Four deal scenarios include cross-validation assertions via `verifyDealAccountingInvariants()`:

- `deal-eval-slash`
- `deal-eval-full-reward`
- `deal-strike-out`
- `deal-multi-milestone`

These verify:
- `sum(positions.currentStakedAmount) == deal.currentStakedAmount`
- `sum(positions.totalSlashedAmount) == deal.totalSlashedStakeAmount`
- `sum(positions.totalReleasedAmount) == deal.totalReleasedStakeAmount`
- `sum(positions.totalClaimedMainTokenAmount) == deal.totalRewardClaimedAmount`
- `deal.totalRewardClaimedAmount <= deal.totalRewardAllocatedAmount`
- Per-position: `current + slashed + released == totalStaked`

## Agent Reviewer

When `ANTHROPIC_API_KEY` is set, each scenario's step data (CLI outputs, indexer snapshots, assertion results) is sent to Claude for independent review. The reviewer checks data consistency, completeness, state transitions, and scaling/encoding issues.

## Architecture

```
packages/qa/src/
  config.ts           — Config parsing from env/flags
  runner.ts           — Scenario executor (sequential, no chain reset between runs)
  harness/
    harness.ts        — Test harness (cli, advanceTime, syncIndexer, assert)
    chain.ts          — EVM RPC helpers (advanceTime, mineBlock, snapshot)
    cli-exec.ts       — CLI process spawning
    indexer-sync.ts   — Indexer polling
    assertions.ts     — Assert API
    types.ts          — TypeScript interfaces
  scenarios/
    index.ts          — ALL_SCENARIOS registry
    fixtures/
      common.ts       — Shared helpers (proposeVoteExecute, transferErc20, mintMockToken, verifyDealAccountingInvariants, verifyTxReceipt)
      setup-native-dac-deal.ts — DAC + deal setup fixture
      merkle.ts       — Merkle tree builders (dividend + voting power)
      permit2.ts      — Permit2 helpers
    *.ts              — Individual scenario files
  review/
    reviewer.ts       — Claude API integration for agent review
```

## Adding a New Scenario

1. Create `packages/qa/src/scenarios/<name>.ts` exporting a `Scenario` object
2. Register in `packages/qa/src/scenarios/index.ts` (add to `ALL_SCENARIOS` array + named export)
3. Use existing fixtures (`setupNativeDacWithDeal`, `proposeVoteExecute`, etc.)
4. Add `verifyDealAccountingInvariants()` for deal scenarios that modify stake/reward state
5. Use `verifyTxReceipt()` for operations where the CLI doesn't check on-chain receipt status
