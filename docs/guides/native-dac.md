# Guide: Native DAC Lifecycle

This guide walks through the complete lifecycle of a native DAC — from creation to governance to deal management.

## 1. Create the DAC

```bash
dac create \
  --name "Acme Capital DAC" \
  --description "A capital allocation DAC" \
  --symbol "ACME" \
  --max-supply 10000000000000000000000000 \
  --default-quorum 50 \
  --allocation 1000000000000000000000000 \
  --treasury-token 0x<usdc-address> \
  --commitment 0 \
  --auto-delegate \
  --config ./config.env \
  --pretty-print
```

This deploys:
- **DACCell** — The micro-kernel contract
- **MainToken** — ERC20Votes governance token
- **AgentToken** — Non-transferable operator token
- **DealManager** — Deal lifecycle manager
- **AssetController** — Treasury custody

The creator receives the initial `allocation` of MainToken and auto-delegates to themselves.

## 2. Delegate Voting Power

If you didn't use `--auto-delegate`, delegate manually:

```bash
dac delegate --delegatee 0x<your-address> --dac 0x<dac>
```

## 3. Mint Agent Tokens

Agent tokens allow operators to stake into deals. Minting requires DAC governance:

```bash
# Propose
dac propose mint-agent-tokens 100000000000000000000000 0x<agent> \
  --dac 0x<dac> --config ./config.env

# Vote (after voting delay)
dac vote proposal 1 true --dac 0x<dac> --config ./config.env

# Execute (after voting period)
dac execute 1 --dac 0x<dac> --config ./config.env
```

## 4. View DAC State

```bash
# DAC details
dac view dac --dac 0x<dac>

# List proposals
dac view proposals --dac 0x<dac>

# List deals
dac view deals --dac 0x<dac>
```

## 5. Create and Manage Deals

See [Deal Lifecycle Guide](./deal-lifecycle.md) for the full deal flow.

## 6. Treasury Management

### Deposit funds

```bash
dac deposit-treasury --token 0x<usdc> --amount 5000000000000000000000 \
  --dac 0x<dac> --auto-approve
```

### Recover treasury accounting

```bash
dac recover-treasury --token 0x<usdc> --dac 0x<dac>
```

## Related

- [Deal Lifecycle](./deal-lifecycle.md)
- [Governance Guide](../cli/governance.md)
- [DAC Commands Reference](../cli/dac-commands.md)
