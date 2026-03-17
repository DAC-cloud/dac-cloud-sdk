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

/** columns and relationships of "Account" */
export type Account = {
  __typename?: 'Account';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  /** An array relationship */
  dacAgents: Array<DacAgent>;
  /** An array relationship */
  dealAgentPositions: Array<DealAgentPosition>;
  id: Scalars['String']['output'];
  /** An array relationship */
  mainTokenHoldings: Array<MainTokenHolder>;
  /** An array relationship */
  proposalVotes: Array<ProposalVote>;
  updatedBlockNumber: Scalars['numeric']['output'];
};


/** columns and relationships of "Account" */
export type AccountDacAgentsArgs = {
  distinct_on?: InputMaybe<Array<DacAgent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DacAgent_Order_By>>;
  where?: InputMaybe<DacAgent_Bool_Exp>;
};


/** columns and relationships of "Account" */
export type AccountDealAgentPositionsArgs = {
  distinct_on?: InputMaybe<Array<DealAgentPosition_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealAgentPosition_Order_By>>;
  where?: InputMaybe<DealAgentPosition_Bool_Exp>;
};


/** columns and relationships of "Account" */
export type AccountMainTokenHoldingsArgs = {
  distinct_on?: InputMaybe<Array<MainTokenHolder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MainTokenHolder_Order_By>>;
  where?: InputMaybe<MainTokenHolder_Bool_Exp>;
};


