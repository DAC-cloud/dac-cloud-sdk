# DAC Cloud SDK (Iteration 1)

This iteration includes:

- `@dac-cloud/manifests`: loaders for contracts deployment manifests.
- `@dac-cloud/core`: viem-based core client for DAC.cloud contracts.
- `@dac-cloud/indexer`: typed GraphQL query client facade for DAC/Deal read-model access.
- `@dac-cloud/cli`: load/stress helper CLI with concrete DAC-level proposal flows.

## Install and Build

```bash
npm install
npm run typecheck
npm run build
```

## Indexer Codegen

`@dac-cloud/indexer` now uses GraphQL Code Generator with typed documents generated from the live GraphQL endpoint.

```bash
INDEXER_SCHEMA_URL=http://127.0.0.1:8080/v1/graphql \
  npm run codegen --workspace @dac-cloud/indexer
```

## CLI Quickstart

```bash
node packages/cli/dist/index.js create-dacs \
  --count 5 \
  --contracts-root /home/iliao/git/dac-cloud-contracts \
  --rpc-url http://127.0.0.1:8545
```

Delegate DAC MainToken votes to founder wallet:

```bash
node packages/cli/dist/index.js delegate-main \
  --dac 0xYourDacCellAddress \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Create, vote, and execute a DAC proposal to mint agent tokens:

```bash
node packages/cli/dist/index.js mint-agent-tokens \
  --dac 0xYourDacCellAddress \
  --agent 0xAgentWalletAddress \
  --amount 1000000000000000000 \
  --pre-vote-advance-seconds 1 \
  --advance-seconds 604801 \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Revoke agent tokens via DAC proposal:

```bash
node packages/cli/dist/index.js revoke-agent-tokens \
  --dac 0xYourDacCellAddress \
  --agent 0xAgentWalletAddress \
  --amount 1000000000000000000 \
  --pre-vote-advance-seconds 1 \
  --advance-seconds 604801 \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Mint/Burn DAC treasury main-token reserve:

```bash
node packages/cli/dist/index.js mint-main-reserve \
  --dac 0xYourDacCellAddress \
  --amount 1000000000000000000 \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js burn-main-reserve \
  --dac 0xYourDacCellAddress \
  --amount 1000000000000000000 \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Capital call flow (phase 1: propose + vote + execute):

```bash
node packages/cli/dist/index.js capital-call-propose \
  --dac 0xYourDacCellAddress \
  --recipient 0xRecipientAddress \
  --treasury-token 0xTreasuryToken \
  --token-amount 1000000000000000000 \
  --cash-amount 0 \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Capital call flow (phase 2: fulfill, usually from another wallet):

```bash
node packages/cli/dist/index.js capital-call-fulfill \
  --dac 0xYourDacCellAddress \
  --treasury-token 0xTreasuryToken \
  --recipient 0xRecipientAddress \
  --token-amount 1000000000000000000 \
  --cash-amount 0 \
  --nonce 11 \
  --private-key 0xAnotherWalletPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Recover treasury accounting snapshot for token:

```bash
node packages/cli/dist/index.js recover-treasury \
  --dac 0xYourDacCellAddress \
  --token 0xTokenAddress \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Deposit treasury through `DACCell.depositTreasury`:

```bash
node packages/cli/dist/index.js deposit-treasury \
  --dac 0xYourDacCellAddress \
  --token 0xTokenAddress \
  --amount 1000000000000000000 \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

`depositTreasury` note: in current contracts this path is restricted to registered deal callers, not plain EOAs.

Delegate vote rights from DAC treasury holdings via governance proposal:

```bash
node packages/cli/dist/index.js delegate-vote-rights-proposal \
  --dac 0xYourDacCellAddress \
  --token 0xVotesTokenAddress \
  --delegatee 0xDelegateeAddress \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Create a treasury deal proposal:

```bash
node packages/cli/dist/index.js create-treasury-deal \
  --dac 0xYourDacCellAddress \
  --funding-token 0xUsdcAddress \
  --funding-amount 10000000 \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Stake and delegate StakedAgent votes:

```bash
node packages/cli/dist/index.js stake-agent-to-deal \
  --dac 0xYourDacCellAddress \
  --deal-cell 0xDealCell \
  --amount 20000 \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js delegate-stake \
  --deal-cell 0xDealCell \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Request a new tranche from deal governance:

```bash
node packages/cli/dist/index.js request-tranche \
  --deal 0xDealAddress \
  --token 0xUsdcAddress \
  --amount 5000 \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Approve tranche on DAC governance (using `dacProposalId` returned by `request-tranche`):

