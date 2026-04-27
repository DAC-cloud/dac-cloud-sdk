import {
  createPublicClient,
  createWalletClient,
  decodeEventLog,
  http,
  type Address,
  type Chain,
  type Hex,
  type PrivateKeyAccount,
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

  return {
    walletClient,
    protocol: options.protocol,

    async deployDac({config, salt, referralUid, deferBirthRole}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for deployDac");
      }

      const resolvedSalt = resolveSalt({salt, referralUid});

      const txHash = await walletClient.writeContract({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployDAC",
        args: [config, resolvedSalt, deferBirthRole ?? ZERO_ADDRESS],
        account: walletClient.account,
      });

      const receipt = await publicClient.waitForTransactionReceipt({hash: txHash});

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
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for deployExistingTokenDac");
      }

      const resolvedSalt = resolveSalt({salt, referralUid});

      const txHash = await walletClient.writeContract({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployExistingTokenDAC",
        args: [encodeExistingTokenConfig(config), resolvedSalt],
        account: walletClient.account,
      });

      const receipt = await publicClient.waitForTransactionReceipt({hash: txHash});

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

      const txHash = await walletClient.writeContract({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployGovernanceOracle",
        args: [admin, initialPublisher],
        account: walletClient.account,
      });

      return {txHash, oracleAddress: oracleAddress as Address | undefined};
    },

    async wrapMainToken({wrappedToken, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for wrapMainToken");
      }

      return walletClient.writeContract({
        address: wrappedToken,
        abi: wrappedMainTokenAbi,
        functionName: "wrap",
        args: [amount],
        account: walletClient.account,
      });
    },

    async wrapMainTokenTo({wrappedToken, recipient, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for wrapMainTokenTo");
      }

      return walletClient.writeContract({
        address: wrappedToken,
        abi: wrappedMainTokenAbi,
        functionName: "wrapTo",
        args: [recipient, amount],
        account: walletClient.account,
      });
    },

    async unwrapMainToken({wrappedToken, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for unwrapMainToken");
      }

      return walletClient.writeContract({
        address: wrappedToken,
        abi: wrappedMainTokenAbi,
        functionName: "unwrap",
        args: [amount],
        account: walletClient.account,
      });
    },

    async unwrapMainTokenTo({wrappedToken, recipient, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for unwrapMainTokenTo");
      }

      return walletClient.writeContract({
        address: wrappedToken,
        abi: wrappedMainTokenAbi,
        functionName: "unwrapTo",
        args: [recipient, amount],
        account: walletClient.account,
      });
    },

    async createDealProposal({dealManager, params}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for createDealProposal");
      }

      return walletClient.writeContract({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "createDealProposal",
        args: [params],
        account: walletClient.account,
      });
    },

    async createDealProposalDetailed({dealManager, params}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for createDealProposalDetailed");
      }

      const txHash = await walletClient.writeContract({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "createDealProposal",
        args: [params],
        account: walletClient.account,
      });

      const receipt = await publicClient.waitForTransactionReceipt({hash: txHash});
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
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for createDacManagementProposal");
      }

      const txHash = await walletClient.writeContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "createManagementProposal",
        args: [params],
        account: walletClient.account,
      });

      const receipt = await publicClient.waitForTransactionReceipt({hash: txHash});
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
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for voteProposal");
      }

      return walletClient.writeContract({
        address: proposalAddress,
        abi: votingProposalAbi,
        functionName: "vote",
        args: [support],
        account: walletClient.account,
      });
    },

    async executeDacProposal({dacCell, proposalId}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for executeDacProposal");
      }

      return walletClient.writeContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "executeDACProposal",
        args: [proposalId],
        account: walletClient.account,
      });
    },

    async setGovernanceOraclePublisher({governanceOracle, publisher, allowed}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for setGovernanceOraclePublisher");
      }

      return walletClient.writeContract({
        address: governanceOracle,
        abi: governanceOracleAbi,
        functionName: "setPublisher",
        args: [publisher, allowed],
        account: walletClient.account,
      });
    },

    async deactivateGovernanceOracle({governanceOracle, dac}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for deactivateGovernanceOracle");
      }

      return walletClient.writeContract({
        address: governanceOracle,
        abi: governanceOracleAbi,
        functionName: "deactivate",
        args: [dac],
        account: walletClient.account,
      });
    },

    async publishGovernanceOracleSnapshot({governanceOracle, dac, proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for publishGovernanceOracleSnapshot");
      }

      return walletClient.writeContract({
        address: governanceOracle,
        abi: governanceOracleAbi,
        functionName: "publishSnapshot",
        args: [dac, proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower],
        account: walletClient.account,
      });
    },

    async activateHybridPrimaryVoting(proposalAddress) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for activateHybridPrimaryVoting");
      }

      return walletClient.writeContract({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "activatePrimaryVoting",
        account: walletClient.account,
      });
    },

    async beginHybridFallbackWarmup(proposalAddress) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for beginHybridFallbackWarmup");
      }

      return walletClient.writeContract({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "beginFallbackWarmup",
        account: walletClient.account,
      });
    },

    async triggerHybridEmergencyFallback(proposalAddress) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for triggerHybridEmergencyFallback");
      }

      return walletClient.writeContract({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "triggerEmergencyFallback",
        account: walletClient.account,
      });
    },

    async activateHybridFallbackVoting(proposalAddress) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for activateHybridFallbackVoting");
      }

      return walletClient.writeContract({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "activateFallbackVoting",
        account: walletClient.account,
      });
    },

    async voteMerkle({proposalAddress, support, index, amount, proof}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for voteMerkle");
      }

      return walletClient.writeContract({
        address: proposalAddress,
        abi: hybridDacManagementProposalAbi,
        functionName: "voteMerkle",
        args: [support, index, amount, proof],
        account: walletClient.account,
      });
    },

    async inviteAgentToDeal({dealCell, invitee, grantInviteRight}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for inviteAgentToDeal");
      }

      return walletClient.writeContract({
        address: dealCell,
        abi: dealCellAbi,
        functionName: "invite",
        args: [invitee, grantInviteRight],
        account: walletClient.account,
      });
    },

    async stakeAgentToDeal({agentToken, dealCell, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for stakeAgentToDeal");
      }

      return walletClient.writeContract({
        address: agentToken,
        abi: agentTokenAbi,
        functionName: "stakeToDeal",
        args: [dealCell, amount],
        account: walletClient.account,
      });
    },

    async unstakeFromDeal({dealCell}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for unstakeFromDeal");
      }

      return walletClient.writeContract({
        address: dealCell,
        abi: dealCellAbi,
        functionName: "unstake",
        account: walletClient.account,
      });
    },

    async claimMainToken({dealCell, evaluatorId}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for claimMainToken");
      }

      return walletClient.writeContract({
        address: dealCell,
        abi: dealCellAbi,
        functionName: "claimMainToken",
        args: [evaluatorId],
        account: walletClient.account,
      });
    },

    async createDealManagementProposal({dealAddress, params}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for createDealManagementProposal");
      }

      const txHash = await walletClient.writeContract({
        address: dealAddress,
        abi: dealAbi,
        functionName: "createStakedAgentProposal",
        args: [params],
        account: walletClient.account,
      });

      const receipt = await publicClient.waitForTransactionReceipt({hash: txHash});
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
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for executeDealProposal");
      }

      return walletClient.writeContract({
        address: dealAddress,
        abi: dealAbi,
        functionName: "executeStakedAgentProposal",
        args: [proposalId],
        account: walletClient.account,
      });
    },

    async executeDealProposalDetailed({dealAddress, proposalId}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for executeDealProposalDetailed");
      }

      const txHash = await walletClient.writeContract({
        address: dealAddress,
        abi: dealAbi,
        functionName: "executeStakedAgentProposal",
        args: [proposalId],
        account: walletClient.account,
      });

      const receipt = await publicClient.waitForTransactionReceipt({hash: txHash});
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
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for claimDealRewardPool");
      }

      return walletClient.writeContract({
        address: dealAddress,
        abi: dealAbi,
        functionName: "claimDealRewardPool",
        args: [evaluatorId],
        account: walletClient.account,
      });
    },

    async setRootCapitalCallID({dealAddress, capitalCallId}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for setRootCapitalCallID");
      }

      return walletClient.writeContract({
        address: dealAddress,
        abi: dealAbi,
        functionName: "setRootCapitalCallID",
        args: [capitalCallId],
        account: walletClient.account,
      });
    },

    async recoverProfits({dealAddress, token}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for recoverProfits");
      }

      return walletClient.writeContract({
        address: dealAddress,
        abi: dealAbi,
        functionName: "recoverProfits",
        args: [token],
        account: walletClient.account,
      });
    },

    async executeAgentSpend({treasuryAddress, token, destination, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for executeAgentSpend");
      }

      return walletClient.writeContract({
        address: treasuryAddress,
        abi: permit2TreasuryAbi,
        functionName: "executeAgentSpend",
        args: [token, destination, amount],
        account: walletClient.account,
      });
    },

    async executeReceivePermit2({treasuryAddress, token, source, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for executeReceivePermit2");
      }

      return walletClient.writeContract({
        address: treasuryAddress,
        abi: permit2TreasuryAbi,
        functionName: "executeReceivePermit2",
        args: [token, source, amount],
        account: walletClient.account,
      });
    },

    async evaluateDeal({dealManager, dealId, evaluatorId}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for evaluateDeal");
      }

      return walletClient.writeContract({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "evaluateDeal",
        args: [dealId, evaluatorId],
        account: walletClient.account,
      });
    },

    async forceReturnCapital({dealManager, dealId}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for forceReturnCapital");
      }

      return walletClient.writeContract({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "forceReturnCapital",
        args: [dealId],
        account: walletClient.account,
      });
    },

    async sendDacLegalWrapperMessage({dacCell, kind, message}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for sendDacLegalWrapperMessage");
      }

      return walletClient.writeContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "logLegalWrapperMessage",
        args: [kind, message],
        account: walletClient.account,
      });
    },

    async sendDealLegalWrapperMessage({dealManager, dealId, kind, message}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for sendDealLegalWrapperMessage");
      }

      return walletClient.writeContract({
        address: dealManager,
        abi: dealManagerAbi,
        functionName: "legalWrapperMessage",
        args: [dealId, kind, message],
        account: walletClient.account,
      });
    },

    async claimDividend({dacCell, proposalId, index, receiver, amount, proof}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for claimDividend");
      }

      return walletClient.writeContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "claimDividend",
        args: [proposalId, index, receiver, amount, proof],
        account: walletClient.account,
      });
    },

    async fulfillCapitalCall({dacCell, call}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for fulfillCapitalCall");
      }

      return walletClient.writeContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "fulfillCapitalCall",
        args: [call],
        account: walletClient.account,
      });
    },

    async depositTreasury({dacCell, token, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for depositTreasury");
      }

      return walletClient.writeContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "depositTreasury",
        args: [token, amount],
        account: walletClient.account,
      });
    },

    async recoverTreasury({dacCell, token}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for recoverTreasury");
      }

      // recoverTreasury involves a deep call chain through proxies: transfer → onMainMove
      // → recordDeposit → syncTreasury → getVotingConfig (governance schema proxy).
      // Viem's auto gas estimate can be tight when called right after a state-changing
      // transfer (storage slot warm/cold transitions affect estimation accuracy).
      // We add a 50% buffer to the estimate to prevent out-of-gas reverts.
      const gasEstimate = await publicClient.estimateContractGas({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "recoverTreasury",
        args: [token],
        account: walletClient.account,
      });

      return walletClient.writeContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "recoverTreasury",
        args: [token],
        account: walletClient.account,
        gas: gasEstimate + (gasEstimate / 2n),
      });
    },

    async approveErc20({token, spender, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for approveErc20");
      }

      return walletClient.writeContract({
        address: token,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
        account: walletClient.account,
      });
    },

    async transferErc20({token, to, amount}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for transferErc20");
      }

      return walletClient.writeContract({
        address: token,
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, amount],
        account: walletClient.account,
      });
    },

    async delegateVotes({token, delegatee}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for delegateVotes");
      }

      return walletClient.writeContract({
        address: token,
        abi: erc20VotesAbi,
        functionName: "delegate",
        args: [delegatee],
        account: walletClient.account,
      });
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
