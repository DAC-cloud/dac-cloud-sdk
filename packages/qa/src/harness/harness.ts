import type {
  AssertApi,
  AssertionResult,
  CliOpts,
  CliResult,
  Harness,
  QaConfig,
  StepResult,
} from "./types.js";
import {execCli, execCliAs} from "./cli-exec.js";
import {advanceTime as chainAdvanceTime, mineBlock as chainMineBlock} from "./chain.js";
import {syncIndexer as doSyncIndexer} from "./indexer-sync.js";
import {createAssertApi} from "./assertions.js";
import {createSubmitDryRun} from "./dry-run.js";

export function createHarness(config: QaConfig): Harness {
  const steps: StepResult[] = [];
  let currentAssertions: AssertionResult[] = [];

  function log(message: string): void {
    const ts = new Date().toISOString().slice(11, 23);
    console.log(`  [${ts}] ${message}`);
  }

  async function cli(args: string[], opts?: CliOpts): Promise<CliResult> {
    log(`$ dac ${args.join(" ")}`);
    const result = await execCli(config, args, opts);
    if (result.exitCode === 0) {
      const action = result.data.action ?? "ok";
      log(`  → ${action} (${result.durationMs}ms)`);
    } else {
      log(`  → FAILED (exit ${result.exitCode}, ${result.durationMs}ms)`);
    }
    return result;
  }

  async function cliAs(role: string, args: string[], opts?: CliOpts): Promise<CliResult> {
    log(`$ dac [as ${role}] ${args.join(" ")}`);
    const result = await execCliAs(config, role, args, opts);
    if (result.exitCode === 0) {
      const action = result.data.action ?? "ok";
      log(`  → ${action} (${result.durationMs}ms)`);
    } else {
      log(`  → FAILED (exit ${result.exitCode}, ${result.durationMs}ms)`);
    }
    return result;
  }

  async function advanceTime(seconds: number): Promise<void> {
    log(`⏩ advance time +${seconds}s`);
    await chainAdvanceTime(config, seconds);
  }

  async function mineBlock(): Promise<void> {
    log(`⛏ mine block`);
    await chainMineBlock(config);
  }

  async function syncIndexer(opts?: {timeoutMs?: number}): Promise<void> {
    log(`⏳ syncing indexer...`);
    await doSyncIndexer(config, opts);
    log(`  → indexer synced`);
  }

  async function view(resource: string, args: string[], opts?: CliOpts): Promise<CliResult> {
    return cli(["view", resource, ...args], opts);
  }

  async function dealView(resource: string, args: string[], opts?: CliOpts): Promise<CliResult> {
    return cli(["deal", "view", resource, ...args], opts);
  }

  const submitDryRun = createSubmitDryRun(config, log);

  const assert: AssertApi = createAssertApi(currentAssertions);

  function recordStep(step: StepResult): void {
    steps.push(step);
    currentAssertions = [];
    (assert as ReturnType<typeof createAssertApi>); // assertions reset handled via collector ref
  }

  function getSteps(): StepResult[] {
    return steps;
  }

  return {
    config,
    cli,
    cliAs,
    submitDryRun,
    advanceTime,
    mineBlock,
    syncIndexer,
    view,
    dealView,
    assert,
    recordStep,
    getSteps,
    log,
  };
}

/**
 * Helper: run a CLI command, query indexer, assert, and record as a single step.
 */
export async function step(
  h: Harness,
  label: string,
  fn: (assertions: AssertionResult[]) => Promise<{
    cli: CliResult;
    indexerSnapshot?: Record<string, unknown>;
    command: string[];
  }>,
): Promise<CliResult> {
  const assertions: AssertionResult[] = [];
  // Temporarily redirect assertions to this step's collector
  const originalAssert = (h as {assert: AssertApi}).assert;
  (h as {assert: AssertApi}).assert = createAssertApi(assertions);

  try {
    const result = await fn(assertions);

    h.recordStep({
      label,
      command: result.command,
      cli: result.cli,
      indexerSnapshot: result.indexerSnapshot,
      assertions,
      timestamp: new Date().toISOString(),
    });

    return result.cli;
  } finally {
    (h as {assert: AssertApi}).assert = originalAssert;
  }
}
