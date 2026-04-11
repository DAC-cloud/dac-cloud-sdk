/**
 * Protocol percent scaling utilities.
 *
 * The protocol uses 1e18 (MANTISSA) as 100%.
 * These helpers convert between human-readable percent values and protocol-level scaled values.
 */

export const MANTISSA = 10n ** 18n;

/**
 * Convert a human-readable percent (e.g. 50, 7.5, 0.1) to protocol-scaled bigint.
 * 50 → 500000000000000000n (0.5 * MANTISSA)
 * 100 → 1000000000000000000n (1.0 * MANTISSA)
 * 7.5 → 75000000000000000n
 */
export function percentToScale(percent: number): bigint {
  if (percent < 0 || percent > 100) {
    throw new Error(`Percent value must be between 0 and 100, got ${percent}`);
  }
  // Use integer math to avoid floating-point precision issues.
  // Multiply by 1e16 (MANTISSA / 100), handling decimals via string splitting.
  const str = percent.toString();
  const dotIndex = str.indexOf(".");
  if (dotIndex === -1) {
    return BigInt(percent) * (MANTISSA / 100n);
  }
  const intPart = str.slice(0, dotIndex);
  const fracPart = str.slice(dotIndex + 1).slice(0, 16); // max 16 decimal digits
  const padded = fracPart.padEnd(16, "0");
  const wholeBig = BigInt(intPart) * (MANTISSA / 100n);
  const fracBig = BigInt(padded) * (MANTISSA / 100n) / (10n ** BigInt(padded.length));
  return wholeBig + fracBig;
}

/**
 * Convert protocol-scaled bigint back to human-readable percent number.
 * 500000000000000000n → 50
 * 75000000000000000n → 7.5
 */
export function scaleToPercent(value: bigint): number {
  // value * 100 / MANTISSA, preserving decimals
  const hundredths = value * 10000n / MANTISSA;
  return Number(hundredths) / 100;
}

/**
 * Parse a percent value from user input string.
 * Accepts: "50", "7.5", "50%" (strips trailing %)
 * Returns protocol-scaled bigint.
 */
export function parsePercentInput(input: string): bigint {
  const cleaned = input.trim().replace(/%$/, "");
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid percent value: '${input}'`);
  }
  return percentToScale(value);
}

/**
 * Detect whether a value looks like a raw mantissa (>= 1e15) or a human percent (< 1000).
 * Used for backward-compatible parsing where users might pass either format.
 * Returns the value as protocol-scaled bigint.
 */
export function normalizePercentInput(input: string | bigint): bigint {
  if (typeof input === "bigint") {
    // If already a large number, assume it's already scaled
    return input >= MANTISSA / 1000n ? input : percentToScale(Number(input));
  }
  const cleaned = input.trim().replace(/%$/, "");
  // If it looks like a raw mantissa (pure digits, >= 15 chars), pass through
  if (/^[0-9]+$/.test(cleaned) && cleaned.length >= 15) {
    return BigInt(cleaned);
  }
  return parsePercentInput(cleaned);
}