/** columns and relationships of "Account" */
export type AccountProposalVotesArgs = {
  distinct_on?: InputMaybe<Array<ProposalVote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ProposalVote_Order_By>>;
  where?: InputMaybe<ProposalVote_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "Account". All fields are combined with a logical 'AND'. */
export type Account_Bool_Exp = {
  _and?: InputMaybe<Array<Account_Bool_Exp>>;
  _not?: InputMaybe<Account_Bool_Exp>;
  _or?: InputMaybe<Array<Account_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  dacAgents?: InputMaybe<DacAgent_Bool_Exp>;
  dealAgentPositions?: InputMaybe<DealAgentPosition_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  mainTokenHoldings?: InputMaybe<MainTokenHolder_Bool_Exp>;
  proposalVotes?: InputMaybe<ProposalVote_Bool_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "Account". */
export type Account_Order_By = {
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  dacAgents_aggregate?: InputMaybe<DacAgent_Aggregate_Order_By>;
  dealAgentPositions_aggregate?: InputMaybe<DealAgentPosition_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  mainTokenHoldings_aggregate?: InputMaybe<MainTokenHolder_Aggregate_Order_By>;
  proposalVotes_aggregate?: InputMaybe<ProposalVote_Aggregate_Order_By>;
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

/** columns and relationships of "AgentAction" */
export type AgentAction = {
  __typename?: 'AgentAction';
  /** An object relationship */
  account?: Maybe<Account>;
  accountId: Scalars['String']['output'];
  account_id: Scalars['String']['output'];
  actionType: Scalars['String']['output'];
  amount: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  dac?: Maybe<Dac>;
  /** An object relationship */
  dacAgent?: Maybe<DacAgent>;
  dacAgentId: Scalars['String']['output'];
  dacAgent_id: Scalars['String']['output'];
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId?: Maybe<Scalars['String']['output']>;
  deal_id?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  /** An object relationship */
  position?: Maybe<DealAgentPosition>;
  positionId?: Maybe<Scalars['String']['output']>;
  position_id?: Maybe<Scalars['String']['output']>;
  proposalNumericId?: Maybe<Scalars['numeric']['output']>;
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

/** columns and relationships of "CapitalCall" */
export type CapitalCall = {
  __typename?: 'CapitalCall';
  callHash: Scalars['String']['output'];
  cashAmount: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacAddress: Scalars['String']['output'];
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  fulfilledBlockNumber?: Maybe<Scalars['numeric']['output']>;
  fulfillmentCount: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  lastPayer?: Maybe<Scalars['String']['output']>;
  nonce: Scalars['numeric']['output'];
  proposalNumericId: Scalars['numeric']['output'];
  recipient: Scalars['String']['output'];
  tokenAmount: Scalars['numeric']['output'];
  totalFulfilledCashAmount: Scalars['numeric']['output'];
  totalFulfilledTokenAmount: Scalars['numeric']['output'];
  treasuryTokenAddress: Scalars['String']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
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

/** columns and relationships of "ChildDacDeal" */
export type ChildDacDeal = {
  __typename?: 'ChildDacDeal';
  chainId: Scalars['Int']['output'];
  childAgentTokenAddress?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  childDac?: Maybe<Dac>;
  childDacAddress?: Maybe<Scalars['String']['output']>;
  childDacId?: Maybe<Scalars['String']['output']>;
  childDac_id?: Maybe<Scalars['String']['output']>;
  childMainTokenAddress?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  childVotes: Array<ChildVote>;
  createdBlockNumber: Scalars['numeric']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
};


/** columns and relationships of "ChildDacDeal" */
export type ChildDacDealChildVotesArgs = {
  distinct_on?: InputMaybe<Array<ChildVote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ChildVote_Order_By>>;
  where?: InputMaybe<ChildVote_Bool_Exp>;
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
  | 'updatedBlockNumber';

/** order by stddev() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
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
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "ChildDacDeal" */
export type ChildDacDeal_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** columns and relationships of "ChildVote" */
export type ChildVote = {
  __typename?: 'ChildVote';
  chainId: Scalars['Int']['output'];
  /** An object relationship */
  childDacDeal?: Maybe<ChildDacDeal>;
  childDacDealId: Scalars['String']['output'];
  childDacDeal_id: Scalars['String']['output'];
  childProposalNumericId: Scalars['numeric']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  eventType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  parentProposalNumericId?: Maybe<Scalars['numeric']['output']>;
  support?: Maybe<Scalars['Boolean']['output']>;
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

/** columns and relationships of "ControlledAddress" */
export type ControlledAddress = {
  __typename?: 'ControlledAddress';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  controlType: Scalars['String']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lockedMainTokenAmount: Scalars['numeric']['output'];
  roleText?: Maybe<Scalars['String']['output']>;
  sourceId?: Maybe<Scalars['String']['output']>;
  updatedBlockNumber: Scalars['numeric']['output'];
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

/** columns and relationships of "Dac" */
export type Dac = {
  __typename?: 'Dac';
  activeDealCount: Scalars['numeric']['output'];
  address: Scalars['String']['output'];
  agentTokenAddress?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  agents: Array<DacAgent>;
  capitalCallCount: Scalars['numeric']['output'];
  /** An array relationship */
  capitalCalls: Array<CapitalCall>;
  chainId: Scalars['Int']['output'];
  /** An array relationship */
  controlledAddresses: Array<ControlledAddress>;
  coreModuleFactoryAddress?: Maybe<Scalars['String']['output']>;
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  creator?: Maybe<Scalars['String']['output']>;
  dealCount: Scalars['numeric']['output'];
  dealManagerAddress?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  deals: Array<Deal>;
  description?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  dividendPayouts: Array<DividendPayout>;
  dividendsEnabled: Scalars['Boolean']['output'];
  executedProposalCount: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  mainTokenAddress?: Maybe<Scalars['String']['output']>;
  mainTokenHolderCount: Scalars['numeric']['output'];
  /** An array relationship */
  mainTokenHolders: Array<MainTokenHolder>;
  moduleCount: Scalars['numeric']['output'];
  /** An array relationship */
  modules: Array<DacModule>;
  name?: Maybe<Scalars['String']['output']>;
  proposalCount: Scalars['numeric']['output'];
  /** An array relationship */
  proposals: Array<Proposal>;
  releasedMainTokenAmount: Scalars['numeric']['output'];
  started: Scalars['Boolean']['output'];
  /** An array relationship */
  treasuryHoldings: Array<TreasuryHolding>;
  updatedBlockNumber: Scalars['numeric']['output'];
  updatedBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  votingBlockingPercent?: Maybe<Scalars['numeric']['output']>;
  votingDuration?: Maybe<Scalars['numeric']['output']>;
  votingHighQuorumPercent?: Maybe<Scalars['numeric']['output']>;
  votingQualification?: Maybe<Scalars['numeric']['output']>;
  votingQuorumPercent?: Maybe<Scalars['numeric']['output']>;
};


/** columns and relationships of "Dac" */
export type DacAgentsArgs = {
  distinct_on?: InputMaybe<Array<DacAgent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DacAgent_Order_By>>;
  where?: InputMaybe<DacAgent_Bool_Exp>;
};


/** columns and relationships of "Dac" */
export type DacCapitalCallsArgs = {
  distinct_on?: InputMaybe<Array<CapitalCall_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CapitalCall_Order_By>>;
  where?: InputMaybe<CapitalCall_Bool_Exp>;
};


/** columns and relationships of "Dac" */
export type DacControlledAddressesArgs = {
  distinct_on?: InputMaybe<Array<ControlledAddress_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ControlledAddress_Order_By>>;
  where?: InputMaybe<ControlledAddress_Bool_Exp>;
};


/** columns and relationships of "Dac" */
export type DacDealsArgs = {
  distinct_on?: InputMaybe<Array<Deal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Deal_Order_By>>;
  where?: InputMaybe<Deal_Bool_Exp>;
};


/** columns and relationships of "Dac" */
export type DacDividendPayoutsArgs = {
  distinct_on?: InputMaybe<Array<DividendPayout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DividendPayout_Order_By>>;
  where?: InputMaybe<DividendPayout_Bool_Exp>;
};


/** columns and relationships of "Dac" */
export type DacMainTokenHoldersArgs = {
  distinct_on?: InputMaybe<Array<MainTokenHolder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MainTokenHolder_Order_By>>;
  where?: InputMaybe<MainTokenHolder_Bool_Exp>;
};


/** columns and relationships of "Dac" */
export type DacModulesArgs = {
  distinct_on?: InputMaybe<Array<DacModule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DacModule_Order_By>>;
  where?: InputMaybe<DacModule_Bool_Exp>;
};


/** columns and relationships of "Dac" */
export type DacProposalsArgs = {
  distinct_on?: InputMaybe<Array<Proposal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Proposal_Order_By>>;
  where?: InputMaybe<Proposal_Bool_Exp>;
};


/** columns and relationships of "Dac" */
export type DacTreasuryHoldingsArgs = {
  distinct_on?: InputMaybe<Array<TreasuryHolding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryHolding_Order_By>>;
  where?: InputMaybe<TreasuryHolding_Bool_Exp>;
};

/** columns and relationships of "DacAgent" */
export type DacAgent = {
  __typename?: 'DacAgent';
  /** An object relationship */
  account?: Maybe<Account>;
  accountId: Scalars['String']['output'];
  account_id: Scalars['String']['output'];
  /** An array relationship */
  actions: Array<AgentAction>;
  activeDealCount: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  currentStakedAmount: Scalars['numeric']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lastActivityBlockNumber?: Maybe<Scalars['numeric']['output']>;
  /** An array relationship */
  positions: Array<DealAgentPosition>;
  totalClaimedMainTokenAmount: Scalars['numeric']['output'];
  totalMintedAmount: Scalars['numeric']['output'];
  totalReleasedAmount: Scalars['numeric']['output'];
  totalRevokedAmount: Scalars['numeric']['output'];
  totalSlashedAmount: Scalars['numeric']['output'];
  totalStakedAmount: Scalars['numeric']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
  walletAgentTokenAmount: Scalars['numeric']['output'];
};


/** columns and relationships of "DacAgent" */
export type DacAgentActionsArgs = {
  distinct_on?: InputMaybe<Array<AgentAction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AgentAction_Order_By>>;
  where?: InputMaybe<AgentAction_Bool_Exp>;
};


/** columns and relationships of "DacAgent" */
export type DacAgentPositionsArgs = {
  distinct_on?: InputMaybe<Array<DealAgentPosition_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealAgentPosition_Order_By>>;
  where?: InputMaybe<DealAgentPosition_Bool_Exp>;
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
  id?: InputMaybe<String_Comparison_Exp>;
  isActive?: InputMaybe<Boolean_Comparison_Exp>;
  lastActivityBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  positions?: InputMaybe<DealAgentPosition_Bool_Exp>;
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
  id?: InputMaybe<Order_By>;
  isActive?: InputMaybe<Order_By>;
  lastActivityBlockNumber?: InputMaybe<Order_By>;
  positions_aggregate?: InputMaybe<DealAgentPosition_Aggregate_Order_By>;
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
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'lastActivityBlockNumber'
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
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastActivityBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
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
  totalClaimedMainTokenAmount?: InputMaybe<Order_By>;
  totalMintedAmount?: InputMaybe<Order_By>;
  totalReleasedAmount?: InputMaybe<Order_By>;
  totalRevokedAmount?: InputMaybe<Order_By>;
  totalSlashedAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  walletAgentTokenAmount?: InputMaybe<Order_By>;
};

/** columns and relationships of "DacModule" */
export type DacModule = {
  __typename?: 'DacModule';
  addedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  approved: Scalars['Boolean']['output'];
  chainId: Scalars['Int']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  factory?: Maybe<ModuleFactory>;
  factoryId: Scalars['String']['output'];
  factory_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isCore: Scalars['Boolean']['output'];
  removedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  updatedBlockNumber: Scalars['numeric']['output'];
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

/** Boolean expression to filter rows from the table "Dac". All fields are combined with a logical 'AND'. */
export type Dac_Bool_Exp = {
  _and?: InputMaybe<Array<Dac_Bool_Exp>>;
  _not?: InputMaybe<Dac_Bool_Exp>;
  _or?: InputMaybe<Array<Dac_Bool_Exp>>;
  activeDealCount?: InputMaybe<Numeric_Comparison_Exp>;
  address?: InputMaybe<String_Comparison_Exp>;
  agentTokenAddress?: InputMaybe<String_Comparison_Exp>;
  agents?: InputMaybe<DacAgent_Bool_Exp>;
  capitalCallCount?: InputMaybe<Numeric_Comparison_Exp>;
  capitalCalls?: InputMaybe<CapitalCall_Bool_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  controlledAddresses?: InputMaybe<ControlledAddress_Bool_Exp>;
  coreModuleFactoryAddress?: InputMaybe<String_Comparison_Exp>;
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
  creator?: InputMaybe<String_Comparison_Exp>;
  dealCount?: InputMaybe<Numeric_Comparison_Exp>;
  dealManagerAddress?: InputMaybe<String_Comparison_Exp>;
  deals?: InputMaybe<Deal_Bool_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  dividendPayouts?: InputMaybe<DividendPayout_Bool_Exp>;
  dividendsEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  executedProposalCount?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  mainTokenAddress?: InputMaybe<String_Comparison_Exp>;
  mainTokenHolderCount?: InputMaybe<Numeric_Comparison_Exp>;
  mainTokenHolders?: InputMaybe<MainTokenHolder_Bool_Exp>;
  moduleCount?: InputMaybe<Numeric_Comparison_Exp>;
  modules?: InputMaybe<DacModule_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  proposalCount?: InputMaybe<Numeric_Comparison_Exp>;
  proposals?: InputMaybe<Proposal_Bool_Exp>;
  releasedMainTokenAmount?: InputMaybe<Numeric_Comparison_Exp>;
  started?: InputMaybe<Boolean_Comparison_Exp>;
  treasuryHoldings?: InputMaybe<TreasuryHolding_Bool_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  votingBlockingPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingDuration?: InputMaybe<Numeric_Comparison_Exp>;
  votingHighQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
  votingQualification?: InputMaybe<Numeric_Comparison_Exp>;
  votingQuorumPercent?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "Dac". */
export type Dac_Order_By = {
  activeDealCount?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  agentTokenAddress?: InputMaybe<Order_By>;
  agents_aggregate?: InputMaybe<DacAgent_Aggregate_Order_By>;
  capitalCallCount?: InputMaybe<Order_By>;
  capitalCalls_aggregate?: InputMaybe<CapitalCall_Aggregate_Order_By>;
  chainId?: InputMaybe<Order_By>;
  controlledAddresses_aggregate?: InputMaybe<ControlledAddress_Aggregate_Order_By>;
  coreModuleFactoryAddress?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
  creator?: InputMaybe<Order_By>;
  dealCount?: InputMaybe<Order_By>;
  dealManagerAddress?: InputMaybe<Order_By>;
  deals_aggregate?: InputMaybe<Deal_Aggregate_Order_By>;
  description?: InputMaybe<Order_By>;
  dividendPayouts_aggregate?: InputMaybe<DividendPayout_Aggregate_Order_By>;
  dividendsEnabled?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mainTokenAddress?: InputMaybe<Order_By>;
  mainTokenHolderCount?: InputMaybe<Order_By>;
  mainTokenHolders_aggregate?: InputMaybe<MainTokenHolder_Aggregate_Order_By>;
  moduleCount?: InputMaybe<Order_By>;
  modules_aggregate?: InputMaybe<DacModule_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposals_aggregate?: InputMaybe<Proposal_Aggregate_Order_By>;
  releasedMainTokenAmount?: InputMaybe<Order_By>;
  started?: InputMaybe<Order_By>;
  treasuryHoldings_aggregate?: InputMaybe<TreasuryHolding_Aggregate_Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
  votingBlockingPercent?: InputMaybe<Order_By>;
  votingDuration?: InputMaybe<Order_By>;
  votingHighQuorumPercent?: InputMaybe<Order_By>;
  votingQualification?: InputMaybe<Order_By>;
  votingQuorumPercent?: InputMaybe<Order_By>;
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
  | 'dealManagerAddress'
  /** column name */
  | 'description'
  /** column name */
  | 'dividendsEnabled'
  /** column name */
  | 'executedProposalCount'
  /** column name */
  | 'id'
  /** column name */
  | 'mainTokenAddress'
  /** column name */
  | 'mainTokenHolderCount'
  /** column name */
  | 'moduleCount'
  /** column name */
  | 'name'
  /** column name */
  | 'proposalCount'
  /** column name */
  | 'releasedMainTokenAmount'
  /** column name */
  | 'started'
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
  | 'votingQuorumPercent';

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
  capitalCallCount?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  coreModuleFactoryAddress?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  creator?: InputMaybe<Scalars['String']['input']>;
  dealCount?: InputMaybe<Scalars['numeric']['input']>;
  dealManagerAddress?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dividendsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  executedProposalCount?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  mainTokenAddress?: InputMaybe<Scalars['String']['input']>;
  mainTokenHolderCount?: InputMaybe<Scalars['numeric']['input']>;
  moduleCount?: InputMaybe<Scalars['numeric']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  proposalCount?: InputMaybe<Scalars['numeric']['input']>;
  releasedMainTokenAmount?: InputMaybe<Scalars['numeric']['input']>;
  started?: InputMaybe<Scalars['Boolean']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  votingBlockingPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingDuration?: InputMaybe<Scalars['numeric']['input']>;
  votingHighQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
  votingQualification?: InputMaybe<Scalars['numeric']['input']>;
  votingQuorumPercent?: InputMaybe<Scalars['numeric']['input']>;
};

/** columns and relationships of "Deal" */
export type Deal = {
  __typename?: 'Deal';
  activatedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  active: Scalars['Boolean']['output'];
  approveDeadline?: Maybe<Scalars['numeric']['output']>;
  /** An array relationship */
  capitalMovements: Array<DealCapitalMovement>;
  cellAddress: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  childAgentTokenAddress?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  childDac?: Maybe<Dac>;
  childDacAddress?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  childDacDeal: Array<ChildDacDeal>;
  childDacId?: Maybe<Scalars['String']['output']>;
  childDac_id?: Maybe<Scalars['String']['output']>;
  childMainTokenAddress?: Maybe<Scalars['String']['output']>;
  closed: Scalars['Boolean']['output'];
  closedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  creator?: Maybe<Scalars['String']['output']>;
  currentStakedAmount: Scalars['numeric']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  dealAddress?: Maybe<Scalars['String']['output']>;
  dealConfig?: Maybe<Scalars['String']['output']>;
  dealDeadline?: Maybe<Scalars['numeric']['output']>;
  dealNumericId: Scalars['numeric']['output'];
  dealTargetAddress?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  earlyReturnsEnabled: Scalars['Boolean']['output'];
  evaluationDeadline?: Maybe<Scalars['numeric']['output']>;
  /** An array relationship */
  evaluations: Array<Evaluation>;
  evaluatorConfig?: Maybe<Scalars['String']['output']>;
  evaluatorCount: Scalars['numeric']['output'];
  evaluatorSelector?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  evaluators: Array<Evaluator>;
  executedProposalCount: Scalars['numeric']['output'];
  /** An array relationship */
  fundingTokens: Array<DealFundingToken>;
  governanceFactoryAddress?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  kindSelector?: Maybe<Scalars['String']['output']>;
  lastEvaluatedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  linkHash?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  mainTokenHoldings: Array<MainTokenHolder>;
  managedTreasuryAddress?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  moduleFactory?: Maybe<ModuleFactory>;
  moduleFactoryAddress?: Maybe<Scalars['String']['output']>;
  moduleFactory_id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  proposalCount: Scalars['numeric']['output'];
  proposalNumericId?: Maybe<Scalars['numeric']['output']>;
  /** An array relationship */
  proposals: Array<Proposal>;
  proposer?: Maybe<Scalars['String']['output']>;
  recovered: Scalars['Boolean']['output'];
  recoveredBlockNumber?: Maybe<Scalars['numeric']['output']>;
  relatedContractCount: Scalars['numeric']['output'];
  /** An array relationship */
  relatedContracts: Array<DealRelatedContract>;
  rewardsAllocated: Scalars['numeric']['output'];
  rewardsLimit: Scalars['numeric']['output'];
  /** An array relationship */
  stakePositions: Array<DealAgentPosition>;
  stakeTokenAddress?: Maybe<Scalars['String']['output']>;
  stakerCount: Scalars['numeric']['output'];
  totalAgentTokens?: Maybe<Scalars['numeric']['output']>;
  totalEvaluationCount: Scalars['numeric']['output'];
  totalReleasedStakeAmount: Scalars['numeric']['output'];
  totalRewardAllocatedAmount: Scalars['numeric']['output'];
  totalRewardClaimedAmount: Scalars['numeric']['output'];
  totalSlashedStakeAmount: Scalars['numeric']['output'];
  totalStakedAmount: Scalars['numeric']['output'];
  trancheCount: Scalars['numeric']['output'];
  /** An array relationship */
  tranches: Array<Tranche>;
  /** An array relationship */
  treasuryDeal: Array<TreasuryDeal>;
  updatedBlockNumber: Scalars['numeric']['output'];
  vetoEnabled?: Maybe<Scalars['Boolean']['output']>;
  vetoRightEnabled: Scalars['Boolean']['output'];
  whitelistOnly: Scalars['Boolean']['output'];
};


/** columns and relationships of "Deal" */
export type DealCapitalMovementsArgs = {
  distinct_on?: InputMaybe<Array<DealCapitalMovement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealCapitalMovement_Order_By>>;
  where?: InputMaybe<DealCapitalMovement_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealChildDacDealArgs = {
  distinct_on?: InputMaybe<Array<ChildDacDeal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ChildDacDeal_Order_By>>;
  where?: InputMaybe<ChildDacDeal_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealEvaluationsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Order_By>>;
  where?: InputMaybe<Evaluation_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealEvaluatorsArgs = {
  distinct_on?: InputMaybe<Array<Evaluator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluator_Order_By>>;
  where?: InputMaybe<Evaluator_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealFundingTokensArgs = {
  distinct_on?: InputMaybe<Array<DealFundingToken_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealFundingToken_Order_By>>;
  where?: InputMaybe<DealFundingToken_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealMainTokenHoldingsArgs = {
  distinct_on?: InputMaybe<Array<MainTokenHolder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MainTokenHolder_Order_By>>;
  where?: InputMaybe<MainTokenHolder_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealProposalsArgs = {
  distinct_on?: InputMaybe<Array<Proposal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Proposal_Order_By>>;
  where?: InputMaybe<Proposal_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealRelatedContractsArgs = {
  distinct_on?: InputMaybe<Array<DealRelatedContract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealRelatedContract_Order_By>>;
  where?: InputMaybe<DealRelatedContract_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealStakePositionsArgs = {
  distinct_on?: InputMaybe<Array<DealAgentPosition_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealAgentPosition_Order_By>>;
  where?: InputMaybe<DealAgentPosition_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealTranchesArgs = {
  distinct_on?: InputMaybe<Array<Tranche_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Tranche_Order_By>>;
  where?: InputMaybe<Tranche_Bool_Exp>;
};


/** columns and relationships of "Deal" */
export type DealTreasuryDealArgs = {
  distinct_on?: InputMaybe<Array<TreasuryDeal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryDeal_Order_By>>;
  where?: InputMaybe<TreasuryDeal_Bool_Exp>;
};

/** columns and relationships of "DealAddressIndex" */
export type DealAddressIndex = {
  __typename?: 'DealAddressIndex';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
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

/** columns and relationships of "DealAgentPosition" */
export type DealAgentPosition = {
  __typename?: 'DealAgentPosition';
  /** An object relationship */
  account?: Maybe<Account>;
  accountId: Scalars['String']['output'];
  account_id: Scalars['String']['output'];
  /** An array relationship */
  actions: Array<AgentAction>;
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  currentStakedAmount: Scalars['numeric']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  /** An object relationship */
  dacAgent?: Maybe<DacAgent>;
  dacAgentId: Scalars['String']['output'];
  dacAgent_id: Scalars['String']['output'];
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lastClaimedRewardBlockNumber?: Maybe<Scalars['numeric']['output']>;
  lastReleasedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  lastSlashedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  lastStakedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  totalClaimedMainTokenAmount: Scalars['numeric']['output'];
  totalReleasedAmount: Scalars['numeric']['output'];
  totalSlashedAmount: Scalars['numeric']['output'];
  totalStakedAmount: Scalars['numeric']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
};


/** columns and relationships of "DealAgentPosition" */
export type DealAgentPositionActionsArgs = {
  distinct_on?: InputMaybe<Array<AgentAction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AgentAction_Order_By>>;
  where?: InputMaybe<AgentAction_Bool_Exp>;
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

/** columns and relationships of "DealCapitalMovement" */
export type DealCapitalMovement = {
  __typename?: 'DealCapitalMovement';
  amount: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  movementType: Scalars['String']['output'];
  tokenAddress: Scalars['String']['output'];
  trancheNumericId?: Maybe<Scalars['numeric']['output']>;
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

/** columns and relationships of "DealFundingToken" */
export type DealFundingToken = {
  __typename?: 'DealFundingToken';
  chainId: Scalars['Int']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  investedAmount: Scalars['numeric']['output'];
  netInvestedAmount: Scalars['numeric']['output'];
  returnedAmount: Scalars['numeric']['output'];
  tokenAddress: Scalars['String']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
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

/** columns and relationships of "DealLookup" */
export type DealLookup = {
  __typename?: 'DealLookup';
  cellAddress: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealAddress?: Maybe<Scalars['String']['output']>;
  dealId: Scalars['String']['output'];
  dealNumericId: Scalars['numeric']['output'];
  deal_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
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

/** columns and relationships of "DealRelatedContract" */
export type DealRelatedContract = {
  __typename?: 'DealRelatedContract';
  chainId: Scalars['Int']['output'];
  controlled: Scalars['Boolean']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealAddress?: Maybe<Scalars['String']['output']>;
  dealCellAddress: Scalars['String']['output'];
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  managed: Scalars['Boolean']['output'];
  relatedContractAddress: Scalars['String']['output'];
  roleHex: Scalars['String']['output'];
  roleText?: Maybe<Scalars['String']['output']>;
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
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Deal". All fields are combined with a logical 'AND'. */
export type Deal_Bool_Exp = {
  _and?: InputMaybe<Array<Deal_Bool_Exp>>;
  _not?: InputMaybe<Deal_Bool_Exp>;
  _or?: InputMaybe<Array<Deal_Bool_Exp>>;
  activatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  approveDeadline?: InputMaybe<Numeric_Comparison_Exp>;
  capitalMovements?: InputMaybe<DealCapitalMovement_Bool_Exp>;
  cellAddress?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
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
  dealConfig?: InputMaybe<String_Comparison_Exp>;
  dealDeadline?: InputMaybe<Numeric_Comparison_Exp>;
  dealNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  dealTargetAddress?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  earlyReturnsEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  evaluationDeadline?: InputMaybe<Numeric_Comparison_Exp>;
  evaluations?: InputMaybe<Evaluation_Bool_Exp>;
  evaluatorConfig?: InputMaybe<String_Comparison_Exp>;
  evaluatorCount?: InputMaybe<Numeric_Comparison_Exp>;
  evaluatorSelector?: InputMaybe<String_Comparison_Exp>;
  evaluators?: InputMaybe<Evaluator_Bool_Exp>;
  executedProposalCount?: InputMaybe<Numeric_Comparison_Exp>;
  fundingTokens?: InputMaybe<DealFundingToken_Bool_Exp>;
  governanceFactoryAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  kindSelector?: InputMaybe<String_Comparison_Exp>;
  lastEvaluatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  linkHash?: InputMaybe<String_Comparison_Exp>;
  mainTokenHoldings?: InputMaybe<MainTokenHolder_Bool_Exp>;
  managedTreasuryAddress?: InputMaybe<String_Comparison_Exp>;
  moduleFactory?: InputMaybe<ModuleFactory_Bool_Exp>;
  moduleFactoryAddress?: InputMaybe<String_Comparison_Exp>;
  moduleFactory_id?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  proposalCount?: InputMaybe<Numeric_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  proposals?: InputMaybe<Proposal_Bool_Exp>;
  proposer?: InputMaybe<String_Comparison_Exp>;
  recovered?: InputMaybe<Boolean_Comparison_Exp>;
  recoveredBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  relatedContractCount?: InputMaybe<Numeric_Comparison_Exp>;
  relatedContracts?: InputMaybe<DealRelatedContract_Bool_Exp>;
  rewardsAllocated?: InputMaybe<Numeric_Comparison_Exp>;
  rewardsLimit?: InputMaybe<Numeric_Comparison_Exp>;
  stakePositions?: InputMaybe<DealAgentPosition_Bool_Exp>;
  stakeTokenAddress?: InputMaybe<String_Comparison_Exp>;
  stakerCount?: InputMaybe<Numeric_Comparison_Exp>;
  totalAgentTokens?: InputMaybe<Numeric_Comparison_Exp>;
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
  vetoRightEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  whitelistOnly?: InputMaybe<Boolean_Comparison_Exp>;
};

/** order by max() on columns of table "Deal" */
export type Deal_Max_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
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
  dealTargetAddress?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorConfig?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  evaluatorSelector?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  governanceFactoryAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  linkHash?: InputMaybe<Order_By>;
  managedTreasuryAddress?: InputMaybe<Order_By>;
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
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Deal" */
export type Deal_Min_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
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
  dealTargetAddress?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorConfig?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  evaluatorSelector?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  governanceFactoryAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  linkHash?: InputMaybe<Order_By>;
  managedTreasuryAddress?: InputMaybe<Order_By>;
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
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Deal". */
export type Deal_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  active?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  capitalMovements_aggregate?: InputMaybe<DealCapitalMovement_Aggregate_Order_By>;
  cellAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
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
  dealConfig?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  dealTargetAddress?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  earlyReturnsEnabled?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluations_aggregate?: InputMaybe<Evaluation_Aggregate_Order_By>;
  evaluatorConfig?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  evaluatorSelector?: InputMaybe<Order_By>;
  evaluators_aggregate?: InputMaybe<Evaluator_Aggregate_Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  fundingTokens_aggregate?: InputMaybe<DealFundingToken_Aggregate_Order_By>;
  governanceFactoryAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  linkHash?: InputMaybe<Order_By>;
  mainTokenHoldings_aggregate?: InputMaybe<MainTokenHolder_Aggregate_Order_By>;
  managedTreasuryAddress?: InputMaybe<Order_By>;
  moduleFactory?: InputMaybe<ModuleFactory_Order_By>;
  moduleFactoryAddress?: InputMaybe<Order_By>;
  moduleFactory_id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  proposals_aggregate?: InputMaybe<Proposal_Aggregate_Order_By>;
  proposer?: InputMaybe<Order_By>;
  recovered?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  relatedContracts_aggregate?: InputMaybe<DealRelatedContract_Aggregate_Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakePositions_aggregate?: InputMaybe<DealAgentPosition_Aggregate_Order_By>;
  stakeTokenAddress?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
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
  vetoRightEnabled?: InputMaybe<Order_By>;
  whitelistOnly?: InputMaybe<Order_By>;
};

/** select columns of table "Deal" */
export type Deal_Select_Column =
  /** column name */
  | 'activatedBlockNumber'
  /** column name */
  | 'active'
  /** column name */
  | 'approveDeadline'
  /** column name */
  | 'cellAddress'
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
  | 'dealConfig'
  /** column name */
  | 'dealDeadline'
  /** column name */
  | 'dealNumericId'
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
  | 'evaluatorSelector'
  /** column name */
  | 'executedProposalCount'
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
  | 'vetoRightEnabled'
  /** column name */
  | 'whitelistOnly';

/** order by stddev() on columns of table "Deal" */
export type Deal_Stddev_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Deal" */
export type Deal_Stddev_Pop_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Deal" */
export type Deal_Stddev_Samp_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
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
  approveDeadline?: InputMaybe<Scalars['numeric']['input']>;
  cellAddress?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
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
  dealConfig?: InputMaybe<Scalars['String']['input']>;
  dealDeadline?: InputMaybe<Scalars['numeric']['input']>;
  dealNumericId?: InputMaybe<Scalars['numeric']['input']>;
  dealTargetAddress?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  earlyReturnsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  evaluationDeadline?: InputMaybe<Scalars['numeric']['input']>;
  evaluatorConfig?: InputMaybe<Scalars['String']['input']>;
  evaluatorCount?: InputMaybe<Scalars['numeric']['input']>;
  evaluatorSelector?: InputMaybe<Scalars['String']['input']>;
  executedProposalCount?: InputMaybe<Scalars['numeric']['input']>;
  governanceFactoryAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  kindSelector?: InputMaybe<Scalars['String']['input']>;
  lastEvaluatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  linkHash?: InputMaybe<Scalars['String']['input']>;
  managedTreasuryAddress?: InputMaybe<Scalars['String']['input']>;
  moduleFactoryAddress?: InputMaybe<Scalars['String']['input']>;
  moduleFactory_id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  proposalCount?: InputMaybe<Scalars['numeric']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  proposer?: InputMaybe<Scalars['String']['input']>;
  recovered?: InputMaybe<Scalars['Boolean']['input']>;
  recoveredBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  relatedContractCount?: InputMaybe<Scalars['numeric']['input']>;
  rewardsAllocated?: InputMaybe<Scalars['numeric']['input']>;
  rewardsLimit?: InputMaybe<Scalars['numeric']['input']>;
  stakeTokenAddress?: InputMaybe<Scalars['String']['input']>;
  stakerCount?: InputMaybe<Scalars['numeric']['input']>;
  totalAgentTokens?: InputMaybe<Scalars['numeric']['input']>;
  totalEvaluationCount?: InputMaybe<Scalars['numeric']['input']>;
  totalReleasedStakeAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalRewardAllocatedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalRewardClaimedAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalSlashedStakeAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalStakedAmount?: InputMaybe<Scalars['numeric']['input']>;
  trancheCount?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  vetoEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  vetoRightEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  whitelistOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by sum() on columns of table "Deal" */
export type Deal_Sum_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Deal" */
export type Deal_Var_Pop_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Deal" */
export type Deal_Var_Samp_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Deal" */
export type Deal_Variance_Order_By = {
  activatedBlockNumber?: InputMaybe<Order_By>;
  approveDeadline?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  closedBlockNumber?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  currentStakedAmount?: InputMaybe<Order_By>;
  dealDeadline?: InputMaybe<Order_By>;
  dealNumericId?: InputMaybe<Order_By>;
  evaluationDeadline?: InputMaybe<Order_By>;
  evaluatorCount?: InputMaybe<Order_By>;
  executedProposalCount?: InputMaybe<Order_By>;
  lastEvaluatedBlockNumber?: InputMaybe<Order_By>;
  proposalCount?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  recoveredBlockNumber?: InputMaybe<Order_By>;
  relatedContractCount?: InputMaybe<Order_By>;
  rewardsAllocated?: InputMaybe<Order_By>;
  rewardsLimit?: InputMaybe<Order_By>;
  stakerCount?: InputMaybe<Order_By>;
  totalAgentTokens?: InputMaybe<Order_By>;
  totalEvaluationCount?: InputMaybe<Order_By>;
  totalReleasedStakeAmount?: InputMaybe<Order_By>;
  totalRewardAllocatedAmount?: InputMaybe<Order_By>;
  totalRewardClaimedAmount?: InputMaybe<Order_By>;
  totalSlashedStakeAmount?: InputMaybe<Order_By>;
  totalStakedAmount?: InputMaybe<Order_By>;
  trancheCount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
};

/** columns and relationships of "DividendPayout" */
export type DividendPayout = {
  __typename?: 'DividendPayout';
  chainId: Scalars['Int']['output'];
  claimCount: Scalars['numeric']['output'];
  claimedAmount: Scalars['numeric']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  merkleRoot: Scalars['String']['output'];
  payoutNumericId: Scalars['numeric']['output'];
  tokenAddress: Scalars['String']['output'];
  totalPayout: Scalars['numeric']['output'];
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

/** columns and relationships of "Evaluation" */
export type Evaluation = {
  __typename?: 'Evaluation';
  chainId: Scalars['Int']['output'];
  commandCount: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  evaluationSequence: Scalars['numeric']['output'];
  evaluationsData: Scalars['String']['output'];
  /** An object relationship */
  evaluator?: Maybe<Evaluator>;
  evaluatorAddress: Scalars['String']['output'];
  evaluatorId: Scalars['String']['output'];
  evaluator_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
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

/** columns and relationships of "Evaluator" */
export type Evaluator = {
  __typename?: 'Evaluator';
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  evaluationCount: Scalars['numeric']['output'];
  /** An array relationship */
  evaluations: Array<Evaluation>;
  evaluatorAddress: Scalars['String']['output'];
  id: Scalars['String']['output'];
  kindSelector: Scalars['String']['output'];
  lastEvaluatedBlockNumber?: Maybe<Scalars['numeric']['output']>;
};


/** columns and relationships of "Evaluator" */
export type EvaluatorEvaluationsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Order_By>>;
  where?: InputMaybe<Evaluation_Bool_Exp>;
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

/** columns and relationships of "MainTokenHolder" */
export type MainTokenHolder = {
  __typename?: 'MainTokenHolder';
  /** An object relationship */
  account?: Maybe<Account>;
  accountId: Scalars['String']['output'];
  account_id: Scalars['String']['output'];
  balance: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId?: Maybe<Scalars['String']['output']>;
  deal_id?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isHolder: Scalars['Boolean']['output'];
  lastTransferBlockNumber?: Maybe<Scalars['numeric']['output']>;
  totalReceivedAmount: Scalars['numeric']['output'];
  totalSentAmount: Scalars['numeric']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
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

/** columns and relationships of "ModuleFactory" */
export type ModuleFactory = {
  __typename?: 'ModuleFactory';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  /** An array relationship */
  dacModules: Array<DacModule>;
  id: Scalars['String']['output'];
  knownImplementation: Scalars['Boolean']['output'];
  manifestUri?: Maybe<Scalars['String']['output']>;
  moduleIdHex?: Maybe<Scalars['String']['output']>;
  moduleIdText?: Maybe<Scalars['String']['output']>;
  moduleVersion?: Maybe<Scalars['String']['output']>;
  updatedBlockNumber: Scalars['numeric']['output'];
};


/** columns and relationships of "ModuleFactory" */
export type ModuleFactoryDacModulesArgs = {
  distinct_on?: InputMaybe<Array<DacModule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DacModule_Order_By>>;
  where?: InputMaybe<DacModule_Bool_Exp>;
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

/** columns and relationships of "Proposal" */
export type Proposal = {
  __typename?: 'Proposal';
  blockingQuorum?: Maybe<Scalars['numeric']['output']>;
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId?: Maybe<Scalars['String']['output']>;
  dac_id?: Maybe<Scalars['String']['output']>;
  data1?: Maybe<Scalars['String']['output']>;
  data2?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId?: Maybe<Scalars['String']['output']>;
  deal_id?: Maybe<Scalars['String']['output']>;
  endTime?: Maybe<Scalars['numeric']['output']>;
  executed: Scalars['Boolean']['output'];
  executedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  id: Scalars['String']['output'];
  kindSelector?: Maybe<Scalars['String']['output']>;
  noVotes: Scalars['numeric']['output'];
  passed?: Maybe<Scalars['Boolean']['output']>;
  proposalAddress: Scalars['String']['output'];
  proposalNumericId?: Maybe<Scalars['numeric']['output']>;
  quorum?: Maybe<Scalars['numeric']['output']>;
  resolved: Scalars['Boolean']['output'];
  resolvedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  scope?: Maybe<Scalars['String']['output']>;
  snapshotTime?: Maybe<Scalars['numeric']['output']>;
  targetAddress?: Maybe<Scalars['String']['output']>;
  tokenAddress?: Maybe<Scalars['String']['output']>;
  totalVotingPower?: Maybe<Scalars['numeric']['output']>;
  vetoCasted: Scalars['Boolean']['output'];
  vetoRight: Scalars['Boolean']['output'];
  voteCount: Scalars['numeric']['output'];
  /** An array relationship */
  votes: Array<ProposalVote>;
  yesVotes: Scalars['numeric']['output'];
};


/** columns and relationships of "Proposal" */
export type ProposalVotesArgs = {
  distinct_on?: InputMaybe<Array<ProposalVote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ProposalVote_Order_By>>;
  where?: InputMaybe<ProposalVote_Bool_Exp>;
};

/** columns and relationships of "ProposalLookup" */
export type ProposalLookup = {
  __typename?: 'ProposalLookup';
  chainId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  ownerId: Scalars['String']['output'];
  /** An object relationship */
  proposal?: Maybe<Proposal>;
  proposalId: Scalars['String']['output'];
  proposalNumericId: Scalars['numeric']['output'];
  proposal_id: Scalars['String']['output'];
  scope: Scalars['String']['output'];
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

/** columns and relationships of "ProposalVote" */
export type ProposalVote = {
  __typename?: 'ProposalVote';
  /** An object relationship */
  account?: Maybe<Account>;
  account_id: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  /** An object relationship */
  proposal?: Maybe<Proposal>;
  proposalAddress: Scalars['String']['output'];
  proposalId: Scalars['String']['output'];
  proposal_id: Scalars['String']['output'];
  support: Scalars['Boolean']['output'];
  voter: Scalars['String']['output'];
  weight: Scalars['numeric']['output'];
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
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
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
  createdBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  createdBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
  createdTransactionHash?: InputMaybe<String_Comparison_Exp>;
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
  id?: InputMaybe<String_Comparison_Exp>;
  kindSelector?: InputMaybe<String_Comparison_Exp>;
  noVotes?: InputMaybe<Numeric_Comparison_Exp>;
  passed?: InputMaybe<Boolean_Comparison_Exp>;
  proposalAddress?: InputMaybe<String_Comparison_Exp>;
  proposalNumericId?: InputMaybe<Numeric_Comparison_Exp>;
  quorum?: InputMaybe<Numeric_Comparison_Exp>;
  resolved?: InputMaybe<Boolean_Comparison_Exp>;
  resolvedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  scope?: InputMaybe<String_Comparison_Exp>;
  snapshotTime?: InputMaybe<Numeric_Comparison_Exp>;
  targetAddress?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  totalVotingPower?: InputMaybe<Numeric_Comparison_Exp>;
  vetoCasted?: InputMaybe<Boolean_Comparison_Exp>;
  vetoRight?: InputMaybe<Boolean_Comparison_Exp>;
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
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data1?: InputMaybe<Order_By>;
  data2?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalAddress?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  scope?: InputMaybe<Order_By>;
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
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  data1?: InputMaybe<Order_By>;
  data2?: InputMaybe<Order_By>;
  dealId?: InputMaybe<Order_By>;
  deal_id?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalAddress?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  scope?: InputMaybe<Order_By>;
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
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  createdTransactionHash?: InputMaybe<Order_By>;
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
  id?: InputMaybe<Order_By>;
  kindSelector?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  passed?: InputMaybe<Order_By>;
  proposalAddress?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolved?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  scope?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  targetAddress?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  vetoCasted?: InputMaybe<Order_By>;
  vetoRight?: InputMaybe<Order_By>;
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
  | 'id'
  /** column name */
  | 'kindSelector'
  /** column name */
  | 'noVotes'
  /** column name */
  | 'passed'
  /** column name */
  | 'proposalAddress'
  /** column name */
  | 'proposalNumericId'
  /** column name */
  | 'quorum'
  /** column name */
  | 'resolved'
  /** column name */
  | 'resolvedBlockNumber'
  /** column name */
  | 'scope'
  /** column name */
  | 'snapshotTime'
  /** column name */
  | 'targetAddress'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'totalVotingPower'
  /** column name */
  | 'vetoCasted'
  /** column name */
  | 'vetoRight'
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
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
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
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
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
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
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
  createdBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  createdBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
  createdTransactionHash?: InputMaybe<Scalars['String']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  data1?: InputMaybe<Scalars['String']['input']>;
  data2?: InputMaybe<Scalars['String']['input']>;
  dealId?: InputMaybe<Scalars['String']['input']>;
  deal_id?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['numeric']['input']>;
  executed?: InputMaybe<Scalars['Boolean']['input']>;
  executedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  kindSelector?: InputMaybe<Scalars['String']['input']>;
  noVotes?: InputMaybe<Scalars['numeric']['input']>;
  passed?: InputMaybe<Scalars['Boolean']['input']>;
  proposalAddress?: InputMaybe<Scalars['String']['input']>;
  proposalNumericId?: InputMaybe<Scalars['numeric']['input']>;
  quorum?: InputMaybe<Scalars['numeric']['input']>;
  resolved?: InputMaybe<Scalars['Boolean']['input']>;
  resolvedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  scope?: InputMaybe<Scalars['String']['input']>;
  snapshotTime?: InputMaybe<Scalars['numeric']['input']>;
  targetAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  totalVotingPower?: InputMaybe<Scalars['numeric']['input']>;
  vetoCasted?: InputMaybe<Scalars['Boolean']['input']>;
  vetoRight?: InputMaybe<Scalars['Boolean']['input']>;
  voteCount?: InputMaybe<Scalars['numeric']['input']>;
  yesVotes?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "Proposal" */
export type Proposal_Sum_Order_By = {
  blockingQuorum?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdBlockNumber?: InputMaybe<Order_By>;
  createdBlockTimestamp?: InputMaybe<Order_By>;
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
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
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
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
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
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
  endTime?: InputMaybe<Order_By>;
  executedBlockNumber?: InputMaybe<Order_By>;
  noVotes?: InputMaybe<Order_By>;
  proposalNumericId?: InputMaybe<Order_By>;
  quorum?: InputMaybe<Order_By>;
  resolvedBlockNumber?: InputMaybe<Order_By>;
  snapshotTime?: InputMaybe<Order_By>;
  totalVotingPower?: InputMaybe<Order_By>;
  voteCount?: InputMaybe<Order_By>;
  yesVotes?: InputMaybe<Order_By>;
};

/** columns and relationships of "RelatedContractIndex" */
export type RelatedContractIndex = {
  __typename?: 'RelatedContractIndex';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  roleHex: Scalars['String']['output'];
  roleText?: Maybe<Scalars['String']['output']>;
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

/** columns and relationships of "TokenContractIndex" */
export type TokenContractIndex = {
  __typename?: 'TokenContractIndex';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  deal?: Maybe<Deal>;
  deal_id?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  tokenType: Scalars['String']['output'];
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

/** columns and relationships of "Tranche" */
export type Tranche = {
  __typename?: 'Tranche';
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isInitialTranche: Scalars['Boolean']['output'];
  proposalNumericId?: Maybe<Scalars['numeric']['output']>;
  requestedAmount?: Maybe<Scalars['numeric']['output']>;
  rewardsLimit?: Maybe<Scalars['numeric']['output']>;
  settled: Scalars['Boolean']['output'];
  settledAmount?: Maybe<Scalars['numeric']['output']>;
  settledBlockNumber?: Maybe<Scalars['numeric']['output']>;
  tokenAddress?: Maybe<Scalars['String']['output']>;
  trancheNumericId: Scalars['numeric']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
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

/** columns and relationships of "TreasuryAction" */
export type TreasuryAction = {
  __typename?: 'TreasuryAction';
  actionType: Scalars['String']['output'];
  agent?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['numeric']['output']>;
  chainId: Scalars['Int']['output'];
  counterpartyAddress?: Maybe<Scalars['String']['output']>;
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  dealSize?: Maybe<Scalars['numeric']['output']>;
  deal_id: Scalars['String']['output'];
  destinationAddress?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  sourceAddress?: Maybe<Scalars['String']['output']>;
  tokenAddress?: Maybe<Scalars['String']['output']>;
  treasuryAddress?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  treasuryDeal?: Maybe<TreasuryDeal>;
  treasuryDealId: Scalars['String']['output'];
  treasuryDeal_id: Scalars['String']['output'];
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

/** columns and relationships of "TreasuryAgent" */
export type TreasuryAgent = {
  __typename?: 'TreasuryAgent';
  agentAddress: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  /** An array relationship */
  spendAllowances: Array<TreasuryAllowance>;
  /** An object relationship */
  treasuryDeal?: Maybe<TreasuryDeal>;
  treasuryDealId: Scalars['String']['output'];
  treasuryDeal_id: Scalars['String']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
};


/** columns and relationships of "TreasuryAgent" */
export type TreasuryAgentSpendAllowancesArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAllowance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAllowance_Order_By>>;
  where?: InputMaybe<TreasuryAllowance_Bool_Exp>;
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

/** columns and relationships of "TreasuryAllowance" */
export type TreasuryAllowance = {
  __typename?: 'TreasuryAllowance';
  /** An object relationship */
  agent?: Maybe<TreasuryAgent>;
  agentAddress: Scalars['String']['output'];
  agentId: Scalars['String']['output'];
  agent_id: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  counterpartyAddress: Scalars['String']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  isWildcard: Scalars['Boolean']['output'];
  /** An array relationship */
  receipts: Array<TreasuryReceipt>;
  receiveClockLimit?: Maybe<Scalars['numeric']['output']>;
  receiveDuration?: Maybe<Scalars['numeric']['output']>;
  receiveSingleTxAmount?: Maybe<Scalars['numeric']['output']>;
  remainingReceive: Scalars['numeric']['output'];
  remainingSpend: Scalars['numeric']['output'];
  revokedBlockNumber?: Maybe<Scalars['numeric']['output']>;
  spendClockLimit?: Maybe<Scalars['numeric']['output']>;
  spendDuration?: Maybe<Scalars['numeric']['output']>;
  spendSingleTxAmount?: Maybe<Scalars['numeric']['output']>;
  tokenAddress: Scalars['String']['output'];
  totalReceiveAllowed: Scalars['numeric']['output'];
  totalReceived: Scalars['numeric']['output'];
  totalSpendAllowed: Scalars['numeric']['output'];
  totalSpent: Scalars['numeric']['output'];
  transactionCount: Scalars['Int']['output'];
  /** An object relationship */
  treasuryDeal?: Maybe<TreasuryDeal>;
  treasuryDealId: Scalars['String']['output'];
  treasuryDeal_id: Scalars['String']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
};


/** columns and relationships of "TreasuryAllowance" */
export type TreasuryAllowanceReceiptsArgs = {
  distinct_on?: InputMaybe<Array<TreasuryReceipt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryReceipt_Order_By>>;
  where?: InputMaybe<TreasuryReceipt_Bool_Exp>;
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

/** columns and relationships of "TreasuryDeal" */
export type TreasuryDeal = {
  __typename?: 'TreasuryDeal';
  /** An array relationship */
  agents: Array<TreasuryAgent>;
  /** An array relationship */
  allowances: Array<TreasuryAllowance>;
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId: Scalars['String']['output'];
  deal_id: Scalars['String']['output'];
  /** An array relationship */
  delegations: Array<TreasuryDelegation>;
  id: Scalars['String']['output'];
  managedTreasuryAddress?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  receipts: Array<TreasuryReceipt>;
  /** An array relationship */
  treasuryActions: Array<TreasuryAction>;
  updatedBlockNumber: Scalars['numeric']['output'];
};


/** columns and relationships of "TreasuryDeal" */
export type TreasuryDealAgentsArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAgent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAgent_Order_By>>;
  where?: InputMaybe<TreasuryAgent_Bool_Exp>;
};


/** columns and relationships of "TreasuryDeal" */
export type TreasuryDealAllowancesArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAllowance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAllowance_Order_By>>;
  where?: InputMaybe<TreasuryAllowance_Bool_Exp>;
};


/** columns and relationships of "TreasuryDeal" */
export type TreasuryDealDelegationsArgs = {
  distinct_on?: InputMaybe<Array<TreasuryDelegation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryDelegation_Order_By>>;
  where?: InputMaybe<TreasuryDelegation_Bool_Exp>;
};


/** columns and relationships of "TreasuryDeal" */
export type TreasuryDealReceiptsArgs = {
  distinct_on?: InputMaybe<Array<TreasuryReceipt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryReceipt_Order_By>>;
  where?: InputMaybe<TreasuryReceipt_Bool_Exp>;
};


/** columns and relationships of "TreasuryDeal" */
export type TreasuryDealTreasuryActionsArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAction_Order_By>>;
  where?: InputMaybe<TreasuryAction_Bool_Exp>;
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

/** columns and relationships of "TreasuryDelegation" */
export type TreasuryDelegation = {
  __typename?: 'TreasuryDelegation';
  active: Scalars['Boolean']['output'];
  chainId: Scalars['Int']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  delegatedTokenAddress: Scalars['String']['output'];
  delegateeAddress: Scalars['String']['output'];
  id: Scalars['String']['output'];
  /** An object relationship */
  treasuryDeal?: Maybe<TreasuryDeal>;
  treasuryDealId: Scalars['String']['output'];
  treasuryDeal_id: Scalars['String']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
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

/** columns and relationships of "TreasuryHolding" */
export type TreasuryHolding = {
  __typename?: 'TreasuryHolding';
  balance: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  creditedAmount: Scalars['numeric']['output'];
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  debitedAmount: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  tokenAddress: Scalars['String']['output'];
  updatedBlockNumber: Scalars['numeric']['output'];
  updatedBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
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
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "TreasuryHolding". All fields are combined with a logical 'AND'. */
export type TreasuryHolding_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryHolding_Bool_Exp>>;
  _not?: InputMaybe<TreasuryHolding_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryHolding_Bool_Exp>>;
  balance?: InputMaybe<Numeric_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  creditedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  dac?: InputMaybe<Dac_Bool_Exp>;
  dacId?: InputMaybe<String_Comparison_Exp>;
  dac_id?: InputMaybe<String_Comparison_Exp>;
  debitedAmount?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  updatedBlockNumber?: InputMaybe<Numeric_Comparison_Exp>;
  updatedBlockTimestamp?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Max_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Min_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "TreasuryHolding". */
export type TreasuryHolding_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  dac?: InputMaybe<Dac_Order_By>;
  dacId?: InputMaybe<Order_By>;
  dac_id?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** select columns of table "TreasuryHolding" */
export type TreasuryHolding_Select_Column =
  /** column name */
  | 'balance'
  /** column name */
  | 'chainId'
  /** column name */
  | 'creditedAmount'
  /** column name */
  | 'dacId'
  /** column name */
  | 'dac_id'
  /** column name */
  | 'debitedAmount'
  /** column name */
  | 'id'
  /** column name */
  | 'tokenAddress'
  /** column name */
  | 'updatedBlockNumber'
  /** column name */
  | 'updatedBlockTimestamp';

/** order by stddev() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Stddev_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Stddev_Pop_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Stddev_Samp_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
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
  balance?: InputMaybe<Scalars['numeric']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  creditedAmount?: InputMaybe<Scalars['numeric']['input']>;
  dacId?: InputMaybe<Scalars['String']['input']>;
  dac_id?: InputMaybe<Scalars['String']['input']>;
  debitedAmount?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  updatedBlockNumber?: InputMaybe<Scalars['numeric']['input']>;
  updatedBlockTimestamp?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Sum_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Var_Pop_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Var_Samp_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "TreasuryHolding" */
export type TreasuryHolding_Variance_Order_By = {
  balance?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  creditedAmount?: InputMaybe<Order_By>;
  debitedAmount?: InputMaybe<Order_By>;
  updatedBlockNumber?: InputMaybe<Order_By>;
  updatedBlockTimestamp?: InputMaybe<Order_By>;
};

/** columns and relationships of "TreasuryMovement" */
export type TreasuryMovement = {
  __typename?: 'TreasuryMovement';
  amount: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  counterpartyAddress?: Maybe<Scalars['String']['output']>;
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  dac?: Maybe<Dac>;
  dacId: Scalars['String']['output'];
  dac_id: Scalars['String']['output'];
  /** An object relationship */
  deal?: Maybe<Deal>;
  dealId?: Maybe<Scalars['String']['output']>;
  deal_id?: Maybe<Scalars['String']['output']>;
  direction: Scalars['String']['output'];
  id: Scalars['String']['output'];
  movementType: Scalars['String']['output'];
  proposalNumericId?: Maybe<Scalars['numeric']['output']>;
  tokenAddress: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "TreasuryMovement". All fields are combined with a logical 'AND'. */
export type TreasuryMovement_Bool_Exp = {
  _and?: InputMaybe<Array<TreasuryMovement_Bool_Exp>>;
  _not?: InputMaybe<TreasuryMovement_Bool_Exp>;
  _or?: InputMaybe<Array<TreasuryMovement_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
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
};

/** Ordering options when selecting data from "TreasuryMovement". */
export type TreasuryMovement_Order_By = {
  amount?: InputMaybe<Order_By>;
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
};

/** select columns of table "TreasuryMovement" */
export type TreasuryMovement_Select_Column =
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
  | 'tokenAddress';

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
};

/** columns and relationships of "TreasuryReceipt" */
export type TreasuryReceipt = {
  __typename?: 'TreasuryReceipt';
  agentAddress: Scalars['String']['output'];
  /** An object relationship */
  allowance?: Maybe<TreasuryAllowance>;
  allowanceId: Scalars['String']['output'];
  allowance_id: Scalars['String']['output'];
  amount: Scalars['numeric']['output'];
  chainId: Scalars['Int']['output'];
  counterpartyAddress: Scalars['String']['output'];
  createdBlockNumber: Scalars['numeric']['output'];
  createdBlockTimestamp?: Maybe<Scalars['numeric']['output']>;
  createdTransactionHash?: Maybe<Scalars['String']['output']>;
  direction: Scalars['String']['output'];
  id: Scalars['String']['output'];
  tokenAddress: Scalars['String']['output'];
  /** An object relationship */
  treasuryDeal?: Maybe<TreasuryDeal>;
  treasuryDealId: Scalars['String']['output'];
  treasuryDeal_id: Scalars['String']['output'];
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

/** columns and relationships of "_meta" */
export type _Meta = {
  __typename?: '_meta';
  bufferBlock?: Maybe<Scalars['Int']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  endBlock?: Maybe<Scalars['Int']['output']>;
  eventsProcessed?: Maybe<Scalars['Int']['output']>;
  firstEventBlock?: Maybe<Scalars['Int']['output']>;
  isReady?: Maybe<Scalars['Boolean']['output']>;
  progressBlock?: Maybe<Scalars['Int']['output']>;
  readyAt?: Maybe<Scalars['timestamptz']['output']>;
  sourceBlock?: Maybe<Scalars['Int']['output']>;
  startBlock?: Maybe<Scalars['Int']['output']>;
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

/** columns and relationships of "chain_metadata" */
export type Chain_Metadata = {
  __typename?: 'chain_metadata';
  block_height?: Maybe<Scalars['Int']['output']>;
  chain_id?: Maybe<Scalars['Int']['output']>;
  end_block?: Maybe<Scalars['Int']['output']>;
  first_event_block_number?: Maybe<Scalars['Int']['output']>;
  is_hyper_sync?: Maybe<Scalars['Boolean']['output']>;
  latest_fetched_block_number?: Maybe<Scalars['Int']['output']>;
  latest_processed_block?: Maybe<Scalars['Int']['output']>;
  num_batches_fetched?: Maybe<Scalars['Int']['output']>;
  num_events_processed?: Maybe<Scalars['Int']['output']>;
  start_block?: Maybe<Scalars['Int']['output']>;
  timestamp_caught_up_to_head_or_endblock?: Maybe<Scalars['timestamptz']['output']>;
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

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "Account" */
  Account: Array<Account>;
  /** fetch data from the table: "Account" using primary key columns */
  Account_by_pk?: Maybe<Account>;
  /** fetch data from the table: "AgentAction" */
  AgentAction: Array<AgentAction>;
  /** fetch data from the table: "AgentAction" using primary key columns */
  AgentAction_by_pk?: Maybe<AgentAction>;
  /** fetch data from the table: "CapitalCall" */
  CapitalCall: Array<CapitalCall>;
  /** fetch data from the table: "CapitalCall" using primary key columns */
  CapitalCall_by_pk?: Maybe<CapitalCall>;
  /** fetch data from the table: "ChildDacDeal" */
  ChildDacDeal: Array<ChildDacDeal>;
  /** fetch data from the table: "ChildDacDeal" using primary key columns */
  ChildDacDeal_by_pk?: Maybe<ChildDacDeal>;
  /** fetch data from the table: "ChildVote" */
  ChildVote: Array<ChildVote>;
  /** fetch data from the table: "ChildVote" using primary key columns */
  ChildVote_by_pk?: Maybe<ChildVote>;
  /** fetch data from the table: "ControlledAddress" */
  ControlledAddress: Array<ControlledAddress>;
  /** fetch data from the table: "ControlledAddress" using primary key columns */
  ControlledAddress_by_pk?: Maybe<ControlledAddress>;
  /** fetch data from the table: "Dac" */
  Dac: Array<Dac>;
  /** fetch data from the table: "DacAgent" */
  DacAgent: Array<DacAgent>;
  /** fetch data from the table: "DacAgent" using primary key columns */
  DacAgent_by_pk?: Maybe<DacAgent>;
  /** fetch data from the table: "DacModule" */
  DacModule: Array<DacModule>;
  /** fetch data from the table: "DacModule" using primary key columns */
  DacModule_by_pk?: Maybe<DacModule>;
  /** fetch data from the table: "Dac" using primary key columns */
  Dac_by_pk?: Maybe<Dac>;
  /** fetch data from the table: "Deal" */
  Deal: Array<Deal>;
  /** fetch data from the table: "DealAddressIndex" */
  DealAddressIndex: Array<DealAddressIndex>;
  /** fetch data from the table: "DealAddressIndex" using primary key columns */
  DealAddressIndex_by_pk?: Maybe<DealAddressIndex>;
  /** fetch data from the table: "DealAgentPosition" */
  DealAgentPosition: Array<DealAgentPosition>;
  /** fetch data from the table: "DealAgentPosition" using primary key columns */
  DealAgentPosition_by_pk?: Maybe<DealAgentPosition>;
  /** fetch data from the table: "DealCapitalMovement" */
  DealCapitalMovement: Array<DealCapitalMovement>;
  /** fetch data from the table: "DealCapitalMovement" using primary key columns */
  DealCapitalMovement_by_pk?: Maybe<DealCapitalMovement>;
  /** fetch data from the table: "DealFundingToken" */
  DealFundingToken: Array<DealFundingToken>;
  /** fetch data from the table: "DealFundingToken" using primary key columns */
  DealFundingToken_by_pk?: Maybe<DealFundingToken>;
  /** fetch data from the table: "DealLookup" */
  DealLookup: Array<DealLookup>;
  /** fetch data from the table: "DealLookup" using primary key columns */
  DealLookup_by_pk?: Maybe<DealLookup>;
  /** fetch data from the table: "DealRelatedContract" */
  DealRelatedContract: Array<DealRelatedContract>;
  /** fetch data from the table: "DealRelatedContract" using primary key columns */
  DealRelatedContract_by_pk?: Maybe<DealRelatedContract>;
  /** fetch data from the table: "Deal" using primary key columns */
  Deal_by_pk?: Maybe<Deal>;
  /** fetch data from the table: "DividendPayout" */
  DividendPayout: Array<DividendPayout>;
  /** fetch data from the table: "DividendPayout" using primary key columns */
  DividendPayout_by_pk?: Maybe<DividendPayout>;
  /** fetch data from the table: "Evaluation" */
  Evaluation: Array<Evaluation>;
  /** fetch data from the table: "Evaluation" using primary key columns */
  Evaluation_by_pk?: Maybe<Evaluation>;
  /** fetch data from the table: "Evaluator" */
  Evaluator: Array<Evaluator>;
  /** fetch data from the table: "Evaluator" using primary key columns */
  Evaluator_by_pk?: Maybe<Evaluator>;
  /** fetch data from the table: "MainTokenHolder" */
  MainTokenHolder: Array<MainTokenHolder>;
  /** fetch data from the table: "MainTokenHolder" using primary key columns */
  MainTokenHolder_by_pk?: Maybe<MainTokenHolder>;
  /** fetch data from the table: "ModuleFactory" */
  ModuleFactory: Array<ModuleFactory>;
  /** fetch data from the table: "ModuleFactory" using primary key columns */
  ModuleFactory_by_pk?: Maybe<ModuleFactory>;
  /** fetch data from the table: "Proposal" */
  Proposal: Array<Proposal>;
  /** fetch data from the table: "ProposalLookup" */
  ProposalLookup: Array<ProposalLookup>;
  /** fetch data from the table: "ProposalLookup" using primary key columns */
  ProposalLookup_by_pk?: Maybe<ProposalLookup>;
  /** fetch data from the table: "ProposalVote" */
  ProposalVote: Array<ProposalVote>;
  /** fetch data from the table: "ProposalVote" using primary key columns */
  ProposalVote_by_pk?: Maybe<ProposalVote>;
  /** fetch data from the table: "Proposal" using primary key columns */
  Proposal_by_pk?: Maybe<Proposal>;
  /** fetch data from the table: "RelatedContractIndex" */
  RelatedContractIndex: Array<RelatedContractIndex>;
  /** fetch data from the table: "RelatedContractIndex" using primary key columns */
  RelatedContractIndex_by_pk?: Maybe<RelatedContractIndex>;
  /** fetch data from the table: "TokenContractIndex" */
  TokenContractIndex: Array<TokenContractIndex>;
  /** fetch data from the table: "TokenContractIndex" using primary key columns */
  TokenContractIndex_by_pk?: Maybe<TokenContractIndex>;
  /** fetch data from the table: "Tranche" */
  Tranche: Array<Tranche>;
  /** fetch data from the table: "Tranche" using primary key columns */
  Tranche_by_pk?: Maybe<Tranche>;
  /** fetch data from the table: "TreasuryAction" */
  TreasuryAction: Array<TreasuryAction>;
  /** fetch data from the table: "TreasuryAction" using primary key columns */
  TreasuryAction_by_pk?: Maybe<TreasuryAction>;
  /** fetch data from the table: "TreasuryAgent" */
  TreasuryAgent: Array<TreasuryAgent>;
  /** fetch data from the table: "TreasuryAgent" using primary key columns */
  TreasuryAgent_by_pk?: Maybe<TreasuryAgent>;
  /** fetch data from the table: "TreasuryAllowance" */
  TreasuryAllowance: Array<TreasuryAllowance>;
  /** fetch data from the table: "TreasuryAllowance" using primary key columns */
  TreasuryAllowance_by_pk?: Maybe<TreasuryAllowance>;
  /** fetch data from the table: "TreasuryDeal" */
  TreasuryDeal: Array<TreasuryDeal>;
  /** fetch data from the table: "TreasuryDeal" using primary key columns */
  TreasuryDeal_by_pk?: Maybe<TreasuryDeal>;
  /** fetch data from the table: "TreasuryDelegation" */
  TreasuryDelegation: Array<TreasuryDelegation>;
  /** fetch data from the table: "TreasuryDelegation" using primary key columns */
  TreasuryDelegation_by_pk?: Maybe<TreasuryDelegation>;
  /** fetch data from the table: "TreasuryHolding" */
  TreasuryHolding: Array<TreasuryHolding>;
  /** fetch data from the table: "TreasuryHolding" using primary key columns */
  TreasuryHolding_by_pk?: Maybe<TreasuryHolding>;
  /** fetch data from the table: "TreasuryMovement" */
  TreasuryMovement: Array<TreasuryMovement>;
  /** fetch data from the table: "TreasuryMovement" using primary key columns */
  TreasuryMovement_by_pk?: Maybe<TreasuryMovement>;
  /** fetch data from the table: "TreasuryReceipt" */
  TreasuryReceipt: Array<TreasuryReceipt>;
  /** fetch data from the table: "TreasuryReceipt" using primary key columns */
  TreasuryReceipt_by_pk?: Maybe<TreasuryReceipt>;
  /** fetch data from the table: "_meta" */
  _meta: Array<_Meta>;
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<Chain_Metadata>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>;
};


export type Query_RootAccountArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Query_RootAccount_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootAgentActionArgs = {
  distinct_on?: InputMaybe<Array<AgentAction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AgentAction_Order_By>>;
  where?: InputMaybe<AgentAction_Bool_Exp>;
};


export type Query_RootAgentAction_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootCapitalCallArgs = {
  distinct_on?: InputMaybe<Array<CapitalCall_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CapitalCall_Order_By>>;
  where?: InputMaybe<CapitalCall_Bool_Exp>;
};


export type Query_RootCapitalCall_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootChildDacDealArgs = {
  distinct_on?: InputMaybe<Array<ChildDacDeal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ChildDacDeal_Order_By>>;
  where?: InputMaybe<ChildDacDeal_Bool_Exp>;
};


export type Query_RootChildDacDeal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootChildVoteArgs = {
  distinct_on?: InputMaybe<Array<ChildVote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ChildVote_Order_By>>;
  where?: InputMaybe<ChildVote_Bool_Exp>;
};


export type Query_RootChildVote_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootControlledAddressArgs = {
  distinct_on?: InputMaybe<Array<ControlledAddress_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ControlledAddress_Order_By>>;
  where?: InputMaybe<ControlledAddress_Bool_Exp>;
};


export type Query_RootControlledAddress_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDacArgs = {
  distinct_on?: InputMaybe<Array<Dac_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dac_Order_By>>;
  where?: InputMaybe<Dac_Bool_Exp>;
};


export type Query_RootDacAgentArgs = {
  distinct_on?: InputMaybe<Array<DacAgent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DacAgent_Order_By>>;
  where?: InputMaybe<DacAgent_Bool_Exp>;
};


export type Query_RootDacAgent_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDacModuleArgs = {
  distinct_on?: InputMaybe<Array<DacModule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DacModule_Order_By>>;
  where?: InputMaybe<DacModule_Bool_Exp>;
};


export type Query_RootDacModule_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDac_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDealArgs = {
  distinct_on?: InputMaybe<Array<Deal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Deal_Order_By>>;
  where?: InputMaybe<Deal_Bool_Exp>;
};


export type Query_RootDealAddressIndexArgs = {
  distinct_on?: InputMaybe<Array<DealAddressIndex_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealAddressIndex_Order_By>>;
  where?: InputMaybe<DealAddressIndex_Bool_Exp>;
};


export type Query_RootDealAddressIndex_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDealAgentPositionArgs = {
  distinct_on?: InputMaybe<Array<DealAgentPosition_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealAgentPosition_Order_By>>;
  where?: InputMaybe<DealAgentPosition_Bool_Exp>;
};


export type Query_RootDealAgentPosition_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDealCapitalMovementArgs = {
  distinct_on?: InputMaybe<Array<DealCapitalMovement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealCapitalMovement_Order_By>>;
  where?: InputMaybe<DealCapitalMovement_Bool_Exp>;
};


export type Query_RootDealCapitalMovement_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDealFundingTokenArgs = {
  distinct_on?: InputMaybe<Array<DealFundingToken_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealFundingToken_Order_By>>;
  where?: InputMaybe<DealFundingToken_Bool_Exp>;
};


export type Query_RootDealFundingToken_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDealLookupArgs = {
  distinct_on?: InputMaybe<Array<DealLookup_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealLookup_Order_By>>;
  where?: InputMaybe<DealLookup_Bool_Exp>;
};


export type Query_RootDealLookup_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDealRelatedContractArgs = {
  distinct_on?: InputMaybe<Array<DealRelatedContract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealRelatedContract_Order_By>>;
  where?: InputMaybe<DealRelatedContract_Bool_Exp>;
};


export type Query_RootDealRelatedContract_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDeal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootDividendPayoutArgs = {
  distinct_on?: InputMaybe<Array<DividendPayout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DividendPayout_Order_By>>;
  where?: InputMaybe<DividendPayout_Bool_Exp>;
};


export type Query_RootDividendPayout_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootEvaluationArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Order_By>>;
  where?: InputMaybe<Evaluation_Bool_Exp>;
};


export type Query_RootEvaluation_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootEvaluatorArgs = {
  distinct_on?: InputMaybe<Array<Evaluator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluator_Order_By>>;
  where?: InputMaybe<Evaluator_Bool_Exp>;
};


export type Query_RootEvaluator_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootMainTokenHolderArgs = {
  distinct_on?: InputMaybe<Array<MainTokenHolder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MainTokenHolder_Order_By>>;
  where?: InputMaybe<MainTokenHolder_Bool_Exp>;
};


export type Query_RootMainTokenHolder_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootModuleFactoryArgs = {
  distinct_on?: InputMaybe<Array<ModuleFactory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ModuleFactory_Order_By>>;
  where?: InputMaybe<ModuleFactory_Bool_Exp>;
};


export type Query_RootModuleFactory_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootProposalArgs = {
  distinct_on?: InputMaybe<Array<Proposal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Proposal_Order_By>>;
  where?: InputMaybe<Proposal_Bool_Exp>;
};


export type Query_RootProposalLookupArgs = {
  distinct_on?: InputMaybe<Array<ProposalLookup_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ProposalLookup_Order_By>>;
  where?: InputMaybe<ProposalLookup_Bool_Exp>;
};


export type Query_RootProposalLookup_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootProposalVoteArgs = {
  distinct_on?: InputMaybe<Array<ProposalVote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ProposalVote_Order_By>>;
  where?: InputMaybe<ProposalVote_Bool_Exp>;
};


export type Query_RootProposalVote_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootProposal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRelatedContractIndexArgs = {
  distinct_on?: InputMaybe<Array<RelatedContractIndex_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RelatedContractIndex_Order_By>>;
  where?: InputMaybe<RelatedContractIndex_Bool_Exp>;
};


export type Query_RootRelatedContractIndex_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTokenContractIndexArgs = {
  distinct_on?: InputMaybe<Array<TokenContractIndex_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TokenContractIndex_Order_By>>;
  where?: InputMaybe<TokenContractIndex_Bool_Exp>;
};


export type Query_RootTokenContractIndex_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTrancheArgs = {
  distinct_on?: InputMaybe<Array<Tranche_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Tranche_Order_By>>;
  where?: InputMaybe<Tranche_Bool_Exp>;
};


export type Query_RootTranche_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryActionArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAction_Order_By>>;
  where?: InputMaybe<TreasuryAction_Bool_Exp>;
};


export type Query_RootTreasuryAction_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryAgentArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAgent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAgent_Order_By>>;
  where?: InputMaybe<TreasuryAgent_Bool_Exp>;
};


export type Query_RootTreasuryAgent_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryAllowanceArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAllowance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAllowance_Order_By>>;
  where?: InputMaybe<TreasuryAllowance_Bool_Exp>;
};


export type Query_RootTreasuryAllowance_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryDealArgs = {
  distinct_on?: InputMaybe<Array<TreasuryDeal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryDeal_Order_By>>;
  where?: InputMaybe<TreasuryDeal_Bool_Exp>;
};


export type Query_RootTreasuryDeal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryDelegationArgs = {
  distinct_on?: InputMaybe<Array<TreasuryDelegation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryDelegation_Order_By>>;
  where?: InputMaybe<TreasuryDelegation_Bool_Exp>;
};


export type Query_RootTreasuryDelegation_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryHoldingArgs = {
  distinct_on?: InputMaybe<Array<TreasuryHolding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryHolding_Order_By>>;
  where?: InputMaybe<TreasuryHolding_Bool_Exp>;
};


export type Query_RootTreasuryHolding_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryMovementArgs = {
  distinct_on?: InputMaybe<Array<TreasuryMovement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryMovement_Order_By>>;
  where?: InputMaybe<TreasuryMovement_Bool_Exp>;
};


export type Query_RootTreasuryMovement_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTreasuryReceiptArgs = {
  distinct_on?: InputMaybe<Array<TreasuryReceipt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryReceipt_Order_By>>;
  where?: InputMaybe<TreasuryReceipt_Bool_Exp>;
};


export type Query_RootTreasuryReceipt_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_Root_MetaArgs = {
  distinct_on?: InputMaybe<Array<_Meta_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Meta_Order_By>>;
  where?: InputMaybe<_Meta_Bool_Exp>;
};


export type Query_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Chain_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Chain_Metadata_Order_By>>;
  where?: InputMaybe<Chain_Metadata_Bool_Exp>;
};


export type Query_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};


export type Query_RootRaw_Events_By_PkArgs = {
  serial: Scalars['Int']['input'];
};

/** columns and relationships of "raw_events" */
export type Raw_Events = {
  __typename?: 'raw_events';
  block_fields: Scalars['jsonb']['output'];
  block_hash: Scalars['String']['output'];
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  contract_name: Scalars['String']['output'];
  event_id: Scalars['numeric']['output'];
  event_name: Scalars['String']['output'];
  log_index: Scalars['Int']['output'];
  params: Scalars['jsonb']['output'];
  serial: Scalars['Int']['output'];
  src_address: Scalars['String']['output'];
  transaction_fields: Scalars['jsonb']['output'];
};


/** columns and relationships of "raw_events" */
export type Raw_EventsBlock_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "raw_events" */
export type Raw_EventsParamsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "raw_events" */
export type Raw_EventsTransaction_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

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

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "Account" */
  Account: Array<Account>;
  /** fetch data from the table: "Account" using primary key columns */
  Account_by_pk?: Maybe<Account>;
  /** fetch data from the table in a streaming manner: "Account" */
  Account_stream: Array<Account>;
  /** fetch data from the table: "AgentAction" */
  AgentAction: Array<AgentAction>;
  /** fetch data from the table: "AgentAction" using primary key columns */
  AgentAction_by_pk?: Maybe<AgentAction>;
  /** fetch data from the table in a streaming manner: "AgentAction" */
  AgentAction_stream: Array<AgentAction>;
  /** fetch data from the table: "CapitalCall" */
  CapitalCall: Array<CapitalCall>;
  /** fetch data from the table: "CapitalCall" using primary key columns */
  CapitalCall_by_pk?: Maybe<CapitalCall>;
  /** fetch data from the table in a streaming manner: "CapitalCall" */
  CapitalCall_stream: Array<CapitalCall>;
  /** fetch data from the table: "ChildDacDeal" */
  ChildDacDeal: Array<ChildDacDeal>;
  /** fetch data from the table: "ChildDacDeal" using primary key columns */
  ChildDacDeal_by_pk?: Maybe<ChildDacDeal>;
  /** fetch data from the table in a streaming manner: "ChildDacDeal" */
  ChildDacDeal_stream: Array<ChildDacDeal>;
  /** fetch data from the table: "ChildVote" */
  ChildVote: Array<ChildVote>;
  /** fetch data from the table: "ChildVote" using primary key columns */
  ChildVote_by_pk?: Maybe<ChildVote>;
  /** fetch data from the table in a streaming manner: "ChildVote" */
  ChildVote_stream: Array<ChildVote>;
  /** fetch data from the table: "ControlledAddress" */
  ControlledAddress: Array<ControlledAddress>;
  /** fetch data from the table: "ControlledAddress" using primary key columns */
  ControlledAddress_by_pk?: Maybe<ControlledAddress>;
  /** fetch data from the table in a streaming manner: "ControlledAddress" */
  ControlledAddress_stream: Array<ControlledAddress>;
  /** fetch data from the table: "Dac" */
  Dac: Array<Dac>;
  /** fetch data from the table: "DacAgent" */
  DacAgent: Array<DacAgent>;
  /** fetch data from the table: "DacAgent" using primary key columns */
  DacAgent_by_pk?: Maybe<DacAgent>;
  /** fetch data from the table in a streaming manner: "DacAgent" */
  DacAgent_stream: Array<DacAgent>;
  /** fetch data from the table: "DacModule" */
  DacModule: Array<DacModule>;
  /** fetch data from the table: "DacModule" using primary key columns */
  DacModule_by_pk?: Maybe<DacModule>;
  /** fetch data from the table in a streaming manner: "DacModule" */
  DacModule_stream: Array<DacModule>;
  /** fetch data from the table: "Dac" using primary key columns */
  Dac_by_pk?: Maybe<Dac>;
  /** fetch data from the table in a streaming manner: "Dac" */
  Dac_stream: Array<Dac>;
  /** fetch data from the table: "Deal" */
  Deal: Array<Deal>;
  /** fetch data from the table: "DealAddressIndex" */
  DealAddressIndex: Array<DealAddressIndex>;
  /** fetch data from the table: "DealAddressIndex" using primary key columns */
  DealAddressIndex_by_pk?: Maybe<DealAddressIndex>;
  /** fetch data from the table in a streaming manner: "DealAddressIndex" */
  DealAddressIndex_stream: Array<DealAddressIndex>;
  /** fetch data from the table: "DealAgentPosition" */
  DealAgentPosition: Array<DealAgentPosition>;
  /** fetch data from the table: "DealAgentPosition" using primary key columns */
  DealAgentPosition_by_pk?: Maybe<DealAgentPosition>;
  /** fetch data from the table in a streaming manner: "DealAgentPosition" */
  DealAgentPosition_stream: Array<DealAgentPosition>;
  /** fetch data from the table: "DealCapitalMovement" */
  DealCapitalMovement: Array<DealCapitalMovement>;
  /** fetch data from the table: "DealCapitalMovement" using primary key columns */
  DealCapitalMovement_by_pk?: Maybe<DealCapitalMovement>;
  /** fetch data from the table in a streaming manner: "DealCapitalMovement" */
  DealCapitalMovement_stream: Array<DealCapitalMovement>;
  /** fetch data from the table: "DealFundingToken" */
  DealFundingToken: Array<DealFundingToken>;
  /** fetch data from the table: "DealFundingToken" using primary key columns */
  DealFundingToken_by_pk?: Maybe<DealFundingToken>;
  /** fetch data from the table in a streaming manner: "DealFundingToken" */
  DealFundingToken_stream: Array<DealFundingToken>;
  /** fetch data from the table: "DealLookup" */
  DealLookup: Array<DealLookup>;
  /** fetch data from the table: "DealLookup" using primary key columns */
  DealLookup_by_pk?: Maybe<DealLookup>;
  /** fetch data from the table in a streaming manner: "DealLookup" */
  DealLookup_stream: Array<DealLookup>;
  /** fetch data from the table: "DealRelatedContract" */
  DealRelatedContract: Array<DealRelatedContract>;
  /** fetch data from the table: "DealRelatedContract" using primary key columns */
  DealRelatedContract_by_pk?: Maybe<DealRelatedContract>;
  /** fetch data from the table in a streaming manner: "DealRelatedContract" */
  DealRelatedContract_stream: Array<DealRelatedContract>;
  /** fetch data from the table: "Deal" using primary key columns */
  Deal_by_pk?: Maybe<Deal>;
  /** fetch data from the table in a streaming manner: "Deal" */
  Deal_stream: Array<Deal>;
  /** fetch data from the table: "DividendPayout" */
  DividendPayout: Array<DividendPayout>;
  /** fetch data from the table: "DividendPayout" using primary key columns */
  DividendPayout_by_pk?: Maybe<DividendPayout>;
  /** fetch data from the table in a streaming manner: "DividendPayout" */
  DividendPayout_stream: Array<DividendPayout>;
  /** fetch data from the table: "Evaluation" */
  Evaluation: Array<Evaluation>;
  /** fetch data from the table: "Evaluation" using primary key columns */
  Evaluation_by_pk?: Maybe<Evaluation>;
  /** fetch data from the table in a streaming manner: "Evaluation" */
  Evaluation_stream: Array<Evaluation>;
  /** fetch data from the table: "Evaluator" */
  Evaluator: Array<Evaluator>;
  /** fetch data from the table: "Evaluator" using primary key columns */
  Evaluator_by_pk?: Maybe<Evaluator>;
  /** fetch data from the table in a streaming manner: "Evaluator" */
  Evaluator_stream: Array<Evaluator>;
  /** fetch data from the table: "MainTokenHolder" */
  MainTokenHolder: Array<MainTokenHolder>;
  /** fetch data from the table: "MainTokenHolder" using primary key columns */
  MainTokenHolder_by_pk?: Maybe<MainTokenHolder>;
  /** fetch data from the table in a streaming manner: "MainTokenHolder" */
  MainTokenHolder_stream: Array<MainTokenHolder>;
  /** fetch data from the table: "ModuleFactory" */
  ModuleFactory: Array<ModuleFactory>;
  /** fetch data from the table: "ModuleFactory" using primary key columns */
  ModuleFactory_by_pk?: Maybe<ModuleFactory>;
  /** fetch data from the table in a streaming manner: "ModuleFactory" */
  ModuleFactory_stream: Array<ModuleFactory>;
  /** fetch data from the table: "Proposal" */
  Proposal: Array<Proposal>;
  /** fetch data from the table: "ProposalLookup" */
  ProposalLookup: Array<ProposalLookup>;
  /** fetch data from the table: "ProposalLookup" using primary key columns */
  ProposalLookup_by_pk?: Maybe<ProposalLookup>;
  /** fetch data from the table in a streaming manner: "ProposalLookup" */
  ProposalLookup_stream: Array<ProposalLookup>;
  /** fetch data from the table: "ProposalVote" */
  ProposalVote: Array<ProposalVote>;
  /** fetch data from the table: "ProposalVote" using primary key columns */
  ProposalVote_by_pk?: Maybe<ProposalVote>;
  /** fetch data from the table in a streaming manner: "ProposalVote" */
  ProposalVote_stream: Array<ProposalVote>;
  /** fetch data from the table: "Proposal" using primary key columns */
  Proposal_by_pk?: Maybe<Proposal>;
  /** fetch data from the table in a streaming manner: "Proposal" */
  Proposal_stream: Array<Proposal>;
  /** fetch data from the table: "RelatedContractIndex" */
  RelatedContractIndex: Array<RelatedContractIndex>;
  /** fetch data from the table: "RelatedContractIndex" using primary key columns */
  RelatedContractIndex_by_pk?: Maybe<RelatedContractIndex>;
  /** fetch data from the table in a streaming manner: "RelatedContractIndex" */
  RelatedContractIndex_stream: Array<RelatedContractIndex>;
  /** fetch data from the table: "TokenContractIndex" */
  TokenContractIndex: Array<TokenContractIndex>;
  /** fetch data from the table: "TokenContractIndex" using primary key columns */
  TokenContractIndex_by_pk?: Maybe<TokenContractIndex>;
  /** fetch data from the table in a streaming manner: "TokenContractIndex" */
  TokenContractIndex_stream: Array<TokenContractIndex>;
  /** fetch data from the table: "Tranche" */
  Tranche: Array<Tranche>;
  /** fetch data from the table: "Tranche" using primary key columns */
  Tranche_by_pk?: Maybe<Tranche>;
  /** fetch data from the table in a streaming manner: "Tranche" */
  Tranche_stream: Array<Tranche>;
  /** fetch data from the table: "TreasuryAction" */
  TreasuryAction: Array<TreasuryAction>;
  /** fetch data from the table: "TreasuryAction" using primary key columns */
  TreasuryAction_by_pk?: Maybe<TreasuryAction>;
  /** fetch data from the table in a streaming manner: "TreasuryAction" */
  TreasuryAction_stream: Array<TreasuryAction>;
  /** fetch data from the table: "TreasuryAgent" */
  TreasuryAgent: Array<TreasuryAgent>;
  /** fetch data from the table: "TreasuryAgent" using primary key columns */
  TreasuryAgent_by_pk?: Maybe<TreasuryAgent>;
  /** fetch data from the table in a streaming manner: "TreasuryAgent" */
  TreasuryAgent_stream: Array<TreasuryAgent>;
  /** fetch data from the table: "TreasuryAllowance" */
  TreasuryAllowance: Array<TreasuryAllowance>;
  /** fetch data from the table: "TreasuryAllowance" using primary key columns */
  TreasuryAllowance_by_pk?: Maybe<TreasuryAllowance>;
  /** fetch data from the table in a streaming manner: "TreasuryAllowance" */
  TreasuryAllowance_stream: Array<TreasuryAllowance>;
  /** fetch data from the table: "TreasuryDeal" */
  TreasuryDeal: Array<TreasuryDeal>;
  /** fetch data from the table: "TreasuryDeal" using primary key columns */
  TreasuryDeal_by_pk?: Maybe<TreasuryDeal>;
  /** fetch data from the table in a streaming manner: "TreasuryDeal" */
  TreasuryDeal_stream: Array<TreasuryDeal>;
  /** fetch data from the table: "TreasuryDelegation" */
  TreasuryDelegation: Array<TreasuryDelegation>;
  /** fetch data from the table: "TreasuryDelegation" using primary key columns */
  TreasuryDelegation_by_pk?: Maybe<TreasuryDelegation>;
  /** fetch data from the table in a streaming manner: "TreasuryDelegation" */
  TreasuryDelegation_stream: Array<TreasuryDelegation>;
  /** fetch data from the table: "TreasuryHolding" */
  TreasuryHolding: Array<TreasuryHolding>;
  /** fetch data from the table: "TreasuryHolding" using primary key columns */
  TreasuryHolding_by_pk?: Maybe<TreasuryHolding>;
  /** fetch data from the table in a streaming manner: "TreasuryHolding" */
  TreasuryHolding_stream: Array<TreasuryHolding>;
  /** fetch data from the table: "TreasuryMovement" */
  TreasuryMovement: Array<TreasuryMovement>;
  /** fetch data from the table: "TreasuryMovement" using primary key columns */
  TreasuryMovement_by_pk?: Maybe<TreasuryMovement>;
  /** fetch data from the table in a streaming manner: "TreasuryMovement" */
  TreasuryMovement_stream: Array<TreasuryMovement>;
  /** fetch data from the table: "TreasuryReceipt" */
  TreasuryReceipt: Array<TreasuryReceipt>;
  /** fetch data from the table: "TreasuryReceipt" using primary key columns */
  TreasuryReceipt_by_pk?: Maybe<TreasuryReceipt>;
  /** fetch data from the table in a streaming manner: "TreasuryReceipt" */
  TreasuryReceipt_stream: Array<TreasuryReceipt>;
  /** fetch data from the table: "_meta" */
  _meta: Array<_Meta>;
  /** fetch data from the table in a streaming manner: "_meta" */
  _meta_stream: Array<_Meta>;
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<Chain_Metadata>;
  /** fetch data from the table in a streaming manner: "chain_metadata" */
  chain_metadata_stream: Array<Chain_Metadata>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>;
  /** fetch data from the table in a streaming manner: "raw_events" */
  raw_events_stream: Array<Raw_Events>;
};


export type Subscription_RootAccountArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootAccount_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootAccount_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Account_Stream_Cursor_Input>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootAgentActionArgs = {
  distinct_on?: InputMaybe<Array<AgentAction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AgentAction_Order_By>>;
  where?: InputMaybe<AgentAction_Bool_Exp>;
};


export type Subscription_RootAgentAction_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootAgentAction_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AgentAction_Stream_Cursor_Input>>;
  where?: InputMaybe<AgentAction_Bool_Exp>;
};


export type Subscription_RootCapitalCallArgs = {
  distinct_on?: InputMaybe<Array<CapitalCall_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CapitalCall_Order_By>>;
  where?: InputMaybe<CapitalCall_Bool_Exp>;
};


export type Subscription_RootCapitalCall_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootCapitalCall_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<CapitalCall_Stream_Cursor_Input>>;
  where?: InputMaybe<CapitalCall_Bool_Exp>;
};


export type Subscription_RootChildDacDealArgs = {
  distinct_on?: InputMaybe<Array<ChildDacDeal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ChildDacDeal_Order_By>>;
  where?: InputMaybe<ChildDacDeal_Bool_Exp>;
};


export type Subscription_RootChildDacDeal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootChildDacDeal_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ChildDacDeal_Stream_Cursor_Input>>;
  where?: InputMaybe<ChildDacDeal_Bool_Exp>;
};


export type Subscription_RootChildVoteArgs = {
  distinct_on?: InputMaybe<Array<ChildVote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ChildVote_Order_By>>;
  where?: InputMaybe<ChildVote_Bool_Exp>;
};


export type Subscription_RootChildVote_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootChildVote_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ChildVote_Stream_Cursor_Input>>;
  where?: InputMaybe<ChildVote_Bool_Exp>;
};


export type Subscription_RootControlledAddressArgs = {
  distinct_on?: InputMaybe<Array<ControlledAddress_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ControlledAddress_Order_By>>;
  where?: InputMaybe<ControlledAddress_Bool_Exp>;
};


export type Subscription_RootControlledAddress_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootControlledAddress_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ControlledAddress_Stream_Cursor_Input>>;
  where?: InputMaybe<ControlledAddress_Bool_Exp>;
};


export type Subscription_RootDacArgs = {
  distinct_on?: InputMaybe<Array<Dac_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dac_Order_By>>;
  where?: InputMaybe<Dac_Bool_Exp>;
};


export type Subscription_RootDacAgentArgs = {
  distinct_on?: InputMaybe<Array<DacAgent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DacAgent_Order_By>>;
  where?: InputMaybe<DacAgent_Bool_Exp>;
};


export type Subscription_RootDacAgent_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDacAgent_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DacAgent_Stream_Cursor_Input>>;
  where?: InputMaybe<DacAgent_Bool_Exp>;
};


export type Subscription_RootDacModuleArgs = {
  distinct_on?: InputMaybe<Array<DacModule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DacModule_Order_By>>;
  where?: InputMaybe<DacModule_Bool_Exp>;
};


export type Subscription_RootDacModule_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDacModule_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DacModule_Stream_Cursor_Input>>;
  where?: InputMaybe<DacModule_Bool_Exp>;
};


export type Subscription_RootDac_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDac_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dac_Stream_Cursor_Input>>;
  where?: InputMaybe<Dac_Bool_Exp>;
};


export type Subscription_RootDealArgs = {
  distinct_on?: InputMaybe<Array<Deal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Deal_Order_By>>;
  where?: InputMaybe<Deal_Bool_Exp>;
};


export type Subscription_RootDealAddressIndexArgs = {
  distinct_on?: InputMaybe<Array<DealAddressIndex_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealAddressIndex_Order_By>>;
  where?: InputMaybe<DealAddressIndex_Bool_Exp>;
};


export type Subscription_RootDealAddressIndex_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDealAddressIndex_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DealAddressIndex_Stream_Cursor_Input>>;
  where?: InputMaybe<DealAddressIndex_Bool_Exp>;
};


export type Subscription_RootDealAgentPositionArgs = {
  distinct_on?: InputMaybe<Array<DealAgentPosition_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealAgentPosition_Order_By>>;
  where?: InputMaybe<DealAgentPosition_Bool_Exp>;
};


export type Subscription_RootDealAgentPosition_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDealAgentPosition_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DealAgentPosition_Stream_Cursor_Input>>;
  where?: InputMaybe<DealAgentPosition_Bool_Exp>;
};


export type Subscription_RootDealCapitalMovementArgs = {
  distinct_on?: InputMaybe<Array<DealCapitalMovement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealCapitalMovement_Order_By>>;
  where?: InputMaybe<DealCapitalMovement_Bool_Exp>;
};


export type Subscription_RootDealCapitalMovement_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDealCapitalMovement_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DealCapitalMovement_Stream_Cursor_Input>>;
  where?: InputMaybe<DealCapitalMovement_Bool_Exp>;
};


export type Subscription_RootDealFundingTokenArgs = {
  distinct_on?: InputMaybe<Array<DealFundingToken_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealFundingToken_Order_By>>;
  where?: InputMaybe<DealFundingToken_Bool_Exp>;
};


export type Subscription_RootDealFundingToken_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDealFundingToken_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DealFundingToken_Stream_Cursor_Input>>;
  where?: InputMaybe<DealFundingToken_Bool_Exp>;
};


export type Subscription_RootDealLookupArgs = {
  distinct_on?: InputMaybe<Array<DealLookup_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealLookup_Order_By>>;
  where?: InputMaybe<DealLookup_Bool_Exp>;
};


export type Subscription_RootDealLookup_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDealLookup_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DealLookup_Stream_Cursor_Input>>;
  where?: InputMaybe<DealLookup_Bool_Exp>;
};


export type Subscription_RootDealRelatedContractArgs = {
  distinct_on?: InputMaybe<Array<DealRelatedContract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DealRelatedContract_Order_By>>;
  where?: InputMaybe<DealRelatedContract_Bool_Exp>;
};


export type Subscription_RootDealRelatedContract_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDealRelatedContract_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DealRelatedContract_Stream_Cursor_Input>>;
  where?: InputMaybe<DealRelatedContract_Bool_Exp>;
};


export type Subscription_RootDeal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDeal_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Deal_Stream_Cursor_Input>>;
  where?: InputMaybe<Deal_Bool_Exp>;
};


export type Subscription_RootDividendPayoutArgs = {
  distinct_on?: InputMaybe<Array<DividendPayout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DividendPayout_Order_By>>;
  where?: InputMaybe<DividendPayout_Bool_Exp>;
};


export type Subscription_RootDividendPayout_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDividendPayout_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DividendPayout_Stream_Cursor_Input>>;
  where?: InputMaybe<DividendPayout_Bool_Exp>;
};


export type Subscription_RootEvaluationArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Order_By>>;
  where?: InputMaybe<Evaluation_Bool_Exp>;
};


export type Subscription_RootEvaluation_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootEvaluation_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Evaluation_Stream_Cursor_Input>>;
  where?: InputMaybe<Evaluation_Bool_Exp>;
};


export type Subscription_RootEvaluatorArgs = {
  distinct_on?: InputMaybe<Array<Evaluator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluator_Order_By>>;
  where?: InputMaybe<Evaluator_Bool_Exp>;
};


export type Subscription_RootEvaluator_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootEvaluator_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Evaluator_Stream_Cursor_Input>>;
  where?: InputMaybe<Evaluator_Bool_Exp>;
};


export type Subscription_RootMainTokenHolderArgs = {
  distinct_on?: InputMaybe<Array<MainTokenHolder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MainTokenHolder_Order_By>>;
  where?: InputMaybe<MainTokenHolder_Bool_Exp>;
};


export type Subscription_RootMainTokenHolder_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootMainTokenHolder_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<MainTokenHolder_Stream_Cursor_Input>>;
  where?: InputMaybe<MainTokenHolder_Bool_Exp>;
};


export type Subscription_RootModuleFactoryArgs = {
  distinct_on?: InputMaybe<Array<ModuleFactory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ModuleFactory_Order_By>>;
  where?: InputMaybe<ModuleFactory_Bool_Exp>;
};


export type Subscription_RootModuleFactory_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootModuleFactory_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ModuleFactory_Stream_Cursor_Input>>;
  where?: InputMaybe<ModuleFactory_Bool_Exp>;
};


export type Subscription_RootProposalArgs = {
  distinct_on?: InputMaybe<Array<Proposal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Proposal_Order_By>>;
  where?: InputMaybe<Proposal_Bool_Exp>;
};


export type Subscription_RootProposalLookupArgs = {
  distinct_on?: InputMaybe<Array<ProposalLookup_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ProposalLookup_Order_By>>;
  where?: InputMaybe<ProposalLookup_Bool_Exp>;
};


export type Subscription_RootProposalLookup_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootProposalLookup_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ProposalLookup_Stream_Cursor_Input>>;
  where?: InputMaybe<ProposalLookup_Bool_Exp>;
};


export type Subscription_RootProposalVoteArgs = {
  distinct_on?: InputMaybe<Array<ProposalVote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ProposalVote_Order_By>>;
  where?: InputMaybe<ProposalVote_Bool_Exp>;
};


export type Subscription_RootProposalVote_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootProposalVote_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ProposalVote_Stream_Cursor_Input>>;
  where?: InputMaybe<ProposalVote_Bool_Exp>;
};


export type Subscription_RootProposal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootProposal_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Proposal_Stream_Cursor_Input>>;
  where?: InputMaybe<Proposal_Bool_Exp>;
};


export type Subscription_RootRelatedContractIndexArgs = {
  distinct_on?: InputMaybe<Array<RelatedContractIndex_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RelatedContractIndex_Order_By>>;
  where?: InputMaybe<RelatedContractIndex_Bool_Exp>;
};


export type Subscription_RootRelatedContractIndex_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRelatedContractIndex_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RelatedContractIndex_Stream_Cursor_Input>>;
  where?: InputMaybe<RelatedContractIndex_Bool_Exp>;
};


export type Subscription_RootTokenContractIndexArgs = {
  distinct_on?: InputMaybe<Array<TokenContractIndex_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TokenContractIndex_Order_By>>;
  where?: InputMaybe<TokenContractIndex_Bool_Exp>;
};


export type Subscription_RootTokenContractIndex_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTokenContractIndex_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TokenContractIndex_Stream_Cursor_Input>>;
  where?: InputMaybe<TokenContractIndex_Bool_Exp>;
};


export type Subscription_RootTrancheArgs = {
  distinct_on?: InputMaybe<Array<Tranche_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Tranche_Order_By>>;
  where?: InputMaybe<Tranche_Bool_Exp>;
};


export type Subscription_RootTranche_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTranche_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Tranche_Stream_Cursor_Input>>;
  where?: InputMaybe<Tranche_Bool_Exp>;
};


export type Subscription_RootTreasuryActionArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAction_Order_By>>;
  where?: InputMaybe<TreasuryAction_Bool_Exp>;
};


export type Subscription_RootTreasuryAction_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryAction_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryAction_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryAction_Bool_Exp>;
};


