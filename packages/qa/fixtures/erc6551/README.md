# ERC-6551 QA fixtures

Sources behind `packages/qa/src/fixtures/erc6551.json`:

- `ERC6551Registry.sol` — the canonical registry, verbatim from
  [erc6551/reference](https://github.com/erc6551/reference). On local chains the
  harness installs its runtime bytecode at the canonical address
  `0x000000006551c19487814612e58FE06813775758` (`anvil_setCode`), so account
  derivation matches mainnet.
- `ERC6551Account.sol` — the reference "simple" account implementation
  (`execute` gated by the NFT owner, ERC-1271 by the owner). Installed at the
  reference address `0x41C8f39463A868d3A88af00cd0fe7102F30E44eC`, the CLI's
  `--nft` default.
- `MockERC721.sol` — stand-in collection with permissionless `mint(to, tokenId)`.

Rebuild after editing (needs forge and the OpenZeppelin checkout of
`../dac-cloud-contracts`):

```bash
cd packages/qa/fixtures/erc6551
ln -sfn ../../../../../../dac-cloud-contracts/lib/openzeppelin-contracts lib/openzeppelin-contracts
forge build
node -e '
const fs=require("fs");const out={};
for (const n of ["ERC6551Registry","ERC6551Account","MockERC721"]) {
  const j=JSON.parse(fs.readFileSync(`out/${n}.sol/${n}.json`));
  out[n]={abi:j.abi,bytecode:j.bytecode.object,deployedBytecode:j.deployedBytecode.object};
}
fs.writeFileSync("../../src/fixtures/erc6551.json", JSON.stringify(out,null,1)+"\n");'
```
