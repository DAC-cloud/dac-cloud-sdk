import {
  computeErc6551AccountAddress,
  ERC6551_REFERENCE_IMPLEMENTATION,
  ERC6551_REGISTRY_ADDRESS,
  ERC6551_ZERO_SALT,
  erc6551RegistryAbi,
  type DacCoreClient,
  type TxExecutor,
} from "@dac-cloud/core";
import {encodeFunctionData, serializeErc6492Signature, type Address, type Hex} from "viem";
import {asAddress, asBytes32} from "../actions/shared";
import type {OptionResolver} from "./config";

export interface NftRef {
  tokenContract: Address;
  tokenId: bigint;
}

/**
 * The ERC-6551 account a command acts through, from `--tba <address>` or
 * `--nft <contract:tokenId>` (+ `--tba-implementation` / `--tba-salt` /
 * `--tba-registry`). Config keys: DAC_TBA, DAC_NFT, DAC_TBA_IMPLEMENTATION, ...
 */
export interface TbaSpec {
  account: Address;
  source: "tba" | "nft";
  nft?: NftRef;
  implementation: Address;
  salt: Hex;
  registry: Address;
}

export function parseNftRef(raw: string): NftRef {
  const match = raw.trim().match(/^(0x[a-fA-F0-9]{40})[:#/](\d+)$/);
  if (!match) {
    throw new Error(`Invalid --nft value "${raw}". Expected <contract>:<tokenId>, e.g. 0x1649...a94a:370`);
  }
  return {tokenContract: asAddress(match[1], "NFT contract"), tokenId: BigInt(match[2])};
}

/** Account derivation inputs; defaults are the reference implementation, zero salt, canonical registry. */
export function resolveTbaDerivation(resolver: OptionResolver): {implementation: Address; salt: Hex; registry: Address} {
  const implementationRaw = resolver.resolveString("tba-implementation");
  const saltRaw = resolver.resolveString("tba-salt");
  const registryRaw = resolver.resolveString("tba-registry");
  return {
    implementation: implementationRaw ? asAddress(implementationRaw, "TBA implementation") : ERC6551_REFERENCE_IMPLEMENTATION,
    salt: saltRaw ? (asBytes32(saltRaw, "TBA salt") as Hex) : ERC6551_ZERO_SALT,
    registry: registryRaw ? asAddress(registryRaw, "TBA registry") : ERC6551_REGISTRY_ADDRESS,
  };
}

export function resolveTbaSpec(resolver: OptionResolver, chainId: number): TbaSpec | undefined {
  const tbaRaw = resolver.resolveString("tba");
  const nftRaw = resolver.resolveString("nft");
  if (!tbaRaw && !nftRaw) {
    return undefined;
  }
  const derivation = resolveTbaDerivation(resolver);

  if (tbaRaw) {
    return {
      account: asAddress(tbaRaw, "TBA address"),
      source: "tba",
      nft: nftRaw ? parseNftRef(nftRaw) : undefined,
      ...derivation,
    };
  }

  const nft = parseNftRef(nftRaw!);
  // Deterministic, so no RPC is needed before authenticating as the account.
  const account = computeErc6551AccountAddress({...derivation, chainId, ...nft});
  return {account, source: "nft", nft, ...derivation};
}

export function executorFromSpec(spec: TbaSpec | undefined): TxExecutor {
  return spec ? {kind: "erc6551", account: spec.account} : {kind: "eoa"};
}

/**
 * Fail early with an actionable message when the signer cannot act for the
 * account: not deployed yet (`dac tba create`), bound to another NFT than the
 * one named, or owned by someone else. Without this, every write would revert
 * inside `execute` with a bare "not owner"/"Invalid signer".
 */
export async function assertTbaControl(core: DacCoreClient, spec: TbaSpec, signer: Address): Promise<void> {
  const info = await core.getErc6551AccountInfo({account: spec.account});
  if (!info.deployed) {
    const hint = spec.nft
      ? ` Run 'dac tba create --nft ${spec.nft.tokenContract}:${spec.nft.tokenId}' first.`
      : " Create it through the ERC-6551 registry first (dac tba create --nft <contract:tokenId>).";
    throw new Error(`Token-bound account ${spec.account} is not deployed.${hint}`);
  }
  if (spec.nft && info.token && (
    info.token.tokenContract.toLowerCase() !== spec.nft.tokenContract.toLowerCase()
    || info.token.tokenId !== spec.nft.tokenId
  )) {
    throw new Error(
      `Token-bound account ${spec.account} is bound to ${info.token.tokenContract}:${info.token.tokenId}, `
      + `not ${spec.nft.tokenContract}:${spec.nft.tokenId}.`,
    );
  }
  if (!(await core.isErc6551ValidSigner({account: spec.account, signer}))) {
    throw new Error(
      `Signer ${signer} is not a valid signer for token-bound account ${spec.account}`
      + (info.owner ? ` (NFT owner is ${info.owner}).` : "."),
    );
  }
}

/**
 * Everything the backend needs to authenticate a session for the account:
 * the account address, plus an ERC-6492 wrapper when the account may not be
 * deployed yet (derivable only from `--nft`; `--tba` is assumed deployed).
 * The wrapper is harmless for a deployed account — the validator skips the
 * factory call when code already exists.
 */
export function tbaAuthOptions(spec: TbaSpec | undefined, chainId: number): {sessionAddress?: string; wrapSignature?: (signature: Hex) => Hex} {
  if (!spec) return {};
  if (!spec.nft) return {sessionAddress: spec.account};
  const nft = spec.nft;
  const factoryCalldata = encodeFunctionData({
    abi: erc6551RegistryAbi,
    functionName: "createAccount",
    args: [spec.implementation, spec.salt, BigInt(chainId), nft.tokenContract, nft.tokenId],
  });
  return {
    sessionAddress: spec.account,
    wrapSignature: (signature) => serializeErc6492Signature({address: spec.registry, data: factoryCalldata, signature}),
  };
}
