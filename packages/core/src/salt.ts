import {keccak256, stringToHex, type Hex} from "viem";

export function referralUidToSalt(referralUid: string): Hex {
  return keccak256(stringToHex(referralUid));
}

export function randomSalt(): Hex {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}` as Hex;
}

export function resolveSalt(args: {salt?: Hex; referralUid?: string}): Hex {
  if (args.referralUid) return referralUidToSalt(args.referralUid);
  if (args.salt) return args.salt;
  return randomSalt();
}
