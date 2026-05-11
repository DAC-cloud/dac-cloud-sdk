import {concatHex, encodeAbiParameters, keccak256, stringToBytes, type Hex} from "viem";
import type {SnapshotV1Payload} from "./types";

// EIP-712 type hashes for snapshot.org Vote messages. Must stay byte-identical
// to DACDeal.SNAPSHOT_DOMAIN_TYPEHASH / SNAPSHOT_VOTE_TYPEHASH — drift makes the
// off-chain hash diverge from the contract's, which causes isValidSignature to
// silently return 0xffffffff for otherwise-valid approvals.
//
// IMPORTANT: every string field below MUST be hashed as UTF-8 bytes, not as
// hex. Solidity's `keccak256(bytes(stringVar))` always interprets the string
// as raw character bytes — even when the string content looks like a hex
// literal ("0xf0…"). viem's generic `toBytes` would treat 0x-prefixed inputs
// as hex; use `stringToBytes` to force the UTF-8 interpretation that matches
// the contract.
const SNAPSHOT_DOMAIN_TYPEHASH = keccak256(
  stringToBytes("EIP712Domain(string name,string version)"),
);
const SNAPSHOT_VOTE_TYPEHASH = keccak256(
  stringToBytes(
    "Vote(string from,string space,uint64 timestamp,string proposal,uint32 choice,string reason,string app,string metadata)",
  ),
);
const SNAPSHOT_NAME_HASH = keccak256(stringToBytes("snapshot"));

// Pure TS mirror of DACDeal._computeSnapshotV1FinalHash. Snapshot's backend
// derives the same hash from the same payload, which is what gets passed into
// isValidSignature(hash, sig) when verifying a contract vote.
export function computeSnapshotV1FinalHash(p: SnapshotV1Payload): Hex {
  const domainSeparator = keccak256(
    encodeAbiParameters(
      [{type: "bytes32"}, {type: "bytes32"}, {type: "bytes32"}],
      [SNAPSHOT_DOMAIN_TYPEHASH, SNAPSHOT_NAME_HASH, keccak256(stringToBytes(p.version))],
    ),
  );
  const structHash = keccak256(
    encodeAbiParameters(
      [
        {type: "bytes32"},
        {type: "bytes32"},
        {type: "bytes32"},
        {type: "uint64"},
        {type: "bytes32"},
        {type: "uint32"},
        {type: "bytes32"},
        {type: "bytes32"},
        {type: "bytes32"},
      ],
      [
        SNAPSHOT_VOTE_TYPEHASH,
        keccak256(stringToBytes(p.from)),
        keccak256(stringToBytes(p.space)),
        p.timestamp,
        keccak256(stringToBytes(p.proposal)),
        p.choice,
        keccak256(stringToBytes(p.reason)),
        keccak256(stringToBytes(p.app)),
        keccak256(stringToBytes(p.metadata)),
      ],
    ),
  );
  return keccak256(concatHex(["0x1901", domainSeparator, structHash]));
}
