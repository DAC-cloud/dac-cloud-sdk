# DAC Cloud SDK (Iteration 1)

This iteration includes:

- `@dac-cloud/manifests`: loaders for contracts deployment manifests.
- `@dac-cloud/core`: viem-based core client for DAC.cloud contracts.
- `@dac-cloud/cli`: load/stress helper CLI with concrete DAC-level proposal flows.

## Install and Build

```bash
npm install
npm run typecheck
npm run build
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
3. Add sdk-indexer package with generated GraphQL types.
