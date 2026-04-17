import {encodeFunctionData, type Address, type Hex} from "viem";
import type {ProtocolManifest} from "@dac-cloud/manifests";
import {resolveSalt} from "./salt";
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
  votingProposalAbi,
  wrappedMainTokenAbi,
} from "./abi";
import {encodeExistingTokenConfig} from "./encoding";
import type {
  CapitalCall,
  DACConfig,
  DealParams,
  ExistingTokenDacConfig,
  ProposalParams,
  TransactionRequest,
} from "./types";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export interface DacTxBuilderOptions {
  chainId: number;
  fromAddress: Address;
  protocol: ProtocolManifest;
}

export interface DacTransactionBuilder {
  deployDac(args: {config: DACConfig; salt?: Hex; referralUid?: string; deferBirthRole?: Address}): TransactionRequest;
  deployExistingTokenDac(args: {config: ExistingTokenDacConfig; salt?: Hex; referralUid?: string}): TransactionRequest;
  deployGovernanceOracle(args: {admin: Address; initialPublisher: Address}): TransactionRequest;
  wrapMainToken(args: {wrappedToken: Address; amount: bigint}): TransactionRequest;
  wrapMainTokenTo(args: {wrappedToken: Address; recipient: Address; amount: bigint}): TransactionRequest;
  unwrapMainToken(args: {wrappedToken: Address; amount: bigint}): TransactionRequest;
  unwrapMainTokenTo(args: {wrappedToken: Address; recipient: Address; amount: bigint}): TransactionRequest;
  createDealProposal(args: {dealManager: Address; params: DealParams}): TransactionRequest;
  createDacManagementProposal(args: {dacCell: Address; params: ProposalParams}): TransactionRequest;
  voteProposal(args: {proposalAddress: Address; support: boolean}): TransactionRequest;
  executeDacProposal(args: {dacCell: Address; proposalId: bigint}): TransactionRequest;
  setGovernanceOraclePublisher(args: {governanceOracle: Address; publisher: Address; allowed: boolean}): TransactionRequest;
  deactivateGovernanceOracle(governanceOracle: Address): TransactionRequest;
  publishGovernanceOracleSnapshot(args: {governanceOracle: Address; proposalId: bigint; snapshotBlock: bigint; merkleRoot: Hex; totalUnderlyingVotingPower: bigint}): TransactionRequest;
  activateHybridPrimaryVoting(proposalAddress: Address): TransactionRequest;
  beginHybridFallbackWarmup(proposalAddress: Address): TransactionRequest;
  triggerHybridEmergencyFallback(proposalAddress: Address): TransactionRequest;
  activateHybridFallbackVoting(proposalAddress: Address): TransactionRequest;
  voteWrapped(args: {proposalAddress: Address; support: boolean}): TransactionRequest;
  voteMerkle(args: {proposalAddress: Address; support: boolean; index: bigint; amount: bigint; proof: Hex[]}): TransactionRequest;
  inviteAgentToDeal(args: {dealCell: Address; invitee: Address; grantInviteRight: boolean}): TransactionRequest;
  stakeAgentToDeal(args: {agentToken: Address; dealCell: Address; amount: bigint}): TransactionRequest;
  unstakeFromDeal(args: {dealCell: Address}): TransactionRequest;
  claimMainToken(args: {dealCell: Address; evaluatorId: bigint}): TransactionRequest;
  createDealManagementProposal(args: {dealAddress: Address; params: ProposalParams}): TransactionRequest;
  executeDealProposal(args: {dealAddress: Address; proposalId: bigint}): TransactionRequest;
  claimDealRewardPool(args: {dealAddress: Address; evaluatorId: bigint}): TransactionRequest;
  setRootCapitalCallID(args: {dealAddress: Address; capitalCallId: bigint}): TransactionRequest;
  evaluateDeal(args: {dealManager: Address; dealId: bigint; evaluatorId: bigint}): TransactionRequest;
  forceReturnCapital(args: {dealManager: Address; dealId: bigint}): TransactionRequest;
  sendDacLegalWrapperMessage(args: {dacCell: Address; kind: Hex; message: Hex}): TransactionRequest;
  sendDealLegalWrapperMessage(args: {dealManager: Address; dealId: bigint; kind: Hex; message: Hex}): TransactionRequest;
  claimDividend(args: {dacCell: Address; proposalId: bigint; index: bigint; receiver: Address; amount: bigint; proof: Hex[]}): TransactionRequest;
  fulfillCapitalCall(args: {dacCell: Address; call: CapitalCall}): TransactionRequest;
  depositTreasury(args: {dacCell: Address; token: Address; amount: bigint}): TransactionRequest;
  recoverTreasury(args: {dacCell: Address; token: Address}): TransactionRequest;
  approveErc20(args: {token: Address; spender: Address; amount: bigint}): TransactionRequest;
  transferErc20(args: {token: Address; to: Address; amount: bigint}): TransactionRequest;
  delegateVotes(args: {token: Address; delegatee: Address}): TransactionRequest;
}

