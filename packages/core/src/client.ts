import {
  createPublicClient,
  createWalletClient,
  decodeAbiParameters,
  decodeEventLog,
  encodeFunctionData,
  http,
  type Abi,
  type Address,
  type Chain,
  type ContractFunctionName,
  type Hex,
  type PrivateKeyAccount,
  type TransactionReceipt,
  type WalletClient,
} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import type {ProtocolManifest} from "@dac-cloud/manifests";
import {
  agentDealAbi,
  agentTokenAbi,
  dacFactoryAbi,
  dacCellAbi,
  dealAbi,
  dealCellAbi,
  dealManagerAbi,
  erc20Abi,
  erc20VotesAbi,
  erc6551AccountAbi,
  erc6551RegistryAbi,
  governanceOracleAbi,
  hybridDacManagementProposalAbi,
  moduleFactoryAbi,
  permit2TreasuryAbi,
  votingProposalAbi,
  wrappedMainTokenAbi,
} from "./abi";
import {decodeDealParams, encodeExistingTokenConfig} from "./encoding";
import {
  ERC6551_REGISTRY_ADDRESS,
  ERC6551_VALID_SIGNER_MAGIC,
  ERC6551_ZERO_SALT,
  encodeErc6551Execute,
  type Erc6551AccountInfo,
  type TxExecutor,
} from "./erc6551";
import {resolveSalt} from "./salt";
import type {
  CapitalCall,
  DACConfig,
  DealParams,
  ExistingTokenDacConfig,
  ProposalParams,
  VotingConfig,
} from "./types";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export interface DacCoreOptions {
  chain: Chain;
  rpcUrl: string;
  protocol: ProtocolManifest;
  account?: PrivateKeyAccount;
  /** Extra fetch options passed to viem's http transport (e.g. auth headers). */
  fetchOptions?: {headers?: Record<string, string>};
  /**
   * How writes are sent. Default: the account signs and sends directly. With an
   * ERC-6551 executor every write becomes `account.execute(to, 0, data, CALL)`,
   * signed by the NFT owner (`account`), so the token-bound account is the
   * protocol-level actor (staker, voter, proposer, token holder).
   */
  executor?: TxExecutor;
}

export interface DeployDacResult {
  txHash: Hex;
  salt: Hex;
  dac?: Address;
  mainToken?: Address;
  agentToken?: Address;
}

export interface DeployExistingTokenDacResult {
  txHash: Hex;
  salt: Hex;
  dac?: Address;
  mainToken?: Address;
  wrappedMainToken?: Address;
  underlyingToken?: Address;
  agentToken?: Address;
  governanceOracle?: Address;
  assetController?: Address;
  treasurySeedAmount?: bigint;
}

