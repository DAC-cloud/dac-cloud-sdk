import {createPublicClient, getAddress, http, type Address, type Hex} from "viem";
import {setCode} from "../../harness/chain.js";
import type {QaConfig} from "../../harness/types.js";
import artifacts from "../../fixtures/erc20.json" with {type: "json"};

type Artifact = {abi: readonly unknown[]; bytecode: Hex; deployedBytecode: Hex};
const ARTIFACTS = artifacts as unknown as Record<"QaTreasuryUSD" | "QaSecondaryToken", Artifact>;

/**
 * Fixed addresses of the QA mock ERC-20s on local chains. The runtime bytecode is
 * installed there with `anvil_setCode` (see `ensureMockErc20Fixtures`), so the
 * addresses survive a fresh anvil / re-seed — unlike the mocks deployed by the
 * contracts-repo seed scripts, whose addresses shift with every deployment.
 */
export const QA_TREASURY_TOKEN_ADDRESS: Address = getAddress("0xdac0000000000000000000000000000000e20001"); // sUSD, 6 decimals
export const QA_SECONDARY_TOKEN_ADDRESS: Address = getAddress("0xdac0000000000000000000000000000000e20002"); // uWDAC, 18 decimals

const FIXTURES: ReadonlyArray<{address: Address; artifact: Artifact; label: string}> = [
  {address: QA_TREASURY_TOKEN_ADDRESS, artifact: ARTIFACTS.QaTreasuryUSD, label: "treasury token (sUSD)"},
  {address: QA_SECONDARY_TOKEN_ADDRESS, artifact: ARTIFACTS.QaSecondaryToken, label: "secondary token (uWDAC)"},
];

/**
 * Install the mock ERC-20 runtime bytecode at the fixed fixture addresses.
 * Local chains only; idempotent (skips when code is already there). Only the
 * tokens the config actually points at are installed, so env overrides to
 * other addresses are left alone.
 */
export async function ensureMockErc20Fixtures(config: QaConfig, log: (msg: string) => void = () => {}): Promise<void> {
  if (!config.isLocalChain) return;
  const client = createPublicClient({transport: http(config.localRpcUrl)});
  const configured = [config.tokens.treasury, config.tokens.secondary]
    .filter((a): a is string => Boolean(a))
    .map((a) => a.toLowerCase());
  for (const {address, artifact, label} of FIXTURES) {
    if (!configured.includes(address.toLowerCase())) continue;
    const code = await client.getCode({address});
    if (code && code !== "0x") continue;
    log(`Installing QA mock ${label} at ${address}`);
    await setCode(config, address, artifact.deployedBytecode);
  }
}
