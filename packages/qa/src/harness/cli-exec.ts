import {execFile} from "node:child_process";
import type {CliOpts, CliResult, QaConfig} from "./types.js";

const DEFAULT_TIMEOUT_MS = 120_000;

function buildArgs(baseArgs: string[], configPath: string, opts?: CliOpts): string[] {
  const args = [...baseArgs, "--config", opts?.configPath ?? configPath, "--pretty-print"];

  if (opts?.flags) {
    for (const [key, value] of Object.entries(opts.flags)) {
      if (value === true) {
        args.push(`--${key}`);
      } else if (value !== false && value !== undefined) {
        args.push(`--${key}`, String(value));
      }
    }
  }

  return args;
}

function parseJsonOutput(stdout: string): Record<string, unknown> {
  const trimmed = stdout.trim();
  if (!trimmed) return {};

  // CLI may output non-JSON lines before the JSON (e.g. warnings).
  // Find the first '{' and last '}' to extract JSON.
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    return {_raw: trimmed};
  }

  try {
    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
  } catch {
    return {_raw: trimmed};
  }
}

export function execCli(config: QaConfig, args: string[], opts?: CliOpts): Promise<CliResult> {
  const fullArgs = buildArgs(args, config.configPath, opts);
  const timeoutMs = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const proc = execFile(
      config.cliBin,
      fullArgs,
      {
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024,
        env: {...process.env},
      },
      (error, stdout, stderr) => {
        const durationMs = Date.now() - start;
        const exitCode = error && "code" in error ? (error.code as number) ?? 1 : 0;

        const result: CliResult = {
          data: parseJsonOutput(stdout),
          stdout,
          stderr,
          exitCode,
          durationMs,
        };

        if (exitCode !== 0 && !opts?.allowFailure) {
          const err = new CliError(
            `CLI exited with code ${exitCode}: ${stderr || stdout}`.slice(0, 500),
            result,
            fullArgs,
          );
          reject(err);
        } else {
          resolve(result);
        }
      },
    );

    // Kill on timeout (execFile handles this but let's be explicit)
    proc.on("error", (err) => {
      reject(new Error(`CLI process error: ${err.message}`));
    });
  });
}

export class CliError extends Error {
  constructor(
    message: string,
    public result: CliResult,
    public args: string[],
  ) {
    super(message);
    this.name = "CliError";
  }
}

export function execCliAs(config: QaConfig, role: string, args: string[], opts?: CliOpts): Promise<CliResult> {
  const wallet = config.wallets[role];
  if (!wallet) {
    throw new Error(`Unknown wallet role: "${role}". Available: ${Object.keys(config.wallets).join(", ")}`);
  }

  return execCli(config, args, {
    ...opts,
    flags: {
      ...opts?.flags,
      "private-key": wallet.privateKey,
    },
  });
}
