import {randomBytes} from "node:crypto";
import {resolve as resolvePath} from "node:path";
import {
  DAC_PROPOSAL_TYPE,
  buildBurnMainTokensReserveProposal,
  buildCapitalCallProposal,
  buildChallengeDealProposal,
  buildDelegateVoteRightsProposal,
  buildMintAgentTokensProposal,
  buildMintAgentTokensDistributorProposal,
  buildDisableAgentDistributorProposal,
  buildMintMainTokensReserveProposal,
  buildRevokeAgentTokensProposal,
  buildUpdateDacVotingConfigProposal,
  buildUpdateDealCreationConfigProposal,
  buildUpdateGovernanceOracleProposal,
  buildUpdateGovernanceStrategyProposal,
  normalizePercentInput,
  type CapitalCall,
  type DACConfig,
  type ExistingTokenDacConfig,
  type GovernanceStrategyConfig,
  type ProposalParams,
} from "@dac-cloud/core";
import {type Command} from "commander";
import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {z} from "zod";
import {
  resolveDacAddressOrThrow,
  resolveDacProposalByNumericIdOrThrow,
  resolveDacRecordOrThrow,
  resolveDacIdOrThrow,
  resolvePage,
  viewProposalByIdOrThrow,
  asAddress,
  asBytes4,
  asBytes32,
  parseBoolText,
} from "./shared";
import {addCommandHelp, applyOptions, type OptionKey} from "../cli/options";
import type {OptionResolver} from "../runtime/config";
import {advanceTime, makeCoreContext, makeDryRunContext, makeIndexer} from "../runtime/chain";
import {printJson, readJsonFile} from "../runtime/io";

function isDryRun(resolver: OptionResolver): boolean {
  return resolver.resolveBoolean("dry-run", false);
}

function resolvePercent(resolver: OptionResolver, key: string, defaultPercent: number): bigint {
  const raw = resolver.resolveString(key);
  if (raw !== undefined && raw !== null) return normalizePercentInput(raw);
  return normalizePercentInput(defaultPercent.toString());
}

const DAC_PROPOSAL_TYPES = [
  "update-voting-config",
  "update-governance-strategy",
  "update-deal-creation-config",
  "update-governance-oracle",
  "update-legal-wrapper",
  "approve-offchain-action",
  "mint-agent-tokens",
  "mint-agent-tokens-distributor",
  "disable-agent-distributor",
  "revoke-agent-tokens",
  "mint-main-tokens",
  "burn-main-tokens",
  "toggle-dividends",
  "dividend-payout",
  "delegate-from-balance",
  "capital-call",
  "add-module",
  "remove-module",
  "recover-deal",
  "deal-message",
  "cast-veto-deal",
  "challenge-deal",
  "add-evaluator",
] as const;

function bytes32Random(): Hex {
  return `0x${randomBytes(32).toString("hex")}` as Hex;
}

function proposalTypeFromText(text: string) {
  return z.enum(DAC_PROPOSAL_TYPES).parse(text);
}

function requireNArgs(args: string[], expected: number, hint: string): void {
  if (args.length !== expected) {
    throw new Error(`${hint}. Expected ${expected} args, got ${args.length}.`);
  }
}