export type Subscription_RootTreasuryAgentArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAgent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAgent_Order_By>>;
  where?: InputMaybe<TreasuryAgent_Bool_Exp>;
};


export type Subscription_RootTreasuryAgent_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryAgent_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryAgent_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryAgent_Bool_Exp>;
};


export type Subscription_RootTreasuryAllowanceArgs = {
  distinct_on?: InputMaybe<Array<TreasuryAllowance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryAllowance_Order_By>>;
  where?: InputMaybe<TreasuryAllowance_Bool_Exp>;
};


export type Subscription_RootTreasuryAllowance_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryAllowance_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryAllowance_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryAllowance_Bool_Exp>;
};


export type Subscription_RootTreasuryDealArgs = {
  distinct_on?: InputMaybe<Array<TreasuryDeal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryDeal_Order_By>>;
  where?: InputMaybe<TreasuryDeal_Bool_Exp>;
};


export type Subscription_RootTreasuryDeal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryDeal_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryDeal_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryDeal_Bool_Exp>;
};


export type Subscription_RootTreasuryDelegationArgs = {
  distinct_on?: InputMaybe<Array<TreasuryDelegation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryDelegation_Order_By>>;
  where?: InputMaybe<TreasuryDelegation_Bool_Exp>;
};


