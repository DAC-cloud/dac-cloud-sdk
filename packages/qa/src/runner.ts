import {createHarness} from "./harness/index.js";
import {reviewScenario} from "./review/reviewer.js";
import type {QaConfig, Scenario, ScenarioResult} from "./harness/types.js";

export interface RunOptions {
  /** Run only scenarios matching these names (substring match) */
  filter?: string[];
  /** Run only scenarios matching these tags */
  tags?: string[];
  /** Skip agent review even if reviewer is configured */
  skipReview?: boolean;
  /** Stop on first failure */
  bail?: boolean;
}

export async function runScenarios(
  config: QaConfig,
  scenarios: Scenario[],
  opts: RunOptions = {},
): Promise<ScenarioResult[]> {
  let filtered = scenarios;

  if (opts.filter && opts.filter.length > 0) {
    filtered = filtered.filter((s) =>
      opts.filter!.some((f) => s.name.toLowerCase().includes(f.toLowerCase())),
    );
  }

  if (opts.tags && opts.tags.length > 0) {
    filtered = filtered.filter((s) => opts.tags!.some((t) => s.tags.includes(t)));
  }

  if (filtered.length === 0) {
    console.log("No scenarios matched the filter.");
    return [];
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`DAC Cloud QA — ${filtered.length} scenario(s)`);
  console.log(`${"=".repeat(60)}\n`);

  const results: ScenarioResult[] = [];

  for (const scenario of filtered) {
    const result = await runSingle(config, scenario, opts);
    results.push(result);

    if (!result.passed && opts.bail) {
      console.log("\nBailing after first failure.");
      break;
    }
  }

  printSummary(results);
  return results;
}

async function runSingle(
  config: QaConfig,
  scenario: Scenario,
  opts: RunOptions,
): Promise<ScenarioResult> {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`▶ ${scenario.name}`);
  console.log(`  ${scenario.description}`);
  console.log(`  tags: [${scenario.tags.join(", ")}]`);
  console.log(`${"─".repeat(60)}`);

  const harness = createHarness(config);
  const start = Date.now();

  let passed = true;
  let error: string | undefined;

  try {
    await scenario.run(harness);
  } catch (err) {
    passed = false;
    error = err instanceof Error ? err.message : String(err);
    console.error(`\n  ✗ FAILED: ${error}`);
  }

  const durationMs = Date.now() - start;
  const steps = harness.getSteps();

  // Check if any step had failed assertions
  const failedAssertions = steps.flatMap((s) => s.assertions.filter((a) => !a.passed));
  if (failedAssertions.length > 0) {
    passed = false;
  }

  // Agent review
  let review = undefined;
  if (config.reviewer && !opts.skipReview && steps.length > 0) {
    console.log(`\n  🔍 Running agent review...`);
    try {
      review = await reviewScenario(config.reviewer, scenario.name, steps);
      if (!review.passed) {
        passed = false;
        console.log(`  ⚠ Agent reviewer found issues:`);
        for (const f of review.findings) {
          console.log(`    [${f.severity}] ${f.step}: ${f.message}`);
        }
      } else {
        console.log(`  ✓ Agent review passed: ${review.summary}`);
      }
    } catch (err) {
      console.error(`  ⚠ Agent review error: ${err instanceof Error ? err.message : err}`);
    }
  }

  const status = passed ? "✓ PASSED" : "✗ FAILED";
  console.log(`\n  ${status} (${steps.length} steps, ${durationMs}ms)`);

  return {
    name: scenario.name,
    tags: scenario.tags,
    steps,
    passed,
    durationMs,
    error,
    review,
  };
}

function printSummary(results: ScenarioResult[]): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log("SUMMARY");
  console.log(`${"=".repeat(60)}`);

  const passCount = results.filter((r) => r.passed).length;
  const failCount = results.length - passCount;

  for (const r of results) {
    const icon = r.passed ? "✓" : "✗";
    const reviewNote = r.review && !r.review.passed ? ` (${r.review.findings.length} review findings)` : "";
    console.log(`  ${icon} ${r.name} (${r.durationMs}ms)${reviewNote}`);
  }

  console.log(`\n  ${passCount} passed, ${failCount} failed, ${results.length} total`);

  if (failCount > 0) {
    console.log("\nFailed scenarios:");
    for (const r of results.filter((r) => !r.passed)) {
      if (r.error) {
        console.log(`  ${r.name}: ${r.error}`);
      }
      const failedSteps = r.steps.filter((s) => s.assertions.some((a) => !a.passed));
      for (const s of failedSteps) {
        for (const a of s.assertions.filter((a) => !a.passed)) {
          console.log(`  ${r.name} → ${s.label}: ${a.message || a.label}`);
        }
      }
    }
  }

  console.log();
}
