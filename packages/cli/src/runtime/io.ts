import {readFile} from "node:fs/promises";

export function printJson(payload: unknown): void {
  const text = JSON.stringify(payload, (_key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
  process.stdout.write(`${text}\n`);
}

export async function readJsonFile<T>(path: string): Promise<T> {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as T;
}