function readStringField(input: Record<string, unknown> | undefined, key: string, label: string): string {
  const value = input?.[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing string field '${key}' in ${label}`);
  }
  return value;
}

function readBigIntField(input: Record<string, unknown> | undefined, key: string, label: string): bigint {
  const value = input?.[key];
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.trunc(value));
  if (typeof value === "string" && value.length > 0) return BigInt(value);
  throw new Error(`Missing bigint field '${key}' in ${label}`);
}

function readBoolField(input: Record<string, unknown> | undefined, key: string, label: string): boolean {
  const value = input?.[key];
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return parseBoolText(value);
  throw new Error(`Missing bool field '${key}' in ${label}`);
}

async function cmdCreate(resolver: OptionResolver): Promise<void> {
  const name = resolver.requireString("name", "--name is required for dac create");
  const description = resolver.requireString("description", "--description is required for dac create");
  const symbol = resolver.resolveString("symbol", "DAC") ?? "DAC";
  const treasuryToken = asAddress(
    resolver.requireString("treasury-token", "--treasury-token is required for dac create"),
    "Treasury token",
  );

  const founderCommitment = resolver.requireBigInt("commitment", "--commitment is required for dac create");
  const founderAllocation = resolver.requireBigInt("allocation", "--allocation is required for dac create");
  const mainTokenMaxSupply = resolver.resolveBigInt("max-supply", 1_000_000_000n * 10n ** 18n) ?? (1_000_000_000n * 10n ** 18n);
  const defaultQuorum = resolvePercent(resolver, "default-quorum", 50);
  const dividendsEnabled = resolver.resolveBoolean("dividends-enabled", false);
  const deferBirthRole = resolver.resolveString("defer-birth-role") as Address | undefined;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const config: DACConfig = {
      symbol: symbol.slice(0, 8), name, description, mainTokenMaxSupply, defaultQuorum,
      founder: ctx.fromAddress, founderAllocation, treasuryToken, founderCommitment, dividendsEnabled,
    };
    const transaction = ctx.txBuilder.deployDac({config, salt: bytes32Random(), deferBirthRole});
    printJson({
      action: "dac.create", dryRun: true, transaction,
      note: "After confirming, use the DACDeployed event to get mainToken address for delegation.",
    });
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const config: DACConfig = {
    symbol: symbol.slice(0, 8), name, description, mainTokenMaxSupply, defaultQuorum,
    founder: account.address, founderAllocation, treasuryToken, founderCommitment, dividendsEnabled,
  };

  const result = await core.deployDac({config, salt: bytes32Random(), deferBirthRole});

  const autoDelegate = resolver.resolveBoolean("auto-delegate", false);
  let delegateTx: Hex | undefined;
  if (autoDelegate && result.mainToken) {
    delegateTx = await core.delegateVotes({token: result.mainToken, delegatee: account.address});
  }

  printJson({
    action: "dac.create",
    creator: account.address,
    txHash: result.txHash,
    dac: result.dac,
    mainToken: result.mainToken,
    agentToken: result.agentToken,
    delegateTx,
  });
}

async function cmdCreateExistingToken(resolver: OptionResolver): Promise<void> {
  const name = resolver.requireString("name", "--name is required for dac create-existing-token");
  const description = resolver.requireString("description", "--description is required for dac create-existing-token");
  const symbol = resolver.resolveString("symbol", "DAC") ?? "DAC";
  const underlyingToken = asAddress(
    resolver.requireString("underlying-token", "--underlying-token is required for dac create-existing-token"),
    "Underlying token",
  );
  const treasurySeedAmount = resolver.requireBigInt(
    "treasury-seed-amount",
    "--treasury-seed-amount is required for dac create-existing-token",
  );
  const dividendsEnabled = resolver.resolveBoolean("dividends-enabled", false);
  const governanceStrategy: GovernanceStrategyConfig = {
    quorumPercent: resolvePercent(resolver, "quorum-percent", 50),
    highQuorumPercent: resolvePercent(resolver, "high-quorum-percent", 75),
    blockingPercent: resolvePercent(resolver, "blocking-percent", 25),
    duration: resolver.resolveBigInt("voting-duration", 7n * 24n * 60n * 60n) ?? 7n * 24n * 60n * 60n,
    qualification: resolvePercent(resolver, "qualification", 0),
    executionValidityDuration: resolver.resolveBigInt("execution-validity-duration", 7n * 24n * 60n * 60n) ?? 7n * 24n * 60n * 60n,
    oraclePublishDeadline: resolver.resolveBigInt("oracle-publish-deadline", 24n * 60n * 60n) ?? 24n * 60n * 60n,
    fallbackWarmupDuration: resolver.resolveBigInt("fallback-warmup-duration", 24n * 60n * 60n) ?? 24n * 60n * 60n,
    fallbackDuration: resolver.resolveBigInt("fallback-duration", 7n * 24n * 60n * 60n) ?? 7n * 24n * 60n * 60n,
    blockingOnAllProposals: resolver.resolveBoolean("blocking-on-all-proposals", false) ?? false,
    blockingOnHighQuorum: resolver.resolveBoolean("blocking-on-high-quorum", true) ?? true,
    oraclePrimaryEnabled: resolver.resolveBoolean("oracle-primary-enabled", true) ?? true,
  };

  function buildConfig(senderAddress: Address): ExistingTokenDacConfig {
    const oracleAdmin = asAddress(resolver.resolveString("oracle-admin", senderAddress) ?? senderAddress, "Oracle admin");
    const initialOraclePublisher = asAddress(resolver.resolveString("initial-oracle-publisher", senderAddress) ?? senderAddress, "Initial oracle publisher");
    return {
      symbol: symbol.slice(0, 8), name, description, underlyingToken, treasurySeedAmount,
      oracleAdmin, initialOraclePublisher, dividendsEnabled, governanceStrategy,
    };
  }

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const config = buildConfig(ctx.fromAddress);
    const transactions = [];
    if (resolver.resolveBoolean("auto-approve", true) && treasurySeedAmount > 0n) {
      transactions.push(ctx.txBuilder.approveErc20({token: underlyingToken, spender: ctx.protocol.dacFactory, amount: treasurySeedAmount}));
    }
    transactions.push(ctx.txBuilder.deployExistingTokenDac({config, salt: bytes32Random()}));
    printJson({
      action: "dac.create.existing-token", dryRun: true, transactions, governanceStrategy,
      note: "After confirming, use ExistingTokenDACDeployed event for deployed addresses.",
    });
    return;
  }

  const {account, core, protocol} = await makeCoreContext(resolver);
  const config = buildConfig(account.address);

  const autoApprove = resolver.resolveBoolean("auto-approve", true);
  let approveTx: Hex | undefined;
  if (autoApprove && treasurySeedAmount > 0n) {
    const allowance = await core.getErc20Allowance({token: underlyingToken, owner: account.address, spender: protocol.dacFactory});
    if (allowance < treasurySeedAmount) {
      approveTx = await core.approveErc20({token: underlyingToken, spender: protocol.dacFactory, amount: treasurySeedAmount});
    }
  }

  const result = await core.deployExistingTokenDac({config, salt: bytes32Random()});

  const autoDelegate = resolver.resolveBoolean("auto-delegate", false);
  let delegateTx: Hex | undefined;
  if (autoDelegate && result.mainToken) {
    delegateTx = await core.delegateVotes({token: result.mainToken, delegatee: account.address});
  }

  printJson({
    action: "dac.create.existing-token",
    creator: account.address,
    approveTx,
    txHash: result.txHash,
    dac: result.dac,
    mainToken: result.mainToken,
    wrappedMainToken: result.wrappedMainToken,
    underlyingToken: result.underlyingToken,
    agentToken: result.agentToken,
    governanceOracle: result.governanceOracle,
    assetController: result.assetController,
    treasurySeedAmount: result.treasurySeedAmount,
    governanceStrategy,
    delegateTx,
  });
}

async function cmdDelegate(resolver: OptionResolver): Promise<void> {
  const dacRecord = await resolveDacRecordOrThrow(resolver);
  const dac = dacRecord.address;

  if (!dacRecord.mainTokenAddress) {
    throw new Error("DAC main token address is missing in indexer.");
  }
  const mainToken = dacRecord.mainTokenAddress;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const delegatee = asAddress(resolver.resolveString("delegatee", ctx.fromAddress) ?? ctx.fromAddress, "Delegatee");
    const transaction = ctx.txBuilder.delegateVotes({token: mainToken, delegatee});
    printJson({action: "dac.delegate", dryRun: true, dac, mainToken, delegatee, transaction});
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const delegatee = asAddress(resolver.resolveString("delegatee", account.address) ?? account.address, "Delegatee");
  const txHash = await core.delegateVotes({token: mainToken, delegatee});

  printJson({action: "dac.delegate", dac, mainToken, delegatee, txHash});
}

async function cmdWrap(resolver: OptionResolver): Promise<void> {
  const dacRecord = await resolveDacRecordOrThrow(resolver);
  const dac = dacRecord.address;
  const amount = resolver.requireBigInt("amount", "--amount is required for dac wrap");

  if (dacRecord.mode !== "EXISTING_TOKEN") {
    throw new Error("dac wrap is only supported for existing-token DACs.");
  }
  if (!dacRecord.mainTokenAddress || !dacRecord.underlyingTokenAddress) {
    throw new Error("Existing-token DAC addresses are incomplete in indexer.");
  }

  const wrappedToken = dacRecord.mainTokenAddress;
  const underlyingToken = dacRecord.underlyingTokenAddress;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const recipientText = resolver.resolveString("recipient");
    const recipient = recipientText ? asAddress(recipientText, "Wrap recipient") : ctx.fromAddress;
    const transactions = [];
    if (resolver.resolveBoolean("auto-approve", true) && amount > 0n) {
      transactions.push(ctx.txBuilder.approveErc20({token: underlyingToken, spender: wrappedToken, amount}));
    }
    transactions.push(
      recipient.toLowerCase() === ctx.fromAddress.toLowerCase()
        ? ctx.txBuilder.wrapMainToken({wrappedToken, amount})
        : ctx.txBuilder.wrapMainTokenTo({wrappedToken, recipient, amount}),
    );
    printJson({action: "dac.wrap", dryRun: true, dac, wrappedToken, underlyingToken, recipient, amount, transactions});
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const recipientText = resolver.resolveString("recipient");
  const recipient = recipientText ? asAddress(recipientText, "Wrap recipient") : account.address;

  const autoApprove = resolver.resolveBoolean("auto-approve", true);
  let approveTx: Hex | undefined;
  if (autoApprove && amount > 0n) {
    const allowance = await core.getErc20Allowance({token: underlyingToken, owner: account.address, spender: wrappedToken});
    if (allowance < amount) {
      approveTx = await core.approveErc20({token: underlyingToken, spender: wrappedToken, amount});
    }
  }

  const txHash = recipient.toLowerCase() === account.address.toLowerCase()
    ? await core.wrapMainToken({wrappedToken, amount})
    : await core.wrapMainTokenTo({wrappedToken, recipient, amount});

  printJson({action: "dac.wrap", caller: account.address, dac, wrappedToken, underlyingToken, recipient, amount, approveTx, txHash});
}

async function cmdUnwrap(resolver: OptionResolver): Promise<void> {
  const dacRecord = await resolveDacRecordOrThrow(resolver);
  const dac = dacRecord.address;
  const amount = resolver.requireBigInt("amount", "--amount is required for dac unwrap");

  if (dacRecord.mode !== "EXISTING_TOKEN") {
    throw new Error("dac unwrap is only supported for existing-token DACs.");
  }
  if (!dacRecord.mainTokenAddress || !dacRecord.underlyingTokenAddress) {
    throw new Error("Existing-token DAC addresses are incomplete in indexer.");
  }

  const wrappedToken = dacRecord.mainTokenAddress;
  const underlyingToken = dacRecord.underlyingTokenAddress;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const recipientText = resolver.resolveString("recipient");
    const recipient = recipientText ? asAddress(recipientText, "Unwrap recipient") : ctx.fromAddress;
    const transaction = recipient.toLowerCase() === ctx.fromAddress.toLowerCase()
      ? ctx.txBuilder.unwrapMainToken({wrappedToken, amount})
      : ctx.txBuilder.unwrapMainTokenTo({wrappedToken, recipient, amount});
    printJson({action: "dac.unwrap", dryRun: true, dac, wrappedToken, underlyingToken, recipient, amount, transaction});
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const recipientText = resolver.resolveString("recipient");
  const recipient = recipientText ? asAddress(recipientText, "Unwrap recipient") : account.address;

  const txHash = recipient.toLowerCase() === account.address.toLowerCase()
    ? await core.unwrapMainToken({wrappedToken, amount})
    : await core.unwrapMainTokenTo({wrappedToken, recipient, amount});

  printJson({action: "dac.unwrap", caller: account.address, dac, wrappedToken, underlyingToken, recipient, amount, txHash});
}

async function cmdPropose(resolver: OptionResolver, proposalTypeRaw: string, args: string[]): Promise<void> {
  const dac = resolveDacAddressOrThrow(resolver);
  const zero = "0x0000000000000000000000000000000000000000" as Address;
  const inputPath = resolver.resolveString("input");
  const input = inputPath ? await readJsonFile<Record<string, unknown>>(resolvePath(inputPath)) : undefined;

  const proposalType = proposalTypeFromText(proposalTypeRaw);

  let params: ProposalParams;
  if (proposalType === "update-voting-config") {
    if (args.length !== 5 && args.length !== 6 && !input) {
      throw new Error("dac propose update-voting-config requires positional args or --input json");
    }
    const quorumPercent = normalizePercentInput(args[0] ?? readStringField(input, "quorumPercent", "--input"));
    const blockingPercent = normalizePercentInput(args[1] ?? readStringField(input, "blockingPercent", "--input"));
    const highQuorumPercent = normalizePercentInput(args[2] ?? readStringField(input, "highQuorumPercent", "--input"));
    const duration = args[3] !== undefined ? BigInt(args[3]) : readBigIntField(input, "duration", "--input");
    const qualification = normalizePercentInput(args[4] ?? (input?.qualification !== undefined ? String(readBigIntField(input, "qualification", "--input")) : "0"));
    const executionValidityDuration = args[5] !== undefined
      ? BigInt(args[5])
      : input?.executionValidityDuration !== undefined
        ? readBigIntField(input, "executionValidityDuration", "--input")
        : duration;
    params = buildUpdateDacVotingConfigProposal({
      quorumPercent,
      blockingPercent,
      highQuorumPercent,
      duration,
      qualification,
      executionValidityDuration,
    });
  } else if (proposalType === "update-governance-strategy") {
    if (!input && args.length < 9) {
      throw new Error("dac propose update-governance-strategy requires positional args or --input json");
    }
    const quorumPercent = normalizePercentInput(args[0] ?? readStringField(input, "quorumPercent", "--input"));
    const highQuorumPercent = normalizePercentInput(args[1] ?? readStringField(input, "highQuorumPercent", "--input"));
    const blockingPercent = normalizePercentInput(args[2] ?? readStringField(input, "blockingPercent", "--input"));
    const duration = args[3] !== undefined ? BigInt(args[3]) : readBigIntField(input, "duration", "--input");
    const qualification = normalizePercentInput(args[4] ?? (input?.qualification !== undefined ? String(readBigIntField(input, "qualification", "--input")) : "0"));
    const executionValidityDuration = args[5] !== undefined ? BigInt(args[5]) : readBigIntField(input, "executionValidityDuration", "--input");
    const oraclePublishDeadline = args[6] !== undefined ? BigInt(args[6]) : readBigIntField(input, "oraclePublishDeadline", "--input");
    const fallbackWarmupDuration = args[7] !== undefined ? BigInt(args[7]) : readBigIntField(input, "fallbackWarmupDuration", "--input");
    const fallbackDuration = args[8] !== undefined ? BigInt(args[8]) : readBigIntField(input, "fallbackDuration", "--input");
    const blockingOnAllProposals = args[9] !== undefined ? parseBoolText(args[9]) : (input?.blockingOnAllProposals !== undefined ? readBoolField(input, "blockingOnAllProposals", "--input") : false);
    const blockingOnHighQuorum = args[10] !== undefined ? parseBoolText(args[10]) : (input?.blockingOnHighQuorum !== undefined ? readBoolField(input, "blockingOnHighQuorum", "--input") : true);
    const oraclePrimaryEnabled = args[11] !== undefined ? parseBoolText(args[11]) : (input?.oraclePrimaryEnabled !== undefined ? readBoolField(input, "oraclePrimaryEnabled", "--input") : true);
    params = buildUpdateGovernanceStrategyProposal({
      quorumPercent,
      highQuorumPercent,
      blockingPercent,
      duration,
      qualification,
      executionValidityDuration,
      oraclePublishDeadline,
      fallbackWarmupDuration,
      fallbackDuration,
      blockingOnAllProposals,
      blockingOnHighQuorum,
      oraclePrimaryEnabled,
    });
  } else if (proposalType === "update-deal-creation-config") {
    if (args.length !== 2 && !input) {
      throw new Error("dac propose update-deal-creation-config requires positional args or --input json");
    }
    const minAgentBalance = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "minAgentBalance", "--input");
    const minInitialAgentStake = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "minInitialAgentStake", "--input");
    params = buildUpdateDealCreationConfigProposal({minAgentBalance, minInitialAgentStake});
  } else if (proposalType === "update-governance-oracle") {
    if (args.length !== 1 && !input) {
      throw new Error("dac propose update-governance-oracle requires positional arg or --input json");
    }
    const oracle = args[0] ?? readStringField(input, "oracle", "--input");
    params = buildUpdateGovernanceOracleProposal(asAddress(oracle, "governance oracle"));
  } else if (proposalType === "update-legal-wrapper") {
    if (args.length !== 4 && !input) {
      throw new Error("dac propose update-legal-wrapper requires positional args or --input json");
    }
    const wrapperAddr = args[0] ?? readStringField(input, "wrapperAddr", "--input");
    const operatingAgreementIPFS = args[1] ?? readStringField(input, "operatingAgreementIPFS", "--input");
    const registeredAgent = args[2] ?? readStringField(input, "registeredAgent", "--input");
    const wrapperData = args[3] ?? readStringField(input, "data", "--input");
    params = {
      typ: DAC_PROPOSAL_TYPE.UPDATE_LEGAL_WRAPPER,
      target: zero,
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters(
        [{
          name: "wrapper",
          type: "tuple",
          components: [
            {name: "wrapperAddr", type: "address"},
            {name: "operatingAgreementIPFS", type: "string"},
            {name: "registeredAgent", type: "string"},
            {name: "data", type: "bytes"},
          ],
        }],
        [{
          wrapperAddr: asAddress(wrapperAddr, "wrapper address"),
          operatingAgreementIPFS,
          registeredAgent,
          data: z.string().regex(/^0x[0-9a-fA-F]*$/).parse(wrapperData) as Hex,
        }],
      ),
    };
  } else if (proposalType === "approve-offchain-action") {
    if (args.length !== 2 && !input) {
      throw new Error("dac propose approve-offchain-action requires positional args or --input json");
    }
    const selector = args[0] ?? readStringField(input, "selector", "--input");
    const dataHex = args[1] ?? readStringField(input, "data", "--input");
    params = {
      typ: DAC_PROPOSAL_TYPE.APPROVE_OFFCHAIN_ACTION,
      target: zero,
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters(
        [{name: "selector", type: "bytes4"}, {name: "data", type: "bytes"}],
        [asBytes4(selector, "offchain selector"), z.string().regex(/^0x[0-9a-fA-F]*$/).parse(dataHex) as Hex],
      ),
    };
  } else if (proposalType === "mint-agent-tokens") {
    requireNArgs(args, 2, "dac propose mint-agent-tokens requires <amount> <agent>");
    params = buildMintAgentTokensProposal(asAddress(args[1], "agent"), BigInt(args[0]));
  } else if (proposalType === "mint-agent-tokens-distributor") {
    requireNArgs(args, 2, "dac propose mint-agent-tokens-distributor requires <amount> <distributor>");
    params = buildMintAgentTokensDistributorProposal(asAddress(args[1], "distributor"), BigInt(args[0]));
  } else if (proposalType === "disable-agent-distributor") {
    requireNArgs(args, 1, "dac propose disable-agent-distributor requires <distributor>");
    params = buildDisableAgentDistributorProposal(asAddress(args[0], "distributor"));
  } else if (proposalType === "revoke-agent-tokens") {
    requireNArgs(args, 2, "dac propose revoke-agent-tokens requires <amount> <agent>");
    params = buildRevokeAgentTokensProposal(asAddress(args[1], "agent"), BigInt(args[0]));
  } else if (proposalType === "mint-main-tokens") {
    requireNArgs(args, 1, "dac propose mint-main-tokens requires <amount>");
    params = buildMintMainTokensReserveProposal(BigInt(args[0]));
  } else if (proposalType === "burn-main-tokens") {
    requireNArgs(args, 1, "dac propose burn-main-tokens requires <amount>");
    params = buildBurnMainTokensReserveProposal(BigInt(args[0]));
  } else if (proposalType === "toggle-dividends") {
    if (args.length !== 1 && !input) {
      throw new Error("dac propose toggle-dividends requires positional arg or --input json");
    }
    const enabled = args[0] !== undefined ? parseBoolText(args[0]) : readBoolField(input, "enabled", "--input");
    params = {
      typ: DAC_PROPOSAL_TYPE.TOGGLE_DIVIDENDS,
      target: zero,
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters([{name: "enabled", type: "bool"}], [enabled]),
    };
  } else if (proposalType === "dividend-payout") {
    if (args.length !== 3 && !input) {
      throw new Error("dac propose dividend-payout requires positional args or --input json");
    }
    const token = args[0] ?? readStringField(input, "token", "--input");
    const totalPayout = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "totalPayout", "--input");
    const merkleRoot = args[2] ?? readStringField(input, "merkleRoot", "--input");
    params = {
      typ: DAC_PROPOSAL_TYPE.DIVIDEND_PAYOUT,
      target: zero,
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters(
        [
          {name: "token", type: "address"},
          {name: "totalPayout", type: "uint256"},
          {name: "merkleRoot", type: "bytes32"},
        ],
        [asAddress(token, "dividend token"), totalPayout, asBytes32(merkleRoot, "merkle root")],
      ),
    };
  } else if (proposalType === "delegate-from-balance") {
    requireNArgs(args, 2, "dac propose delegate-from-balance requires <token> <delegatee>");
    params = buildDelegateVoteRightsProposal(asAddress(args[0], "token"), asAddress(args[1], "delegatee"));
  } else if (proposalType === "capital-call") {
    requireNArgs(args, 4, "dac propose capital-call requires <recipient> <treasuryToken> <tokenAmount> <cashAmount>");
    params = buildCapitalCallProposal(
      asAddress(args[0], "recipient"),
      asAddress(args[1], "treasury token"),
      BigInt(args[2]),
      BigInt(args[3]),
    );
  } else if (proposalType === "add-module") {
    requireNArgs(args, 1, "dac propose add-module requires <moduleFactory>");
    params = {
      typ: DAC_PROPOSAL_TYPE.ADD_MODULE,
      target: asAddress(args[0], "module factory"),
      i: numberToHex(0n, {size: 32}),
      data: "0x",
    };
  } else if (proposalType === "remove-module") {
    requireNArgs(args, 1, "dac propose remove-module requires <moduleFactory>");
    params = {
      typ: DAC_PROPOSAL_TYPE.REMOVE_MODULE,
      target: asAddress(args[0], "module factory"),
      i: numberToHex(0n, {size: 32}),
      data: "0x",
    };
  } else if (proposalType === "recover-deal") {
    if (args.length !== 3 && !input) {
      throw new Error("dac propose recover-deal requires positional args or --input json");
    }
    const dealId = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "dealId", "--input");
    const liquidator = args[1] ?? readStringField(input, "liquidator", "--input");
    const liquidatorStake = args[2] !== undefined ? BigInt(args[2]) : readBigIntField(input, "liquidatorStake", "--input");
    params = {
      typ: DAC_PROPOSAL_TYPE.RECOVER_DEAL,
      target: asAddress(liquidator, "liquidator"),
      i: numberToHex(liquidatorStake, {size: 32}),
      data: encodeAbiParameters([{name: "dealId", type: "uint256"}], [dealId]),
    };
  } else if (proposalType === "deal-message") {
    if (args.length !== 3 && !input) {
      throw new Error("dac propose deal-message requires positional args or --input json");
    }
    const dealId = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "dealId", "--input");
    const messageKind = args[1] ?? readStringField(input, "messageKind", "--input");
    const messageData = args[2] ?? readStringField(input, "messageData", "--input");
    params = {
      typ: DAC_PROPOSAL_TYPE.DEAL_MESSAGE,
      target: zero,
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters(
        [
          {name: "dealId", type: "uint256"},
          {name: "messageKind", type: "bytes4"},
          {name: "messageData", type: "bytes"},
        ],
        [dealId, asBytes4(messageKind, "message kind"), z.string().regex(/^0x[0-9a-fA-F]*$/).parse(messageData) as Hex],
      ),
    };
  } else if (proposalType === "challenge-deal") {
    if (args.length !== 2 && !input) {
      throw new Error("dac propose challenge-deal requires positional args or --input json");
    }
    const dealId = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "dealId", "--input");
    const dealProposalId = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "dealProposalId", "--input");
    params = buildChallengeDealProposal(dealId, dealProposalId);
  } else {
    if (args.length !== 4 && !input) {
      throw new Error("dac propose add-evaluator requires <dealId> <evaluatorModuleFactory> <evaluatorSelector> <evaluatorConfig> or --input json");
    }
    const dealId = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "dealId", "--input");
    const evaluatorModuleFactory = asAddress(
      args[1] ?? readStringField(input, "evaluatorModuleFactory", "--input"),
      "evaluator module factory",
    );
    const evaluatorSelector = args[2] ?? readStringField(input, "evaluatorSelector", "--input");
    const evaluatorConfigHex = args[3] ?? readStringField(input, "evaluatorConfig", "--input");
    const evaluatorConfig = encodeAbiParameters(
      [{name: "selector", type: "bytes4"}, {name: "params", type: "bytes"}],
      [asBytes4(evaluatorSelector, "evaluator selector"), z.string().regex(/^0x[0-9a-fA-F]*$/).parse(evaluatorConfigHex) as Hex],
    );

    params = {
      typ: DAC_PROPOSAL_TYPE.ADD_EVALUATOR,
      target: zero,
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters(
        [{name: "dealId", type: "uint256"}, {name: "evaluatorModuleFactory", type: "address"}, {name: "evaluatorConfig", type: "bytes"}],
        [dealId, evaluatorModuleFactory, evaluatorConfig],
      ),
    };
  }

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.createDacManagementProposal({dacCell: dac, params});
    printJson({action: "dac.propose", dryRun: true, dac, proposalType, transaction});
    return;
  }

  const {core} = await makeCoreContext(resolver);
  const created = await core.createDacManagementProposal({dacCell: dac, params});

  printJson({
    action: "dac.propose",
    dac,
    proposalType,
    txHash: created.txHash,
    proposalId: created.proposalId,
    proposalAddress: created.proposalAddress,
  });
}

async function cmdVoteProposal(resolver: OptionResolver, proposalIdText: string, supportText: string): Promise<void> {
  const proposal = await resolveDacProposalByNumericIdOrThrow(resolver, proposalIdText);
  const dac = resolveDacAddressOrThrow(resolver);
  const proposalId = BigInt(proposalIdText);
  const support = parseBoolText(supportText);

  if (!proposal.proposalAddress) {
    throw new Error(`DAC proposal #${proposalIdText} is missing proposalAddress in indexer`);
  }
  const proposalAddress = asAddress(proposal.proposalAddress, "Proposal address");

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.voteProposal({proposalAddress, support});
    printJson({action: "dac.vote.proposal", dryRun: true, dac, proposalId, proposalAddress, support, transaction});
    return;
  }

  const {core, rpcUrl} = await makeCoreContext(resolver);
  const preVoteAdvanceSeconds = resolver.resolveNumber("pre-vote-advance-seconds", 1) ?? 1;
  await advanceTime(rpcUrl, preVoteAdvanceSeconds);

  const voteTx = await core.voteProposal({proposalAddress, support});

  printJson({
    action: "dac.vote.proposal",
    dac,
    proposalId,
    proposalAddress,
    support,
    voteTx,
  });
}

