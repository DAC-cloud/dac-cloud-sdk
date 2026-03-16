#!/usr/bin/env node
import {randomBytes} from "node:crypto";
import {resolve} from "node:path";
import {
  accountFromPrivateKey,
  buildTreasuryApproveAgentSpendProposal,
  buildTreasuryAssignClaimerProposal,
  buildTreasuryDelegateVoteRightsProposal,
  buildTreasuryDirectSpendProposal,
  buildTreasuryPermit2SpendProposal,
  buildTreasuryReturnCapitalProposal,
  buildTreasuryRevokeAgentProposal,
  buildBurnMainTokensReserveProposal,
  buildCapitalCallProposal,
  buildDelegateVoteRightsProposal,
  buildMintAgentTokensProposal,
  buildMintMainTokensReserveProposal,
  buildRevokeAgentTokensProposal,
  createDacCoreClient,
  coreModule,
  type CapitalCall,
  type DACConfig,
  formatViemError,
  type ProposalParams,
  CORE_DEAL_KIND,
  CORE_EVALUATOR_KIND,
  DEAL_PROPOSAL_TYPE,
} from "@dac-cloud/core";
import {loadProtocolManifest, tryLoadBasicDacSeed} from "@dac-cloud/manifests";
import {defineChain, encodeAbiParameters, numberToHex, type Address, type Hex} from "viem";

const DEFAULT_ANVIL_PK_0 =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as Hex;

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const maybeValue = argv[i + 1];
    if (!maybeValue || maybeValue.startsWith("--")) {
      out[key] = "true";
      continue;
    }
    out[key] = maybeValue;
    i += 1;
  }
  return out;
}

function toBigIntArg(value: string | undefined, fallback: bigint): bigint {
  if (!value) return fallback;
  return BigInt(value);
}

function toBoolArg(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback;
  return value === "true" || value === "1" || value === "yes";
}

async function rpcCall<T>(rpcUrl: string, method: string, params: unknown[]): Promise<T> {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });

  const payload = await response.json() as {result?: T; error?: {message?: string}};
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message ?? `RPC call failed: ${method}`);
  }

  return payload.result as T;
}

async function advanceTime(rpcUrl: string, seconds: number): Promise<void> {
  if (seconds <= 0) return;
  await rpcCall<string>(rpcUrl, "evm_increaseTime", [seconds]);
  await rpcCall<string>(rpcUrl, "evm_mine", []);
}

async function makeCoreFromArgs(args: Record<string, string>) {
  const chainId = Number(args["chain-id"] ?? "31337");
  const rpcUrl = args["rpc-url"] ?? "http://127.0.0.1:8545";
  const contractsRoot = resolve(args["contracts-root"] ?? process.env.DAC_CONTRACTS_ROOT ?? "../dac-cloud-contracts");
  const privateKey = (args["private-key"] as Hex | undefined) ?? DEFAULT_ANVIL_PK_0;
  const account = accountFromPrivateKey(privateKey);

  const chain = defineChain({
    id: chainId,
    name: `dac-${chainId}`,
    nativeCurrency: {name: "ETH", symbol: "ETH", decimals: 18},
    rpcUrls: {
      default: {http: [rpcUrl]},
      public: {http: [rpcUrl]},
    },
  });

  const protocol = await loadProtocolManifest(chainId, {contractsRoot});
  const core = createDacCoreClient({chain, rpcUrl, account, protocol});

  return {chainId, rpcUrl, contractsRoot, account, protocol, core};
}

