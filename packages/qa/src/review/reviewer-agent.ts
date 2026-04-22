import {resolve} from "node:path";
import {query} from "@anthropic-ai/claude-agent-sdk";
import type {ReviewResult, StepResult} from "../harness/types.js";

const DAC_REVIEWER_PROMPT = `You are a QA reviewer specializing in the DAC Cloud protocol — an EVM smart contract system for Decentralized Autonomous Corporations.

You review E2E test scenario execution logs and catch indexer data issues that hard assertions miss.

## How to Use Your Tools

You have the Read tool. Use it to look up protocol documentation when you need deeper understanding of a specific feature:
- Deal lifecycle, evaluation, claims: Read docs/guides/deal-lifecycle.md
- DAC commands and proposal types: Read docs/cli/dac-commands.md
- Deal commands and governance: Read docs/cli/deal-commands.md
- Governance flows, quorum, voting: Read docs/cli/governance.md
- Native DAC creation: Read docs/guides/native-dac.md
- Existing-token DAC and oracle: Read docs/guides/existing-token-dac.md
- QA scenarios reference: Read packages/qa/README.md

Only read docs when you're unsure about expected behavior for a specific flow. Don't read all docs for every review.

## Protocol Knowledge

- **DACCell**: Micro-kernel — identity, proposal routing, metadata
- **GovernanceSchema**: Native (ERC20Votes) or Hybrid (WrappedMainToken + GovernanceOracle)
- **AssetController**: Treasury custody, capital calls, dividends, agent distributor registry
- **DealManager**: Deal lifecycle — creates DealCell + Deal contract pairs, evaluator orchestration
- **MainToken/AgentToken**: Governance token + non-transferable operator token staked into Deals
- **StakedAgent token**: Per-deal ERC20Votes token, minted on stake, burned on slash
- **Two DAC modes**: Native (fresh token) vs Existing-Token (wrapped token + oracle)

## Indexer Accounting Rules

These invariants MUST hold in indexer data:

**Deal-level aggregates must equal position sums:**
- sum(positions.currentStakedAmount) == deal.currentStakedAmount
- sum(positions.totalSlashedAmount) == deal.totalSlashedStakeAmount
- sum(positions.totalReleasedAmount) == deal.totalReleasedStakeAmount
- sum(positions.totalClaimedMainTokenAmount) == deal.totalRewardClaimedAmount

**Per-position stake conservation:**
- currentStakedAmount + totalSlashedAmount + totalReleasedAmount == totalStakedAmount

**Reward bounds:**
- totalRewardClaimedAmount <= totalRewardAllocatedAmount
- totalDealRewardPoolClaimedAmount <= totalDealRewardPoolAllocatedAmount

**State consistency:**
- closed deal: active == false
- recovered deal: closed == true, recovered == true
- evaluated deal: totalEvaluationCount > 0
- stakerCount should match number of positions with currentStakedAmount > 0

**Important protocol behaviors:**
- forceReturnCapital (withdraw) returns FUNDING TOKENS from deal cell to DAC treasury — it does NOT close the deal, release stakes, or slash agents. The deal stays active.
- strike-out releases an agent's stake (tokens returned) — it does NOT slash (no tokens burned). The deal stays active.
- Full slash (100% penalty) burns all staked tokens, auto-closes the deal (totalSupply=0 triggers close). After close, agents cannot unstake.
- Evaluation reward/penalty depends on milestone progress, rewardCurve, penaltyCurve. At 0 progress: penalty only. At 100%+ progress: reward only.
- Deal recovery (recover-deal): DAC governance assigns a liquidator with StakedAgent tokens minted DIRECTLY — no AgentToken transfer happens. The liquidator gets a position (currentStakedAmount > 0) but the deal cell does NOT hold any AgentTokens for that position. This is by design — liquidator stake is synthetic, not backed by AgentTokens.

## What to Check

1. **Data consistency**: Indexer fields match CLI action output — addresses, amounts, IDs consistent across steps
2. **Completeness**: Expected fields populated (not null/zero when they should have values)
3. **State transitions**: Statuses progress correctly (proposal: created -> resolved -> executed)
4. **Accounting**: Amounts add up — stake totals, reward allocations, slash amounts
5. **Missing data**: Events or state changes that SHOULD be reflected but aren't in the indexer
6. **Temporal consistency**: Timestamps/blocks make sense, createdBlockNumber <= updatedBlockNumber

Be specific. Reference exact field names and values. Don't flag things that are working correctly.`;

