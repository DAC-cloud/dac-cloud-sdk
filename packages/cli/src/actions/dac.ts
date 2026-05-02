import {resolve as resolvePath} from "node:path";
import {
  accountFromPrivateKey,
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
  resolveSalt,
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
import {makeCoreContext, makeDryRunContext, makeIndexer, resolveApiUrl} from "../runtime/chain";
import {printJson, readJsonFile} from "../runtime/io";
import {discover} from "../auth/api.js";
import {resolveAuthToken} from "../auth/flows.js";

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

function proposalTypeFromText(text: string): string {
  if (text.startsWith("0x")) return text;
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
  const referralUid = resolver.resolveString("referral-uid") ?? undefined;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const config: DACConfig = {
      symbol: symbol.slice(0, 8), name, description, mainTokenMaxSupply, defaultQuorum,
      founder: ctx.fromAddress, founderAllocation, treasuryToken, founderCommitment, dividendsEnabled,
    };
    const salt = resolveSalt({referralUid});
    const transaction = ctx.txBuilder.deployDac({config, salt, deferBirthRole});
    printJson({
      action: "dac.create", dryRun: true, transaction, salt, referralUid,
      note: "After confirming, use the DACDeployed event to get mainToken address for delegation.",
    });
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const config: DACConfig = {
    symbol: symbol.slice(0, 8), name, description, mainTokenMaxSupply, defaultQuorum,
    founder: account.address, founderAllocation, treasuryToken, founderCommitment, dividendsEnabled,
  };

  const result = await core.deployDac({config, referralUid, deferBirthRole});

  const autoDelegate = resolver.resolveBoolean("auto-delegate", false);
  let delegateTx: Hex | undefined;
  if (autoDelegate && result.mainToken) {
    delegateTx = await core.delegateVotes({token: result.mainToken, delegatee: account.address});
  }

  printJson({
    action: "dac.create",
    creator: account.address,
    txHash: result.txHash,
    salt: result.salt,
    referralUid,
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
  const referralUid = resolver.resolveString("referral-uid") ?? undefined;
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
    blockingOnAllProposals: resolver.resolveBoolean("blocking-on-all-proposals", false),
    blockingOnHighQuorum: resolver.resolveBoolean("blocking-on-high-quorum", false),
    oraclePrimaryEnabled: resolver.resolveBoolean("oracle-primary-enabled", false),
  };

  const ZERO = "0x0000000000000000000000000000000000000000" as const;
  const governanceOracleRaw = resolver.resolveString("governance-oracle");
  const governanceOracle: Address = governanceOracleRaw
    ? asAddress(governanceOracleRaw, "governance oracle")
    : ZERO;

  if (governanceStrategy.oraclePrimaryEnabled && governanceOracle === ZERO) {
    throw new Error(
      "--governance-oracle is required when --oracle-primary-enabled is set.\n"
      + "Provide an existing oracle address (--governance-oracle 0x...), "
      + "or omit --oracle-primary-enabled to deploy in wrapped-only bootstrap mode.",
    );
  }

  function buildConfig(_senderAddress: Address): ExistingTokenDacConfig {
    return {
      symbol: symbol.slice(0, 8), name, description, underlyingToken, treasurySeedAmount,
      governanceOracle, dividendsEnabled, governanceStrategy,
    };
  }

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const config = buildConfig(ctx.fromAddress);
    const transactions = [];
    if (resolver.resolveBoolean("auto-approve", false) && treasurySeedAmount > 0n) {
      transactions.push(ctx.txBuilder.approveErc20({token: underlyingToken, spender: ctx.protocol.dacFactory, amount: treasurySeedAmount}));
    }
    const salt = resolveSalt({referralUid});
    transactions.push(ctx.txBuilder.deployExistingTokenDac({config, salt}));
    printJson({
      action: "dac.create.existing-token", dryRun: true, transactions, salt, referralUid, governanceStrategy,
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

  const result = await core.deployExistingTokenDac({config, referralUid});

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
    salt: result.salt,
    referralUid,
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

async function cmdBalance(resolver: OptionResolver, tokenText: string, holderText: string): Promise<void> {
  const token = asAddress(tokenText, "token address");
  const holder = asAddress(holderText, "holder address");
  const {core} = await makeCoreContext(resolver);
  const balance = await core.getErc20Balance({token, holder});
  printJson({action: "balance", token, holder, balance: balance.toString()});
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
    if (resolver.resolveBoolean("auto-approve", false) && amount > 0n) {
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
  } else if (proposalType === "add-evaluator") {
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
  } else if (proposalType.startsWith("0x")) {
    const typ = asBytes4(proposalType, "raw proposal type") as Hex;
    if (!input) {
      throw new Error("Raw DAC proposal type requires --input JSON with {target, i, data}.");
    }
    params = {
      typ,
      target: asAddress(readStringField(input, "target", "--input"), "target"),
      i: asBytes32(readStringField(input, "i", "--input"), "i"),
      data: z.string().regex(/^0x[0-9a-fA-F]*$/).parse(readStringField(input, "data", "--input")) as Hex,
    };
  } else {
    throw new Error(
      `Unsupported DAC proposal type '${proposalTypeRaw}'. `
      + `Supported types: ${DAC_PROPOSAL_TYPES.join(", ")}. `
      + `Or use a raw 0x bytes4 selector with --input JSON.`,
    );
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

  const {core} = await makeCoreContext(resolver);

  const txHash = await core.voteProposal({proposalAddress, support});

  printJson({
    action: "dac.vote.proposal",
    dac,
    proposalId,
    proposalAddress,
    support,
    txHash,
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

  const {core} = await makeCoreContext(resolver);
  const proposal = await resolveDacProposalByNumericIdOrThrow(resolver, proposalIdText);
  const proposalAddress = proposal.proposalAddress ? asAddress(proposal.proposalAddress, "Proposal address") : undefined;


  const txHash = await core.executeDacProposal({dacCell: dac, proposalId});

  printJson({
    action: "dac.execute",
    dac,
    proposalId,
    proposalAddress,
    txHash,
  });
}

// ---- Hybrid proposal phase management ----

type PhaseTransitionKind =
  | "activate-primary"
  | "begin-warmup"
  | "trigger-fallback"
  | "activate-fallback";

async function resolveProposalAddressForPhase(resolver: OptionResolver, proposalIdText: string): Promise<{dac: Address; proposalId: bigint; proposalAddress: Address}> {
  const dac = resolveDacAddressOrThrow(resolver);
  const proposalId = BigInt(proposalIdText);
  const proposal = await resolveDacProposalByNumericIdOrThrow(resolver, proposalIdText);
  if (!proposal.proposalAddress) {
    throw new Error(`DAC proposal #${proposalIdText} is missing proposalAddress in indexer`);
  }
  return {dac, proposalId, proposalAddress: asAddress(proposal.proposalAddress, "Proposal address")};
}

async function cmdProposalPhaseTransition(
  resolver: OptionResolver,
  proposalIdText: string,
  kind: PhaseTransitionKind,
): Promise<void> {
  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const dac = resolveDacAddressOrThrow(resolver);
    const proposalId = BigInt(proposalIdText);
    const proposal = await resolveDacProposalByNumericIdOrThrow(resolver, proposalIdText);
    if (!proposal.proposalAddress) {
      throw new Error(`DAC proposal #${proposalIdText} is missing proposalAddress in indexer`);
    }
    const proposalAddress = asAddress(proposal.proposalAddress, "Proposal address");
    let transaction;
    switch (kind) {
      case "activate-primary":
        transaction = ctx.txBuilder.activateHybridPrimaryVoting(proposalAddress);
        break;
      case "begin-warmup":
        transaction = ctx.txBuilder.beginHybridFallbackWarmup(proposalAddress);
        break;
      case "trigger-fallback":
        transaction = ctx.txBuilder.triggerHybridEmergencyFallback(proposalAddress);
        break;
      case "activate-fallback":
        transaction = ctx.txBuilder.activateHybridFallbackVoting(proposalAddress);
        break;
    }
    printJson({action: `dac.proposal.${kind}`, dryRun: true, dac, proposalId, proposalAddress, transaction});
    return;
  }

  const {core} = await makeCoreContext(resolver);

  const {dac, proposalId, proposalAddress} = await resolveProposalAddressForPhase(resolver, proposalIdText);

  let txHash: Hex;
  switch (kind) {
    case "activate-primary":
      txHash = await core.activateHybridPrimaryVoting(proposalAddress);
      break;
    case "begin-warmup":
      txHash = await core.beginHybridFallbackWarmup(proposalAddress);
      break;
    case "trigger-fallback":
      txHash = await core.triggerHybridEmergencyFallback(proposalAddress);
      break;
    case "activate-fallback":
      txHash = await core.activateHybridFallbackVoting(proposalAddress);
      break;
  }

  printJson({action: `dac.proposal.${kind}`, dac, proposalId, proposalAddress, txHash});
}

async function cmdProposalVoteMerkle(
  resolver: OptionResolver,
  proposalIdText: string,
  supportText: string,
  indexText: string,
  amountText: string,
  proofText: string,
): Promise<void> {
  const support = parseBoolText(supportText);
  const index = BigInt(indexText);
  const amount = BigInt(amountText);
  // proof: comma-separated bytes32 hex values, or @path/to/file.json with array
  let proof: Hex[];
  if (proofText.startsWith("@")) {
    const data = await readJsonFile<unknown>(resolvePath(proofText.slice(1)));
    if (!Array.isArray(data)) {
      throw new Error("Merkle proof file must contain a JSON array of bytes32 hex strings");
    }
    proof = data.map((entry, i) => asBytes32(String(entry), `proof[${i}]`));
  } else {
    proof = proofText.split(",").map((entry, i) => asBytes32(entry.trim(), `proof[${i}]`));
  }

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const {dac, proposalId, proposalAddress} = await resolveProposalAddressForPhase(resolver, proposalIdText);
    const transaction = ctx.txBuilder.voteMerkle({proposalAddress, support, index, amount, proof});
    printJson({action: "dac.proposal.vote-merkle", dryRun: true, dac, proposalId, proposalAddress, support, index, amount, transaction});
    return;
  }

  const {core} = await makeCoreContext(resolver);

  const {dac, proposalId, proposalAddress} = await resolveProposalAddressForPhase(resolver, proposalIdText);
  const txHash = await core.voteMerkle({proposalAddress, support, index, amount, proof});

  printJson({action: "dac.proposal.vote-merkle", dac, proposalId, proposalAddress, support, index, amount, txHash});
}

async function cmdProposalState(resolver: OptionResolver, proposalIdText: string): Promise<void> {
  const dac = resolveDacAddressOrThrow(resolver);
  const proposalId = BigInt(proposalIdText);
  const proposal = await resolveDacProposalByNumericIdOrThrow(resolver, proposalIdText);

  printJson({
    action: "dac.proposal.state",
    dac,
    proposalId,
    proposalAddress: proposal.proposalAddress,
    kind: proposal.kindName ?? proposal.kindSelector,
    proposalVariant: proposal.proposalVariant,
    currentPhase: proposal.currentPhase,
    phaseStartTime: proposal.phaseStartTime,
    phaseEndTime: proposal.phaseEndTime,
    snapshotBlock: proposal.currentPhaseSnapshotBlock,
    totalVotingPower: proposal.totalVotingPower,
    quorum: proposal.quorum,
    blockingQuorum: proposal.blockingQuorum,
    yesVotes: proposal.yesVotes,
    noVotes: proposal.noVotes,
    voteCount: proposal.voteCount,
    merkleVoteCount: proposal.merkleVoteCount,
    resolved: proposal.resolved,
    passed: proposal.passed,
    executed: proposal.executed,
    executionExpired: proposal.executionExpired,
    resolutionTime: proposal.resolutionTime,
    executionDeadline: proposal.executionDeadline,
  });
}

// ---- Oracle management commands ----

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

async function resolveOracleAddress(resolver: OptionResolver): Promise<Address> {
  const explicit = resolver.resolveString("governance-oracle");
  if (explicit) return asAddress(explicit, "governance oracle");

  const dacRecord = await resolveDacRecordOrThrow(resolver);
  if (dacRecord.governanceOracleAddress) {
    return asAddress(dacRecord.governanceOracleAddress, "governance oracle from DAC");
  }
  throw new Error("Cannot resolve oracle address. Pass --governance-oracle explicitly or use --dac with a DAC that has an oracle.");
}

async function cmdOracleDeploy(resolver: OptionResolver, adminText: string, publisherText?: string): Promise<void> {
  const admin = asAddress(adminText, "admin");
  const initialPublisher = publisherText ? asAddress(publisherText, "initial publisher") : ZERO_ADDRESS;

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transaction = ctx.txBuilder.deployGovernanceOracle({admin, initialPublisher});
    printJson({action: "dac.oracle.deploy", dryRun: true, admin, initialPublisher, transaction});
    return;
  }

  const {core} = await makeCoreContext(resolver);
  const result = await core.deployGovernanceOracle({admin, initialPublisher});
  printJson({action: "dac.oracle.deploy", txHash: result.txHash, oracleAddress: result.oracleAddress, admin, initialPublisher});
}

async function cmdOracleSetPublisher(resolver: OptionResolver, publisherText: string, allowedText: string): Promise<void> {
  const publisher = asAddress(publisherText, "publisher");
  const allowed = parseBoolText(allowedText);

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const governanceOracle = await resolveOracleAddress(resolver);
    const transaction = ctx.txBuilder.setGovernanceOraclePublisher({governanceOracle, publisher, allowed});
    printJson({action: "dac.oracle.set-publisher", dryRun: true, governanceOracle, publisher, allowed, transaction});
    return;
  }

  const {core} = await makeCoreContext(resolver);
  const governanceOracle = await resolveOracleAddress(resolver);
  const txHash = await core.setGovernanceOraclePublisher({governanceOracle, publisher, allowed});
  printJson({action: "dac.oracle.set-publisher", governanceOracle, publisher, allowed, txHash});
}

async function cmdOraclePublish(
  resolver: OptionResolver,
  proposalIdText: string,
  snapshotBlockText: string,
  merkleRootText: string,
  totalVotingPowerText: string,
): Promise<void> {
  const proposalId = BigInt(proposalIdText);
  const snapshotBlock = BigInt(snapshotBlockText);
  const merkleRoot = asBytes32(merkleRootText, "merkle root");
  const totalUnderlyingVotingPower = BigInt(totalVotingPowerText);
  const dac = resolveDacAddressOrThrow(resolver);

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const governanceOracle = await resolveOracleAddress(resolver);
    const transaction = ctx.txBuilder.publishGovernanceOracleSnapshot({governanceOracle, dac, proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower});
    printJson({action: "dac.oracle.publish", dryRun: true, governanceOracle, dac, proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower, transaction});
    return;
  }

  const {core} = await makeCoreContext(resolver);
  const governanceOracle = await resolveOracleAddress(resolver);
  const txHash = await core.publishGovernanceOracleSnapshot({governanceOracle, dac, proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower});
  printJson({action: "dac.oracle.publish", governanceOracle, dac, proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower, txHash});
}

async function cmdOracleDeactivate(resolver: OptionResolver): Promise<void> {
  const dac = resolveDacAddressOrThrow(resolver);

  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const governanceOracle = await resolveOracleAddress(resolver);
    const transaction = ctx.txBuilder.deactivateGovernanceOracle({governanceOracle, dac});
    printJson({action: "dac.oracle.deactivate", dryRun: true, governanceOracle, dac, transaction});
    return;
  }

  const {core} = await makeCoreContext(resolver);
  const governanceOracle = await resolveOracleAddress(resolver);
  const txHash = await core.deactivateGovernanceOracle({governanceOracle, dac});
  printJson({action: "dac.oracle.deactivate", governanceOracle, dac, txHash});
}

async function cmdOracleStatus(resolver: OptionResolver): Promise<void> {
  const indexer = await makeIndexer(resolver);
  const dacId = await resolveDacIdOrThrow(resolver);
  const oracles = await indexer.oracle.listByDac(dacId, {limit: 50, offset: 0});

  const explicitOracle = resolver.resolveString("governance-oracle")?.toLowerCase();
  const matched = explicitOracle
    ? oracles.filter((o) => o.address.toLowerCase() === explicitOracle)
    : oracles;

  if (matched.length === 0) {
    throw new Error(explicitOracle
      ? `Oracle ${explicitOracle} not found for this DAC in indexer.`
      : "No governance oracles found for this DAC in indexer.");
  }

  const result = matched.map((o) => ({
    address: o.address,
    active: o.active,
    publishers: (o as unknown as {publishers: Array<{publisherAddress: string; allowed: boolean}>}).publishers?.map((p) => ({
      address: p.publisherAddress,
      allowed: p.allowed,
    })) ?? [],
    createdBlockNumber: o.createdBlockNumber,
  }));

  printJson({action: "dac.oracle.status", dacId, oracles: result.length === 1 ? result[0] : result});
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
    const client = await makeIndexer(resolver);
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

  const autoApprove = resolver.resolveBoolean("auto-approve", false);
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

  const txHash = await core.fulfillCapitalCall({dacCell: dac, call});

  printJson({
    action: "dac.join",
    fulfiller: account.address,
    dac,
    approveTx,
    txHash,
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

  // The protocol restricts DACCell.depositTreasury to deals (capital return path).
  // For donations / treasury top-ups by EOAs, the proper flow is:
  //   1. Transfer tokens directly to the DACCell address (regular ERC20 transfer)
  //   2. Call recoverTreasury, which sweeps the held balance into the asset controller's
  //      accounting. recoverTreasury is callable by any holder/manager; the sync uses
  //      the qualification check inside the asset controller.
  if (isDryRun(resolver)) {
    const ctx = await makeDryRunContext(resolver);
    const transferTx = ctx.txBuilder.transferErc20({token, to: dac, amount});
    const recoverTx = ctx.txBuilder.recoverTreasury({dacCell: dac, token});
    printJson({action: "dac.deposit-treasury", dryRun: true, dac, token, amount, transactions: [transferTx, recoverTx]});
    return;
  }

  const {account, core} = await makeCoreContext(resolver);
  const transferTx = await core.transferErc20({token, to: dac, amount});
  const recoverTx = await core.recoverTreasury({dacCell: dac, token});
  printJson({action: "dac.deposit-treasury", caller: account.address, dac, token, amount, transferTx, recoverTx});
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
  const client = await makeIndexer(resolver);
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
    "legal-wrapper-messages",
    "legal-wrapper-state",
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

  if (resource === "wrapper-actions") {
    const wrapperActions = await client.wrapper.listByDac(dacId, page);
    printJson({action: "dac.view.wrapper-actions", dacId, count: wrapperActions.length, wrapperActions});
    return;
  }

  if (resource === "legal-wrapper-messages") {
    const messages = await client.legalWrapper.listMessagesByDac(dacId, page);
    printJson({action: "dac.view.legal-wrapper-messages", dacId, count: messages.length, messages});
    return;
  }

  const states = await client.legalWrapper.listStatesByDac(dacId, page);
  printJson({action: "dac.view.legal-wrapper-state", dacId, count: states.length, states});
}

async function cmdDiscover(resolver: OptionResolver): Promise<void> {
  const apiUrl = resolveApiUrl(resolver);
  const chainId = resolver.resolveNumber("chain-id");
  const privateKeyRaw = resolver.resolveString("private-key");
  const account = privateKeyRaw
    ? accountFromPrivateKey(privateKeyRaw as Hex)
    : undefined;

  const authToken = await resolveAuthToken({
    configToken: resolver.resolveString("auth-token"),
    configTokenExpires: resolver.resolveString("auth-expires"),
    chainId: chainId ?? 31337,
    account,
    apiUrl,
    dacs: [],
  });

  const result = await discover(apiUrl, authToken, chainId ?? undefined);
  printJson({action: "discover", ...result});
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
    "referral-uid",
    "auto-delegate",
  ]);
  addCommandHelp(create, {
    requirements: [
      {mode: "allOf", options: ["name", "description", "treasury-token", "commitment", "allocation"]},
    ],
    notes: [
      "This command deploys the native DAC mode. Use `dac create-existing-token` for wrapping an existing ERC-20 into DAC governance.",
      "Pass --referral-uid to derive a deterministic salt for referral tracking; otherwise a random salt is used.",
    ],
    examples: [
      "dac create --name \"Ops DAC\" --description \"Operations\" --treasury-token 0x... --commitment 1000 --allocation 1000000",
      "dac create --name \"Ops DAC\" --description \"Operations\" --treasury-token 0x... --commitment 1000 --allocation 1000000 --referral-uid campaign-42",
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
    "governance-oracle",
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
    "referral-uid",
    "auto-approve",
    "auto-delegate",
  ]);
  addCommandHelp(createExistingToken, {
    requirements: [
      {mode: "allOf", options: ["name", "description", "underlying-token", "treasury-seed-amount"]},
    ],
    notes: [
      "Governance strategy flags are optional; CLI applies protocol-aligned defaults for quorum, timing, and hybrid oracle fallback windows.",
      "Default mode is wrapped-only bootstrap (no oracle). Pass --oracle-primary-enabled --governance-oracle 0x... to enable oracle-primary voting.",
      "Oracle deployment is managed separately from this CLI. Provide an existing governance oracle address.",
      "Pass --referral-uid to derive a deterministic salt for referral tracking; otherwise a random salt is used.",
    ],
    examples: [
      "dac create-existing-token --name \"Bootstrap\" --underlying-token 0x... --treasury-seed-amount 1000000",
      "dac create-existing-token --name \"With Oracle\" --underlying-token 0x... --treasury-seed-amount 1000000 --oracle-primary-enabled --governance-oracle 0x...",
    ],
  });
  createExistingToken.action(async function handleCreateExistingToken() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdCreateExistingToken(resolver);
  });

  const balance = program.command("balance <token> <holder>").description("Read ERC20 balance of a holder for any token");
  addCommandHelp(balance, {
    examples: [
      "dac balance 0x<token> 0x<holder>",
    ],
  });
  balance.action(async function handleBalance(token: string, holder: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdBalance(resolver, token, holder);
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

Raw proposal (3rd party modules):
  dac propose 0x<bytes4> --input raw.json   (json: {target, i, data})
`);
  propose.action(async function handlePropose(proposalType: string, args: string[]) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdPropose(resolver, proposalType, args);
    });

  const vote = program.command("vote").description("Vote DAC proposals");
  const voteProposal = vote.command("proposal <proposalId> <support>").description("Vote for a DAC proposal");
  applyOptions(voteProposal, ["cell-address", "dac-address", "dac"]);
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
  applyOptions(execute, ["cell-address", "dac-address", "dac"]);
  addCommandHelp(execute, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
    ],
  });
  execute.action(async function handleExecute(proposalId: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdExecute(resolver, proposalId);
  });

  // Proposal lifecycle subcommand group (hybrid governance phase management)
  const proposal = program.command("proposal").description("Manage DAC proposal lifecycle (hybrid mode phase transitions)");
  const proposalSelectorOpts: OptionKey[] = ["cell-address", "dac-address", "dac"];
  const proposalSelectorRequirement = {mode: "oneOf" as const, options: ["cell-address", "dac-address", "dac"] as OptionKey[], label: "DAC selector"};

  const proposalActivatePrimary = proposal.command("activate-primary <proposalId>")
    .description("Activate primary voting after the oracle snapshot has been published");
  applyOptions(proposalActivatePrimary, [...proposalSelectorOpts]);
  addCommandHelp(proposalActivatePrimary, {
    requirements: [proposalSelectorRequirement],
    notes: ["Hybrid mode only. The contract also auto-activates this phase when vote() is called, so explicit activation is optional."],
  });
  proposalActivatePrimary.action(async function handleActivatePrimary(proposalId: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdProposalPhaseTransition(resolver, proposalId, "activate-primary");
  });

  const proposalBeginWarmup = proposal.command("begin-warmup <proposalId>")
    .description("Begin fallback warmup after oracle missed the snapshot deadline");
  applyOptions(proposalBeginWarmup, [...proposalSelectorOpts]);
  addCommandHelp(proposalBeginWarmup, {
    requirements: [proposalSelectorRequirement],
    notes: ["Required when oracle did not publish a snapshot before the deadline, or oracle is inactive."],
  });
  proposalBeginWarmup.action(async function handleBeginWarmup(proposalId: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdProposalPhaseTransition(resolver, proposalId, "begin-warmup");
  });

  const proposalTriggerFallback = proposal.command("trigger-fallback <proposalId>")
    .description("Emergency fallback transition when the oracle was deactivated mid-flight");
  applyOptions(proposalTriggerFallback, [...proposalSelectorOpts]);
  addCommandHelp(proposalTriggerFallback, {
    requirements: [proposalSelectorRequirement],
    notes: [
      "Use when the governance oracle has been deactivated while a proposal is in AwaitingOracleSnapshot or PrimaryVoting.",
      "Resets vote tallies and transitions the proposal into FallbackWarmup.",
    ],
  });
  proposalTriggerFallback.action(async function handleTriggerFallback(proposalId: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdProposalPhaseTransition(resolver, proposalId, "trigger-fallback");
  });

  const proposalActivateFallback = proposal.command("activate-fallback <proposalId>")
    .description("Activate fallback voting after the warmup period has elapsed");
  applyOptions(proposalActivateFallback, [...proposalSelectorOpts]);
  addCommandHelp(proposalActivateFallback, {
    requirements: [proposalSelectorRequirement],
    notes: ["The contract also auto-activates this phase when vote() is called after warmup, so explicit activation is optional."],
  });
  proposalActivateFallback.action(async function handleActivateFallback(proposalId: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdProposalPhaseTransition(resolver, proposalId, "activate-fallback");
  });

  const proposalVoteMerkle = proposal.command("vote-merkle <proposalId> <support> <index> <amount> <proof>")
    .description("Vote on a hybrid proposal using a Merkle proof (unwrapped holders during PrimaryVoting)");
  applyOptions(proposalVoteMerkle, [...proposalSelectorOpts]);
  addCommandHelp(proposalVoteMerkle, {
    requirements: [proposalSelectorRequirement],
    notes: [
      "<proof> is either a comma-separated list of bytes32 hex values, or @path/to/proof.json containing a JSON array.",
      "Only valid during PrimaryVoting phase against the published oracle snapshot.",
    ],
    examples: [
      "dac proposal vote-merkle 5 true 12 1000000000000000000 0xabc...,0xdef...",
      "dac proposal vote-merkle 5 true 12 1000000000000000000 @./proof.json",
    ],
  });
  proposalVoteMerkle.action(async function handleVoteMerkle(proposalId: string, support: string, index: string, amount: string, proofText: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdProposalVoteMerkle(resolver, proposalId, support, index, amount, proofText);
  });

  const proposalState = proposal.command("state <proposalId>")
    .description("Show current phase, deadlines, and voting state for a DAC proposal (read-only)");
  applyOptions(proposalState, proposalSelectorOpts);
  addCommandHelp(proposalState, {
    requirements: [proposalSelectorRequirement],
    notes: ["Reads from the indexer. Includes currentPhase, phase deadlines, vote tallies, and execution status."],
  });
  proposalState.action(async function handleProposalState(proposalId: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdProposalState(resolver, proposalId);
  });

  // Oracle management subcommand group
  const oracle = program.command("oracle").description("Manage governance oracles (deploy, publishers, snapshots)");
  const oracleSelectorOpts: OptionKey[] = ["governance-oracle", "cell-address", "dac-address", "dac"];
  const oracleSelectorRequirement = {mode: "oneOf" as const, options: ["governance-oracle", "cell-address", "dac-address", "dac"] as OptionKey[], label: "Oracle or DAC selector"};

  const oracleDeploy = oracle.command("deploy <admin> [publisher]")
    .description("Deploy a new governance oracle via DACFactory");
  applyOptions(oracleDeploy, []);
  oracleDeploy.action(async function handleOracleDeploy(admin: string, publisher?: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdOracleDeploy(resolver, admin, publisher);
  });
  addCommandHelp(oracleDeploy, {
    notes: [
      "Deploys a reference GovernanceOracle via DACFactory. The admin can manage publishers.",
      "[publisher] is optional — pass address(0) or omit to skip initial publisher assignment.",
    ],
    examples: [
      "dac oracle deploy 0xAdminAddr 0xPublisherAddr",
      "dac oracle deploy 0xAdminAddr",
    ],
  });

  const oracleSetPublisher = oracle.command("set-publisher <publisher> <allowed>")
    .description("Grant or revoke publisher role on the governance oracle");
  applyOptions(oracleSetPublisher, oracleSelectorOpts);
  addCommandHelp(oracleSetPublisher, {
    requirements: [oracleSelectorRequirement],
    examples: ["dac oracle set-publisher 0xPublisher true --governance-oracle 0x..."],
  });
  oracleSetPublisher.action(async function handleSetPublisher(publisher: string, allowed: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdOracleSetPublisher(resolver, publisher, allowed);
  });

  const oraclePublish = oracle.command("publish <proposalId> <snapshotBlock> <merkleRoot> <totalVotingPower>")
    .description("Publish an oracle snapshot for a proposal (requires publisher role)");
  applyOptions(oraclePublish, oracleSelectorOpts);
  addCommandHelp(oraclePublish, {
    requirements: [oracleSelectorRequirement],
    notes: ["Requires the caller to have the PUBLISHER_ROLE on the oracle."],
    examples: ["dac oracle publish 5 12345678 0xabc...def 1000000000000000000 --governance-oracle 0x..."],
  });
  oraclePublish.action(async function handleOraclePublish(proposalId: string, snapshotBlock: string, merkleRoot: string, totalVotingPower: string) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdOraclePublish(resolver, proposalId, snapshotBlock, merkleRoot, totalVotingPower);
  });

  const oracleDeactivate = oracle.command("deactivate")
    .description("Deactivate the governance oracle (admin or publisher)");
  applyOptions(oracleDeactivate, oracleSelectorOpts);
  addCommandHelp(oracleDeactivate, {
    requirements: [oracleSelectorRequirement],
    notes: ["Once deactivated, no new snapshots can be published. Active proposals will fall back to wrapped-only voting."],
  });
  oracleDeactivate.action(async function handleOracleDeactivate() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdOracleDeactivate(resolver);
  });

  const oracleStatus = oracle.command("status")
    .description("Show governance oracle state (active, publishers) from indexer");
  applyOptions(oracleStatus, oracleSelectorOpts);
  addCommandHelp(oracleStatus, {
    requirements: [oracleSelectorRequirement],
  });
  oracleStatus.action(async function handleOracleStatus() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdOracleStatus(resolver);
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

  const depositTreasury = program.command("deposit-treasury").description("Donate tokens to a DAC's treasury (transfer + recover)");
  applyOptions(depositTreasury, ["cell-address", "dac-address", "dac", "token", "amount"]);
  addCommandHelp(depositTreasury, {
    requirements: [
      {mode: "oneOf", options: ["cell-address", "dac-address", "dac"], label: "DAC selector"},
      {mode: "allOf", options: ["token", "amount"]},
    ],
    notes: [
      "Two-step flow: transfers tokens from caller directly to the DAC cell address, then calls `recoverTreasury` to sync the asset controller's accounting.",
      "Caller must be a qualified holder (per the DAC's voting qualification) to call `recoverTreasury`.",
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
      "Resources: dac, dacs, proposal, dac-proposal, proposals, dac-proposals, deals, capital-calls, treasury-holdings, treasury-movements, treasury-delegations, governance-oracles, wrapper-actions, legal-wrapper-messages, legal-wrapper-state, account.",
      "For resource=dac, provide DAC id/address using positional [id], --dac-id, --cell-address, --dac-address, --dac, or --address.",
      "For DAC-scoped list resources, DAC id is resolved from --dac-id or DAC address options.",
      "For resource=account, [id] is treated as wallet address and can be replaced by --address.",
    ],
  });
  view.action(async function handleView(resource: string | undefined, id: string | undefined) {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdView(resolver, resource, id);
  });

  const discoverCmd = program.command("discover").description("Discover DACs associated with the current wallet");
  applyOptions(discoverCmd, ["config", "chain-id", "api-url", "private-key", "pretty-print"]);
  addCommandHelp(discoverCmd, {
    notes: [
      "Lists all DACs where the wallet holds MainToken, AgentToken, or has staked positions.",
      "If --chain-id is provided, only that chain is queried. Otherwise all supported chains are queried.",
      "Works with both guest and member JWTs.",
    ],
    examples: [
      "dac discover",
      "dac discover --chain-id 31337",
    ],
  });
  discoverCmd.action(async function handleDiscover() {
    const resolver = await resolverFactory(this.optsWithGlobals());
    await cmdDiscover(resolver);
  });
}
