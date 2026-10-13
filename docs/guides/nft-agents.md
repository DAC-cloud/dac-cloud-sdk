# NFT Agents (ERC-6551 Token-Bound Accounts)

An NFT can operate a DAC through its **token-bound account** (ERC-6551): a smart
account whose owner is whoever holds the NFT. The account is the protocol actor — it
holds agent tokens, stakes, votes, proposes and earns — while the NFT owner's wallet
signs. Nothing in the protocol changes: the account is just another `msg.sender`.

Reference deployment: Loopers on Base (`0x1649cd37f4748807b4882fc48765ba0b2affa94a`),
whose activated wallets are ERC-6551 accounts created through the canonical registry
with the collection's own implementation (`0xf192…486e`) and salt.

## How it works

```
NFT owner (EOA, signs)  ──►  account.execute(to, 0, calldata, CALL)  ──►  DACCell / Deal / tokens
                              msg.sender = token-bound account
```

- **Writes**: every CLI/SDK write is wrapped in `execute(...)` on the account. The
  account implementation accepts it only from the NFT owner (`isValidSigner`).
- **Auth**: the backend session wallet is the *account*. The owner signs the SIWE
  message and the backend verifies it through the account's ERC-1271
  `isValidSignature`. For an account that is not deployed yet, the CLI wraps the
  signature in ERC-6492 (registry + `createAccount` calldata), which the backend
  accepts.
- **Membership**: roles (`main`, `agent`, `staked-agent`, …) are evaluated on the
  account's balances, so the account must hold DAC tokens before a member session
  (`--dac` scoped) can be issued. Guest sessions work before that.
- **Reads** are unaffected.

## CLI

Two ways to name the account (global flags, also as `DAC_TBA` / `DAC_NFT` in config):

| Flag | Meaning |
|------|---------|
| `--tba <address>` | Use this account. The CLI verifies it is deployed and that the signer is a valid signer for it. |
| `--nft <contract:tokenId>` | Derive the account from the NFT with `--tba-implementation` (default: reference implementation `0x41C8…44eC`), `--tba-salt` (default: zero) and `--tba-registry` (default: canonical). Off-chain derivation, no RPC. |

For Loopers the implementation and salt are collection-specific, so either pass the
activated wallet with `--tba`, or `--nft 0x1649…a94a:<id> --tba-implementation 0xf192f350427c8f58bc28e78b1e6af164279f486e --tba-salt <salt>`.

```bash
# What account does this NFT map to? (pure derivation)
dac tba address --nft 0x<collection>:370

# Deployment, bound token, owner, and whether my key may act for it
dac tba info --tba 0x84057bB15AC43370737ecc24931A22B78fbfa22e --private-key 0x<owner>

# Deploy the account through the registry (permissionless, signed by the plain EOA)
dac tba create --nft 0x<collection>:370 --private-key 0x<owner>

# Log in as the account (owner signs)
dac auth login --nft 0x<collection>:370 --dac 0x<dac> --private-key 0x<owner>

# Act as the account: it is the staker / voter / proposer
dac deal stake 20000000000000000000000 --deal-cell 0x<cell> --dac 0x<dac> --auto-delegate --nft 0x<collection>:370 --private-key 0x<owner>
dac deal vote proposal 3 true --deal-address 0x<deal> --nft 0x<collection>:370 --private-key 0x<owner>
```

Every "self" default follows the account: `--delegatee` defaults, wrap/unwrap
recipients, the `join` capital-call recipient, `deal create` proposer, allowance
checks, and the `caller`/`staker`/`creator` output fields.

### Dry-run mode (no private key)

```bash
dac deal propose toggle-early-returns true --deal-address 0x<deal> \
  --nft 0x<collection>:370 --dry-run --from 0x<owner>
```

emits an unsigned transaction `{to: <account>, data: execute(...), from: <owner>}`
for an external signer. A valid session for the account is still required (log in
once with `dac auth login --nft …`, or `dac auth challenge --from <account>` and verify
with the owner's signature). A configured `DAC_PRIVATE_KEY` that is not the `--from`
owner is ignored for the session, since only the owner's signature is accepted.

### Control follows the NFT

When the NFT is transferred, the previous owner is refused (`not a valid signer` /
the account rejects their signature) and the new owner can act immediately, with the
same account address, stake and voting power.

## SDK

```ts
const core = createDacCoreClient({
  chain, rpcUrl, protocol, account: ownerAccount,
  executor: {kind: "erc6551", account: "0x8405…a22e"},
});
core.actor;                         // the account
await core.stakeAgentToDeal({...}); // sent as account.execute(...)

const builder = createDacTransactionBuilder({chainId, fromAddress: owner, protocol, executor});
builder.createDealManagementProposal({...}); // {to: account, data: execute(...)}

computeErc6551AccountAddress({implementation, salt, chainId, tokenContract, tokenId});
await core.getErc6551AccountInfo({account});
await core.isErc6551ValidSigner({account, signer});
await core.createErc6551Account({implementation, salt, chainId, tokenContract, tokenId}); // direct, not through the executor
```

ABIs: `erc6551RegistryAbi`, `erc6551AccountAbi`, `erc721Abi`. Constants:
`ERC6551_REGISTRY_ADDRESS`, `ERC6551_REFERENCE_IMPLEMENTATION`, `ERC6551_ZERO_SALT`.

## Local testing

The QA harness installs the canonical registry and the reference implementation at
their mainnet addresses on anvil (`anvil_setCode`) and deploys a mintable mock
collection, so `--nft` with default derivation behaves exactly as on Base. See
`packages/qa/fixtures/erc6551/README.md` and the `tba-agent-lifecycle` scenario.
