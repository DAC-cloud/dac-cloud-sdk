import type {Hex} from "viem";
import {asBytes4} from "../actions/shared";
import {coreCliModule} from "./core";
import type {
  CliModuleSpec,
  DealKindSpec,
  EvaluatorKindSpec,
  ResolvedDealProposalType,
} from "./types";

const MODULES: CliModuleSpec[] = [coreCliModule];

function normalizeModuleId(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeAlias(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");
}

function splitScopedValue(raw: string): {moduleIdHint?: string; value: string} {
  const index = raw.indexOf(":");
  if (index <= 0) {
    return {value: raw};
  }
  return {
    moduleIdHint: normalizeModuleId(raw.slice(0, index)),
    value: raw.slice(index + 1),
  };
}

function assertKnownModuleId(moduleId: string): void {
  const match = MODULES.some((entry) => entry.moduleId === moduleId);
  if (!match) {
    throw new Error(`Unknown module id: ${moduleId}`);
  }
}

function matchAlias(canonical: string, aliases: string[], key: string): boolean {
  if (canonical === normalizeAlias(key)) {
    return true;
  }
  return aliases.some((entry) => canonical === normalizeAlias(entry));
}

function findDealKindMatches(moduleIdHint: string | undefined, value: string): DealKindSpec[] {
  const normalized = normalizeAlias(value);
  const out: DealKindSpec[] = [];
  for (const module of MODULES) {
    if (moduleIdHint && module.moduleId !== moduleIdHint) {
      continue;
    }
    for (const spec of module.dealKinds) {
      if (matchAlias(normalized, spec.aliases, spec.key)) {
        out.push(spec);
      }
    }
  }
  return out;
}

function findEvaluatorMatches(moduleIdHint: string | undefined, value: string): EvaluatorKindSpec[] {
  const normalized = normalizeAlias(value);
  const out: EvaluatorKindSpec[] = [];
  for (const module of MODULES) {
    if (moduleIdHint && module.moduleId !== moduleIdHint) {
      continue;
    }
    for (const spec of module.evaluatorKinds) {
      if (matchAlias(normalized, spec.aliases, spec.key)) {
        out.push(spec);
      }
    }
  }
  return out;
}

function makeRawDealKindSpec(selector: Hex, moduleIdHint?: string): DealKindSpec {
  return {
    moduleId: moduleIdHint ?? "custom",
    key: selector.toLowerCase(),
    selector,
    aliases: [selector.toLowerCase()],
    encodeConfig(config: unknown): Hex {
      if (typeof config === "string" && /^0x[0-9a-fA-F]*$/.test(config)) {
        return config as Hex;
      }
      throw new Error("Custom deal kind requires pre-encoded hex dealConfig.");
    },
  };
}

function makeRawEvaluatorSpec(selector: Hex, moduleIdHint?: string): EvaluatorKindSpec {
  return {
    moduleId: moduleIdHint ?? "custom",
    key: selector.toLowerCase(),
    selector,
    aliases: [selector.toLowerCase()],
    encodeConfig(config: unknown): Hex {
      if (typeof config === "string" && /^0x[0-9a-fA-F]*$/.test(config)) {
        return config as Hex;
      }
      throw new Error("Custom evaluator kind requires pre-encoded hex evaluatorConfig.");
    },
  };
}

function uniqueByModuleAndKey<T extends {moduleId: string; key: string}>(items: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set(`${item.moduleId}:${item.key}`, item);
  }
  return [...map.values()];
}

export function resolveDealKindSpec(raw: string): DealKindSpec {
  const {moduleIdHint, value} = splitScopedValue(raw);
  if (moduleIdHint) {
    assertKnownModuleId(moduleIdHint);
  }

  if (value.startsWith("0x")) {
    const selector = asBytes4(value, "deal kind") as Hex;
    const selectorMatches = findDealKindMatches(moduleIdHint, selector.toLowerCase());
    if (selectorMatches.length === 1) {
      return selectorMatches[0];
    }
    if (selectorMatches.length > 1) {
      throw new Error(`Ambiguous deal kind selector ${selector}. Prefix with module id, e.g. core:${selector}`);
    }
    return makeRawDealKindSpec(selector, moduleIdHint);
  }

  const matches = findDealKindMatches(moduleIdHint, value);
  if (matches.length === 1) {
    return matches[0];
  }
  if (matches.length > 1) {
    const values = matches.map((entry) => `${entry.moduleId}:${entry.key}`).join(", ");
    throw new Error(`Ambiguous deal kind '${raw}'. Use explicit module prefix. Matches: ${values}`);
  }

  const supported = uniqueByModuleAndKey(
    MODULES.flatMap((entry) => entry.dealKinds),
  ).map((entry) => `${entry.moduleId}:${entry.key}`).join(", ");
  throw new Error(`Unsupported deal kind '${raw}'. Supported deal kinds: ${supported}`);
}

export function resolveEvaluatorKindSpec(raw: string): EvaluatorKindSpec {
  const {moduleIdHint, value} = splitScopedValue(raw);
  if (moduleIdHint) {
    assertKnownModuleId(moduleIdHint);
  }

  if (value.startsWith("0x")) {
    const selector = asBytes4(value, "evaluator selector") as Hex;
    const selectorMatches = findEvaluatorMatches(moduleIdHint, selector.toLowerCase());
    if (selectorMatches.length === 1) {
      return selectorMatches[0];
    }
    if (selectorMatches.length > 1) {
      throw new Error(`Ambiguous evaluator selector ${selector}. Prefix with module id, e.g. core:${selector}`);
    }
    return makeRawEvaluatorSpec(selector, moduleIdHint);
  }

  const matches = findEvaluatorMatches(moduleIdHint, value);
  if (matches.length === 1) {
    return matches[0];
  }
  if (matches.length > 1) {
    const values = matches.map((entry) => `${entry.moduleId}:${entry.key}`).join(", ");
    throw new Error(`Ambiguous evaluator '${raw}'. Use explicit module prefix. Matches: ${values}`);
  }

  const supported = uniqueByModuleAndKey(
    MODULES.flatMap((entry) => entry.evaluatorKinds),
  ).map((entry) => `${entry.moduleId}:${entry.key}`).join(", ");
  throw new Error(`Unsupported evaluator '${raw}'. Supported evaluators: ${supported}`);
}

export function resolveDealProposalType(raw: string): ResolvedDealProposalType {
  const {moduleIdHint, value} = splitScopedValue(raw);
  if (moduleIdHint) {
    assertKnownModuleId(moduleIdHint);
  }

  const normalized = normalizeAlias(value);
  const matches = MODULES.flatMap((module) => {
    if (moduleIdHint && module.moduleId !== moduleIdHint) {
      return [];
    }
    return module.dealProposalTypes.filter((entry) => matchAlias(normalized, entry.aliases, entry.key));
  });

  if (matches.length === 1) {
    const found = matches[0];
    return {
      raw,
      canonicalType: found.key,
      moduleIdHint,
      spec: found,
    };
  }

  if (matches.length > 1) {
    const variants = matches.map((entry) => `${entry.moduleId}:${entry.key}`).join(", ");
    throw new Error(`Ambiguous module proposal type '${raw}'. Use explicit module prefix. Matches: ${variants}`);
  }

  return {
    raw,
    canonicalType: normalized,
    moduleIdHint,
  };
}

export function listKnownModuleDealProposalTypes(): string[] {
  const entries = uniqueByModuleAndKey(
    MODULES.flatMap((module) => module.dealProposalTypes),
  ).map((entry) => `${entry.moduleId}:${entry.key}`);
  return entries.sort((a, b) => a.localeCompare(b));
}
