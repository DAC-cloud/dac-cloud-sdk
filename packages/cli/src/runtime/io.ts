import {readFile} from "node:fs/promises";

let prettyPrint = false;

export function setPrettyPrint(enabled: boolean): void {
  prettyPrint = enabled;
}

export function printJson(payload: unknown): void {
  const replacer = (_key: string, value: unknown): unknown => {
    if (typeof value === "bigint") return value.toString();
    return value;
  };
  const text = prettyPrint
    ? JSON.stringify(payload, replacer, 2)
    : JSON.stringify(payload, replacer);
  process.stdout.write(`${text}\n`);
}

export async function readJsonFile<T>(path: string): Promise<T> {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as T;
}
