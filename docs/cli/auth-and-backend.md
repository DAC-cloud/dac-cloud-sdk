# Auth & Backend

The CLI talks to a **DAC Cloud backend** for every operation. The backend handles
RPC proxying, indexer access, manifest delivery, and session management. Every CLI
command must hold a valid JWT — anonymous calls are rejected at the proxy boundary.

## Architecture at a Glance

```
        ┌──────────────────────┐
        │   dac CLI / SDK      │
        └──────────┬───────────┘
                   │  Authorization: Bearer <jwt>
                   ▼
   ┌───────────────────────────────────┐
   │   DAC Cloud Backend (api.dac.cloud)│
   │                                    │
   │  /auth/{nonce, verify, me, logout} │  ← SIWE session lifecycle
   │  /discover                         │  ← cross-chain wallet inventory
   │  /manifest/{chainId}               │  ← deployed contract addresses
   │  /rpc/{chainId}     ──────────┐   │
   │  /graphql           ──────────┤   │
   └───────────────────────────────┼───┘
                                   │
              ┌────────────────────┴─────────────────────┐
              ▼                                          ▼
       ┌────────────┐                          ┌────────────────┐
       │  EVM RPC   │                          │ Envio Indexer  │
       │ (per chain)│                          │   (GraphQL)    │
       └────────────┘                          └────────────────┘
```

URLs are derived from `--api-url`:

| Resource | URL |
|----------|-----|
| Auth | `${apiUrl}/auth/...` |
| Discover | `${apiUrl}/discover?chainId=<id>` |
| Manifest | `${apiUrl}/manifest/${chainId}` |
| RPC | `${apiUrl}/rpc/${chainId}` |
| GraphQL | `${apiUrl}/graphql` |

The default `--api-url` is `https://api.dac.cloud`. For local dev set
`DAC_API_URL=http://localhost:3500` in `config.env`.

## Session Token Lifecycle

```
   nonce ──► sign ──► verify ──► JWT
                                  │
                                  ▼
                  ┌──────── stored in two places ────────┐
                  │                                       │
            config.env                            ~/.dac/auth/
       (DAC_AUTH_TOKEN /                      {chainId}-{wallet}.json
        DAC_AUTH_EXPIRES)
```

Tokens are kept in two places by design:

1. **`config.env`** — `DAC_AUTH_TOKEN` / `DAC_AUTH_EXPIRES`. Written by `auth login` and
   `auth verify`. Used as the **default** when the CLI runs against this config.
2. **`~/.dac/auth/{chainId}-{wallet}.json`** — Per-wallet cache. Used when a command
   overrides `--private-key` to a wallet that doesn't match the config token.

Both stores are validated against the backend (`GET /auth/me`) before use. If the backend
has revoked or doesn't know the token (e.g. after a backend redeploy or session DB wipe),
the CLI silently re-runs the SIWE flow rather than failing the command.

## `dac auth login`

Sign in with a private key the CLI can read. SIWE roundtrip is fully automatic.

```bash
dac auth login --config ./config.env
# optional: scope the session to specific DACs
dac auth login --dac 0x<dac1> --dac 0x<dac2>
```

Output:

```json
{
  "ok": true,
  "wallet": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "kind": "member",
  "expiresAt": "2026-06-17T...",
  "memberships": [
    {"dac": "0x...", "roles": ["main", "agent", "staked-agent"]}
  ]
}
```

The token is written into `DAC_AUTH_TOKEN` in the config file and cached under
`~/.dac/auth/`. Token TTL is **30 days** for member sessions (wallets with on-chain
membership) and **30 minutes** for guest sessions.

## `dac auth challenge` + `dac auth verify`

For wallets where the private key isn't available locally — hardware wallets, multisig
signers, browser extensions, custodial services.

```bash
# 1. Request the SIWE message
dac auth challenge --from 0x<wallet-address> --config ./config.env

# Message is printed to stderr (human-readable) AND to stdout (JSON for tooling).
# Sign it externally — e.g. with `cast wallet sign`, a hardware wallet, or a Safe.

# 2. Submit the signature
dac auth verify --from 0x<wallet-address> --signature 0x<hex-sig> --config ./config.env
```

The intermediate state is stored at `~/.dac/auth/challenge-{chainId}-{wallet}.json` and
removed after a successful verify.

## `dac auth status`

Probes `/auth/me` and prints the current session.

```bash
dac auth status --config ./config.env
```

Returns `{authenticated: false}` if the token is missing, expired, or revoked.

## `dac auth logout`

```bash
dac auth logout --config ./config.env
```

