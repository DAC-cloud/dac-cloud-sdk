import {randomBytes} from "node:crypto";
import {resolve as resolvePath} from "node:path";
import {
  DAC_PROPOSAL_TYPE,
  buildBurnMainTokensReserveProposal,
  buildCapitalCallProposal,
  buildDelegateVoteRightsProposal,
  buildMintAgentTokensProposal,
  buildMintMainTokensReserveProposal,
  buildRevokeAgentTokensProposal,
  type CapitalCall,
  type DACConfig,
  type ProposalParams,
} from "@dac-cloud/core";
import {type Command} from "commander";
import {encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";
import {z} from "zod";
import {
  resolveDacAddressOrThrow,
  resolveDacIdOrThrow,
  resolvePage,
  viewProposalByIdOrThrow,
  asAddress,
  asBytes4,
  asBytes32,
  parseBoolText,
} from "./shared";
import type {OptionResolver} from "../runtime/config";
import {advanceTime, makeCoreContext, makeIndexer} from "../runtime/chain";
import {printJson, readJsonFile} from "../runtime/io";

const DAC_PROPOSAL_TYPES = [
  "update-voting-config",
  "update-legal-wrapper",
  "approve-offchain-action",
  "mint-agent-tokens",
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
  const {account, core} = await makeCoreContext(resolver);

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
  const defaultQuorum = resolver.resolveBigInt("default-quorum", 2_000_000_000n) ?? 2_000_000_000n;
  const dividendsEnabled = resolver.resolveBoolean("dividends-enabled", false);

  const config: DACConfig = {
    symbol: symbol.slice(0, 8),
    name,
    description,
    mainTokenMaxSupply,
    defaultQuorum,
    founder: account.address,
    founderAllocation,
    treasuryToken,
    founderCommitment,
    dividendsEnabled,
  };

  const deferBirthRole = resolver.resolveString("defer-birth-role") as Address | undefined;
  const result = await core.deployDac({config, salt: bytes32Random(), deferBirthRole});

  const autoDelegate = resolver.resolveBoolean("auto-delegate", false);
  let delegateTx: Hex | undefined;
  if (autoDelegate && result.dac && result.mainToken) {
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

async function cmdDelegate(resolver: OptionResolver): Promise<void> {
  const {account, core} = await makeCoreContext(resolver);
  const dac = resolveDacAddressOrThrow(resolver);
  const delegatee = asAddress(resolver.resolveString("delegatee", account.address) ?? account.address, "Delegatee");

  const mainToken = await core.getMainToken(dac);
  const txHash = await core.delegateVotes({token: mainToken, delegatee});
  const votes = await core.getVotes({token: mainToken, account: delegatee});

  printJson({
    action: "dac.delegate",
    dac,
    mainToken,
    delegatee,
    txHash,
    votes,
  });
}

async function cmdPropose(resolver: OptionResolver, proposalTypeRaw: string, args: string[]): Promise<void> {
  const {core} = await makeCoreContext(resolver);
  const dac = resolveDacAddressOrThrow(resolver);
  const zero = "0x0000000000000000000000000000000000000000" as Address;
  const inputPath = resolver.resolveString("input");
  const input = inputPath ? await readJsonFile<Record<string, unknown>>(resolvePath(inputPath)) : undefined;

  const proposalType = proposalTypeFromText(proposalTypeRaw);

  let params: ProposalParams;
  if (proposalType === "update-voting-config") {
    if (args.length !== 5 && !input) {
      throw new Error("dac propose update-voting-config requires positional args or --input json");
    }
    const quorumPercent = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "quorumPercent", "--input");
    const blockingPercent = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "blockingPercent", "--input");
    const highQuorumPercent = args[2] !== undefined ? BigInt(args[2]) : readBigIntField(input, "highQuorumPercent", "--input");
    const duration = args[3] !== undefined ? BigInt(args[3]) : readBigIntField(input, "duration", "--input");
    const qualification = args[4] !== undefined ? BigInt(args[4]) : readBigIntField(input, "qualification", "--input");
    params = {
      typ: DAC_PROPOSAL_TYPE.UPDATE_VOTING_CONFIG,
      target: zero,
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters(
        [{
          name: "config",
          type: "tuple",
          components: [
            {name: "quorumPercent", type: "uint256"},
            {name: "blockingPercent", type: "uint256"},
            {name: "highQuorumPercent", type: "uint256"},
            {name: "duration", type: "uint256"},
            {name: "qualification", type: "uint256"},
          ],
        }],
        [{
          quorumPercent,
          blockingPercent,
          highQuorumPercent,
          duration,
          qualification,
        }],
      ),
    };
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
  } else if (proposalType === "cast-veto-deal") {
    if (args.length !== 2 && !input) {
      throw new Error("dac propose cast-veto-deal requires positional args or --input json");
    }
    const dealId = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "dealId", "--input");
    const dealProposalId = args[1] !== undefined ? BigInt(args[1]) : readBigIntField(input, "dealProposalId", "--input");
    params = {
      typ: DAC_PROPOSAL_TYPE.CAST_VETO_DEAL,
      target: zero,
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters(
        [{name: "dealId", type: "uint256"}, {name: "dealProposalId", type: "uint256"}],
        [dealId, dealProposalId],
      ),
    };
  } else {
    if (args.length !== 3 && !input) {
      throw new Error("dac propose add-evaluator requires positional args or --input json");
    }
    const dealId = args[0] !== undefined ? BigInt(args[0]) : readBigIntField(input, "dealId", "--input");
    const evaluatorSelector = args[1] ?? readStringField(input, "evaluatorSelector", "--input");
    const evaluatorParams = args[2] ?? readStringField(input, "evaluatorParams", "--input");
    const evaluatorHandle = encodeAbiParameters(
      [{name: "selector", type: "bytes4"}, {name: "params", type: "bytes"}],
      [asBytes4(evaluatorSelector, "evaluator selector"), z.string().regex(/^0x[0-9a-fA-F]*$/).parse(evaluatorParams) as Hex],
    );

    params = {
      typ: DAC_PROPOSAL_TYPE.ADD_EVALUATOR,
      target: zero,
      i: numberToHex(0n, {size: 32}),
      data: encodeAbiParameters(
        [{name: "dealId", type: "uint256"}, {name: "evaluatorHandle", type: "bytes"}],
        [dealId, evaluatorHandle],
      ),
    };
  }

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
  const {core, rpcUrl} = await makeCoreContext(resolver);
  const dac = resolveDacAddressOrThrow(resolver);
  const proposalId = BigInt(proposalIdText);
  const support = parseBoolText(supportText);

  const proposalAddress = await core.getDacProposalVotingAddress({dacCell: dac, proposalId});
  const preVoteAdvanceSeconds = resolver.resolveNumber("pre-vote-advance-seconds", 1) ?? 1;
  await advanceTime(rpcUrl, preVoteAdvanceSeconds);

  const voteTx = await core.voteProposal({proposalAddress, support});
  const status = await core.checkProposalOutcome({proposalAddress});

  printJson({
    action: "dac.vote.proposal",
    dac,
    proposalId,
    proposalAddress,
    support,
    voteTx,
    status,
  });
}

