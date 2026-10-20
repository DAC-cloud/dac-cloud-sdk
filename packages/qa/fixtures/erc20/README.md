# Mock ERC-20 QA fixtures

Sources behind `packages/qa/src/fixtures/erc20.json`.

`QaMintableERC20.sol` holds two permissionless-mint ERC-20s whose `name`/`symbol`/
`decimals` are compiled into the bytecode (pure overrides, no constructor storage).
That lets the harness install the runtime bytecode with `anvil_setCode` at fixed
addresses on every fresh local chain, so QA no longer depends on whatever address the
contracts-repo seed scripts happened to deploy their mocks at:

| Contract           | Symbol  | Decimals | Address                                      |
|--------------------|---------|----------|----------------------------------------------|
| `QaTreasuryUSD`    | `sUSD`  | 6        | `0xDaC0000000000000000000000000000000e20001` |
| `QaSecondaryToken` | `uWDAC` | 18       | `0xdAc0000000000000000000000000000000E20002` |

`DAC_TREASURY_TOKEN` / `DAC_SECONDARY_TOKEN` in the repo-root `.env` still override
these (e.g. on a testnet).

Rebuild after editing (needs forge and the OpenZeppelin checkout of
`../dac-cloud-contracts`):

```bash
cd packages/qa/fixtures/erc20
ln -sfn ../../../../../../dac-cloud-contracts/lib/openzeppelin-contracts lib/openzeppelin-contracts
forge build
node -e '
const fs=require("fs");const out={};
for (const n of ["QaTreasuryUSD","QaSecondaryToken"]) {
  const j=JSON.parse(fs.readFileSync(`out/QaMintableERC20.sol/${n}.json`));
  out[n]={abi:j.abi,bytecode:j.bytecode.object,deployedBytecode:j.deployedBytecode.object};
}
fs.writeFileSync("../../src/fixtures/erc20.json", JSON.stringify(out,null,1)+"\n");'
```