export type Subscription_RootTreasuryDelegation_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryDelegation_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryDelegation_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryDelegation_Bool_Exp>;
};


export type Subscription_RootTreasuryHoldingArgs = {
  distinct_on?: InputMaybe<Array<TreasuryHolding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryHolding_Order_By>>;
  where?: InputMaybe<TreasuryHolding_Bool_Exp>;
};


export type Subscription_RootTreasuryHolding_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryHolding_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryHolding_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryHolding_Bool_Exp>;
};


export type Subscription_RootTreasuryMovementArgs = {
  distinct_on?: InputMaybe<Array<TreasuryMovement_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryMovement_Order_By>>;
  where?: InputMaybe<TreasuryMovement_Bool_Exp>;
};


export type Subscription_RootTreasuryMovement_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryMovement_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryMovement_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryMovement_Bool_Exp>;
};


export type Subscription_RootTreasuryReceiptArgs = {
  distinct_on?: InputMaybe<Array<TreasuryReceipt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TreasuryReceipt_Order_By>>;
  where?: InputMaybe<TreasuryReceipt_Bool_Exp>;
};


export type Subscription_RootTreasuryReceipt_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootTreasuryReceipt_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TreasuryReceipt_Stream_Cursor_Input>>;
  where?: InputMaybe<TreasuryReceipt_Bool_Exp>;
};