```bash
node packages/cli/dist/index.js approve-tranche \
  --dac 0xYourDacCellAddress \
  --proposal-id 17 \
  --advance-seconds 604801 \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Treasury deal proposal actions (deal-level governance):

```bash
node packages/cli/dist/index.js treasury-direct-spend \
  --deal 0xDealAddress \
  --token 0xUsdcAddress \
  --destination 0xRecipient \
  --amount 1000000 \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js treasury-permit2-spend \
  --deal 0xDealAddress \
  --token 0xUsdcAddress \
  --spender 0xPermit2Spender \
  --amount 1000000 \
  --expiration 1893456000 \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js treasury-return-capital \
  --deal 0xDealAddress \
  --token 0xUsdcAddress \
  --amount 1000000 \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js treasury-approve-agent-spend \
  --deal 0xDealAddress \
  --token 0xUsdcAddress \
  --agent 0xAgent \
  --destination 0xCounterpartyOrZero \
  --total-amount 1000000 \
  --single-tx-amount 100000 \
  --clock-limit 0 \
  --duration 3600 \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js treasury-assign-claimer \
  --deal 0xDealAddress \
  --agent 0xAgent \
  --token 0xUsdcAddress \
  --counterparty 0xSourceOrZero \
  --amount 1000000 \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js treasury-revoke-agent \
  --deal 0xDealAddress \
  --token 0xUsdcAddress \
  --agent 0xAgent \
  --counterparty 0xCounterpartyOrZero \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js treasury-delegate-vote-rights \
  --deal 0xDealAddress \
  --token 0xVotesToken \
  --delegatee 0xDelegatee \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Child DAC deal minimal flows:

```bash
# 1) Create child DAC governance proposal through parent deal
node packages/cli/dist/index.js child-dac-create-proposal \
  --deal 0xChildDealAddress \
  --child-typ 0x12345678 \
  --child-target 0x0000000000000000000000000000000000000000 \
  --child-i 0 \
  --child-data 0x \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

# 2) Vote/execute spawned parent-deal proposal (returned as spawnedChildVoteDealProposalId)
node packages/cli/dist/index.js deal-proposal-vote-execute \
  --deal 0xChildDealAddress \
  --proposal-id 42 \
  --advance-seconds 604801 \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

# Direct child vote action proposal (creates a new vote proposal in parent deal)
node packages/cli/dist/index.js child-dac-vote-proposal \
  --deal 0xChildDealAddress \
  --child-proposal-id 7 \
  --support true \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js child-dac-return-profits \
  --deal 0xChildDealAddress \
  --token 0xToken \
  --amount 1000000 \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts

node packages/cli/dist/index.js child-dac-reinvest-profits \
  --deal 0xChildDealAddress \
  --token 0xToken \
  --amount 1000000 \
  --capital-call-hash 0x0000000000000000000000000000000000000000000000000000000000000000 \
  --stake-token 0xStakedAgentToken \
  --private-key 0xAgentPrivateKey \
  --contracts-root /home/iliao/git/dac-cloud-contracts
```

Indexer read commands:

```bash
node packages/cli/dist/index.js view-dac \
  --address 0xYourDacCellAddress \
  --indexer-url http://127.0.0.1:8080/v1/graphql

node packages/cli/dist/index.js view-deal \
  --address 0xDealAddress \
  --indexer-url http://127.0.0.1:8080/v1/graphql

node packages/cli/dist/index.js view-proposals \
  --dac-address 0xYourDacCellAddress \
  --limit 20 \
  --indexer-url http://127.0.0.1:8080/v1/graphql

node packages/cli/dist/index.js view-capital-calls \
  --dac-address 0xYourDacCellAddress \
  --indexer-url http://127.0.0.1:8080/v1/graphql

node packages/cli/dist/index.js view-treasury-actions \
  --deal-address 0xDealAddress \
  --indexer-url http://127.0.0.1:8080/v1/graphql
```

Defaults:

- chain id `31337`
- private key = Anvil account #0
- treasury token from `basic-dac-seed.json` if available
- if proposal execution mints new MainToken supply, run `delegate-main` again to refresh active vote weight on `ERC20Votes`
- CLI now decodes known DAC/OZ custom error selectors via `formatViemError` for more readable revert output

Core module namespace:

- import `coreModule` from `@dac-cloud/core` for Core module selectors/types/encoders:
- `coreModule.CORE_DEAL_KIND`
- `coreModule.CORE_EVALUATOR_KIND`
- `coreModule.CORE_DEAL_MANAGEMENT_PROPOSAL_TYPE`
- `coreModule.buildMilestoneEvaluatorConfig(...)`
- `coreModule.buildRevenueEvaluatorConfig(...)`

## Next Iteration Candidates

1. Add transaction recipes for governance + deals (module-aware).
2. Add batch scenario templates in CLI (deals, tranches, votes).
3. Add proposals/capital-calls/treasury query facade coverage in `@dac-cloud/indexer`.
