import type {Address, Hex} from "viem";

export type DacMode = "NATIVE" | "EXISTING_TOKEN";

export const AGENT_TOKEN_MINT_ACTION = {
  DIRECT_AGENT: 0,
  DISTRIBUTOR_INVENTORY: 1,
  DISTRIBUTOR_DISABLE: 2,
} as const;

export type AgentTokenMintAction = typeof AGENT_TOKEN_MINT_ACTION[keyof typeof AGENT_TOKEN_MINT_ACTION];

export const PROPOSAL_PHASE = {
  AWAITING_ORACLE_SNAPSHOT: 0,
  PRIMARY_VOTING: 1,
  FALLBACK_WARMUP: 2,
  FALLBACK_VOTING: 3,
  RESOLVED: 4,
} as const;

export type ProposalPhase = typeof PROPOSAL_PHASE[keyof typeof PROPOSAL_PHASE];

export const ASSET_CAPABILITY = {
  MINT: 0,
  BURN: 1,
  CAPITAL_CALL: 2,
  WRAP: 3,
  UNWRAP: 4,
  RESERVE_BACKED_CLAIMS: 5,
} as const;

export type AssetCapability = typeof ASSET_CAPABILITY[keyof typeof ASSET_CAPABILITY];

export interface NativeDacConfig {
  symbol: string;
  name: string;
  description: string;
  mainTokenMaxSupply: bigint;
  defaultQuorum: bigint;
  founder: Address;
  founderAllocation: bigint;
  treasuryToken: Address;
  founderCommitment: bigint;
  dividendsEnabled: boolean;
}

export type DACConfig = NativeDacConfig;

export interface GovernanceStrategyConfig {
  quorumPercent: bigint;
  highQuorumPercent: bigint;
  blockingPercent: bigint;
  duration: bigint;
  qualification: bigint;
  executionValidityDuration: bigint;
  oraclePublishDeadline: bigint;
  fallbackWarmupDuration: bigint;
  fallbackDuration: bigint;
  blockingOnAllProposals: boolean;
  blockingOnHighQuorum: boolean;
  oraclePrimaryEnabled: boolean;
}

export interface ExistingTokenDacConfig {
  symbol: string;
  name: string;
  description: string;
  underlyingToken: Address;
  treasurySeedAmount: bigint;
  /**
   * Optional governance oracle address.
   * Pass `0x0000...0000` when `governanceStrategy.oraclePrimaryEnabled` is `false`
   * (wrapped-only bootstrap). Required (non-zero) when oracle-primary mode is enabled.
   */
  governanceOracle: Address;
  dividendsEnabled: boolean;
  governanceStrategy: GovernanceStrategyConfig;
}

export interface ProposalParams {
  typ: Hex;
  target: Address;
  i: Hex;
  data: Hex;
}

export interface CapitalCall {
  treasuryToken: Address;
  nonce: bigint;
  tokenRecipient: Address;
  tokenAmount: bigint;
  cashAmount: bigint;
}

export interface VotingConfig {
  quorumPercent: bigint;
  blockingPercent: bigint;
  highQuorumPercent: bigint;
  duration: bigint;
  qualification: bigint;
  executionValidityDuration: bigint;
}

export type DacVotingConfig = VotingConfig;

export interface DealCreationConfig {
  minAgentBalance: bigint;
  minInitialAgentStake: bigint;
}

export interface DacCapabilities {
  supportsMint: boolean;
  supportsBurn: boolean;
  supportsCapitalCall: boolean;
  supportsWrap: boolean;
  supportsUnwrap: boolean;
  supportsReserveBackedClaims: boolean;
}

export interface DacAddresses {
  dac: Address;
  mainToken: Address;
  agentToken: Address;
  dealManager: Address;
  moduleRegistry: Address;
  assetController: Address;
  governanceSchema: Address;
  treasuryHolder?: Address;
  governanceOracle?: Address;
  mode?: DacMode;
}

export interface GovernanceOracleSnapshot {
  snapshotBlock: bigint;
  merkleRoot: Hex;
  totalUnderlyingVotingPower: bigint;
  publishedAt: bigint;
}

export interface HybridProposalState {
  proposalAddress: Address;
  wrappedToken: Address;
  governanceOracle: Address;
  phase: ProposalPhase;
  phaseName: string;
  primarySnapshotBlock: bigint;
  fallbackSnapshotBlock: bigint;
  phaseStartTime: bigint;
  phaseEndTime: bigint;
  oracleSnapshotDeadline: bigint;
  totalVotingPower: bigint;
  quorum: bigint;
  blockingQuorum: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  highQuorum: boolean;
  blockingEnabled: boolean;
  resolutionTime: bigint;
  executionDeadline: bigint;
  executionExpired: boolean;
  executed: boolean;
  resolved: boolean;
  outcome: boolean;
  executableNow: boolean;
  oracleMerkleRoot: Hex;
  totalUnderlyingVotingPower: bigint;
  strategy: GovernanceStrategyConfig;
}

export interface DealParams {
  dealKind: Hex;
  name: string;
  description: string;
  linkHash: string;
  moduleFactory: Address;
  governanceFactory: Address;
  dealTarget: Address;
  proposer: Address;
  // Wire-level field name kept for contract compatibility.
  // Semantically this now enables DAC challengeability.
  vetoEnabled: boolean;
  fundingToken: Address;
  fundingAmount: bigint;
  rewardsLimit: bigint;
  dealRewardPoolPercent: bigint;
  approveDeadline: bigint;
  evaluationDeadline: bigint;
  dealDeadline: bigint;
  dealConfig: Hex;
  evaluatorSelector: Hex;
  evaluatorConfig: Hex;
  evaluatorModuleFactory: Address;
  agentsLimit: bigint;
  minimalStake: bigint;
}

export interface TransactionRequest {
  to: Address;
  from: Address;
  data: Hex;
  value: bigint;
  chainId: number;
}
