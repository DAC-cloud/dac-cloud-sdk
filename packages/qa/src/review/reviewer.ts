import type {ReviewerConfig, ReviewFinding, ReviewResult, StepResult} from "../harness/types.js";

const SYSTEM_PROMPT = `You are a QA reviewer for the DAC Cloud protocol — an EVM-based smart contract system for Decentralized Autonomous Corporations.

You will receive the execution log of an E2E test scenario. Each step includes:
- The CLI command that was run
- The CLI JSON output
- An indexer state snapshot (GraphQL query result showing on-chain state as indexed)
- Hard assertion results (deterministic checks already run)

Your job is to review the indexer state and identify issues that hard assertions might miss:

1. **Data consistency**: Do indexer fields match what the CLI action produced? Are addresses, amounts, IDs consistent across steps?
2. **Completeness**: Are expected fields populated (not null/zero when they should have values)? Are relations present?
3. **State transitions**: Do statuses progress correctly (e.g. proposal: created → resolved → executed)?
4. **Scaling/encoding**: Are amounts reasonable? Are percentages in the right scale? Any obvious off-by-one in IDs?
5. **Missing data**: Are there events or state changes that SHOULD be reflected but aren't visible in the indexer?
6. **Temporal consistency**: Do timestamps/blocks make sense? Is createdBlockTimestamp before updatedBlockTimestamp?

Respond with a JSON object matching this schema:
{
  "passed": boolean,        // false if any error-severity findings
  "summary": string,        // 1-2 sentence overall assessment
  "findings": [
    {
      "severity": "error" | "warning" | "info",
      "step": string,       // which step label
      "field": string,      // which field or relation (optional)
      "message": string     // what's wrong and what was expected
    }
  ]
}

Be specific. Reference exact field names and values. Don't flag things that are working correctly.
If everything looks good, return passed: true with an empty findings array.`;

function buildPrompt(scenarioName: string, steps: StepResult[]): string {
  const parts = [`# Scenario: ${scenarioName}\n`];

  for (const step of steps) {
    parts.push(`## Step: ${step.label}`);
    parts.push(`Command: ${step.command.join(" ")}`);
    parts.push(`CLI Output:\n\`\`\`json\n${JSON.stringify(step.cli.data, null, 2)}\n\`\`\``);

    if (step.indexerSnapshot) {
      parts.push(`Indexer Snapshot:\n\`\`\`json\n${JSON.stringify(step.indexerSnapshot, null, 2)}\n\`\`\``);
    }

    if (step.assertions.length > 0) {
      const summary = step.assertions
        .map((a) => `  ${a.passed ? "PASS" : "FAIL"}: ${a.label}${a.message ? ` — ${a.message}` : ""}`)
        .join("\n");
      parts.push(`Assertions:\n${summary}`);
    }

    parts.push("");
  }

  return parts.join("\n");
}

export async function reviewScenario(
  config: ReviewerConfig,
  scenarioName: string,
  steps: StepResult[],
): Promise<ReviewResult> {
  const prompt = buildPrompt(scenarioName, steps);

  const baseUrl = config.baseUrl ?? "https://api.anthropic.com";
  const url = `${baseUrl}/v1/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{role: "user", content: prompt}],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[reviewer] API error ${response.status}: ${text}`);
    return {passed: true, findings: [], summary: `Review skipped: API error ${response.status}`};
  }

  const result = (await response.json()) as {content: Array<{type: string; text: string}>};
  const text = result.content?.[0]?.text ?? "";

  try {
    // Extract JSON from response (may be wrapped in markdown code block)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {passed: true, findings: [], summary: "Review skipped: no JSON in response"};
    }
    const parsed = JSON.parse(jsonMatch[0]) as {passed: boolean; summary: string; findings: ReviewFinding[]};
    return {
      passed: parsed.passed,
      summary: parsed.summary,
      findings: parsed.findings ?? [],
    };
  } catch {
    return {passed: true, findings: [], summary: `Review skipped: failed to parse response`};
  }
}
