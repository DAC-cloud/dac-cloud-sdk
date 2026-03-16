import {createPublicClient, createWalletClient, decodeEventLog, http, type Address, type Chain, type Hex, type PrivateKeyAccount, type PublicClient, type WalletClient} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import type {ProtocolManifest} from "@dac-cloud/manifests";
import {agentTokenAbi, dacFactoryAbi, dacCellAbi, dealAbi, dealCellAbi, dealManagerAbi, erc20Abi, erc20VotesAbi, votingProposalAbi} from "./abi";
import type {CapitalCall, DACConfig, DealParams, ProposalParams, VotingConfig} from "./types";

export interface DacCoreOptions {
  chain: Chain;
  rpcUrl: string;
  protocol: ProtocolManifest;
  account?: PrivateKeyAccount;
}

export interface DeployDacResult {
  txHash: Hex;
  dac?: Address;
  mainToken?: Address;
  agentToken?: Address;
}

export interface DacCoreClient {
  publicClient: PublicClient;
  walletClient?: WalletClient;
  protocol: ProtocolManifest;
  deployDac(args: {config: DACConfig; salt: Hex; deferBirthRole?: Address}): Promise<DeployDacResult>;
  getDealManager(dacCell: Address): Promise<Address>;
  getMainToken(dacCell: Address): Promise<Address>;
  getAgentToken(dacCell: Address): Promise<Address>;
  createDealProposal(args: {dealManager: Address; params: DealParams}): Promise<Hex>;
  createDealProposalDetailed(args: {dealManager: Address; params: DealParams}): Promise<{txHash: Hex; dealId?: bigint; proposalId?: bigint; dealCell?: Address; dealAddress?: Address; evaluatorAddress?: Address}>;
  createDacManagementProposal(args: {dacCell: Address; params: ProposalParams}): Promise<{txHash: Hex; proposalId?: bigint; proposalAddress?: Address}>;
  getDacProposalVotingAddress(args: {dacCell: Address; proposalId: bigint}): Promise<Address>;
  getDacVotingConfig(args: {dacCell: Address}): Promise<VotingConfig>;
  voteProposal(args: {proposalAddress: Address; support: boolean}): Promise<Hex>;
  checkProposalOutcome(args: {proposalAddress: Address}): Promise<{resolved: boolean; outcome: boolean}>;
  executeDacProposal(args: {dacCell: Address; proposalId: bigint}): Promise<Hex>;
  stakeAgentToDeal(args: {agentToken: Address; dealCell: Address; amount: bigint}): Promise<Hex>;
  getStakeToken(args: {dealCell: Address}): Promise<Address>;
  createDealManagementProposal(args: {dealAddress: Address; params: ProposalParams}): Promise<{txHash: Hex; proposalId?: bigint; proposalAddress?: Address}>;
  getDealProposalVotingAddress(args: {dealAddress: Address; proposalId: bigint}): Promise<Address>;
  executeDealProposal(args: {dealAddress: Address; proposalId: bigint}): Promise<Hex>;
  executeDealProposalDetailed(args: {dealAddress: Address; proposalId: bigint}): Promise<{txHash: Hex; dacProposalId?: bigint; trancheId?: bigint; childProposalId?: bigint; childVoteProposalId?: bigint}>;
  fulfillCapitalCall(args: {dacCell: Address; call: CapitalCall}): Promise<Hex>;
  depositTreasury(args: {dacCell: Address; token: Address; amount: bigint}): Promise<Hex>;
  recoverTreasury(args: {dacCell: Address; token: Address}): Promise<Hex>;
  approveErc20(args: {token: Address; spender: Address; amount: bigint}): Promise<Hex>;
  delegateVotes(args: {token: Address; delegatee: Address}): Promise<Hex>;
  getVotes(args: {token: Address; account: Address}): Promise<bigint>;
  getErc20Allowance(args: {token: Address; owner: Address; spender: Address}): Promise<bigint>;
}

export function accountFromPrivateKey(privateKey: Hex): PrivateKeyAccount {
  return privateKeyToAccount(privateKey);
}

export function createDacCoreClient(options: DacCoreOptions): DacCoreClient {
  const publicClient = createPublicClient({
    chain: options.chain,
    transport: http(options.rpcUrl),
  });

  const walletClient = options.account
    ? createWalletClient({
        chain: options.chain,
        account: options.account,
        transport: http(options.rpcUrl),
      })
    : undefined;

  return {
    publicClient,
    walletClient,
    protocol: options.protocol,

    async deployDac({config, salt, deferBirthRole}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for deployDac");
      }

      const txHash = await walletClient.writeContract({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployDAC",
        args: [config, salt, deferBirthRole ?? "0x0000000000000000000000000000000000000000"],
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

      return {txHash, dac, mainToken, agentToken};
    },

    async getDealManager(dacCell) {
      return publicClient.readContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "getDealManager",
      });
    },

    async getMainToken(dacCell) {
      return publicClient.readContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "getMainToken",
      });
    },

    async getAgentToken(dacCell) {
      return publicClient.readContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "getAgentToken",
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

    async getDacProposalVotingAddress({dacCell, proposalId}) {
      return publicClient.readContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "getProposalVoting",
        args: [proposalId],
      });
    },

    async getDacVotingConfig({dacCell}) {
      const config = await publicClient.readContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "getVotingConfig",
      });
      return {
        quorumPercent: config.quorumPercent,
        blockingPercent: config.blockingPercent,
        highQuorumPercent: config.highQuorumPercent,
        duration: config.duration,
        qualification: config.qualification,
      };
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

    async checkProposalOutcome({proposalAddress}) {
      const resolved = await publicClient.readContract({
        address: proposalAddress,
        abi: votingProposalAbi,
        functionName: "isResolved",
      });

      let outcome = false;
      if (resolved) {
        outcome = await publicClient.readContract({
          address: proposalAddress,
          abi: votingProposalAbi,
          functionName: "outcome",
        });
      }

      return {resolved, outcome};
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

    async getStakeToken({dealCell}) {
      return publicClient.readContract({
        address: dealCell,
        abi: dealCellAbi,
        functionName: "stakeToken",
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

    async getDealProposalVotingAddress({dealAddress, proposalId}) {
      return publicClient.readContract({
        address: dealAddress,
        abi: dealAbi,
        functionName: "getProposal",
        args: [proposalId],
      });
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

      return walletClient.writeContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "recoverTreasury",
        args: [token],
        account: walletClient.account,
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

    async getVotes({token, account}) {
      return publicClient.readContract({
        address: token,
        abi: erc20VotesAbi,
        functionName: "getVotes",
        args: [account],
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
  };
}