async function cmdExecute(resolver: OptionResolver, proposalIdText: string): Promise<void> {
  const {core, rpcUrl} = await makeCoreContext(resolver);
  const dac = resolveDacAddressOrThrow(resolver);
  const proposalId = BigInt(proposalIdText);

  const proposalAddress = await core.getDacProposalVotingAddress({dacCell: dac, proposalId});

  let status = await core.checkProposalOutcome({proposalAddress});
  if (!status.resolved) {
    const advanceSeconds = resolver.resolveNumber("advance-seconds", 0) ?? 0;
    if (advanceSeconds > 0) {
      await advanceTime(rpcUrl, advanceSeconds);
      status = await core.checkProposalOutcome({proposalAddress});
    }
  }

  if (!status.resolved) {
    throw new Error("Proposal is not resolved yet. Pass --advance-seconds to advance local chain time.");
  }
  if (!status.outcome) {
    throw new Error("Proposal resolved with negative outcome.");
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
  const {account, core} = await makeCoreContext(resolver);
  const dac = resolveDacAddressOrThrow(resolver);
  const token = asAddress(
    resolver.requireString("token", "--token is required for dac recover-treasury"),
    "Token",
  );

  const txHash = await core.recoverTreasury({dacCell: dac, token});
  printJson({
    action: "dac.recover-treasury",
    caller: account.address,
    dac,
    token,
    txHash,
  });
}

async function cmdDepositTreasury(resolver: OptionResolver): Promise<void> {
  const {account, core} = await makeCoreContext(resolver);
  const dac = resolveDacAddressOrThrow(resolver);
  const token = asAddress(
    resolver.requireString("token", "--token is required for dac deposit-treasury"),
    "Token",
  );
  const amount = resolver.requireBigInt("amount", "--amount is required for dac deposit-treasury");

  const autoApprove = resolver.resolveBoolean("auto-approve", true);
  let approveTx: Hex | undefined;

  if (autoApprove && amount > 0n) {
    const allowance = await core.getErc20Allowance({token, owner: account.address, spender: dac});
    if (allowance < amount) {
      approveTx = await core.approveErc20({token, spender: dac, amount});
    }
  }

  const txHash = await core.depositTreasury({dacCell: dac, token, amount});

  printJson({
    action: "dac.deposit-treasury",
    caller: account.address,
    dac,
    token,
    amount,
    approveTx,
    txHash,
    note: "DACCell.depositTreasury can be restricted to registered deal callers in current contracts.",
  });
}

async function cmdLegalMessage(resolver: OptionResolver, messageFile: string): Promise<void> {
  const {core, account} = await makeCoreContext(resolver);
  const dac = resolveDacAddressOrThrow(resolver);
  const payload = await readJsonFile<Record<string, unknown>>(resolvePath(messageFile));

  const kind = asBytes4(readStringField(payload, "kind", messageFile), "legal message kind");
  const message = z.string().regex(/^0x[0-9a-fA-F]*$/).parse(readStringField(payload, "message", messageFile)) as Hex;

  const txHash = await core.sendDacLegalWrapperMessage({
    dacCell: dac,
    kind,
    message,
  });

  printJson({
    action: "dac.legal-message",
    caller: account.address,
    dac,
    kind,
    message,
    txHash,
  });
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

  const resource = z.enum(["dac", "proposal", "proposals", "deals", "capital-calls"]).catch("dac").parse(resourceRaw ?? "dac");

  if (resource === "dac") {
    const directId = id ?? resolver.resolveString(["dac-id", "id"]);
    const address = resolver.resolveString(["cell-address", "dac-address", "address"]);

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
    if (!id) {
      throw new Error("dac view proposal requires <proposalId>");
    }
    const proposal = await viewProposalByIdOrThrow(resolver, id);
    printJson({action: "dac.view.proposal", proposal});
    return;
  }

  if (resource === "proposals") {
    const dacId = await resolveDacIdOrThrow(resolver);
    const proposals = await client.proposals.listByDac(dacId, page);
    printJson({action: "dac.view.proposals", dacId, count: proposals.length, proposals});
    return;
  }

  if (resource === "deals") {
    const dacId = await resolveDacIdOrThrow(resolver);
    const deals = await client.deals.listByDac(dacId, page);
    printJson({action: "dac.view.deals", dacId, count: deals.length, deals});
    return;
  }

  const dacId = await resolveDacIdOrThrow(resolver);
  const capitalCalls = await client.capitalCalls.listByDac(dacId, page);
  printJson({action: "dac.view.capital-calls", dacId, count: capitalCalls.length, capitalCalls});
}

export function registerDacCommands(program: Command, resolverFactory: (options: Record<string, unknown>) => Promise<OptionResolver>): void {
  program
    .command("create")
    .description("Deploy a DACCell")
    .action(async function handleCreate() {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdCreate(resolver);
    });

  program
    .command("delegate")
    .description("Delegate DAC MainToken votes")
    .action(async function handleDelegate() {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdDelegate(resolver);
    });

  const propose = program
    .command("propose <proposalType> [args...]")
    .description("Create a DAC governance proposal");
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
  vote
    .command("proposal <proposalId> <support>")
    .description("Vote for a DAC proposal")
    .action(async function handleVoteProposal(proposalId: string, support: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdVoteProposal(resolver, proposalId, support);
    });

  program
    .command("execute <proposalId>")
    .description("Execute a passed DAC proposal")
    .action(async function handleExecute(proposalId: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdExecute(resolver, proposalId);
    });

  program
    .command("join")
    .description("Fulfill a capital call")
    .action(async function handleJoin() {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdJoin(resolver);
    });

  program
    .command("recover-treasury")
    .description("Recover treasury accounting for token")
    .action(async function handleRecoverTreasury() {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdRecoverTreasury(resolver);
    });

  program
    .command("deposit-treasury")
    .description("Deposit treasury funds into DACCell")
    .action(async function handleDepositTreasury() {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdDepositTreasury(resolver);
    });

  program
    .command("legal-message <messageFile>")
    .description("Send legal wrapper message to DACCell (requires legal wrapper caller)")
    .action(async function handleLegalMessage(messageFile: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdLegalMessage(resolver, messageFile);
    });

  program
    .command("claim-dividend <proofFile>")
    .description("Claim dividends using merkle proof JSON")
    .action(async function handleClaimDividend(proofFile: string) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdClaimDividend(resolver, proofFile);
    });

  program
    .command("view [resource] [id]")
    .description("View DAC/indexer state")
    .action(async function handleView(resource: string | undefined, id: string | undefined) {
      const resolver = await resolverFactory(this.optsWithGlobals());
      await cmdView(resolver, resource, id);
    });
}
