import type {Address} from "viem";
import {z} from "zod";
import type {OptionResolver} from "../runtime/config";
import {listQueryPage, makeIndexer} from "../runtime/chain";

export function asAddress(value: string, label: string): Address {
  const schema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, `${label} must be a 20-byte hex address`);
  return schema.parse(value) as Address;
}

export function asBytes4(value: string, label: string): `0x${string}` {
  const schema = z.string().regex(/^0x[a-fA-F0-9]{8}$/, `${label} must be bytes4 hex`);
  return schema.parse(value) as `0x${string}`;
}

export function asBytes32(value: string, label: string): `0x${string}` {
  const schema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, `${label} must be bytes32 hex`);
  return schema.parse(value) as `0x${string}`;
}

export function parseBoolText(value: string): boolean {
  return value === "true" || value === "1" || value === "yes";
}

export function resolveDacAddressOrThrow(resolver: OptionResolver): Address {
  const value = resolver.resolveString(["cell-address", "dac-address", "dac"]);
  if (!value) {
    throw new Error("Missing DAC address. Provide --cell-address.");
  }
  return asAddress(value, "DAC address");
}

export function resolveDealAddressOrThrow(resolver: OptionResolver): Address {
  const value = resolver.resolveString(["deal-address", "deal", "deal-cell"]);
  if (!value) {
    throw new Error("Missing deal address. Provide --deal-address or --deal-cell.");
  }
  return asAddress(value, "Deal address");
}

export interface ResolvedDealRecord {
  id: string;
  dacId: string;
  dealNumericId: bigint;
  dealAddress: Address;
  cellAddress: Address;
  stakeTokenAddress?: Address;
  childDacAddress?: Address;
  kindSelector?: `0x${string}`;
}

export interface ResolvedDacRecord {
  id: string;
  address: Address;
  mode: string;
  mainTokenAddress?: Address;
  underlyingTokenAddress?: Address;
  agentTokenAddress?: Address;
  dealManagerAddress?: Address;
  moduleRegistryAddress?: Address;
  assetControllerAddress?: Address;
  governanceSchemaAddress?: Address;
  governanceOracleAddress?: Address;
  treasuryHolderAddress?: Address;
}

export function dacAddressFromCompositeId(id: string): Address {
  const parts = id.split(":");
  if (parts.length < 2) {
    throw new Error(`Unexpected composite id format: ${id}`);
  }
  return asAddress(parts.slice(1).join(":"), "DAC address from id");
}

export async function resolveDacIdOrThrow(resolver: OptionResolver): Promise<string> {
  const direct = resolver.resolveString(["dac-id", "id"]);
  if (direct) {
    return direct;
  }

  const address = resolver.resolveString(["cell-address", "dac-address", "dac", "address"]);
  if (!address) {
    throw new Error("Provide --dac-id or --cell-address");
  }

  const client = makeIndexer(resolver);
  const found = await client.dacs.getByAddress(address);
  if (!found) {
    throw new Error("DAC not found in indexer");
  }
  return found.id;
}

export async function resolveDacRecordOrThrow(resolver: OptionResolver): Promise<ResolvedDacRecord> {
  const client = makeIndexer(resolver);
  const directId = resolver.resolveString(["dac-id", "id"]);
  const byAddress = resolver.resolveString(["cell-address", "dac-address", "dac", "address"]);

  const found = directId
    ? await client.dacs.getById(directId)
    : byAddress
      ? await client.dacs.getByAddress(byAddress)
      : null;

  if (!found) {
    throw new Error("DAC not found in indexer. Provide --dac-id or --cell-address.");
  }

  return {
    id: found.id,
    address: asAddress(found.address, "DAC address"),
    mode: found.mode,
    mainTokenAddress: found.mainTokenAddress ? asAddress(found.mainTokenAddress, "Main token") : undefined,
    underlyingTokenAddress: found.underlyingTokenAddress ? asAddress(found.underlyingTokenAddress, "Underlying token") : undefined,
    agentTokenAddress: found.agentTokenAddress ? asAddress(found.agentTokenAddress, "Agent token") : undefined,
    dealManagerAddress: found.dealManagerAddress ? asAddress(found.dealManagerAddress, "Deal manager") : undefined,
    moduleRegistryAddress: found.moduleRegistryAddress ? asAddress(found.moduleRegistryAddress, "Module registry") : undefined,
    assetControllerAddress: found.assetControllerAddress ? asAddress(found.assetControllerAddress, "Asset controller") : undefined,
    governanceSchemaAddress: found.governanceSchemaAddress ? asAddress(found.governanceSchemaAddress, "Governance schema") : undefined,
    governanceOracleAddress: found.governanceOracleAddress ? asAddress(found.governanceOracleAddress, "Governance oracle") : undefined,
    treasuryHolderAddress: found.treasuryHolderAddress ? asAddress(found.treasuryHolderAddress, "Treasury holder") : undefined,
  };
}

