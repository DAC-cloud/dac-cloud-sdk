# Guide: Native DAC Lifecycle

End-to-end walkthrough for a native DAC — fresh MainToken/AgentToken pair, founder
allocation up front, straightforward governance.

> **Prerequisites**: an active session (`dac auth login`) and a `config.env` with
> `DAC_PRIVATE_KEY` and `DAC_API_URL`. See [Getting Started](../getting-started.md).

## 1. Create the DAC

```bash
dac create \
  --name "Acme Capital DAC" \
  --description "A capital allocation DAC" \
  --symbol "ACME" \
  --max-supply 10000000000000000000000000 \
  --default-quorum 50 \
  --allocation 1000000000000000000000000 \
  --treasury-token 0x<usdc-or-erc20> \
  --commitment 0 \
  --auto-delegate \
  --config ./config.env --pretty-print
```

This deploys:

- **DACCell** — the micro-kernel (identity, proposal routing, treasury custody)
- **MainToken** (ERC20Votes)
- **AgentToken** (non-transferable)
- **DealManager**, **AssetController**, **GovernanceSchema**

The founder receives the initial `--allocation` of MainToken and auto-delegates to
themselves (`--auto-delegate`).

Response:

```json
{
  "action": "dac.create",
  "dac": "0x...",
  "mainToken": "0x...",
  "agentToken": "0x...",
  "dealManager": "0x...",
  "assetController": "0x...",
  "txHash": "0x..."
}
```

Save the `dac` address — most subsequent commands need it.

## 2. Delegate Voting Power (if you skipped `--auto-delegate`)

```bash
dac delegate --delegatee 0x<your-address> --dac 0x<dac>
```

## 3. Mint AgentTokens to Operators

AgentTokens are required for staking into deals. Minting goes through DAC governance:

```bash
# Propose
dac propose mint-agent-tokens 100000000000000000000000 0x<agent> \
  --dac 0x<dac> --config ./config.env --pretty-print

# Vote (founder has enough power to pass alone in our example)
dac vote proposal 1 true --dac 0x<dac>

# Execute (do it promptly — see governance validity window)
dac execute 1 --dac 0x<dac>
```

For a real DAC with multiple voters, see [Governance → Multi-Voter Quorum Patterns](../cli/governance.md#multi-voter-quorum-patterns).

## 4. Inspect State via the Indexer

```bash
dac view dac --dac 0x<dac>            # full DAC details
dac view proposals --dac 0x<dac>      # proposal history
dac view deals --dac 0x<dac>          # deal history
dac view account 0x<wallet>           # per-wallet holdings + positions
```

All views return JSON; pipe through `jq` or use `--pretty-print` for human reading.

## 5. Treasury Management

### Deposit funds

`deposit-treasury` does ERC20 transfer + accounting recovery in one step:

```bash
dac deposit-treasury --token 0x<usdc> --amount 5000000000000000000000 \
  --dac 0x<dac> --auto-approve
```

### Reconcile after manual transfers

If tokens were sent to the AssetController directly (bypassing `deposit-treasury`), reconcile:

```bash
dac recover-treasury --token 0x<usdc> --dac 0x<dac>
```

### View treasury

```bash
dac view treasury-holdings --dac 0x<dac>
dac view treasury-movements --dac 0x<dac>
```

## 6. Issue a Capital Call

Capital calls let the DAC request funds from a specific recipient (e.g. an investor
wallet or parent contract). The capital call nonce equals the proposal ID that created
it.

```bash
dac propose capital-call 0x<recipient> 0x<treasury-token> 1000000000000000000000 0 \
  --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>
```

The recipient fulfills the call with `dac join`:

```bash
dac join --dac 0x<dac> --auto-approve
# All fields auto-resolved from the indexer; or specify --recipient --treasury-token
# --token-amount --cash-amount --nonce explicitly.
```

## 7. Create and Manage Deals

Once agents have AgentTokens, you can launch deals. See the
[Deal Lifecycle Guide](./deal-lifecycle.md) for the full flow:

```bash
dac deal create ./deal.json --dac 0x<dac>
# ... DAC vote to approve ...
dac deal invite 0x<agent> --deal 0x<deal>
dac deal stake 10000000000000000000000 \
  --deal 0x<deal> --dac 0x<dac> --auto-delegate --auto-approve
```

## 8. Dividends (Optional)

To enable dividends, propose `toggle-dividends true` at creation or later. Then issue a
dividend payout by Merkle root:

```bash
# 1. Generate a Merkle tree off-chain (one leaf per recipient)
# 2. Compute the root and propose payout
dac propose dividend-payout 0x<token> 1000000000000000000000 0x<merkleRoot> --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>

# 3. Recipients claim with their proof
dac claim-dividend ./proof.json --config ./config.env
```

The treasury must hold the dividend token before the proposal — for native DACs this
typically means a prior `deposit-treasury`.

Proof JSON format:

```json
{
  "proposalId": "12",
  "index": "0",
  "receiver": "0x...",
  "amount": "1000000000000000000",
  "proof": ["0x...", "0x..."]
}
```

`claim-dividend` is **permissionless** — anyone can submit a valid proof; tokens go to
`receiver`. Useful for claiming on behalf of smart-contract recipients.

## 9. Legal Wrapper (Optional)

If your DAC has a legal entity (LLC, foundation, etc.):

```bash
# 1. Set the legal-wrapper address via governance (high quorum)
dac propose update-legal-wrapper --input ./legal-wrapper.json --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>

# 2. The legal-wrapper EOA can now send messages
dac legal-message ./msg.json --dac 0x<dac> --private-key 0x<legal-wrapper-key>
```

After this, the legal-wrapper wallet's `dac auth login` returns `legal-wrapper` in its
`memberships` roles for this DAC.

`update-legal-wrapper` input JSON:

```json
{
  "wrapperAddress": "0x...",
  "operatingAgreementIpfs": "ipfs://Qm...",
  "registeredAgent": "0x..."
}
```

Message JSON:

```json
{ "kind": "0x12345678", "message": "0x<hex-bytes>" }
```

## Related

- [Deal Lifecycle Guide](./deal-lifecycle.md)
- [Existing-Token DAC Guide](./existing-token-dac.md) — for wrapping an existing ERC20
- [Governance Guide](../cli/governance.md) — validity windows, multi-voter quorum
- [DAC Commands Reference](../cli/dac-commands.md)
