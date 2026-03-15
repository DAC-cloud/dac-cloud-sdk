# DAC Cloud SDK (Iteration 1)

This iteration includes:

- `@dac-cloud/manifests`: loaders for contracts deployment manifests.
- `@dac-cloud/core`: viem-based core client for DAC.cloud contracts.
- `@dac-cloud/cli`: load/stress helper CLI (currently `create-dacs`).

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

Defaults:

- chain id `31337`
- private key = Anvil account #0
- treasury token from `basic-dac-seed.json` if available

## Next Iteration Candidates

1. Add transaction recipes for governance + deals (module-aware).
2. Add batch scenario templates in CLI (deals, tranches, votes).
3. Add sdk-indexer package with generated GraphQL types.
