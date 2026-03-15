import type {Address, Hex} from "viem";

export interface DACConfig {
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
  vetoEnabled: boolean;
  fundingToken: Address;
  fundingAmount: bigint;
  rewardsLimit: bigint;
  approveDeadline: bigint;
  dealDeadline: bigint;
  dealConfig: Hex;
  evaluatorSelector: Hex;
  evaluatorConfig: Hex;
}
