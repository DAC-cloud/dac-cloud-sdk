# CLI Overview

The `dac` CLI provides complete access to the DAC Cloud protocol. Commands are organized into two levels:

- **DAC commands** — `dac <command>` for DAC-level operations
- **Deal commands** — `dac deal <command>` for deal-level operations

## Command Structure

```
dac
  create                 Deploy a native DAC
  create-existing-token  Deploy an existing-token DAC
  join                   Fulfill a capital call
  delegate               Delegate MainToken votes
  wrap / unwrap          Token wrapping (existing-token DACs)
  propose                Create DAC governance proposals
  vote proposal          Vote on proposals
  execute                Execute passed proposals
  deposit-treasury       Deposit funds to DAC treasury
  recover-treasury       Recover treasury accounting
  claim-dividend         Claim dividends via Merkle proof
  legal-message          Send legal wrapper message
  oracle                 Oracle management (deploy, publish, etc.)
  view                   Query DAC state from indexer

  deal
    create               Create a deal from JSON config
    invite               Whitelist an agent for staking
    stake                Stake AgentTokens into a deal
    unstake              Unstake after deal close/permit
    delegate             Delegate StakedAgent voting power
    request              Request stake (approve flow)
    propose              Create deal governance proposals
    vote proposal        Vote on deal proposals
    execute              Execute deal proposals
    evaluate             Trigger milestone evaluation
    claim                Claim MainToken rewards
    withdraw             Force return capital after deadline
    legal-message        Send deal legal message
    view                 Query deal state from indexer
```

## Common Patterns

### DAC Selector

Most DAC commands accept these options to identify the target DAC:

```
--dac <address>          DAC address (most common)
--dac-address <address>  Alias for --dac
--cell-address <address> DACCell contract address
```

### Deal Selector

All deal commands accept a unified set of deal selectors. You can pass **any** of these — the CLI resolves the correct internal address (deal contract vs cell) automatically:

```
--deal <address>         Deal or cell address
--deal-address <address> Deal or cell address
--deal-cell <address>    Cell address
--deal-id <id>           Indexer deal ID or numeric ID (with --dac)
```

This means you never need to worry about whether a command needs the "deal address" or the "cell address" — pass either one and the CLI handles it.

### Governance Flow

All governance follows the same three-step pattern:

```bash
# 1. Propose
dac propose <type> [args...] --dac 0x...

# 2. Vote (after voting delay)
dac vote proposal <id> true --dac 0x...

# 3. Execute (after voting period)
dac execute <id> --dac 0x...
```

The same pattern applies to deal governance with `dac deal propose/vote/execute`.

See [Governance Guide](./governance.md) for details.

## Global Options

| Option | Description |
|--------|-------------|
| `--config <path>` | Path to config.env file |
| `--private-key <hex>` | Wallet private key (overrides config) |
| `--rpc-url <url>` | EVM RPC endpoint |
| `--indexer-url <url>` | Envio indexer GraphQL endpoint |
| `--chain-id <number>` | Target chain ID |
| `--pretty-print` | Format JSON output |
| `--dry-run` | Preview transaction without sending |
| `--from <address>` | Sender address (for dry-run mode) |

## Related

- [DAC Commands Reference](./dac-commands.md)
- [Deal Commands Reference](./deal-commands.md)
- [Getting Started](../getting-started.md)