export async function resolveDealIdOrThrow(resolver: OptionResolver): Promise<string> {
  const direct = resolver.resolveString(["deal-id", "id"]);
  if (direct) {
    const client = makeIndexer(resolver);
    // Try as composite indexer ID first, then as on-chain numeric ID with DAC context
    const byComposite = await client.deals.getById(direct);
    if (byComposite) return byComposite.id;

    const found = await resolveDealByNumericId(client, resolver, direct);
    if (found) return found.id;

    throw new Error(`Deal not found for id "${direct}". If using a numeric deal ID, also provide --dac.`);
  }

  const address = resolver.resolveString(["deal-address", "address", "deal", "deal-cell"]);
  if (!address) {
    throw new Error("Provide --deal-id or --deal-address");
  }

  const client = makeIndexer(resolver);
  const found = await client.deals.getByAddress(address);
  if (!found) {
    throw new Error("Deal not found in indexer");
  }
  return found.id;
}

/**
 * Try to resolve a deal by on-chain numeric ID within a DAC context.
 * Requires --dac / --dac-address / --cell-address to identify the DAC.
 */
async function resolveDealByNumericId(
  client: ReturnType<typeof makeIndexer>,
  resolver: OptionResolver,
  numericIdText: string,
) {
  // Only attempt if it looks like a simple numeric ID (not a composite key with underscores/hyphens)
  if (/[_\-]/.test(numericIdText)) return null;

  const dacAddress = resolver.resolveString(["cell-address", "dac-address", "dac"]);
  if (!dacAddress) return null;

  const dacRecord = await client.dacs.getByAddress(dacAddress);
  if (!dacRecord) return null;

  const deals = await client.deals.listByDac(dacRecord.id, {limit: 100, offset: 0});
  const target = numericIdText;
  return deals.find((d) => String(d.dealNumericId) === target) ?? null;
}

export async function resolveDealRecordOrThrow(resolver: OptionResolver): Promise<ResolvedDealRecord> {
  const client = makeIndexer(resolver);
  const directId = resolver.resolveString(["deal-id", "id"]);
  const byAddress = resolver.resolveString(["deal-address", "address", "deal", "deal-cell"]);

  let found = null;

  if (directId) {
    // Try as composite indexer ID first
    found = await client.deals.getById(directId);

    // Then try as on-chain numeric ID with DAC context
    if (!found) {
      found = await resolveDealByNumericId(client, resolver, directId);
    }
  }

  if (!found && byAddress) {
    found = await client.deals.getByAddress(byAddress);
  }

  if (!found) {
    throw new Error("Deal not found in indexer. Provide --deal-id (with --dac for numeric IDs) or --deal-address.");
  }

  if (!found.dealAddress || !found.cellAddress || !found.dealNumericId || !found.dacId) {
    throw new Error("Deal record is missing required fields in indexer.");
  }

  return {
    id: found.id,
    dacId: found.dacId,
    dealNumericId: BigInt(found.dealNumericId),
    dealAddress: asAddress(found.dealAddress, "Deal address"),
    cellAddress: asAddress(found.cellAddress, "Deal cell"),
    stakeTokenAddress: found.stakeTokenAddress ? asAddress(found.stakeTokenAddress, "Stake token") : undefined,
    childDacAddress: found.childDacAddress ? asAddress(found.childDacAddress, "Child DAC address") : undefined,
    kindSelector: (found.kindSelector ?? undefined) as `0x${string}` | undefined,
  };
}

export async function viewProposalByIdOrThrow(resolver: OptionResolver, proposalId: string) {
  const client = makeIndexer(resolver);
  const proposal = await client.proposals.getById(proposalId);
  if (!proposal) {
    throw new Error("Proposal not found in indexer");
  }
  return proposal;
}

export async function resolveDacProposalByNumericIdOrThrow(resolver: OptionResolver, proposalNumericIdText: string) {
  const client = makeIndexer(resolver);
  const dacId = await resolveDacIdOrThrow(resolver);
  const proposal = await client.proposals.getByDacAndNumericId(dacId, proposalNumericIdText);
  if (!proposal) {
    throw new Error(`DAC proposal #${proposalNumericIdText} not found in indexer`);
  }
  return proposal;
}

export async function resolveDealProposalByNumericIdOrThrow(resolver: OptionResolver, proposalNumericIdText: string) {
  const client = makeIndexer(resolver);
  const dealId = await resolveDealIdOrThrow(resolver);
  const proposal = await client.proposals.getByDealAndNumericId(dealId, proposalNumericIdText);
  if (!proposal) {
    throw new Error(`Deal proposal #${proposalNumericIdText} not found in indexer`);
  }
  return proposal;
}

export function resolvePage(resolver: OptionResolver): {limit?: number; offset?: number} {
  return listQueryPage(resolver);
}
