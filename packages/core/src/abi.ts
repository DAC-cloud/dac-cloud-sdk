import {parseAbi} from "viem";

export const dacFactoryAbi = parseAbi([
  "event DACDeployed(address indexed dac, address mainToken, address agentToken, bool init)",
  "function deployDAC((string symbol,string name,string description,uint256 mainTokenMaxSupply,uint256 defaultQuorum,address founder,uint256 founderAllocation,address treasuryToken,uint256 founderCommitment,bool dividendsEnabled) config, bytes32 salt, address deferBirthRole) returns (address dacAddr, address mainTokenAddr, address agentTokenAddr)",
  "function startDAC(address dacCell, (string symbol,string name,string description,uint256 mainTokenMaxSupply,uint256 defaultQuorum,address founder,uint256 founderAllocation,address treasuryToken,uint256 founderCommitment,bool dividendsEnabled) config, address mainTokenAddr, address agentTokenAddr)"
]);

export const dacCellAbi = parseAbi([
  "function getMainToken() view returns (address)",
  "function getAgentToken() view returns (address)",
  "function getDealManager() view returns (address)",
  "function createManagementProposal((bytes4 typ,address target,bytes32 i,bytes data) params) returns (uint256 id)",
  "function executeDACProposal(uint256 id)",
  "function getProposalVoting(uint256 proposalId) view returns (address)"
]);

export const dealManagerAbi = parseAbi([
  "event DealCreated(address indexed dac, uint256 indexed id, uint256 indexed proposalId, address creator, bytes4 kind, address cell, address deal)",
  "function createDealProposal((bytes4 dealKind,string name,string description,string linkHash,address moduleFactory,address governanceFactory,address dealTarget,address proposer,bool vetoEnabled,address fundingToken,uint256 fundingAmount,uint256 rewardsLimit,uint256 approveDeadline,uint256 dealDeadline,bytes dealConfig,bytes4 evaluatorSelector,bytes evaluatorConfig) params) returns (uint256 id, address dealCell, address dealAddr, address evaluatorAddr)",
  "function deals(uint256 id) view returns (address)",
  "function isRecoverable(uint256 id) view returns (bool)"
]);