export function createDacTransactionBuilder(options: DacTxBuilderOptions): DacTransactionBuilder {
  const {chainId, fromAddress, protocol} = options;

  function tx(to: Address, abi: Parameters<typeof encodeFunctionData>[0]["abi"], functionName: string, args?: readonly unknown[]): TransactionRequest {
    return {
      to,
      from: fromAddress,
      data: encodeFunctionData({abi, functionName, args: args as never}),
      value: 0n,
      chainId,
    };
  }

  return {
    deployDac({config, salt, referralUid, deferBirthRole}) {
      const resolvedSalt = resolveSalt({salt, referralUid});
      return tx(protocol.dacFactory, dacFactoryAbi, "deployDAC", [config, resolvedSalt, deferBirthRole ?? ZERO_ADDRESS]);
    },

    deployExistingTokenDac({config, salt, referralUid}) {
      const resolvedSalt = resolveSalt({salt, referralUid});
      return tx(protocol.dacFactory, dacFactoryAbi, "deployExistingTokenDAC", [encodeExistingTokenConfig(config), resolvedSalt]);
    },

    deployGovernanceOracle({admin, initialPublisher}) {
      return tx(protocol.dacFactory, dacFactoryAbi, "deployGovernanceOracle", [admin, initialPublisher]);
    },

    wrapMainToken({wrappedToken, amount}) {
      return tx(wrappedToken, wrappedMainTokenAbi, "wrap", [amount]);
    },

    wrapMainTokenTo({wrappedToken, recipient, amount}) {
      return tx(wrappedToken, wrappedMainTokenAbi, "wrapTo", [recipient, amount]);
    },

    unwrapMainToken({wrappedToken, amount}) {
      return tx(wrappedToken, wrappedMainTokenAbi, "unwrap", [amount]);
    },

    unwrapMainTokenTo({wrappedToken, recipient, amount}) {
      return tx(wrappedToken, wrappedMainTokenAbi, "unwrapTo", [recipient, amount]);
    },

    createDealProposal({dealManager, params}) {
      return tx(dealManager, dealManagerAbi, "createDealProposal", [params]);
    },

    createDacManagementProposal({dacCell, params}) {
      return tx(dacCell, dacCellAbi, "createManagementProposal", [params]);
    },

    voteProposal({proposalAddress, support}) {
      return tx(proposalAddress, votingProposalAbi, "vote", [support]);
    },

    executeDacProposal({dacCell, proposalId}) {
      return tx(dacCell, dacCellAbi, "executeDACProposal", [proposalId]);
    },

    setGovernanceOraclePublisher({governanceOracle, publisher, allowed}) {
      return tx(governanceOracle, governanceOracleAbi, "setPublisher", [publisher, allowed]);
    },

    deactivateGovernanceOracle(governanceOracle) {
      return tx(governanceOracle, governanceOracleAbi, "deactivate");
    },

    publishGovernanceOracleSnapshot({governanceOracle, proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower}) {
      return tx(governanceOracle, governanceOracleAbi, "publishSnapshot", [proposalId, snapshotBlock, merkleRoot, totalUnderlyingVotingPower]);
    },

    activateHybridPrimaryVoting(proposalAddress) {
      return tx(proposalAddress, hybridDacManagementProposalAbi, "activatePrimaryVoting");
    },

    beginHybridFallbackWarmup(proposalAddress) {
      return tx(proposalAddress, hybridDacManagementProposalAbi, "beginFallbackWarmup");
    },

    triggerHybridEmergencyFallback(proposalAddress) {
      return tx(proposalAddress, hybridDacManagementProposalAbi, "triggerEmergencyFallback");
    },

    activateHybridFallbackVoting(proposalAddress) {
      return tx(proposalAddress, hybridDacManagementProposalAbi, "activateFallbackVoting");
    },

    voteWrapped({proposalAddress, support}) {
      return tx(proposalAddress, hybridDacManagementProposalAbi, "voteWrapped", [support]);
    },

    voteMerkle({proposalAddress, support, index, amount, proof}) {
      return tx(proposalAddress, hybridDacManagementProposalAbi, "voteMerkle", [support, index, amount, proof]);
    },

    inviteAgentToDeal({dealCell, invitee, grantInviteRight}) {
      return tx(dealCell, dealCellAbi, "invite", [invitee, grantInviteRight]);
    },

    stakeAgentToDeal({agentToken, dealCell, amount}) {
      return tx(agentToken, agentTokenAbi, "stakeToDeal", [dealCell, amount]);
    },

    unstakeFromDeal({dealCell}) {
      return tx(dealCell, dealCellAbi, "unstake");
    },

    claimMainToken({dealCell, evaluatorId}) {
      return tx(dealCell, dealCellAbi, "claimMainToken", [evaluatorId]);
    },

    createDealManagementProposal({dealAddress, params}) {
      return tx(dealAddress, dealAbi, "createStakedAgentProposal", [params]);
    },

    executeDealProposal({dealAddress, proposalId}) {
      return tx(dealAddress, dealAbi, "executeStakedAgentProposal", [proposalId]);
    },

    claimDealRewardPool({dealAddress, evaluatorId}) {
      return tx(dealAddress, dealAbi, "claimDealRewardPool", [evaluatorId]);
    },

    setRootCapitalCallID({dealAddress, capitalCallId}) {
      return tx(dealAddress, dealAbi, "setRootCapitalCallID", [capitalCallId]);
    },

    evaluateDeal({dealManager, dealId, evaluatorId}) {
      return tx(dealManager, dealManagerAbi, "evaluateDeal", [dealId, evaluatorId]);
    },

    forceReturnCapital({dealManager, dealId}) {
      return tx(dealManager, dealManagerAbi, "forceReturnCapital", [dealId]);
    },

    sendDacLegalWrapperMessage({dacCell, kind, message}) {
      return tx(dacCell, dacCellAbi, "logLegalWrapperMessage", [kind, message]);
    },

    sendDealLegalWrapperMessage({dealManager, dealId, kind, message}) {
      return tx(dealManager, dealManagerAbi, "legalWrapperMessage", [dealId, kind, message]);
    },

    claimDividend({dacCell, proposalId, index, receiver, amount, proof}) {
      return tx(dacCell, dacCellAbi, "claimDividend", [proposalId, index, receiver, amount, proof]);
    },

    fulfillCapitalCall({dacCell, call}) {
      return tx(dacCell, dacCellAbi, "fulfillCapitalCall", [call]);
    },

    depositTreasury({dacCell, token, amount}) {
      return tx(dacCell, dacCellAbi, "depositTreasury", [token, amount]);
    },

    recoverTreasury({dacCell, token}) {
      return tx(dacCell, dacCellAbi, "recoverTreasury", [token]);
    },

    approveErc20({token, spender, amount}) {
      return tx(token, erc20Abi, "approve", [spender, amount]);
    },

    transferErc20({token, to, amount}) {
      return tx(token, erc20Abi, "transfer", [to, amount]);
    },

    delegateVotes({token, delegatee}) {
      return tx(token, erc20VotesAbi, "delegate", [delegatee]);
    },
  };
}