export interface DacCoreClient {
  walletClient?: WalletClient;
  protocol: ProtocolManifest;
  /** The address the protocol sees as msg.sender: the ERC-6551 account when one is configured, else the signer. */
  actor?: Address;
  executor: TxExecutor;
  deployDac(args: {config: DACConfig; salt?: Hex; referralUid?: string; deferBirthRole?: Address}): Promise<DeployDacResult>;
  deployExistingTokenDac(args: {config: ExistingTokenDacConfig; salt?: Hex; referralUid?: string}): Promise<DeployExistingTokenDacResult>;
  deployGovernanceOracle(args: {admin: Address; initialPublisher: Address}): Promise<{txHash: Hex; oracleAddress?: Address}>;
  wrapMainToken(args: {wrappedToken: Address; amount: bigint}): Promise<Hex>;
  wrapMainTokenTo(args: {wrappedToken: Address; recipient: Address; amount: bigint}): Promise<Hex>;
  unwrapMainToken(args: {wrappedToken: Address; amount: bigint}): Promise<Hex>;
  unwrapMainTokenTo(args: {wrappedToken: Address; recipient: Address; amount: bigint}): Promise<Hex>;
  createDealProposal(args: {dealManager: Address; params: DealParams}): Promise<Hex>;
  createDealProposalDetailed(args: {dealManager: Address; params: DealParams}): Promise<{txHash: Hex; dealId?: bigint; proposalId?: bigint; dealCell?: Address; dealAddress?: Address; evaluatorAddress?: Address}>;
  createDacManagementProposal(args: {dacCell: Address; params: ProposalParams}): Promise<{txHash: Hex; proposalId?: bigint; proposalAddress?: Address}>;
  voteProposal(args: {proposalAddress: Address; support: boolean}): Promise<Hex>;
  executeDacProposal(args: {dacCell: Address; proposalId: bigint}): Promise<Hex>;
  setGovernanceOraclePublisher(args: {governanceOracle: Address; publisher: Address; allowed: boolean}): Promise<Hex>;
  deactivateGovernanceOracle(args: {governanceOracle: Address; dac: Address}): Promise<Hex>;
  publishGovernanceOracleSnapshot(args: {governanceOracle: Address; dac: Address; proposalId: bigint; snapshotBlock: bigint; merkleRoot: Hex; totalUnderlyingVotingPower: bigint}): Promise<Hex>;
  activateHybridPrimaryVoting(proposalAddress: Address): Promise<Hex>;
  beginHybridFallbackWarmup(proposalAddress: Address): Promise<Hex>;
  triggerHybridEmergencyFallback(proposalAddress: Address): Promise<Hex>;
  activateHybridFallbackVoting(proposalAddress: Address): Promise<Hex>;
  voteMerkle(args: {proposalAddress: Address; support: boolean; index: bigint; amount: bigint; proof: Hex[]}): Promise<Hex>;
  inviteAgentToDeal(args: {dealCell: Address; invitee: Address; grantInviteRight: boolean}): Promise<Hex>;
  stakeAgentToDeal(args: {agentToken: Address; dealCell: Address; amount: bigint}): Promise<Hex>;
  unstakeFromDeal(args: {dealCell: Address}): Promise<Hex>;
  claimMainToken(args: {dealCell: Address; evaluatorId: bigint}): Promise<Hex>;
  createDealManagementProposal(args: {dealAddress: Address; params: ProposalParams}): Promise<{txHash: Hex; proposalId?: bigint; proposalAddress?: Address}>;
  executeDealProposal(args: {dealAddress: Address; proposalId: bigint}): Promise<Hex>;
  claimDealRewardPool(args: {dealAddress: Address; evaluatorId: bigint}): Promise<Hex>;
  setRootCapitalCallID(args: {dealAddress: Address; capitalCallId: bigint}): Promise<Hex>;
  recoverProfits(args: {dealAddress: Address; token: Address}): Promise<Hex>;
  executeAgentSpend(args: {treasuryAddress: Address; token: Address; destination: Address; amount: bigint}): Promise<Hex>;
  executeReceivePermit2(args: {treasuryAddress: Address; token: Address; source: Address; amount: bigint}): Promise<Hex>;
  executeDealProposalDetailed(args: {dealAddress: Address; proposalId: bigint}): Promise<{txHash: Hex; dacProposalId?: bigint; trancheId?: bigint; childProposalId?: bigint; childVoteProposalId?: bigint; hostDealCell?: Address; hostDealId?: bigint; hostProposalId?: bigint}>;
  evaluateDeal(args: {dealManager: Address; dealId: bigint; evaluatorId: bigint}): Promise<Hex>;
  forceReturnCapital(args: {dealManager: Address; dealId: bigint}): Promise<Hex>;
  sendDacLegalWrapperMessage(args: {dacCell: Address; kind: Hex; message: Hex}): Promise<Hex>;
  sendDealLegalWrapperMessage(args: {dealManager: Address; dealId: bigint; kind: Hex; message: Hex}): Promise<Hex>;
  claimDividend(args: {dacCell: Address; proposalId: bigint; index: bigint; receiver: Address; amount: bigint; proof: Hex[]}): Promise<Hex>;
  fulfillCapitalCall(args: {dacCell: Address; call: CapitalCall}): Promise<Hex>;
  depositTreasury(args: {dacCell: Address; token: Address; amount: bigint}): Promise<Hex>;
  recoverTreasury(args: {dacCell: Address; token: Address}): Promise<Hex>;
  /** Permissionless: credits tokens sitting on the DACCell to its treasury. */
  recoverErc20(args: {dacCell: Address; token: Address}): Promise<Hex>;
  approveErc20(args: {token: Address; spender: Address; amount: bigint}): Promise<Hex>;
  transferErc20(args: {token: Address; to: Address; amount: bigint}): Promise<Hex>;
  delegateVotes(args: {token: Address; delegatee: Address}): Promise<Hex>;
  getErc20Allowance(args: {token: Address; owner: Address; spender: Address}): Promise<bigint>;
  getErc20Balance(args: {token: Address; holder: Address}): Promise<bigint>;
  /** Timestamp of the latest block: the clock on-chain deadline checks run against. */
  getChainTime(): Promise<bigint>;
  /** `CoreModuleFactory.dealGovernanceFactory()`; undefined when the module does not expose it. */
  getDealGovernanceFactory(args: {moduleFactory: Address}): Promise<Address | undefined>;
  /** `IModuleFactory.dealAcceptsGovernanceFactory`; undefined when the module predates the check. */
  dealAcceptsGovernanceFactory(args: {moduleFactory: Address; dealKind: Hex; governanceFactory: Address}): Promise<boolean | undefined>;
  /** Module-registered controlled addresses of a deal against the kernel cap. */
  getControlledAddressBudget(args: {dealManager: Address; dealCell: Address}): Promise<{used: bigint; max: bigint; remaining: bigint}>;
  /** Full `DealParams` the deal was created with, decoded from `DealManager.state(dealCell).initParams`. */
  getDealInitParams(args: {dealManager: Address; dealCell: Address}): Promise<DealParams>;
  getDealVotingConfig(args: {dealAddress: Address}): Promise<VotingConfig>;
  getAgentDealHost(args: {dealAddress: Address}): Promise<{hostDac: Address; hostAgentToken: Address; hostMainToken: Address}>;
  /**
   * Simulated `isResolved()` then `outcome()`. `outcome` is undefined while unresolved:
   * hybrid proposals revert `NotResolved` before a voting phase is active.
   */
  getProposalResolution(args: {proposalAddress: Address}): Promise<{resolved: boolean; outcome?: boolean}>;
  /** Registry-derived address of the account for an NFT (same math as `createAccount`). */
  computeErc6551Account(args: {implementation: Address; salt?: Hex; chainId?: bigint; tokenContract: Address; tokenId: bigint; registry?: Address}): Promise<Address>;
  /** On-chain facts about a token-bound account; `deployed: false` when there is no code yet. */
  getErc6551AccountInfo(args: {account: Address}): Promise<Erc6551AccountInfo>;
  /** Whether `signer` may act for the account (`isValidSigner` magic). */
  isErc6551ValidSigner(args: {account: Address; signer: Address}): Promise<boolean>;
  /** Permissionless `registry.createAccount`, sent by the signer directly (never through an executor). */
  createErc6551Account(args: {implementation: Address; salt?: Hex; chainId?: bigint; tokenContract: Address; tokenId: bigint; registry?: Address}): Promise<{txHash: Hex; account: Address}>;
}

