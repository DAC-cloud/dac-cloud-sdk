import {decodeAbiParameters, encodeAbiParameters, type Hex} from "viem";
import type {DealParams, ExistingTokenDacConfig} from "./types";

export function encodeExistingTokenConfig(config: ExistingTokenDacConfig): Hex {
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
        {name: "governanceOracle", type: "address"},
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
            {name: "fallbackWarmupBlocks", type: "uint256"},
            {name: "fallbackDuration", type: "uint256"},
            {name: "blockingOnAllProposals", type: "bool"},
            {name: "blockingOnHighQuorum", type: "bool"},
            {name: "oraclePrimaryEnabled", type: "bool"},
          ],
        },
      ],
    }],
    [config],
  );
}

export const DEAL_PARAMS_ABI_COMPONENTS = [
  {name: "dealKind", type: "bytes4"},
  {name: "name", type: "string"},
  {name: "description", type: "string"},
  {name: "linkHash", type: "string"},
  {name: "moduleFactory", type: "address"},
  {name: "governanceFactory", type: "address"},
  {name: "dealTarget", type: "address"},
  {name: "proposer", type: "address"},
  {name: "vetoEnabled", type: "bool"},
  {name: "fundingToken", type: "address"},
  {name: "fundingAmount", type: "uint256"},
  {name: "rewardsLimit", type: "uint256"},
  {name: "dealRewardPoolPercent", type: "uint256"},
  {name: "approveDeadline", type: "uint256"},
  {name: "evaluationDeadline", type: "uint256"},
  {name: "dealDeadline", type: "uint256"},
  {name: "dealConfig", type: "bytes"},
  {name: "evaluatorSelector", type: "bytes4"},
  {name: "evaluatorConfig", type: "bytes"},
  {name: "evaluatorModuleFactory", type: "address"},
  {name: "agentsLimit", type: "uint256"},
  {name: "minimalStake", type: "uint256"},
] as const;

const DEAL_PARAMS_ABI = [{name: "params", type: "tuple", components: DEAL_PARAMS_ABI_COMPONENTS}] as const;

export function encodeDealParams(params: DealParams): Hex {
  return encodeAbiParameters(DEAL_PARAMS_ABI, [params]);
}

// Decodes `abi.encode(DealParams)` as stored in `DealManager.state(dealCell).initParams`
// (and emitted by `DealInitialized`). Use it to show voters the full deal terms behind an
// APPROVE_DEAL proposal, which itself only binds (dealId, trancheId, rewardsLimit).
export function decodeDealParams(data: Hex): DealParams {
  const [params] = decodeAbiParameters(DEAL_PARAMS_ABI, data);
  return {...params};
}