function usage() {
  process.stdout.write(
    [
      "dac CLI",
      "",
      "Commands:",
      "  dac create-dacs --count 10 [--rpc-url http://127.0.0.1:8545] [--chain-id 31337]",
      "  dac delegate-main --dac <dacCellAddress> [--delegatee <address>]",
      "  dac mint-agent-tokens --dac <dacCellAddress> --agent <address> --amount <uint256>",
      "  dac revoke-agent-tokens --dac <dacCellAddress> --agent <address> --amount <uint256>",
      "  dac mint-main-reserve --dac <dacCellAddress> --amount <uint256>",
      "  dac burn-main-reserve --dac <dacCellAddress> --amount <uint256>",
      "  dac delegate-vote-rights-proposal --dac <dacCellAddress> --token <address> --delegatee <address>",
      "  dac capital-call-propose --dac <dacCellAddress> --recipient <address> --treasury-token <address> --token-amount <uint256> --cash-amount <uint256>",
      "  dac capital-call-fulfill --dac <dacCellAddress> --treasury-token <address> --recipient <address> --token-amount <uint256> --cash-amount <uint256> --nonce <uint256>",
      "  dac recover-treasury --dac <dacCellAddress> --token <address>",
      "  dac deposit-treasury --dac <dacCellAddress> --token <address> --amount <uint256>",
      "  dac create-treasury-deal --dac <dacCellAddress> --funding-token <address> --funding-amount <uint256>",
      "  dac dac-proposal-vote-execute --dac <dacCellAddress> --proposal-id <uint256> [--support true]",
      "  dac stake-agent-to-deal --dac <dacCellAddress> --deal-cell <address> --amount <uint256>",
      "  dac delegate-stake --deal-cell <address> [--delegatee <address>]",
      "  dac request-tranche --deal <dealAddress> --token <address> --amount <uint256>",
      "  dac approve-tranche --dac <dacCellAddress> --proposal-id <uint256>",
      "  dac treasury-direct-spend --deal <dealAddress> --token <address> --destination <address> --amount <uint256>",
      "  dac treasury-permit2-spend --deal <dealAddress> --token <address> --spender <address> --amount <uint256> --expiration <uint48>",
      "  dac treasury-return-capital --deal <dealAddress> --token <address> --amount <uint256>",
      "  dac treasury-approve-agent-spend --deal <dealAddress> --token <address> --agent <address> --destination <address> --total-amount <uint160> --single-tx-amount <uint160> --clock-limit <uint256> --duration <uint256>",
      "  dac treasury-assign-claimer --deal <dealAddress> --agent <address> --token <address> --counterparty <address> --amount <uint160>",
      "  dac treasury-revoke-agent --deal <dealAddress> --token <address> --agent <address> --counterparty <address>",
      "  dac treasury-delegate-vote-rights --deal <dealAddress> --token <address> --delegatee <address>",
      "",
      "Important flags:",
      "  --contracts-root /path/to/dac-cloud-contracts",
      "  --private-key 0x... (defaults to Anvil account #0)",
      "  --treasury-token 0x... (auto-fallback from basic-dac-seed manifest in create-dacs)",
      "",
      "Proposal flow flags:",
      "  --auto-delegate true|false (default true)",
      "  --auto-vote true|false (default true)",
      "  --auto-execute true|false (default true)",
      "  --support true|false (default true)",
      "  --stake-token 0x... (optional, used for auto-delegate in deal-level proposals)",
      "  --pre-vote-advance-seconds N (default 1)",
      "  --advance-seconds N (optional; command-specific fallback when omitted)",
      "",
    ].join("\n"),
  );
}

async function runDacProposalLifecycle(input: {
  args: Record<string, string>;
  dac: Address;
  params: ProposalParams;
}) {
  const {args, dac, params} = input;
  const {account, core, rpcUrl} = await makeCoreFromArgs(args);

  const autoDelegate = toBoolArg(args["auto-delegate"], true);
  const autoVote = toBoolArg(args["auto-vote"], true);
  const autoExecute = toBoolArg(args["auto-execute"], true);
  const support = toBoolArg(args.support, true);
  const preVoteAdvanceSeconds = Number(args["pre-vote-advance-seconds"] ?? "1");
  const explicitAdvanceSeconds = args["advance-seconds"] ? Number(args["advance-seconds"]) : undefined;

  const mainToken = await core.getMainToken(dac);
  let delegateTx: Hex | undefined;
  if (autoDelegate) {
    delegateTx = await core.delegateVotes({token: mainToken, delegatee: account.address});
  }

  const created = await core.createDacManagementProposal({dacCell: dac, params});
  const proposalId = created.proposalId;
  const proposalAddress = created.proposalAddress
    ?? (proposalId !== undefined ? await core.getDacProposalVotingAddress({dacCell: dac, proposalId}) : undefined);

  if (proposalAddress && autoVote) {
    if (preVoteAdvanceSeconds > 0) {
      await advanceTime(rpcUrl, preVoteAdvanceSeconds);
    }
    await core.voteProposal({proposalAddress, support});
  }

  let executeTx: Hex | undefined;
  if (proposalAddress && autoExecute && proposalId !== undefined) {
    let status = await core.checkProposalOutcome({proposalAddress});
    if (!status.resolved) {
      const advanceSeconds = explicitAdvanceSeconds ?? Number((await core.getDacVotingConfig({dacCell: dac})).duration + 1n);
      await advanceTime(rpcUrl, advanceSeconds);
      status = await core.checkProposalOutcome({proposalAddress});
    }

    if (status.resolved && status.outcome) {
      executeTx = await core.executeDacProposal({dacCell: dac, proposalId});
    } else if (!status.resolved) {
      throw new Error("Proposal is not resolved yet.");
    } else {
      throw new Error("Proposal resolved with negative outcome.");
    }
  }

  return {
    account,
    core,
    mainToken,
    delegateTx,
    proposalTx: created.txHash,
    proposalId,
    proposalAddress,
    executeTx,
  };
}