export function accountFromPrivateKey(privateKey: Hex): PrivateKeyAccount {
  return privateKeyToAccount(privateKey);
}

export function createDacCoreClient(options: DacCoreOptions): DacCoreClient {
  const transport = http(options.rpcUrl, options.fetchOptions ? {fetchOptions: options.fetchOptions} : undefined);

  const publicClient = createPublicClient({
    chain: options.chain,
    transport,
  });

  const walletClient = options.account
    ? createWalletClient({
        chain: options.chain,
        account: options.account,
        transport,
      })
    : undefined;

  // Submit a contract write, wait for the receipt, and throw on revert.
  //
  // Why this helper exists:
  //   1. Silent reverts — `walletClient.writeContract` returns a tx hash even
  //      when the on-chain execution reverts. Without waiting for the receipt
  //      and checking `status`, callers cannot distinguish a successful tx
  //      from a reverted one. We've seen this mask claim failures in QA where
  //      the tx hash looked successful but the position never updated.
  //   2. Gas estimation under-prediction — viem's default `estimateGas` can
  //      under-estimate paths that touch ERC20Votes checkpoints (e.g. minting
  //      MainToken to an agent who has delegated to another holder writes
  //      checkpoints on the delegate). Combined with the EVM's 63/64-rule
  //      attrition through nested calls (DealCell → lib delegatecall →
  //      DealManager → MainToken.mint), the inner mint can starve. We add a
  //      50% buffer over the estimate, with a 200k floor — small calls like
  //      ERC20Votes.delegate() were observed OOG'ing on Base Sepolia with a
  //      ~22k estimate × 1.5 = ~33k limit, because the hook callback chain
  //      needed more than the 63/64 attrition left it.
  //   3. ERC-6551 — with an executor configured the call is re-targeted to
  //      `account.execute(to, 0, data, CALL)`; the inner events still carry
  //      their emitting contract's address, so receipt decoding is unchanged.
  const executor: TxExecutor = options.executor ?? {kind: "eoa"};

  async function submitWrite<TAbi extends Abi, TFunctionName extends ContractFunctionName<TAbi, "nonpayable" | "payable">>(
    params: {
      address: Address;
      abi: TAbi;
      functionName: TFunctionName;
      args?: readonly unknown[];
    },
    opts: {direct?: boolean} = {},
  ): Promise<TransactionReceipt> {
    if (!walletClient || !walletClient.account) {
      throw new Error("Wallet client with account is required");
    }
    const account = walletClient.account;

    const target = executor.kind === "erc6551" && !opts.direct
      ? {
          address: executor.account,
          abi: erc6551AccountAbi,
          functionName: "execute" as const,
          args: [
            params.address,
            0n,
            encodeFunctionData({abi: params.abi, functionName: params.functionName, args: params.args ?? []} as never),
            0,
          ] as const,
        }
      : {address: params.address, abi: params.abi, functionName: params.functionName, args: params.args ?? []};

    const gasEstimate = await publicClient.estimateContractGas({
      ...target,
      account,
    } as Parameters<typeof publicClient.estimateContractGas>[0]);

    const buffered = gasEstimate + (gasEstimate / 2n);
    const floor = 200_000n;
    const gas = buffered > floor ? buffered : floor;

    const txHash = await walletClient.writeContract({
      ...target,
      account,
      gas,
    } as Parameters<typeof walletClient.writeContract>[0]);

    const receipt = await publicClient.waitForTransactionReceipt({hash: txHash});
    if (receipt.status !== "success") {
      throw new Error(
        `Transaction reverted on-chain (tx=${txHash}, to=${params.address}, fn=${String(params.functionName)})`,
      );
    }
    return receipt;
  }

  // Same routing as submitWrite, for simulated calls whose return value matters.
  async function simulateWriteResult<TAbi extends Abi, TFunctionName extends ContractFunctionName<TAbi, "nonpayable" | "payable">>(
    params: {address: Address; abi: TAbi; functionName: TFunctionName; args?: readonly unknown[]},
    resultTypes: readonly {type: string}[],
  ): Promise<readonly unknown[]> {
    if (!walletClient || !walletClient.account) {
      throw new Error("Wallet client with account is required");
    }
    if (executor.kind === "erc6551") {
      const {result} = await publicClient.simulateContract({
        address: executor.account,
        abi: erc6551AccountAbi,
        functionName: "execute",
        args: [params.address, 0n, encodeFunctionData({abi: params.abi, functionName: params.functionName, args: params.args ?? []} as never), 0],
        account: walletClient.account,
      });
      return decodeAbiParameters(resultTypes as never, result);
    }
    const {result} = await publicClient.simulateContract({
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args ?? [],
      account: walletClient.account,
    } as Parameters<typeof publicClient.simulateContract>[0]);
    return [result];
  }

  async function readDealAcceptsGovernanceFactory(
    moduleFactory: Address,
    dealKind: Hex,
    governanceFactory: Address,
  ): Promise<boolean | undefined> {
    try {
      return await publicClient.readContract({
        address: moduleFactory,
        abi: moduleFactoryAbi,
        functionName: "dealAcceptsGovernanceFactory",
        args: [dealKind, governanceFactory],
      });
    } catch {
      // Module deployed before the allow-list existed (or a non-module address):
      // let the kernel decide.
      return undefined;
    }
  }

  // The kernel reverts GovernanceFactoryNotAccepted for a factory the deal's
  // module does not vouch for; fail before spending gas, with the fix spelled out.
  async function assertGovernanceFactoryAccepted(params: DealParams): Promise<void> {
    const accepted = await readDealAcceptsGovernanceFactory(params.moduleFactory, params.dealKind, params.governanceFactory);
    if (accepted === false) {
      throw new Error(
        `GovernanceFactoryNotAccepted: module ${params.moduleFactory} does not accept governanceFactory `
        + `${params.governanceFactory} for deal kind ${params.dealKind}. `
        + `Core deals only accept CoreModuleFactory.dealGovernanceFactory().`,
      );
    }
  }

  return {
    walletClient,
    protocol: options.protocol,
    actor: executor.kind === "erc6551" ? executor.account : options.account?.address,
    executor,

    async deployDac({config, salt, referralUid, deferBirthRole}) {
      const resolvedSalt = resolveSalt({salt, referralUid});

      const receipt = await submitWrite({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployDAC",
        args: [config, resolvedSalt, deferBirthRole ?? ZERO_ADDRESS],
      });
      const txHash = receipt.transactionHash;

      let dac: Address | undefined;
      let mainToken: Address | undefined;
      let agentToken: Address | undefined;

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: dacFactoryAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "DACDeployed") {
            dac = decoded.args.dac;
            mainToken = decoded.args.mainToken;
            agentToken = decoded.args.agentToken;
            break;
          }
        } catch {
          continue;
        }
      }

      return {txHash, salt: resolvedSalt, dac, mainToken, agentToken};
    },

    async deployExistingTokenDac({config, salt, referralUid}) {
      const resolvedSalt = resolveSalt({salt, referralUid});

      const receipt = await submitWrite({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployExistingTokenDAC",
        args: [encodeExistingTokenConfig(config), resolvedSalt],
      });
      const txHash = receipt.transactionHash;

      let dac: Address | undefined;
      let mainToken: Address | undefined;
      let wrappedMainToken: Address | undefined;
      let underlyingToken: Address | undefined;
      let agentToken: Address | undefined;
      let governanceOracle: Address | undefined;
      let assetController: Address | undefined;
      let treasurySeedAmount: bigint | undefined;

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: dacFactoryAbi,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "DACDeployed") {
            dac = decoded.args.dac;
            mainToken = decoded.args.mainToken;
            wrappedMainToken = decoded.args.mainToken;
            agentToken = decoded.args.agentToken;
          }

          if (decoded.eventName === "ExistingTokenDACDeployed") {
            dac = decoded.args.dac;
            mainToken = decoded.args.wrappedToken;
            wrappedMainToken = decoded.args.wrappedToken;
            underlyingToken = decoded.args.underlyingToken;
            governanceOracle = decoded.args.governanceOracle;
            agentToken = decoded.args.agentToken;
            assetController = decoded.args.assetController;
            treasurySeedAmount = decoded.args.treasurySeedAmount;
          }
        } catch {
          continue;
        }
      }

      return {
        txHash,
        salt: resolvedSalt,
        dac,
        mainToken,
        wrappedMainToken,
        underlyingToken,
        agentToken,
        governanceOracle,
        assetController,
        treasurySeedAmount,
      };
    },

    async deployGovernanceOracle({admin, initialPublisher}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for deployGovernanceOracle");
      }

      const [oracleAddress] = await simulateWriteResult({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployGovernanceOracle",
        args: [admin, initialPublisher],
      }, [{type: "address"}]);

      const receipt = await submitWrite({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployGovernanceOracle",
        args: [admin, initialPublisher],
      });

      return {txHash: receipt.transactionHash, oracleAddress: oracleAddress as Address | undefined};
    },

    async wrapMainToken({wrappedToken, amount}) {
      const receipt = await submitWrite({
        address: wrappedToken,
        abi: wrappedMainTokenAbi,
        functionName: "wrap",
        args: [amount],
      });
      return receipt.transactionHash;
    },

    async wrapMainTokenTo({wrappedToken, recipient, amount}) {
      const receipt = await submitWrite({
        address: wrappedToken,
        abi: wrappedMainTokenAbi,
        functionName: "wrapTo",
        args: [recipient, amount],
      });
      return receipt.transactionHash;
    },

    async unwrapMainToken({wrappedToken, amount}) {
      const receipt = await submitWrite({
        address: wrappedToken,
        abi: wrappedMainTokenAbi,
        functionName: "unwrap",
        args: [amount],
      });
      return receipt.transactionHash;
    },

    async unwrapMainTokenTo({wrappedToken, recipient, amount}) {
      const receipt = await submitWrite({
        address: wrappedToken,
        abi: wrappedMainTokenAbi,
        functionName: "unwrapTo",
        args: [recipient, amount],
      });
      return receipt.transactionHash;
    },

    async createDealProposal({dealManager, params}) {
      await assertGovernanceFactoryAccepted(params);
      const receipt = await submitWrite({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "createDealProposal",
        args: [params],
      });
      return receipt.transactionHash;
    },

    async createDealProposalDetailed({dealManager, params}) {
      await assertGovernanceFactoryAccepted(params);
      const receipt = await submitWrite({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "createDealProposal",
        args: [params],
      });
      const txHash = receipt.transactionHash;
      let dealId: bigint | undefined;
      let proposalId: bigint | undefined;
      let dealCell: Address | undefined;
      let dealAddress: Address | undefined;

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: dealManagerAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "DealCreated") {
            dealId = decoded.args.id;
            proposalId = decoded.args.proposalId;
            dealCell = decoded.args.cell;
            dealAddress = decoded.args.deal;
            break;
          }
        } catch {
          continue;
        }
      }

      return {txHash, dealId, proposalId, dealCell, dealAddress};
    },

    async createDacManagementProposal({dacCell, params}) {
      const receipt = await submitWrite({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "createManagementProposal",
        args: [params],
      });
      const txHash = receipt.transactionHash;
      let proposalId: bigint | undefined;
      let proposalAddress: Address | undefined;

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: dacCellAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "DACProposalCreated") {
            proposalId = decoded.args.id;
            proposalAddress = decoded.args.prop;
            break;
          }
        } catch {
          continue;
        }
      }

      return {txHash, proposalId, proposalAddress};
    },

    async voteProposal({proposalAddress, support}) {
      const receipt = await submitWrite({
        address: proposalAddress,
        abi: votingProposalAbi,
        functionName: "vote",
        args: [support],
      });
      return receipt.transactionHash;
    },

    async executeDacProposal({dacCell, proposalId}) {
      const receipt = await submitWrite({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "executeDACProposal",
        args: [proposalId],
      });
      return receipt.transactionHash;
    },

    async setGovernanceOraclePublisher({governanceOracle, publisher, allowed}) {
      const receipt = await submitWrite({
        address: governanceOracle,
        abi: governanceOracleAbi,
        functionName: "setPublisher",
        args: [publisher, allowed],
      });
      return receipt.transactionHash;
    },

    async deactivateGovernanceOracle({governanceOracle, dac}) {
      const receipt = await submitWrite({
        address: governanceOracle,
        abi: governanceOracleAbi,
        functionName: "deactivate",
        args: [dac],
      });
      return receipt.transactionHash;
    },

    async publishGovernanceOracleSnapshot({governanceOracle, dac, proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower}) {
      const receipt = await submitWrite({
        address: governanceOracle,
        abi: governanceOracleAbi,
        functionName: "publishSnapshot",
        args: [dac, proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower],
      });
      return receipt.transactionHash;
    },

    async activateHybridPrimaryVoting(proposalAddress) {
      const receipt = await submitWrite({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "activatePrimaryVoting",
      });
      return receipt.transactionHash;
    },

    async beginHybridFallbackWarmup(proposalAddress) {
      const receipt = await submitWrite({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "beginFallbackWarmup",
      });
      return receipt.transactionHash;
    },

    async triggerHybridEmergencyFallback(proposalAddress) {
      const receipt = await submitWrite({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "triggerEmergencyFallback",
      });
      return receipt.transactionHash;
    },

    async activateHybridFallbackVoting(proposalAddress) {
      const receipt = await submitWrite({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "activateFallbackVoting",
      });
      return receipt.transactionHash;
    },

    async voteMerkle({proposalAddress, support, index, amount, proof}) {
      const receipt = await submitWrite({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "voteMerkle",
        args: [support, index, amount, proof],
      });
      return receipt.transactionHash;
    },

    async inviteAgentToDeal({dealCell, invitee, grantInviteRight}) {
      const receipt = await submitWrite({
        address: dealCell,
        abi: dealCellAbi,
        functionName: "invite",
        args: [invitee, grantInviteRight],
      });
      return receipt.transactionHash;
    },

    async stakeAgentToDeal({agentToken, dealCell, amount}) {
      const receipt = await submitWrite({
        address: agentToken,
        abi: agentTokenAbi,
        functionName: "stakeToDeal",
        args: [dealCell, amount],
      });
      return receipt.transactionHash;
    },

    async unstakeFromDeal({dealCell}) {
      const receipt = await submitWrite({
        address: dealCell,
        abi: dealCellAbi,
        functionName: "unstake",
      });
      return receipt.transactionHash;
    },

    async claimMainToken({dealCell, evaluatorId}) {
      const receipt = await submitWrite({
        address: dealCell,
        abi: dealCellAbi,
        functionName: "claimMainToken",
        args: [evaluatorId],
      });
      return receipt.transactionHash;
    },

    async createDealManagementProposal({dealAddress, params}) {
      const receipt = await submitWrite({
        address: dealAddress,
        abi: dealAbi,
        functionName: "createStakedAgentProposal",
        args: [params],
      });
      const txHash = receipt.transactionHash;
      let proposalId: bigint | undefined;
      let proposalAddress: Address | undefined;

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: dealAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "DealManagementProposalCreated") {
            proposalId = decoded.args.id;
            proposalAddress = decoded.args.prop;
            break;
          }
        } catch {
          continue;
        }
      }

      return {txHash, proposalId, proposalAddress};
    },

    async executeDealProposal({dealAddress, proposalId}) {
      const receipt = await submitWrite({
        address: dealAddress,
        abi: dealAbi,
        functionName: "executeStakedAgentProposal",
        args: [proposalId],
      });
      return receipt.transactionHash;
    },

    async executeDealProposalDetailed({dealAddress, proposalId}) {
      const receipt = await submitWrite({
        address: dealAddress,
        abi: dealAbi,
        functionName: "executeStakedAgentProposal",
        args: [proposalId],
      });
      const txHash = receipt.transactionHash;
      let dacProposalId: bigint | undefined;
      let trancheId: bigint | undefined;
      let childProposalId: bigint | undefined;
      let childVoteProposalId: bigint | undefined;

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: dealManagerAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "TrancheCreated") {
            dacProposalId = decoded.args.proposalId;
            trancheId = decoded.args.trancheId;
            break;
          }
        } catch {
          continue;
        }
      }

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: dealAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "ChildVoteCreated") {
            childProposalId = decoded.args.childProposalId;
            childVoteProposalId = decoded.args.proposalId;
            break;
          }
        } catch {
          continue;
        }
      }

      let hostDealCell: Address | undefined;
      let hostDealId: bigint | undefined;
      let hostProposalId: bigint | undefined;

      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== dealAddress.toLowerCase()) {
          continue;
        }
        try {
          const decoded = decodeEventLog({
            abi: agentDealAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "HostDealCreated") {
            hostDealCell = decoded.args.hostDealCell;
            hostDealId = decoded.args.hostDealId;
            break;
          }
          if (decoded.eventName === "HostProposalCreated") {
            hostDealCell = decoded.args.hostDealCell;
            hostProposalId = decoded.args.hostProposalId;
            break;
          }
        } catch {
          continue;
        }
      }

      return {txHash, dacProposalId, trancheId, childProposalId, childVoteProposalId, hostDealCell, hostDealId, hostProposalId};
    },

    async claimDealRewardPool({dealAddress, evaluatorId}) {
      const receipt = await submitWrite({
        address: dealAddress,
        abi: dealAbi,
        functionName: "claimDealRewardPool",
        args: [evaluatorId],
      });
      return receipt.transactionHash;
    },

    async setRootCapitalCallID({dealAddress, capitalCallId}) {
      const receipt = await submitWrite({
        address: dealAddress,
        abi: dealAbi,
        functionName: "setRootCapitalCallID",
        args: [capitalCallId],
      });
      return receipt.transactionHash;
    },

    async recoverProfits({dealAddress, token}) {
      const receipt = await submitWrite({
        address: dealAddress,
        abi: dealAbi,
        functionName: "recoverProfits",
        args: [token],
      });
      return receipt.transactionHash;
    },

    async executeAgentSpend({treasuryAddress, token, destination, amount}) {
      const receipt = await submitWrite({
        address: treasuryAddress,
        abi: permit2TreasuryAbi,
        functionName: "executeAgentSpend",
        args: [token, destination, amount],
      });
      return receipt.transactionHash;
    },

    async executeReceivePermit2({treasuryAddress, token, source, amount}) {
      const receipt = await submitWrite({
        address: treasuryAddress,
        abi: permit2TreasuryAbi,
        functionName: "executeReceivePermit2",
        args: [token, source, amount],
      });
      return receipt.transactionHash;
    },

    async evaluateDeal({dealManager, dealId, evaluatorId}) {
      const receipt = await submitWrite({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "evaluateDeal",
        args: [dealId, evaluatorId],
      });
      return receipt.transactionHash;
    },

    async forceReturnCapital({dealManager, dealId}) {
      const receipt = await submitWrite({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "forceReturnCapital",
        args: [dealId],
      });
      return receipt.transactionHash;
    },

    async sendDacLegalWrapperMessage({dacCell, kind, message}) {
      const receipt = await submitWrite({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "logLegalWrapperMessage",
        args: [kind, message],
      });
      return receipt.transactionHash;
    },

    async sendDealLegalWrapperMessage({dealManager, dealId, kind, message}) {
      const receipt = await submitWrite({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "legalWrapperMessage",
        args: [dealId, kind, message],
      });
      return receipt.transactionHash;
    },

    async claimDividend({dacCell, proposalId, index, receiver, amount, proof}) {
      const receipt = await submitWrite({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "claimDividend",
        args: [proposalId, index, receiver, amount, proof],
      });
      return receipt.transactionHash;
    },

    async fulfillCapitalCall({dacCell, call}) {
      const receipt = await submitWrite({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "fulfillCapitalCall",
        args: [call],
      });
      return receipt.transactionHash;
    },

    async depositTreasury({dacCell, token, amount}) {
      const receipt = await submitWrite({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "depositTreasury",
        args: [token, amount],
      });
      return receipt.transactionHash;
    },

    async recoverTreasury({dacCell, token}) {
      const receipt = await submitWrite({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "recoverTreasury",
        args: [token],
      });
      return receipt.transactionHash;
    },

    async recoverErc20({dacCell, token}) {
      const receipt = await submitWrite({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "recoverERC20",
        args: [token],
      });
      return receipt.transactionHash;
    },

    async approveErc20({token, spender, amount}) {
      const receipt = await submitWrite({
        address: token,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
      });
      return receipt.transactionHash;
    },

    async transferErc20({token, to, amount}) {
      const receipt = await submitWrite({
        address: token,
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, amount],
      });
      return receipt.transactionHash;
    },

    async delegateVotes({token, delegatee}) {
      const receipt = await submitWrite({
        address: token,
        abi: erc20VotesAbi,
        functionName: "delegate",
        args: [delegatee],
      });
      return receipt.transactionHash;
    },

    async getErc20Allowance({token, owner, spender}) {
      return publicClient.readContract({
        address: token,
        abi: erc20Abi,
        functionName: "allowance",
        args: [owner, spender],
      });
    },

    async getErc20Balance({token, holder}) {
      return publicClient.readContract({
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [holder],
      });
    },

    async getChainTime() {
      const block = await publicClient.getBlock({blockTag: "latest"});
      return block.timestamp;
    },

    async getDealGovernanceFactory({moduleFactory}) {
      try {
        return await publicClient.readContract({
          address: moduleFactory,
          abi: moduleFactoryAbi,
          functionName: "dealGovernanceFactory",
        });
      } catch {
        return undefined;
      }
    },

    async dealAcceptsGovernanceFactory({moduleFactory, dealKind, governanceFactory}) {
      return readDealAcceptsGovernanceFactory(moduleFactory, dealKind, governanceFactory);
    },

    async getControlledAddressBudget({dealManager, dealCell}) {
      const [used, max] = await Promise.all([
        publicClient.readContract({
          address: dealManager,
          abi: dealManagerAbi,
          functionName: "moduleControlledCount",
          args: [dealCell],
        }),
        publicClient.readContract({
          address: dealManager,
          abi: dealManagerAbi,
          functionName: "MAX_MODULE_CONTROLLED_ADDRESSES",
        }),
      ]);
      return {used, max, remaining: max > used ? max - used : 0n};
    },

    async getDealInitParams({dealManager, dealCell}) {
      const state = await publicClient.readContract({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "state",
        args: [dealCell],
      });
      if (state.id === 0n) {
        throw new Error(`Deal cell ${dealCell} is not registered in deal manager ${dealManager}`);
      }
      return decodeDealParams(state.initParams);
    },

    async getDealVotingConfig({dealAddress}) {
      return publicClient.readContract({
        address: dealAddress,
        abi: dealAbi,
        functionName: "votingConfig",
      });
    },

    async getAgentDealHost({dealAddress}) {
      const [hostDac, hostDNA] = await Promise.all([
        publicClient.readContract({address: dealAddress, abi: agentDealAbi, functionName: "managedEntity"}),
        publicClient.readContract({address: dealAddress, abi: agentDealAbi, functionName: "hostDNA"}),
      ]);
      return {hostDac, hostAgentToken: hostDNA[0], hostMainToken: hostDNA[1]};
    },

    async computeErc6551Account({implementation, salt, chainId, tokenContract, tokenId, registry}) {
      return publicClient.readContract({
        address: registry ?? ERC6551_REGISTRY_ADDRESS,
        abi: erc6551RegistryAbi,
        functionName: "account",
        args: [implementation, salt ?? ERC6551_ZERO_SALT, chainId ?? BigInt(options.chain.id), tokenContract, tokenId],
      });
    },

    async getErc6551AccountInfo({account}) {
      const code = await publicClient.getCode({address: account});
      if (!code || code === "0x") {
        return {account, deployed: false};
      }
      const [token, owner, state] = await Promise.all([
        publicClient.readContract({address: account, abi: erc6551AccountAbi, functionName: "token"}),
        publicClient.readContract({address: account, abi: erc6551AccountAbi, functionName: "owner"}),
        publicClient.readContract({address: account, abi: erc6551AccountAbi, functionName: "state"}).catch(() => undefined),
      ]);
      return {
        account,
        deployed: true,
        token: {chainId: token[0], tokenContract: token[1], tokenId: token[2]},
        owner,
        state,
      };
    },

    async isErc6551ValidSigner({account, signer}) {
      try {
        const magic = await publicClient.readContract({
          address: account,
          abi: erc6551AccountAbi,
          functionName: "isValidSigner",
          args: [signer, "0x"],
        });
        return magic.toLowerCase() === ERC6551_VALID_SIGNER_MAGIC;
      } catch {
        return false;
      }
    },

    async createErc6551Account({implementation, salt, chainId, tokenContract, tokenId, registry}) {
      const registryAddress = registry ?? ERC6551_REGISTRY_ADDRESS;
      const args = [implementation, salt ?? ERC6551_ZERO_SALT, chainId ?? BigInt(options.chain.id), tokenContract, tokenId] as const;
      const account = await publicClient.readContract({
        address: registryAddress,
        abi: erc6551RegistryAbi,
        functionName: "account",
        args,
      });
      const receipt = await submitWrite({
        address: registryAddress,
        abi: erc6551RegistryAbi,
        functionName: "createAccount",
        args,
      }, {direct: true});
      return {txHash: receipt.transactionHash, account};
    },

    async getProposalResolution({proposalAddress}) {
      const {result: resolved} = await publicClient.simulateContract({
        address: proposalAddress,
        abi: votingProposalAbi,
        functionName: "isResolved",
      });
      if (!resolved) {
        return {resolved};
      }
      const {result: outcome} = await publicClient.simulateContract({
        address: proposalAddress,
        abi: votingProposalAbi,
        functionName: "outcome",
      });
      return {resolved, outcome};
    },
  };
}
