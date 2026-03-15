import {createPublicClient, createWalletClient, decodeEventLog, http, type Address, type Chain, type Hex, type PrivateKeyAccount, type PublicClient, type WalletClient} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import type {ProtocolManifest} from "@dac-cloud/manifests";
import {dacFactoryAbi, dacCellAbi, dealManagerAbi} from "./abi";
import type {DACConfig, DealParams} from "./types";

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
  };
}