async function runDealProposalLifecycle(input: {
  args: Record<string, string>;
  deal: Address;
  params: ProposalParams;
}) {
  const {args, deal, params} = input;
  const {account, core, rpcUrl} = await makeCoreFromArgs(args);

  const autoDelegate = toBoolArg(args["auto-delegate"], true);
  const autoVote = toBoolArg(args["auto-vote"], true);
  const autoExecute = toBoolArg(args["auto-execute"], true);
  const support = toBoolArg(args.support, true);
  const preVoteAdvanceSeconds = Number(args["pre-vote-advance-seconds"] ?? "1");
  const explicitAdvanceSeconds = args["advance-seconds"] ? Number(args["advance-seconds"]) : undefined;

  const stakeToken = args["stake-token"] as Address | undefined;
  let delegateTx: Hex | undefined;
  if (autoDelegate && stakeToken) {
    delegateTx = await core.delegateVotes({token: stakeToken, delegatee: account.address});
  }

  const created = await core.createDealManagementProposal({dealAddress: deal, params});
  const proposalId = created.proposalId;
  const proposalAddress = created.proposalAddress
    ?? (proposalId !== undefined ? await core.getDealProposalVotingAddress({dealAddress: deal, proposalId}) : undefined);

  if (proposalAddress && autoVote) {
    if (preVoteAdvanceSeconds > 0) {
      await advanceTime(rpcUrl, preVoteAdvanceSeconds);
    }
    await core.voteProposal({proposalAddress, support});
  }

  let executeTx: Hex | undefined;
  if (proposalAddress && autoExecute && proposalId !== undefined) {
    let status = await core.checkProposalOutcome({proposalAddress});
    if (!status.resolved) {
      const advanceSeconds = explicitAdvanceSeconds ?? 24 * 60 * 60;
      await advanceTime(rpcUrl, advanceSeconds);
      status = await core.checkProposalOutcome({proposalAddress});
    }

    if (status.resolved && status.outcome) {
      executeTx = await core.executeDealProposal({dealAddress: deal, proposalId});
    } else if (!status.resolved) {
      throw new Error("Deal proposal is not resolved yet.");
    } else {
      throw new Error("Deal proposal resolved with negative outcome.");
    }
  }

  return {
    account,
    stakeToken,
    delegateTx,
    proposalTx: created.txHash,
    proposalId,
    proposalAddress,
    executeTx,
  };
}

async function createDacs(args: Record<string, string>) {
  const {chainId, account, protocol, core, contractsRoot} = await makeCoreFromArgs(args);
  const count = Number(args.count ?? "1");

  if (!Number.isFinite(count) || count < 1) {
    throw new Error("--count should be a positive integer");
  }

  const basicSeed = await tryLoadBasicDacSeed(chainId, "seed", {contractsRoot});

  const treasuryToken = (args["treasury-token"] ?? (basicSeed?.treasuryToken as string | undefined)) as `0x${string}` | undefined;
  if (!treasuryToken) {
    throw new Error("Treasury token is required. Pass --treasury-token or ensure basic-dac-seed manifest exists.");
  }

  process.stdout.write(`Using founder ${account.address}\n`);
  process.stdout.write(`Using DACFactory ${protocol.dacFactory}\n`);

  for (let i = 0; i < count; i += 1) {
    const label = `${args.prefix ?? "stress"}-${i}`;
    const config: DACConfig = {
      symbol: (args.symbol ?? "DAC").slice(0, 8),
      name: `${args.name ?? "DAC Stress"} ${i}`,
      description: `${args.description ?? "Load generation DAC"} #${i}`,
      mainTokenMaxSupply: toBigIntArg(args["max-supply"], 1_000_000n * 10n ** 18n),
      defaultQuorum: toBigIntArg(args["default-quorum"], 2_000_000_000n),
      founder: account.address,
      founderAllocation: toBigIntArg(args["founder-allocation"], 100_000n * 10n ** 18n),
      treasuryToken,
      founderCommitment: toBigIntArg(args["founder-commitment"], 0n),
      dividendsEnabled: args.dividends === "true",
    };

    const salt = (`0x${randomBytes(32).toString("hex")}`) as Hex;
    const result = await core.deployDac({config, salt});

    process.stdout.write(
      JSON.stringify({
        action: "create-dac",
        label,
        txHash: result.txHash,
        dac: result.dac,
        mainToken: result.mainToken,
        agentToken: result.agentToken,
      }) + "\n",
    );
  }
}

async function delegateMain(args: Record<string, string>) {
  const {account, core} = await makeCoreFromArgs(args);
  const dac = args.dac as Address | undefined;
  if (!dac) {
    throw new Error("--dac is required");
  }

  const delegatee = (args.delegatee as Address | undefined) ?? account.address;
  const mainToken = await core.getMainToken(dac);
  const txHash = await core.delegateVotes({token: mainToken, delegatee});
  const votes = await core.getVotes({token: mainToken, account: delegatee});

  process.stdout.write(
    JSON.stringify({
      action: "delegate-main",
      dac,
      mainToken,
      delegatee,
      txHash,
      votes: votes.toString(),
    }) + "\n",
  );
}

