import {existsSync, readFileSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {parse as parseDotEnv} from "dotenv";
import {setPrettyPrint} from "./io";

export type StringMap = Record<string, string>;

function toEnvKey(name: string): string {
  return name.replace(/-/g, "_").toUpperCase();
}

function toCamelCase(name: string): string {
  return name.replace(/-([a-z])/g, (_full, ch: string) => ch.toUpperCase());
}

function readEnvFile(path: string, required: boolean): StringMap {
  if (!existsSync(path)) {
    if (required) {
      throw new Error(`Config file not found: ${path}`);
    }
    return {};
  }

  const content = readFileSync(path, "utf8");
  return parseDotEnv(content);
}

function candidateEnvKeys(key: string): string[] {
  const normalized = toEnvKey(key);
  const keys = new Set<string>([normalized, `DAC_${normalized}`]);
  if (normalized.startsWith("DAC_")) {
    keys.add(normalized.slice(4));
  }
  return [...keys];
}

function toStringValue(value: unknown): string | undefined {
  if (value === undefined || value === null || value === false) {
    return undefined;
  }
  if (value === true) {
    return "true";
  }
  return String(value);
}

export class OptionResolver {
  private readonly cliOptions: Record<string, unknown>;
  private readonly providedConfig: StringMap;
  private readonly defaultConfig: StringMap;

  public constructor(input: {
    cliOptions: Record<string, unknown>;
    providedConfig: StringMap;
    defaultConfig: StringMap;
  }) {
    this.cliOptions = input.cliOptions;
    this.providedConfig = input.providedConfig;
    this.defaultConfig = input.defaultConfig;
  }

  private findCliValue(key: string): string | undefined {
    const dashed = key;
    const camel = toCamelCase(key);
    return toStringValue(this.cliOptions[dashed] ?? this.cliOptions[camel]);
  }

  private findMapValue(map: StringMap, key: string): string | undefined {
    for (const candidate of candidateEnvKeys(key)) {
      const value = map[candidate];
      if (value !== undefined && value !== "") {
        return value;
      }
    }
    return undefined;
  }

  private findEnvValue(key: string): string | undefined {
    for (const candidate of candidateEnvKeys(key)) {
      const value = process.env[candidate];
      if (value !== undefined && value !== "") {
        return value;
      }
    }
    return undefined;
  }

  public resolveString(key: string | string[], fallback?: string): string | undefined {
    const keys = Array.isArray(key) ? key : [key];

    for (const current of keys) {
      const cliValue = this.findCliValue(current);
      if (cliValue !== undefined) {
        return cliValue;
      }
    }

    for (const current of keys) {
      const explicitConfigValue = this.findMapValue(this.providedConfig, current);
      if (explicitConfigValue !== undefined) {
        return explicitConfigValue;
      }
    }

    for (const current of keys) {
      const defaultConfigValue = this.findMapValue(this.defaultConfig, current);
      if (defaultConfigValue !== undefined) {
        return defaultConfigValue;
      }
    }

    for (const current of keys) {
      const envValue = this.findEnvValue(current);
      if (envValue !== undefined) {
        return envValue;
      }
    }

    return fallback;
  }

  public requireString(key: string | string[], hint?: string): string {
    const value = this.resolveString(key);
    if (value === undefined) {
      const names = Array.isArray(key) ? key.join(" or ") : key;
      throw new Error(hint ?? `Missing required option: ${names}`);
    }
    return value;
  }

  public resolveBoolean(key: string | string[], fallback = false): boolean {
    const raw = this.resolveString(key);
    if (raw === undefined) {
      return fallback;
    }
    return raw === "true" || raw === "1" || raw === "yes";
  }

  public resolveNumber(key: string | string[], fallback?: number): number | undefined {
    const raw = this.resolveString(key);
    if (raw === undefined) {
      return fallback;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      throw new Error(`Expected numeric value for ${Array.isArray(key) ? key.join("/") : key}, got: ${raw}`);
    }
    return parsed;
  }

  public requireNumber(key: string | string[], hint?: string): number {
    const value = this.resolveNumber(key);
    if (value === undefined) {
      const names = Array.isArray(key) ? key.join(" or ") : key;
      throw new Error(hint ?? `Missing required numeric option: ${names}`);
    }
    return value;
  }

  public resolveBigInt(key: string | string[], fallback?: bigint): bigint | undefined {
    const raw = this.resolveString(key);
    if (raw === undefined) {
      return fallback;
    }

    try {
      return BigInt(raw);
    } catch {
      throw new Error(`Expected integer value for ${Array.isArray(key) ? key.join("/") : key}, got: ${raw}`);
    }
  }

  public requireBigInt(key: string | string[], hint?: string): bigint {
    const value = this.resolveBigInt(key);
    if (value === undefined) {
      const names = Array.isArray(key) ? key.join(" or ") : key;
      throw new Error(hint ?? `Missing required integer option: ${names}`);
    }
    return value;
  }
}

/**
 * Update or append a key in a dotenv-style config file.
 * Preserves existing comments and whitespace.
 */
export function writeConfigKey(configPath: string, key: string, value: string): void {
  const absPath = resolve(configPath);
  let content = "";
  if (existsSync(absPath)) {
    content = readFileSync(absPath, "utf8");
  }

  const pattern = new RegExp(`^${key}=.*$`, "m");
  const newLine = `${key}=${value}`;

  if (pattern.test(content)) {
    content = content.replace(pattern, newLine);
  } else {
    const separator = content.length > 0 && !content.endsWith("\n") ? "\n" : "";
    content = `${content}${separator}${newLine}\n`;
  }

  writeFileSync(absPath, content, "utf8");
}

/**
 * Remove a key from a dotenv-style config file.
 */
export function removeConfigKey(configPath: string, key: string): void {
  const absPath = resolve(configPath);
  if (!existsSync(absPath)) return;

  let content = readFileSync(absPath, "utf8");
  const pattern = new RegExp(`^${key}=.*\n?`, "m");
  content = content.replace(pattern, "");
  writeFileSync(absPath, content, "utf8");
}

export async function loadOptionResolver(cliOptions: Record<string, unknown>): Promise<OptionResolver> {
  const configPathRaw = toStringValue(cliOptions.config);
  const configPath = configPathRaw ? resolve(configPathRaw) : undefined;
  const defaultConfigPath = resolve(process.cwd(), "config.env");

  const providedConfig = configPath ? readEnvFile(configPath, true) : {};
  const defaultConfig = configPath === defaultConfigPath ? providedConfig : readEnvFile(defaultConfigPath, false);

  const resolver = new OptionResolver({
    cliOptions,
    providedConfig,
    defaultConfig,
  });

  setPrettyPrint(resolver.resolveBoolean("pretty-print", false));

  return resolver;
}
