import type {AssertApi, AssertionResult} from "./types.js";

export class AssertionError extends Error {
  constructor(
    message: string,
    public result: AssertionResult,
  ) {
    super(message);
    this.name = "AssertionError";
  }
}

export function createAssertApi(collector: AssertionResult[]): AssertApi {
  function record(label: string, passed: boolean, expected?: unknown, actual?: unknown, message?: string): void {
    const result: AssertionResult = {label: label || "unnamed", passed, expected, actual, message};
    collector.push(result);
    if (!passed) {
      throw new AssertionError(
        message || `Assertion failed: ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
        result,
      );
    }
  }

  return {
    equal(actual, expected, label = "equal") {
      record(label, actual === expected, expected, actual);
    },

    notEqual(actual, expected, label = "notEqual") {
      record(label, actual !== expected, `not ${JSON.stringify(expected)}`, actual);
    },

    truthy(value, label = "truthy") {
      record(label, !!value, "truthy", value);
    },

    falsy(value, label = "falsy") {
      record(label, !value, "falsy", value);
    },

    gt(actual, expected, label = "gt") {
      record(label, actual > expected, `> ${expected}`, actual);
    },

    gte(actual, expected, label = "gte") {
      record(label, actual >= expected, `>= ${expected}`, actual);
    },

    includes(haystack, needle, label = "includes") {
      record(label, haystack.includes(needle), `contains "${needle}"`, haystack);
    },

    match(value, pattern, label = "match") {
      record(label, pattern.test(value), `matches ${pattern}`, value);
    },

    defined(value, label = "defined") {
      record(label, value !== undefined && value !== null, "defined", value);
    },

    isAddress(value, label = "isAddress") {
      const valid = typeof value === "string" && /^0x[0-9a-fA-F]{40}$/.test(value);
      record(label, valid, "valid address", value);
    },

    deepIncludes(obj, subset, label = "deepIncludes") {
      const mismatches: string[] = [];
      for (const [key, expected] of Object.entries(subset)) {
        const actual = obj[key];
        if (actual !== expected) {
          mismatches.push(`${key}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
      }
      record(label, mismatches.length === 0, subset, obj, mismatches.length > 0 ? mismatches.join("; ") : undefined);
    },
  };
}
