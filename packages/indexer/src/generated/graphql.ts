import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  jsonb: { input: unknown; output: unknown; }
  numeric: { input: string; output: string; }
  timestamptz: { input: string; output: string; }
};

/** Boolean expression to filter rows from the table "Account". All fields are combined with a logical 'AND'. */
export type Account_Bool_Exp = {
  _and?: InputMaybe<Array<Account_Bool_Exp>>;
  _not?: InputMaybe<Account_Bool_Exp>;
  _or?: InputMaybe<Array<Account_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  agentDistributorRoles?: InputMaybe<AgentDistributor_Bool_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dacAgents?: InputMaybe<DacAgent_Bool_Exp>;
  dacGovernanceAccounts?: InputMaybe<DacGovernanceAccount_Bool_Exp>;
  dealAgentPositions?: InputMaybe<DealAgentPosition_Bool_Exp>;
  dealGovernanceAccounts?: InputMaybe<DealGovernanceAccount_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  mainTokenHoldings?: InputMaybe<MainTokenHolder_Bool_Exp>;
  proposalVotes?: InputMaybe<ProposalVote_Bool_Exp>;
  receivedAgentDistributions?: InputMaybe<AgentDistribution_Bool_Exp>;
  sentAgentDistributions?: InputMaybe<AgentDistribution_Bool_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "Account". */
export type Account_Order_By = {
  address?: InputMaybe<Order_By>;
  agentDistributorRoles_aggregate?: InputMaybe<AgentDistributor_Aggregate_Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacAgents_aggregate?: InputMaybe<DacAgent_Aggregate_Order_By>;
  dacGovernanceAccounts_aggregate?: InputMaybe<DacGovernanceAccount_Aggregate_Order_By>;
  dealAgentPositions_aggregate?: InputMaybe<DealAgentPosition_Aggregate_Order_By>;
  dealGovernanceAccounts_aggregate?: InputMaybe<DealGovernanceAccount_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  mainTokenHoldings_aggregate?: InputMaybe<MainTokenHolder_Aggregate_Order_By>;
  proposalVotes_aggregate?: InputMaybe<ProposalVote_Aggregate_Order_By>;
  receivedAgentDistributions_aggregate?: InputMaybe<AgentDistribution_Aggregate_Order_By>;
  sentAgentDistributions_aggregate?: InputMaybe<AgentDistribution_Aggregate_Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "Account" */
export type Account_Select_Column =
  /** column name */
  | 'address'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'id'
  /** column name */
  | 'updatedBlockNumber';

/** Streaming cursor of the table "Account" */
export type Account_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Account_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Account_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by aggregate values of table "AgentAction" */
export type AgentAction_Aggregate_Order_By = {
  avg?: InputMaybe<AgentAction_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AgentAction_Max_Order_By>;
  min?: InputMaybe<AgentAction_Min_Order_By>;
  stddev?: InputMaybe<AgentAction_Stddev_Order_By>;
  stddev_pop?: InputMaybe<AgentAction_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<AgentAction_Stddev_Samp_Order_By>;
  sum?: InputMaybe<AgentAction_Sum_Order_By>;
  var_pop?: InputMaybe<AgentAction_Var_Pop_Order_By>;
  var_samp?: InputMaybe<AgentAction_Var_Samp_Order_By>;
  variance?: InputMaybe<AgentAction_Variance_Order_By>;
};

/** order by avg() on columns of table "AgentAction" */
export type AgentAction_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "AgentAction". All fields are combined with a logical 'AND'. */
export type AgentAction_Bool_Exp = {
  _and?: InputMaybe<Array<AgentAction_Bool_Exp>>;
  _not?: InputMaybe<AgentAction_Bool_Exp>;
  _or?: InputMaybe<Array<AgentAction_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<String_Comparison_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  actionType?: InputMaybe<String_Comparison_Exp>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacAgent?: InputMaybe<DacAgent_Bool_Exp>;
  dacAgentId?: InputMaybe<String_Comparison_Exp>;
  dacAgent_id?: InputMaybe<String_Comparison_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  position?: InputMaybe<DealAgentPosition_Bool_Exp>;
  positionId?: InputMaybe<String_Comparison_Exp>;
  position_id?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "AgentAction" */
export type AgentAction_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  actionType?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacAgentId?: InputMaybe<Order_By>;
  dacAgent_id?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  positionId?: InputMaybe<Order_By>;
  position_id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "AgentAction" */
export type AgentAction_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  actionType?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacAgentId?: InputMaybe<Order_By>;
  dacAgent_id?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  positionId?: InputMaybe<Order_By>;
  position_id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "AgentAction". */
export type AgentAction_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  actionType?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacAgent?: InputMaybe<DacAgent_Order_By>;
  dacAgentId?: InputMaybe<Order_By>;
  dacAgent_id?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  position?: InputMaybe<DealAgentPosition_Order_By>;
  positionId?: InputMaybe<Order_By>;
  position_id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** select columns of table "AgentAction" */
export type AgentAction_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'account_id'
  /** column name */
  | 'actionType'
  /** column name */
  | 'amount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacAgentId'
  /** column name */
  | 'dacAgent_id'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'positionId'
  /** column name */
  | 'position_id'
  /** column name */
  | 'proposalNumericId';

/** order by stddev() on columns of table "AgentAction" */
export type AgentAction_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "AgentAction" */
export type AgentAction_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "AgentAction" */
export type AgentAction_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "AgentAction" */
export type AgentAction_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AgentAction_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AgentAction_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  actionType?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacAgentId?: InputMaybe<Scalars['String']['input']>;
  dacAgent_id?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  positionId?: InputMaybe<Scalars['String']['input']>;
  position_id?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "AgentAction" */
export type AgentAction_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "AgentAction" */
export type AgentAction_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "AgentAction" */
export type AgentAction_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "AgentAction" */
export type AgentAction_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "AgentDistribution" */
export type AgentDistribution_Aggregate_Order_By = {
  avg?: InputMaybe<AgentDistribution_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AgentDistribution_Max_Order_By>;
  min?: InputMaybe<AgentDistribution_Min_Order_By>;
  stddev?: InputMaybe<AgentDistribution_Stddev_Order_By>;
  stddev_pop?: InputMaybe<AgentDistribution_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<AgentDistribution_Stddev_Samp_Order_By>;
  sum?: InputMaybe<AgentDistribution_Sum_Order_By>;
  var_pop?: InputMaybe<AgentDistribution_Var_Pop_Order_By>;
  var_samp?: InputMaybe<AgentDistribution_Var_Samp_Order_By>;
  variance?: InputMaybe<AgentDistribution_Variance_Order_By>;
};

/** order by avg() on columns of table "AgentDistribution" */
export type AgentDistribution_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "AgentDistribution". All fields are combined with a logical 'AND'. */
export type AgentDistribution_Bool_Exp = {
  _and?: InputMaybe<Array<AgentDistribution_Bool_Exp>>;
  _not?: InputMaybe<AgentDistribution_Bool_Exp>;
  _or?: InputMaybe<Array<AgentDistribution_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  distributor?: InputMaybe<AgentDistributor_Bool_Exp>;
  distributorAccount?: InputMaybe<Account_Bool_Exp>;
  distributorAccountId?: InputMaybe<String_Comparison_Exp>;
  distributorAccount_id?: InputMaybe<String_Comparison_Exp>;
  distributorAddress?: InputMaybe<String_Comparison_Exp>;
  distributorId?: InputMaybe<String_Comparison_Exp>;
  distributor_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  recipientAccount?: InputMaybe<Account_Bool_Exp>;
  recipientAccountId?: InputMaybe<String_Comparison_Exp>;
  recipientAccount_id?: InputMaybe<String_Comparison_Exp>;
  recipientAddress?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "AgentDistribution" */
export type AgentDistribution_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  distributorAccountId?: InputMaybe<Order_By>;
  distributorAccount_id?: InputMaybe<Order_By>;
  distributorAddress?: InputMaybe<Order_By>;
  distributorId?: InputMaybe<Order_By>;
  distributor_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipientAccountId?: InputMaybe<Order_By>;
  recipientAccount_id?: InputMaybe<Order_By>;
  recipientAddress?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "AgentDistribution" */
export type AgentDistribution_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  distributorAccountId?: InputMaybe<Order_By>;
  distributorAccount_id?: InputMaybe<Order_By>;
  distributorAddress?: InputMaybe<Order_By>;
  distributorId?: InputMaybe<Order_By>;
  distributor_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipientAccountId?: InputMaybe<Order_By>;
  recipientAccount_id?: InputMaybe<Order_By>;
  recipientAddress?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "AgentDistribution". */
export type AgentDistribution_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  distributor?: InputMaybe<AgentDistributor_Order_By>;
  distributorAccount?: InputMaybe<Account_Order_By>;
  distributorAccountId?: InputMaybe<Order_By>;
  distributorAccount_id?: InputMaybe<Order_By>;
  distributorAddress?: InputMaybe<Order_By>;
  distributorId?: InputMaybe<Order_By>;
  distributor_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipientAccount?: InputMaybe<Account_Order_By>;
  recipientAccountId?: InputMaybe<Order_By>;
  recipientAccount_id?: InputMaybe<Order_By>;
  recipientAddress?: InputMaybe<Order_By>;
};

/** select columns of table "AgentDistribution" */
export type AgentDistribution_Select_Column =
  /** column name */
  | 'amount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'distributorAccountId'
  /** column name */
  | 'distributorAccount_id'
  /** column name */
  | 'distributorAddress'
  /** column name */
  | 'distributorId'
  /** column name */
  | 'distributor_id'
  /** column name */
  | 'id'
  /** column name */
  | 'recipientAccountId'
  /** column name */
  | 'recipientAccount_id'
  /** column name */
  | 'recipientAddress';

/** order by stddev() on columns of table "AgentDistribution" */
export type AgentDistribution_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "AgentDistribution" */
export type AgentDistribution_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "AgentDistribution" */
export type AgentDistribution_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "AgentDistribution" */
export type AgentDistribution_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AgentDistribution_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AgentDistribution_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  distributorAccountId?: InputMaybe<Scalars['String']['input']>;
  distributorAccount_id?: InputMaybe<Scalars['String']['input']>;
  distributorAddress?: InputMaybe<Scalars['String']['input']>;
  distributorId?: InputMaybe<Scalars['String']['input']>;
  distributor_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  recipientAccountId?: InputMaybe<Scalars['String']['input']>;
  recipientAccount_id?: InputMaybe<Scalars['String']['input']>;
  recipientAddress?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "AgentDistribution" */
export type AgentDistribution_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "AgentDistribution" */
export type AgentDistribution_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "AgentDistribution" */
export type AgentDistribution_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "AgentDistribution" */
export type AgentDistribution_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "AgentDistributor" */
export type AgentDistributor_Aggregate_Order_By = {
  avg?: InputMaybe<AgentDistributor_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AgentDistributor_Max_Order_By>;
  min?: InputMaybe<AgentDistributor_Min_Order_By>;
  stddev?: InputMaybe<AgentDistributor_Stddev_Order_By>;
  stddev_pop?: InputMaybe<AgentDistributor_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<AgentDistributor_Stddev_Samp_Order_By>;
  sum?: InputMaybe<AgentDistributor_Sum_Order_By>;
  var_pop?: InputMaybe<AgentDistributor_Var_Pop_Order_By>;
  var_samp?: InputMaybe<AgentDistributor_Var_Samp_Order_By>;
  variance?: InputMaybe<AgentDistributor_Variance_Order_By>;
};

/** order by avg() on columns of table "AgentDistributor" */
export type AgentDistributor_Avg_Order_By = {
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "AgentDistributor". All fields are combined with a logical 'AND'. */
export type AgentDistributor_Bool_Exp = {
  _and?: InputMaybe<Array<AgentDistributor_Bool_Exp>>;
  _not?: InputMaybe<AgentDistributor_Bool_Exp>;
  _or?: InputMaybe<Array<AgentDistributor_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<String_Comparison_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  approvedCount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  currentAllowance?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  distributionEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  distributions?: InputMaybe<AgentDistribution_Bool_Exp>;
  distributorAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  inventoryBalance?: InputMaybe<Numeric_Comparison_Exp>;
  isDistributor?: InputMaybe<Boolean_Comparison_Exp>;
  revokedCount?: InputMaybe<Numeric_Comparison_Exp>;
  totalApprovedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalDistributedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "AgentDistributor" */
export type AgentDistributor_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  distributorAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "AgentDistributor" */
export type AgentDistributor_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  distributorAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "AgentDistributor". */
export type AgentDistributor_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  distributionEnabled?: InputMaybe<Order_By>;
  distributions_aggregate?: InputMaybe<AgentDistribution_Aggregate_Order_By>;
  distributorAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  isDistributor?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "AgentDistributor" */
export type AgentDistributor_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'account_id'
  /** column name */
  | 'approvedCount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'currentAllowance'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'distributionEnabled'
  /** column name */
  | 'distributorAddress'
  /** column name */
  | 'id'
  /** column name */
  | 'inventoryBalance'
  /** column name */
  | 'isDistributor'
  /** column name */
  | 'revokedCount'
  /** column name */
  | 'totalApprovedAmount'
  /** column name */
  | 'totalDistributedAmount'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "AgentDistributor" */
export type AgentDistributor_Stddev_Order_By = {
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "AgentDistributor" */
export type AgentDistributor_Stddev_Pop_Order_By = {
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "AgentDistributor" */
export type AgentDistributor_Stddev_Samp_Order_By = {
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "AgentDistributor" */
export type AgentDistributor_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AgentDistributor_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AgentDistributor_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  approvedCount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  currentAllowance?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  distributionEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  distributorAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  inventoryBalance?: InputMaybe<Scalars['numeric']['input']>;
  isDistributor?: InputMaybe<Scalars['Boolean']['input']>;
  revokedCount?: InputMaybe<Scalars['numeric']['input']>;
  totalApprovedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalDistributedAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "AgentDistributor" */
export type AgentDistributor_Sum_Order_By = {
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "AgentDistributor" */
export type AgentDistributor_Var_Pop_Order_By = {
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "AgentDistributor" */
export type AgentDistributor_Var_Samp_Order_By = {
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "AgentDistributor" */
export type AgentDistributor_Variance_Order_By = {
  approvedCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentAllowance?: InputMaybe<Order_By>;
  inventoryBalance?: InputMaybe<Order_By>;
  revokedCount?: InputMaybe<Order_By>;
  totalApprovedAmount?: InputMaybe<Order_By>;
  totalDistributedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** order by aggregate values of table "CapitalCall" */
export type CapitalCall_Aggregate_Order_By = {
  avg?: InputMaybe<CapitalCall_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<CapitalCall_Max_Order_By>;
  min?: InputMaybe<CapitalCall_Min_Order_By>;
  stddev?: InputMaybe<CapitalCall_Stddev_Order_By>;
  stddev_pop?: InputMaybe<CapitalCall_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<CapitalCall_Stddev_Samp_Order_By>;
  sum?: InputMaybe<CapitalCall_Sum_Order_By>;
  var_pop?: InputMaybe<CapitalCall_Var_Pop_Order_By>;
  var_samp?: InputMaybe<CapitalCall_Var_Samp_Order_By>;
  variance?: InputMaybe<CapitalCall_Variance_Order_By>;
};

/** order by avg() on columns of table "CapitalCall" */
export type CapitalCall_Avg_Order_By = {
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "CapitalCall". All fields are combined with a logical 'AND'. */
export type CapitalCall_Bool_Exp = {
  _and?: InputMaybe<Array<CapitalCall_Bool_Exp>>;
  _not?: InputMaybe<CapitalCall_Bool_Exp>;
  _or?: InputMaybe<Array<CapitalCall_Bool_Exp>>;
  callHash?: InputMaybe<String_Comparison_Exp>;
  cashAmount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacAddress?: InputMaybe<String_Comparison_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  fulfilledBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  fulfillmentCount?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  lastPayer?: InputMaybe<String_Comparison_Exp>;
  nonce?: InputMaybe<Numeric_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  recipient?: InputMaybe<String_Comparison_Exp>;
  tokenAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalFulfilledCashAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalFulfilledTokenAmount?: InputMaybe<Numeric_Comparison_Exp>;
  treasuryTokenAddress?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "CapitalCall" */
export type CapitalCall_Max_Order_By = {
  callHash?: InputMaybe<Order_By>;
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dacAddress?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastPayer?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recipient?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  treasuryTokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "CapitalCall" */
export type CapitalCall_Min_Order_By = {
  callHash?: InputMaybe<Order_By>;
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dacAddress?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastPayer?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recipient?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  treasuryTokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "CapitalCall". */
export type CapitalCall_Order_By = {
  callHash?: InputMaybe<Order_By>;
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacAddress?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastPayer?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recipient?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  treasuryTokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "CapitalCall" */
export type CapitalCall_Select_Column =
  /** column name */
  | 'callHash'
  /** column name */
  | 'cashAmount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'dacAddress'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'fulfilledBlockNumber'
  /** column name */
  | 'fulfillmentCount'
  /** column name */
  | 'id'
  /** column name */
  | 'lastPayer'
  /** column name */
  | 'nonce'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'recipient'
  /** column name */
  | 'tokenAmount'
  /** column name */
  | 'totalFulfilledCashAmount'
  /** column name */
  | 'totalFulfilledTokenAmount'
  /** column name */
  | 'treasuryTokenAddress'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "CapitalCall" */
export type CapitalCall_Stddev_Order_By = {
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "CapitalCall" */
export type CapitalCall_Stddev_Pop_Order_By = {
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "CapitalCall" */
export type CapitalCall_Stddev_Samp_Order_By = {
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "CapitalCall" */
export type CapitalCall_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: CapitalCall_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type CapitalCall_Stream_Cursor_Value_Input = {
  callHash?: InputMaybe<Scalars['String']['input']>;
  cashAmount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  dacAddress?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  fulfilledBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  fulfillmentCount?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lastPayer?: InputMaybe<Scalars['String']['input']>;
  nonce?: InputMaybe<Scalars['numeric']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  recipient?: InputMaybe<Scalars['String']['input']>;
  tokenAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalFulfilledCashAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalFulfilledTokenAmount?: InputMaybe<Scalars['numeric']['input']>;
  treasuryTokenAddress?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "CapitalCall" */
export type CapitalCall_Sum_Order_By = {
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "CapitalCall" */
export type CapitalCall_Var_Pop_Order_By = {
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "CapitalCall" */
export type CapitalCall_Var_Samp_Order_By = {
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "CapitalCall" */
export type CapitalCall_Variance_Order_By = {
  cashAmount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  fulfilledBlockNumber?: InputMaybe<Order_By>;
  fulfillmentCount?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  tokenAmount?: InputMaybe<Order_By>;
  totalFulfilledCashAmount?: InputMaybe<Order_By>;
  totalFulfilledTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "ChildDacDeal" */
export type ChildDacDeal_Aggregate_Order_By = {
  avg?: InputMaybe<ChildDacDeal_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<ChildDacDeal_Max_Order_By>;
  min?: InputMaybe<ChildDacDeal_Min_Order_By>;
  stddev?: InputMaybe<ChildDacDeal_Stddev_Order_By>;
  stddev_pop?: InputMaybe<ChildDacDeal_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<ChildDacDeal_Stddev_Samp_Order_By>;
  sum?: InputMaybe<ChildDacDeal_Sum_Order_By>;
  var_pop?: InputMaybe<ChildDacDeal_Var_Pop_Order_By>;
  var_samp?: InputMaybe<ChildDacDeal_Var_Samp_Order_By>;
  variance?: InputMaybe<ChildDacDeal_Variance_Order_By>;
};

/** order by avg() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ChildDacDeal". All fields are combined with a logical 'AND'. */
export type ChildDacDeal_Bool_Exp = {
  _and?: InputMaybe<Array<ChildDacDeal_Bool_Exp>>;
  _not?: InputMaybe<ChildDacDeal_Bool_Exp>;
  _or?: InputMaybe<Array<ChildDacDeal_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  childAgentTokenAddress?: InputMaybe<String_Comparison_Exp>;
  childDac?: InputMaybe<Dac_Bool_Exp>;
  childDacAddress?: InputMaybe<String_Comparison_Exp>;
  childDacId?: InputMaybe<String_Comparison_Exp>;
  childDac_id?: InputMaybe<String_Comparison_Exp>;
  childMainTokenAddress?: InputMaybe<String_Comparison_Exp>;
  childVotes?: InputMaybe<ChildVote_Bool_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  rootCapitalCallHash?: InputMaybe<String_Comparison_Exp>;
  rootCapitalCallId?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childAgentTokenAddress?: InputMaybe<Order_By>;
  childDacAddress?: InputMaybe<Order_By>;
  childDacId?: InputMaybe<Order_By>;
  childDac_id?: InputMaybe<Order_By>;
  childMainTokenAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  rootCapitalCallHash?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childAgentTokenAddress?: InputMaybe<Order_By>;
  childDacAddress?: InputMaybe<Order_By>;
  childDacId?: InputMaybe<Order_By>;
  childDac_id?: InputMaybe<Order_By>;
  childMainTokenAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  rootCapitalCallHash?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "ChildDacDeal". */
export type ChildDacDeal_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childAgentTokenAddress?: InputMaybe<Order_By>;
  childDac?: InputMaybe<Dac_Order_By>;
  childDacAddress?: InputMaybe<Order_By>;
  childDacId?: InputMaybe<Order_By>;
  childDac_id?: InputMaybe<Order_By>;
  childMainTokenAddress?: InputMaybe<Order_By>;
  childVotes_aggregate?: InputMaybe<ChildVote_Aggregate_Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  rootCapitalCallHash?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "ChildDacDeal" */
export type ChildDacDeal_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'childAgentTokenAddress'
  /** column name */
  | 'childDacAddress'
  /** column name */
  | 'childDacId'
  /** column name */
  | 'childDac_id'
  /** column name */
  | 'childMainTokenAddress'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'rootCapitalCallHash'
  /** column name */
  | 'rootCapitalCallId'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "ChildDacDeal" */
export type ChildDacDeal_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ChildDacDeal_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ChildDacDeal_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  childAgentTokenAddress?: InputMaybe<Scalars['String']['input']>;
  childDacAddress?: InputMaybe<Scalars['String']['input']>;
  childDacId?: InputMaybe<Scalars['String']['input']>;
  childDac_id?: InputMaybe<Scalars['String']['input']>;
  childMainTokenAddress?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  rootCapitalCallHash?: InputMaybe<Scalars['String']['input']>;
  rootCapitalCallId?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  rootCapitalCallId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "ChildVote" */
export type ChildVote_Aggregate_Order_By = {
  avg?: InputMaybe<ChildVote_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<ChildVote_Max_Order_By>;
  min?: InputMaybe<ChildVote_Min_Order_By>;
  stddev?: InputMaybe<ChildVote_Stddev_Order_By>;
  stddev_pop?: InputMaybe<ChildVote_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<ChildVote_Stddev_Samp_Order_By>;
  sum?: InputMaybe<ChildVote_Sum_Order_By>;
  var_pop?: InputMaybe<ChildVote_Var_Pop_Order_By>;
  var_samp?: InputMaybe<ChildVote_Var_Samp_Order_By>;
  variance?: InputMaybe<ChildVote_Variance_Order_By>;
};

/** order by avg() on columns of table "ChildVote" */
export type ChildVote_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ChildVote". All fields are combined with a logical 'AND'. */
export type ChildVote_Bool_Exp = {
  _and?: InputMaybe<Array<ChildVote_Bool_Exp>>;
  _not?: InputMaybe<ChildVote_Bool_Exp>;
  _or?: InputMaybe<Array<ChildVote_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  childDacDeal?: InputMaybe<ChildDacDeal_Bool_Exp>;
  childDacDealId?: InputMaybe<String_Comparison_Exp>;
  childDacDeal_id?: InputMaybe<String_Comparison_Exp>;
  childProposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  eventType?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  parentProposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  support?: InputMaybe<Boolean_Comparison_Exp>;
};

/** order by max() on columns of table "ChildVote" */
export type ChildVote_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childDacDealId?: InputMaybe<Order_By>;
  childDacDeal_id?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  eventType?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "ChildVote" */
export type ChildVote_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childDacDealId?: InputMaybe<Order_By>;
  childDacDeal_id?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  eventType?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "ChildVote". */
export type ChildVote_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childDacDeal?: InputMaybe<ChildDacDeal_Order_By>;
  childDacDealId?: InputMaybe<Order_By>;
  childDacDeal_id?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  eventType?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
  support?: InputMaybe<Order_By>;
};

/** select columns of table "ChildVote" */
export type ChildVote_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'childDacDealId'
  /** column name */
  | 'childDacDeal_id'
  /** column name */
  | 'childProposalNumericId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'eventType'
  /** column name */
  | 'id'
  /** column name */
  | 'parentProposalNumericId'
  /** column name */
  | 'support';

/** order by stddev() on columns of table "ChildVote" */
export type ChildVote_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "ChildVote" */
export type ChildVote_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "ChildVote" */
export type ChildVote_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "ChildVote" */
export type ChildVote_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ChildVote_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ChildVote_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  childDacDealId?: InputMaybe<Scalars['String']['input']>;
  childDacDeal_id?: InputMaybe<Scalars['String']['input']>;
  childProposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  parentProposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  support?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by sum() on columns of table "ChildVote" */
export type ChildVote_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "ChildVote" */
export type ChildVote_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "ChildVote" */
export type ChildVote_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "ChildVote" */
export type ChildVote_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  childProposalNumericId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  parentProposalNumericId?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "ControlledAddress" */
export type ControlledAddress_Aggregate_Order_By = {
  avg?: InputMaybe<ControlledAddress_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<ControlledAddress_Max_Order_By>;
  min?: InputMaybe<ControlledAddress_Min_Order_By>;
  stddev?: InputMaybe<ControlledAddress_Stddev_Order_By>;
  stddev_pop?: InputMaybe<ControlledAddress_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<ControlledAddress_Stddev_Samp_Order_By>;
  sum?: InputMaybe<ControlledAddress_Sum_Order_By>;
  var_pop?: InputMaybe<ControlledAddress_Var_Pop_Order_By>;
  var_samp?: InputMaybe<ControlledAddress_Var_Samp_Order_By>;
  variance?: InputMaybe<ControlledAddress_Variance_Order_By>;
};

/** order by avg() on columns of table "ControlledAddress" */
export type ControlledAddress_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ControlledAddress". All fields are combined with a logical 'AND'. */
export type ControlledAddress_Bool_Exp = {
  _and?: InputMaybe<Array<ControlledAddress_Bool_Exp>>;
  _not?: InputMaybe<ControlledAddress_Bool_Exp>;
  _or?: InputMaybe<Array<ControlledAddress_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  controlType?: InputMaybe<String_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  lockedMainTokenAmount?: InputMaybe<Numeric_Comparison_Exp>;
  roleText?: InputMaybe<String_Comparison_Exp>;
  sourceId?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "ControlledAddress" */
export type ControlledAddress_Max_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  controlType?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  roleText?: InputMaybe<Order_By>;
  sourceId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "ControlledAddress" */
export type ControlledAddress_Min_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  controlType?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  roleText?: InputMaybe<Order_By>;
  sourceId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "ControlledAddress". */
export type ControlledAddress_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  controlType?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  roleText?: InputMaybe<Order_By>;
  sourceId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "ControlledAddress" */
export type ControlledAddress_Select_Column =
  /** column name */
  | 'address'
  /** column name */
  | 'chainId'
  /** column name */
  | 'controlType'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'id'
  /** column name */
  | 'lockedMainTokenAmount'
  /** column name */
  | 'roleText'
  /** column name */
  | 'sourceId'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "ControlledAddress" */
export type ControlledAddress_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "ControlledAddress" */
export type ControlledAddress_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "ControlledAddress" */
export type ControlledAddress_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "ControlledAddress" */
export type ControlledAddress_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ControlledAddress_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ControlledAddress_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  controlType?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lockedMainTokenAmount?: InputMaybe<Scalars['numeric']['input']>;
  roleText?: InputMaybe<Scalars['String']['input']>;
  sourceId?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "ControlledAddress" */
export type ControlledAddress_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "ControlledAddress" */
export type ControlledAddress_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "ControlledAddress" */
export type ControlledAddress_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "ControlledAddress" */
export type ControlledAddress_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lockedMainTokenAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DacAgent" */
export type DacAgent_Aggregate_Order_By = {
  avg?: InputMaybe<DacAgent_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DacAgent_Max_Order_By>;
  min?: InputMaybe<DacAgent_Min_Order_By>;
  stddev?: InputMaybe<DacAgent_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DacAgent_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DacAgent_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DacAgent_Sum_Order_By>;
  var_pop?: InputMaybe<DacAgent_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DacAgent_Var_Samp_Order_By>;
  variance?: InputMaybe<DacAgent_Variance_Order_By>;
};

/** order by avg() on columns of table "DacAgent" */
export type DacAgent_Avg_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DacAgent". All fields are combined with a logical 'AND'. */
export type DacAgent_Bool_Exp = {
  _and?: InputMaybe<Array<DacAgent_Bool_Exp>>;
  _not?: InputMaybe<DacAgent_Bool_Exp>;
  _or?: InputMaybe<Array<DacAgent_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<String_Comparison_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  actions?: InputMaybe<AgentAction_Bool_Exp>;
  activeDealCount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  currentStakedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  hasQualifiedAgentBalance?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  isActive?: InputMaybe<Boolean_Comparison_Exp>;
  isDistributor?: InputMaybe<Boolean_Comparison_Exp>;
  lastActivityBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  positions?: InputMaybe<DealAgentPosition_Bool_Exp>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalClaimedMainTokenAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalMintedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalReleasedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalRevokedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalSlashedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalStakedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  walletAgentTokenAmount?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DacAgent" */
export type DacAgent_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DacAgent" */
export type DacAgent_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DacAgent". */
export type DacAgent_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  actions_aggregate?: InputMaybe<AgentAction_Aggregate_Order_By>;
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  hasQualifiedAgentBalance?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isActive?: InputMaybe<Order_By>;
  isDistributor?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  positions_aggregate?: InputMaybe<DealAgentPosition_Aggregate_Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** select columns of table "DacAgent" */
export type DacAgent_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'account_id'
  /** column name */
  | 'activeDealCount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'currentStakedAmount'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'hasQualifiedAgentBalance'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isDistributor'
  /** column name */
  | 'lastActivityBlockNumber'
  /** column name */
  | 'qualifiedWalletAgentTokenAmount'
  /** column name */
  | 'totalClaimedMainTokenAmount'
  /** column name */
  | 'totalMintedAmount'
  /** column name */
  | 'totalReleasedAmount'
  /** column name */
  | 'totalRevokedAmount'
  /** column name */
  | 'totalSlashedAmount'
  /** column name */
  | 'totalStakedAmount'
  /** column name */
  | 'updatedBlockNumber'
  /** column name */
  | 'walletAgentTokenAmount';

/** order by stddev() on columns of table "DacAgent" */
export type DacAgent_Stddev_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DacAgent" */
export type DacAgent_Stddev_Pop_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DacAgent" */
export type DacAgent_Stddev_Samp_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DacAgent" */
export type DacAgent_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DacAgent_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DacAgent_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  activeDealCount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  currentStakedAmount?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  hasQualifiedAgentBalance?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isDistributor?: InputMaybe<Scalars['Boolean']['input']>;
  lastActivityBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalClaimedMainTokenAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalMintedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalReleasedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalRevokedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalSlashedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalStakedAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  walletAgentTokenAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DacAgent" */
export type DacAgent_Sum_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DacAgent" */
export type DacAgent_Var_Pop_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DacAgent" */
export type DacAgent_Var_Samp_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DacAgent" */
export type DacAgent_Variance_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  qualifiedWalletAgentTokenAmount?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DacConfigChange" */
export type DacConfigChange_Aggregate_Order_By = {
  avg?: InputMaybe<DacConfigChange_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DacConfigChange_Max_Order_By>;
  min?: InputMaybe<DacConfigChange_Min_Order_By>;
  stddev?: InputMaybe<DacConfigChange_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DacConfigChange_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DacConfigChange_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DacConfigChange_Sum_Order_By>;
  var_pop?: InputMaybe<DacConfigChange_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DacConfigChange_Var_Samp_Order_By>;
  variance?: InputMaybe<DacConfigChange_Variance_Order_By>;
};

/** order by avg() on columns of table "DacConfigChange" */
export type DacConfigChange_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DacConfigChange". All fields are combined with a logical 'AND'. */
export type DacConfigChange_Bool_Exp = {
  _and?: InputMaybe<Array<DacConfigChange_Bool_Exp>>;
  _not?: InputMaybe<DacConfigChange_Bool_Exp>;
  _or?: InputMaybe<Array<DacConfigChange_Bool_Exp>>;
  blockingOnAllProposals?: InputMaybe<Boolean_Comparison_Exp>;
  blockingOnHighQuorum?: InputMaybe<Boolean_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  changeType?: InputMaybe<String_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  dealCreationMinAgentBalance?: InputMaybe<Numeric_Comparison_Exp>;
  dealCreationMinInitialAgentStake?: InputMaybe<Numeric_Comparison_Exp>;
  dividendsEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  executionValidityDuration?: InputMaybe<Numeric_Comparison_Exp>;
  fallbackDuration?: InputMaybe<Numeric_Comparison_Exp>;
  fallbackWarmupDuration?: InputMaybe<Numeric_Comparison_Exp>;
  governanceOracleAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  oraclePrimaryEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  oraclePublishDeadline?: InputMaybe<Numeric_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  votingBlockingPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingDuration?: InputMaybe<Numeric_Comparison_Exp>;
  votingHighQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingQualification?: InputMaybe<Numeric_Comparison_Exp>;
  votingQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DacConfigChange" */
export type DacConfigChange_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  changeType?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  governanceOracleAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DacConfigChange" */
export type DacConfigChange_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  changeType?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  governanceOracleAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DacConfigChange". */
export type DacConfigChange_Order_By = {
  blockingOnAllProposals?: InputMaybe<Order_By>;
  blockingOnHighQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  changeType?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  dividendsEnabled?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  governanceOracleAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  oraclePrimaryEnabled?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** select columns of table "DacConfigChange" */
export type DacConfigChange_Select_Column =
  /** column name */
  | 'blockingOnAllProposals'
  /** column name */
  | 'blockingOnHighQuorum'
  /** column name */
  | 'chainId'
  /** column name */
  | 'changeType'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealCreationMinAgentBalance'
  /** column name */
  | 'dealCreationMinInitialAgentStake'
  /** column name */
  | 'dividendsEnabled'
  /** column name */
  | 'executionValidityDuration'
  /** column name */
  | 'fallbackDuration'
  /** column name */
  | 'fallbackWarmupDuration'
  /** column name */
  | 'governanceOracleAddress'
  /** column name */
  | 'id'
  /** column name */
  | 'oraclePrimaryEnabled'
  /** column name */
  | 'oraclePublishDeadline'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'votingBlockingPercent'
  /** column name */
  | 'votingDuration'
  /** column name */
  | 'votingHighQuorumPercent'
  /** column name */
  | 'votingQualification'
  /** column name */
  | 'votingQuorumPercent';

/** order by stddev() on columns of table "DacConfigChange" */
export type DacConfigChange_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DacConfigChange" */
export type DacConfigChange_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DacConfigChange" */
export type DacConfigChange_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DacConfigChange" */
export type DacConfigChange_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DacConfigChange_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DacConfigChange_Stream_Cursor_Value_Input = {
  blockingOnAllProposals?: InputMaybe<Scalars['Boolean']['input']>;
  blockingOnHighQuorum?: InputMaybe<Scalars['Boolean']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  changeType?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealCreationMinAgentBalance?: InputMaybe<Scalars['numeric']['input']>;
  dealCreationMinInitialAgentStake?: InputMaybe<Scalars['numeric']['input']>;
  dividendsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  executionValidityDuration?: InputMaybe<Scalars['numeric']['input']>;
  fallbackDuration?: InputMaybe<Scalars['numeric']['input']>;
  fallbackWarmupDuration?: InputMaybe<Scalars['numeric']['input']>;
  governanceOracleAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  oraclePrimaryEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  oraclePublishDeadline?: InputMaybe<Scalars['numeric']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  votingBlockingPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingDuration?: InputMaybe<Scalars['numeric']['input']>;
  votingHighQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingQualification?: InputMaybe<Scalars['numeric']['input']>;
  votingQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DacConfigChange" */
export type DacConfigChange_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DacConfigChange" */
export type DacConfigChange_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DacConfigChange" */
export type DacConfigChange_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DacConfigChange" */
export type DacConfigChange_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Aggregate_Order_By = {
  avg?: InputMaybe<DacGovernanceAccount_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DacGovernanceAccount_Max_Order_By>;
  min?: InputMaybe<DacGovernanceAccount_Min_Order_By>;
  stddev?: InputMaybe<DacGovernanceAccount_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DacGovernanceAccount_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DacGovernanceAccount_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DacGovernanceAccount_Sum_Order_By>;
  var_pop?: InputMaybe<DacGovernanceAccount_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DacGovernanceAccount_Var_Samp_Order_By>;
  variance?: InputMaybe<DacGovernanceAccount_Variance_Order_By>;
};

/** order by avg() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DacGovernanceAccount". All fields are combined with a logical 'AND'. */
export type DacGovernanceAccount_Bool_Exp = {
  _and?: InputMaybe<Array<DacGovernanceAccount_Bool_Exp>>;
  _not?: InputMaybe<DacGovernanceAccount_Bool_Exp>;
  _or?: InputMaybe<Array<DacGovernanceAccount_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<String_Comparison_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  currentVotingPower?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  delegateAddress?: InputMaybe<String_Comparison_Exp>;
  hasVotingPower?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  delegateAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  delegateAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DacGovernanceAccount". */
export type DacGovernanceAccount_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  delegateAddress?: InputMaybe<Order_By>;
  hasVotingPower?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'account_id'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'currentVotingPower'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'delegateAddress'
  /** column name */
  | 'hasVotingPower'
  /** column name */
  | 'id'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DacGovernanceAccount" */
export type DacGovernanceAccount_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DacGovernanceAccount_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DacGovernanceAccount_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  currentVotingPower?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  delegateAddress?: InputMaybe<Scalars['String']['input']>;
  hasVotingPower?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DacGovernanceAccount" */
export type DacGovernanceAccount_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Aggregate_Order_By = {
  avg?: InputMaybe<DacLegalWrapperMessage_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DacLegalWrapperMessage_Max_Order_By>;
  min?: InputMaybe<DacLegalWrapperMessage_Min_Order_By>;
  stddev?: InputMaybe<DacLegalWrapperMessage_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DacLegalWrapperMessage_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DacLegalWrapperMessage_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DacLegalWrapperMessage_Sum_Order_By>;
  var_pop?: InputMaybe<DacLegalWrapperMessage_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DacLegalWrapperMessage_Var_Samp_Order_By>;
  variance?: InputMaybe<DacLegalWrapperMessage_Variance_Order_By>;
};

/** order by avg() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DacLegalWrapperMessage". All fields are combined with a logical 'AND'. */
export type DacLegalWrapperMessage_Bool_Exp = {
  _and?: InputMaybe<Array<DacLegalWrapperMessage_Bool_Exp>>;
  _not?: InputMaybe<DacLegalWrapperMessage_Bool_Exp>;
  _or?: InputMaybe<Array<DacLegalWrapperMessage_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  message?: InputMaybe<String_Comparison_Exp>;
  messageKind?: InputMaybe<String_Comparison_Exp>;
  wrapperAddress?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  messageKind?: InputMaybe<Order_By>;
  wrapperAddress?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  messageKind?: InputMaybe<Order_By>;
  wrapperAddress?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DacLegalWrapperMessage". */
export type DacLegalWrapperMessage_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  messageKind?: InputMaybe<Order_By>;
  wrapperAddress?: InputMaybe<Order_By>;
};

/** select columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'id'
  /** column name */
  | 'message'
  /** column name */
  | 'messageKind'
  /** column name */
  | 'wrapperAddress';

/** order by stddev() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DacLegalWrapperMessage_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DacLegalWrapperMessage_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  messageKind?: InputMaybe<Scalars['String']['input']>;
  wrapperAddress?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DacLegalWrapperMessage" */
export type DacLegalWrapperMessage_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Aggregate_Order_By = {
  avg?: InputMaybe<DacLegalWrapperState_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DacLegalWrapperState_Max_Order_By>;
  min?: InputMaybe<DacLegalWrapperState_Min_Order_By>;
  stddev?: InputMaybe<DacLegalWrapperState_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DacLegalWrapperState_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DacLegalWrapperState_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DacLegalWrapperState_Sum_Order_By>;
  var_pop?: InputMaybe<DacLegalWrapperState_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DacLegalWrapperState_Var_Samp_Order_By>;
  variance?: InputMaybe<DacLegalWrapperState_Variance_Order_By>;
};

/** order by avg() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DacLegalWrapperState". All fields are combined with a logical 'AND'. */
export type DacLegalWrapperState_Bool_Exp = {
  _and?: InputMaybe<Array<DacLegalWrapperState_Bool_Exp>>;
  _not?: InputMaybe<DacLegalWrapperState_Bool_Exp>;
  _or?: InputMaybe<Array<DacLegalWrapperState_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  data?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  operatingAgreementIpfs?: InputMaybe<String_Comparison_Exp>;
  registeredAgent?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  wrapperAddress?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  operatingAgreementIpfs?: InputMaybe<Order_By>;
  registeredAgent?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
  wrapperAddress?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  operatingAgreementIpfs?: InputMaybe<Order_By>;
  registeredAgent?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
  wrapperAddress?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DacLegalWrapperState". */
export type DacLegalWrapperState_Order_By = {
  chainId?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  operatingAgreementIpfs?: InputMaybe<Order_By>;
  registeredAgent?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
  wrapperAddress?: InputMaybe<Order_By>;
};

/** select columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'data'
  /** column name */
  | 'id'
  /** column name */
  | 'operatingAgreementIpfs'
  /** column name */
  | 'registeredAgent'
  /** column name */
  | 'updatedBlockNumber'
  /** column name */
  | 'updatedBlockTimestamp'
  /** column name */
  | 'wrapperAddress';

/** order by stddev() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DacLegalWrapperState" */
export type DacLegalWrapperState_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DacLegalWrapperState_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DacLegalWrapperState_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  operatingAgreementIpfs?: InputMaybe<Scalars['String']['input']>;
  registeredAgent?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  wrapperAddress?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DacLegalWrapperState" */
export type DacLegalWrapperState_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DacModule" */
export type DacModule_Aggregate_Order_By = {
  avg?: InputMaybe<DacModule_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DacModule_Max_Order_By>;
  min?: InputMaybe<DacModule_Min_Order_By>;
  stddev?: InputMaybe<DacModule_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DacModule_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DacModule_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DacModule_Sum_Order_By>;
  var_pop?: InputMaybe<DacModule_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DacModule_Var_Samp_Order_By>;
  variance?: InputMaybe<DacModule_Variance_Order_By>;
};

/** order by avg() on columns of table "DacModule" */
export type DacModule_Avg_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DacModule". All fields are combined with a logical 'AND'. */
export type DacModule_Bool_Exp = {
  _and?: InputMaybe<Array<DacModule_Bool_Exp>>;
  _not?: InputMaybe<DacModule_Bool_Exp>;
  _or?: InputMaybe<Array<DacModule_Bool_Exp>>;
  addedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  approved?: InputMaybe<Boolean_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  factory?: InputMaybe<ModuleFactory_Bool_Exp>;
  factoryId?: InputMaybe<String_Comparison_Exp>;
  factory_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  isCore?: InputMaybe<Boolean_Comparison_Exp>;
  removedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DacModule" */
export type DacModule_Max_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  factoryId?: InputMaybe<Order_By>;
  factory_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DacModule" */
export type DacModule_Min_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  factoryId?: InputMaybe<Order_By>;
  factory_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DacModule". */
export type DacModule_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  approved?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  factory?: InputMaybe<ModuleFactory_Order_By>;
  factoryId?: InputMaybe<Order_By>;
  factory_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isCore?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "DacModule" */
export type DacModule_Select_Column =
  /** column name */
  | 'addedBlockNumber'
  /** column name */
  | 'approved'
  /** column name */
  | 'chainId'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'factoryId'
  /** column name */
  | 'factory_id'
  /** column name */
  | 'id'
  /** column name */
  | 'isCore'
  /** column name */
  | 'removedBlockNumber'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "DacModule" */
export type DacModule_Stddev_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DacModule" */
export type DacModule_Stddev_Pop_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DacModule" */
export type DacModule_Stddev_Samp_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DacModule" */
export type DacModule_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DacModule_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DacModule_Stream_Cursor_Value_Input = {
  addedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  factoryId?: InputMaybe<Scalars['String']['input']>;
  factory_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isCore?: InputMaybe<Scalars['Boolean']['input']>;
  removedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DacModule" */
export type DacModule_Sum_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DacModule" */
export type DacModule_Var_Pop_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DacModule" */
export type DacModule_Var_Samp_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DacModule" */
export type DacModule_Variance_Order_By = {
  addedBlockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  removedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DacProposal" */
export type DacProposal_Aggregate_Order_By = {
  avg?: InputMaybe<DacProposal_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DacProposal_Max_Order_By>;
  min?: InputMaybe<DacProposal_Min_Order_By>;
  stddev?: InputMaybe<DacProposal_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DacProposal_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DacProposal_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DacProposal_Sum_Order_By>;
  var_pop?: InputMaybe<DacProposal_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DacProposal_Var_Samp_Order_By>;
  variance?: InputMaybe<DacProposal_Variance_Order_By>;
};

/** order by avg() on columns of table "DacProposal" */
export type DacProposal_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DacProposal". All fields are combined with a logical 'AND'. */
export type DacProposal_Bool_Exp = {
  _and?: InputMaybe<Array<DacProposal_Bool_Exp>>;
  _not?: InputMaybe<DacProposal_Bool_Exp>;
  _or?: InputMaybe<Array<DacProposal_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  challengedDeals?: InputMaybe<DealProposalChallenge_Bool_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  governanceType?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  merkleVotes?: InputMaybe<MerkleVote_Bool_Exp>;
  oracleSnapshots?: InputMaybe<OracleSnapshot_Bool_Exp>;
  phaseEvents?: InputMaybe<ProposalPhaseEvent_Bool_Exp>;
  proposal?: InputMaybe<Proposal_Bool_Exp>;
  proposalId?: InputMaybe<String_Comparison_Exp>;
  proposal_id?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "DacProposal" */
export type DacProposal_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  governanceType?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DacProposal" */
export type DacProposal_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  governanceType?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DacProposal". */
export type DacProposal_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengedDeals_aggregate?: InputMaybe<DealProposalChallenge_Aggregate_Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  governanceType?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleVotes_aggregate?: InputMaybe<MerkleVote_Aggregate_Order_By>;
  oracleSnapshots_aggregate?: InputMaybe<OracleSnapshot_Aggregate_Order_By>;
  phaseEvents_aggregate?: InputMaybe<ProposalPhaseEvent_Aggregate_Order_By>;
  proposal?: InputMaybe<Proposal_Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
};

/** select columns of table "DacProposal" */
export type DacProposal_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'governanceType'
  /** column name */
  | 'id'
  /** column name */
  | 'proposalId'
  /** column name */
  | 'proposal_id';

/** order by stddev() on columns of table "DacProposal" */
export type DacProposal_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DacProposal" */
export type DacProposal_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DacProposal" */
export type DacProposal_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DacProposal" */
export type DacProposal_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DacProposal_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DacProposal_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  governanceType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  proposalId?: InputMaybe<Scalars['String']['input']>;
  proposal_id?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "DacProposal" */
export type DacProposal_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DacProposal" */
export type DacProposal_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DacProposal" */
export type DacProposal_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DacProposal" */
export type DacProposal_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Aggregate_Order_By = {
  avg?: InputMaybe<DacTreasuryDelegation_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DacTreasuryDelegation_Max_Order_By>;
  min?: InputMaybe<DacTreasuryDelegation_Min_Order_By>;
  stddev?: InputMaybe<DacTreasuryDelegation_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DacTreasuryDelegation_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DacTreasuryDelegation_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DacTreasuryDelegation_Sum_Order_By>;
  var_pop?: InputMaybe<DacTreasuryDelegation_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DacTreasuryDelegation_Var_Samp_Order_By>;
  variance?: InputMaybe<DacTreasuryDelegation_Variance_Order_By>;
};

/** order by avg() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DacTreasuryDelegation". All fields are combined with a logical 'AND'. */
export type DacTreasuryDelegation_Bool_Exp = {
  _and?: InputMaybe<Array<DacTreasuryDelegation_Bool_Exp>>;
  _not?: InputMaybe<DacTreasuryDelegation_Bool_Exp>;
  _or?: InputMaybe<Array<DacTreasuryDelegation_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  assetControllerAddress?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  delegatedTokenAddress?: InputMaybe<String_Comparison_Exp>;
  delegateeAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  treasuryHolderAddress?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Max_Order_By = {
  assetControllerAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  delegatedTokenAddress?: InputMaybe<Order_By>;
  delegateeAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  treasuryHolderAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Min_Order_By = {
  assetControllerAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  delegatedTokenAddress?: InputMaybe<Order_By>;
  delegateeAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  treasuryHolderAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DacTreasuryDelegation". */
export type DacTreasuryDelegation_Order_By = {
  active?: InputMaybe<Order_By>;
  assetControllerAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  delegatedTokenAddress?: InputMaybe<Order_By>;
  delegateeAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  treasuryHolderAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Select_Column =
  /** column name */
  | 'active'
  /** column name */
  | 'assetControllerAddress'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'delegatedTokenAddress'
  /** column name */
  | 'delegateeAddress'
  /** column name */
  | 'id'
  /** column name */
  | 'treasuryHolderAddress'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DacTreasuryDelegation_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DacTreasuryDelegation_Stream_Cursor_Value_Input = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  assetControllerAddress?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  delegatedTokenAddress?: InputMaybe<Scalars['String']['input']>;
  delegateeAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  treasuryHolderAddress?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DacTreasuryDelegation" */
export type DacTreasuryDelegation_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Dac". All fields are combined with a logical 'AND'. */
export type Dac_Bool_Exp = {
  _and?: InputMaybe<Array<Dac_Bool_Exp>>;
  _not?: InputMaybe<Dac_Bool_Exp>;
  _or?: InputMaybe<Array<Dac_Bool_Exp>>;
  activeDealCount?: InputMaybe<Numeric_Comparison_Exp>;
  address?: InputMaybe<String_Comparison_Exp>;
  agentDistributions?: InputMaybe<AgentDistribution_Bool_Exp>;
  agentDistributors?: InputMaybe<AgentDistributor_Bool_Exp>;
  agentTokenAddress?: InputMaybe<String_Comparison_Exp>;
  agents?: InputMaybe<DacAgent_Bool_Exp>;
  assetControllerAddress?: InputMaybe<String_Comparison_Exp>;
  blockingOnAllProposals?: InputMaybe<Boolean_Comparison_Exp>;
  blockingOnHighQuorum?: InputMaybe<Boolean_Comparison_Exp>;
  capitalCallCount?: InputMaybe<Numeric_Comparison_Exp>;
  capitalCalls?: InputMaybe<CapitalCall_Bool_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  configChanges?: InputMaybe<DacConfigChange_Bool_Exp>;
  controlledAddresses?: InputMaybe<ControlledAddress_Bool_Exp>;
  coreModuleFactoryAddress?: InputMaybe<String_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  creator?: InputMaybe<String_Comparison_Exp>;
  dacProposals?: InputMaybe<DacProposal_Bool_Exp>;
  dealCount?: InputMaybe<Numeric_Comparison_Exp>;
  dealCreationMinAgentBalance?: InputMaybe<Numeric_Comparison_Exp>;
  dealCreationMinInitialAgentStake?: InputMaybe<Numeric_Comparison_Exp>;
  dealManagerAddress?: InputMaybe<String_Comparison_Exp>;
  deals?: InputMaybe<Deal_Bool_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  dividendPayouts?: InputMaybe<DividendPayout_Bool_Exp>;
  dividendsEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  executedProposalCount?: InputMaybe<Numeric_Comparison_Exp>;
  executionValidityDuration?: InputMaybe<Numeric_Comparison_Exp>;
  fallbackDuration?: InputMaybe<Numeric_Comparison_Exp>;
  fallbackWarmupDuration?: InputMaybe<Numeric_Comparison_Exp>;
  governanceAccounts?: InputMaybe<DacGovernanceAccount_Bool_Exp>;
  governanceOracleAddress?: InputMaybe<String_Comparison_Exp>;
  governanceOracles?: InputMaybe<GovernanceOracle_Bool_Exp>;
  governanceSchemaAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  legalWrapperAddress?: InputMaybe<String_Comparison_Exp>;
  legalWrapperData?: InputMaybe<String_Comparison_Exp>;
  legalWrapperMessages?: InputMaybe<DacLegalWrapperMessage_Bool_Exp>;
  legalWrapperOperatingAgreementIpfs?: InputMaybe<String_Comparison_Exp>;
  legalWrapperRegisteredAgent?: InputMaybe<String_Comparison_Exp>;
  legalWrapperStates?: InputMaybe<DacLegalWrapperState_Bool_Exp>;
  mainTokenAddress?: InputMaybe<String_Comparison_Exp>;
  mainTokenHolderCount?: InputMaybe<Numeric_Comparison_Exp>;
  mainTokenHolders?: InputMaybe<MainTokenHolder_Bool_Exp>;
  mainTokenObligations?: InputMaybe<Numeric_Comparison_Exp>;
  mode?: InputMaybe<String_Comparison_Exp>;
  moduleCount?: InputMaybe<Numeric_Comparison_Exp>;
  moduleRegistryAddress?: InputMaybe<String_Comparison_Exp>;
  modules?: InputMaybe<DacModule_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  offchainActionApprovals?: InputMaybe<OffchainActionApproval_Bool_Exp>;
  oraclePrimaryEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  oraclePublishDeadline?: InputMaybe<Numeric_Comparison_Exp>;
  proposalCount?: InputMaybe<Numeric_Comparison_Exp>;
  proposals?: InputMaybe<Proposal_Bool_Exp>;
  releasedMainTokenAmount?: InputMaybe<Numeric_Comparison_Exp>;
  salt?: InputMaybe<String_Comparison_Exp>;
  started?: InputMaybe<Boolean_Comparison_Exp>;
  supportsBurn?: InputMaybe<Boolean_Comparison_Exp>;
  supportsCapitalCall?: InputMaybe<Boolean_Comparison_Exp>;
  supportsMint?: InputMaybe<Boolean_Comparison_Exp>;
  supportsReserveBackedClaims?: InputMaybe<Boolean_Comparison_Exp>;
  supportsUnwrap?: InputMaybe<Boolean_Comparison_Exp>;
  supportsWrap?: InputMaybe<Boolean_Comparison_Exp>;
  treasuryDelegations?: InputMaybe<DacTreasuryDelegation_Bool_Exp>;
  treasuryHolderAddress?: InputMaybe<String_Comparison_Exp>;
  treasuryHoldings?: InputMaybe<TreasuryHolding_Bool_Exp>;
  treasurySeedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  underlyingTokenAddress?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  votingBlockingPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingDuration?: InputMaybe<Numeric_Comparison_Exp>;
  votingHighQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingQualification?: InputMaybe<Numeric_Comparison_Exp>;
  votingQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
  wrappedMainTokenAddress?: InputMaybe<String_Comparison_Exp>;
  wrapperActions?: InputMaybe<WrapperAction_Bool_Exp>;
};

/** Ordering options when selecting data from "Dac". */
export type Dac_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  agentDistributions_aggregate?: InputMaybe<AgentDistribution_Aggregate_Order_By>;
  agentDistributors_aggregate?: InputMaybe<AgentDistributor_Aggregate_Order_By>;
  agentTokenAddress?: InputMaybe<Order_By>;
  agents_aggregate?: InputMaybe<DacAgent_Aggregate_Order_By>;
  assetControllerAddress?: InputMaybe<Order_By>;
  blockingOnAllProposals?: InputMaybe<Order_By>;
  blockingOnHighQuorum?: InputMaybe<Order_By>;
  capitalCallCount?: InputMaybe<Order_By>;
  capitalCalls_aggregate?: InputMaybe<CapitalCall_Aggregate_Order_By>;
  chainId?: InputMaybe<Order_By>;
  configChanges_aggregate?: InputMaybe<DacConfigChange_Aggregate_Order_By>;
  controlledAddresses_aggregate?: InputMaybe<ControlledAddress_Aggregate_Order_By>;
  coreModuleFactoryAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  creator?: InputMaybe<Order_By>;
  dacProposals_aggregate?: InputMaybe<DacProposal_Aggregate_Order_By>;
  dealCount?: InputMaybe<Order_By>;
  dealCreationMinAgentBalance?: InputMaybe<Order_By>;
  dealCreationMinInitialAgentStake?: InputMaybe<Order_By>;
  dealManagerAddress?: InputMaybe<Order_By>;
  deals_aggregate?: InputMaybe<Deal_Aggregate_Order_By>;
  description?: InputMaybe<Order_By>;
  dividendPayouts_aggregate?: InputMaybe<DividendPayout_Aggregate_Order_By>;
  dividendsEnabled?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fallbackDuration?: InputMaybe<Order_By>;
  fallbackWarmupDuration?: InputMaybe<Order_By>;
  governanceAccounts_aggregate?: InputMaybe<DacGovernanceAccount_Aggregate_Order_By>;
  governanceOracleAddress?: InputMaybe<Order_By>;
  governanceOracles_aggregate?: InputMaybe<GovernanceOracle_Aggregate_Order_By>;
  governanceSchemaAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  legalWrapperAddress?: InputMaybe<Order_By>;
  legalWrapperData?: InputMaybe<Order_By>;
  legalWrapperMessages_aggregate?: InputMaybe<DacLegalWrapperMessage_Aggregate_Order_By>;
  legalWrapperOperatingAgreementIpfs?: InputMaybe<Order_By>;
  legalWrapperRegisteredAgent?: InputMaybe<Order_By>;
  legalWrapperStates_aggregate?: InputMaybe<DacLegalWrapperState_Aggregate_Order_By>;
  mainTokenAddress?: InputMaybe<Order_By>;
  mainTokenHolderCount?: InputMaybe<Order_By>;
  mainTokenHolders_aggregate?: InputMaybe<MainTokenHolder_Aggregate_Order_By>;
  mainTokenObligations?: InputMaybe<Order_By>;
  mode?: InputMaybe<Order_By>;
  moduleCount?: InputMaybe<Order_By>;
  moduleRegistryAddress?: InputMaybe<Order_By>;
  modules_aggregate?: InputMaybe<DacModule_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  offchainActionApprovals_aggregate?: InputMaybe<OffchainActionApproval_Aggregate_Order_By>;
  oraclePrimaryEnabled?: InputMaybe<Order_By>;
  oraclePublishDeadline?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposals_aggregate?: InputMaybe<Proposal_Aggregate_Order_By>;
  releasedMainTokenAmount?: InputMaybe<Order_By>;
  salt?: InputMaybe<Order_By>;
  started?: InputMaybe<Order_By>;
  supportsBurn?: InputMaybe<Order_By>;
  supportsCapitalCall?: InputMaybe<Order_By>;
  supportsMint?: InputMaybe<Order_By>;
  supportsReserveBackedClaims?: InputMaybe<Order_By>;
  supportsUnwrap?: InputMaybe<Order_By>;
  supportsWrap?: InputMaybe<Order_By>;
  treasuryDelegations_aggregate?: InputMaybe<DacTreasuryDelegation_Aggregate_Order_By>;
  treasuryHolderAddress?: InputMaybe<Order_By>;
  treasuryHoldings_aggregate?: InputMaybe<TreasuryHolding_Aggregate_Order_By>;
  treasurySeedAmount?: InputMaybe<Order_By>;
  underlyingTokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
  wrappedMainTokenAddress?: InputMaybe<Order_By>;
  wrapperActions_aggregate?: InputMaybe<WrapperAction_Aggregate_Order_By>;
};

/** select columns of table "Dac" */
export type Dac_Select_Column =
  /** column name */
  | 'activeDealCount'
  /** column name */
  | 'address'
  /** column name */
  | 'agentTokenAddress'
  /** column name */
  | 'assetControllerAddress'
  /** column name */
  | 'blockingOnAllProposals'
  /** column name */
  | 'blockingOnHighQuorum'
  /** column name */
  | 'capitalCallCount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'coreModuleFactoryAddress'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'creator'
  /** column name */
  | 'dealCount'
  /** column name */
  | 'dealCreationMinAgentBalance'
  /** column name */
  | 'dealCreationMinInitialAgentStake'
  /** column name */
  | 'dealManagerAddress'
  /** column name */
  | 'description'
  /** column name */
  | 'dividendsEnabled'
  /** column name */
  | 'executedProposalCount'
  /** column name */
  | 'executionValidityDuration'
  /** column name */
  | 'fallbackDuration'
  /** column name */
  | 'fallbackWarmupDuration'
  /** column name */
  | 'governanceOracleAddress'
  /** column name */
  | 'governanceSchemaAddress'
  /** column name */
  | 'id'
  /** column name */
  | 'legalWrapperAddress'
  /** column name */
  | 'legalWrapperData'
  /** column name */
  | 'legalWrapperOperatingAgreementIpfs'
  /** column name */
  | 'legalWrapperRegisteredAgent'
  /** column name */
  | 'mainTokenAddress'
  /** column name */
  | 'mainTokenHolderCount'
  /** column name */
  | 'mainTokenObligations'
  /** column name */
  | 'mode'
  /** column name */
  | 'moduleCount'
  /** column name */
  | 'moduleRegistryAddress'
  /** column name */
  | 'name'
  /** column name */
  | 'oraclePrimaryEnabled'
  /** column name */
  | 'oraclePublishDeadline'
  /** column name */
  | 'proposalCount'
  /** column name */
  | 'releasedMainTokenAmount'
  /** column name */
  | 'salt'
  /** column name */
  | 'started'
  /** column name */
  | 'supportsBurn'
  /** column name */
  | 'supportsCapitalCall'
  /** column name */
  | 'supportsMint'
  /** column name */
  | 'supportsReserveBackedClaims'
  /** column name */
  | 'supportsUnwrap'
  /** column name */
  | 'supportsWrap'
  /** column name */
  | 'treasuryHolderAddress'
  /** column name */
  | 'treasurySeedAmount'
  /** column name */
  | 'underlyingTokenAddress'
  /** column name */
  | 'updatedBlockNumber'
  /** column name */
  | 'updatedBlockTimestamp'
  /** column name */
  | 'votingBlockingPercent'
  /** column name */
  | 'votingDuration'
  /** column name */
  | 'votingHighQuorumPercent'
  /** column name */
  | 'votingQualification'
  /** column name */
  | 'votingQuorumPercent'
  /** column name */
  | 'wrappedMainTokenAddress';

/** Streaming cursor of the table "Dac" */
export type Dac_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dac_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dac_Stream_Cursor_Value_Input = {
  activeDealCount?: InputMaybe<Scalars['numeric']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  agentTokenAddress?: InputMaybe<Scalars['String']['input']>;
  assetControllerAddress?: InputMaybe<Scalars['String']['input']>;
  blockingOnAllProposals?: InputMaybe<Scalars['Boolean']['input']>;
  blockingOnHighQuorum?: InputMaybe<Scalars['Boolean']['input']>;
  capitalCallCount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  coreModuleFactoryAddress?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  creator?: InputMaybe<Scalars['String']['input']>;
  dealCount?: InputMaybe<Scalars['numeric']['input']>;
  dealCreationMinAgentBalance?: InputMaybe<Scalars['numeric']['input']>;
  dealCreationMinInitialAgentStake?: InputMaybe<Scalars['numeric']['input']>;
  dealManagerAddress?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dividendsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  executedProposalCount?: InputMaybe<Scalars['numeric']['input']>;
  executionValidityDuration?: InputMaybe<Scalars['numeric']['input']>;
  fallbackDuration?: InputMaybe<Scalars['numeric']['input']>;
  fallbackWarmupDuration?: InputMaybe<Scalars['numeric']['input']>;
  governanceOracleAddress?: InputMaybe<Scalars['String']['input']>;
  governanceSchemaAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  legalWrapperAddress?: InputMaybe<Scalars['String']['input']>;
  legalWrapperData?: InputMaybe<Scalars['String']['input']>;
  legalWrapperOperatingAgreementIpfs?: InputMaybe<Scalars['String']['input']>;
  legalWrapperRegisteredAgent?: InputMaybe<Scalars['String']['input']>;
  mainTokenAddress?: InputMaybe<Scalars['String']['input']>;
  mainTokenHolderCount?: InputMaybe<Scalars['numeric']['input']>;
  mainTokenObligations?: InputMaybe<Scalars['numeric']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  moduleCount?: InputMaybe<Scalars['numeric']['input']>;
  moduleRegistryAddress?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oraclePrimaryEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  oraclePublishDeadline?: InputMaybe<Scalars['numeric']['input']>;
  proposalCount?: InputMaybe<Scalars['numeric']['input']>;
  releasedMainTokenAmount?: InputMaybe<Scalars['numeric']['input']>;
  salt?: InputMaybe<Scalars['String']['input']>;
  started?: InputMaybe<Scalars['Boolean']['input']>;
  supportsBurn?: InputMaybe<Scalars['Boolean']['input']>;
  supportsCapitalCall?: InputMaybe<Scalars['Boolean']['input']>;
  supportsMint?: InputMaybe<Scalars['Boolean']['input']>;
  supportsReserveBackedClaims?: InputMaybe<Scalars['Boolean']['input']>;
  supportsUnwrap?: InputMaybe<Scalars['Boolean']['input']>;
  supportsWrap?: InputMaybe<Scalars['Boolean']['input']>;
  treasuryHolderAddress?: InputMaybe<Scalars['String']['input']>;
  treasurySeedAmount?: InputMaybe<Scalars['numeric']['input']>;
  underlyingTokenAddress?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  votingBlockingPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingDuration?: InputMaybe<Scalars['numeric']['input']>;
  votingHighQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingQualification?: InputMaybe<Scalars['numeric']['input']>;
  votingQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
  wrappedMainTokenAddress?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "DealAddressIndex". All fields are combined with a logical 'AND'. */
export type DealAddressIndex_Bool_Exp = {
  _and?: InputMaybe<Array<DealAddressIndex_Bool_Exp>>;
  _not?: InputMaybe<DealAddressIndex_Bool_Exp>;
  _or?: InputMaybe<Array<DealAddressIndex_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "DealAddressIndex". */
export type DealAddressIndex_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** select columns of table "DealAddressIndex" */
export type DealAddressIndex_Select_Column =
  /** column name */
  | 'address'
  /** column name */
  | 'chainId'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id';

/** Streaming cursor of the table "DealAddressIndex" */
export type DealAddressIndex_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealAddressIndex_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealAddressIndex_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

/** order by aggregate values of table "DealAgentPosition" */
export type DealAgentPosition_Aggregate_Order_By = {
  avg?: InputMaybe<DealAgentPosition_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealAgentPosition_Max_Order_By>;
  min?: InputMaybe<DealAgentPosition_Min_Order_By>;
  stddev?: InputMaybe<DealAgentPosition_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealAgentPosition_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealAgentPosition_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealAgentPosition_Sum_Order_By>;
  var_pop?: InputMaybe<DealAgentPosition_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealAgentPosition_Var_Samp_Order_By>;
  variance?: InputMaybe<DealAgentPosition_Variance_Order_By>;
};

/** order by avg() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealAgentPosition". All fields are combined with a logical 'AND'. */
export type DealAgentPosition_Bool_Exp = {
  _and?: InputMaybe<Array<DealAgentPosition_Bool_Exp>>;
  _not?: InputMaybe<DealAgentPosition_Bool_Exp>;
  _or?: InputMaybe<Array<DealAgentPosition_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<String_Comparison_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  actions?: InputMaybe<AgentAction_Bool_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  currentStakedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacAgent?: InputMaybe<DacAgent_Bool_Exp>;
  dacAgentId?: InputMaybe<String_Comparison_Exp>;
  dacAgent_id?: InputMaybe<String_Comparison_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  isActive?: InputMaybe<Boolean_Comparison_Exp>;
  isLiquidatorStake?: InputMaybe<Boolean_Comparison_Exp>;
  lastClaimedRewardBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  lastReleasedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  lastSlashedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  lastStakedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  totalClaimedMainTokenAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalReleasedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalSlashedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalStakedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dacAgentId?: InputMaybe<Order_By>;
  dacAgent_id?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dacAgentId?: InputMaybe<Order_By>;
  dacAgent_id?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealAgentPosition". */
export type DealAgentPosition_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  actions_aggregate?: InputMaybe<AgentAction_Aggregate_Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacAgent?: InputMaybe<DacAgent_Order_By>;
  dacAgentId?: InputMaybe<Order_By>;
  dacAgent_id?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isActive?: InputMaybe<Order_By>;
  isLiquidatorStake?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "DealAgentPosition" */
export type DealAgentPosition_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'account_id'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'currentStakedAmount'
  /** column name */
  | 'dacAgentId'
  /** column name */
  | 'dacAgent_id'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isLiquidatorStake'
  /** column name */
  | 'lastClaimedRewardBlockNumber'
  /** column name */
  | 'lastReleasedBlockNumber'
  /** column name */
  | 'lastSlashedBlockNumber'
  /** column name */
  | 'lastStakedBlockNumber'
  /** column name */
  | 'totalClaimedMainTokenAmount'
  /** column name */
  | 'totalReleasedAmount'
  /** column name */
  | 'totalSlashedAmount'
  /** column name */
  | 'totalStakedAmount'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealAgentPosition" */
export type DealAgentPosition_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealAgentPosition_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealAgentPosition_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  currentStakedAmount?: InputMaybe<Scalars['numeric']['input']>;
  dacAgentId?: InputMaybe<Scalars['String']['input']>;
  dacAgent_id?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isLiquidatorStake?: InputMaybe<Scalars['Boolean']['input']>;
  lastClaimedRewardBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  lastReleasedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  lastSlashedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  lastStakedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  totalClaimedMainTokenAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalReleasedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalSlashedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalStakedAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealAgentPosition" */
export type DealAgentPosition_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  lastClaimedRewardBlockNumber?: InputMaybe<Order_By>;
  lastReleasedBlockNumber?: InputMaybe<Order_By>;
  lastSlashedBlockNumber?: InputMaybe<Order_By>;
  lastStakedBlockNumber?: InputMaybe<Order_By>;
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DealCapitalMovement" */
export type DealCapitalMovement_Aggregate_Order_By = {
  avg?: InputMaybe<DealCapitalMovement_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealCapitalMovement_Max_Order_By>;
  min?: InputMaybe<DealCapitalMovement_Min_Order_By>;
  stddev?: InputMaybe<DealCapitalMovement_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealCapitalMovement_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealCapitalMovement_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealCapitalMovement_Sum_Order_By>;
  var_pop?: InputMaybe<DealCapitalMovement_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealCapitalMovement_Var_Samp_Order_By>;
  variance?: InputMaybe<DealCapitalMovement_Variance_Order_By>;
};

/** order by avg() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealCapitalMovement". All fields are combined with a logical 'AND'. */
export type DealCapitalMovement_Bool_Exp = {
  _and?: InputMaybe<Array<DealCapitalMovement_Bool_Exp>>;
  _not?: InputMaybe<DealCapitalMovement_Bool_Exp>;
  _or?: InputMaybe<Array<DealCapitalMovement_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  movementType?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  trancheNumericId?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  movementType?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  movementType?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealCapitalMovement". */
export type DealCapitalMovement_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  movementType?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** select columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Select_Column =
  /** column name */
  | 'amount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'movementType'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'trancheNumericId';

/** order by stddev() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealCapitalMovement" */
export type DealCapitalMovement_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealCapitalMovement_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealCapitalMovement_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  movementType?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  trancheNumericId?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealCapitalMovement" */
export type DealCapitalMovement_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DealFundingToken" */
export type DealFundingToken_Aggregate_Order_By = {
  avg?: InputMaybe<DealFundingToken_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealFundingToken_Max_Order_By>;
  min?: InputMaybe<DealFundingToken_Min_Order_By>;
  stddev?: InputMaybe<DealFundingToken_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealFundingToken_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealFundingToken_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealFundingToken_Sum_Order_By>;
  var_pop?: InputMaybe<DealFundingToken_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealFundingToken_Var_Samp_Order_By>;
  variance?: InputMaybe<DealFundingToken_Variance_Order_By>;
};

/** order by avg() on columns of table "DealFundingToken" */
export type DealFundingToken_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealFundingToken". All fields are combined with a logical 'AND'. */
export type DealFundingToken_Bool_Exp = {
  _and?: InputMaybe<Array<DealFundingToken_Bool_Exp>>;
  _not?: InputMaybe<DealFundingToken_Bool_Exp>;
  _or?: InputMaybe<Array<DealFundingToken_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  investedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  netInvestedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  returnedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DealFundingToken" */
export type DealFundingToken_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealFundingToken" */
export type DealFundingToken_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealFundingToken". */
export type DealFundingToken_Order_By = {
  chainId?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "DealFundingToken" */
export type DealFundingToken_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'investedAmount'
  /** column name */
  | 'netInvestedAmount'
  /** column name */
  | 'returnedAmount'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "DealFundingToken" */
export type DealFundingToken_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealFundingToken" */
export type DealFundingToken_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealFundingToken" */
export type DealFundingToken_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealFundingToken" */
export type DealFundingToken_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealFundingToken_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealFundingToken_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  investedAmount?: InputMaybe<Scalars['numeric']['input']>;
  netInvestedAmount?: InputMaybe<Scalars['numeric']['input']>;
  returnedAmount?: InputMaybe<Scalars['numeric']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DealFundingToken" */
export type DealFundingToken_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealFundingToken" */
export type DealFundingToken_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealFundingToken" */
export type DealFundingToken_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealFundingToken" */
export type DealFundingToken_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  investedAmount?: InputMaybe<Order_By>;
  netInvestedAmount?: InputMaybe<Order_By>;
  returnedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Aggregate_Order_By = {
  avg?: InputMaybe<DealGovernanceAccount_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealGovernanceAccount_Max_Order_By>;
  min?: InputMaybe<DealGovernanceAccount_Min_Order_By>;
  stddev?: InputMaybe<DealGovernanceAccount_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealGovernanceAccount_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealGovernanceAccount_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealGovernanceAccount_Sum_Order_By>;
  var_pop?: InputMaybe<DealGovernanceAccount_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealGovernanceAccount_Var_Samp_Order_By>;
  variance?: InputMaybe<DealGovernanceAccount_Variance_Order_By>;
};

/** order by avg() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealGovernanceAccount". All fields are combined with a logical 'AND'. */
export type DealGovernanceAccount_Bool_Exp = {
  _and?: InputMaybe<Array<DealGovernanceAccount_Bool_Exp>>;
  _not?: InputMaybe<DealGovernanceAccount_Bool_Exp>;
  _or?: InputMaybe<Array<DealGovernanceAccount_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<String_Comparison_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  currentVotingPower?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  delegateAddress?: InputMaybe<String_Comparison_Exp>;
  hasVotingPower?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  delegateAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  delegateAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealGovernanceAccount". */
export type DealGovernanceAccount_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  delegateAddress?: InputMaybe<Order_By>;
  hasVotingPower?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'account_id'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'currentVotingPower'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'delegateAddress'
  /** column name */
  | 'hasVotingPower'
  /** column name */
  | 'id'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealGovernanceAccount" */
export type DealGovernanceAccount_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealGovernanceAccount_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealGovernanceAccount_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  currentVotingPower?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  delegateAddress?: InputMaybe<Scalars['String']['input']>;
  hasVotingPower?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealGovernanceAccount" */
export type DealGovernanceAccount_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  currentVotingPower?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DealInvite" */
export type DealInvite_Aggregate_Order_By = {
  avg?: InputMaybe<DealInvite_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealInvite_Max_Order_By>;
  min?: InputMaybe<DealInvite_Min_Order_By>;
  stddev?: InputMaybe<DealInvite_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealInvite_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealInvite_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealInvite_Sum_Order_By>;
  var_pop?: InputMaybe<DealInvite_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealInvite_Var_Samp_Order_By>;
  variance?: InputMaybe<DealInvite_Variance_Order_By>;
};

/** order by avg() on columns of table "DealInvite" */
export type DealInvite_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealInvite". All fields are combined with a logical 'AND'. */
export type DealInvite_Bool_Exp = {
  _and?: InputMaybe<Array<DealInvite_Bool_Exp>>;
  _not?: InputMaybe<DealInvite_Bool_Exp>;
  _or?: InputMaybe<Array<DealInvite_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<String_Comparison_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  canInvite?: InputMaybe<Boolean_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  inviteeAddress?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DealInvite" */
export type DealInvite_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  inviteeAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealInvite" */
export type DealInvite_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  inviteeAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealInvite". */
export type DealInvite_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  canInvite?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  inviteeAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** select columns of table "DealInvite" */
export type DealInvite_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'account_id'
  /** column name */
  | 'canInvite'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'inviteeAddress'
  /** column name */
  | 'updatedBlockNumber'
  /** column name */
  | 'updatedBlockTimestamp';

/** order by stddev() on columns of table "DealInvite" */
export type DealInvite_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealInvite" */
export type DealInvite_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealInvite" */
export type DealInvite_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealInvite" */
export type DealInvite_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealInvite_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealInvite_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  canInvite?: InputMaybe<Scalars['Boolean']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  inviteeAddress?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DealInvite" */
export type DealInvite_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealInvite" */
export type DealInvite_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealInvite" */
export type DealInvite_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealInvite" */
export type DealInvite_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealLookup". All fields are combined with a logical 'AND'. */
export type DealLookup_Bool_Exp = {
  _and?: InputMaybe<Array<DealLookup_Bool_Exp>>;
  _not?: InputMaybe<DealLookup_Bool_Exp>;
  _or?: InputMaybe<Array<DealLookup_Bool_Exp>>;
  cellAddress?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealAddress?: InputMaybe<String_Comparison_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  dealNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "DealLookup". */
export type DealLookup_Order_By = {
  cellAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealAddress?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** select columns of table "DealLookup" */
export type DealLookup_Select_Column =
  /** column name */
  | 'cellAddress'
  /** column name */
  | 'chainId'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealAddress'
  /** column name */
  | 'dealId'
  /** column name */
  | 'dealNumericId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id';

/** Streaming cursor of the table "DealLookup" */
export type DealLookup_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealLookup_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealLookup_Stream_Cursor_Value_Input = {
  cellAddress?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealAddress?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  dealNumericId?: InputMaybe<Scalars['numeric']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

/** order by aggregate values of table "DealMessage" */
export type DealMessage_Aggregate_Order_By = {
  avg?: InputMaybe<DealMessage_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealMessage_Max_Order_By>;
  min?: InputMaybe<DealMessage_Min_Order_By>;
  stddev?: InputMaybe<DealMessage_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealMessage_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealMessage_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealMessage_Sum_Order_By>;
  var_pop?: InputMaybe<DealMessage_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealMessage_Var_Samp_Order_By>;
  variance?: InputMaybe<DealMessage_Variance_Order_By>;
};

/** order by avg() on columns of table "DealMessage" */
export type DealMessage_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealMessage". All fields are combined with a logical 'AND'. */
export type DealMessage_Bool_Exp = {
  _and?: InputMaybe<Array<DealMessage_Bool_Exp>>;
  _not?: InputMaybe<DealMessage_Bool_Exp>;
  _or?: InputMaybe<Array<DealMessage_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  message?: InputMaybe<String_Comparison_Exp>;
  messageKind?: InputMaybe<String_Comparison_Exp>;
  messageSource?: InputMaybe<String_Comparison_Exp>;
  wrapperAddress?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "DealMessage" */
export type DealMessage_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  messageKind?: InputMaybe<Order_By>;
  messageSource?: InputMaybe<Order_By>;
  wrapperAddress?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealMessage" */
export type DealMessage_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  messageKind?: InputMaybe<Order_By>;
  messageSource?: InputMaybe<Order_By>;
  wrapperAddress?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealMessage". */
export type DealMessage_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  messageKind?: InputMaybe<Order_By>;
  messageSource?: InputMaybe<Order_By>;
  wrapperAddress?: InputMaybe<Order_By>;
};

/** select columns of table "DealMessage" */
export type DealMessage_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'message'
  /** column name */
  | 'messageKind'
  /** column name */
  | 'messageSource'
  /** column name */
  | 'wrapperAddress';

/** order by stddev() on columns of table "DealMessage" */
export type DealMessage_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealMessage" */
export type DealMessage_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealMessage" */
export type DealMessage_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealMessage" */
export type DealMessage_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealMessage_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealMessage_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  messageKind?: InputMaybe<Scalars['String']['input']>;
  messageSource?: InputMaybe<Scalars['String']['input']>;
  wrapperAddress?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "DealMessage" */
export type DealMessage_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealMessage" */
export type DealMessage_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealMessage" */
export type DealMessage_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealMessage" */
export type DealMessage_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DealProposalChallenge" */
export type DealProposalChallenge_Aggregate_Order_By = {
  avg?: InputMaybe<DealProposalChallenge_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealProposalChallenge_Max_Order_By>;
  min?: InputMaybe<DealProposalChallenge_Min_Order_By>;
  stddev?: InputMaybe<DealProposalChallenge_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealProposalChallenge_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealProposalChallenge_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealProposalChallenge_Sum_Order_By>;
  var_pop?: InputMaybe<DealProposalChallenge_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealProposalChallenge_Var_Samp_Order_By>;
  variance?: InputMaybe<DealProposalChallenge_Variance_Order_By>;
};

/** order by avg() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealProposalChallenge". All fields are combined with a logical 'AND'. */
export type DealProposalChallenge_Bool_Exp = {
  _and?: InputMaybe<Array<DealProposalChallenge_Bool_Exp>>;
  _not?: InputMaybe<DealProposalChallenge_Bool_Exp>;
  _or?: InputMaybe<Array<DealProposalChallenge_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dacProposal?: InputMaybe<DacProposal_Bool_Exp>;
  dacProposalId?: InputMaybe<String_Comparison_Exp>;
  dacProposal_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  dealProposal?: InputMaybe<DealProposal_Bool_Exp>;
  dealProposalId?: InputMaybe<String_Comparison_Exp>;
  dealProposal_id?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  dealProposalId?: InputMaybe<Order_By>;
  dealProposal_id?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  dealProposalId?: InputMaybe<Order_By>;
  dealProposal_id?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealProposalChallenge". */
export type DealProposalChallenge_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacProposal?: InputMaybe<DacProposal_Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  dealProposal?: InputMaybe<DealProposal_Order_By>;
  dealProposalId?: InputMaybe<Order_By>;
  dealProposal_id?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** select columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacProposalId'
  /** column name */
  | 'dacProposal_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'dealProposalId'
  /** column name */
  | 'dealProposal_id'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'proposalNumericId';

/** order by stddev() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealProposalChallenge" */
export type DealProposalChallenge_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealProposalChallenge_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealProposalChallenge_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacProposalId?: InputMaybe<Scalars['String']['input']>;
  dacProposal_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  dealProposalId?: InputMaybe<Scalars['String']['input']>;
  dealProposal_id?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealProposalChallenge" */
export type DealProposalChallenge_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DealProposal" */
export type DealProposal_Aggregate_Order_By = {
  avg?: InputMaybe<DealProposal_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealProposal_Max_Order_By>;
  min?: InputMaybe<DealProposal_Min_Order_By>;
  stddev?: InputMaybe<DealProposal_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealProposal_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealProposal_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealProposal_Sum_Order_By>;
  var_pop?: InputMaybe<DealProposal_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealProposal_Var_Samp_Order_By>;
  variance?: InputMaybe<DealProposal_Variance_Order_By>;
};

/** order by avg() on columns of table "DealProposal" */
export type DealProposal_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealProposal". All fields are combined with a logical 'AND'. */
export type DealProposal_Bool_Exp = {
  _and?: InputMaybe<Array<DealProposal_Bool_Exp>>;
  _not?: InputMaybe<DealProposal_Bool_Exp>;
  _or?: InputMaybe<Array<DealProposal_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  challengeCount?: InputMaybe<Numeric_Comparison_Exp>;
  challengeable?: InputMaybe<Boolean_Comparison_Exp>;
  challenged?: InputMaybe<Boolean_Comparison_Exp>;
  challenges?: InputMaybe<DealProposalChallenge_Bool_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  proposal?: InputMaybe<Proposal_Bool_Exp>;
  proposalId?: InputMaybe<String_Comparison_Exp>;
  proposal_id?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "DealProposal" */
export type DealProposal_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealProposal" */
export type DealProposal_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealProposal". */
export type DealProposal_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  challengeable?: InputMaybe<Order_By>;
  challenged?: InputMaybe<Order_By>;
  challenges_aggregate?: InputMaybe<DealProposalChallenge_Aggregate_Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposal?: InputMaybe<Proposal_Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
};

/** select columns of table "DealProposal" */
export type DealProposal_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'challengeCount'
  /** column name */
  | 'challengeable'
  /** column name */
  | 'challenged'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'proposalId'
  /** column name */
  | 'proposal_id';

/** order by stddev() on columns of table "DealProposal" */
export type DealProposal_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealProposal" */
export type DealProposal_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealProposal" */
export type DealProposal_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealProposal" */
export type DealProposal_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealProposal_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealProposal_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  challengeCount?: InputMaybe<Scalars['numeric']['input']>;
  challengeable?: InputMaybe<Scalars['Boolean']['input']>;
  challenged?: InputMaybe<Scalars['Boolean']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  proposalId?: InputMaybe<Scalars['String']['input']>;
  proposal_id?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "DealProposal" */
export type DealProposal_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealProposal" */
export type DealProposal_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealProposal" */
export type DealProposal_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealProposal" */
export type DealProposal_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  challengeCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DealRelatedContract" */
export type DealRelatedContract_Aggregate_Order_By = {
  avg?: InputMaybe<DealRelatedContract_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealRelatedContract_Max_Order_By>;
  min?: InputMaybe<DealRelatedContract_Min_Order_By>;
  stddev?: InputMaybe<DealRelatedContract_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealRelatedContract_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealRelatedContract_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealRelatedContract_Sum_Order_By>;
  var_pop?: InputMaybe<DealRelatedContract_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealRelatedContract_Var_Samp_Order_By>;
  variance?: InputMaybe<DealRelatedContract_Variance_Order_By>;
};

/** order by avg() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealRelatedContract". All fields are combined with a logical 'AND'. */
export type DealRelatedContract_Bool_Exp = {
  _and?: InputMaybe<Array<DealRelatedContract_Bool_Exp>>;
  _not?: InputMaybe<DealRelatedContract_Bool_Exp>;
  _or?: InputMaybe<Array<DealRelatedContract_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  controlled?: InputMaybe<Boolean_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealAddress?: InputMaybe<String_Comparison_Exp>;
  dealCellAddress?: InputMaybe<String_Comparison_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  managed?: InputMaybe<Boolean_Comparison_Exp>;
  relatedContractAddress?: InputMaybe<String_Comparison_Exp>;
  roleHex?: InputMaybe<String_Comparison_Exp>;
  roleText?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealAddress?: InputMaybe<Order_By>;
  dealCellAddress?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  relatedContractAddress?: InputMaybe<Order_By>;
  roleHex?: InputMaybe<Order_By>;
  roleText?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealAddress?: InputMaybe<Order_By>;
  dealCellAddress?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  relatedContractAddress?: InputMaybe<Order_By>;
  roleHex?: InputMaybe<Order_By>;
  roleText?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealRelatedContract". */
export type DealRelatedContract_Order_By = {
  chainId?: InputMaybe<Order_By>;
  controlled?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealAddress?: InputMaybe<Order_By>;
  dealCellAddress?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  managed?: InputMaybe<Order_By>;
  relatedContractAddress?: InputMaybe<Order_By>;
  roleHex?: InputMaybe<Order_By>;
  roleText?: InputMaybe<Order_By>;
};

/** select columns of table "DealRelatedContract" */
export type DealRelatedContract_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'controlled'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealAddress'
  /** column name */
  | 'dealCellAddress'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'managed'
  /** column name */
  | 'relatedContractAddress'
  /** column name */
  | 'roleHex'
  /** column name */
  | 'roleText';

/** order by stddev() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealRelatedContract" */
export type DealRelatedContract_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealRelatedContract_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealRelatedContract_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  controlled?: InputMaybe<Scalars['Boolean']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealAddress?: InputMaybe<Scalars['String']['input']>;
  dealCellAddress?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  managed?: InputMaybe<Scalars['Boolean']['input']>;
  relatedContractAddress?: InputMaybe<Scalars['String']['input']>;
  roleHex?: InputMaybe<Scalars['String']['input']>;
  roleText?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealRelatedContract" */
export type DealRelatedContract_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Aggregate_Order_By = {
  avg?: InputMaybe<DealRewardPoolMovement_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealRewardPoolMovement_Max_Order_By>;
  min?: InputMaybe<DealRewardPoolMovement_Min_Order_By>;
  stddev?: InputMaybe<DealRewardPoolMovement_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealRewardPoolMovement_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealRewardPoolMovement_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealRewardPoolMovement_Sum_Order_By>;
  var_pop?: InputMaybe<DealRewardPoolMovement_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealRewardPoolMovement_Var_Samp_Order_By>;
  variance?: InputMaybe<DealRewardPoolMovement_Variance_Order_By>;
};

/** order by avg() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealRewardPoolMovement". All fields are combined with a logical 'AND'. */
export type DealRewardPoolMovement_Bool_Exp = {
  _and?: InputMaybe<Array<DealRewardPoolMovement_Bool_Exp>>;
  _not?: InputMaybe<DealRewardPoolMovement_Bool_Exp>;
  _or?: InputMaybe<Array<DealRewardPoolMovement_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  movementType?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  movementType?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  movementType?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealRewardPoolMovement". */
export type DealRewardPoolMovement_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  movementType?: InputMaybe<Order_By>;
};

/** select columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Select_Column =
  /** column name */
  | 'amount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'movementType';

/** order by stddev() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealRewardPoolMovement_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealRewardPoolMovement_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  movementType?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealRewardPoolMovement" */
export type DealRewardPoolMovement_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Aggregate_Order_By = {
  avg?: InputMaybe<DealVotingConfigChange_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DealVotingConfigChange_Max_Order_By>;
  min?: InputMaybe<DealVotingConfigChange_Min_Order_By>;
  stddev?: InputMaybe<DealVotingConfigChange_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DealVotingConfigChange_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DealVotingConfigChange_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DealVotingConfigChange_Sum_Order_By>;
  var_pop?: InputMaybe<DealVotingConfigChange_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DealVotingConfigChange_Var_Samp_Order_By>;
  variance?: InputMaybe<DealVotingConfigChange_Variance_Order_By>;
};

/** order by avg() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DealVotingConfigChange". All fields are combined with a logical 'AND'. */
export type DealVotingConfigChange_Bool_Exp = {
  _and?: InputMaybe<Array<DealVotingConfigChange_Bool_Exp>>;
  _not?: InputMaybe<DealVotingConfigChange_Bool_Exp>;
  _or?: InputMaybe<Array<DealVotingConfigChange_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  executionValidityDuration?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  votingBlockingPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingDuration?: InputMaybe<Numeric_Comparison_Exp>;
  votingHighQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingQualification?: InputMaybe<Numeric_Comparison_Exp>;
  votingQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DealVotingConfigChange". */
export type DealVotingConfigChange_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** select columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'executionValidityDuration'
  /** column name */
  | 'id'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'votingBlockingPercent'
  /** column name */
  | 'votingDuration'
  /** column name */
  | 'votingHighQuorumPercent'
  /** column name */
  | 'votingQualification'
  /** column name */
  | 'votingQuorumPercent';

/** order by stddev() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DealVotingConfigChange" */
export type DealVotingConfigChange_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DealVotingConfigChange_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DealVotingConfigChange_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  executionValidityDuration?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  votingBlockingPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingDuration?: InputMaybe<Scalars['numeric']['input']>;
  votingHighQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingQualification?: InputMaybe<Scalars['numeric']['input']>;
  votingQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DealVotingConfigChange" */
export type DealVotingConfigChange_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "Deal" */
export type Deal_Aggregate_Order_By = {
  avg?: InputMaybe<Deal_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Deal_Max_Order_By>;
  min?: InputMaybe<Deal_Min_Order_By>;
  stddev?: InputMaybe<Deal_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Deal_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Deal_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Deal_Sum_Order_By>;
  var_pop?: InputMaybe<Deal_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Deal_Var_Samp_Order_By>;
  variance?: InputMaybe<Deal_Variance_Order_By>;
};

/** order by avg() on columns of table "Deal" */
export type Deal_Avg_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Deal". All fields are combined with a logical 'AND'. */
export type Deal_Bool_Exp = {
  _and?: InputMaybe<Array<Deal_Bool_Exp>>;
  _not?: InputMaybe<Deal_Bool_Exp>;
  _or?: InputMaybe<Array<Deal_Bool_Exp>>;
  activatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  agentsLimit?: InputMaybe<Numeric_Comparison_Exp>;
  approveDeadline?: InputMaybe<Numeric_Comparison_Exp>;
  capitalMovements?: InputMaybe<DealCapitalMovement_Bool_Exp>;
  cellAddress?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  challengePassed?: InputMaybe<Boolean_Comparison_Exp>;
  childAgentTokenAddress?: InputMaybe<String_Comparison_Exp>;
  childDac?: InputMaybe<Dac_Bool_Exp>;
  childDacAddress?: InputMaybe<String_Comparison_Exp>;
  childDacDeal?: InputMaybe<ChildDacDeal_Bool_Exp>;
  childDacId?: InputMaybe<String_Comparison_Exp>;
  childDac_id?: InputMaybe<String_Comparison_Exp>;
  childMainTokenAddress?: InputMaybe<String_Comparison_Exp>;
  closed?: InputMaybe<Boolean_Comparison_Exp>;
  closedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  creator?: InputMaybe<String_Comparison_Exp>;
  currentStakedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  dealAddress?: InputMaybe<String_Comparison_Exp>;
  dealChallengeEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  dealConfig?: InputMaybe<String_Comparison_Exp>;
  dealDeadline?: InputMaybe<Numeric_Comparison_Exp>;
  dealNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  dealProposals?: InputMaybe<DealProposal_Bool_Exp>;
  dealRewardPoolPercent?: InputMaybe<Numeric_Comparison_Exp>;
  dealTargetAddress?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  earlyReturnsEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  evaluationDeadline?: InputMaybe<Numeric_Comparison_Exp>;
  evaluations?: InputMaybe<Evaluation_Bool_Exp>;
  evaluatorConfig?: InputMaybe<String_Comparison_Exp>;
  evaluatorCount?: InputMaybe<Numeric_Comparison_Exp>;
  evaluatorModuleFactoryAddress?: InputMaybe<String_Comparison_Exp>;
  evaluatorSelector?: InputMaybe<String_Comparison_Exp>;
  evaluators?: InputMaybe<Evaluator_Bool_Exp>;
  executedProposalCount?: InputMaybe<Numeric_Comparison_Exp>;
  executionValidityDuration?: InputMaybe<Numeric_Comparison_Exp>;
  fundingTokens?: InputMaybe<DealFundingToken_Bool_Exp>;
  governanceAccounts?: InputMaybe<DealGovernanceAccount_Bool_Exp>;
  governanceFactoryAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  invites?: InputMaybe<DealInvite_Bool_Exp>;
  kindSelector?: InputMaybe<String_Comparison_Exp>;
  lastEvaluatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  linkHash?: InputMaybe<String_Comparison_Exp>;
  mainTokenHoldings?: InputMaybe<MainTokenHolder_Bool_Exp>;
  managedTreasuryAddress?: InputMaybe<String_Comparison_Exp>;
  messages?: InputMaybe<DealMessage_Bool_Exp>;
  minimalStake?: InputMaybe<Numeric_Comparison_Exp>;
  moduleFactory?: InputMaybe<ModuleFactory_Bool_Exp>;
  moduleFactoryAddress?: InputMaybe<String_Comparison_Exp>;
  moduleFactory_id?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  proposalChallenges?: InputMaybe<DealProposalChallenge_Bool_Exp>;
  proposalCount?: InputMaybe<Numeric_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  proposals?: InputMaybe<Proposal_Bool_Exp>;
  proposer?: InputMaybe<String_Comparison_Exp>;
  recovered?: InputMaybe<Boolean_Comparison_Exp>;
  recoveredBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  relatedContractCount?: InputMaybe<Numeric_Comparison_Exp>;
  relatedContracts?: InputMaybe<DealRelatedContract_Bool_Exp>;
  rewardPoolMovements?: InputMaybe<DealRewardPoolMovement_Bool_Exp>;
  rewardPoolSupported?: InputMaybe<Boolean_Comparison_Exp>;
  rewardsAllocated?: InputMaybe<Numeric_Comparison_Exp>;
  rewardsLimit?: InputMaybe<Numeric_Comparison_Exp>;
  stakePositions?: InputMaybe<DealAgentPosition_Bool_Exp>;
  stakeTokenAddress?: InputMaybe<String_Comparison_Exp>;
  stakerCount?: InputMaybe<Numeric_Comparison_Exp>;
  totalAgentTokens?: InputMaybe<Numeric_Comparison_Exp>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalEvaluationCount?: InputMaybe<Numeric_Comparison_Exp>;
  totalReleasedStakeAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalRewardAllocatedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalRewardClaimedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalSlashedStakeAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalStakedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  trancheCount?: InputMaybe<Numeric_Comparison_Exp>;
  tranches?: InputMaybe<Tranche_Bool_Exp>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Bool_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  vetoEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  votingBlockingPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingConfigChanges?: InputMaybe<DealVotingConfigChange_Bool_Exp>;
  votingDuration?: InputMaybe<Numeric_Comparison_Exp>;
  votingHighQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingQualification?: InputMaybe<Numeric_Comparison_Exp>;
  votingQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
  whitelistOnly?: InputMaybe<Boolean_Comparison_Exp>;
};

/** order by max() on columns of table "Deal" */
export type Deal_Max_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  cellAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  childAgentTokenAddress?: InputMaybe<Order_By>;
  childDacAddress?: InputMaybe<Order_By>;
  childDacId?: InputMaybe<Order_By>;
  childDac_id?: InputMaybe<Order_By>;
  childMainTokenAddress?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  creator?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealAddress?: InputMaybe<Order_By>;
  dealConfig?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  dealTargetAddress?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorConfig?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  evaluatorModuleFactoryAddress?: InputMaybe<Order_By>;
  evaluatorSelector?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  governanceFactoryAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  linkHash?: InputMaybe<Order_By>;
  managedTreasuryAddress?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  moduleFactoryAddress?: InputMaybe<Order_By>;
  moduleFactory_id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  proposer?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakeTokenAddress?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Deal" */
export type Deal_Min_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  cellAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  childAgentTokenAddress?: InputMaybe<Order_By>;
  childDacAddress?: InputMaybe<Order_By>;
  childDacId?: InputMaybe<Order_By>;
  childDac_id?: InputMaybe<Order_By>;
  childMainTokenAddress?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  creator?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealAddress?: InputMaybe<Order_By>;
  dealConfig?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  dealTargetAddress?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorConfig?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  evaluatorModuleFactoryAddress?: InputMaybe<Order_By>;
  evaluatorSelector?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  governanceFactoryAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  linkHash?: InputMaybe<Order_By>;
  managedTreasuryAddress?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  moduleFactoryAddress?: InputMaybe<Order_By>;
  moduleFactory_id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  proposer?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakeTokenAddress?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Deal". */
export type Deal_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  active?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  capitalMovements_aggregate?: InputMaybe<DealCapitalMovement_Aggregate_Order_By>;
  cellAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  challengePassed?: InputMaybe<Order_By>;
  childAgentTokenAddress?: InputMaybe<Order_By>;
  childDac?: InputMaybe<Dac_Order_By>;
  childDacAddress?: InputMaybe<Order_By>;
  childDacDeal_aggregate?: InputMaybe<ChildDacDeal_Aggregate_Order_By>;
  childDacId?: InputMaybe<Order_By>;
  childDac_id?: InputMaybe<Order_By>;
  childMainTokenAddress?: InputMaybe<Order_By>;
  closed?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  creator?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealAddress?: InputMaybe<Order_By>;
  dealChallengeEnabled?: InputMaybe<Order_By>;
  dealConfig?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealProposals_aggregate?: InputMaybe<DealProposal_Aggregate_Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  dealTargetAddress?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  earlyReturnsEnabled?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluations_aggregate?: InputMaybe<Evaluation_Aggregate_Order_By>;
  evaluatorConfig?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  evaluatorModuleFactoryAddress?: InputMaybe<Order_By>;
  evaluatorSelector?: InputMaybe<Order_By>;
  evaluators_aggregate?: InputMaybe<Evaluator_Aggregate_Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  fundingTokens_aggregate?: InputMaybe<DealFundingToken_Aggregate_Order_By>;
  governanceAccounts_aggregate?: InputMaybe<DealGovernanceAccount_Aggregate_Order_By>;
  governanceFactoryAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invites_aggregate?: InputMaybe<DealInvite_Aggregate_Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  linkHash?: InputMaybe<Order_By>;
  mainTokenHoldings_aggregate?: InputMaybe<MainTokenHolder_Aggregate_Order_By>;
  managedTreasuryAddress?: InputMaybe<Order_By>;
  messages_aggregate?: InputMaybe<DealMessage_Aggregate_Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  moduleFactory?: InputMaybe<ModuleFactory_Order_By>;
  moduleFactoryAddress?: InputMaybe<Order_By>;
  moduleFactory_id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  proposalChallenges_aggregate?: InputMaybe<DealProposalChallenge_Aggregate_Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  proposals_aggregate?: InputMaybe<Proposal_Aggregate_Order_By>;
  proposer?: InputMaybe<Order_By>;
  recovered?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  relatedContracts_aggregate?: InputMaybe<DealRelatedContract_Aggregate_Order_By>;
  rewardPoolMovements_aggregate?: InputMaybe<DealRewardPoolMovement_Aggregate_Order_By>;
  rewardPoolSupported?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakePositions_aggregate?: InputMaybe<DealAgentPosition_Aggregate_Order_By>;
  stakeTokenAddress?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  tranches_aggregate?: InputMaybe<Tranche_Aggregate_Order_By>;
  treasuryDeal_aggregate?: InputMaybe<TreasuryDeal_Aggregate_Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  vetoEnabled?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingConfigChanges_aggregate?: InputMaybe<DealVotingConfigChange_Aggregate_Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
  whitelistOnly?: InputMaybe<Order_By>;
};

/** select columns of table "Deal" */
export type Deal_Select_Column =
  /** column name */
  | 'activatedBlockNumber'
  /** column name */
  | 'active'
  /** column name */
  | 'agentsLimit'
  /** column name */
  | 'approveDeadline'
  /** column name */
  | 'cellAddress'
  /** column name */
  | 'chainId'
  /** column name */
  | 'challengePassed'
  /** column name */
  | 'childAgentTokenAddress'
  /** column name */
  | 'childDacAddress'
  /** column name */
  | 'childDacId'
  /** column name */
  | 'childDac_id'
  /** column name */
  | 'childMainTokenAddress'
  /** column name */
  | 'closed'
  /** column name */
  | 'closedBlockNumber'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'creator'
  /** column name */
  | 'currentStakedAmount'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealAddress'
  /** column name */
  | 'dealChallengeEnabled'
  /** column name */
  | 'dealConfig'
  /** column name */
  | 'dealDeadline'
  /** column name */
  | 'dealNumericId'
  /** column name */
  | 'dealRewardPoolPercent'
  /** column name */
  | 'dealTargetAddress'
  /** column name */
  | 'description'
  /** column name */
  | 'earlyReturnsEnabled'
  /** column name */
  | 'evaluationDeadline'
  /** column name */
  | 'evaluatorConfig'
  /** column name */
  | 'evaluatorCount'
  /** column name */
  | 'evaluatorModuleFactoryAddress'
  /** column name */
  | 'evaluatorSelector'
  /** column name */
  | 'executedProposalCount'
  /** column name */
  | 'executionValidityDuration'
  /** column name */
  | 'governanceFactoryAddress'
  /** column name */
  | 'id'
  /** column name */
  | 'kindSelector'
  /** column name */
  | 'lastEvaluatedBlockNumber'
  /** column name */
  | 'linkHash'
  /** column name */
  | 'managedTreasuryAddress'
  /** column name */
  | 'minimalStake'
  /** column name */
  | 'moduleFactoryAddress'
  /** column name */
  | 'moduleFactory_id'
  /** column name */
  | 'name'
  /** column name */
  | 'proposalCount'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'proposer'
  /** column name */
  | 'recovered'
  /** column name */
  | 'recoveredBlockNumber'
  /** column name */
  | 'relatedContractCount'
  /** column name */
  | 'rewardPoolSupported'
  /** column name */
  | 'rewardsAllocated'
  /** column name */
  | 'rewardsLimit'
  /** column name */
  | 'stakeTokenAddress'
  /** column name */
  | 'stakerCount'
  /** column name */
  | 'totalAgentTokens'
  /** column name */
  | 'totalDealRewardPoolAllocatedAmount'
  /** column name */
  | 'totalDealRewardPoolClaimedAmount'
  /** column name */
  | 'totalEvaluationCount'
  /** column name */
  | 'totalReleasedStakeAmount'
  /** column name */
  | 'totalRewardAllocatedAmount'
  /** column name */
  | 'totalRewardClaimedAmount'
  /** column name */
  | 'totalSlashedStakeAmount'
  /** column name */
  | 'totalStakedAmount'
  /** column name */
  | 'trancheCount'
  /** column name */
  | 'updatedBlockNumber'
  /** column name */
  | 'vetoEnabled'
  /** column name */
  | 'votingBlockingPercent'
  /** column name */
  | 'votingDuration'
  /** column name */
  | 'votingHighQuorumPercent'
  /** column name */
  | 'votingQualification'
  /** column name */
  | 'votingQuorumPercent'
  /** column name */
  | 'whitelistOnly';

/** order by stddev() on columns of table "Deal" */
export type Deal_Stddev_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Deal" */
export type Deal_Stddev_Pop_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Deal" */
export type Deal_Stddev_Samp_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Deal" */
export type Deal_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Deal_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Deal_Stream_Cursor_Value_Input = {
  activatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  agentsLimit?: InputMaybe<Scalars['numeric']['input']>;
  approveDeadline?: InputMaybe<Scalars['numeric']['input']>;
  cellAddress?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  challengePassed?: InputMaybe<Scalars['Boolean']['input']>;
  childAgentTokenAddress?: InputMaybe<Scalars['String']['input']>;
  childDacAddress?: InputMaybe<Scalars['String']['input']>;
  childDacId?: InputMaybe<Scalars['String']['input']>;
  childDac_id?: InputMaybe<Scalars['String']['input']>;
  childMainTokenAddress?: InputMaybe<Scalars['String']['input']>;
  closed?: InputMaybe<Scalars['Boolean']['input']>;
  closedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  creator?: InputMaybe<Scalars['String']['input']>;
  currentStakedAmount?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealAddress?: InputMaybe<Scalars['String']['input']>;
  dealChallengeEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  dealConfig?: InputMaybe<Scalars['String']['input']>;
  dealDeadline?: InputMaybe<Scalars['numeric']['input']>;
  dealNumericId?: InputMaybe<Scalars['numeric']['input']>;
  dealRewardPoolPercent?: InputMaybe<Scalars['numeric']['input']>;
  dealTargetAddress?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  earlyReturnsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  evaluationDeadline?: InputMaybe<Scalars['numeric']['input']>;
  evaluatorConfig?: InputMaybe<Scalars['String']['input']>;
  evaluatorCount?: InputMaybe<Scalars['numeric']['input']>;
  evaluatorModuleFactoryAddress?: InputMaybe<Scalars['String']['input']>;
  evaluatorSelector?: InputMaybe<Scalars['String']['input']>;
  executedProposalCount?: InputMaybe<Scalars['numeric']['input']>;
  executionValidityDuration?: InputMaybe<Scalars['numeric']['input']>;
  governanceFactoryAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  kindSelector?: InputMaybe<Scalars['String']['input']>;
  lastEvaluatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  linkHash?: InputMaybe<Scalars['String']['input']>;
  managedTreasuryAddress?: InputMaybe<Scalars['String']['input']>;
  minimalStake?: InputMaybe<Scalars['numeric']['input']>;
  moduleFactoryAddress?: InputMaybe<Scalars['String']['input']>;
  moduleFactory_id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  proposalCount?: InputMaybe<Scalars['numeric']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  proposer?: InputMaybe<Scalars['String']['input']>;
  recovered?: InputMaybe<Scalars['Boolean']['input']>;
  recoveredBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  relatedContractCount?: InputMaybe<Scalars['numeric']['input']>;
  rewardPoolSupported?: InputMaybe<Scalars['Boolean']['input']>;
  rewardsAllocated?: InputMaybe<Scalars['numeric']['input']>;
  rewardsLimit?: InputMaybe<Scalars['numeric']['input']>;
  stakeTokenAddress?: InputMaybe<Scalars['String']['input']>;
  stakerCount?: InputMaybe<Scalars['numeric']['input']>;
  totalAgentTokens?: InputMaybe<Scalars['numeric']['input']>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalEvaluationCount?: InputMaybe<Scalars['numeric']['input']>;
  totalReleasedStakeAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalRewardAllocatedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalRewardClaimedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalSlashedStakeAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalStakedAmount?: InputMaybe<Scalars['numeric']['input']>;
  trancheCount?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  vetoEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  votingBlockingPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingDuration?: InputMaybe<Scalars['numeric']['input']>;
  votingHighQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingQualification?: InputMaybe<Scalars['numeric']['input']>;
  votingQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
  whitelistOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by sum() on columns of table "Deal" */
export type Deal_Sum_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Deal" */
export type Deal_Var_Pop_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Deal" */
export type Deal_Var_Samp_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Deal" */
export type Deal_Variance_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  agentsLimit?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealRewardPoolPercent?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  minimalStake?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalDealRewardPoolAllocatedAmount?: InputMaybe<Order_By>;
  totalDealRewardPoolClaimedAmount?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "DividendPayout" */
export type DividendPayout_Aggregate_Order_By = {
  avg?: InputMaybe<DividendPayout_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DividendPayout_Max_Order_By>;
  min?: InputMaybe<DividendPayout_Min_Order_By>;
  stddev?: InputMaybe<DividendPayout_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DividendPayout_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DividendPayout_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DividendPayout_Sum_Order_By>;
  var_pop?: InputMaybe<DividendPayout_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DividendPayout_Var_Samp_Order_By>;
  variance?: InputMaybe<DividendPayout_Variance_Order_By>;
};

/** order by avg() on columns of table "DividendPayout" */
export type DividendPayout_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "DividendPayout". All fields are combined with a logical 'AND'. */
export type DividendPayout_Bool_Exp = {
  _and?: InputMaybe<Array<DividendPayout_Bool_Exp>>;
  _not?: InputMaybe<DividendPayout_Bool_Exp>;
  _or?: InputMaybe<Array<DividendPayout_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  claimCount?: InputMaybe<Numeric_Comparison_Exp>;
  claimedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  merkleRoot?: InputMaybe<String_Comparison_Exp>;
  payoutNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  totalPayout?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "DividendPayout" */
export type DividendPayout_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleRoot?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "DividendPayout" */
export type DividendPayout_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleRoot?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "DividendPayout". */
export type DividendPayout_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleRoot?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** select columns of table "DividendPayout" */
export type DividendPayout_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'claimCount'
  /** column name */
  | 'claimedAmount'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'id'
  /** column name */
  | 'merkleRoot'
  /** column name */
  | 'payoutNumericId'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'totalPayout';

/** order by stddev() on columns of table "DividendPayout" */
export type DividendPayout_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "DividendPayout" */
export type DividendPayout_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "DividendPayout" */
export type DividendPayout_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "DividendPayout" */
export type DividendPayout_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: DividendPayout_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type DividendPayout_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  claimCount?: InputMaybe<Scalars['numeric']['input']>;
  claimedAmount?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merkleRoot?: InputMaybe<Scalars['String']['input']>;
  payoutNumericId?: InputMaybe<Scalars['numeric']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  totalPayout?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "DividendPayout" */
export type DividendPayout_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "DividendPayout" */
export type DividendPayout_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "DividendPayout" */
export type DividendPayout_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "DividendPayout" */
export type DividendPayout_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  claimCount?: InputMaybe<Order_By>;
  claimedAmount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  payoutNumericId?: InputMaybe<Order_By>;
  totalPayout?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "Evaluation" */
export type Evaluation_Aggregate_Order_By = {
  avg?: InputMaybe<Evaluation_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Evaluation_Max_Order_By>;
  min?: InputMaybe<Evaluation_Min_Order_By>;
  stddev?: InputMaybe<Evaluation_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Evaluation_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Evaluation_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Evaluation_Sum_Order_By>;
  var_pop?: InputMaybe<Evaluation_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Evaluation_Var_Samp_Order_By>;
  variance?: InputMaybe<Evaluation_Variance_Order_By>;
};

/** order by avg() on columns of table "Evaluation" */
export type Evaluation_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Evaluation". All fields are combined with a logical 'AND'. */
export type Evaluation_Bool_Exp = {
  _and?: InputMaybe<Array<Evaluation_Bool_Exp>>;
  _not?: InputMaybe<Evaluation_Bool_Exp>;
  _or?: InputMaybe<Array<Evaluation_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  commandCount?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  evaluationSequence?: InputMaybe<Numeric_Comparison_Exp>;
  evaluationsData?: InputMaybe<String_Comparison_Exp>;
  evaluator?: InputMaybe<Evaluator_Bool_Exp>;
  evaluatorAddress?: InputMaybe<String_Comparison_Exp>;
  evaluatorId?: InputMaybe<String_Comparison_Exp>;
  evaluator_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "Evaluation" */
export type Evaluation_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
  evaluationsData?: InputMaybe<Order_By>;
  evaluatorAddress?: InputMaybe<Order_By>;
  evaluatorId?: InputMaybe<Order_By>;
  evaluator_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Evaluation" */
export type Evaluation_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
  evaluationsData?: InputMaybe<Order_By>;
  evaluatorAddress?: InputMaybe<Order_By>;
  evaluatorId?: InputMaybe<Order_By>;
  evaluator_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Evaluation". */
export type Evaluation_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
  evaluationsData?: InputMaybe<Order_By>;
  evaluator?: InputMaybe<Evaluator_Order_By>;
  evaluatorAddress?: InputMaybe<Order_By>;
  evaluatorId?: InputMaybe<Order_By>;
  evaluator_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** select columns of table "Evaluation" */
export type Evaluation_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'commandCount'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'evaluationSequence'
  /** column name */
  | 'evaluationsData'
  /** column name */
  | 'evaluatorAddress'
  /** column name */
  | 'evaluatorId'
  /** column name */
  | 'evaluator_id'
  /** column name */
  | 'id';

/** order by stddev() on columns of table "Evaluation" */
export type Evaluation_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Evaluation" */
export type Evaluation_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Evaluation" */
export type Evaluation_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Evaluation" */
export type Evaluation_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluation_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluation_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  commandCount?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  evaluationSequence?: InputMaybe<Scalars['numeric']['input']>;
  evaluationsData?: InputMaybe<Scalars['String']['input']>;
  evaluatorAddress?: InputMaybe<Scalars['String']['input']>;
  evaluatorId?: InputMaybe<Scalars['String']['input']>;
  evaluator_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "Evaluation" */
export type Evaluation_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Evaluation" */
export type Evaluation_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Evaluation" */
export type Evaluation_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Evaluation" */
export type Evaluation_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  commandCount?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  evaluationSequence?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "Evaluator" */
export type Evaluator_Aggregate_Order_By = {
  avg?: InputMaybe<Evaluator_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Evaluator_Max_Order_By>;
  min?: InputMaybe<Evaluator_Min_Order_By>;
  stddev?: InputMaybe<Evaluator_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Evaluator_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Evaluator_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Evaluator_Sum_Order_By>;
  var_pop?: InputMaybe<Evaluator_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Evaluator_Var_Samp_Order_By>;
  variance?: InputMaybe<Evaluator_Variance_Order_By>;
};

/** order by avg() on columns of table "Evaluator" */
export type Evaluator_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Evaluator". All fields are combined with a logical 'AND'. */
export type Evaluator_Bool_Exp = {
  _and?: InputMaybe<Array<Evaluator_Bool_Exp>>;
  _not?: InputMaybe<Evaluator_Bool_Exp>;
  _or?: InputMaybe<Array<Evaluator_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  evaluationCount?: InputMaybe<Numeric_Comparison_Exp>;
  evaluations?: InputMaybe<Evaluation_Bool_Exp>;
  evaluatorAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  kindSelector?: InputMaybe<String_Comparison_Exp>;
  lastEvaluatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "Evaluator" */
export type Evaluator_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  evaluatorAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Evaluator" */
export type Evaluator_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  evaluatorAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Evaluator". */
export type Evaluator_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  evaluations_aggregate?: InputMaybe<Evaluation_Aggregate_Order_By>;
  evaluatorAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "Evaluator" */
export type Evaluator_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'evaluationCount'
  /** column name */
  | 'evaluatorAddress'
  /** column name */
  | 'id'
  /** column name */
  | 'kindSelector'
  /** column name */
  | 'lastEvaluatedBlockNumber';

/** order by stddev() on columns of table "Evaluator" */
export type Evaluator_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Evaluator" */
export type Evaluator_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Evaluator" */
export type Evaluator_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Evaluator" */
export type Evaluator_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluator_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluator_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  evaluationCount?: InputMaybe<Scalars['numeric']['input']>;
  evaluatorAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  kindSelector?: InputMaybe<Scalars['String']['input']>;
  lastEvaluatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "Evaluator" */
export type Evaluator_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Evaluator" */
export type Evaluator_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Evaluator" */
export type Evaluator_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Evaluator" */
export type Evaluator_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  evaluationCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Aggregate_Order_By = {
  avg?: InputMaybe<GovernanceOraclePublisher_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<GovernanceOraclePublisher_Max_Order_By>;
  min?: InputMaybe<GovernanceOraclePublisher_Min_Order_By>;
  stddev?: InputMaybe<GovernanceOraclePublisher_Stddev_Order_By>;
  stddev_pop?: InputMaybe<GovernanceOraclePublisher_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<GovernanceOraclePublisher_Stddev_Samp_Order_By>;
  sum?: InputMaybe<GovernanceOraclePublisher_Sum_Order_By>;
  var_pop?: InputMaybe<GovernanceOraclePublisher_Var_Pop_Order_By>;
  var_samp?: InputMaybe<GovernanceOraclePublisher_Var_Samp_Order_By>;
  variance?: InputMaybe<GovernanceOraclePublisher_Variance_Order_By>;
};

/** order by avg() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "GovernanceOraclePublisher". All fields are combined with a logical 'AND'. */
export type GovernanceOraclePublisher_Bool_Exp = {
  _and?: InputMaybe<Array<GovernanceOraclePublisher_Bool_Exp>>;
  _not?: InputMaybe<GovernanceOraclePublisher_Bool_Exp>;
  _or?: InputMaybe<Array<GovernanceOraclePublisher_Bool_Exp>>;
  allowed?: InputMaybe<Boolean_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  governanceOracle?: InputMaybe<GovernanceOracle_Bool_Exp>;
  governanceOracleId?: InputMaybe<String_Comparison_Exp>;
  governanceOracle_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  publisherAddress?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  governanceOracleId?: InputMaybe<Order_By>;
  governanceOracle_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  publisherAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  governanceOracleId?: InputMaybe<Order_By>;
  governanceOracle_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  publisherAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "GovernanceOraclePublisher". */
export type GovernanceOraclePublisher_Order_By = {
  allowed?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  governanceOracle?: InputMaybe<GovernanceOracle_Order_By>;
  governanceOracleId?: InputMaybe<Order_By>;
  governanceOracle_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  publisherAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Select_Column =
  /** column name */
  | 'allowed'
  /** column name */
  | 'chainId'
  /** column name */
  | 'governanceOracleId'
  /** column name */
  | 'governanceOracle_id'
  /** column name */
  | 'id'
  /** column name */
  | 'publisherAddress'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GovernanceOraclePublisher_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GovernanceOraclePublisher_Stream_Cursor_Value_Input = {
  allowed?: InputMaybe<Scalars['Boolean']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  governanceOracleId?: InputMaybe<Scalars['String']['input']>;
  governanceOracle_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  publisherAddress?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "GovernanceOraclePublisher" */
export type GovernanceOraclePublisher_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "GovernanceOracle" */
export type GovernanceOracle_Aggregate_Order_By = {
  avg?: InputMaybe<GovernanceOracle_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<GovernanceOracle_Max_Order_By>;
  min?: InputMaybe<GovernanceOracle_Min_Order_By>;
  stddev?: InputMaybe<GovernanceOracle_Stddev_Order_By>;
  stddev_pop?: InputMaybe<GovernanceOracle_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<GovernanceOracle_Stddev_Samp_Order_By>;
  sum?: InputMaybe<GovernanceOracle_Sum_Order_By>;
  var_pop?: InputMaybe<GovernanceOracle_Var_Pop_Order_By>;
  var_samp?: InputMaybe<GovernanceOracle_Var_Samp_Order_By>;
  variance?: InputMaybe<GovernanceOracle_Variance_Order_By>;
};

/** order by avg() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "GovernanceOracle". All fields are combined with a logical 'AND'. */
export type GovernanceOracle_Bool_Exp = {
  _and?: InputMaybe<Array<GovernanceOracle_Bool_Exp>>;
  _not?: InputMaybe<GovernanceOracle_Bool_Exp>;
  _or?: InputMaybe<Array<GovernanceOracle_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  address?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  publishers?: InputMaybe<GovernanceOraclePublisher_Bool_Exp>;
  snapshots?: InputMaybe<OracleSnapshot_Bool_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Max_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Min_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "GovernanceOracle". */
export type GovernanceOracle_Order_By = {
  active?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  publishers_aggregate?: InputMaybe<GovernanceOraclePublisher_Aggregate_Order_By>;
  snapshots_aggregate?: InputMaybe<OracleSnapshot_Aggregate_Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "GovernanceOracle" */
export type GovernanceOracle_Select_Column =
  /** column name */
  | 'active'
  /** column name */
  | 'address'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'id'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "GovernanceOracle" */
export type GovernanceOracle_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GovernanceOracle_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GovernanceOracle_Stream_Cursor_Value_Input = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "GovernanceOracle" */
export type GovernanceOracle_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** order by aggregate values of table "MainTokenHolder" */
export type MainTokenHolder_Aggregate_Order_By = {
  avg?: InputMaybe<MainTokenHolder_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MainTokenHolder_Max_Order_By>;
  min?: InputMaybe<MainTokenHolder_Min_Order_By>;
  stddev?: InputMaybe<MainTokenHolder_Stddev_Order_By>;
  stddev_pop?: InputMaybe<MainTokenHolder_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<MainTokenHolder_Stddev_Samp_Order_By>;
  sum?: InputMaybe<MainTokenHolder_Sum_Order_By>;
  var_pop?: InputMaybe<MainTokenHolder_Var_Pop_Order_By>;
  var_samp?: InputMaybe<MainTokenHolder_Var_Samp_Order_By>;
  variance?: InputMaybe<MainTokenHolder_Variance_Order_By>;
};

/** order by avg() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Avg_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "MainTokenHolder". All fields are combined with a logical 'AND'. */
export type MainTokenHolder_Bool_Exp = {
  _and?: InputMaybe<Array<MainTokenHolder_Bool_Exp>>;
  _not?: InputMaybe<MainTokenHolder_Bool_Exp>;
  _or?: InputMaybe<Array<MainTokenHolder_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<String_Comparison_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  balance?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  isHolder?: InputMaybe<Boolean_Comparison_Exp>;
  lastTransferBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  totalReceivedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  totalSentAmount?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "MainTokenHolder". */
export type MainTokenHolder_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isHolder?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "MainTokenHolder" */
export type MainTokenHolder_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'account_id'
  /** column name */
  | 'balance'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'isHolder'
  /** column name */
  | 'lastTransferBlockNumber'
  /** column name */
  | 'totalReceivedAmount'
  /** column name */
  | 'totalSentAmount'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Stddev_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Stddev_Pop_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Stddev_Samp_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "MainTokenHolder" */
export type MainTokenHolder_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MainTokenHolder_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MainTokenHolder_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  balance?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isHolder?: InputMaybe<Scalars['Boolean']['input']>;
  lastTransferBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  totalReceivedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalSentAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Sum_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Var_Pop_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Var_Samp_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "MainTokenHolder" */
export type MainTokenHolder_Variance_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  lastTransferBlockNumber?: InputMaybe<Order_By>;
  totalReceivedAmount?: InputMaybe<Order_By>;
  totalSentAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "MerkleVote" */
export type MerkleVote_Aggregate_Order_By = {
  avg?: InputMaybe<MerkleVote_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MerkleVote_Max_Order_By>;
  min?: InputMaybe<MerkleVote_Min_Order_By>;
  stddev?: InputMaybe<MerkleVote_Stddev_Order_By>;
  stddev_pop?: InputMaybe<MerkleVote_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<MerkleVote_Stddev_Samp_Order_By>;
  sum?: InputMaybe<MerkleVote_Sum_Order_By>;
  var_pop?: InputMaybe<MerkleVote_Var_Pop_Order_By>;
  var_samp?: InputMaybe<MerkleVote_Var_Samp_Order_By>;
  variance?: InputMaybe<MerkleVote_Variance_Order_By>;
};

/** order by avg() on columns of table "MerkleVote" */
export type MerkleVote_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "MerkleVote". All fields are combined with a logical 'AND'. */
export type MerkleVote_Bool_Exp = {
  _and?: InputMaybe<Array<MerkleVote_Bool_Exp>>;
  _not?: InputMaybe<MerkleVote_Bool_Exp>;
  _or?: InputMaybe<Array<MerkleVote_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<String_Comparison_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dacProposal?: InputMaybe<DacProposal_Bool_Exp>;
  dacProposalId?: InputMaybe<String_Comparison_Exp>;
  dacProposal_id?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  merkleIndex?: InputMaybe<Numeric_Comparison_Exp>;
  support?: InputMaybe<Boolean_Comparison_Exp>;
  voter?: InputMaybe<String_Comparison_Exp>;
  weight?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "MerkleVote" */
export type MerkleVote_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  voter?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "MerkleVote" */
export type MerkleVote_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  voter?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "MerkleVote". */
export type MerkleVote_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dacProposal?: InputMaybe<DacProposal_Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  support?: InputMaybe<Order_By>;
  voter?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** select columns of table "MerkleVote" */
export type MerkleVote_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'account_id'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dacProposalId'
  /** column name */
  | 'dacProposal_id'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'id'
  /** column name */
  | 'merkleIndex'
  /** column name */
  | 'support'
  /** column name */
  | 'voter'
  /** column name */
  | 'weight';

/** order by stddev() on columns of table "MerkleVote" */
export type MerkleVote_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "MerkleVote" */
export type MerkleVote_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "MerkleVote" */
export type MerkleVote_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "MerkleVote" */
export type MerkleVote_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MerkleVote_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MerkleVote_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dacProposalId?: InputMaybe<Scalars['String']['input']>;
  dacProposal_id?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merkleIndex?: InputMaybe<Scalars['numeric']['input']>;
  support?: InputMaybe<Scalars['Boolean']['input']>;
  voter?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "MerkleVote" */
export type MerkleVote_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "MerkleVote" */
export type MerkleVote_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "MerkleVote" */
export type MerkleVote_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "MerkleVote" */
export type MerkleVote_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  merkleIndex?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ModuleFactory". All fields are combined with a logical 'AND'. */
export type ModuleFactory_Bool_Exp = {
  _and?: InputMaybe<Array<ModuleFactory_Bool_Exp>>;
  _not?: InputMaybe<ModuleFactory_Bool_Exp>;
  _or?: InputMaybe<Array<ModuleFactory_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dacModules?: InputMaybe<DacModule_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  knownImplementation?: InputMaybe<Boolean_Comparison_Exp>;
  manifestUri?: InputMaybe<String_Comparison_Exp>;
  moduleIdHex?: InputMaybe<String_Comparison_Exp>;
  moduleIdText?: InputMaybe<String_Comparison_Exp>;
  moduleVersion?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "ModuleFactory". */
export type ModuleFactory_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacModules_aggregate?: InputMaybe<DacModule_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  knownImplementation?: InputMaybe<Order_By>;
  manifestUri?: InputMaybe<Order_By>;
  moduleIdHex?: InputMaybe<Order_By>;
  moduleIdText?: InputMaybe<Order_By>;
  moduleVersion?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "ModuleFactory" */
export type ModuleFactory_Select_Column =
  /** column name */
  | 'address'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'id'
  /** column name */
  | 'knownImplementation'
  /** column name */
  | 'manifestUri'
  /** column name */
  | 'moduleIdHex'
  /** column name */
  | 'moduleIdText'
  /** column name */
  | 'moduleVersion'
  /** column name */
  | 'updatedBlockNumber';

/** Streaming cursor of the table "ModuleFactory" */
export type ModuleFactory_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ModuleFactory_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ModuleFactory_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  knownImplementation?: InputMaybe<Scalars['Boolean']['input']>;
  manifestUri?: InputMaybe<Scalars['String']['input']>;
  moduleIdHex?: InputMaybe<Scalars['String']['input']>;
  moduleIdText?: InputMaybe<Scalars['String']['input']>;
  moduleVersion?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by aggregate values of table "OffchainActionApproval" */
export type OffchainActionApproval_Aggregate_Order_By = {
  avg?: InputMaybe<OffchainActionApproval_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<OffchainActionApproval_Max_Order_By>;
  min?: InputMaybe<OffchainActionApproval_Min_Order_By>;
  stddev?: InputMaybe<OffchainActionApproval_Stddev_Order_By>;
  stddev_pop?: InputMaybe<OffchainActionApproval_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<OffchainActionApproval_Stddev_Samp_Order_By>;
  sum?: InputMaybe<OffchainActionApproval_Sum_Order_By>;
  var_pop?: InputMaybe<OffchainActionApproval_Var_Pop_Order_By>;
  var_samp?: InputMaybe<OffchainActionApproval_Var_Samp_Order_By>;
  variance?: InputMaybe<OffchainActionApproval_Variance_Order_By>;
};

/** order by avg() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "OffchainActionApproval". All fields are combined with a logical 'AND'. */
export type OffchainActionApproval_Bool_Exp = {
  _and?: InputMaybe<Array<OffchainActionApproval_Bool_Exp>>;
  _not?: InputMaybe<OffchainActionApproval_Bool_Exp>;
  _or?: InputMaybe<Array<OffchainActionApproval_Bool_Exp>>;
  actionSelector?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  data?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Max_Order_By = {
  actionSelector?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Min_Order_By = {
  actionSelector?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "OffchainActionApproval". */
export type OffchainActionApproval_Order_By = {
  actionSelector?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** select columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Select_Column =
  /** column name */
  | 'actionSelector'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'data'
  /** column name */
  | 'id'
  /** column name */
  | 'proposalNumericId';

/** order by stddev() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "OffchainActionApproval" */
export type OffchainActionApproval_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: OffchainActionApproval_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type OffchainActionApproval_Stream_Cursor_Value_Input = {
  actionSelector?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "OffchainActionApproval" */
export type OffchainActionApproval_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "OracleSnapshot" */
export type OracleSnapshot_Aggregate_Order_By = {
  avg?: InputMaybe<OracleSnapshot_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<OracleSnapshot_Max_Order_By>;
  min?: InputMaybe<OracleSnapshot_Min_Order_By>;
  stddev?: InputMaybe<OracleSnapshot_Stddev_Order_By>;
  stddev_pop?: InputMaybe<OracleSnapshot_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<OracleSnapshot_Stddev_Samp_Order_By>;
  sum?: InputMaybe<OracleSnapshot_Sum_Order_By>;
  var_pop?: InputMaybe<OracleSnapshot_Var_Pop_Order_By>;
  var_samp?: InputMaybe<OracleSnapshot_Var_Samp_Order_By>;
  variance?: InputMaybe<OracleSnapshot_Variance_Order_By>;
};

/** order by avg() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "OracleSnapshot". All fields are combined with a logical 'AND'. */
export type OracleSnapshot_Bool_Exp = {
  _and?: InputMaybe<Array<OracleSnapshot_Bool_Exp>>;
  _not?: InputMaybe<OracleSnapshot_Bool_Exp>;
  _or?: InputMaybe<Array<OracleSnapshot_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dacProposal?: InputMaybe<DacProposal_Bool_Exp>;
  dacProposalId?: InputMaybe<String_Comparison_Exp>;
  dacProposal_id?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  governanceOracle?: InputMaybe<GovernanceOracle_Bool_Exp>;
  governanceOracleId?: InputMaybe<String_Comparison_Exp>;
  governanceOracle_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  merkleRoot?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  publishedAt?: InputMaybe<Numeric_Comparison_Exp>;
  snapshotBlock?: InputMaybe<Numeric_Comparison_Exp>;
  totalUnderlyingVotingPower?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  governanceOracleId?: InputMaybe<Order_By>;
  governanceOracle_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleRoot?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  governanceOracleId?: InputMaybe<Order_By>;
  governanceOracle_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleRoot?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "OracleSnapshot". */
export type OracleSnapshot_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dacProposal?: InputMaybe<DacProposal_Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  governanceOracle?: InputMaybe<GovernanceOracle_Order_By>;
  governanceOracleId?: InputMaybe<Order_By>;
  governanceOracle_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merkleRoot?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** select columns of table "OracleSnapshot" */
export type OracleSnapshot_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dacProposalId'
  /** column name */
  | 'dacProposal_id'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'governanceOracleId'
  /** column name */
  | 'governanceOracle_id'
  /** column name */
  | 'id'
  /** column name */
  | 'merkleRoot'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'publishedAt'
  /** column name */
  | 'snapshotBlock'
  /** column name */
  | 'totalUnderlyingVotingPower';

/** order by stddev() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "OracleSnapshot" */
export type OracleSnapshot_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: OracleSnapshot_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type OracleSnapshot_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dacProposalId?: InputMaybe<Scalars['String']['input']>;
  dacProposal_id?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  governanceOracleId?: InputMaybe<Scalars['String']['input']>;
  governanceOracle_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merkleRoot?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  publishedAt?: InputMaybe<Scalars['numeric']['input']>;
  snapshotBlock?: InputMaybe<Scalars['numeric']['input']>;
  totalUnderlyingVotingPower?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "OracleSnapshot" */
export type OracleSnapshot_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  publishedAt?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  totalUnderlyingVotingPower?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ProposalLookup". All fields are combined with a logical 'AND'. */
export type ProposalLookup_Bool_Exp = {
  _and?: InputMaybe<Array<ProposalLookup_Bool_Exp>>;
  _not?: InputMaybe<ProposalLookup_Bool_Exp>;
  _or?: InputMaybe<Array<ProposalLookup_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  ownerId?: InputMaybe<String_Comparison_Exp>;
  proposal?: InputMaybe<Proposal_Bool_Exp>;
  proposalId?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  proposal_id?: InputMaybe<String_Comparison_Exp>;
  scope?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "ProposalLookup". */
export type ProposalLookup_Order_By = {
  chainId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ownerId?: InputMaybe<Order_By>;
  proposal?: InputMaybe<Proposal_Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  scope?: InputMaybe<Order_By>;
};

/** select columns of table "ProposalLookup" */
export type ProposalLookup_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'id'
  /** column name */
  | 'ownerId'
  /** column name */
  | 'proposalId'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'proposal_id'
  /** column name */
  | 'scope';

/** Streaming cursor of the table "ProposalLookup" */
export type ProposalLookup_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ProposalLookup_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ProposalLookup_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['String']['input']>;
  proposalId?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  proposal_id?: InputMaybe<Scalars['String']['input']>;
  scope?: InputMaybe<Scalars['String']['input']>;
};

/** order by aggregate values of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Aggregate_Order_By = {
  avg?: InputMaybe<ProposalPhaseEvent_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<ProposalPhaseEvent_Max_Order_By>;
  min?: InputMaybe<ProposalPhaseEvent_Min_Order_By>;
  stddev?: InputMaybe<ProposalPhaseEvent_Stddev_Order_By>;
  stddev_pop?: InputMaybe<ProposalPhaseEvent_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<ProposalPhaseEvent_Stddev_Samp_Order_By>;
  sum?: InputMaybe<ProposalPhaseEvent_Sum_Order_By>;
  var_pop?: InputMaybe<ProposalPhaseEvent_Var_Pop_Order_By>;
  var_samp?: InputMaybe<ProposalPhaseEvent_Var_Samp_Order_By>;
  variance?: InputMaybe<ProposalPhaseEvent_Variance_Order_By>;
};

/** order by avg() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Avg_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ProposalPhaseEvent". All fields are combined with a logical 'AND'. */
export type ProposalPhaseEvent_Bool_Exp = {
  _and?: InputMaybe<Array<ProposalPhaseEvent_Bool_Exp>>;
  _not?: InputMaybe<ProposalPhaseEvent_Bool_Exp>;
  _or?: InputMaybe<Array<ProposalPhaseEvent_Bool_Exp>>;
  blockingQuorum?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dacProposal?: InputMaybe<DacProposal_Bool_Exp>;
  dacProposalId?: InputMaybe<String_Comparison_Exp>;
  dacProposal_id?: InputMaybe<String_Comparison_Exp>;
  endTime?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  phase?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  quorum?: InputMaybe<Numeric_Comparison_Exp>;
  snapshotBlock?: InputMaybe<Numeric_Comparison_Exp>;
  startTime?: InputMaybe<Numeric_Comparison_Exp>;
  totalVotingPower?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Max_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  phase?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Min_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  phase?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "ProposalPhaseEvent". */
export type ProposalPhaseEvent_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacProposal?: InputMaybe<DacProposal_Order_By>;
  dacProposalId?: InputMaybe<Order_By>;
  dacProposal_id?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  phase?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** select columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Select_Column =
  /** column name */
  | 'blockingQuorum'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacProposalId'
  /** column name */
  | 'dacProposal_id'
  /** column name */
  | 'endTime'
  /** column name */
  | 'id'
  /** column name */
  | 'phase'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'quorum'
  /** column name */
  | 'snapshotBlock'
  /** column name */
  | 'startTime'
  /** column name */
  | 'totalVotingPower';

/** order by stddev() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Stddev_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Stddev_Pop_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Stddev_Samp_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ProposalPhaseEvent_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ProposalPhaseEvent_Stream_Cursor_Value_Input = {
  blockingQuorum?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacProposalId?: InputMaybe<Scalars['String']['input']>;
  dacProposal_id?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  phase?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  quorum?: InputMaybe<Scalars['numeric']['input']>;
  snapshotBlock?: InputMaybe<Scalars['numeric']['input']>;
  startTime?: InputMaybe<Scalars['numeric']['input']>;
  totalVotingPower?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Sum_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Var_Pop_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Var_Samp_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "ProposalPhaseEvent" */
export type ProposalPhaseEvent_Variance_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  snapshotBlock?: InputMaybe<Order_By>;
  startTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "ProposalVote" */
export type ProposalVote_Aggregate_Order_By = {
  avg?: InputMaybe<ProposalVote_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<ProposalVote_Max_Order_By>;
  min?: InputMaybe<ProposalVote_Min_Order_By>;
  stddev?: InputMaybe<ProposalVote_Stddev_Order_By>;
  stddev_pop?: InputMaybe<ProposalVote_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<ProposalVote_Stddev_Samp_Order_By>;
  sum?: InputMaybe<ProposalVote_Sum_Order_By>;
  var_pop?: InputMaybe<ProposalVote_Var_Pop_Order_By>;
  var_samp?: InputMaybe<ProposalVote_Var_Samp_Order_By>;
  variance?: InputMaybe<ProposalVote_Variance_Order_By>;
};

/** order by avg() on columns of table "ProposalVote" */
export type ProposalVote_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ProposalVote". All fields are combined with a logical 'AND'. */
export type ProposalVote_Bool_Exp = {
  _and?: InputMaybe<Array<ProposalVote_Bool_Exp>>;
  _not?: InputMaybe<ProposalVote_Bool_Exp>;
  _or?: InputMaybe<Array<ProposalVote_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  proposal?: InputMaybe<Proposal_Bool_Exp>;
  proposalAddress?: InputMaybe<String_Comparison_Exp>;
  proposalId?: InputMaybe<String_Comparison_Exp>;
  proposal_id?: InputMaybe<String_Comparison_Exp>;
  support?: InputMaybe<Boolean_Comparison_Exp>;
  voteChannel?: InputMaybe<String_Comparison_Exp>;
  voter?: InputMaybe<String_Comparison_Exp>;
  weight?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "ProposalVote" */
export type ProposalVote_Max_Order_By = {
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalAddress?: InputMaybe<Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  voteChannel?: InputMaybe<Order_By>;
  voter?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "ProposalVote" */
export type ProposalVote_Min_Order_By = {
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalAddress?: InputMaybe<Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  voteChannel?: InputMaybe<Order_By>;
  voter?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "ProposalVote". */
export type ProposalVote_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  account_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposal?: InputMaybe<Proposal_Order_By>;
  proposalAddress?: InputMaybe<Order_By>;
  proposalId?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  support?: InputMaybe<Order_By>;
  voteChannel?: InputMaybe<Order_By>;
  voter?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** select columns of table "ProposalVote" */
export type ProposalVote_Select_Column =
  /** column name */
  | 'account_id'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'id'
  /** column name */
  | 'proposalAddress'
  /** column name */
  | 'proposalId'
  /** column name */
  | 'proposal_id'
  /** column name */
  | 'support'
  /** column name */
  | 'voteChannel'
  /** column name */
  | 'voter'
  /** column name */
  | 'weight';

/** order by stddev() on columns of table "ProposalVote" */
export type ProposalVote_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "ProposalVote" */
export type ProposalVote_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "ProposalVote" */
export type ProposalVote_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "ProposalVote" */
export type ProposalVote_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ProposalVote_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ProposalVote_Stream_Cursor_Value_Input = {
  account_id?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  proposalAddress?: InputMaybe<Scalars['String']['input']>;
  proposalId?: InputMaybe<Scalars['String']['input']>;
  proposal_id?: InputMaybe<Scalars['String']['input']>;
  support?: InputMaybe<Scalars['Boolean']['input']>;
  voteChannel?: InputMaybe<Scalars['String']['input']>;
  voter?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "ProposalVote" */
export type ProposalVote_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "ProposalVote" */
export type ProposalVote_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "ProposalVote" */
export type ProposalVote_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "ProposalVote" */
export type ProposalVote_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  weight?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "Proposal" */
export type Proposal_Aggregate_Order_By = {
  avg?: InputMaybe<Proposal_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Proposal_Max_Order_By>;
  min?: InputMaybe<Proposal_Min_Order_By>;
  stddev?: InputMaybe<Proposal_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Proposal_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Proposal_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Proposal_Sum_Order_By>;
  var_pop?: InputMaybe<Proposal_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Proposal_Var_Samp_Order_By>;
  variance?: InputMaybe<Proposal_Variance_Order_By>;
};

/** order by avg() on columns of table "Proposal" */
export type Proposal_Avg_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Proposal". All fields are combined with a logical 'AND'. */
export type Proposal_Bool_Exp = {
  _and?: InputMaybe<Array<Proposal_Bool_Exp>>;
  _not?: InputMaybe<Proposal_Bool_Exp>;
  _or?: InputMaybe<Array<Proposal_Bool_Exp>>;
  blockingQuorum?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  challenged?: InputMaybe<Boolean_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  currentPhase?: InputMaybe<String_Comparison_Exp>;
  currentPhaseSnapshotBlock?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  data1?: InputMaybe<String_Comparison_Exp>;
  data2?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  endTime?: InputMaybe<Numeric_Comparison_Exp>;
  executed?: InputMaybe<Boolean_Comparison_Exp>;
  executedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  executionDeadline?: InputMaybe<Numeric_Comparison_Exp>;
  executionExpired?: InputMaybe<Boolean_Comparison_Exp>;
  executionValidityDuration?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  kindName?: InputMaybe<String_Comparison_Exp>;
  kindSelector?: InputMaybe<String_Comparison_Exp>;
  merkleVoteCount?: InputMaybe<Numeric_Comparison_Exp>;
  noVotes?: InputMaybe<Numeric_Comparison_Exp>;
  passed?: InputMaybe<Boolean_Comparison_Exp>;
  phaseEndTime?: InputMaybe<Numeric_Comparison_Exp>;
  phaseStartTime?: InputMaybe<Numeric_Comparison_Exp>;
  proposalAddress?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  proposalVariant?: InputMaybe<String_Comparison_Exp>;
  quorum?: InputMaybe<Numeric_Comparison_Exp>;
  resolutionTime?: InputMaybe<Numeric_Comparison_Exp>;
  resolved?: InputMaybe<Boolean_Comparison_Exp>;
  resolvedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  scope?: InputMaybe<String_Comparison_Exp>;
  snapshotReference?: InputMaybe<Numeric_Comparison_Exp>;
  snapshotReferenceKind?: InputMaybe<String_Comparison_Exp>;
  snapshotTime?: InputMaybe<Numeric_Comparison_Exp>;
  targetAddress?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  totalVotingPower?: InputMaybe<Numeric_Comparison_Exp>;
  voteCount?: InputMaybe<Numeric_Comparison_Exp>;
  votes?: InputMaybe<ProposalVote_Bool_Exp>;
  yesVotes?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "Proposal" */
export type Proposal_Max_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  currentPhase?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data1?: InputMaybe<Order_By>;
  data2?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindName?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalAddress?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  proposalVariant?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  scope?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotReferenceKind?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  targetAddress?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Proposal" */
export type Proposal_Min_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  currentPhase?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data1?: InputMaybe<Order_By>;
  data2?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindName?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalAddress?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  proposalVariant?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  scope?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotReferenceKind?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  targetAddress?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Proposal". */
export type Proposal_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  challenged?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  currentPhase?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data1?: InputMaybe<Order_By>;
  data2?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executed?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionExpired?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindName?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  passed?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalAddress?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  proposalVariant?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolved?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  scope?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotReferenceKind?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  targetAddress?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  votes_aggregate?: InputMaybe<ProposalVote_Aggregate_Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** select columns of table "Proposal" */
export type Proposal_Select_Column =
  /** column name */
  | 'blockingQuorum'
  /** column name */
  | 'chainId'
  /** column name */
  | 'challenged'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'currentPhase'
  /** column name */
  | 'currentPhaseSnapshotBlock'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'data1'
  /** column name */
  | 'data2'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'endTime'
  /** column name */
  | 'executed'
  /** column name */
  | 'executedBlockNumber'
  /** column name */
  | 'executionDeadline'
  /** column name */
  | 'executionExpired'
  /** column name */
  | 'executionValidityDuration'
  /** column name */
  | 'id'
  /** column name */
  | 'kindName'
  /** column name */
  | 'kindSelector'
  /** column name */
  | 'merkleVoteCount'
  /** column name */
  | 'noVotes'
  /** column name */
  | 'passed'
  /** column name */
  | 'phaseEndTime'
  /** column name */
  | 'phaseStartTime'
  /** column name */
  | 'proposalAddress'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'proposalVariant'
  /** column name */
  | 'quorum'
  /** column name */
  | 'resolutionTime'
  /** column name */
  | 'resolved'
  /** column name */
  | 'resolvedBlockNumber'
  /** column name */
  | 'scope'
  /** column name */
  | 'snapshotReference'
  /** column name */
  | 'snapshotReferenceKind'
  /** column name */
  | 'snapshotTime'
  /** column name */
  | 'targetAddress'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'totalVotingPower'
  /** column name */
  | 'voteCount'
  /** column name */
  | 'yesVotes';

/** order by stddev() on columns of table "Proposal" */
export type Proposal_Stddev_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Proposal" */
export type Proposal_Stddev_Pop_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Proposal" */
export type Proposal_Stddev_Samp_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Proposal" */
export type Proposal_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Proposal_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Proposal_Stream_Cursor_Value_Input = {
  blockingQuorum?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  challenged?: InputMaybe<Scalars['Boolean']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  currentPhase?: InputMaybe<Scalars['String']['input']>;
  currentPhaseSnapshotBlock?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  data1?: InputMaybe<Scalars['String']['input']>;
  data2?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['numeric']['input']>;
  executed?: InputMaybe<Scalars['Boolean']['input']>;
  executedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  executionDeadline?: InputMaybe<Scalars['numeric']['input']>;
  executionExpired?: InputMaybe<Scalars['Boolean']['input']>;
  executionValidityDuration?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  kindName?: InputMaybe<Scalars['String']['input']>;
  kindSelector?: InputMaybe<Scalars['String']['input']>;
  merkleVoteCount?: InputMaybe<Scalars['numeric']['input']>;
  noVotes?: InputMaybe<Scalars['numeric']['input']>;
  passed?: InputMaybe<Scalars['Boolean']['input']>;
  phaseEndTime?: InputMaybe<Scalars['numeric']['input']>;
  phaseStartTime?: InputMaybe<Scalars['numeric']['input']>;
  proposalAddress?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  proposalVariant?: InputMaybe<Scalars['String']['input']>;
  quorum?: InputMaybe<Scalars['numeric']['input']>;
  resolutionTime?: InputMaybe<Scalars['numeric']['input']>;
  resolved?: InputMaybe<Scalars['Boolean']['input']>;
  resolvedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  scope?: InputMaybe<Scalars['String']['input']>;
  snapshotReference?: InputMaybe<Scalars['numeric']['input']>;
  snapshotReferenceKind?: InputMaybe<Scalars['String']['input']>;
  snapshotTime?: InputMaybe<Scalars['numeric']['input']>;
  targetAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  totalVotingPower?: InputMaybe<Scalars['numeric']['input']>;
  voteCount?: InputMaybe<Scalars['numeric']['input']>;
  yesVotes?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "Proposal" */
export type Proposal_Sum_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Proposal" */
export type Proposal_Var_Pop_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Proposal" */
export type Proposal_Var_Samp_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Proposal" */
export type Proposal_Variance_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentPhaseSnapshotBlock?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  executionDeadline?: InputMaybe<Order_By>;
  executionValidityDuration?: InputMaybe<Order_By>;
  merkleVoteCount?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  phaseEndTime?: InputMaybe<Order_By>;
  phaseStartTime?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolutionTime?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  snapshotReference?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "RelatedContractIndex". All fields are combined with a logical 'AND'. */
export type RelatedContractIndex_Bool_Exp = {
  _and?: InputMaybe<Array<RelatedContractIndex_Bool_Exp>>;
  _not?: InputMaybe<RelatedContractIndex_Bool_Exp>;
  _or?: InputMaybe<Array<RelatedContractIndex_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  roleHex?: InputMaybe<String_Comparison_Exp>;
  roleText?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "RelatedContractIndex". */
export type RelatedContractIndex_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  roleHex?: InputMaybe<Order_By>;
  roleText?: InputMaybe<Order_By>;
};

/** select columns of table "RelatedContractIndex" */
export type RelatedContractIndex_Select_Column =
  /** column name */
  | 'address'
  /** column name */
  | 'chainId'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'roleHex'
  /** column name */
  | 'roleText';

/** Streaming cursor of the table "RelatedContractIndex" */
export type RelatedContractIndex_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RelatedContractIndex_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RelatedContractIndex_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  roleHex?: InputMaybe<Scalars['String']['input']>;
  roleText?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "TokenContractIndex". All fields are combined with a logical 'AND'. */
export type TokenContractIndex_Bool_Exp = {
  _and?: InputMaybe<Array<TokenContractIndex_Bool_Exp>>;
  _not?: InputMaybe<TokenContractIndex_Bool_Exp>;
  _or?: InputMaybe<Array<TokenContractIndex_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  tokenType?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "TokenContractIndex". */
export type TokenContractIndex_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenType?: InputMaybe<Order_By>;
};

/** select columns of table "TokenContractIndex" */
export type TokenContractIndex_Select_Column =
  /** column name */
  | 'address'
  /** column name */
  | 'chainId'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'tokenType';

/** Streaming cursor of the table "TokenContractIndex" */
export type TokenContractIndex_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TokenContractIndex_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TokenContractIndex_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  tokenType?: InputMaybe<Scalars['String']['input']>;
};

/** order by aggregate values of table "Tranche" */
export type Tranche_Aggregate_Order_By = {
  avg?: InputMaybe<Tranche_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Tranche_Max_Order_By>;
  min?: InputMaybe<Tranche_Min_Order_By>;
  stddev?: InputMaybe<Tranche_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Tranche_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Tranche_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Tranche_Sum_Order_By>;
  var_pop?: InputMaybe<Tranche_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Tranche_Var_Samp_Order_By>;
  variance?: InputMaybe<Tranche_Variance_Order_By>;
};

/** order by avg() on columns of table "Tranche" */
export type Tranche_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Tranche". All fields are combined with a logical 'AND'. */
export type Tranche_Bool_Exp = {
  _and?: InputMaybe<Array<Tranche_Bool_Exp>>;
  _not?: InputMaybe<Tranche_Bool_Exp>;
  _or?: InputMaybe<Array<Tranche_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  isInitialTranche?: InputMaybe<Boolean_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  requestedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  rewardsLimit?: InputMaybe<Numeric_Comparison_Exp>;
  settled?: InputMaybe<Boolean_Comparison_Exp>;
  settledAmount?: InputMaybe<Numeric_Comparison_Exp>;
  settledBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  trancheNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "Tranche" */
export type Tranche_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Tranche" */
export type Tranche_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Tranche". */
export type Tranche_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isInitialTranche?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settled?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "Tranche" */
export type Tranche_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'isInitialTranche'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'requestedAmount'
  /** column name */
  | 'rewardsLimit'
  /** column name */
  | 'settled'
  /** column name */
  | 'settledAmount'
  /** column name */
  | 'settledBlockNumber'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'trancheNumericId'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "Tranche" */
export type Tranche_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Tranche" */
export type Tranche_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Tranche" */
export type Tranche_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Tranche" */
export type Tranche_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Tranche_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Tranche_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isInitialTranche?: InputMaybe<Scalars['Boolean']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  requestedAmount?: InputMaybe<Scalars['numeric']['input']>;
  rewardsLimit?: InputMaybe<Scalars['numeric']['input']>;
  settled?: InputMaybe<Scalars['Boolean']['input']>;
  settledAmount?: InputMaybe<Scalars['numeric']['input']>;
  settledBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  trancheNumericId?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "Tranche" */
export type Tranche_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Tranche" */
export type Tranche_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Tranche" */
export type Tranche_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Tranche" */
export type Tranche_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  requestedAmount?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  settledAmount?: InputMaybe<Order_By>;
  settledBlockNumber?: InputMaybe<Order_By>;
  trancheNumericId?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "TreasuryAction" */
export type TreasuryAction_Aggregate_Order_By = {
  avg?: InputMaybe<TreasuryAction_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<TreasuryAction_Max_Order_By>;
  min?: InputMaybe<TreasuryAction_Min_Order_By>;
  stddev?: InputMaybe<TreasuryAction_Stddev_Order_By>;
  stddev_pop?: InputMaybe<TreasuryAction_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<TreasuryAction_Stddev_Samp_Order_By>;
  sum?: InputMaybe<TreasuryAction_Sum_Order_By>;
  var_pop?: InputMaybe<TreasuryAction_Var_Pop_Order_By>;
  var_samp?: InputMaybe<TreasuryAction_Var_Samp_Order_By>;
  variance?: InputMaybe<TreasuryAction_Variance_Order_By>;
};

/** order by avg() on columns of table "TreasuryAction" */
export type TreasuryAction_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "TreasuryAction". All fields are combined with a logical 'AND'. */
export type TreasuryAction_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryAction_Bool_Exp>>;
  _not?: InputMaybe<TreasuryAction_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryAction_Bool_Exp>>;
  actionType?: InputMaybe<String_Comparison_Exp>;
  agent?: InputMaybe<String_Comparison_Exp>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  counterpartyAddress?: InputMaybe<String_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  dealSize?: InputMaybe<Numeric_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  destinationAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  sourceAddress?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  treasuryAddress?: InputMaybe<String_Comparison_Exp>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Bool_Exp>;
  treasuryDealId?: InputMaybe<String_Comparison_Exp>;
  treasuryDeal_id?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "TreasuryAction" */
export type TreasuryAction_Max_Order_By = {
  actionType?: InputMaybe<Order_By>;
  agent?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  destinationAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sourceAddress?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryAddress?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "TreasuryAction" */
export type TreasuryAction_Min_Order_By = {
  actionType?: InputMaybe<Order_By>;
  agent?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  destinationAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sourceAddress?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryAddress?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "TreasuryAction". */
export type TreasuryAction_Order_By = {
  actionType?: InputMaybe<Order_By>;
  agent?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  destinationAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sourceAddress?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryAddress?: InputMaybe<Order_By>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryAction" */
export type TreasuryAction_Select_Column =
  /** column name */
  | 'actionType'
  /** column name */
  | 'agent'
  /** column name */
  | 'amount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'counterpartyAddress'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dealId'
  /** column name */
  | 'dealSize'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'destinationAddress'
  /** column name */
  | 'id'
  /** column name */
  | 'sourceAddress'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'treasuryAddress'
  /** column name */
  | 'treasuryDealId'
  /** column name */
  | 'treasuryDeal_id';

/** order by stddev() on columns of table "TreasuryAction" */
export type TreasuryAction_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "TreasuryAction" */
export type TreasuryAction_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "TreasuryAction" */
export type TreasuryAction_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "TreasuryAction" */
export type TreasuryAction_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryAction_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryAction_Stream_Cursor_Value_Input = {
  actionType?: InputMaybe<Scalars['String']['input']>;
  agent?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  counterpartyAddress?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  dealSize?: InputMaybe<Scalars['numeric']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  destinationAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  sourceAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  treasuryAddress?: InputMaybe<Scalars['String']['input']>;
  treasuryDealId?: InputMaybe<Scalars['String']['input']>;
  treasuryDeal_id?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "TreasuryAction" */
export type TreasuryAction_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "TreasuryAction" */
export type TreasuryAction_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "TreasuryAction" */
export type TreasuryAction_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "TreasuryAction" */
export type TreasuryAction_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  dealSize?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "TreasuryAgent" */
export type TreasuryAgent_Aggregate_Order_By = {
  avg?: InputMaybe<TreasuryAgent_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<TreasuryAgent_Max_Order_By>;
  min?: InputMaybe<TreasuryAgent_Min_Order_By>;
  stddev?: InputMaybe<TreasuryAgent_Stddev_Order_By>;
  stddev_pop?: InputMaybe<TreasuryAgent_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<TreasuryAgent_Stddev_Samp_Order_By>;
  sum?: InputMaybe<TreasuryAgent_Sum_Order_By>;
  var_pop?: InputMaybe<TreasuryAgent_Var_Pop_Order_By>;
  var_samp?: InputMaybe<TreasuryAgent_Var_Samp_Order_By>;
  variance?: InputMaybe<TreasuryAgent_Variance_Order_By>;
};

/** order by avg() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "TreasuryAgent". All fields are combined with a logical 'AND'. */
export type TreasuryAgent_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryAgent_Bool_Exp>>;
  _not?: InputMaybe<TreasuryAgent_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryAgent_Bool_Exp>>;
  agentAddress?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  isActive?: InputMaybe<Boolean_Comparison_Exp>;
  spendAllowances?: InputMaybe<TreasuryAllowance_Bool_Exp>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Bool_Exp>;
  treasuryDealId?: InputMaybe<String_Comparison_Exp>;
  treasuryDeal_id?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Max_Order_By = {
  agentAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Min_Order_By = {
  agentAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "TreasuryAgent". */
export type TreasuryAgent_Order_By = {
  agentAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isActive?: InputMaybe<Order_By>;
  spendAllowances_aggregate?: InputMaybe<TreasuryAllowance_Aggregate_Order_By>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryAgent" */
export type TreasuryAgent_Select_Column =
  /** column name */
  | 'agentAddress'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'treasuryDealId'
  /** column name */
  | 'treasuryDeal_id'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "TreasuryAgent" */
export type TreasuryAgent_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryAgent_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryAgent_Stream_Cursor_Value_Input = {
  agentAddress?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  treasuryDealId?: InputMaybe<Scalars['String']['input']>;
  treasuryDeal_id?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "TreasuryAgent" */
export type TreasuryAgent_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "TreasuryAllowance" */
export type TreasuryAllowance_Aggregate_Order_By = {
  avg?: InputMaybe<TreasuryAllowance_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<TreasuryAllowance_Max_Order_By>;
  min?: InputMaybe<TreasuryAllowance_Min_Order_By>;
  stddev?: InputMaybe<TreasuryAllowance_Stddev_Order_By>;
  stddev_pop?: InputMaybe<TreasuryAllowance_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<TreasuryAllowance_Stddev_Samp_Order_By>;
  sum?: InputMaybe<TreasuryAllowance_Sum_Order_By>;
  var_pop?: InputMaybe<TreasuryAllowance_Var_Pop_Order_By>;
  var_samp?: InputMaybe<TreasuryAllowance_Var_Samp_Order_By>;
  variance?: InputMaybe<TreasuryAllowance_Variance_Order_By>;
};

/** order by avg() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "TreasuryAllowance". All fields are combined with a logical 'AND'. */
export type TreasuryAllowance_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryAllowance_Bool_Exp>>;
  _not?: InputMaybe<TreasuryAllowance_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryAllowance_Bool_Exp>>;
  agent?: InputMaybe<TreasuryAgent_Bool_Exp>;
  agentAddress?: InputMaybe<String_Comparison_Exp>;
  agentId?: InputMaybe<String_Comparison_Exp>;
  agent_id?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  counterpartyAddress?: InputMaybe<String_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  isActive?: InputMaybe<Boolean_Comparison_Exp>;
  isWildcard?: InputMaybe<Boolean_Comparison_Exp>;
  receipts?: InputMaybe<TreasuryReceipt_Bool_Exp>;
  receiveClockLimit?: InputMaybe<Numeric_Comparison_Exp>;
  receiveDuration?: InputMaybe<Numeric_Comparison_Exp>;
  receiveSingleTxAmount?: InputMaybe<Numeric_Comparison_Exp>;
  remainingReceive?: InputMaybe<Numeric_Comparison_Exp>;
  remainingSpend?: InputMaybe<Numeric_Comparison_Exp>;
  revokedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  spendClockLimit?: InputMaybe<Numeric_Comparison_Exp>;
  spendDuration?: InputMaybe<Numeric_Comparison_Exp>;
  spendSingleTxAmount?: InputMaybe<Numeric_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  totalReceiveAllowed?: InputMaybe<Numeric_Comparison_Exp>;
  totalReceived?: InputMaybe<Numeric_Comparison_Exp>;
  totalSpendAllowed?: InputMaybe<Numeric_Comparison_Exp>;
  totalSpent?: InputMaybe<Numeric_Comparison_Exp>;
  transactionCount?: InputMaybe<Int_Comparison_Exp>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Bool_Exp>;
  treasuryDealId?: InputMaybe<String_Comparison_Exp>;
  treasuryDeal_id?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Max_Order_By = {
  agentAddress?: InputMaybe<Order_By>;
  agentId?: InputMaybe<Order_By>;
  agent_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Min_Order_By = {
  agentAddress?: InputMaybe<Order_By>;
  agentId?: InputMaybe<Order_By>;
  agent_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "TreasuryAllowance". */
export type TreasuryAllowance_Order_By = {
  agent?: InputMaybe<TreasuryAgent_Order_By>;
  agentAddress?: InputMaybe<Order_By>;
  agentId?: InputMaybe<Order_By>;
  agent_id?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isActive?: InputMaybe<Order_By>;
  isWildcard?: InputMaybe<Order_By>;
  receipts_aggregate?: InputMaybe<TreasuryReceipt_Aggregate_Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Select_Column =
  /** column name */
  | 'agentAddress'
  /** column name */
  | 'agentId'
  /** column name */
  | 'agent_id'
  /** column name */
  | 'chainId'
  /** column name */
  | 'counterpartyAddress'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isWildcard'
  /** column name */
  | 'receiveClockLimit'
  /** column name */
  | 'receiveDuration'
  /** column name */
  | 'receiveSingleTxAmount'
  /** column name */
  | 'remainingReceive'
  /** column name */
  | 'remainingSpend'
  /** column name */
  | 'revokedBlockNumber'
  /** column name */
  | 'spendClockLimit'
  /** column name */
  | 'spendDuration'
  /** column name */
  | 'spendSingleTxAmount'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'totalReceiveAllowed'
  /** column name */
  | 'totalReceived'
  /** column name */
  | 'totalSpendAllowed'
  /** column name */
  | 'totalSpent'
  /** column name */
  | 'transactionCount'
  /** column name */
  | 'treasuryDealId'
  /** column name */
  | 'treasuryDeal_id'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "TreasuryAllowance" */
export type TreasuryAllowance_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryAllowance_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryAllowance_Stream_Cursor_Value_Input = {
  agentAddress?: InputMaybe<Scalars['String']['input']>;
  agentId?: InputMaybe<Scalars['String']['input']>;
  agent_id?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  counterpartyAddress?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isWildcard?: InputMaybe<Scalars['Boolean']['input']>;
  receiveClockLimit?: InputMaybe<Scalars['numeric']['input']>;
  receiveDuration?: InputMaybe<Scalars['numeric']['input']>;
  receiveSingleTxAmount?: InputMaybe<Scalars['numeric']['input']>;
  remainingReceive?: InputMaybe<Scalars['numeric']['input']>;
  remainingSpend?: InputMaybe<Scalars['numeric']['input']>;
  revokedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  spendClockLimit?: InputMaybe<Scalars['numeric']['input']>;
  spendDuration?: InputMaybe<Scalars['numeric']['input']>;
  spendSingleTxAmount?: InputMaybe<Scalars['numeric']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  totalReceiveAllowed?: InputMaybe<Scalars['numeric']['input']>;
  totalReceived?: InputMaybe<Scalars['numeric']['input']>;
  totalSpendAllowed?: InputMaybe<Scalars['numeric']['input']>;
  totalSpent?: InputMaybe<Scalars['numeric']['input']>;
  transactionCount?: InputMaybe<Scalars['Int']['input']>;
  treasuryDealId?: InputMaybe<Scalars['String']['input']>;
  treasuryDeal_id?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "TreasuryAllowance" */
export type TreasuryAllowance_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  receiveClockLimit?: InputMaybe<Order_By>;
  receiveDuration?: InputMaybe<Order_By>;
  receiveSingleTxAmount?: InputMaybe<Order_By>;
  remainingReceive?: InputMaybe<Order_By>;
  remainingSpend?: InputMaybe<Order_By>;
  revokedBlockNumber?: InputMaybe<Order_By>;
  spendClockLimit?: InputMaybe<Order_By>;
  spendDuration?: InputMaybe<Order_By>;
  spendSingleTxAmount?: InputMaybe<Order_By>;
  totalReceiveAllowed?: InputMaybe<Order_By>;
  totalReceived?: InputMaybe<Order_By>;
  totalSpendAllowed?: InputMaybe<Order_By>;
  totalSpent?: InputMaybe<Order_By>;
  transactionCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "TreasuryDeal" */
export type TreasuryDeal_Aggregate_Order_By = {
  avg?: InputMaybe<TreasuryDeal_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<TreasuryDeal_Max_Order_By>;
  min?: InputMaybe<TreasuryDeal_Min_Order_By>;
  stddev?: InputMaybe<TreasuryDeal_Stddev_Order_By>;
  stddev_pop?: InputMaybe<TreasuryDeal_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<TreasuryDeal_Stddev_Samp_Order_By>;
  sum?: InputMaybe<TreasuryDeal_Sum_Order_By>;
  var_pop?: InputMaybe<TreasuryDeal_Var_Pop_Order_By>;
  var_samp?: InputMaybe<TreasuryDeal_Var_Samp_Order_By>;
  variance?: InputMaybe<TreasuryDeal_Variance_Order_By>;
};

/** order by avg() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "TreasuryDeal". All fields are combined with a logical 'AND'. */
export type TreasuryDeal_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryDeal_Bool_Exp>>;
  _not?: InputMaybe<TreasuryDeal_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryDeal_Bool_Exp>>;
  agents?: InputMaybe<TreasuryAgent_Bool_Exp>;
  allowances?: InputMaybe<TreasuryAllowance_Bool_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  delegations?: InputMaybe<TreasuryDelegation_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  managedTreasuryAddress?: InputMaybe<String_Comparison_Exp>;
  receipts?: InputMaybe<TreasuryReceipt_Bool_Exp>;
  treasuryActions?: InputMaybe<TreasuryAction_Bool_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  managedTreasuryAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  managedTreasuryAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "TreasuryDeal". */
export type TreasuryDeal_Order_By = {
  agents_aggregate?: InputMaybe<TreasuryAgent_Aggregate_Order_By>;
  allowances_aggregate?: InputMaybe<TreasuryAllowance_Aggregate_Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  delegations_aggregate?: InputMaybe<TreasuryDelegation_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  managedTreasuryAddress?: InputMaybe<Order_By>;
  receipts_aggregate?: InputMaybe<TreasuryReceipt_Aggregate_Order_By>;
  treasuryActions_aggregate?: InputMaybe<TreasuryAction_Aggregate_Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryDeal" */
export type TreasuryDeal_Select_Column =
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'id'
  /** column name */
  | 'managedTreasuryAddress'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "TreasuryDeal" */
export type TreasuryDeal_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryDeal_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryDeal_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  managedTreasuryAddress?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "TreasuryDeal" */
export type TreasuryDeal_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "TreasuryDelegation" */
export type TreasuryDelegation_Aggregate_Order_By = {
  avg?: InputMaybe<TreasuryDelegation_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<TreasuryDelegation_Max_Order_By>;
  min?: InputMaybe<TreasuryDelegation_Min_Order_By>;
  stddev?: InputMaybe<TreasuryDelegation_Stddev_Order_By>;
  stddev_pop?: InputMaybe<TreasuryDelegation_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<TreasuryDelegation_Stddev_Samp_Order_By>;
  sum?: InputMaybe<TreasuryDelegation_Sum_Order_By>;
  var_pop?: InputMaybe<TreasuryDelegation_Var_Pop_Order_By>;
  var_samp?: InputMaybe<TreasuryDelegation_Var_Samp_Order_By>;
  variance?: InputMaybe<TreasuryDelegation_Variance_Order_By>;
};

/** order by avg() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "TreasuryDelegation". All fields are combined with a logical 'AND'. */
export type TreasuryDelegation_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryDelegation_Bool_Exp>>;
  _not?: InputMaybe<TreasuryDelegation_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryDelegation_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  delegatedTokenAddress?: InputMaybe<String_Comparison_Exp>;
  delegateeAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Bool_Exp>;
  treasuryDealId?: InputMaybe<String_Comparison_Exp>;
  treasuryDeal_id?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  delegatedTokenAddress?: InputMaybe<Order_By>;
  delegateeAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  delegatedTokenAddress?: InputMaybe<Order_By>;
  delegateeAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "TreasuryDelegation". */
export type TreasuryDelegation_Order_By = {
  active?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  delegatedTokenAddress?: InputMaybe<Order_By>;
  delegateeAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Select_Column =
  /** column name */
  | 'active'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'delegatedTokenAddress'
  /** column name */
  | 'delegateeAddress'
  /** column name */
  | 'id'
  /** column name */
  | 'treasuryDealId'
  /** column name */
  | 'treasuryDeal_id'
  /** column name */
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "TreasuryDelegation" */
export type TreasuryDelegation_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryDelegation_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryDelegation_Stream_Cursor_Value_Input = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  delegatedTokenAddress?: InputMaybe<Scalars['String']['input']>;
  delegateeAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  treasuryDealId?: InputMaybe<Scalars['String']['input']>;
  treasuryDeal_id?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "TreasuryDelegation" */
export type TreasuryDelegation_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "TreasuryHolding" */
export type TreasuryHolding_Aggregate_Order_By = {
  avg?: InputMaybe<TreasuryHolding_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<TreasuryHolding_Max_Order_By>;
  min?: InputMaybe<TreasuryHolding_Min_Order_By>;
  stddev?: InputMaybe<TreasuryHolding_Stddev_Order_By>;
  stddev_pop?: InputMaybe<TreasuryHolding_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<TreasuryHolding_Stddev_Samp_Order_By>;
  sum?: InputMaybe<TreasuryHolding_Sum_Order_By>;
  var_pop?: InputMaybe<TreasuryHolding_Var_Pop_Order_By>;
  var_samp?: InputMaybe<TreasuryHolding_Var_Samp_Order_By>;
  variance?: InputMaybe<TreasuryHolding_Variance_Order_By>;
};

/** order by avg() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Avg_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "TreasuryHolding". All fields are combined with a logical 'AND'. */
export type TreasuryHolding_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryHolding_Bool_Exp>>;
  _not?: InputMaybe<TreasuryHolding_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryHolding_Bool_Exp>>;
  assetControllerAddress?: InputMaybe<String_Comparison_Exp>;
  balance?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  committedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  creditedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  debitedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  freeAmount?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  treasuryHolderAddress?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Max_Order_By = {
  assetControllerAddress?: InputMaybe<Order_By>;
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryHolderAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Min_Order_By = {
  assetControllerAddress?: InputMaybe<Order_By>;
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryHolderAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "TreasuryHolding". */
export type TreasuryHolding_Order_By = {
  assetControllerAddress?: InputMaybe<Order_By>;
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryHolderAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryHolding" */
export type TreasuryHolding_Select_Column =
  /** column name */
  | 'assetControllerAddress'
  /** column name */
  | 'balance'
  /** column name */
  | 'chainId'
  /** column name */
  | 'committedAmount'
  /** column name */
  | 'creditedAmount'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'debitedAmount'
  /** column name */
  | 'freeAmount'
  /** column name */
  | 'id'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'treasuryHolderAddress'
  /** column name */
  | 'updatedBlockNumber'
  /** column name */
  | 'updatedBlockTimestamp';

/** order by stddev() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Stddev_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Stddev_Pop_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Stddev_Samp_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "TreasuryHolding" */
export type TreasuryHolding_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryHolding_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryHolding_Stream_Cursor_Value_Input = {
  assetControllerAddress?: InputMaybe<Scalars['String']['input']>;
  balance?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  committedAmount?: InputMaybe<Scalars['numeric']['input']>;
  creditedAmount?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  debitedAmount?: InputMaybe<Scalars['numeric']['input']>;
  freeAmount?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  treasuryHolderAddress?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Sum_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Var_Pop_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Var_Samp_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Variance_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  committedAmount?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  freeAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "TreasuryMovement". All fields are combined with a logical 'AND'. */
export type TreasuryMovement_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryMovement_Bool_Exp>>;
  _not?: InputMaybe<TreasuryMovement_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryMovement_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  assetControllerAddress?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  counterpartyAddress?: InputMaybe<String_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  deal?: InputMaybe<Deal_Bool_Exp>;
  dealId?: InputMaybe<String_Comparison_Exp>;
  deal_id?: InputMaybe<String_Comparison_Exp>;
  direction?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  movementType?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  treasuryHolderAddress?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "TreasuryMovement". */
export type TreasuryMovement_Order_By = {
  amount?: InputMaybe<Order_By>;
  assetControllerAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  deal?: InputMaybe<Deal_Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  direction?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  movementType?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryHolderAddress?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryMovement" */
export type TreasuryMovement_Select_Column =
  /** column name */
  | 'amount'
  /** column name */
  | 'assetControllerAddress'
  /** column name */
  | 'chainId'
  /** column name */
  | 'counterpartyAddress'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'dealId'
  /** column name */
  | 'deal_id'
  /** column name */
  | 'direction'
  /** column name */
  | 'id'
  /** column name */
  | 'movementType'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'treasuryHolderAddress';

/** Streaming cursor of the table "TreasuryMovement" */
export type TreasuryMovement_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryMovement_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryMovement_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  assetControllerAddress?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  counterpartyAddress?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  movementType?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  treasuryHolderAddress?: InputMaybe<Scalars['String']['input']>;
};

/** order by aggregate values of table "TreasuryReceipt" */
export type TreasuryReceipt_Aggregate_Order_By = {
  avg?: InputMaybe<TreasuryReceipt_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<TreasuryReceipt_Max_Order_By>;
  min?: InputMaybe<TreasuryReceipt_Min_Order_By>;
  stddev?: InputMaybe<TreasuryReceipt_Stddev_Order_By>;
  stddev_pop?: InputMaybe<TreasuryReceipt_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<TreasuryReceipt_Stddev_Samp_Order_By>;
  sum?: InputMaybe<TreasuryReceipt_Sum_Order_By>;
  var_pop?: InputMaybe<TreasuryReceipt_Var_Pop_Order_By>;
  var_samp?: InputMaybe<TreasuryReceipt_Var_Samp_Order_By>;
  variance?: InputMaybe<TreasuryReceipt_Variance_Order_By>;
};

/** order by avg() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "TreasuryReceipt". All fields are combined with a logical 'AND'. */
export type TreasuryReceipt_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryReceipt_Bool_Exp>>;
  _not?: InputMaybe<TreasuryReceipt_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryReceipt_Bool_Exp>>;
  agentAddress?: InputMaybe<String_Comparison_Exp>;
  allowance?: InputMaybe<TreasuryAllowance_Bool_Exp>;
  allowanceId?: InputMaybe<String_Comparison_Exp>;
  allowance_id?: InputMaybe<String_Comparison_Exp>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  counterpartyAddress?: InputMaybe<String_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  direction?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Bool_Exp>;
  treasuryDealId?: InputMaybe<String_Comparison_Exp>;
  treasuryDeal_id?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Max_Order_By = {
  agentAddress?: InputMaybe<Order_By>;
  allowanceId?: InputMaybe<Order_By>;
  allowance_id?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  direction?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Min_Order_By = {
  agentAddress?: InputMaybe<Order_By>;
  allowanceId?: InputMaybe<Order_By>;
  allowance_id?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  direction?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "TreasuryReceipt". */
export type TreasuryReceipt_Order_By = {
  agentAddress?: InputMaybe<Order_By>;
  allowance?: InputMaybe<TreasuryAllowance_Order_By>;
  allowanceId?: InputMaybe<Order_By>;
  allowance_id?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  counterpartyAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  direction?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  treasuryDeal?: InputMaybe<TreasuryDeal_Order_By>;
  treasuryDealId?: InputMaybe<Order_By>;
  treasuryDeal_id?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Select_Column =
  /** column name */
  | 'agentAddress'
  /** column name */
  | 'allowanceId'
  /** column name */
  | 'allowance_id'
  /** column name */
  | 'amount'
  /** column name */
  | 'chainId'
  /** column name */
  | 'counterpartyAddress'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'direction'
  /** column name */
  | 'id'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'treasuryDealId'
  /** column name */
  | 'treasuryDeal_id';

/** order by stddev() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "TreasuryReceipt" */
export type TreasuryReceipt_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TreasuryReceipt_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TreasuryReceipt_Stream_Cursor_Value_Input = {
  agentAddress?: InputMaybe<Scalars['String']['input']>;
  allowanceId?: InputMaybe<Scalars['String']['input']>;
  allowance_id?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  counterpartyAddress?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  treasuryDealId?: InputMaybe<Scalars['String']['input']>;
  treasuryDeal_id?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "TreasuryReceipt" */
export type TreasuryReceipt_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by aggregate values of table "WrapperAction" */
export type WrapperAction_Aggregate_Order_By = {
  avg?: InputMaybe<WrapperAction_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<WrapperAction_Max_Order_By>;
  min?: InputMaybe<WrapperAction_Min_Order_By>;
  stddev?: InputMaybe<WrapperAction_Stddev_Order_By>;
  stddev_pop?: InputMaybe<WrapperAction_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<WrapperAction_Stddev_Samp_Order_By>;
  sum?: InputMaybe<WrapperAction_Sum_Order_By>;
  var_pop?: InputMaybe<WrapperAction_Var_Pop_Order_By>;
  var_samp?: InputMaybe<WrapperAction_Var_Samp_Order_By>;
  variance?: InputMaybe<WrapperAction_Variance_Order_By>;
};

/** order by avg() on columns of table "WrapperAction" */
export type WrapperAction_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "WrapperAction". All fields are combined with a logical 'AND'. */
export type WrapperAction_Bool_Exp = {
  _and?: InputMaybe<Array<WrapperAction_Bool_Exp>>;
  _not?: InputMaybe<WrapperAction_Bool_Exp>;
  _or?: InputMaybe<Array<WrapperAction_Bool_Exp>>;
  actionType?: InputMaybe<String_Comparison_Exp>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  caller?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  recipient?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "WrapperAction" */
export type WrapperAction_Max_Order_By = {
  actionType?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  caller?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipient?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "WrapperAction" */
export type WrapperAction_Min_Order_By = {
  actionType?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  caller?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipient?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "WrapperAction". */
export type WrapperAction_Order_By = {
  actionType?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  caller?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipient?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
};

/** select columns of table "WrapperAction" */
export type WrapperAction_Select_Column =
  /** column name */
  | 'actionType'
  /** column name */
  | 'amount'
  /** column name */
  | 'caller'
  /** column name */
  | 'chainId'
  /** column name */
  | 'createdBlockNumber'
  /** column name */
  | 'createdBlockTimestamp'
  /** column name */
  | 'createdTransactionHash'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'id'
  /** column name */
  | 'recipient'
  /** column name */
  | 'tokenAddress';

/** order by stddev() on columns of table "WrapperAction" */
export type WrapperAction_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "WrapperAction" */
export type WrapperAction_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "WrapperAction" */
export type WrapperAction_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "WrapperAction" */
export type WrapperAction_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: WrapperAction_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type WrapperAction_Stream_Cursor_Value_Input = {
  actionType?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['numeric']['input']>;
  caller?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  recipient?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "WrapperAction" */
export type WrapperAction_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "WrapperAction" */
export type WrapperAction_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "WrapperAction" */
export type WrapperAction_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "WrapperAction" */
export type WrapperAction_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "_meta". All fields are combined with a logical 'AND'. */
export type _Meta_Bool_Exp = {
  _and?: InputMaybe<Array<_Meta_Bool_Exp>>;
  _not?: InputMaybe<_Meta_Bool_Exp>;
  _or?: InputMaybe<Array<_Meta_Bool_Exp>>;
  bufferBlock?: InputMaybe<Int_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  endBlock?: InputMaybe<Int_Comparison_Exp>;
  eventsProcessed?: InputMaybe<Int_Comparison_Exp>;
  firstEventBlock?: InputMaybe<Int_Comparison_Exp>;
  isReady?: InputMaybe<Boolean_Comparison_Exp>;
  progressBlock?: InputMaybe<Int_Comparison_Exp>;
  readyAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  sourceBlock?: InputMaybe<Int_Comparison_Exp>;
  startBlock?: InputMaybe<Int_Comparison_Exp>;
};

/** Ordering options when selecting data from "_meta". */
export type _Meta_Order_By = {
  bufferBlock?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  endBlock?: InputMaybe<Order_By>;
  eventsProcessed?: InputMaybe<Order_By>;
  firstEventBlock?: InputMaybe<Order_By>;
  isReady?: InputMaybe<Order_By>;
  progressBlock?: InputMaybe<Order_By>;
  readyAt?: InputMaybe<Order_By>;
  sourceBlock?: InputMaybe<Order_By>;
  startBlock?: InputMaybe<Order_By>;
};

/** select columns of table "_meta" */
export type _Meta_Select_Column =
  /** column name */
  | 'bufferBlock'
  /** column name */
  | 'chainId'
  /** column name */
  | 'endBlock'
  /** column name */
  | 'eventsProcessed'
  /** column name */
  | 'firstEventBlock'
  /** column name */
  | 'isReady'
  /** column name */
  | 'progressBlock'
  /** column name */
  | 'readyAt'
  /** column name */
  | 'sourceBlock'
  /** column name */
  | 'startBlock';

/** Streaming cursor of the table "_meta" */
export type _Meta_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: _Meta_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type _Meta_Stream_Cursor_Value_Input = {
  bufferBlock?: InputMaybe<Scalars['Int']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  endBlock?: InputMaybe<Scalars['Int']['input']>;
  eventsProcessed?: InputMaybe<Scalars['Int']['input']>;
  firstEventBlock?: InputMaybe<Scalars['Int']['input']>;
  isReady?: InputMaybe<Scalars['Boolean']['input']>;
  progressBlock?: InputMaybe<Scalars['Int']['input']>;
  readyAt?: InputMaybe<Scalars['timestamptz']['input']>;
  sourceBlock?: InputMaybe<Scalars['Int']['input']>;
  startBlock?: InputMaybe<Scalars['Int']['input']>;
};

/** Boolean expression to filter rows from the table "chain_metadata". All fields are combined with a logical 'AND'. */
export type Chain_Metadata_Bool_Exp = {
  _and?: InputMaybe<Array<Chain_Metadata_Bool_Exp>>;
  _not?: InputMaybe<Chain_Metadata_Bool_Exp>;
  _or?: InputMaybe<Array<Chain_Metadata_Bool_Exp>>;
  block_height?: InputMaybe<Int_Comparison_Exp>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  end_block?: InputMaybe<Int_Comparison_Exp>;
  first_event_block_number?: InputMaybe<Int_Comparison_Exp>;
  is_hyper_sync?: InputMaybe<Boolean_Comparison_Exp>;
  latest_fetched_block_number?: InputMaybe<Int_Comparison_Exp>;
  latest_processed_block?: InputMaybe<Int_Comparison_Exp>;
  num_batches_fetched?: InputMaybe<Int_Comparison_Exp>;
  num_events_processed?: InputMaybe<Int_Comparison_Exp>;
  start_block?: InputMaybe<Int_Comparison_Exp>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** Ordering options when selecting data from "chain_metadata". */
export type Chain_Metadata_Order_By = {
  block_height?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
  end_block?: InputMaybe<Order_By>;
  first_event_block_number?: InputMaybe<Order_By>;
  is_hyper_sync?: InputMaybe<Order_By>;
  latest_fetched_block_number?: InputMaybe<Order_By>;
  latest_processed_block?: InputMaybe<Order_By>;
  num_batches_fetched?: InputMaybe<Order_By>;
  num_events_processed?: InputMaybe<Order_By>;
  start_block?: InputMaybe<Order_By>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Order_By>;
};

/** select columns of table "chain_metadata" */
export type Chain_Metadata_Select_Column =
  /** column name */
  | 'block_height'
  /** column name */
  | 'chain_id'
  /** column name */
  | 'end_block'
  /** column name */
  | 'first_event_block_number'
  /** column name */
  | 'is_hyper_sync'
  /** column name */
  | 'latest_fetched_block_number'
  /** column name */
  | 'latest_processed_block'
  /** column name */
  | 'num_batches_fetched'
  /** column name */
  | 'num_events_processed'
  /** column name */
  | 'start_block'
  /** column name */
  | 'timestamp_caught_up_to_head_or_endblock';

/** Streaming cursor of the table "chain_metadata" */
export type Chain_Metadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Chain_Metadata_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Chain_Metadata_Stream_Cursor_Value_Input = {
  block_height?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  end_block?: InputMaybe<Scalars['Int']['input']>;
  first_event_block_number?: InputMaybe<Scalars['Int']['input']>;
  is_hyper_sync?: InputMaybe<Scalars['Boolean']['input']>;
  latest_fetched_block_number?: InputMaybe<Scalars['Int']['input']>;
  latest_processed_block?: InputMaybe<Scalars['Int']['input']>;
  num_batches_fetched?: InputMaybe<Scalars['Int']['input']>;
  num_events_processed?: InputMaybe<Scalars['Int']['input']>;
  start_block?: InputMaybe<Scalars['Int']['input']>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** ordering argument of a cursor */
export type Cursor_Ordering =
  /** ascending ordering of the cursor */
  | 'ASC'
  /** descending ordering of the cursor */
  | 'DESC';

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export type Order_By =
  /** in ascending order, nulls last */
  | 'asc'
  /** in ascending order, nulls first */
  | 'asc_nulls_first'
  /** in ascending order, nulls last */
  | 'asc_nulls_last'
  /** in descending order, nulls first */
  | 'desc'
  /** in descending order, nulls first */
  | 'desc_nulls_first'
  /** in descending order, nulls last */
  | 'desc_nulls_last';

/** Boolean expression to filter rows from the table "raw_events". All fields are combined with a logical 'AND'. */
export type Raw_Events_Bool_Exp = {
  _and?: InputMaybe<Array<Raw_Events_Bool_Exp>>;
  _not?: InputMaybe<Raw_Events_Bool_Exp>;
  _or?: InputMaybe<Array<Raw_Events_Bool_Exp>>;
  block_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  block_hash?: InputMaybe<String_Comparison_Exp>;
  block_number?: InputMaybe<Int_Comparison_Exp>;
  block_timestamp?: InputMaybe<Int_Comparison_Exp>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  contract_name?: InputMaybe<String_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
  event_name?: InputMaybe<String_Comparison_Exp>;
  log_index?: InputMaybe<Int_Comparison_Exp>;
  params?: InputMaybe<Jsonb_Comparison_Exp>;
  serial?: InputMaybe<Int_Comparison_Exp>;
  src_address?: InputMaybe<String_Comparison_Exp>;
  transaction_fields?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** Ordering options when selecting data from "raw_events". */
export type Raw_Events_Order_By = {
  block_fields?: InputMaybe<Order_By>;
  block_hash?: InputMaybe<Order_By>;
  block_number?: InputMaybe<Order_By>;
  block_timestamp?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
  contract_name?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  event_name?: InputMaybe<Order_By>;
  log_index?: InputMaybe<Order_By>;
  params?: InputMaybe<Order_By>;
  serial?: InputMaybe<Order_By>;
  src_address?: InputMaybe<Order_By>;
  transaction_fields?: InputMaybe<Order_By>;
};

/** select columns of table "raw_events" */
export type Raw_Events_Select_Column =
  /** column name */
  | 'block_fields'
  /** column name */
  | 'block_hash'
  /** column name */
  | 'block_number'
  /** column name */
  | 'block_timestamp'
  /** column name */
  | 'chain_id'
  /** column name */
  | 'contract_name'
  /** column name */
  | 'event_id'
  /** column name */
  | 'event_name'
  /** column name */
  | 'log_index'
  /** column name */
  | 'params'
  /** column name */
  | 'serial'
  /** column name */
  | 'src_address'
  /** column name */
  | 'transaction_fields';

/** Streaming cursor of the table "raw_events" */
export type Raw_Events_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Raw_Events_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Raw_Events_Stream_Cursor_Value_Input = {
  block_fields?: InputMaybe<Scalars['jsonb']['input']>;
  block_hash?: InputMaybe<Scalars['String']['input']>;
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  contract_name?: InputMaybe<Scalars['String']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  event_name?: InputMaybe<Scalars['String']['input']>;
  log_index?: InputMaybe<Scalars['Int']['input']>;
  params?: InputMaybe<Scalars['jsonb']['input']>;
  serial?: InputMaybe<Scalars['Int']['input']>;
  src_address?: InputMaybe<Scalars['String']['input']>;
  transaction_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

export type MainTokenHolderViewFieldsFragment = { __typename?: 'MainTokenHolder', id: string, chainId: number, dacId: string, dealId?: string | null, accountId: string, balance: string, totalReceivedAmount: string, totalSentAmount: string, isHolder: boolean, createdBlockNumber: string, updatedBlockNumber: string, lastTransferBlockNumber?: string | null };

export type DacAgentViewFieldsFragment = { __typename?: 'DacAgent', id: string, chainId: number, dacId: string, accountId: string, walletAgentTokenAmount: string, totalMintedAmount: string, totalRevokedAmount: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedAmount: string, totalSlashedAmount: string, totalClaimedMainTokenAmount: string, activeDealCount: string, isActive: boolean, createdBlockNumber: string, updatedBlockNumber: string, lastActivityBlockNumber?: string | null };

export type DealAgentPositionViewFieldsFragment = { __typename?: 'DealAgentPosition', id: string, chainId: number, dacId: string, dealId: string, dacAgentId: string, accountId: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedAmount: string, totalSlashedAmount: string, totalClaimedMainTokenAmount: string, isActive: boolean, createdBlockNumber: string, updatedBlockNumber: string, lastStakedBlockNumber?: string | null, lastReleasedBlockNumber?: string | null, lastSlashedBlockNumber?: string | null, lastClaimedRewardBlockNumber?: string | null };

export type DacGovernanceAccountViewFieldsFragment = { __typename?: 'DacGovernanceAccount', id: string, chainId: number, dacId: string, accountId: string, delegateAddress?: string | null, currentVotingPower: string, hasVotingPower: boolean, createdBlockNumber: string, updatedBlockNumber: string };

export type DealGovernanceAccountViewFieldsFragment = { __typename?: 'DealGovernanceAccount', id: string, chainId: number, dacId: string, dealId: string, accountId: string, delegateAddress?: string | null, currentVotingPower: string, hasVotingPower: boolean, createdBlockNumber: string, updatedBlockNumber: string };

export type GetAccountByAddressQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetAccountByAddressQuery = { __typename?: 'query_root', Account: Array<{ __typename?: 'Account', id: string, chainId: number, address: string, createdBlockNumber: string, updatedBlockNumber: string, mainTokenHoldings: Array<{ __typename?: 'MainTokenHolder', id: string, chainId: number, dacId: string, dealId?: string | null, accountId: string, balance: string, totalReceivedAmount: string, totalSentAmount: string, isHolder: boolean, createdBlockNumber: string, updatedBlockNumber: string, lastTransferBlockNumber?: string | null }>, dacGovernanceAccounts: Array<{ __typename?: 'DacGovernanceAccount', id: string, chainId: number, dacId: string, accountId: string, delegateAddress?: string | null, currentVotingPower: string, hasVotingPower: boolean, createdBlockNumber: string, updatedBlockNumber: string }>, dacAgents: Array<{ __typename?: 'DacAgent', id: string, chainId: number, dacId: string, accountId: string, walletAgentTokenAmount: string, totalMintedAmount: string, totalRevokedAmount: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedAmount: string, totalSlashedAmount: string, totalClaimedMainTokenAmount: string, activeDealCount: string, isActive: boolean, createdBlockNumber: string, updatedBlockNumber: string, lastActivityBlockNumber?: string | null }>, dealAgentPositions: Array<{ __typename?: 'DealAgentPosition', id: string, chainId: number, dacId: string, dealId: string, dacAgentId: string, accountId: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedAmount: string, totalSlashedAmount: string, totalClaimedMainTokenAmount: string, isActive: boolean, createdBlockNumber: string, updatedBlockNumber: string, lastStakedBlockNumber?: string | null, lastReleasedBlockNumber?: string | null, lastSlashedBlockNumber?: string | null, lastClaimedRewardBlockNumber?: string | null }>, dealGovernanceAccounts: Array<{ __typename?: 'DealGovernanceAccount', id: string, chainId: number, dacId: string, dealId: string, accountId: string, delegateAddress?: string | null, currentVotingPower: string, hasVotingPower: boolean, createdBlockNumber: string, updatedBlockNumber: string }> }> };

export type DacViewFieldsFragment = { __typename?: 'Dac', id: string, chainId: number, address: string, mode: string, name?: string | null, description?: string | null, creator?: string | null, mainTokenAddress?: string | null, wrappedMainTokenAddress?: string | null, underlyingTokenAddress?: string | null, agentTokenAddress?: string | null, dealManagerAddress?: string | null, moduleRegistryAddress?: string | null, assetControllerAddress?: string | null, governanceSchemaAddress?: string | null, governanceOracleAddress?: string | null, treasuryHolderAddress?: string | null, treasurySeedAmount?: string | null, legalWrapperAddress?: string | null, legalWrapperOperatingAgreementIpfs?: string | null, legalWrapperRegisteredAgent?: string | null, coreModuleFactoryAddress?: string | null, started: boolean, dividendsEnabled: boolean, votingQuorumPercent?: string | null, votingBlockingPercent?: string | null, votingHighQuorumPercent?: string | null, votingDuration?: string | null, votingQualification?: string | null, executionValidityDuration?: string | null, dealCreationMinAgentBalance?: string | null, dealCreationMinInitialAgentStake?: string | null, oraclePublishDeadline?: string | null, fallbackWarmupDuration?: string | null, fallbackDuration?: string | null, blockingOnAllProposals: boolean, blockingOnHighQuorum: boolean, oraclePrimaryEnabled: boolean, supportsMint: boolean, supportsBurn: boolean, supportsCapitalCall: boolean, supportsWrap: boolean, supportsUnwrap: boolean, supportsReserveBackedClaims: boolean, proposalCount: string, executedProposalCount: string, dealCount: string, activeDealCount: string, moduleCount: string, capitalCallCount: string, mainTokenHolderCount: string, releasedMainTokenAmount: string, mainTokenObligations: string, salt?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, updatedBlockNumber: string, updatedBlockTimestamp?: string | null };

export type GetDacByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetDacByIdQuery = { __typename?: 'query_root', Dac: Array<{ __typename?: 'Dac', id: string, chainId: number, address: string, mode: string, name?: string | null, description?: string | null, creator?: string | null, mainTokenAddress?: string | null, wrappedMainTokenAddress?: string | null, underlyingTokenAddress?: string | null, agentTokenAddress?: string | null, dealManagerAddress?: string | null, moduleRegistryAddress?: string | null, assetControllerAddress?: string | null, governanceSchemaAddress?: string | null, governanceOracleAddress?: string | null, treasuryHolderAddress?: string | null, treasurySeedAmount?: string | null, legalWrapperAddress?: string | null, legalWrapperOperatingAgreementIpfs?: string | null, legalWrapperRegisteredAgent?: string | null, coreModuleFactoryAddress?: string | null, started: boolean, dividendsEnabled: boolean, votingQuorumPercent?: string | null, votingBlockingPercent?: string | null, votingHighQuorumPercent?: string | null, votingDuration?: string | null, votingQualification?: string | null, executionValidityDuration?: string | null, dealCreationMinAgentBalance?: string | null, dealCreationMinInitialAgentStake?: string | null, oraclePublishDeadline?: string | null, fallbackWarmupDuration?: string | null, fallbackDuration?: string | null, blockingOnAllProposals: boolean, blockingOnHighQuorum: boolean, oraclePrimaryEnabled: boolean, supportsMint: boolean, supportsBurn: boolean, supportsCapitalCall: boolean, supportsWrap: boolean, supportsUnwrap: boolean, supportsReserveBackedClaims: boolean, proposalCount: string, executedProposalCount: string, dealCount: string, activeDealCount: string, moduleCount: string, capitalCallCount: string, mainTokenHolderCount: string, releasedMainTokenAmount: string, mainTokenObligations: string, salt?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, updatedBlockNumber: string, updatedBlockTimestamp?: string | null }> };

export type GetDacByAddressQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetDacByAddressQuery = { __typename?: 'query_root', Dac: Array<{ __typename?: 'Dac', id: string, chainId: number, address: string, mode: string, name?: string | null, description?: string | null, creator?: string | null, mainTokenAddress?: string | null, wrappedMainTokenAddress?: string | null, underlyingTokenAddress?: string | null, agentTokenAddress?: string | null, dealManagerAddress?: string | null, moduleRegistryAddress?: string | null, assetControllerAddress?: string | null, governanceSchemaAddress?: string | null, governanceOracleAddress?: string | null, treasuryHolderAddress?: string | null, treasurySeedAmount?: string | null, legalWrapperAddress?: string | null, legalWrapperOperatingAgreementIpfs?: string | null, legalWrapperRegisteredAgent?: string | null, coreModuleFactoryAddress?: string | null, started: boolean, dividendsEnabled: boolean, votingQuorumPercent?: string | null, votingBlockingPercent?: string | null, votingHighQuorumPercent?: string | null, votingDuration?: string | null, votingQualification?: string | null, executionValidityDuration?: string | null, dealCreationMinAgentBalance?: string | null, dealCreationMinInitialAgentStake?: string | null, oraclePublishDeadline?: string | null, fallbackWarmupDuration?: string | null, fallbackDuration?: string | null, blockingOnAllProposals: boolean, blockingOnHighQuorum: boolean, oraclePrimaryEnabled: boolean, supportsMint: boolean, supportsBurn: boolean, supportsCapitalCall: boolean, supportsWrap: boolean, supportsUnwrap: boolean, supportsReserveBackedClaims: boolean, proposalCount: string, executedProposalCount: string, dealCount: string, activeDealCount: string, moduleCount: string, capitalCallCount: string, mainTokenHolderCount: string, releasedMainTokenAmount: string, mainTokenObligations: string, salt?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, updatedBlockNumber: string, updatedBlockTimestamp?: string | null }> };

export type ListDacsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDacsQuery = { __typename?: 'query_root', Dac: Array<{ __typename?: 'Dac', id: string, chainId: number, address: string, mode: string, name?: string | null, description?: string | null, creator?: string | null, mainTokenAddress?: string | null, wrappedMainTokenAddress?: string | null, underlyingTokenAddress?: string | null, agentTokenAddress?: string | null, dealManagerAddress?: string | null, moduleRegistryAddress?: string | null, assetControllerAddress?: string | null, governanceSchemaAddress?: string | null, governanceOracleAddress?: string | null, treasuryHolderAddress?: string | null, treasurySeedAmount?: string | null, legalWrapperAddress?: string | null, legalWrapperOperatingAgreementIpfs?: string | null, legalWrapperRegisteredAgent?: string | null, coreModuleFactoryAddress?: string | null, started: boolean, dividendsEnabled: boolean, votingQuorumPercent?: string | null, votingBlockingPercent?: string | null, votingHighQuorumPercent?: string | null, votingDuration?: string | null, votingQualification?: string | null, executionValidityDuration?: string | null, dealCreationMinAgentBalance?: string | null, dealCreationMinInitialAgentStake?: string | null, oraclePublishDeadline?: string | null, fallbackWarmupDuration?: string | null, fallbackDuration?: string | null, blockingOnAllProposals: boolean, blockingOnHighQuorum: boolean, oraclePrimaryEnabled: boolean, supportsMint: boolean, supportsBurn: boolean, supportsCapitalCall: boolean, supportsWrap: boolean, supportsUnwrap: boolean, supportsReserveBackedClaims: boolean, proposalCount: string, executedProposalCount: string, dealCount: string, activeDealCount: string, moduleCount: string, capitalCallCount: string, mainTokenHolderCount: string, releasedMainTokenAmount: string, mainTokenObligations: string, salt?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, updatedBlockNumber: string, updatedBlockTimestamp?: string | null }> };

export type DealViewFieldsFragment = { __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, moduleFactoryAddress?: string | null, governanceFactoryAddress?: string | null, dealTargetAddress?: string | null, proposer?: string | null, vetoEnabled?: boolean | null, earlyReturnsEnabled: boolean, whitelistOnly: boolean, dealChallengeEnabled: boolean, votingQuorumPercent?: string | null, votingBlockingPercent?: string | null, votingHighQuorumPercent?: string | null, votingDuration?: string | null, votingQualification?: string | null, executionValidityDuration?: string | null, name?: string | null, description?: string | null, linkHash?: string | null, evaluatorSelector?: string | null, evaluatorModuleFactoryAddress?: string | null, agentsLimit: string, minimalStake: string, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, childDacId?: string | null, childMainTokenAddress?: string | null, childAgentTokenAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, totalAgentTokens?: string | null, stakerCount: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedStakeAmount: string, totalSlashedStakeAmount: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, rewardsLimit: string, rewardsAllocated: string, dealRewardPoolPercent: string, rewardPoolSupported: boolean, totalDealRewardPoolAllocatedAmount: string, totalDealRewardPoolClaimedAmount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, trancheCount: string, evaluatorCount: string, relatedContractCount: string, lastEvaluatedBlockNumber?: string | null, totalEvaluationCount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, activatedBlockNumber?: string | null, closedBlockNumber?: string | null, recoveredBlockNumber?: string | null, updatedBlockNumber: string };

export type DealRelatedContractViewFieldsFragment = { __typename?: 'DealRelatedContract', id: string, chainId: number, dealId: string, dacId: string, dealAddress?: string | null, dealCellAddress: string, relatedContractAddress: string, roleHex: string, roleText?: string | null, controlled: boolean, managed: boolean, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type GetDealByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetDealByIdQuery = { __typename?: 'query_root', Deal: Array<{ __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, moduleFactoryAddress?: string | null, governanceFactoryAddress?: string | null, dealTargetAddress?: string | null, proposer?: string | null, vetoEnabled?: boolean | null, earlyReturnsEnabled: boolean, whitelistOnly: boolean, dealChallengeEnabled: boolean, votingQuorumPercent?: string | null, votingBlockingPercent?: string | null, votingHighQuorumPercent?: string | null, votingDuration?: string | null, votingQualification?: string | null, executionValidityDuration?: string | null, name?: string | null, description?: string | null, linkHash?: string | null, evaluatorSelector?: string | null, evaluatorModuleFactoryAddress?: string | null, agentsLimit: string, minimalStake: string, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, childDacId?: string | null, childMainTokenAddress?: string | null, childAgentTokenAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, totalAgentTokens?: string | null, stakerCount: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedStakeAmount: string, totalSlashedStakeAmount: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, rewardsLimit: string, rewardsAllocated: string, dealRewardPoolPercent: string, rewardPoolSupported: boolean, totalDealRewardPoolAllocatedAmount: string, totalDealRewardPoolClaimedAmount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, trancheCount: string, evaluatorCount: string, relatedContractCount: string, lastEvaluatedBlockNumber?: string | null, totalEvaluationCount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, activatedBlockNumber?: string | null, closedBlockNumber?: string | null, recoveredBlockNumber?: string | null, updatedBlockNumber: string }> };

export type GetDealByAddressQueryVariables = Exact<{
  dealAddress: Scalars['String']['input'];
  cellAddress: Scalars['String']['input'];
}>;


export type GetDealByAddressQuery = { __typename?: 'query_root', byDealAddress: Array<{ __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, moduleFactoryAddress?: string | null, governanceFactoryAddress?: string | null, dealTargetAddress?: string | null, proposer?: string | null, vetoEnabled?: boolean | null, earlyReturnsEnabled: boolean, whitelistOnly: boolean, dealChallengeEnabled: boolean, votingQuorumPercent?: string | null, votingBlockingPercent?: string | null, votingHighQuorumPercent?: string | null, votingDuration?: string | null, votingQualification?: string | null, executionValidityDuration?: string | null, name?: string | null, description?: string | null, linkHash?: string | null, evaluatorSelector?: string | null, evaluatorModuleFactoryAddress?: string | null, agentsLimit: string, minimalStake: string, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, childDacId?: string | null, childMainTokenAddress?: string | null, childAgentTokenAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, totalAgentTokens?: string | null, stakerCount: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedStakeAmount: string, totalSlashedStakeAmount: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, rewardsLimit: string, rewardsAllocated: string, dealRewardPoolPercent: string, rewardPoolSupported: boolean, totalDealRewardPoolAllocatedAmount: string, totalDealRewardPoolClaimedAmount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, trancheCount: string, evaluatorCount: string, relatedContractCount: string, lastEvaluatedBlockNumber?: string | null, totalEvaluationCount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, activatedBlockNumber?: string | null, closedBlockNumber?: string | null, recoveredBlockNumber?: string | null, updatedBlockNumber: string }>, byCellAddress: Array<{ __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, moduleFactoryAddress?: string | null, governanceFactoryAddress?: string | null, dealTargetAddress?: string | null, proposer?: string | null, vetoEnabled?: boolean | null, earlyReturnsEnabled: boolean, whitelistOnly: boolean, dealChallengeEnabled: boolean, votingQuorumPercent?: string | null, votingBlockingPercent?: string | null, votingHighQuorumPercent?: string | null, votingDuration?: string | null, votingQualification?: string | null, executionValidityDuration?: string | null, name?: string | null, description?: string | null, linkHash?: string | null, evaluatorSelector?: string | null, evaluatorModuleFactoryAddress?: string | null, agentsLimit: string, minimalStake: string, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, childDacId?: string | null, childMainTokenAddress?: string | null, childAgentTokenAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, totalAgentTokens?: string | null, stakerCount: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedStakeAmount: string, totalSlashedStakeAmount: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, rewardsLimit: string, rewardsAllocated: string, dealRewardPoolPercent: string, rewardPoolSupported: boolean, totalDealRewardPoolAllocatedAmount: string, totalDealRewardPoolClaimedAmount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, trancheCount: string, evaluatorCount: string, relatedContractCount: string, lastEvaluatedBlockNumber?: string | null, totalEvaluationCount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, activatedBlockNumber?: string | null, closedBlockNumber?: string | null, recoveredBlockNumber?: string | null, updatedBlockNumber: string }> };

export type ListDealsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDealsByDacQuery = { __typename?: 'query_root', Deal: Array<{ __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, moduleFactoryAddress?: string | null, governanceFactoryAddress?: string | null, dealTargetAddress?: string | null, proposer?: string | null, vetoEnabled?: boolean | null, earlyReturnsEnabled: boolean, whitelistOnly: boolean, dealChallengeEnabled: boolean, votingQuorumPercent?: string | null, votingBlockingPercent?: string | null, votingHighQuorumPercent?: string | null, votingDuration?: string | null, votingQualification?: string | null, executionValidityDuration?: string | null, name?: string | null, description?: string | null, linkHash?: string | null, evaluatorSelector?: string | null, evaluatorModuleFactoryAddress?: string | null, agentsLimit: string, minimalStake: string, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, childDacId?: string | null, childMainTokenAddress?: string | null, childAgentTokenAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, totalAgentTokens?: string | null, stakerCount: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedStakeAmount: string, totalSlashedStakeAmount: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, rewardsLimit: string, rewardsAllocated: string, dealRewardPoolPercent: string, rewardPoolSupported: boolean, totalDealRewardPoolAllocatedAmount: string, totalDealRewardPoolClaimedAmount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, trancheCount: string, evaluatorCount: string, relatedContractCount: string, lastEvaluatedBlockNumber?: string | null, totalEvaluationCount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, activatedBlockNumber?: string | null, closedBlockNumber?: string | null, recoveredBlockNumber?: string | null, updatedBlockNumber: string }> };

export type ListDealRelatedContractsByDealQueryVariables = Exact<{
  dealId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDealRelatedContractsByDealQuery = { __typename?: 'query_root', DealRelatedContract: Array<{ __typename?: 'DealRelatedContract', id: string, chainId: number, dealId: string, dacId: string, dealAddress?: string | null, dealCellAddress: string, relatedContractAddress: string, roleHex: string, roleText?: string | null, controlled: boolean, managed: boolean, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> };

export type ListDealGovernanceAccountsByDealQueryVariables = Exact<{
  dealId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDealGovernanceAccountsByDealQuery = { __typename?: 'query_root', DealGovernanceAccount: Array<{ __typename?: 'DealGovernanceAccount', id: string, chainId: number, dacId: string, dealId: string, accountId: string, delegateAddress?: string | null, currentVotingPower: string, hasVotingPower: boolean, createdBlockNumber: string, updatedBlockNumber: string }> };

export type ListDealAgentPositionsByDealQueryVariables = Exact<{
  dealId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDealAgentPositionsByDealQuery = { __typename?: 'query_root', DealAgentPosition: Array<{ __typename?: 'DealAgentPosition', id: string, chainId: number, dacId: string, dealId: string, dacAgentId: string, accountId: string, currentStakedAmount: string, totalStakedAmount: string, totalReleasedAmount: string, totalSlashedAmount: string, totalClaimedMainTokenAmount: string, isActive: boolean, createdBlockNumber: string, updatedBlockNumber: string, lastStakedBlockNumber?: string | null, lastReleasedBlockNumber?: string | null, lastSlashedBlockNumber?: string | null, lastClaimedRewardBlockNumber?: string | null }> };

export type ProposalBaseFieldsFragment = { __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null };

export type ProposalPhaseEventViewFieldsFragment = { __typename?: 'ProposalPhaseEvent', id: string, chainId: number, dacProposalId: string, proposalNumericId: string, phase: string, snapshotBlock?: string | null, startTime?: string | null, endTime?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type OracleSnapshotViewFieldsFragment = { __typename?: 'OracleSnapshot', id: string, chainId: number, dacId: string, dacProposalId?: string | null, proposalNumericId: string, governanceOracleId: string, snapshotBlock: string, merkleRoot: string, totalUnderlyingVotingPower: string, publishedAt?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type MerkleVoteViewFieldsFragment = { __typename?: 'MerkleVote', id: string, chainId: number, dacProposalId: string, dacId: string, accountId: string, voter: string, support: boolean, weight: string, merkleIndex: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type DealProposalChallengeViewFieldsFragment = { __typename?: 'DealProposalChallenge', id: string, chainId: number, dealId: string, dealProposalId: string, dacProposalId: string, proposalNumericId: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type DacProposalViewFieldsFragment = { __typename?: 'DacProposal', id: string, chainId: number, proposalId: string, dacId: string, governanceType: string, createdBlockNumber: string, proposal?: { __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null } | null, phaseEvents: Array<{ __typename?: 'ProposalPhaseEvent', id: string, chainId: number, dacProposalId: string, proposalNumericId: string, phase: string, snapshotBlock?: string | null, startTime?: string | null, endTime?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }>, oracleSnapshots: Array<{ __typename?: 'OracleSnapshot', id: string, chainId: number, dacId: string, dacProposalId?: string | null, proposalNumericId: string, governanceOracleId: string, snapshotBlock: string, merkleRoot: string, totalUnderlyingVotingPower: string, publishedAt?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }>, merkleVotes: Array<{ __typename?: 'MerkleVote', id: string, chainId: number, dacProposalId: string, dacId: string, accountId: string, voter: string, support: boolean, weight: string, merkleIndex: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }>, challengedDeals: Array<{ __typename?: 'DealProposalChallenge', id: string, chainId: number, dealId: string, dealProposalId: string, dacProposalId: string, proposalNumericId: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> };

export type DealProposalViewFieldsFragment = { __typename?: 'DealProposal', id: string, chainId: number, proposalId: string, dacId: string, dealId: string, challengeable: boolean, challenged: boolean, challengeCount: string, createdBlockNumber: string, proposal?: { __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null } | null, challenges: Array<{ __typename?: 'DealProposalChallenge', id: string, chainId: number, dealId: string, dealProposalId: string, dacProposalId: string, proposalNumericId: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> };

export type GetProposalByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProposalByIdQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type GetProposalByAddressQueryVariables = Exact<{
  proposalAddress: Scalars['String']['input'];
}>;


export type GetProposalByAddressQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type GetProposalByDacAndNumericIdQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  proposalNumericId: Scalars['numeric']['input'];
}>;


export type GetProposalByDacAndNumericIdQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type GetProposalByDealAndNumericIdQueryVariables = Exact<{
  dealId: Scalars['String']['input'];
  proposalNumericId: Scalars['numeric']['input'];
}>;


export type GetProposalByDealAndNumericIdQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type GetDacProposalByProposalIdQueryVariables = Exact<{
  proposalId: Scalars['String']['input'];
}>;


export type GetDacProposalByProposalIdQuery = { __typename?: 'query_root', DacProposal: Array<{ __typename?: 'DacProposal', id: string, chainId: number, proposalId: string, dacId: string, governanceType: string, createdBlockNumber: string, proposal?: { __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null } | null, phaseEvents: Array<{ __typename?: 'ProposalPhaseEvent', id: string, chainId: number, dacProposalId: string, proposalNumericId: string, phase: string, snapshotBlock?: string | null, startTime?: string | null, endTime?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }>, oracleSnapshots: Array<{ __typename?: 'OracleSnapshot', id: string, chainId: number, dacId: string, dacProposalId?: string | null, proposalNumericId: string, governanceOracleId: string, snapshotBlock: string, merkleRoot: string, totalUnderlyingVotingPower: string, publishedAt?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }>, merkleVotes: Array<{ __typename?: 'MerkleVote', id: string, chainId: number, dacProposalId: string, dacId: string, accountId: string, voter: string, support: boolean, weight: string, merkleIndex: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }>, challengedDeals: Array<{ __typename?: 'DealProposalChallenge', id: string, chainId: number, dealId: string, dealProposalId: string, dacProposalId: string, proposalNumericId: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> }> };

export type GetDealProposalByProposalIdQueryVariables = Exact<{
  proposalId: Scalars['String']['input'];
}>;


export type GetDealProposalByProposalIdQuery = { __typename?: 'query_root', DealProposal: Array<{ __typename?: 'DealProposal', id: string, chainId: number, proposalId: string, dacId: string, dealId: string, challengeable: boolean, challenged: boolean, challengeCount: string, createdBlockNumber: string, proposal?: { __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null } | null, challenges: Array<{ __typename?: 'DealProposalChallenge', id: string, chainId: number, dealId: string, dealProposalId: string, dacProposalId: string, proposalNumericId: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> }> };

export type ListProposalsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListProposalsByDacQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type ListProposalsByDealQueryVariables = Exact<{
  dealId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListProposalsByDealQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type ListDacProposalsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDacProposalsByDacQuery = { __typename?: 'query_root', DacProposal: Array<{ __typename?: 'DacProposal', id: string, chainId: number, proposalId: string, dacId: string, governanceType: string, createdBlockNumber: string, proposal?: { __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null } | null, phaseEvents: Array<{ __typename?: 'ProposalPhaseEvent', id: string, chainId: number, dacProposalId: string, proposalNumericId: string, phase: string, snapshotBlock?: string | null, startTime?: string | null, endTime?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }>, oracleSnapshots: Array<{ __typename?: 'OracleSnapshot', id: string, chainId: number, dacId: string, dacProposalId?: string | null, proposalNumericId: string, governanceOracleId: string, snapshotBlock: string, merkleRoot: string, totalUnderlyingVotingPower: string, publishedAt?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }>, merkleVotes: Array<{ __typename?: 'MerkleVote', id: string, chainId: number, dacProposalId: string, dacId: string, accountId: string, voter: string, support: boolean, weight: string, merkleIndex: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }>, challengedDeals: Array<{ __typename?: 'DealProposalChallenge', id: string, chainId: number, dealId: string, dealProposalId: string, dacProposalId: string, proposalNumericId: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> }> };

export type ListDealProposalsByDealQueryVariables = Exact<{
  dealId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDealProposalsByDealQuery = { __typename?: 'query_root', DealProposal: Array<{ __typename?: 'DealProposal', id: string, chainId: number, proposalId: string, dacId: string, dealId: string, challengeable: boolean, challenged: boolean, challengeCount: string, createdBlockNumber: string, proposal?: { __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, kindName?: string | null, targetAddress?: string | null, data1?: string | null, data2?: string | null, tokenAddress?: string | null, totalVotingPower?: string | null, quorum?: string | null, blockingQuorum?: string | null, snapshotReference?: string | null, snapshotReferenceKind?: string | null, snapshotTime?: string | null, endTime?: string | null, proposalVariant: string, voteCount: string, merkleVoteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, executionValidityDuration?: string | null, resolutionTime?: string | null, executionDeadline?: string | null, executionExpired: boolean, currentPhase?: string | null, phaseStartTime?: string | null, phaseEndTime?: string | null, currentPhaseSnapshotBlock?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null } | null, challenges: Array<{ __typename?: 'DealProposalChallenge', id: string, chainId: number, dealId: string, dealProposalId: string, dacProposalId: string, proposalNumericId: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> }> };

export type LegalWrapperMessageFieldsFragment = { __typename?: 'DacLegalWrapperMessage', id: string, chainId: number, dacId: string, wrapperAddress?: string | null, messageKind: string, message?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type LegalWrapperStateFieldsFragment = { __typename?: 'DacLegalWrapperState', id: string, chainId: number, dacId: string, wrapperAddress?: string | null, operatingAgreementIpfs?: string | null, registeredAgent?: string | null, data?: string | null, updatedBlockNumber: string, updatedBlockTimestamp?: string | null };

export type ListLegalWrapperMessagesByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListLegalWrapperMessagesByDacQuery = { __typename?: 'query_root', DacLegalWrapperMessage: Array<{ __typename?: 'DacLegalWrapperMessage', id: string, chainId: number, dacId: string, wrapperAddress?: string | null, messageKind: string, message?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> };

export type ListLegalWrapperStatesByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListLegalWrapperStatesByDacQuery = { __typename?: 'query_root', DacLegalWrapperState: Array<{ __typename?: 'DacLegalWrapperState', id: string, chainId: number, dacId: string, wrapperAddress?: string | null, operatingAgreementIpfs?: string | null, registeredAgent?: string | null, data?: string | null, updatedBlockNumber: string, updatedBlockTimestamp?: string | null }> };

export type GovernanceOraclePublisherViewFieldsFragment = { __typename?: 'GovernanceOraclePublisher', id: string, chainId: number, governanceOracleId: string, publisherAddress: string, allowed: boolean, updatedBlockNumber: string };

export type GovernanceOracleViewFieldsFragment = { __typename?: 'GovernanceOracle', id: string, chainId: number, dacId: string, address: string, active: boolean, createdBlockNumber: string, updatedBlockNumber: string, publishers: Array<{ __typename?: 'GovernanceOraclePublisher', id: string, chainId: number, governanceOracleId: string, publisherAddress: string, allowed: boolean, updatedBlockNumber: string }> };

export type WrapperActionViewFieldsFragment = { __typename?: 'WrapperAction', id: string, chainId: number, dacId: string, tokenAddress: string, caller: string, recipient: string, actionType: string, amount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type ListGovernanceOraclesByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListGovernanceOraclesByDacQuery = { __typename?: 'query_root', GovernanceOracle: Array<{ __typename?: 'GovernanceOracle', id: string, chainId: number, dacId: string, address: string, active: boolean, createdBlockNumber: string, updatedBlockNumber: string, publishers: Array<{ __typename?: 'GovernanceOraclePublisher', id: string, chainId: number, governanceOracleId: string, publisherAddress: string, allowed: boolean, updatedBlockNumber: string }> }> };

export type ListWrapperActionsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListWrapperActionsByDacQuery = { __typename?: 'query_root', WrapperAction: Array<{ __typename?: 'WrapperAction', id: string, chainId: number, dacId: string, tokenAddress: string, caller: string, recipient: string, actionType: string, amount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> };

export type CapitalCallViewFieldsFragment = { __typename?: 'CapitalCall', id: string, chainId: number, dacId: string, dacAddress: string, proposalNumericId: string, callHash: string, recipient: string, treasuryTokenAddress: string, tokenAmount: string, cashAmount: string, nonce: string, fulfillmentCount: string, totalFulfilledTokenAmount: string, totalFulfilledCashAmount: string, lastPayer?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, fulfilledBlockNumber?: string | null, updatedBlockNumber: string };

export type TreasuryHoldingViewFieldsFragment = { __typename?: 'TreasuryHolding', id: string, chainId: number, dacId: string, assetControllerAddress?: string | null, treasuryHolderAddress?: string | null, tokenAddress: string, balance: string, committedAmount: string, freeAmount: string, creditedAmount: string, debitedAmount: string, updatedBlockNumber: string, updatedBlockTimestamp?: string | null };

export type TreasuryMovementViewFieldsFragment = { __typename?: 'TreasuryMovement', id: string, chainId: number, dacId: string, assetControllerAddress?: string | null, treasuryHolderAddress?: string | null, tokenAddress: string, dealId?: string | null, proposalNumericId?: string | null, direction: string, movementType: string, amount: string, counterpartyAddress?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type DacTreasuryDelegationViewFieldsFragment = { __typename?: 'DacTreasuryDelegation', id: string, chainId: number, dacId: string, assetControllerAddress?: string | null, treasuryHolderAddress?: string | null, delegatedTokenAddress: string, delegateeAddress: string, active: boolean, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, updatedBlockNumber: string };

export type TreasuryActionViewFieldsFragment = { __typename?: 'TreasuryAction', id: string, chainId: number, dealId: string, treasuryDealId: string, treasuryAddress?: string | null, actionType: string, tokenAddress?: string | null, agent?: string | null, counterpartyAddress?: string | null, sourceAddress?: string | null, destinationAddress?: string | null, amount?: string | null, dealSize?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type ListCapitalCallsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListCapitalCallsByDacQuery = { __typename?: 'query_root', CapitalCall: Array<{ __typename?: 'CapitalCall', id: string, chainId: number, dacId: string, dacAddress: string, proposalNumericId: string, callHash: string, recipient: string, treasuryTokenAddress: string, tokenAmount: string, cashAmount: string, nonce: string, fulfillmentCount: string, totalFulfilledTokenAmount: string, totalFulfilledCashAmount: string, lastPayer?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, fulfilledBlockNumber?: string | null, updatedBlockNumber: string }> };

export type ListTreasuryHoldingsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListTreasuryHoldingsByDacQuery = { __typename?: 'query_root', TreasuryHolding: Array<{ __typename?: 'TreasuryHolding', id: string, chainId: number, dacId: string, assetControllerAddress?: string | null, treasuryHolderAddress?: string | null, tokenAddress: string, balance: string, committedAmount: string, freeAmount: string, creditedAmount: string, debitedAmount: string, updatedBlockNumber: string, updatedBlockTimestamp?: string | null }> };

export type ListTreasuryMovementsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListTreasuryMovementsByDacQuery = { __typename?: 'query_root', TreasuryMovement: Array<{ __typename?: 'TreasuryMovement', id: string, chainId: number, dacId: string, assetControllerAddress?: string | null, treasuryHolderAddress?: string | null, tokenAddress: string, dealId?: string | null, proposalNumericId?: string | null, direction: string, movementType: string, amount: string, counterpartyAddress?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> };

export type ListDacTreasuryDelegationsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDacTreasuryDelegationsByDacQuery = { __typename?: 'query_root', DacTreasuryDelegation: Array<{ __typename?: 'DacTreasuryDelegation', id: string, chainId: number, dacId: string, assetControllerAddress?: string | null, treasuryHolderAddress?: string | null, delegatedTokenAddress: string, delegateeAddress: string, active: boolean, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null, updatedBlockNumber: string }> };

export type ListTreasuryActionsByDealQueryVariables = Exact<{
  dealId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListTreasuryActionsByDealQuery = { __typename?: 'query_root', TreasuryAction: Array<{ __typename?: 'TreasuryAction', id: string, chainId: number, dealId: string, treasuryDealId: string, treasuryAddress?: string | null, actionType: string, tokenAddress?: string | null, agent?: string | null, counterpartyAddress?: string | null, sourceAddress?: string | null, destinationAddress?: string | null, amount?: string | null, dealSize?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> };

export const MainTokenHolderViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MainTokenHolderViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MainTokenHolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"totalReceivedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isHolder"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastTransferBlockNumber"}}]}}]} as unknown as DocumentNode<MainTokenHolderViewFieldsFragment, unknown>;
export const DacAgentViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacAgentViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacAgent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"walletAgentTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalMintedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevokedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currentStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReleasedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlashedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalClaimedMainTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastActivityBlockNumber"}}]}}]} as unknown as DocumentNode<DacAgentViewFieldsFragment, unknown>;
export const DealAgentPositionViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealAgentPositionViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealAgentPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dacAgentId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReleasedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlashedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalClaimedMainTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastStakedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastReleasedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastSlashedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastClaimedRewardBlockNumber"}}]}}]} as unknown as DocumentNode<DealAgentPositionViewFieldsFragment, unknown>;
export const DacGovernanceAccountViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacGovernanceAccountViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacGovernanceAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"delegateAddress"}},{"kind":"Field","name":{"kind":"Name","value":"currentVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"hasVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<DacGovernanceAccountViewFieldsFragment, unknown>;
export const DealGovernanceAccountViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealGovernanceAccountViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealGovernanceAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"delegateAddress"}},{"kind":"Field","name":{"kind":"Name","value":"currentVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"hasVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<DealGovernanceAccountViewFieldsFragment, unknown>;
export const DacViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dac"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"wrappedMainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"underlyingTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealManagerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"moduleRegistryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceSchemaAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasurySeedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperAddress"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperOperatingAgreementIpfs"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperRegisteredAgent"}},{"kind":"Field","name":{"kind":"Name","value":"coreModuleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"dividendsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"votingQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingBlockingPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingHighQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"votingQualification"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"dealCreationMinAgentBalance"}},{"kind":"Field","name":{"kind":"Name","value":"dealCreationMinInitialAgentStake"}},{"kind":"Field","name":{"kind":"Name","value":"oraclePublishDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackWarmupDuration"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackDuration"}},{"kind":"Field","name":{"kind":"Name","value":"blockingOnAllProposals"}},{"kind":"Field","name":{"kind":"Name","value":"blockingOnHighQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"oraclePrimaryEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"supportsMint"}},{"kind":"Field","name":{"kind":"Name","value":"supportsBurn"}},{"kind":"Field","name":{"kind":"Name","value":"supportsCapitalCall"}},{"kind":"Field","name":{"kind":"Name","value":"supportsWrap"}},{"kind":"Field","name":{"kind":"Name","value":"supportsUnwrap"}},{"kind":"Field","name":{"kind":"Name","value":"supportsReserveBackedClaims"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"dealCount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"moduleCount"}},{"kind":"Field","name":{"kind":"Name","value":"capitalCallCount"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenHolderCount"}},{"kind":"Field","name":{"kind":"Name","value":"releasedMainTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenObligations"}},{"kind":"Field","name":{"kind":"Name","value":"salt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockTimestamp"}}]}}]} as unknown as DocumentNode<DacViewFieldsFragment, unknown>;
export const DealViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"cellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"moduleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealTargetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"proposer"}},{"kind":"Field","name":{"kind":"Name","value":"vetoEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"earlyReturnsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"whitelistOnly"}},{"kind":"Field","name":{"kind":"Name","value":"dealChallengeEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"votingQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingBlockingPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingHighQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"votingQualification"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"linkHash"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorSelector"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorModuleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"minimalStake"}},{"kind":"Field","name":{"kind":"Name","value":"stakeTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"managedTreasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacId"}},{"kind":"Field","name":{"kind":"Name","value":"childMainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childAgentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"recovered"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAgentTokens"}},{"kind":"Field","name":{"kind":"Name","value":"stakerCount"}},{"kind":"Field","name":{"kind":"Name","value":"currentStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReleasedStakeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlashedStakeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"dealRewardPoolPercent"}},{"kind":"Field","name":{"kind":"Name","value":"rewardPoolSupported"}},{"kind":"Field","name":{"kind":"Name","value":"totalDealRewardPoolAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalDealRewardPoolClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"approveDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"evaluationDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"dealDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"trancheCount"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorCount"}},{"kind":"Field","name":{"kind":"Name","value":"relatedContractCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastEvaluatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"totalEvaluationCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"activatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"closedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"recoveredBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<DealViewFieldsFragment, unknown>;
export const DealRelatedContractViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealRelatedContractViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealRelatedContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealCellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"relatedContractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"roleHex"}},{"kind":"Field","name":{"kind":"Name","value":"roleText"}},{"kind":"Field","name":{"kind":"Name","value":"controlled"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<DealRelatedContractViewFieldsFragment, unknown>;
export const ProposalBaseFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<ProposalBaseFieldsFragment, unknown>;
export const ProposalPhaseEventViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalPhaseEventViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalPhaseEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<ProposalPhaseEventViewFieldsFragment, unknown>;
export const OracleSnapshotViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OracleSnapshotViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OracleSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleId"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"merkleRoot"}},{"kind":"Field","name":{"kind":"Name","value":"totalUnderlyingVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<OracleSnapshotViewFieldsFragment, unknown>;
export const MerkleVoteViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MerkleVoteViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MerkleVote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"voter"}},{"kind":"Field","name":{"kind":"Name","value":"support"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"merkleIndex"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<MerkleVoteViewFieldsFragment, unknown>;
export const DealProposalChallengeViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalChallengeViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposalChallenge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dealProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<DealProposalChallengeViewFieldsFragment, unknown>;
export const DacProposalViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacProposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceType"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phaseEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalPhaseEventViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oracleSnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OracleSnapshotViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"merkleVotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MerkleVoteViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"challengedDeals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealProposalChallengeViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalPhaseEventViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalPhaseEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OracleSnapshotViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OracleSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleId"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"merkleRoot"}},{"kind":"Field","name":{"kind":"Name","value":"totalUnderlyingVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MerkleVoteViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MerkleVote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"voter"}},{"kind":"Field","name":{"kind":"Name","value":"support"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"merkleIndex"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalChallengeViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposalChallenge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dealProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<DacProposalViewFieldsFragment, unknown>;
export const DealProposalViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"challengeable"}},{"kind":"Field","name":{"kind":"Name","value":"challenged"}},{"kind":"Field","name":{"kind":"Name","value":"challengeCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"challenges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealProposalChallengeViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalChallengeViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposalChallenge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dealProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<DealProposalViewFieldsFragment, unknown>;
export const LegalWrapperMessageFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LegalWrapperMessageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacLegalWrapperMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"wrapperAddress"}},{"kind":"Field","name":{"kind":"Name","value":"messageKind"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<LegalWrapperMessageFieldsFragment, unknown>;
export const LegalWrapperStateFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LegalWrapperStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacLegalWrapperState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"wrapperAddress"}},{"kind":"Field","name":{"kind":"Name","value":"operatingAgreementIpfs"}},{"kind":"Field","name":{"kind":"Name","value":"registeredAgent"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockTimestamp"}}]}}]} as unknown as DocumentNode<LegalWrapperStateFieldsFragment, unknown>;
export const GovernanceOraclePublisherViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GovernanceOraclePublisherViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GovernanceOraclePublisher"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleId"}},{"kind":"Field","name":{"kind":"Name","value":"publisherAddress"}},{"kind":"Field","name":{"kind":"Name","value":"allowed"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<GovernanceOraclePublisherViewFieldsFragment, unknown>;
export const GovernanceOracleViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GovernanceOracleViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GovernanceOracle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"publishers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GovernanceOraclePublisherViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GovernanceOraclePublisherViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GovernanceOraclePublisher"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleId"}},{"kind":"Field","name":{"kind":"Name","value":"publisherAddress"}},{"kind":"Field","name":{"kind":"Name","value":"allowed"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<GovernanceOracleViewFieldsFragment, unknown>;
export const WrapperActionViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WrapperActionViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WrapperAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"caller"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"actionType"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<WrapperActionViewFieldsFragment, unknown>;
export const CapitalCallViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CapitalCallViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CapitalCall"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"callHash"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"cashAmount"}},{"kind":"Field","name":{"kind":"Name","value":"nonce"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalFulfilledTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalFulfilledCashAmount"}},{"kind":"Field","name":{"kind":"Name","value":"lastPayer"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fulfilledBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<CapitalCallViewFieldsFragment, unknown>;
export const TreasuryHoldingViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreasuryHoldingViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreasuryHolding"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"committedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"freeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"creditedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"debitedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockTimestamp"}}]}}]} as unknown as DocumentNode<TreasuryHoldingViewFieldsFragment, unknown>;
export const TreasuryMovementViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreasuryMovementViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreasuryMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"movementType"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"counterpartyAddress"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<TreasuryMovementViewFieldsFragment, unknown>;
export const DacTreasuryDelegationViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacTreasuryDelegationViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacTreasuryDelegation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"delegatedTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"delegateeAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<DacTreasuryDelegationViewFieldsFragment, unknown>;
export const TreasuryActionViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreasuryActionViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreasuryAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryDealId"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"actionType"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agent"}},{"kind":"Field","name":{"kind":"Name","value":"counterpartyAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sourceAddress"}},{"kind":"Field","name":{"kind":"Name","value":"destinationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"dealSize"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<TreasuryActionViewFieldsFragment, unknown>;
export const GetAccountByAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccountByAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"address"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenHoldings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MainTokenHolderViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dacGovernanceAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"currentVotingPower"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacGovernanceAccountViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dacAgents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacAgentViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dealAgentPositions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealAgentPositionViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dealGovernanceAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"currentVotingPower"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealGovernanceAccountViewFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MainTokenHolderViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MainTokenHolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"totalReceivedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isHolder"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastTransferBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacGovernanceAccountViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacGovernanceAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"delegateAddress"}},{"kind":"Field","name":{"kind":"Name","value":"currentVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"hasVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacAgentViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacAgent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"walletAgentTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalMintedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevokedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currentStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReleasedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlashedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalClaimedMainTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastActivityBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealAgentPositionViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealAgentPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dacAgentId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReleasedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlashedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalClaimedMainTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastStakedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastReleasedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastSlashedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastClaimedRewardBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealGovernanceAccountViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealGovernanceAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"delegateAddress"}},{"kind":"Field","name":{"kind":"Name","value":"currentVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"hasVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<GetAccountByAddressQuery, GetAccountByAddressQueryVariables>;
export const GetDacByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDacById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Dac"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dac"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"wrappedMainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"underlyingTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealManagerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"moduleRegistryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceSchemaAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasurySeedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperAddress"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperOperatingAgreementIpfs"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperRegisteredAgent"}},{"kind":"Field","name":{"kind":"Name","value":"coreModuleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"dividendsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"votingQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingBlockingPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingHighQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"votingQualification"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"dealCreationMinAgentBalance"}},{"kind":"Field","name":{"kind":"Name","value":"dealCreationMinInitialAgentStake"}},{"kind":"Field","name":{"kind":"Name","value":"oraclePublishDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackWarmupDuration"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackDuration"}},{"kind":"Field","name":{"kind":"Name","value":"blockingOnAllProposals"}},{"kind":"Field","name":{"kind":"Name","value":"blockingOnHighQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"oraclePrimaryEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"supportsMint"}},{"kind":"Field","name":{"kind":"Name","value":"supportsBurn"}},{"kind":"Field","name":{"kind":"Name","value":"supportsCapitalCall"}},{"kind":"Field","name":{"kind":"Name","value":"supportsWrap"}},{"kind":"Field","name":{"kind":"Name","value":"supportsUnwrap"}},{"kind":"Field","name":{"kind":"Name","value":"supportsReserveBackedClaims"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"dealCount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"moduleCount"}},{"kind":"Field","name":{"kind":"Name","value":"capitalCallCount"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenHolderCount"}},{"kind":"Field","name":{"kind":"Name","value":"releasedMainTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenObligations"}},{"kind":"Field","name":{"kind":"Name","value":"salt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockTimestamp"}}]}}]} as unknown as DocumentNode<GetDacByIdQuery, GetDacByIdQueryVariables>;
export const GetDacByAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDacByAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Dac"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"address"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dac"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"wrappedMainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"underlyingTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealManagerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"moduleRegistryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceSchemaAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasurySeedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperAddress"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperOperatingAgreementIpfs"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperRegisteredAgent"}},{"kind":"Field","name":{"kind":"Name","value":"coreModuleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"dividendsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"votingQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingBlockingPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingHighQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"votingQualification"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"dealCreationMinAgentBalance"}},{"kind":"Field","name":{"kind":"Name","value":"dealCreationMinInitialAgentStake"}},{"kind":"Field","name":{"kind":"Name","value":"oraclePublishDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackWarmupDuration"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackDuration"}},{"kind":"Field","name":{"kind":"Name","value":"blockingOnAllProposals"}},{"kind":"Field","name":{"kind":"Name","value":"blockingOnHighQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"oraclePrimaryEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"supportsMint"}},{"kind":"Field","name":{"kind":"Name","value":"supportsBurn"}},{"kind":"Field","name":{"kind":"Name","value":"supportsCapitalCall"}},{"kind":"Field","name":{"kind":"Name","value":"supportsWrap"}},{"kind":"Field","name":{"kind":"Name","value":"supportsUnwrap"}},{"kind":"Field","name":{"kind":"Name","value":"supportsReserveBackedClaims"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"dealCount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"moduleCount"}},{"kind":"Field","name":{"kind":"Name","value":"capitalCallCount"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenHolderCount"}},{"kind":"Field","name":{"kind":"Name","value":"releasedMainTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenObligations"}},{"kind":"Field","name":{"kind":"Name","value":"salt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockTimestamp"}}]}}]} as unknown as DocumentNode<GetDacByAddressQuery, GetDacByAddressQueryVariables>;
export const ListDacsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDacs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Dac"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dac"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"wrappedMainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"underlyingTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealManagerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"moduleRegistryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceSchemaAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasurySeedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperAddress"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperOperatingAgreementIpfs"}},{"kind":"Field","name":{"kind":"Name","value":"legalWrapperRegisteredAgent"}},{"kind":"Field","name":{"kind":"Name","value":"coreModuleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"dividendsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"votingQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingBlockingPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingHighQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"votingQualification"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"dealCreationMinAgentBalance"}},{"kind":"Field","name":{"kind":"Name","value":"dealCreationMinInitialAgentStake"}},{"kind":"Field","name":{"kind":"Name","value":"oraclePublishDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackWarmupDuration"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackDuration"}},{"kind":"Field","name":{"kind":"Name","value":"blockingOnAllProposals"}},{"kind":"Field","name":{"kind":"Name","value":"blockingOnHighQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"oraclePrimaryEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"supportsMint"}},{"kind":"Field","name":{"kind":"Name","value":"supportsBurn"}},{"kind":"Field","name":{"kind":"Name","value":"supportsCapitalCall"}},{"kind":"Field","name":{"kind":"Name","value":"supportsWrap"}},{"kind":"Field","name":{"kind":"Name","value":"supportsUnwrap"}},{"kind":"Field","name":{"kind":"Name","value":"supportsReserveBackedClaims"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"dealCount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"moduleCount"}},{"kind":"Field","name":{"kind":"Name","value":"capitalCallCount"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenHolderCount"}},{"kind":"Field","name":{"kind":"Name","value":"releasedMainTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenObligations"}},{"kind":"Field","name":{"kind":"Name","value":"salt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockTimestamp"}}]}}]} as unknown as DocumentNode<ListDacsQuery, ListDacsQueryVariables>;
export const GetDealByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDealById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Deal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"cellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"moduleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealTargetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"proposer"}},{"kind":"Field","name":{"kind":"Name","value":"vetoEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"earlyReturnsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"whitelistOnly"}},{"kind":"Field","name":{"kind":"Name","value":"dealChallengeEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"votingQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingBlockingPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingHighQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"votingQualification"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"linkHash"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorSelector"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorModuleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"minimalStake"}},{"kind":"Field","name":{"kind":"Name","value":"stakeTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"managedTreasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacId"}},{"kind":"Field","name":{"kind":"Name","value":"childMainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childAgentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"recovered"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAgentTokens"}},{"kind":"Field","name":{"kind":"Name","value":"stakerCount"}},{"kind":"Field","name":{"kind":"Name","value":"currentStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReleasedStakeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlashedStakeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"dealRewardPoolPercent"}},{"kind":"Field","name":{"kind":"Name","value":"rewardPoolSupported"}},{"kind":"Field","name":{"kind":"Name","value":"totalDealRewardPoolAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalDealRewardPoolClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"approveDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"evaluationDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"dealDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"trancheCount"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorCount"}},{"kind":"Field","name":{"kind":"Name","value":"relatedContractCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastEvaluatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"totalEvaluationCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"activatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"closedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"recoveredBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<GetDealByIdQuery, GetDealByIdQueryVariables>;
export const GetDealByAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDealByAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cellAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"byDealAddress"},"name":{"kind":"Name","value":"Deal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealAddress"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealAddress"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealViewFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"byCellAddress"},"name":{"kind":"Name","value":"Deal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"cellAddress"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cellAddress"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"cellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"moduleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealTargetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"proposer"}},{"kind":"Field","name":{"kind":"Name","value":"vetoEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"earlyReturnsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"whitelistOnly"}},{"kind":"Field","name":{"kind":"Name","value":"dealChallengeEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"votingQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingBlockingPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingHighQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"votingQualification"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"linkHash"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorSelector"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorModuleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"minimalStake"}},{"kind":"Field","name":{"kind":"Name","value":"stakeTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"managedTreasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacId"}},{"kind":"Field","name":{"kind":"Name","value":"childMainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childAgentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"recovered"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAgentTokens"}},{"kind":"Field","name":{"kind":"Name","value":"stakerCount"}},{"kind":"Field","name":{"kind":"Name","value":"currentStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReleasedStakeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlashedStakeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"dealRewardPoolPercent"}},{"kind":"Field","name":{"kind":"Name","value":"rewardPoolSupported"}},{"kind":"Field","name":{"kind":"Name","value":"totalDealRewardPoolAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalDealRewardPoolClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"approveDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"evaluationDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"dealDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"trancheCount"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorCount"}},{"kind":"Field","name":{"kind":"Name","value":"relatedContractCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastEvaluatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"totalEvaluationCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"activatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"closedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"recoveredBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<GetDealByAddressQuery, GetDealByAddressQueryVariables>;
export const ListDealsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDealsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Deal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealNumericId"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"cellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"moduleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"governanceFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealTargetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"proposer"}},{"kind":"Field","name":{"kind":"Name","value":"vetoEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"earlyReturnsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"whitelistOnly"}},{"kind":"Field","name":{"kind":"Name","value":"dealChallengeEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"votingQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingBlockingPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingHighQuorumPercent"}},{"kind":"Field","name":{"kind":"Name","value":"votingDuration"}},{"kind":"Field","name":{"kind":"Name","value":"votingQualification"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"linkHash"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorSelector"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorModuleFactoryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"minimalStake"}},{"kind":"Field","name":{"kind":"Name","value":"stakeTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"managedTreasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacId"}},{"kind":"Field","name":{"kind":"Name","value":"childMainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childAgentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"recovered"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAgentTokens"}},{"kind":"Field","name":{"kind":"Name","value":"stakerCount"}},{"kind":"Field","name":{"kind":"Name","value":"currentStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReleasedStakeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlashedStakeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"dealRewardPoolPercent"}},{"kind":"Field","name":{"kind":"Name","value":"rewardPoolSupported"}},{"kind":"Field","name":{"kind":"Name","value":"totalDealRewardPoolAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalDealRewardPoolClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"approveDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"evaluationDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"dealDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"trancheCount"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatorCount"}},{"kind":"Field","name":{"kind":"Name","value":"relatedContractCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastEvaluatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"totalEvaluationCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"activatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"closedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"recoveredBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<ListDealsByDacQuery, ListDealsByDacQueryVariables>;
export const ListDealRelatedContractsByDealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDealRelatedContractsByDeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DealRelatedContract"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealRelatedContractViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealRelatedContractViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealRelatedContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealCellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"relatedContractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"roleHex"}},{"kind":"Field","name":{"kind":"Name","value":"roleText"}},{"kind":"Field","name":{"kind":"Name","value":"controlled"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<ListDealRelatedContractsByDealQuery, ListDealRelatedContractsByDealQueryVariables>;
export const ListDealGovernanceAccountsByDealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDealGovernanceAccountsByDeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DealGovernanceAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"currentVotingPower"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealGovernanceAccountViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealGovernanceAccountViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealGovernanceAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"delegateAddress"}},{"kind":"Field","name":{"kind":"Name","value":"currentVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"hasVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<ListDealGovernanceAccountsByDealQuery, ListDealGovernanceAccountsByDealQueryVariables>;
export const ListDealAgentPositionsByDealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDealAgentPositionsByDeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DealAgentPosition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"currentStakedAmount"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealAgentPositionViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealAgentPositionViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealAgentPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dacAgentId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalStakedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReleasedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlashedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalClaimedMainTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastStakedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastReleasedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastSlashedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastClaimedRewardBlockNumber"}}]}}]} as unknown as DocumentNode<ListDealAgentPositionsByDealQuery, ListDealAgentPositionsByDealQueryVariables>;
export const GetProposalByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProposalById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<GetProposalByIdQuery, GetProposalByIdQueryVariables>;
export const GetProposalByAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProposalByAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposalAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalAddress"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposalAddress"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<GetProposalByAddressQuery, GetProposalByAddressQueryVariables>;
export const GetProposalByDacAndNumericIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProposalByDacAndNumericId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposalNumericId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"numeric"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"proposalNumericId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposalNumericId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<GetProposalByDacAndNumericIdQuery, GetProposalByDacAndNumericIdQueryVariables>;
export const GetProposalByDealAndNumericIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProposalByDealAndNumericId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposalNumericId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"numeric"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"proposalNumericId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposalNumericId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<GetProposalByDealAndNumericIdQuery, GetProposalByDealAndNumericIdQueryVariables>;
export const GetDacProposalByProposalIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDacProposalByProposalId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DacProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposalId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacProposalViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalPhaseEventViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalPhaseEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OracleSnapshotViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OracleSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleId"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"merkleRoot"}},{"kind":"Field","name":{"kind":"Name","value":"totalUnderlyingVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MerkleVoteViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MerkleVote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"voter"}},{"kind":"Field","name":{"kind":"Name","value":"support"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"merkleIndex"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalChallengeViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposalChallenge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dealProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacProposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceType"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phaseEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalPhaseEventViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oracleSnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OracleSnapshotViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"merkleVotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MerkleVoteViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"challengedDeals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealProposalChallengeViewFields"}}]}}]}}]} as unknown as DocumentNode<GetDacProposalByProposalIdQuery, GetDacProposalByProposalIdQueryVariables>;
export const GetDealProposalByProposalIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDealProposalByProposalId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DealProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposalId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealProposalViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalChallengeViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposalChallenge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dealProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"challengeable"}},{"kind":"Field","name":{"kind":"Name","value":"challenged"}},{"kind":"Field","name":{"kind":"Name","value":"challengeCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"challenges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealProposalChallengeViewFields"}}]}}]}}]} as unknown as DocumentNode<GetDealProposalByProposalIdQuery, GetDealProposalByProposalIdQueryVariables>;
export const ListProposalsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListProposalsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalNumericId"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<ListProposalsByDacQuery, ListProposalsByDacQueryVariables>;
export const ListProposalsByDealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListProposalsByDeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalNumericId"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<ListProposalsByDealQuery, ListProposalsByDealQueryVariables>;
export const ListDacProposalsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDacProposalsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DacProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacProposalViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalPhaseEventViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProposalPhaseEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OracleSnapshotViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OracleSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleId"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"merkleRoot"}},{"kind":"Field","name":{"kind":"Name","value":"totalUnderlyingVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MerkleVoteViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MerkleVote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"voter"}},{"kind":"Field","name":{"kind":"Name","value":"support"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"merkleIndex"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalChallengeViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposalChallenge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dealProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacProposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceType"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phaseEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalPhaseEventViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oracleSnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OracleSnapshotViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"merkleVotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MerkleVoteViewFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"challengedDeals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealProposalChallengeViewFields"}}]}}]}}]} as unknown as DocumentNode<ListDacProposalsByDacQuery, ListDacProposalsByDacQueryVariables>;
export const ListDealProposalsByDealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDealProposalsByDeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DealProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealProposalViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalBaseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"kindName"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"data1"}},{"kind":"Field","name":{"kind":"Name","value":"data2"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotingPower"}},{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"blockingQuorum"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReference"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotReferenceKind"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"proposalVariant"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"merkleVoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"executionValidityDuration"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionTime"}},{"kind":"Field","name":{"kind":"Name","value":"executionDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"executionExpired"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"phaseEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"currentPhaseSnapshotBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalChallengeViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposalChallenge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"dealProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacProposalId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DealProposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"challengeable"}},{"kind":"Field","name":{"kind":"Name","value":"challenged"}},{"kind":"Field","name":{"kind":"Name","value":"challengeCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalBaseFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"challenges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealProposalChallengeViewFields"}}]}}]}}]} as unknown as DocumentNode<ListDealProposalsByDealQuery, ListDealProposalsByDealQueryVariables>;
export const ListLegalWrapperMessagesByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLegalWrapperMessagesByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DacLegalWrapperMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LegalWrapperMessageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LegalWrapperMessageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacLegalWrapperMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"wrapperAddress"}},{"kind":"Field","name":{"kind":"Name","value":"messageKind"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<ListLegalWrapperMessagesByDacQuery, ListLegalWrapperMessagesByDacQueryVariables>;
export const ListLegalWrapperStatesByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLegalWrapperStatesByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DacLegalWrapperState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LegalWrapperStateFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LegalWrapperStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacLegalWrapperState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"wrapperAddress"}},{"kind":"Field","name":{"kind":"Name","value":"operatingAgreementIpfs"}},{"kind":"Field","name":{"kind":"Name","value":"registeredAgent"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockTimestamp"}}]}}]} as unknown as DocumentNode<ListLegalWrapperStatesByDacQuery, ListLegalWrapperStatesByDacQueryVariables>;
export const ListGovernanceOraclesByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListGovernanceOraclesByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GovernanceOracle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GovernanceOracleViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GovernanceOraclePublisherViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GovernanceOraclePublisher"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"governanceOracleId"}},{"kind":"Field","name":{"kind":"Name","value":"publisherAddress"}},{"kind":"Field","name":{"kind":"Name","value":"allowed"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GovernanceOracleViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GovernanceOracle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"publishers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GovernanceOraclePublisherViewFields"}}]}}]}}]} as unknown as DocumentNode<ListGovernanceOraclesByDacQuery, ListGovernanceOraclesByDacQueryVariables>;
export const ListWrapperActionsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListWrapperActionsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"WrapperAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WrapperActionViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WrapperActionViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WrapperAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"caller"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"actionType"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<ListWrapperActionsByDacQuery, ListWrapperActionsByDacQueryVariables>;
export const ListCapitalCallsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListCapitalCallsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CapitalCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalNumericId"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CapitalCallViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CapitalCallViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CapitalCall"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"callHash"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"cashAmount"}},{"kind":"Field","name":{"kind":"Name","value":"nonce"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalFulfilledTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalFulfilledCashAmount"}},{"kind":"Field","name":{"kind":"Name","value":"lastPayer"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fulfilledBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<ListCapitalCallsByDacQuery, ListCapitalCallsByDacQueryVariables>;
export const ListTreasuryHoldingsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListTreasuryHoldingsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TreasuryHolding"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TreasuryHoldingViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreasuryHoldingViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreasuryHolding"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"committedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"freeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"creditedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"debitedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockTimestamp"}}]}}]} as unknown as DocumentNode<ListTreasuryHoldingsByDacQuery, ListTreasuryHoldingsByDacQueryVariables>;
export const ListTreasuryMovementsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListTreasuryMovementsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TreasuryMovement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TreasuryMovementViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreasuryMovementViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreasuryMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"movementType"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"counterpartyAddress"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<ListTreasuryMovementsByDacQuery, ListTreasuryMovementsByDacQueryVariables>;
export const ListDacTreasuryDelegationsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDacTreasuryDelegationsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DacTreasuryDelegation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacTreasuryDelegationViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacTreasuryDelegationViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DacTreasuryDelegation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"assetControllerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryHolderAddress"}},{"kind":"Field","name":{"kind":"Name","value":"delegatedTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"delegateeAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<ListDacTreasuryDelegationsByDacQuery, ListDacTreasuryDelegationsByDacQueryVariables>;
export const ListTreasuryActionsByDealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListTreasuryActionsByDeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TreasuryAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TreasuryActionViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreasuryActionViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreasuryAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryDealId"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"actionType"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agent"}},{"kind":"Field","name":{"kind":"Name","value":"counterpartyAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sourceAddress"}},{"kind":"Field","name":{"kind":"Name","value":"destinationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"dealSize"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<ListTreasuryActionsByDealQuery, ListTreasuryActionsByDealQueryVariables>;