export type Subscription_Root_MetaArgs = {
  distinct_on?: InputMaybe<Array<_Meta_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Meta_Order_By>>;
  where?: InputMaybe<_Meta_Bool_Exp>;
};


export type Subscription_Root_Meta_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<_Meta_Stream_Cursor_Input>>;
  where?: InputMaybe<_Meta_Bool_Exp>;
};


export type Subscription_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Chain_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Chain_Metadata_Order_By>>;
  where?: InputMaybe<Chain_Metadata_Bool_Exp>;
};


export type Subscription_RootChain_Metadata_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Chain_Metadata_Stream_Cursor_Input>>;
  where?: InputMaybe<Chain_Metadata_Bool_Exp>;
};


export type Subscription_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};


export type Subscription_RootRaw_Events_By_PkArgs = {
  serial: Scalars['Int']['input'];
};


export type Subscription_RootRaw_Events_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Raw_Events_Stream_Cursor_Input>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
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

export type DacViewFieldsFragment = { __typename?: 'Dac', id: string, chainId: number, address: string, name?: string | null, description?: string | null, mainTokenAddress?: string | null, agentTokenAddress?: string | null, dealManagerAddress?: string | null, started: boolean, dividendsEnabled: boolean, proposalCount: string, executedProposalCount: string, dealCount: string, activeDealCount: string, capitalCallCount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, updatedBlockNumber: string };