async function cmdExecute(resolver: OptionResolver, proposalIdText: string): Promise<void> {
  const dac = resolveDacAddressOrThrow(resolver);
  const proposalId = BigInt(proposalIdText);

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.executeDacProposal({dacCell: dac, proposalId});
    printJson({action: "dac.execute", dryRun: true, dac, proposalId, transaction});
    return;
  }

  const {core, rpcUrl} = await makeCoreContext(resolver);
  const proposal = await resolveDacProposalByNumericIdOrThrow(resolver, proposalIdText);
  const proposalAddress = proposal.proposalAddress ? asAddress(proposal.proposalAddress, "Proposal address") : undefined;

  const advanceSeconds = resolver.resolveNumber("advance-seconds", 0) ?? 0;
  if (advanceSeconds > 0) {
    await advanceTime(rpcUrl, advanceSeconds);
  }

  const executeTx = await core.executeDacProposal({dacCell: dac, proposalId});

  printJson({
    action: "dac.execute",
    dac,
    proposalId,
    proposalAddress,
    executeTx,
  });
}

async function cmdJoin(resolver: OptionResolver): Promise<void> {
  const {account, core} = await makeCoreContext(resolver);
  const dac = resolveDacAddressOrThrow(resolver);

  let treasuryTokenText = resolver.resolveString("treasury-token");
  let recipientText = resolver.resolveString("recipient");
  let tokenAmount = resolver.resolveBigInt("token-amount");
  let cashAmount = resolver.resolveBigInt("cash-amount");
  let nonce = resolver.resolveBigInt("nonce");

  if (!treasuryTokenText || !recipientText || tokenAmount === undefined || cashAmount === undefined || nonce === undefined) {
    const client = makeIndexer(resolver);
    const dacId = await resolveDacIdOrThrow(resolver);
    const calls = await client.capitalCalls.listByDac(dacId, {limit: 200, offset: 0});

    const caller = account.address.toLowerCase();
    const pending = calls.filter((entry) => {
      if (!entry.recipient || entry.recipient.toLowerCase() !== caller) {
        return false;
      }

      if (nonce !== undefined && BigInt(entry.nonce) !== nonce) {
        return false;
      }

      return BigInt(entry.totalFulfilledTokenAmount) < BigInt(entry.tokenAmount)
        || BigInt(entry.totalFulfilledCashAmount) < BigInt(entry.cashAmount);
    });

    if (pending.length === 0) {
      throw new Error("No pending capital call found for caller. Provide explicit call params if needed.");
    }

    const selected = pending.length === 1
      ? pending[0]
      : pending
        .sort((a, b) => {
          const left = BigInt(a.nonce);
          const right = BigInt(b.nonce);
          if (left === right) return 0;
          return left > right ? -1 : 1;
        })[0];

    if (pending.length > 1 && nonce === undefined) {
      throw new Error(`Multiple pending capital calls found (${pending.length}). Pass --nonce to select one.`);
    }

    treasuryTokenText = treasuryTokenText ?? selected.treasuryTokenAddress;
    recipientText = recipientText ?? selected.recipient;
    tokenAmount = tokenAmount ?? BigInt(selected.tokenAmount);
    cashAmount = cashAmount ?? BigInt(selected.cashAmount);
    nonce = nonce ?? BigInt(selected.nonce);
  }

  if (!treasuryTokenText || !recipientText || tokenAmount === undefined || cashAmount === undefined || nonce === undefined) {
    throw new Error("Could not resolve full capital call fields. Provide --treasury-token --recipient --token-amount --cash-amount --nonce.");
  }

  const treasuryToken = asAddress(treasuryTokenText, "Treasury token");
  const recipient = asAddress(recipientText, "Capital call recipient");

  const autoApprove = resolver.resolveBoolean("auto-approve", true);
  let approveTx: Hex | undefined;
  if (autoApprove && cashAmount > 0n) {
    const allowance = await core.getErc20Allowance({token: treasuryToken, owner: account.address, spender: dac});
    if (allowance < cashAmount) {
      approveTx = await core.approveErc20({token: treasuryToken, spender: dac, amount: cashAmount});
    }
  }

  const call: CapitalCall = {
    treasuryToken,
    nonce,
    tokenRecipient: recipient,
    tokenAmount,
    cashAmount,
  };

  const fulfillTx = await core.fulfillCapitalCall({dacCell: dac, call});

  printJson({
    action: "dac.join",
    fulfiller: account.address,
    dac,
    approveTx,
    fulfillTx,
    call,
  });
}

