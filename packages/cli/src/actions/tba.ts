import type {Command} from "commander";
import {computeErc6551AccountAddress} from "@dac-cloud/core";
import {addCommandHelp, applyOptions} from "../cli/options";
import type {OptionResolver} from "../runtime/config";
import {makeCoreContext, makeDryRunContext, makeReadOnlyCoreContext} from "../runtime/chain";
import {printJson} from "../runtime/io";
import {parseNftRef, resolveTbaDerivation, resolveTbaSpec} from "../runtime/tba";

const DEFAULT_CHAIN_ID = 84532;

function isDryRun(resolver: OptionResolver): boolean {
  return resolver.resolveBoolean("dry-run", false);
}

function requireNft(resolver: OptionResolver, hint: string) {
  const raw = resolver.resolveString("nft");
  if (!raw) {
    throw new Error(`${hint} requires --nft <contract:tokenId>`);
  }
  return parseNftRef(raw);
}

// Pure derivation — no RPC, no auth. Useful before the account exists.
async function cmdAddress(resolver: OptionResolver): Promise<void> {
  const chainId = resolver.resolveNumber("chain-id") ?? DEFAULT_CHAIN_ID;
  const nft = requireNft(resolver, "dac tba address");
  const derivation = resolveTbaDerivation(resolver);
  const account = computeErc6551AccountAddress({...derivation, chainId, ...nft});
  printJson({action: "tba.address", chainId, ...nft, ...derivation, account});
}

async function cmdInfo(resolver: OptionResolver): Promise<void> {
  const {chainId, core} = await makeReadOnlyCoreContext(resolver);
  const spec = resolveTbaSpec(resolver, chainId);
  if (!spec) {
    throw new Error("dac tba info requires --tba <address> or --nft <contract:tokenId>");
  }
  const info = await core.getErc6551AccountInfo({account: spec.account});

  const signerRaw = resolver.resolveString("private-key");
  const signer = signerRaw
    ? (await import("@dac-cloud/core")).accountFromPrivateKey(signerRaw as `0x${string}`).address
    : resolver.resolveString("from");
  const signerIsValid = signer && info.deployed
    ? await core.isErc6551ValidSigner({account: spec.account, signer: signer as `0x${string}`})
    : undefined;

  printJson({
    action: "tba.info",
    chainId,
    account: spec.account,
    source: spec.source,
    nft: spec.nft,
    deployed: info.deployed,
    token: info.token,
    owner: info.owner,
    state: info.state,
    signer,
    signerIsValid,
    note: info.deployed ? undefined : "Account not deployed yet — run `dac tba create --nft <contract:tokenId>`.",
  });
}

// Permissionless registry.createAccount, sent by the signer itself.
async function cmdCreate(resolver: OptionResolver): Promise<void> {
  const nft = requireNft(resolver, "dac tba create");
  const derivation = resolveTbaDerivation(resolver);

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const account = computeErc6551AccountAddress({...derivation, chainId: ctx.chainId, ...nft});
    const {erc6551RegistryAbi} = await import("@dac-cloud/core");
    const {encodeFunctionData} = await import("viem");
    const transaction = {
      to: derivation.registry,
      from: ctx.fromAddress,
      data: encodeFunctionData({
        abi: erc6551RegistryAbi,
        functionName: "createAccount",
        args: [derivation.implementation, derivation.salt, BigInt(ctx.chainId), nft.tokenContract, nft.tokenId],
      }),
      value: 0n,
      chainId: ctx.chainId,
    };
    printJson({action: "tba.create", dryRun: true, ...nft, ...derivation, account, transaction});
    return;
  }

  // The account does not exist yet: sign as the plain EOA, never through the account.
  const {core, account: signer, chainId} = await makeCoreContext(resolver.without(["tba", "nft"]));
  const existing = await core.getErc6551AccountInfo({
    account: computeErc6551AccountAddress({...derivation, chainId, ...nft}),
  });
  if (existing.deployed) {
    printJson({action: "tba.create", alreadyDeployed: true, account: existing.account, owner: existing.owner, ...nft});
    return;
  }
  const created = await core.createErc6551Account({...derivation, chainId: BigInt(chainId), ...nft});
  printJson({action: "tba.create", caller: signer.address, ...nft, ...derivation, account: created.account, txHash: created.txHash});
}

export function registerTbaCommands(program: Command, resolverFactory: (options: Record<string, unknown>) => Promise<OptionResolver>): void {
  const tba = program.command("tba").description("ERC-6551 token-bound accounts (NFT agents)");

  const address = tba.command("address").description("Derive the token-bound account address of an NFT (off-chain)");
  applyOptions(address, ["nft", "tba-implementation", "tba-salt", "tba-registry", "chain-id"]);
  addCommandHelp(address, {
    requirements: [{mode: "allOf", options: ["nft"]}],
    notes: [
      "Defaults: reference implementation 0x41C8…44eC, zero salt, canonical registry. Collections with their own implementation/salt (e.g. Loopers on Base) need --tba-implementation / --tba-salt, or pass the known account with --tba to other commands.",
    ],
    examples: ["dac tba address --nft 0x1649cd37f4748807b4882fc48765ba0b2affa94a:370 --tba-implementation 0x... --tba-salt 0x..."],
  });
  address.action(async function handleAddress() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdAddress(resolver);
  });

  const info = tba.command("info").description("Show a token-bound account: bound NFT, owner, deployment, whether the signer may act");
  applyOptions(info, ["tba", "nft", "tba-implementation", "tba-salt", "tba-registry"]);
  addCommandHelp(info, {
    requirements: [{mode: "oneOf", options: ["tba", "nft"], label: "Account selector"}],
    examples: ["dac tba info --tba 0x84057bB15AC43370737ecc24931A22B78fbfa22e"],
  });
  info.action(async function handleInfo() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdInfo(resolver);
  });

  const create = tba.command("create").description("Deploy the token-bound account of an NFT via the ERC-6551 registry (permissionless)");
  applyOptions(create, ["nft", "tba-implementation", "tba-salt", "tba-registry"]);
  addCommandHelp(create, {
    requirements: [{mode: "allOf", options: ["nft"]}],
    notes: ["Signed by the plain EOA (the account does not exist yet). Supports --dry-run."],
  });
  create.action(async function handleCreate() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdCreate(resolver);
  });
}