export type GetDacByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetDacByIdQuery = { __typename?: 'query_root', Dac: Array<{ __typename?: 'Dac', id: string, chainId: number, address: string, name?: string | null, description?: string | null, mainTokenAddress?: string | null, agentTokenAddress?: string | null, dealManagerAddress?: string | null, started: boolean, dividendsEnabled: boolean, proposalCount: string, executedProposalCount: string, dealCount: string, activeDealCount: string, capitalCallCount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, updatedBlockNumber: string }> };

export type GetDacByAddressQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetDacByAddressQuery = { __typename?: 'query_root', Dac: Array<{ __typename?: 'Dac', id: string, chainId: number, address: string, name?: string | null, description?: string | null, mainTokenAddress?: string | null, agentTokenAddress?: string | null, dealManagerAddress?: string | null, started: boolean, dividendsEnabled: boolean, proposalCount: string, executedProposalCount: string, dealCount: string, activeDealCount: string, capitalCallCount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, updatedBlockNumber: string }> };

export type ListDacsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDacsQuery = { __typename?: 'query_root', Dac: Array<{ __typename?: 'Dac', id: string, chainId: number, address: string, name?: string | null, description?: string | null, mainTokenAddress?: string | null, agentTokenAddress?: string | null, dealManagerAddress?: string | null, started: boolean, dividendsEnabled: boolean, proposalCount: string, executedProposalCount: string, dealCount: string, activeDealCount: string, capitalCallCount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, updatedBlockNumber: string }> };

