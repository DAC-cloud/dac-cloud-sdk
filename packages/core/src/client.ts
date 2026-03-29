import {
  createPublicClient,
  createWalletClient,
  decodeEventLog,
  encodeAbiParameters,
  http,
  type Address,
  type Chain,
  type Hex,
  type PrivateKeyAccount,
  type PublicClient,
  type WalletClient,
} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import type {ProtocolManifest} from "@dac-cloud/manifests";
import {
  agentTokenAbi,
  assetControllerAbi,
  dacFactoryAbi,
  dacCellAbi,
  dealAbi,
  dealCellAbi,
  dealManagerAbi,
  erc20Abi,
  erc20VotesAbi,
  governanceSchemaAbi,
  votingProposalAbi,
} from "./abi";
import type {
  CapitalCall,
  DACConfig,
  DacAddresses,
  DacCapabilities,
  DealCreationConfig,
  DealParams,
  ExistingTokenDacConfig,
  GovernanceStrategyConfig,
  ProposalParams,
  VotingConfig,
} from "./types";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

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

export interface DeployExistingTokenDacResult {
  txHash: Hex;
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
  publicClient: PublicClient;
  walletClient?: WalletClient;
  protocol: ProtocolManifest;
  deployDac(args: {config: DACConfig; salt: Hex; deferBirthRole?: Address}): Promise<DeployDacResult>;
  deployExistingTokenDac(args: {config: ExistingTokenDacConfig; salt: Hex}): Promise<DeployExistingTokenDacResult>;
  getDealManager(dacCell: Address): Promise<Address>;
  getMainToken(dacCell: Address): Promise<Address>;
  getAgentToken(dacCell: Address): Promise<Address>;
  getModuleRegistry(dacCell: Address): Promise<Address>;
  getAssetController(dacCell: Address): Promise<Address>;
  getGovernanceSchema(dacCell: Address): Promise<Address>;
  getTreasuryHolder(assetController: Address): Promise<Address>;
  getGovernanceOracle(governanceSchema: Address): Promise<Address>;
  getDealCreationConfig(governanceSchema: Address): Promise<DealCreationConfig>;
  getGovernanceStrategyConfig(governanceSchema: Address): Promise<GovernanceStrategyConfig>;
  getDacCapabilities(assetController: Address): Promise<DacCapabilities>;
  getDacAddresses(dacCell: Address): Promise<DacAddresses>;
  createDealProposal(args: {dealManager: Address; params: DealParams}): Promise<Hex>;
  createDealProposalDetailed(args: {dealManager: Address; params: DealParams}): Promise<{txHash: Hex; dealId?: bigint; proposalId?: bigint; dealCell?: Address; dealAddress?: Address; evaluatorAddress?: Address}>;
  createDacManagementProposal(args: {dacCell: Address; params: ProposalParams}): Promise<{txHash: Hex; proposalId?: bigint; proposalAddress?: Address}>;
  getDacProposalVotingAddress(args: {dacCell: Address; proposalId: bigint}): Promise<Address>;
  getDacVotingConfig(args: {dacCell: Address}): Promise<VotingConfig>;
  voteProposal(args: {proposalAddress: Address; support: boolean}): Promise<Hex>;
  checkProposalOutcome(args: {proposalAddress: Address}): Promise<{resolved: boolean; outcome: boolean}>;
  executeDacProposal(args: {dacCell: Address; proposalId: bigint}): Promise<Hex>;
  stakeAgentToDeal(args: {agentToken: Address; dealCell: Address; amount: bigint}): Promise<Hex>;
  unstakeFromDeal(args: {dealCell: Address}): Promise<Hex>;
  claimMainToken(args: {dealCell: Address; evaluatorId: bigint}): Promise<Hex>;
  getStakeToken(args: {dealCell: Address}): Promise<Address>;
  createDealManagementProposal(args: {dealAddress: Address; params: ProposalParams}): Promise<{txHash: Hex; proposalId?: bigint; proposalAddress?: Address}>;
  getDealProposalVotingAddress(args: {dealAddress: Address; proposalId: bigint}): Promise<Address>;
  executeDealProposal(args: {dealAddress: Address; proposalId: bigint}): Promise<Hex>;
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
  delegateVotes(args: {token: Address; delegatee: Address}): Promise<Hex>;
  getVotes(args: {token: Address; account: Address}): Promise<bigint>;
  getErc20Allowance(args: {token: Address; owner: Address; spender: Address}): Promise<bigint>;
}

export function accountFromPrivateKey(privateKey: Hex): PrivateKeyAccount {
  return privateKeyToAccount(privateKey);
}

