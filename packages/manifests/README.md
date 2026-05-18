# `@dac-cloud/manifests`

Per-chain protocol manifest types and HTTP loader for the DAC Cloud SDK.

A **protocol manifest** is a JSON document that maps a single EVM chain to the deployed
addresses of every DAC Cloud contract (factories, implementations, evaluators, modules,
plus shared addresses like `permit2`).

## Install

```bash
npm install @dac-cloud/manifests
```

## Usage

```typescript
import { fetchManifest, type ProtocolManifest } from "@dac-cloud/manifests";

const protocol: ProtocolManifest = await fetchManifest(31337, "https://api.dac.cloud");
// protocol.dacFactory, protocol.coreModuleFactory, protocol.permit2, ...
```

`fetchManifest(chainId, apiUrl)` issues `GET ${apiUrl}/manifest/${chainId}`, validates
required fields, and returns the typed manifest. Throws on missing manifest, network
error, or schema violation.

## What's in a Manifest

```typescript
interface ProtocolManifest {
  chainId: number;

  // Required core (3):
  dacFactory: `0x${string}`;
  coreModuleFactory: `0x${string}`;
  permit2: `0x${string}`;

  // 40 optional address fields — factories and implementations for every
  // DAC component (DAC cell, deal cell, deal, evaluators, modules, ...).
  // Plus optional metadata: blockNumber, deployer.
}
```

Exported helpers:

- `PROTOCOL_MANIFEST_CORE_ADDRESS_KEYS` — the 3 required core keys
- `PROTOCOL_MANIFEST_ADDRESS_KEYS` — all 43 address keys
- `isProtocolAddress(value)` — type guard for `0x...` 20-byte hex
- `requireProtocolAddress(manifest, key)` — typed getter that throws if a field is missing

## Loader Behavior

- **Network-only**: no local-file loader, no bundled manifest. Always fetched from a
  running backend.
- **Per-chain**: one fetch per chain. Multi-chain consumers call `fetchManifest` once
  per chain.
- **Validation**: `chainId` is an integer, all 3 core addresses are valid hex; optional
  fields are validated only when present.

## Used By

- `@dac-cloud/core` — `createDacCoreClient` and `createDacTransactionBuilder` require a
  `ProtocolManifest` in their options.
- `@dac-cloud/cli` — the CLI runtime fetches a manifest per command via `--api-url` +
  `--chain-id`.

## Documentation

[Manifests](../../docs/sdk/manifests.md) — full schema, multi-chain patterns, integration.

## Build

```bash
npm install
npm run build
npm run typecheck
```