export type DealViewFieldsFragment = { __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, trancheCount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, rewardsLimit: string, rewardsAllocated: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, updatedBlockNumber: string };

export type GetDealByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetDealByIdQuery = { __typename?: 'query_root', Deal: Array<{ __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, trancheCount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, rewardsLimit: string, rewardsAllocated: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, updatedBlockNumber: string }> };

export type GetDealByAddressQueryVariables = Exact<{
  dealAddress: Scalars['String']['input'];
  cellAddress: Scalars['String']['input'];
}>;


export type GetDealByAddressQuery = { __typename?: 'query_root', byDealAddress: Array<{ __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, trancheCount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, rewardsLimit: string, rewardsAllocated: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, updatedBlockNumber: string }>, byCellAddress: Array<{ __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, trancheCount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, rewardsLimit: string, rewardsAllocated: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, updatedBlockNumber: string }> };

export type ListDealsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListDealsByDacQuery = { __typename?: 'query_root', Deal: Array<{ __typename?: 'Deal', id: string, chainId: number, dacId: string, dealNumericId: string, proposalNumericId?: string | null, creator?: string | null, kindSelector?: string | null, cellAddress: string, dealAddress?: string | null, stakeTokenAddress?: string | null, managedTreasuryAddress?: string | null, childDacAddress?: string | null, active: boolean, closed: boolean, recovered: boolean, proposalCount: string, executedProposalCount: string, trancheCount: string, approveDeadline?: string | null, evaluationDeadline?: string | null, dealDeadline?: string | null, rewardsLimit: string, rewardsAllocated: string, totalRewardAllocatedAmount: string, totalRewardClaimedAmount: string, createdBlockNumber: string, createdBlockTimestamp?: string | null, updatedBlockNumber: string }> };

