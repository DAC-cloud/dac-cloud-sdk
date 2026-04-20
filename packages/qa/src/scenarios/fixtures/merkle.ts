import {encodePacked, keccak256, type Address, type Hex} from "viem";

export interface DividendLeafInput {
  receiver: Address;
  amount: bigint;
}

export interface VotingPowerLeafInput {
  voter: Address;
  amount: bigint;
}

export interface MerkleResult {
  root: Hex;
  leaves: Hex[];   // leaves[i] = leafHash(i, input[i].address, input[i].amount)
  proofs: Hex[][]; // proofs[i] is the proof for leaves[i]
}

/** @deprecated Use MerkleResult instead */
export type DividendMerkleResult = MerkleResult;

/**
 * Leaf format matches contract: keccak256(abi.encodePacked(uint256 index, address receiver, uint256 amount))
 * See ExistingTokenAssetController.claimDividend (dac-cloud-contracts).
 */
function leafHash(index: bigint, receiver: Address, amount: bigint): Hex {
  return keccak256(
    encodePacked(["uint256", "address", "uint256"], [index, receiver, amount]),
  );
}

/** Sorted-pair hash, matches OpenZeppelin MerkleProof.verify convention. */
function hashPair(a: Hex, b: Hex): Hex {
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return keccak256(encodePacked(["bytes32", "bytes32"], [lo, hi]));
}

/**
 * Build a voting power merkle tree for oracle governance snapshots.
 *
 * Leaf format matches HybridDACManagementProposal.voteMerkle:
 *   keccak256(abi.encodePacked(uint256 index, address voter, uint256 amount))
 *
 * Returns root, leaves, proofs, and totalVotingPower (sum of amounts).
 */
export function buildVotingPowerMerkleTree(inputs: VotingPowerLeafInput[]): MerkleResult & {totalVotingPower: bigint} {
  const result = buildMerkleTreeInternal(inputs.map(({voter, amount}) => ({receiver: voter, amount})));
  const totalVotingPower = inputs.reduce((sum, {amount}) => sum + amount, 0n);
  return {...result, totalVotingPower};
}

/**
 * Build a dividend merkle tree from N ≥ 1 recipients.
 *
 * Strategy: balanced binary tree. If a level has an odd count, the last node is
 * duplicated (paired with itself). This matches OpenZeppelin's MerkleProof default
 * verifier which compares via sorted pairs.
 *
 * Returns root, the leaf array (in input order), and per-leaf proofs.
 */
export function buildDividendMerkleTree(inputs: DividendLeafInput[]): MerkleResult {
  return buildMerkleTreeInternal(inputs);
}

function buildMerkleTreeInternal(inputs: DividendLeafInput[]): MerkleResult {
  if (inputs.length === 0) {
    throw new Error("buildMerkleTree requires at least 1 leaf");
  }

  const leaves: Hex[] = inputs.map(({receiver, amount}, i) => leafHash(BigInt(i), receiver, amount));

  if (inputs.length === 1) {
    // Single-leaf tree: root = leaf, proof is empty
    return {root: leaves[0], leaves, proofs: [[]]};
  }

  // Build layers bottom-up. Each layer node records its pair-sibling for proof construction.
  let layer: Hex[] = [...leaves];
  const layers: Hex[][] = [layer];

  while (layer.length > 1) {
    const next: Hex[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = i + 1 < layer.length ? layer[i + 1] : left; // duplicate if odd
      next.push(hashPair(left, right));
    }
    layers.push(next);
    layer = next;
  }

  const root = layer[0];

  // Build proofs: for each leaf, walk up and collect siblings
  const proofs: Hex[][] = leaves.map((_, leafIndex) => {
    const proof: Hex[] = [];
    let idx = leafIndex;
    for (let depth = 0; depth < layers.length - 1; depth++) {
      const level = layers[depth];
      const pairIdx = idx ^ 1; // sibling
      const sibling = pairIdx < level.length ? level[pairIdx] : level[idx]; // duplicate for odd
      proof.push(sibling);
      idx = Math.floor(idx / 2);
    }
    return proof;
  });

  return {root, leaves, proofs};
}
