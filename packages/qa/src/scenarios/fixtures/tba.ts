import {
  computeErc6551AccountAddress,
  ERC6551_REFERENCE_IMPLEMENTATION,
  ERC6551_REGISTRY_ADDRESS,
  erc721Abi,
} from "@dac-cloud/core";
import {createPublicClient, createWalletClient, http, type Address, type Hex} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {setCode} from "../../harness/chain.js";
import type {Harness} from "../../harness/types.js";
import artifacts from "../../fixtures/erc6551.json" with {type: "json"};

type Artifact = {abi: readonly unknown[]; bytecode: Hex; deployedBytecode: Hex};
const ARTIFACTS = artifacts as unknown as Record<"ERC6551Registry" | "ERC6551Account" | "MockERC721", Artifact>;

function chainFor(h: Harness) {
  return {
    id: h.config.chainId,
    name: `dac-${h.config.chainId}`,
    nativeCurrency: {name: "ETH", symbol: "ETH", decimals: 18},
    rpcUrls: {default: {http: [h.config.localRpcUrl]}},
  } as const;
}

function publicClient(h: Harness) {
  return createPublicClient({transport: http(h.config.localRpcUrl)});
}

function walletFor(h: Harness, role: string) {
  const wallet = h.config.wallets[role];
  if (!wallet) throw new Error(`Wallet role "${role}" not found in config`);
  const account = privateKeyToAccount(wallet.privateKey as Hex);
  return {account, client: createWalletClient({account, chain: chainFor(h), transport: http(h.config.localRpcUrl)})};
}

/**
 * Install the ERC-6551 registry and the reference account implementation at
 * their canonical addresses (the same ones as on Base), so the CLI's `--nft`
 * defaults derive the same account on the local chain as on mainnet.
 * Idempotent: skips when code is already there.
 */
export async function ensureErc6551Infrastructure(h: Harness): Promise<void> {
  const client = publicClient(h);
  for (const [address, artifact, label] of [
    [ERC6551_REGISTRY_ADDRESS, ARTIFACTS.ERC6551Registry, "registry"],
    [ERC6551_REFERENCE_IMPLEMENTATION, ARTIFACTS.ERC6551Account, "reference account"],
  ] as const) {
    const code = await client.getCode({address});
    if (code && code !== "0x") continue;
    h.log(`Installing ERC-6551 ${label} at ${address}`);
    await setCode(h.config, address, artifact.deployedBytecode);
  }
}

/** Deploy the stand-in agent-identity collection (anyone may mint any id). */
export async function deployMockNft(h: Harness, role = "founder"): Promise<Address> {
  const {client, account} = walletFor(h, role);
  const hash = await client.deployContract({
    abi: ARTIFACTS.MockERC721.abi as never,
    bytecode: ARTIFACTS.MockERC721.bytecode,
    account,
  });
  const receipt = await publicClient(h).waitForTransactionReceipt({hash});
  if (!receipt.contractAddress) throw new Error("MockERC721 deployment returned no address");
  h.log(`Mock NFT collection deployed at ${receipt.contractAddress}`);
  return receipt.contractAddress;
}

export async function mintNft(h: Harness, opts: {nft: Address; to: Address; tokenId: bigint; role?: string}): Promise<void> {
  const {client, account} = walletFor(h, opts.role ?? "founder");
  const hash = await client.writeContract({
    address: opts.nft,
    abi: [{type: "function", name: "mint", stateMutability: "nonpayable", inputs: [{type: "address"}, {type: "uint256"}], outputs: []}],
    functionName: "mint",
    args: [opts.to, opts.tokenId],
    account,
  });
  await publicClient(h).waitForTransactionReceipt({hash});
}

export async function transferNft(h: Harness, opts: {nft: Address; fromRole: string; to: Address; tokenId: bigint}): Promise<void> {
  const {client, account} = walletFor(h, opts.fromRole);
  const hash = await client.writeContract({
    address: opts.nft,
    abi: erc721Abi,
    functionName: "transferFrom",
    args: [account.address, opts.to, opts.tokenId],
    account,
  });
  await publicClient(h).waitForTransactionReceipt({hash});
}

export interface TbaFixture {
  nft: Address;
  tokenId: bigint;
  /** `<contract>:<tokenId>` as the CLI takes it. */
  nftRef: string;
  /** Account address under the reference implementation + zero salt. */
  account: Address;
}

/** Mint `tokenId` of a fresh collection to `ownerRole` and derive its account. */
export async function setupTbaFixture(h: Harness, opts: {ownerRole: string; tokenId?: bigint}): Promise<TbaFixture> {
  await ensureErc6551Infrastructure(h);
  const nft = await deployMockNft(h);
  const tokenId = opts.tokenId ?? 370n;
  const owner = h.config.wallets[opts.ownerRole];
  if (!owner) throw new Error(`Wallet role "${opts.ownerRole}" not found in config`);
  await mintNft(h, {nft, to: owner.address as Address, tokenId});
  const account = computeErc6551AccountAddress({
    implementation: ERC6551_REFERENCE_IMPLEMENTATION,
    chainId: h.config.chainId,
    tokenContract: nft,
    tokenId,
  });
  return {nft, tokenId, nftRef: `${nft}:${tokenId}`, account};
}