export type ProposalViewFieldsFragment = { __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, targetAddress?: string | null, tokenAddress?: string | null, voteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, createdBlockNumber: string, createdBlockTimestamp?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null };

export type CapitalCallViewFieldsFragment = { __typename?: 'CapitalCall', id: string, chainId: number, dacId: string, dacAddress: string, proposalNumericId: string, callHash: string, recipient: string, treasuryTokenAddress: string, tokenAmount: string, cashAmount: string, nonce: string, fulfillmentCount: string, totalFulfilledTokenAmount: string, totalFulfilledCashAmount: string, lastPayer?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, fulfilledBlockNumber?: string | null, updatedBlockNumber: string };

export type TreasuryActionViewFieldsFragment = { __typename?: 'TreasuryAction', id: string, chainId: number, dealId: string, treasuryDealId: string, treasuryAddress?: string | null, actionType: string, tokenAddress?: string | null, agent?: string | null, counterpartyAddress?: string | null, sourceAddress?: string | null, destinationAddress?: string | null, amount?: string | null, dealSize?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null };

export type GetProposalByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProposalByIdQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, targetAddress?: string | null, tokenAddress?: string | null, voteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, createdBlockNumber: string, createdBlockTimestamp?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type GetProposalByAddressQueryVariables = Exact<{
  proposalAddress: Scalars['String']['input'];
}>;


export type GetProposalByAddressQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, targetAddress?: string | null, tokenAddress?: string | null, voteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, createdBlockNumber: string, createdBlockTimestamp?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type ListProposalsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListProposalsByDacQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, targetAddress?: string | null, tokenAddress?: string | null, voteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, createdBlockNumber: string, createdBlockTimestamp?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type ListProposalsByDealQueryVariables = Exact<{
  dealId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListProposalsByDealQuery = { __typename?: 'query_root', Proposal: Array<{ __typename?: 'Proposal', id: string, chainId: number, proposalAddress: string, scope?: string | null, dacId?: string | null, dealId?: string | null, proposalNumericId?: string | null, kindSelector?: string | null, targetAddress?: string | null, tokenAddress?: string | null, voteCount: string, yesVotes: string, noVotes: string, resolved: boolean, passed?: boolean | null, executed: boolean, createdBlockNumber: string, createdBlockTimestamp?: string | null, resolvedBlockNumber?: string | null, executedBlockNumber?: string | null }> };

export type ListCapitalCallsByDacQueryVariables = Exact<{
  dacId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListCapitalCallsByDacQuery = { __typename?: 'query_root', CapitalCall: Array<{ __typename?: 'CapitalCall', id: string, chainId: number, dacId: string, dacAddress: string, proposalNumericId: string, callHash: string, recipient: string, treasuryTokenAddress: string, tokenAmount: string, cashAmount: string, nonce: string, fulfillmentCount: string, totalFulfilledTokenAmount: string, totalFulfilledCashAmount: string, lastPayer?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, fulfilledBlockNumber?: string | null, updatedBlockNumber: string }> };

export type ListTreasuryActionsByDealQueryVariables = Exact<{
  dealId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ListTreasuryActionsByDealQuery = { __typename?: 'query_root', TreasuryAction: Array<{ __typename?: 'TreasuryAction', id: string, chainId: number, dealId: string, treasuryDealId: string, treasuryAddress?: string | null, actionType: string, tokenAddress?: string | null, agent?: string | null, counterpartyAddress?: string | null, sourceAddress?: string | null, destinationAddress?: string | null, amount?: string | null, dealSize?: string | null, createdBlockNumber: string, createdBlockTimestamp?: string | null, createdTransactionHash?: string | null }> };

export const DacViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dac"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealManagerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"dividendsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"dealCount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"capitalCallCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<DacViewFieldsFragment, unknown>;
export const DealViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"cellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"stakeTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"managedTreasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"recovered"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"trancheCount"}},{"kind":"Field","name":{"kind":"Name","value":"approveDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"evaluationDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"dealDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<DealViewFieldsFragment, unknown>;
export const ProposalViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<ProposalViewFieldsFragment, unknown>;
export const CapitalCallViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CapitalCallViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CapitalCall"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"callHash"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"cashAmount"}},{"kind":"Field","name":{"kind":"Name","value":"nonce"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalFulfilledTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalFulfilledCashAmount"}},{"kind":"Field","name":{"kind":"Name","value":"lastPayer"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fulfilledBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<CapitalCallViewFieldsFragment, unknown>;
export const TreasuryActionViewFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreasuryActionViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreasuryAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryDealId"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"actionType"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agent"}},{"kind":"Field","name":{"kind":"Name","value":"counterpartyAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sourceAddress"}},{"kind":"Field","name":{"kind":"Name","value":"destinationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"dealSize"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<TreasuryActionViewFieldsFragment, unknown>;
export const GetDacByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDacById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Dac"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dac"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealManagerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"dividendsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"dealCount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"capitalCallCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<GetDacByIdQuery, GetDacByIdQueryVariables>;
export const GetDacByAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDacByAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Dac"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"address"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dac"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealManagerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"dividendsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"dealCount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"capitalCallCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<GetDacByAddressQuery, GetDacByAddressQueryVariables>;
export const ListDacsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDacs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Dac"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DacViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DacViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dac"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"mainTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agentTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealManagerAddress"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"dividendsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"dealCount"}},{"kind":"Field","name":{"kind":"Name","value":"activeDealCount"}},{"kind":"Field","name":{"kind":"Name","value":"capitalCallCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<ListDacsQuery, ListDacsQueryVariables>;
export const GetDealByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDealById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Deal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"cellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"stakeTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"managedTreasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"recovered"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"trancheCount"}},{"kind":"Field","name":{"kind":"Name","value":"approveDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"evaluationDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"dealDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<GetDealByIdQuery, GetDealByIdQueryVariables>;
export const GetDealByAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDealByAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cellAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"byDealAddress"},"name":{"kind":"Name","value":"Deal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealAddress"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealAddress"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealViewFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"byCellAddress"},"name":{"kind":"Name","value":"Deal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"cellAddress"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cellAddress"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"cellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"stakeTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"managedTreasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"recovered"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"trancheCount"}},{"kind":"Field","name":{"kind":"Name","value":"approveDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"evaluationDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"dealDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<GetDealByAddressQuery, GetDealByAddressQueryVariables>;
export const ListDealsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDealsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Deal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealNumericId"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DealViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DealViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"cellAddress"}},{"kind":"Field","name":{"kind":"Name","value":"dealAddress"}},{"kind":"Field","name":{"kind":"Name","value":"stakeTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"managedTreasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"childDacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"recovered"}},{"kind":"Field","name":{"kind":"Name","value":"proposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"executedProposalCount"}},{"kind":"Field","name":{"kind":"Name","value":"trancheCount"}},{"kind":"Field","name":{"kind":"Name","value":"approveDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"evaluationDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"dealDeadline"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardAllocatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewardClaimedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<ListDealsByDacQuery, ListDealsByDacQueryVariables>;
export const GetProposalByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProposalById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<GetProposalByIdQuery, GetProposalByIdQueryVariables>;
export const GetProposalByAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProposalByAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposalAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalAddress"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposalAddress"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<GetProposalByAddressQuery, GetProposalByAddressQueryVariables>;
export const ListProposalsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListProposalsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalNumericId"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<ListProposalsByDacQuery, ListProposalsByDacQueryVariables>;
export const ListProposalsByDealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListProposalsByDeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalNumericId"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"kindSelector"}},{"kind":"Field","name":{"kind":"Name","value":"targetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"yesVotes"}},{"kind":"Field","name":{"kind":"Name","value":"noVotes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}},{"kind":"Field","name":{"kind":"Name","value":"executed"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"executedBlockNumber"}}]}}]} as unknown as DocumentNode<ListProposalsByDealQuery, ListProposalsByDealQueryVariables>;
export const ListCapitalCallsByDacDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListCapitalCallsByDac"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CapitalCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dacId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dacId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"proposalNumericId"},"value":{"kind":"EnumValue","value":"desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CapitalCallViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CapitalCallViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CapitalCall"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dacId"}},{"kind":"Field","name":{"kind":"Name","value":"dacAddress"}},{"kind":"Field","name":{"kind":"Name","value":"proposalNumericId"}},{"kind":"Field","name":{"kind":"Name","value":"callHash"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"cashAmount"}},{"kind":"Field","name":{"kind":"Name","value":"nonce"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalFulfilledTokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalFulfilledCashAmount"}},{"kind":"Field","name":{"kind":"Name","value":"lastPayer"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fulfilledBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBlockNumber"}}]}}]} as unknown as DocumentNode<ListCapitalCallsByDacQuery, ListCapitalCallsByDacQueryVariables>;
export const ListTreasuryActionsByDealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListTreasuryActionsByDeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TreasuryAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dealId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dealId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdBlockNumber"},"value":{"kind":"EnumValue","value":"desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TreasuryActionViewFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreasuryActionViewFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreasuryAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"dealId"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryDealId"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"actionType"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"agent"}},{"kind":"Field","name":{"kind":"Name","value":"counterpartyAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sourceAddress"}},{"kind":"Field","name":{"kind":"Name","value":"destinationAddress"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"dealSize"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}}]}}]} as unknown as DocumentNode<ListTreasuryActionsByDealQuery, ListTreasuryActionsByDealQueryVariables>;