async function cmdRecoverTreasury(resolver: OptionResolver): Promise<void> {
  const dac = resolveDacAddressOrThrow(resolver);
  const token = asAddress(resolver.requireString("token", "--token is required for dac recover-treasury"), "Token");

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.recoverTreasury({dacCell: dac, token});
    printJson({action: "dac.recover-treasury", dryRun: true, dac, token, transaction});
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const txHash = await core.recoverTreasury({dacCell: dac, token});
  printJson({action: "dac.recover-treasury", caller: account.address, dac, token, txHash});
}

async function cmdDepositTreasury(resolver: OptionResolver): Promise<void> {
  const dac = resolveDacAddressOrThrow(resolver);
  const token = asAddress(resolver.requireString("token", "--token is required for dac deposit-treasury"), "Token");
  const amount = resolver.requireBigInt("amount", "--amount is required for dac deposit-treasury");

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transactions = [];
    if (resolver.resolveBoolean("auto-approve", true) && amount > 0n) {
      transactions.push(ctx.txBuilder.approveErc20({token, spender: dac, amount}));
    }
    transactions.push(ctx.txBuilder.depositTreasury({dacCell: dac, token, amount}));
    printJson({action: "dac.deposit-treasury", dryRun: true, dac, token, amount, transactions});
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const autoApprove = resolver.resolveBoolean("auto-approve", true);
  let approveTx: Hex | undefined;
  if (autoApprove && amount > 0n) {
    const allowance = await core.getErc20Allowance({token, owner: account.address, spender: dac});
    if (allowance < amount) {
      approveTx = await core.approveErc20({token, spender: dac, amount});
    }
  }

  const txHash = await core.depositTreasury({dacCell: dac, token, amount});
  printJson({action: "dac.deposit-treasury", caller: account.address, dac, token, amount, approveTx, txHash});
}

