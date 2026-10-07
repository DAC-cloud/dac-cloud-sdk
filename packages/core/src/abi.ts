import {parseAbi} from "viem";
import {commonErrorSignatures} from "./errors";

export const dacFactoryAbi = parseAbi([
  ...commonErrorSignatures,
  "event DACDeployed(address indexed dac, bytes32 indexed salt, address mainToken, address agentToken, bool init)",
  "event ExistingTokenDACDeployed(address indexed dac, address indexed underlyingToken, address indexed wrappedToken, address governanceOracle, address agentToken, address assetController, address creator, uint256 treasurySeedAmount)",
  "function deployDAC((string symbol,string name,string description,uint256 mainTokenMaxSupply,uint256 defaultQuorum,address founder,uint256 founderAllocation,address treasuryToken,uint256 founderCommitment,bool dividendsEnabled) config, bytes32 salt, address deferBirthRole) returns (address dacAddr, address mainTokenAddr, address agentTokenAddr)",
  "function deployExistingTokenDAC(bytes encodedConfig, bytes32 salt) returns (address dacAddr, address wrappedMainTokenAddr, address agentTokenAddr)",
  "function deployGovernanceOracle(address admin, address initialPublisher) returns (address oracle)",
  "function startDAC(address dacCell, (string symbol,string name,string description,uint256 mainTokenMaxSupply,uint256 defaultQuorum,address founder,uint256 founderAllocation,address treasuryToken,uint256 founderCommitment,bool dividendsEnabled) config, address mainTokenAddr, address agentTokenAddr)"
]);