function encodeExistingTokenConfig(config: ExistingTokenDacConfig): Hex {
  return encodeAbiParameters(
    [{
      name: "config",
      type: "tuple",
      components: [
        {name: "symbol", type: "string"},
        {name: "name", type: "string"},
        {name: "description", type: "string"},
        {name: "underlyingToken", type: "address"},
        {name: "treasurySeedAmount", type: "uint256"},
        {name: "oracleAdmin", type: "address"},
        {name: "initialOraclePublisher", type: "address"},
        {name: "dividendsEnabled", type: "bool"},
        {
          name: "governanceStrategy",
          type: "tuple",
          components: [
            {name: "quorumPercent", type: "uint256"},
            {name: "highQuorumPercent", type: "uint256"},
            {name: "blockingPercent", type: "uint256"},
            {name: "duration", type: "uint256"},
            {name: "qualification", type: "uint256"},
            {name: "executionValidityDuration", type: "uint256"},
            {name: "oraclePublishDeadline", type: "uint256"},
            {name: "fallbackWarmupDuration", type: "uint256"},
            {name: "fallbackDuration", type: "uint256"},
          ],
        },
      ],
    }],
    [config],
  );
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
        args: [config, salt, deferBirthRole ?? ZERO_ADDRESS],
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

    async deployExistingTokenDac({config, salt}) {
      if (!walletClient || !walletClient.account) {
        throw new Error("Wallet client with account is required for deployExistingTokenDac");
      }

      const txHash = await walletClient.writeContract({
        address: options.protocol.dacFactory,
        abi: dacFactoryAbi,
        functionName: "deployExistingTokenDAC",
        args: [encodeExistingTokenConfig(config), salt],
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

    async getModuleRegistry(dacCell) {
      return publicClient.readContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "getModuleRegistry",
      });
    },

    async getAssetController(dacCell) {
      return publicClient.readContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "getAssetController",
      });
    },

    async getGovernanceSchema(dacCell) {
      return publicClient.readContract({
        address: dacCell,
        abi: dacCellAbi,
        functionName: "getGovernanceSchema",
      });
    },

    async getTreasuryHolder(assetController) {
      return publicClient.readContract({
        address: assetController,
        abi: assetControllerAbi,
        functionName: "treasuryHolder",
      });
    },

    async getGovernanceOracle(governanceSchema) {
      return publicClient.readContract({
        address: governanceSchema,
        abi: governanceSchemaAbi,
        functionName: "getGovernanceOracle",
      });
    },

    async getDealCreationConfig(governanceSchema) {
      const config = await publicClient.readContract({
        address: governanceSchema,
        abi: governanceSchemaAbi,
        functionName: "getDealCreationConfig",
      });

      return {
        minAgentBalance: config.minAgentBalance,
        minInitialAgentStake: config.minInitialAgentStake,
      };
    },

    async getGovernanceStrategyConfig(governanceSchema) {
      const config = await publicClient.readContract({
        address: governanceSchema,
        abi: governanceSchemaAbi,
        functionName: "getStrategyConfig",
      });

      return {
        quorumPercent: config.quorumPercent,
        highQuorumPercent: config.highQuorumPercent,
        blockingPercent: config.blockingPercent,
        duration: config.duration,
        qualification: config.qualification,
        executionValidityDuration: config.executionValidityDuration,
        oraclePublishDeadline: config.oraclePublishDeadline,
        fallbackWarmupDuration: config.fallbackWarmupDuration,
        fallbackDuration: config.fallbackDuration,
      };
    },

    async getDacCapabilities(assetController) {
      const [supportsMint, supportsBurn, supportsCapitalCall, supportsWrap, supportsUnwrap, supportsReserveBackedClaims] = await Promise.all([
        publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "supportsCapability", args: [0]}),
        publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "supportsCapability", args: [1]}),
        publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "supportsCapability", args: [2]}),
        publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "supportsCapability", args: [3]}),
        publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "supportsCapability", args: [4]}),
        publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "supportsCapability", args: [5]}),
      ]);

      return {
        supportsMint,
        supportsBurn,
        supportsCapitalCall,
        supportsWrap,
        supportsUnwrap,
        supportsReserveBackedClaims,
      };
    },

    async getDacAddresses(dacCell) {
      const [mainToken, agentToken, dealManager, moduleRegistry, assetController, governanceSchema] = await Promise.all([
        publicClient.readContract({address: dacCell, abi: dacCellAbi, functionName: "getMainToken"}),
        publicClient.readContract({address: dacCell, abi: dacCellAbi, functionName: "getAgentToken"}),
        publicClient.readContract({address: dacCell, abi: dacCellAbi, functionName: "getDealManager"}),
        publicClient.readContract({address: dacCell, abi: dacCellAbi, functionName: "getModuleRegistry"}),
        publicClient.readContract({address: dacCell, abi: dacCellAbi, functionName: "getAssetController"}),
        publicClient.readContract({address: dacCell, abi: dacCellAbi, functionName: "getGovernanceSchema"}),
      ]);

      const [treasuryHolder, governanceOracle, capabilities] = await Promise.all([
        publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "treasuryHolder"}),
        publicClient.readContract({address: governanceSchema, abi: governanceSchemaAbi, functionName: "getGovernanceOracle"}),
        Promise.all([
          publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "supportsCapability", args: [3]}),
          publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "supportsCapability", args: [4]}),
          publicClient.readContract({address: assetController, abi: assetControllerAbi, functionName: "supportsCapability", args: [5]}),
        ]),
      ]);

      return {
        dac: dacCell,
        mainToken,
        agentToken,
        dealManager,
        moduleRegistry,
        assetController,
        governanceSchema,
        treasuryHolder,
        governanceOracle: governanceOracle === ZERO_ADDRESS ? undefined : governanceOracle,
        mode: capabilities.some(Boolean) ? "EXISTING_TOKEN" : "NATIVE",
      };
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
        executionValidityDuration: config.executionValidityDuration,
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
