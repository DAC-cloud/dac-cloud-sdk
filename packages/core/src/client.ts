import {
  createPublicClient,
  createWalletClient,
  decodeEventLog,
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
  agentTokenAbi,
  dacFactoryAbi,
  dacCellAbi,
  dealAbi,
  dealCellAbi,
  dealManagerAbi,
  erc20Abi,
  erc20VotesAbi,
  governanceOracleAbi,
  hybridDacManagementProposalAbi,
  permit2TreasuryAbi,
  votingProposalAbi,
  wrappedMainTokenAbi,
} from "./abi";
import {encodeExistingTokenConfig} from "./encoding";
import {resolveSalt} from "./salt";
import type {
  CapitalCall,
  DACConfig,
  DealParams,
  ExistingTokenDacConfig,
  ProposalParams,
} from "./types";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export interface DacCoreOptions {
  chain: Chain;
  rpcUrl: string;
  protocol: ProtocolManifest;
  account?: PrivateKeyAccount;
  /** Extra fetch options passed to viem's http transport (e.g. auth headers). */
  fetchOptions?: {headers?: Record<string, string>};
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
  executeDealProposalDetailed(args: {dealAddress: Address; proposalId: bigint}): Promise<{txHash: Hex; dacProposalId?: bigint; trancheId?: bigint; childProposalId?: bigint; childVoteProposalId?: bigint}>;
  evaluateDeal(args: {dealManager: Address; dealId: bigint; evaluatorId: bigint}): Promise<Hex>;
  forceReturnCapital(args: {dealManager: Address; dealId: bigint}): Promise<Hex>;
  sendDacLegalWrapperMessage(args: {dacCell: Address; kind: Hex; message: Hex}): Promise<Hex>;
  sendDealLegalWrapperMessage(args: {dealManager: Address; dealId: bigint; kind: Hex; message: Hex}): Promise<Hex>;
  claimDividend(args: {dacCell: Address; proposalId: bigint; index: bigint; receiver: Address; amount: bigint; proof: Hex[]}): Promise<Hex>;
  fulfillCapitalCall(args: {dacCell: Address; call: CapitalCall}): Promise<Hex>;
  depositTreasury(args: {dacCell: Address; token: Address; amount: bigint}): Promise<Hex>;
  recoverTreasury(args: {dacCell: Address; token: Address}): Promise<Hex>;
  approveErc20(args: {token: Address; spender: Address; amount: bigint}): Promise<Hex>;
  transferErc20(args: {token: Address; to: Address; amount: bigint}): Promise<Hex>;
  delegateVotes(args: {token: Address; delegatee: Address}): Promise<Hex>;
  getErc20Allowance(args: {token: Address; owner: Address; spender: Address}): Promise<bigint>;
  getErc20Balance(args: {token: Address; holder: Address}): Promise<bigint>;
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
  //      50% buffer over the estimate to make these paths robust.
  async function submitWrite<TAbi extends Abi, TFunctionName extends ContractFunctionName<TAbi, "nonpayable" | "payable">>(
    params: {
      address: Address;
      abi: TAbi;
      functionName: TFunctionName;
      args?: readonly unknown[];
    },
  ): Promise<TransactionReceipt> {
    if (!walletClient || !walletClient.account) {
      throw new Error("Wallet client with account is required");
    }
    const account = walletClient.account;

    const gasEstimate = await publicClient.estimateContractGas({
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args ?? [],
      account,
    } as Parameters<typeof publicClient.estimateContractGas>[0]);

    const txHash = await walletClient.writeContract({
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args ?? [],
      account,
      gas: gasEstimate + (gasEstimate / 2n),
    } as Parameters<typeof walletClient.writeContract>[0]);

    const receipt = await publicClient.waitForTransactionReceipt({hash: txHash});
    if (receipt.status !== "success") {
      throw new Error(
        `Transaction reverted on-chain (tx=${txHash}, to=${params.address}, fn=${String(params.functionName)})`,
      );
    }
    return receipt;
  }

  return {
    walletClient,
    protocol: options.protocol,

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

      const {result: oracleAddress} = await publicClient.simulateContract({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployGovernanceOracle",
        args: [admin, initialPublisher],
        account: walletClient.account,
      });

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
      const receipt = await submitWrite({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "createDealProposal",
        args: [params],
      });
      return receipt.transactionHash;
    },

    async createDealProposalDetailed({dealManager, params}) {
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

      return {txHash, dacProposalId, trancheId, childProposalId, childVoteProposalId};
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
  };
}