async function cmdLegalMessage(resolver: OptionResolver, messageFile: string): Promise<void> {
  const dac = resolveDacAddressOrThrow(resolver);
  const payload = await readJsonFile<Record<string, unknown>>(resolvePath(messageFile));
  const kind = asBytes4(readStringField(payload, "kind", messageFile), "legal message kind");
  const message = z.string().regex(/^0x[0-9a-fA-F]*$/).parse(readStringField(payload, "message", messageFile)) as Hex;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.sendDacLegalWrapperMessage({dacCell: dac, kind, message});
    printJson({action: "dac.legal-message", dryRun: true, dac, kind, message, transaction});
    return;
  }

  const {core, account} = await makeCoreContext(resolver);
  const txHash = await core.sendDacLegalWrapperMessage({dacCell: dac, kind, message});
  printJson({action: "dac.legal-message", caller: account.address, dac, kind, message, txHash});
}

async function cmdClaimDividend(resolver: OptionResolver, proofFile: string): Promise<void> {
  const {core, account} = await makeCoreContext(resolver);
  const dac = resolveDacAddressOrThrow(resolver);
  const payload = await readJsonFile<Record<string, unknown>>(resolvePath(proofFile));

  const proposalId = readBigIntField(payload, "proposalId", proofFile);
  const index = readBigIntField(payload, "index", proofFile);
  const receiver = asAddress(readStringField(payload, "receiver", proofFile), "dividend receiver");
  const amount = readBigIntField(payload, "amount", proofFile);

  const proofListRaw = payload.proof;
  if (!Array.isArray(proofListRaw)) {
    throw new Error(`Missing bytes32[] field 'proof' in ${proofFile}`);
  }
  const proof = proofListRaw.map((entry, idx) => asBytes32(String(entry), `proof[${idx}]`));

  const txHash = await core.claimDividend({
    dacCell: dac,
    proposalId,
    index,
    receiver,
    amount,
    proof,
  });

  printJson({
    action: "dac.claim-dividend",
    caller: account.address,
    dac,
    proposalId,
    index,
    receiver,
    amount,
    proof,
    txHash,
  });
}