export const dacCellAbi = parseAbi([
  ...commonErrorSignatures,
  "event DACProposalCreated(uint256 indexed id, address indexed prop, bytes4 indexed typ, address target, bytes32 data1, bytes data2)",
  "event CapitalCallCreated(uint256 indexed id, address indexed recipient, bytes32 indexed callHash, address treasuryToken, uint256 tokenAmount, uint256 cashAmount, uint256 nonce)",
  "event AgentDistributorApproved(address indexed dac, address indexed distributor, uint256 allowance)",
  "event AgentDistributorRevoked(address indexed dac, address indexed distributor)",
  "function getMainToken() view returns (address)",
  "function getAgentToken() view returns (address)",
  "function getDealManager() view returns (address)",
  "function getModuleRegistry() view returns (address)",
  "function getAssetController() view returns (address)",
  "function getGovernanceSchema() view returns (address)",
  "function getVotingConfig() view returns ((uint256 quorumPercent, uint256 blockingPercent, uint256 highQuorumPercent, uint256 duration, uint256 qualification, uint256 executionValidityDuration))",
  "function depositTreasury(address token, uint256 amount)",
  "function recoverTreasury(address token)",
  "function recoverERC20(address token)",
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

export const wrappedMainTokenAbi = parseAbi([
  ...commonErrorSignatures,
  "function underlying() view returns (address)",
  "function wrap(uint256 amount) returns (uint256 wrappedAmount)",
  "function wrapTo(address recipient, uint256 amount) returns (uint256 wrappedAmount)",
  "function unwrap(uint256 amount) returns (uint256 underlyingAmount)",
  "function unwrapTo(address recipient, uint256 amount) returns (uint256 underlyingAmount)"
]);

export const governanceSchemaAbi = parseAbi([
  ...commonErrorSignatures,
  "function getVotingConfig() view returns ((uint256 quorumPercent, uint256 blockingPercent, uint256 highQuorumPercent, uint256 duration, uint256 qualification, uint256 executionValidityDuration))",
  "function getDealCreationConfig() view returns ((uint256 minAgentBalance, uint256 minInitialAgentStake))",
  "function getStrategyConfig() view returns ((uint256 quorumPercent, uint256 highQuorumPercent, uint256 blockingPercent, uint256 duration, uint256 qualification, uint256 executionValidityDuration, uint256 oraclePublishDeadline, uint256 fallbackWarmupBlocks, uint256 fallbackDuration, bool blockingOnAllProposals, bool blockingOnHighQuorum, bool oraclePrimaryEnabled))",
  "function getGovernanceOracle() view returns (address oracle)",
  "function getProposal(uint256 id) view returns (address proposal)"
]);

export const governanceOracleAbi = parseAbi([
  ...commonErrorSignatures,
  "function setPublisher(address publisher, bool allowed)",
  "function isPublisher(address publisher) view returns (bool)",
  "function isActive(address dac) view returns (bool)",
  "function deactivate(address dac)",
  "function publishSnapshot(address dac, uint256 proposalId, uint256 snapshotBlock, bytes32 merkleRoot, uint256 totalUnderlyingVotingPower)",
  "function getSnapshot(address dac, uint256 proposalId) view returns ((uint256 snapshotBlock, bytes32 merkleRoot, uint256 totalUnderlyingVotingPower, uint256 publishedAt))"
]);

export const dealManagerAbi = parseAbi([
  ...commonErrorSignatures,
  "event DealCreated(address indexed dac, uint256 indexed id, uint256 indexed proposalId, address creator, bytes4 kind, address cell, address deal)",
  "event TrancheCreated(address indexed dac, uint256 indexed id, uint256 indexed proposalId, uint256 trancheId)",
  "function createDealProposal((bytes4 dealKind,string name,string description,string linkHash,address moduleFactory,address governanceFactory,address dealTarget,address proposer,bool vetoEnabled,address fundingToken,uint256 fundingAmount,uint256 rewardsLimit,uint256 dealRewardPoolPercent,uint256 approveDeadline,uint256 evaluationDeadline,uint256 dealDeadline,bytes dealConfig,bytes4 evaluatorSelector,bytes evaluatorConfig,address evaluatorModuleFactory,uint256 agentsLimit,uint256 minimalStake) params) returns (uint256 id, address dealCell, address dealAddr, address evaluatorAddr)",
  "function deals(uint256 id) view returns (address)",
  "function state(address dealCell) view returns ((uint256 id, address deal, address module, bool active, bool liquidated, uint256 rewardsLimit, uint256 rewardsUnlocked, uint256 rewardsPaid, address[] evaluators, bytes initParams))",
  "function MAX_MODULE_CONTROLLED_ADDRESSES() view returns (uint256)",
  "function moduleControlledCount(address dealCell) view returns (uint256)",
  "function isRecoverable(uint256 id) view returns (bool)",
  "function evaluateDeal(uint256 id, uint256 evaluatorId)",
  "function legalWrapperMessage(uint256 id, bytes4 kind, bytes message)",
  "function forceReturnCapital(uint256 id)"
]);

export const votingProposalAbi = parseAbi([
  ...commonErrorSignatures,
  "function vote(bool support)",
  // Not `view`: these settle resolution lazily. Read them via simulateContract.
  "function isResolved() returns (bool)",
  "function outcome() returns (bool)"
]);

export const hybridDacManagementProposalAbi = parseAbi([
  ...commonErrorSignatures,
  "function wrappedToken() view returns (address)",
  "function governanceOracle() view returns (address)",
  "function phase() view returns (uint8)",
  "function primarySnapshotBlock() view returns (uint256)",
  "function fallbackSnapshotBlock() view returns (uint256)",
  "function phaseStartTime() view returns (uint256)",
  "function phaseEndTime() view returns (uint256)",
  "function oracleSnapshotDeadline() view returns (uint256)",
  "function totalVotingPower() view returns (uint256)",
  "function quorum() view returns (uint256)",
  "function blockingQuorum() view returns (uint256)",
  "function yesVotes() view returns (uint256)",
  "function noVotes() view returns (uint256)",
  "function highQuorum() view returns (bool)",
  "function blockingEnabled() view returns (bool)",
  "function resolutionTime() view returns (uint256)",
  "function oracleMerkleRoot() view returns (bytes32)",
  "function totalUnderlyingVotingPower() view returns (uint256)",
  "function getStrategy() view returns ((uint256 quorumPercent, uint256 highQuorumPercent, uint256 blockingPercent, uint256 duration, uint256 qualification, uint256 executionValidityDuration, uint256 oraclePublishDeadline, uint256 fallbackWarmupBlocks, uint256 fallbackDuration, bool blockingOnAllProposals, bool blockingOnHighQuorum, bool oraclePrimaryEnabled))",
  "function activatePrimaryVoting()",
  "function beginFallbackWarmup()",
  "function triggerEmergencyFallback()",
  "function activateFallbackVoting()",
  "function voteWrapped(bool support)",
  "function voteMerkle(bool support, uint256 index, uint256 amount, bytes32[] proof)",
  // Not `view`: any of these can lazily move the proposal into FallbackWarmup /
  // FallbackVoting or resolve it. Read them via simulateContract and follow
  // ProposalPhaseTransition events rather than assuming explicit transition calls.
  // `outcome()` reverts NotResolved before a voting phase is active.
  "function isResolved() returns (bool)",
  "function outcome() returns (bool)",
  "function isExecutableNow() returns (bool)",
  "function isExecutionExpired() returns (bool)",
  "function isExecuted() view returns (bool)",
  "function executionDeadline() returns (uint256)"
]);

export const erc20VotesAbi = parseAbi([
  ...commonErrorSignatures,
  "function delegate(address delegatee) returns (uint256)",
  "function getVotes(address account) view returns (uint256)"
]);

export const erc20Abi = parseAbi([
  ...commonErrorSignatures,
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
]);

export const agentTokenAbi = parseAbi([
  ...commonErrorSignatures,
  "function stakeToDeal(address dealCell, uint256 amount)",
  "function qualifiedBalanceOf(address account) view returns (uint256)",
  "event AgentTokenDistributed(address indexed dac, address indexed distributor, address indexed recipient, uint256 amount)"
]);

export const dealCellAbi = parseAbi([
  ...commonErrorSignatures,
  "function stakeToken() view returns (address)",
  "function invite(address invitee, bool grantInviteRight)",
  "function unstake()",
  "function claimMainToken(uint256 evaluatorId)",
  "function dealRewardPoolPercent() view returns (uint256)",
  "function fundingTokens() view returns (address[])",
  "function isApproved() view returns (bool)",
  "function isClosed() view returns (bool)",
  "event AgentStruckOut(address indexed dac, uint256 indexed id, address indexed deal, address agent, uint256 amount)",
  "event DealRewardPoolAllocated(address indexed dac, uint256 indexed id, address indexed deal, uint256 amount)",
  "event DealRewardClaimed(address indexed dac, uint256 indexed id, address indexed deal, uint256 amount)"
]);

export const dealAbi = parseAbi([
  ...commonErrorSignatures,
  "event DealManagementProposalCreated(address indexed cell,address indexed prop,uint256 id,bytes4 indexed typ,address target,bytes32 data1,bytes data2)",
  "event ChildVoteCreated(uint256 indexed childProposalId, uint256 proposalId)",
  "event ChildVoteCasted(uint256 indexed childProposalId, bool support)",
  "event VenueVersionApproved(bytes32 indexed venueId, string version, bool allowed)",
  "event ExternalVoteApproved(bytes32 indexed venueId, bytes32 indexed finalHash, uint64 expiry)",
  "function createStakedAgentProposal((bytes4 typ,address target,bytes32 i,bytes data) params) returns (uint256 proposalId)",
  "function executeStakedAgentProposal(uint256 proposalId)",
  "function getProposal(uint256 proposalId) view returns (address)",
  "function votingConfig() view returns ((uint256 quorumPercent, uint256 blockingPercent, uint256 highQuorumPercent, uint256 duration, uint256 qualification, uint256 executionValidityDuration))",
  "function managedEntity() view returns (address)",
  "function claimDealRewardPool(uint256 evaluatorId)",
  "function setRootCapitalCallID(uint256 capitalCallId)",
  "function recoverProfits(address token) returns (uint256)",
  "function isValidSignature(bytes32 hash, bytes signature) view returns (bytes4)",
  "function approvedVenueVersions(bytes32 venueId, string version) view returns (bool)"
]);

export const permit2TreasuryAbi = parseAbi([
  ...commonErrorSignatures,
  "function executeAgentSpend(address token, address destination, uint160 amount)",
  "function executeReceivePermit2(address token, address source, uint160 amount)",
  "function executeReceivePermit2Signature(((address token, uint256 amount) permitted, uint256 nonce, uint256 deadline) permit, (address to, uint256 requestedAmount) transferDetails, address source, bytes signature)",
]);

export const moduleFactoryAbi = parseAbi([
  ...commonErrorSignatures,
  "error DealKindNotSupported(bytes4 dealKind)",
  "error EvaluatorKindNotSupported(bytes4 dealKind)",
  "function moduleId() view returns (bytes32)",
  "function supportedDealKinds() view returns (bytes4[])",
  "function supportedEvaluatorKinds() view returns (bytes4[])",
  "function supportsDealKind(bytes4 dealKind) view returns (bool)",
  "function dealAcceptsGovernanceFactory(bytes4 dealKind, address governanceFactory) view returns (bool)",
  // CoreModuleFactory only: the single deal-proposal factory core deals accept.
  "function dealGovernanceFactory() view returns (address)",
]);

export const agentDealAbi = parseAbi([
  ...commonErrorSignatures,
  "event HostStaked(address indexed hostDealCell, uint256 amount)",
  "event HostStakeApproved(address indexed hostDealCell, uint256 amount)",
  "event HostDealCreated(address indexed hostDealCell, uint256 indexed hostDealId)",
  "event HostProposalCreated(address indexed hostDealCell, uint256 indexed hostProposalId, bytes4 typ)",
  "event HostVoteCast(address indexed hostDealCell, uint256 indexed hostProposalId, bool support)",
  "event HostRewardClaimed(address indexed hostDealCell, uint256 evaluatorId)",
  "event HostUnstaked(address indexed hostDealCell)",
  "event HostInvited(address indexed hostDealCell, address indexed invitee, bool grantInviteRight)",
  "event AssetReturnedToDAC(address indexed token, uint256 amount)",
  "function managedEntity() view returns (address)",
  "function hostDNA() view returns (address hostAgentToken, address hostMainToken)",
]);
