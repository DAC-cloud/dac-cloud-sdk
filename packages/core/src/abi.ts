import {parseAbi} from "viem";
import {commonErrorSignatures} from "./errors";

export const dacFactoryAbi = parseAbi([
  ...commonErrorSignatures,
  "event DACDeployed(address indexed dac, address mainToken, address agentToken, bool init)",
  "event ExistingTokenDACDeployed(address indexed dac, address indexed underlyingToken, address indexed wrappedToken, address governanceOracle, address agentToken, address assetController, address creator, uint256 treasurySeedAmount)",
  "function deployDAC((string symbol,string name,string description,uint256 mainTokenMaxSupply,uint256 defaultQuorum,address founder,uint256 founderAllocation,address treasuryToken,uint256 founderCommitment,bool dividendsEnabled) config, bytes32 salt, address deferBirthRole) returns (address dacAddr, address mainTokenAddr, address agentTokenAddr)",
  "function deployExistingTokenDAC(bytes encodedConfig, bytes32 salt) returns (address dacAddr, address wrappedMainTokenAddr, address agentTokenAddr, address governanceOracleAddr)",
  "function startDAC(address dacCell, (string symbol,string name,string description,uint256 mainTokenMaxSupply,uint256 defaultQuorum,address founder,uint256 founderAllocation,address treasuryToken,uint256 founderCommitment,bool dividendsEnabled) config, address mainTokenAddr, address agentTokenAddr)"
]);

export const dacCellAbi = parseAbi([
  ...commonErrorSignatures,
  "event DACProposalCreated(uint256 indexed id, address indexed prop, bytes4 indexed typ, address target, bytes32 data1, bytes data2)",
  "event CapitalCallCreated(uint256 indexed id, address indexed recipient, bytes32 indexed callHash, address treasuryToken, uint256 tokenAmount, uint256 cashAmount, uint256 nonce)",
  "function getMainToken() view returns (address)",
  "function getAgentToken() view returns (address)",
  "function getDealManager() view returns (address)",
  "function getModuleRegistry() view returns (address)",
  "function getAssetController() view returns (address)",
  "function getGovernanceSchema() view returns (address)",
  "function getVotingConfig() view returns ((uint256 quorumPercent, uint256 blockingPercent, uint256 highQuorumPercent, uint256 duration, uint256 qualification, uint256 executionValidityDuration))",
  "function depositTreasury(address token, uint256 amount)",
  "function recoverTreasury(address token)",
  "function createManagementProposal((bytes4 typ,address target,bytes32 i,bytes data) params) returns (uint256 id)",
  "function fulfillCapitalCall((address treasuryToken, uint256 nonce, address tokenRecipient, uint256 tokenAmount, uint256 cashAmount) call) returns (bool)",
  "function logLegalWrapperMessage(bytes4 kind, bytes message)",
  "function claimDividend(uint256 proposalId, uint256 index, address receiver, uint256 amount, bytes32[] proof)",
  "function executeDACProposal(uint256 id)",
  "function getProposalVoting(uint256 proposalId) view returns (address)"
]);

export const assetControllerAbi = parseAbi([
  ...commonErrorSignatures,
  "function treasuryHolder() view returns (address)",
  "function supportsCapability(uint8 capability) view returns (bool)"
]);

export const governanceSchemaAbi = parseAbi([
  ...commonErrorSignatures,
  "function getVotingConfig() view returns ((uint256 quorumPercent, uint256 blockingPercent, uint256 highQuorumPercent, uint256 duration, uint256 qualification, uint256 executionValidityDuration))",
  "function getDealCreationConfig() view returns ((uint256 minAgentBalance, uint256 minInitialAgentStake))",
  "function getStrategyConfig() view returns ((uint256 quorumPercent, uint256 highQuorumPercent, uint256 blockingPercent, uint256 duration, uint256 qualification, uint256 executionValidityDuration, uint256 oraclePublishDeadline, uint256 fallbackWarmupDuration, uint256 fallbackDuration))",
  "function getGovernanceOracle() view returns (address oracle)",
  "function getProposal(uint256 id) view returns (address proposal)"
]);

export const dealManagerAbi = parseAbi([
  ...commonErrorSignatures,
  "event DealCreated(address indexed dac, uint256 indexed id, uint256 indexed proposalId, address creator, bytes4 kind, address cell, address deal)",
  "event TrancheCreated(address indexed dac, uint256 indexed id, uint256 indexed proposalId, uint256 trancheId)",
  "function createDealProposal((bytes4 dealKind,string name,string description,string linkHash,address moduleFactory,address governanceFactory,address dealTarget,address proposer,bool vetoEnabled,address fundingToken,uint256 fundingAmount,uint256 rewardsLimit,uint256 approveDeadline,uint256 evaluationDeadline,uint256 dealDeadline,bytes dealConfig,bytes4 evaluatorSelector,bytes evaluatorConfig) params) returns (uint256 id, address dealCell, address dealAddr, address evaluatorAddr)",
  "function deals(uint256 id) view returns (address)",
  "function isRecoverable(uint256 id) view returns (bool)",
  "function evaluateDeal(uint256 id, uint256 evaluatorId)",
  "function legalWrapperMessage(uint256 id, bytes4 kind, bytes message)",
  "function forceReturnCapital(uint256 id)"
]);

export const votingProposalAbi = parseAbi([
  ...commonErrorSignatures,
  "function vote(bool support)",
  "function isResolved() returns (bool)",
  "function outcome() returns (bool)"
]);

export const erc20VotesAbi = parseAbi([
  ...commonErrorSignatures,
  "function delegate(address delegatee) returns (uint256)",
  "function getVotes(address account) view returns (uint256)"
]);

export const erc20Abi = parseAbi([
  ...commonErrorSignatures,
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
]);

export const agentTokenAbi = parseAbi([
  ...commonErrorSignatures,
  "function stakeToDeal(address dealCell, uint256 amount)"
]);

export const dealCellAbi = parseAbi([
  ...commonErrorSignatures,
  "function stakeToken() view returns (address)",
  "function unstake()",
  "function claimMainToken(uint256 evaluatorId)"
]);

export const dealAbi = parseAbi([
  ...commonErrorSignatures,
  "event DealManagementProposalCreated(address indexed cell,address indexed prop,uint256 id,bytes4 indexed typ,address target,bytes32 data1,bytes data2)",
  "event ChildVoteCreated(uint256 indexed childProposalId, uint256 proposalId)",
  "event ChildVoteCasted(uint256 indexed childProposalId, bool support)",
  "function createStakedAgentProposal((bytes4 typ,address target,bytes32 i,bytes data) params) returns (uint256 proposalId)",
  "function executeStakedAgentProposal(uint256 proposalId)",
  "function getProposal(uint256 proposalId) view returns (address)"
]);
