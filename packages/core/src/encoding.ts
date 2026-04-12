import {encodeAbiParameters, type Hex} from "viem";
import type {ExistingTokenDacConfig} from "./types";

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
            {name: "fallbackWarmupDuration", type: "uint256"},
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
