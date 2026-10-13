import {concatHex, encodeAbiParameters, encodeFunctionData, getContractAddress, keccak256, type Address, type Hex} from "viem";
import {erc6551AccountAbi} from "./abi";

/** Canonical ERC-6551 registry, identical on every EVM chain (Base included). */
export const ERC6551_REGISTRY_ADDRESS: Address = "0x000000006551c19487814612e58FE06813775758";

/** Reference account implementation (erc6551/reference v0.3.1), deployed on most chains. */
export const ERC6551_REFERENCE_IMPLEMENTATION: Address = "0x41C8f39463A868d3A88af00cd0fe7102F30E44eC";

export const ERC6551_ZERO_SALT: Hex = "0x0000000000000000000000000000000000000000000000000000000000000000";

/** bytes4(keccak256("isValidSigner(address,bytes)")) */
export const ERC6551_VALID_SIGNER_MAGIC = "0x523e3260";

/** IERC6551Executable operation: plain CALL. The backend refuses anything else. */
export const ERC6551_OPERATION_CALL = 0;

/**
 * Transaction executor: how a write reaches the chain. `eoa` signs and sends
 * directly; `erc6551` wraps every call in `account.execute(to, value, data, 0)`
 * so the token-bound account is `msg.sender` for the protocol while the NFT
 * owner signs.
 */
export type TxExecutor =
  | {kind: "eoa"}
  | {kind: "erc6551"; account: Address};

export interface Erc6551Call {
  to: Address;
  data: Hex;
  value?: bigint;
}

/** Calldata for `IERC6551Executable.execute(to, value, data, CALL)`. */
export function encodeErc6551Execute(call: Erc6551Call): Hex {
  return encodeFunctionData({
    abi: erc6551AccountAbi,
    functionName: "execute",
    args: [call.to, call.value ?? 0n, call.data, ERC6551_OPERATION_CALL],
  });
}

/** Route a prepared call through the executor; identity for plain EOAs. */
export function wrapCallForExecutor(executor: TxExecutor | undefined, call: Erc6551Call): Erc6551Call {
  if (!executor || executor.kind === "eoa") {
    return call;
  }
  return {to: executor.account, data: encodeErc6551Execute(call), value: 0n};
}

export interface Erc6551TokenRef {
  chainId: bigint;
  tokenContract: Address;
  tokenId: bigint;
}

export interface Erc6551AccountInfo {
  account: Address;
  deployed: boolean;
  token?: Erc6551TokenRef;
  owner?: Address;
  state?: bigint;
}

export interface Erc6551AccountParams {
  implementation: Address;
  salt?: Hex;
  chainId: bigint | number;
  tokenContract: Address;
  tokenId: bigint;
  registry?: Address;
}

/**
 * ERC-6551 account address, computed off-chain exactly as the registry does:
 * CREATE2 from the registry with the ERC-1167-style proxy creation code,
 * `implementation` spliced in and `(salt, chainId, tokenContract, tokenId)`
 * appended as the proxy footer; the CREATE2 salt is the `salt` argument.
 */
export function computeErc6551AccountAddress(params: Erc6551AccountParams): Address {
  const salt = params.salt ?? ERC6551_ZERO_SALT;
  const bytecode = concatHex([
    "0x3d60ad80600a3d3981f3363d3d373d3d3d363d73",
    params.implementation,
    "0x5af43d82803e903d91602b57fd5bf3",
    encodeAbiParameters(
      [{type: "bytes32"}, {type: "uint256"}, {type: "address"}, {type: "uint256"}],
      [salt, BigInt(params.chainId), params.tokenContract, params.tokenId],
    ),
  ]);
  return getContractAddress({
    opcode: "CREATE2",
    from: params.registry ?? ERC6551_REGISTRY_ADDRESS,
    salt,
    bytecodeHash: keccak256(bytecode),
  });
}