async function mintAgentTokens(args: Record<string, string>) {
  const dac = args.dac as Address | undefined;
  const agent = args.agent as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!dac || !agent || amount === undefined) {
    throw new Error("--dac, --agent and --amount are required");
  }

  const result = await runDacProposalLifecycle({
    args,
    dac,
    params: buildMintAgentTokensProposal(agent, amount),
  });

  process.stdout.write(
    JSON.stringify({
      action: "mint-agent-tokens",
      dac,
      agent,
      amount: amount.toString(),
      mainToken: result.mainToken,
      delegateTx: result.delegateTx,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function revokeAgentTokens(args: Record<string, string>) {
  const dac = args.dac as Address | undefined;
  const agent = args.agent as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!dac || !agent || amount === undefined) {
    throw new Error("--dac, --agent and --amount are required");
  }

  const result = await runDacProposalLifecycle({
    args,
    dac,
    params: buildRevokeAgentTokensProposal(agent, amount),
  });

  process.stdout.write(
    JSON.stringify({
      action: "revoke-agent-tokens",
      dac,
      agent,
      amount: amount.toString(),
      mainToken: result.mainToken,
      delegateTx: result.delegateTx,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function mintMainReserve(args: Record<string, string>) {
  const dac = args.dac as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!dac || amount === undefined) {
    throw new Error("--dac and --amount are required");
  }

  const result = await runDacProposalLifecycle({
    args,
    dac,
    params: buildMintMainTokensReserveProposal(amount),
  });

  process.stdout.write(
    JSON.stringify({
      action: "mint-main-reserve",
      dac,
      amount: amount.toString(),
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function burnMainReserve(args: Record<string, string>) {
  const dac = args.dac as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!dac || amount === undefined) {
    throw new Error("--dac and --amount are required");
  }

  const result = await runDacProposalLifecycle({
    args,
    dac,
    params: buildBurnMainTokensReserveProposal(amount),
  });

  process.stdout.write(
    JSON.stringify({
      action: "burn-main-reserve",
      dac,
      amount: amount.toString(),
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function delegateVoteRightsProposal(args: Record<string, string>) {
  const dac = args.dac as Address | undefined;
  const token = args.token as Address | undefined;
  const delegatee = args.delegatee as Address | undefined;
  if (!dac || !token || !delegatee) {
    throw new Error("--dac, --token and --delegatee are required");
  }

  const result = await runDacProposalLifecycle({
    args,
    dac,
    params: buildDelegateVoteRightsProposal(token, delegatee),
  });

  process.stdout.write(
    JSON.stringify({
      action: "delegate-vote-rights-proposal",
      dac,
      token,
      delegatee,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function capitalCallPropose(args: Record<string, string>) {
  const dac = args.dac as Address | undefined;
  const recipient = args.recipient as Address | undefined;
  const treasuryToken = args["treasury-token"] as Address | undefined;
  const tokenAmount = args["token-amount"] ? BigInt(args["token-amount"]) : undefined;
  const cashAmount = args["cash-amount"] ? BigInt(args["cash-amount"]) : undefined;
  if (!dac || !recipient || !treasuryToken || tokenAmount === undefined || cashAmount === undefined) {
    throw new Error("--dac, --recipient, --treasury-token, --token-amount and --cash-amount are required");
  }

  const result = await runDacProposalLifecycle({
    args,
    dac,
    params: buildCapitalCallProposal(recipient, treasuryToken, tokenAmount, cashAmount),
  });

  const nonce = result.proposalId;
  process.stdout.write(
    JSON.stringify({
      action: "capital-call-propose",
      dac,
      recipient,
      treasuryToken,
      tokenAmount: tokenAmount.toString(),
      cashAmount: cashAmount.toString(),
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
      suggestedFulfillCall: nonce !== undefined ? {
        treasuryToken,
        nonce: nonce.toString(),
        tokenRecipient: recipient,
        tokenAmount: tokenAmount.toString(),
        cashAmount: cashAmount.toString(),
      } : undefined,
    }) + "\n",
  );
}

async function capitalCallFulfill(args: Record<string, string>) {
  const {account, core} = await makeCoreFromArgs(args);
  const dac = args.dac as Address | undefined;
  const treasuryToken = args["treasury-token"] as Address | undefined;
  const recipient = args.recipient as Address | undefined;
  const tokenAmount = args["token-amount"] ? BigInt(args["token-amount"]) : undefined;
  const cashAmount = args["cash-amount"] ? BigInt(args["cash-amount"]) : undefined;
  const nonce = args.nonce ? BigInt(args.nonce) : undefined;

  if (!dac || !treasuryToken || !recipient || tokenAmount === undefined || cashAmount === undefined || nonce === undefined) {
    throw new Error("--dac, --treasury-token, --recipient, --token-amount, --cash-amount and --nonce are required");
  }

  const autoApprove = toBoolArg(args["auto-approve"], true);
  let approveTx: Hex | undefined;

  if (cashAmount > 0n && autoApprove) {
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

  process.stdout.write(
    JSON.stringify({
      action: "capital-call-fulfill",
      fulfiller: account.address,
      dac,
      approveTx,
      fulfillTx,
      call: {
        treasuryToken,
        nonce: nonce.toString(),
        tokenRecipient: recipient,
        tokenAmount: tokenAmount.toString(),
        cashAmount: cashAmount.toString(),
      },
    }) + "\n",
  );
}

async function recoverTreasury(args: Record<string, string>) {
  const {account, core} = await makeCoreFromArgs(args);
  const dac = args.dac as Address | undefined;
  const token = args.token as Address | undefined;
  if (!dac || !token) {
    throw new Error("--dac and --token are required");
  }

  const txHash = await core.recoverTreasury({dacCell: dac, token});
  process.stdout.write(
    JSON.stringify({
      action: "recover-treasury",
      caller: account.address,
      dac,
      token,
      txHash,
    }) + "\n",
  );
}

async function depositTreasury(args: Record<string, string>) {
  const {account, core} = await makeCoreFromArgs(args);
  const dac = args.dac as Address | undefined;
  const token = args.token as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!dac || !token || amount === undefined) {
    throw new Error("--dac, --token and --amount are required");
  }

  const autoApprove = toBoolArg(args["auto-approve"], true);
  let approveTx: Hex | undefined;
  if (autoApprove && amount > 0n) {
    const allowance = await core.getErc20Allowance({token, owner: account.address, spender: dac});
    if (allowance < amount) {
      approveTx = await core.approveErc20({token, spender: dac, amount});
    }
  }

  const txHash = await core.depositTreasury({dacCell: dac, token, amount});
  process.stdout.write(
    JSON.stringify({
      action: "deposit-treasury",
      caller: account.address,
      dac,
      token,
      amount: amount.toString(),
      approveTx,
      txHash,
      note: "DACCell.depositTreasury is restricted to registered deal callers in current contracts; EOAs may revert with NotAuthorized.",
    }) + "\n",
  );
}

function bytes32Uint(value: bigint): Hex {
  return numberToHex(value, {size: 32});
}

async function createTreasuryDeal(args: Record<string, string>) {
  const {account, core, protocol, rpcUrl} = await makeCoreFromArgs(args);
  const dac = args.dac as Address | undefined;
  const fundingToken = args["funding-token"] as Address | undefined;
  const fundingAmount = args["funding-amount"] ? BigInt(args["funding-amount"]) : undefined;
  if (!dac || !fundingToken || fundingAmount === undefined) {
    throw new Error("--dac, --funding-token and --funding-amount are required");
  }

  const dealManager = await core.getDealManager(dac);
  const nowSec = (await core.publicClient.getBlock()).timestamp;
  const approveDeadline = args["approve-deadline"] ? BigInt(args["approve-deadline"]) : nowSec + 7n * 24n * 60n * 60n;
  const dealDeadline = args["deal-deadline"] ? BigInt(args["deal-deadline"]) : nowSec + 30n * 24n * 60n * 60n;
  const rewardsLimit = args["rewards-limit"] ? BigInt(args["rewards-limit"]) : 500_000_000n;
  const expectedReturn = args["expected-return"] ? BigInt(args["expected-return"]) : fundingAmount;
  const evaluatorDeadline = args["evaluator-deadline"] ? BigInt(args["evaluator-deadline"]) : nowSec + 24n * 60n * 60n;

  const evaluatorConfig = coreModule.buildMilestoneEvaluatorConfig({
    rewardShare: 1_000_000_000_000_000_000n,
    milestones: [
      {
        milestoneType: 0,
        token: fundingToken,
        oracle: "0x0000000000000000000000000000000000000000",
        valuationMode: 0,
        fundingToken: "0x0000000000000000000000000000000000000000",
        expectedReturn,
        timestamp: evaluatorDeadline,
        rewardPercentage: 1_000_000_000_000_000_000n,
        rewardCurve: [1_000_000_000_000_000_000n],
        penaltyCurve: [1_000_000_000_000_000_000n],
        minPercentGrace: 0n,
        extension: 0n,
      },
    ],
  });

  const dealParams = {
    dealKind: CORE_DEAL_KIND.PERMIT2_TREASURY,
    name: args.name ?? "SDK Treasury Deal",
    description: args.description ?? "SDK-generated treasury deal",
    linkHash: args["link-hash"] ?? "sdk://treasury-deal",
    moduleFactory: protocol.coreModuleFactory as Address,
    governanceFactory: protocol.coreDealGovernanceFactory as Address,
    dealTarget: "0x0000000000000000000000000000000000000000" as Address,
    proposer: account.address,
    vetoEnabled: toBoolArg(args["veto-enabled"], false),
    fundingToken,
    fundingAmount,
    rewardsLimit,
    approveDeadline,
    dealDeadline,
    dealConfig: encodeAbiParameters([{name: "value", type: "string"}], [args["deal-config-label"] ?? "sdk treasury config"]),
    evaluatorSelector: CORE_EVALUATOR_KIND.MILESTONES_EVALUATOR,
    evaluatorConfig,
  };

  const created = await core.createDealProposalDetailed({dealManager, params: dealParams});

  process.stdout.write(
    JSON.stringify({
      action: "create-treasury-deal",
      dac,
      proposer: account.address,
      dealManager,
      txHash: created.txHash,
      dealId: created.dealId?.toString(),
      dacProposalId: created.proposalId?.toString(),
      dealCell: created.dealCell,
      dealAddress: created.dealAddress,
      note: "Use existing DAC proposal commands to vote/execute approval, then stake agents before approval execution.",
      rpcUrl,
    }) + "\n",
  );
}

async function dacProposalVoteExecute(args: Record<string, string>) {
  const {core, rpcUrl} = await makeCoreFromArgs(args);
  const dac = args.dac as Address | undefined;
  const proposalId = args["proposal-id"] ? BigInt(args["proposal-id"]) : undefined;
  if (!dac || proposalId === undefined) {
    throw new Error("--dac and --proposal-id are required");
  }
  const support = toBoolArg(args.support, true);
  const proposalAddress = await core.getDacProposalVotingAddress({dacCell: dac, proposalId});

  await advanceTime(rpcUrl, Number(args["pre-vote-advance-seconds"] ?? "1"));
  const voteTx = await core.voteProposal({proposalAddress, support});

  let status = await core.checkProposalOutcome({proposalAddress});
  if (!status.resolved) {
    if (!args["advance-seconds"]) {
      throw new Error("Proposal not resolved yet. Provide --advance-seconds if you intentionally want to wait.");
    }
    const advanceSeconds = Number(args["advance-seconds"]);
    await advanceTime(rpcUrl, advanceSeconds);
    status = await core.checkProposalOutcome({proposalAddress});
  }
  if (!status.resolved || !status.outcome) {
    throw new Error("Proposal was not passed.");
  }

  const executeTx = await core.executeDacProposal({dacCell: dac, proposalId});
  process.stdout.write(
    JSON.stringify({
      action: "dac-proposal-vote-execute",
      dac,
      proposalId: proposalId.toString(),
      proposalAddress,
      voteTx,
      executeTx,
    }) + "\n",
  );
}

async function stakeAgentToDeal(args: Record<string, string>) {
  const {account, core} = await makeCoreFromArgs(args);
  const dac = args.dac as Address | undefined;
  const dealCell = args["deal-cell"] as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!dac || !dealCell || amount === undefined) {
    throw new Error("--dac, --deal-cell and --amount are required");
  }

  const agentToken = await core.getAgentToken(dac);
  const txHash = await core.stakeAgentToDeal({agentToken, dealCell, amount});
  const stakeToken = await core.getStakeToken({dealCell});

  process.stdout.write(
    JSON.stringify({
      action: "stake-agent-to-deal",
      staker: account.address,
      dac,
      dealCell,
      agentToken,
      stakeToken,
      amount: amount.toString(),
      txHash,
      note: "Call delegate-stake to activate StakedAgent voting power for this staker.",
    }) + "\n",
  );
}

async function delegateStake(args: Record<string, string>) {
  const {account, core} = await makeCoreFromArgs(args);
  const dealCell = args["deal-cell"] as Address | undefined;
  if (!dealCell) {
    throw new Error("--deal-cell is required");
  }
  const delegatee = (args.delegatee as Address | undefined) ?? account.address;
  const stakeToken = await core.getStakeToken({dealCell});
  const txHash = await core.delegateVotes({token: stakeToken, delegatee});
  const votes = await core.getVotes({token: stakeToken, account: delegatee});

  process.stdout.write(
    JSON.stringify({
      action: "delegate-stake",
      dealCell,
      stakeToken,
      delegatee,
      txHash,
      votes: votes.toString(),
    }) + "\n",
  );
}

async function requestTranche(args: Record<string, string>) {
  const {core, rpcUrl} = await makeCoreFromArgs(args);
  const deal = args.deal as Address | undefined;
  const token = args.token as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!deal || !token || amount === undefined) {
    throw new Error("--deal, --token and --amount are required");
  }

  const params: ProposalParams = {
    typ: DEAL_PROPOSAL_TYPE.REQUEST_TRANCHE,
    target: token,
    i: bytes32Uint(amount),
    data: "0x",
  };

  const created = await core.createDealManagementProposal({dealAddress: deal, params});
  const proposalId = created.proposalId;
  const proposalAddress = created.proposalAddress
    ?? (proposalId !== undefined ? await core.getDealProposalVotingAddress({dealAddress: deal, proposalId}) : undefined);

  if (!proposalAddress || proposalId === undefined) {
    throw new Error("Failed to resolve deal proposal from create tx");
  }

  await advanceTime(rpcUrl, Number(args["pre-vote-advance-seconds"] ?? "1"));
  await core.voteProposal({proposalAddress, support: true});

  let status = await core.checkProposalOutcome({proposalAddress});
  if (!status.resolved) {
    const advanceSeconds = args["advance-seconds"] ? Number(args["advance-seconds"]) : 24 * 60 * 60;
    await advanceTime(rpcUrl, advanceSeconds);
    status = await core.checkProposalOutcome({proposalAddress});
  }
  if (!status.outcome) {
    throw new Error("Deal proposal resolved as failed.");
  }

  const executed = await core.executeDealProposalDetailed({dealAddress: deal, proposalId});

  process.stdout.write(
    JSON.stringify({
      action: "request-tranche",
      deal,
      token,
      amount: amount.toString(),
      proposalTx: created.txHash,
      proposalId: proposalId.toString(),
      proposalAddress,
      executeTx: executed.txHash,
      trancheId: executed.trancheId?.toString(),
      dacProposalId: executed.dacProposalId?.toString(),
      note: "Use approve-tranche with emitted dacProposalId.",
    }) + "\n",
  );
}

async function approveTranche(args: Record<string, string>) {
  const {core, rpcUrl} = await makeCoreFromArgs(args);
  const dac = args.dac as Address | undefined;
  const proposalId = args["proposal-id"] ? BigInt(args["proposal-id"]) : undefined;
  if (!dac || proposalId === undefined) {
    throw new Error("--dac and --proposal-id are required");
  }
  const support = toBoolArg(args.support, true);
  const proposalAddress = await core.getDacProposalVotingAddress({dacCell: dac, proposalId});

  await advanceTime(rpcUrl, Number(args["pre-vote-advance-seconds"] ?? "1"));
  const voteTx = await core.voteProposal({proposalAddress, support});

  let status = await core.checkProposalOutcome({proposalAddress});
  if (!status.resolved) {
    if (!args["advance-seconds"]) {
      throw new Error("Proposal not resolved yet. Provide --advance-seconds if you intentionally want to wait.");
    }
    await advanceTime(rpcUrl, Number(args["advance-seconds"]));
    status = await core.checkProposalOutcome({proposalAddress});
  }

  if (!status.resolved || !status.outcome) {
    throw new Error("Tranche approval proposal was not passed.");
  }

  const executeTx = await core.executeDacProposal({dacCell: dac, proposalId});
  process.stdout.write(
    JSON.stringify({
      action: "approve-tranche",
      dac,
      proposalId: proposalId.toString(),
      proposalAddress,
      voteTx,
      executeTx,
    }) + "\n",
  );
}

async function treasuryDirectSpend(args: Record<string, string>) {
  const deal = args.deal as Address | undefined;
  const token = args.token as Address | undefined;
  const destination = args.destination as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!deal || !token || !destination || amount === undefined) {
    throw new Error("--deal, --token, --destination and --amount are required");
  }

  const result = await runDealProposalLifecycle({
    args,
    deal,
    params: buildTreasuryDirectSpendProposal(token, destination, amount),
  });

  process.stdout.write(
    JSON.stringify({
      action: "treasury-direct-spend",
      deal,
      token,
      destination,
      amount: amount.toString(),
      stakeToken: result.stakeToken,
      delegateTx: result.delegateTx,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function treasuryPermit2Spend(args: Record<string, string>) {
  const deal = args.deal as Address | undefined;
  const token = args.token as Address | undefined;
  const spender = args.spender as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  const expiration = args.expiration ? BigInt(args.expiration) : undefined;
  if (!deal || !token || !spender || amount === undefined || expiration === undefined) {
    throw new Error("--deal, --token, --spender, --amount and --expiration are required");
  }

  const result = await runDealProposalLifecycle({
    args,
    deal,
    params: buildTreasuryPermit2SpendProposal(token, spender, amount, expiration),
  });

  process.stdout.write(
    JSON.stringify({
      action: "treasury-permit2-spend",
      deal,
      token,
      spender,
      amount: amount.toString(),
      expiration: expiration.toString(),
      stakeToken: result.stakeToken,
      delegateTx: result.delegateTx,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function treasuryReturnCapital(args: Record<string, string>) {
  const deal = args.deal as Address | undefined;
  const token = args.token as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!deal || !token || amount === undefined) {
    throw new Error("--deal, --token and --amount are required");
  }

  const result = await runDealProposalLifecycle({
    args,
    deal,
    params: buildTreasuryReturnCapitalProposal(token, amount),
  });

  process.stdout.write(
    JSON.stringify({
      action: "treasury-return-capital",
      deal,
      token,
      amount: amount.toString(),
      stakeToken: result.stakeToken,
      delegateTx: result.delegateTx,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function treasuryApproveAgentSpend(args: Record<string, string>) {
  const deal = args.deal as Address | undefined;
  const token = args.token as Address | undefined;
  const agent = args.agent as Address | undefined;
  const destination = args.destination as Address | undefined;
  const totalAmount = args["total-amount"] ? BigInt(args["total-amount"]) : undefined;
  const singleTxAmount = args["single-tx-amount"] ? BigInt(args["single-tx-amount"]) : undefined;
  const clockLimit = args["clock-limit"] ? BigInt(args["clock-limit"]) : undefined;
  const duration = args.duration ? BigInt(args.duration) : undefined;
  if (!deal || !token || !agent || !destination || totalAmount === undefined || singleTxAmount === undefined || clockLimit === undefined || duration === undefined) {
    throw new Error("--deal, --token, --agent, --destination, --total-amount, --single-tx-amount, --clock-limit and --duration are required");
  }

  const allowance: coreModule.TreasurySpendAllowance = {
    totalAmount,
    singleTxAmount,
    clockLimit,
    duration,
  };

  const result = await runDealProposalLifecycle({
    args,
    deal,
    params: buildTreasuryApproveAgentSpendProposal(token, agent, destination, allowance),
  });

  process.stdout.write(
    JSON.stringify({
      action: "treasury-approve-agent-spend",
      deal,
      token,
      agent,
      destination,
      allowance: {
        totalAmount: allowance.totalAmount.toString(),
        singleTxAmount: allowance.singleTxAmount.toString(),
        clockLimit: allowance.clockLimit.toString(),
        duration: allowance.duration.toString(),
      },
      stakeToken: result.stakeToken,
      delegateTx: result.delegateTx,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function treasuryAssignClaimer(args: Record<string, string>) {
  const deal = args.deal as Address | undefined;
  const agent = args.agent as Address | undefined;
  const token = args.token as Address | undefined;
  const counterparty = args.counterparty as Address | undefined;
  const amount = args.amount ? BigInt(args.amount) : undefined;
  if (!deal || !agent || !token || !counterparty || amount === undefined) {
    throw new Error("--deal, --agent, --token, --counterparty and --amount are required");
  }

  const result = await runDealProposalLifecycle({
    args,
    deal,
    params: buildTreasuryAssignClaimerProposal(agent, token, counterparty, amount),
  });

  process.stdout.write(
    JSON.stringify({
      action: "treasury-assign-claimer",
      deal,
      agent,
      token,
      counterparty,
      amount: amount.toString(),
      stakeToken: result.stakeToken,
      delegateTx: result.delegateTx,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function treasuryRevokeAgent(args: Record<string, string>) {
  const deal = args.deal as Address | undefined;
  const token = args.token as Address | undefined;
  const agent = args.agent as Address | undefined;
  const counterparty = args.counterparty as Address | undefined;
  if (!deal || !token || !agent || !counterparty) {
    throw new Error("--deal, --token, --agent and --counterparty are required");
  }

  const result = await runDealProposalLifecycle({
    args,
    deal,
    params: buildTreasuryRevokeAgentProposal(token, agent, counterparty),
  });

  process.stdout.write(
    JSON.stringify({
      action: "treasury-revoke-agent",
      deal,
      token,
      agent,
      counterparty,
      stakeToken: result.stakeToken,
      delegateTx: result.delegateTx,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function treasuryDelegateVoteRights(args: Record<string, string>) {
  const deal = args.deal as Address | undefined;
  const token = args.token as Address | undefined;
  const delegatee = args.delegatee as Address | undefined;
  if (!deal || !token || !delegatee) {
    throw new Error("--deal, --token and --delegatee are required");
  }

  const result = await runDealProposalLifecycle({
    args,
    deal,
    params: buildTreasuryDelegateVoteRightsProposal(token, delegatee),
  });

  process.stdout.write(
    JSON.stringify({
      action: "treasury-delegate-vote-rights",
      deal,
      token,
      delegatee,
      stakeToken: result.stakeToken,
      delegateTx: result.delegateTx,
      proposalTx: result.proposalTx,
      proposalId: result.proposalId?.toString(),
      proposalAddress: result.proposalAddress,
      executeTx: result.executeTx,
    }) + "\n",
  );
}

async function main() {
  const [, , command, ...rawArgs] = process.argv;
  const args = parseArgs(rawArgs);

  if (!command || command === "-h" || command === "--help" || command === "help") {
    usage();
    return;
  }

  if (command === "create-dacs") {
    await createDacs(args);
    return;
  }
  if (command === "delegate-main") {
    await delegateMain(args);
    return;
  }
  if (command === "mint-agent-tokens") {
    await mintAgentTokens(args);
    return;
  }
  if (command === "revoke-agent-tokens") {
    await revokeAgentTokens(args);
    return;
  }
  if (command === "mint-main-reserve") {
    await mintMainReserve(args);
    return;
  }
  if (command === "burn-main-reserve") {
    await burnMainReserve(args);
    return;
  }
  if (command === "delegate-vote-rights-proposal") {
    await delegateVoteRightsProposal(args);
    return;
  }
  if (command === "capital-call-propose") {
    await capitalCallPropose(args);
    return;
  }
  if (command === "capital-call-fulfill") {
    await capitalCallFulfill(args);
    return;
  }
  if (command === "recover-treasury") {
    await recoverTreasury(args);
    return;
  }
  if (command === "deposit-treasury") {
    await depositTreasury(args);
    return;
  }
  if (command === "create-treasury-deal") {
    await createTreasuryDeal(args);
    return;
  }
  if (command === "dac-proposal-vote-execute") {
    await dacProposalVoteExecute(args);
    return;
  }
  if (command === "stake-agent-to-deal") {
    await stakeAgentToDeal(args);
    return;
  }
  if (command === "delegate-stake") {
    await delegateStake(args);
    return;
  }
  if (command === "request-tranche") {
    await requestTranche(args);
    return;
  }
  if (command === "approve-tranche") {
    await approveTranche(args);
    return;
  }
  if (command === "treasury-direct-spend") {
    await treasuryDirectSpend(args);
    return;
  }
  if (command === "treasury-permit2-spend") {
    await treasuryPermit2Spend(args);
    return;
  }
  if (command === "treasury-return-capital") {
    await treasuryReturnCapital(args);
    return;
  }
  if (command === "treasury-approve-agent-spend") {
    await treasuryApproveAgentSpend(args);
    return;
  }
  if (command === "treasury-assign-claimer") {
    await treasuryAssignClaimer(args);
    return;
  }
  if (command === "treasury-revoke-agent") {
    await treasuryRevokeAgent(args);
    return;
  }
  if (command === "treasury-delegate-vote-rights") {
    await treasuryDelegateVoteRights(args);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((err: unknown) => {
  const message = formatViemError(err);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