Calls `POST /auth/logout`, removes `DAC_AUTH_TOKEN`/`DAC_AUTH_EXPIRES` from the config
file, and deletes the matching `~/.dac/auth/` cache entry.

## Roles & Memberships

`memberships` on the session describes per-DAC roles the wallet holds at sign-in time:

| Role | Earned by |
|------|-----------|
| `main` | Wallet holds MainToken (or WrappedMainToken) > 0 |
| `agent` | Wallet holds AgentToken > 0 |
| `staked-agent` | Wallet has `currentStakedAmount > 0` in any deal of this DAC |
| `legal-wrapper` | Wallet equals the DAC's `legalWrapperAddress` |

Roles are computed server-side from the indexer and refreshed on each `auth login`.

## `dac discover`

Returns all DACs the current wallet is associated with across chains.

```bash
dac discover --config ./config.env --pretty-print
dac discover --chain-id 31337
```

Output:

```json
{
  "action": "discover",
  "wallet": "0x...",
  "chains": [31337, 84532],
  "byChain": {
    "31337": [
      {"chainId": 31337, "address": "0x...", "name": "Acme", "mode": "NATIVE",
       "roles": ["main"], "balances": {"main": "1000000000...", "walletAgent": null,
       "stakedAgent": null}}
    ]
  },
  "totalDacs": 1
}
```

Notes:
- `discover` works with **guest tokens** (no DAC scope required at sign-in), so a fresh
  wallet can discover memberships before scoping subsequent sessions.
- The CLI automatically promotes a guest token to a member token if you pass `--dac`
  on a later command and the cached session is still a guest.

## Dry-Run and Auth

`--dry-run` still needs a valid JWT — the RPC proxy is the same. The contexts differ
slightly:

| Mode | Requires `--private-key` | Requires `--from` | Auth route |
|------|--------------------------|-------------------|------------|
| `makeCoreContext` (write) | yes | no | private key → SIWE → JWT |
| `makeDryRunContext` (`--dry-run`) | no (either it OR `--from`) | yes if no private key | uses existing token; can use guest if discover-only flow |
| `makeIndexer` (read) | no | no | uses existing token; can run as guest |

If `--dry-run` is used **without** a private key, the wallet must already have a session
established (`dac auth login` previously, or `dac auth challenge`/`verify`).

## Config Token vs Cached Token

Order of resolution in `resolveAuthToken`:

1. `DAC_AUTH_TOKEN` in config — **if** it matches the active wallet (per JWT `sub` claim)
   **and** validates against `/auth/me`.
2. `~/.dac/auth/{chainId}-{wallet}.json` cache — **if** it validates.
3. Auto-login via SIWE — **if** the wallet has a usable private key.
4. Error: `No valid auth token. Run 'dac auth login' or 'dac auth challenge --from <address>'.`

The config-token check ensures that switching `--private-key` between commands works
correctly: an override wallet will use its own cached session, not the config wallet's.

Guest-to-member upgrade: if the config or cached token is a guest token and the current
command passes `--dac`, the CLI re-runs auto-auth with that DAC scope to obtain a
member-class token (longer TTL, full membership claims).

## Backend Errors and Retries

Most backend errors surface as `HTTP request failed. — "<reason>"` from viem's
`HttpRequestError`. Common causes:

| Message | Meaning | Fix |
|---------|---------|-----|
| `session not found or revoked` | JWT was issued by a backend that no longer has it (e.g. after redeploy) | The CLI auto-recovers in ~5ms via `/auth/me` re-validation; if not, run `dac auth login` |
| `Auth API error 401: invalid signature` | SIWE signature didn't match address | Verify `--from` matches the signer's address |
| `Auth API error 410: nonce expired` | More than ~5 min between `challenge` and `verify` | Re-run `dac auth challenge` |
| `manifest not found for chain X` | Backend doesn't have a manifest for that chain ID | Check `--chain-id`; ask backend ops to publish |

## Programmatic Use (SDK)

If you build with `@dac-cloud/core` directly, the auth flow is your responsibility. The
SDK exposes:

```typescript
import { createDacCoreClient } from "@dac-cloud/core";
import { fetchManifest } from "@dac-cloud/manifests";

const protocol = await fetchManifest(31337, "https://api.dac.cloud");
const core = createDacCoreClient({
  chain,
  rpcUrl: `https://api.dac.cloud/rpc/31337`,
  account,
  protocol,
  fetchOptions: { headers: { authorization: `Bearer ${jwt}` } },
});
```

The CLI's `packages/cli/src/auth/` module is a reference implementation if you want to
embed the SIWE flow in your own tool.