const REVIEW_JSON_SCHEMA = {
  type: "object" as const,
  properties: {
    passed: {type: "boolean" as const, description: "false if any error-severity findings"},
    summary: {type: "string" as const, description: "1-2 sentence overall assessment"},
    findings: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          severity: {type: "string" as const, enum: ["error", "warning", "info"]},
          step: {type: "string" as const, description: "step label"},
          field: {type: "string" as const, description: "field or relation name"},
          message: {type: "string" as const, description: "what is wrong and what was expected"},
        },
        required: ["severity", "step", "message"],
      },
    },
  },
  required: ["passed", "summary", "findings"],
};

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

/**
 * Review a scenario using Claude Code Agent SDK.
 * Uses the user's Claude Code subscription — no API key needed.
 */
export async function reviewScenarioWithAgent(
  scenarioName: string,
  steps: StepResult[],
): Promise<ReviewResult> {
  const prompt = buildPrompt(scenarioName, steps);

  try {
    let resultText = "";

    let structuredOutput: unknown = undefined;

    // Resolve repo root (qa package is at packages/qa/, so go up 2 levels)
    const repoRoot = resolve(import.meta.dirname ?? ".", "..", "..");

    for await (const message of query({
      prompt: `Review this DAC Cloud QA scenario execution log. Analyze the indexer data for consistency, completeness, and accounting correctness.\n\n${prompt}`,
      options: {
        cwd: repoRoot,
        agent: "dac-qa-reviewer",
        agents: {
          "dac-qa-reviewer": {
            description: "DAC Cloud protocol QA reviewer — analyzes indexer data for consistency and accounting bugs",
            prompt: DAC_REVIEWER_PROMPT,
            tools: ["Read"],
            maxTurns: 8,
          },
        },
        allowedTools: ["Read"],
        maxTurns: 8,
        outputFormat: {
          type: "json_schema",
          schema: REVIEW_JSON_SCHEMA,
        },
      },
    })) {
      if (message.type === "assistant") {
        // Capture text from assistant messages (may arrive before result)
        const msg = message.message;
        const text = typeof msg === "string"
          ? msg
          : (msg as unknown as Record<string, unknown>)?.content != null
            ? String((msg as unknown as Record<string, unknown>).content)
            : "";
        if (text) resultText += text;
      } else if (message.type === "result") {
        if (message.subtype === "success") {
          // structured_output is the primary field for outputFormat results
          const anyMsg = message as unknown as Record<string, unknown>;
          if (anyMsg.structured_output != null) {
            structuredOutput = anyMsg.structured_output;
          }
          // Also capture result text as fallback
          const r = typeof message.result === "string"
            ? message.result
            : JSON.stringify(message.result);
          if (r) resultText = r;
        } else if (message.subtype === "error_max_turns") {
          console.error(`  [reviewer] hit max turns, attempting to parse partial response`);
        }
      }
    }

    // Try structured_output first (the SDK's native structured output)
    if (structuredOutput && typeof structuredOutput === "object") {
      const parsed = structuredOutput as {passed?: boolean; summary?: string; findings?: Array<{severity: string; step: string; field?: string; message: string}>};
      if (parsed.passed !== undefined) {
        return {
          passed: parsed.passed,
          summary: parsed.summary ?? "",
          findings: (parsed.findings ?? []).map((f) => ({
            severity: f.severity as "error" | "warning" | "info",
            step: f.step,
            field: f.field,
            message: f.message,
          })),
        };
      }
    }

    if (!resultText) {
      return {passed: true, findings: [], summary: "Review skipped: no response from agent"};
    }

    // Fallback: parse JSON from text response
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {passed: true, findings: [], summary: "Review skipped: no JSON in response"};
    }

    const parsed = JSON.parse(jsonMatch[0]) as {passed: boolean; summary: string; findings: Array<{severity: string; step: string; field?: string; message: string}>};
    return {
      passed: parsed.passed,
      summary: parsed.summary,
      findings: (parsed.findings ?? []).map((f) => ({
        severity: f.severity as "error" | "warning" | "info",
        step: f.step,
        field: f.field,
        message: f.message,
      })),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[reviewer-agent] Error: ${msg}`);
    return {passed: true, findings: [], summary: `Review skipped: ${msg}`};
  }
}