async function cmdView(resolver: OptionResolver, resourceRaw?: string, id?: string): Promise<void> {
  const client = makeIndexer(resolver);
  const page = resolvePage(resolver);

  const resource = z.enum([
    "dac",
    "dacs",
    "proposal",
    "dac-proposal",
    "proposals",
    "dac-proposals",
    "deals",
    "capital-calls",
    "treasury-holdings",
    "treasury-movements",
    "treasury-delegations",
    "governance-oracles",
    "wrapper-actions",
    "account",
  ]).catch("dac").parse(resourceRaw ?? "dac");

  if (resource === "dacs") {
    const dacs = await client.dacs.list(page);
    printJson({action: "dac.view.dacs", count: dacs.length, dacs});
    return;
  }

  if (resource === "dac") {
    const directId = id ?? resolver.resolveString(["dac-id", "id"]);
    const address = resolver.resolveString(["cell-address", "dac-address", "dac", "address"]);

    if (!directId && !address) {
      throw new Error("Provide DAC id/address via positional id, --dac-id, or --cell-address");
    }

    const dac = directId ? await client.dacs.getById(directId) : await client.dacs.getByAddress(address as string);
    if (!dac) {
      throw new Error("DAC not found in indexer");
    }

    printJson({action: "dac.view", dac});
    return;
  }

  if (resource === "proposal") {
    const proposalId = id ?? resolver.resolveString("id");
    if (!proposalId) {
      throw new Error("dac view proposal requires <proposalId>");
    }
    const proposal = await viewProposalByIdOrThrow(resolver, proposalId);
    printJson({action: "dac.view.proposal", proposal});
    return;
  }

  if (resource === "dac-proposal") {
    const proposalId = id ?? resolver.resolveString("id");
    if (!proposalId) {
      throw new Error("dac view dac-proposal requires <proposalId>");
    }

    const proposal = await client.proposals.getDacProposal(proposalId);
    if (!proposal) {
      throw new Error("DAC proposal not found in indexer");
    }

    printJson({action: "dac.view.dac-proposal", proposal});
    return;
  }

  if (resource === "proposals") {
    const dacId = await resolveDacIdOrThrow(resolver);
    const proposals = await client.proposals.listByDac(dacId, page);
    printJson({action: "dac.view.proposals", dacId, count: proposals.length, proposals});
    return;
  }

  if (resource === "dac-proposals") {
    const dacId = await resolveDacIdOrThrow(resolver);
    const proposals = await client.proposals.listDacProposalsByDac(dacId, page);
    printJson({action: "dac.view.dac-proposals", dacId, count: proposals.length, proposals});
    return;
  }

  if (resource === "deals") {
    const dacId = await resolveDacIdOrThrow(resolver);
    const deals = await client.deals.listByDac(dacId, page);
    printJson({action: "dac.view.deals", dacId, count: deals.length, deals});
    return;
  }

  if (resource === "account") {
    const address = id ?? resolver.resolveString("address");
    if (!address) {
      throw new Error("dac view account requires <address> or --address");
    }

    const account = await client.accounts.getByAddress(address);
    if (!account) {
      throw new Error("Account not found in indexer");
    }

    printJson({action: "dac.view.account", account});
    return;
  }

  const dacId = await resolveDacIdOrThrow(resolver);

  if (resource === "capital-calls") {
    const capitalCalls = await client.capitalCalls.listByDac(dacId, page);
    printJson({action: "dac.view.capital-calls", dacId, count: capitalCalls.length, capitalCalls});
    return;
  }

  if (resource === "treasury-holdings") {
    const holdings = await client.treasury.listHoldingsByDac(dacId, page);
    printJson({action: "dac.view.treasury-holdings", dacId, count: holdings.length, holdings});
    return;
  }

  if (resource === "treasury-movements") {
    const movements = await client.treasury.listMovementsByDac(dacId, page);
    printJson({action: "dac.view.treasury-movements", dacId, count: movements.length, movements});
    return;
  }

  if (resource === "treasury-delegations") {
    const delegations = await client.treasury.listDelegationsByDac(dacId, page);
    printJson({action: "dac.view.treasury-delegations", dacId, count: delegations.length, delegations});
    return;
  }

  if (resource === "governance-oracles") {
    const oracles = await client.oracle.listByDac(dacId, page);
    printJson({action: "dac.view.governance-oracles", dacId, count: oracles.length, oracles});
    return;
  }

  const wrapperActions = await client.wrapper.listByDac(dacId, page);
  printJson({action: "dac.view.wrapper-actions", dacId, count: wrapperActions.length, wrapperActions});
}

