#!/usr/bin/env node

import {loadQaConfig, type QaConfigInput} from "./config.js";
import {runScenarios, type RunOptions} from "./runner.js";
import {ALL_SCENARIOS} from "./scenarios/index.js";

function parseArgs(argv: string[]): {configInput: QaConfigInput; runOpts: RunOptions} {
  const configInput: QaConfigInput = {};
  const runOpts: RunOptions = {};

  const args = argv.slice(2);
  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    switch (arg) {
      case "--config":
        configInput.configPath = args[++i];
        break;
      case "--cli-bin":
        configInput.cliBin = args[++i];
        break;
      case "--filter":
        runOpts.filter = runOpts.filter ?? [];
        runOpts.filter.push(args[++i]);
        break;
      case "--tag":
        runOpts.tags = runOpts.tags ?? [];
        runOpts.tags.push(args[++i]);
        break;
      case "--skip-review":
        runOpts.skipReview = true;
        break;
      case "--bail":
        runOpts.bail = true;
        break;
      case "--reviewer-api-key":
        configInput.reviewerApiKey = args[++i];
        break;
      case "--reviewer-model":
        configInput.reviewerModel = args[++i];
        break;
      case "--indexer-timeout":
        configInput.indexerSyncTimeoutMs = parseInt(args[++i], 10);
        break;
      case "--local":
        configInput.isLocalChain = true;
        break;
      case "--testnet":
        configInput.isLocalChain = false;
        break;
      case "--list":
        listScenarios();
        process.exit(0);
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith("--wallet-")) {
          // --wallet-agent1 /path/to/agent1.env
          const role = arg.slice("--wallet-".length);
          const walletPath = args[++i];
          configInput.walletConfigs = configInput.walletConfigs ?? {};
          configInput.walletConfigs[role] = walletPath;
        } else {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
    }
    i++;
  }

  return {configInput, runOpts};
}

function listScenarios(): void {
  console.log("\nAvailable scenarios:\n");
  for (const s of ALL_SCENARIOS) {
    console.log(`  ${s.name}`);
    console.log(`    ${s.description}`);
    console.log(`    tags: [${s.tags.join(", ")}]`);
    console.log();
  }
}

function printHelp(): void {
  console.log(`
dac-qa — DAC Cloud E2E QA Runner

Usage:
  dac-qa [options]

Options:
  --config <path>          Path to config.env (default: ./config.env)
  --cli-bin <path>         Path to dac CLI binary (default: ./node_modules/.bin/dac)
  --filter <name>          Run scenarios matching name (can repeat)
  --tag <tag>              Run scenarios matching tag (can repeat)
  --skip-review            Skip agent reviewer
  --bail                   Stop on first failure
  --local                  Force local chain mode (enables time manipulation)
  --testnet                Force testnet mode (disables time manipulation)
  --indexer-timeout <ms>   Indexer sync timeout in ms (default: 30000)
  --reviewer-api-key <key> Anthropic API key for agent reviewer
  --reviewer-model <model> Reviewer model (default: claude-haiku-4-5-20251001)
  --wallet-<role> <path>   Extra wallet config file for role
  --list                   List available scenarios
  --help                   Show this help

Environment:
  ANTHROPIC_API_KEY        Anthropic API key for agent reviewer (alternative to --reviewer-api-key)

Examples:
  dac-qa --config ~/projects/dac/cli/config.env
  dac-qa --filter "existing-token" --bail
  dac-qa --tag deal --skip-review
  dac-qa --testnet --config ./sepolia.env --wallet-agent1 ./agent1.env
  dac-qa --list
`);
}

async function main(): Promise<void> {
  const {configInput, runOpts} = parseArgs(process.argv);

  try {
    const config = loadQaConfig(configInput);
    const results = await runScenarios(config, ALL_SCENARIOS, runOpts);

    const failed = results.some((r) => !r.passed);
    process.exit(failed ? 1 : 0);
  } catch (err) {
    console.error(`\nFatal: ${err instanceof Error ? err.message : err}`);
    process.exit(2);
  }
}

main();