export function registerDacCommands(program: Command, resolverFactory: (options: Record<string, unknown>) => Promise<OptionResolver>): void {
  const create = program.command("create").description("Deploy a native DACCell");
  applyOptions(create, [
    "name",
    "description",
    "symbol",
    "treasury-token",
    "commitment",
    "allocation",
    "max-supply",
    "default-quorum",
    "dividends-enabled",
    "defer-birth-role",
    "auto-delegate",
  ]);
  addCommandHelp(create, {
    requirements: [
      {mode: "allOf", options: ["name", "description", "treasury-token", "commitment", "allocation"]},
    ],
    notes: [
      "This command deploys the native DAC mode. Use `dac create-existing-token` for wrapping an existing ERC-20 into DAC governance.",
    ],
    examples: [
      "dac create --name \"Ops DAC\" --description \"Operations\" --treasury-token 0x... --commitment 1000 --allocation 1000000",
    ],
  });
  create.action(async function handleCreate() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdCreate(resolver);
  });

  const createExistingToken = program.command("create-existing-token").description("Deploy an existing-token DACCell");
  applyOptions(createExistingToken, [
    "name",
    "description",
    "symbol",
    "underlying-token",
    "treasury-seed-amount",
    "oracle-admin",
    "initial-oracle-publisher",
    "dividends-enabled",
    "quorum-percent",
    "blocking-percent",
    "high-quorum-percent",
    "voting-duration",
    "qualification",
    "execution-validity-duration",
    "oracle-publish-deadline",
    "fallback-warmup-duration",
    "fallback-duration",
    "blocking-on-all-proposals",
    "blocking-on-high-quorum",
    "oracle-primary-enabled",
    "auto-approve",
    "auto-delegate",
  ]);
  addCommandHelp(createExistingToken, {
    requirements: [
      {mode: "allOf", options: ["name", "description", "underlying-token", "treasury-seed-amount"]},
    ],
    notes: [
      "Governance strategy flags are optional; CLI applies protocol-aligned defaults for quorum, timing, and hybrid oracle fallback windows.",
    ],
    examples: [
      "dac create-existing-token --name \"USDC DAC\" --description \"Treasury wrapper\" --underlying-token 0x... --treasury-seed-amount 1000000",
    ],
  });
  createExistingToken.action(async function handleCreateExistingToken() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdCreateExistingToken(resolver);
  });

  const delegate = program.command("delegate").description("Delegate DAC MainToken votes");
  applyOptions(delegate, ["cell-address", "dac-address", "dac", "delegatee"]);
  addCommandHelp(delegate, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
    ],
    examples: [
      "dac delegate --cell-address 0x... --delegatee 0x...",
    ],
  });
  delegate.action(async function handleDelegate() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdDelegate(resolver);
  });

  const propose = program.command("propose <proposalType> [args...]").description("Create a DAC governance proposal");
  applyOptions(propose, ["cell-address", "dac-address", "dac", "input"]);
  addCommandHelp(propose, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
    ],
  });
  propose.addHelpText("after", `
DAC proposal types:
  ${DAC_PROPOSAL_TYPES.join(", ")}

Proposal args can be passed either as positional arguments or via --input <json>.
Examples:
  dac propose mint-agent-tokens <amount> <agent>
  dac propose capital-call <recipient> <treasuryToken> <tokenAmount> <cashAmount>
  dac propose update-voting-config --input ./vote-config.json
`);
  propose.action(async function handlePropose(proposalType: string, args: string[]) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdPropose(resolver, proposalType, args);
    });

  const vote = program.command("vote").description("Vote DAC proposals");
  const voteProposal = vote.command("proposal <proposalId> <support>").description("Vote for a DAC proposal");
  applyOptions(voteProposal, ["cell-address", "dac-address", "dac", "pre-vote-advance-seconds"]);
  addCommandHelp(voteProposal, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
    ],
  });
  voteProposal.action(async function handleVoteProposal(proposalId: string, support: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdVoteProposal(resolver, proposalId, support);
  });

  const execute = program.command("execute <proposalId>").description("Execute a passed DAC proposal");
  applyOptions(execute, ["cell-address", "dac-address", "dac", "advance-seconds"]);
  addCommandHelp(execute, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
    ],
  });
  execute.action(async function handleExecute(proposalId: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdExecute(resolver, proposalId);
  });

  const joinOptionKeys: OptionKey[] = [
    "cell-address",
    "dac-address",
    "dac",
    "dac-id",
    "id",
    "address",
    "treasury-token",
    "recipient",
    "token-amount",
    "cash-amount",
    "nonce",
    "auto-approve",
  ];
  const join = program.command("join").description("Fulfill a capital call");
  applyOptions(join, joinOptionKeys);
  addCommandHelp(join, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac", "dac-id", "id", "address"], label: "DAC selector"},
    ],
    notes: [
      "Explicit capital call fields are optional. If omitted, CLI auto-selects a pending call for the caller from indexer data.",
    ],
  });
  join.action(async function handleJoin() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdJoin(resolver);
  });

  const recoverTreasury = program.command("recover-treasury").description("Recover treasury accounting for token");
  applyOptions(recoverTreasury, ["cell-address", "dac-address", "dac", "token"]);
  addCommandHelp(recoverTreasury, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
      {mode: "allOf", options: ["token"]},
    ],
  });
  recoverTreasury.action(async function handleRecoverTreasury() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdRecoverTreasury(resolver);
  });

  const depositTreasury = program.command("deposit-treasury").description("Deposit treasury funds into DACCell");
  applyOptions(depositTreasury, ["cell-address", "dac-address", "dac", "token", "amount", "auto-approve"]);
  addCommandHelp(depositTreasury, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
      {mode: "allOf", options: ["token", "amount"]},
    ],
  });
  depositTreasury.action(async function handleDepositTreasury() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdDepositTreasury(resolver);
  });

  const wrap = program.command("wrap").description("Wrap underlying tokens into the existing-token DAC main token");
  applyOptions(wrap, ["cell-address", "dac-address", "dac", "amount", "recipient", "auto-approve"]);
  addCommandHelp(wrap, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
      {mode: "allOf", options: ["amount"]},
    ],
    notes: [
      "Only valid for existing-token DACs. By default the CLI wraps to the caller and auto-approves the underlying token if needed.",
    ],
  });
  wrap.action(async function handleWrap() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdWrap(resolver);
  });

  const unwrap = program.command("unwrap").description("Unwrap existing-token DAC main token back into the underlying asset");
  applyOptions(unwrap, ["cell-address", "dac-address", "dac", "amount", "recipient"]);
  addCommandHelp(unwrap, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
      {mode: "allOf", options: ["amount"]},
    ],
    notes: [
      "Only valid for existing-token DACs. By default the CLI unwraps to the caller.",
    ],
  });
  unwrap.action(async function handleUnwrap() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdUnwrap(resolver);
  });

  const legalMessage = program.command("legal-message <messageFile>")
    .description("Send legal wrapper message to DACCell (requires legal wrapper caller)");
  applyOptions(legalMessage, ["cell-address", "dac-address", "dac"]);
  addCommandHelp(legalMessage, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
    ],
  });
  legalMessage.action(async function handleLegalMessage(messageFile: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdLegalMessage(resolver, messageFile);
  });

  const claimDividend = program.command("claim-dividend <proofFile>").description("Claim dividends using merkle proof JSON");
  applyOptions(claimDividend, ["cell-address", "dac-address", "dac"]);
  addCommandHelp(claimDividend, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
    ],
  });
  claimDividend.action(async function handleClaimDividend(proofFile: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdClaimDividend(resolver, proofFile);
  });

  const view = program.command("view [resource] [id]").description("View DAC/indexer state");
  applyOptions(view, ["dac-id", "id", "cell-address", "dac-address", "dac", "address", "query-limit", "query-offset", "limit", "offset"]);
  addCommandHelp(view, {
    notes: [
      "Resources: dac, dacs, proposal, dac-proposal, proposals, dac-proposals, deals, capital-calls, treasury-holdings, treasury-movements, treasury-delegations, governance-oracles, wrapper-actions, account.",
      "For resource=dac, provide DAC id/address using positional [id], --dac-id, --cell-address, --dac-address, --dac, or --address.",
      "For DAC-scoped list resources, DAC id is resolved from --dac-id or DAC address options.",
      "For resource=account, [id] is treated as wallet address and can be replaced by --address.",
    ],
  });
  view.action(async function handleView(resource: string | undefined, id: string | undefined) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdView(resolver, resource, id);
  });
}
