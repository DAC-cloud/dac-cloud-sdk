#!/usr/bin/env node
import {formatViemError} from "@dac-cloud/core";
import {Command} from "commander";
import {registerDacCommands} from "./actions/dac";
import {registerDealCommands} from "./actions/deal";
import {loadOptionResolver} from "./runtime/config";

function buildProgram(): Command {
  const program = new Command();

  program
    .name("dac")
    .description("DAC Cloud CLI")
    .showHelpAfterError()
    .option("--config <path>", "Path to .env config file")
    .option("--private-key <hex>", "EOA private key")
    .option("--chain-id <number>", "Chain id")
    .option("--rpc-url <url>", "RPC URL")
    .option("--contracts-root <path>", "Path to dac-cloud-contracts repo")
    .option("--indexer-url <url>", "Indexer GraphQL endpoint")
    .option("--cell-address <address>", "DACCell address")
    .option("--deal-id <id>", "Deal id in indexer")
    .option("--deal-address <address>", "Deal contract address")
    .option("--deal-cell <address>", "DealCell contract address")
    .option("--query-limit <number>", "Indexer query limit")
    .option("--query-offset <number>", "Indexer query offset")
    .option("--pre-vote-advance-seconds <number>", "Optional EVM time advance before voting")
    .option("--advance-seconds <number>", "Optional EVM time advance before execute")
    .option("--auto-delegate", "Auto-delegate after create/stake")
    .option("--auto-approve", "Auto-approve ERC20 allowance for join/deposit")
    .option("--delegatee <address>", "Vote delegate target")
    .option("--token <address>", "Token address")
    .option("--amount <uint256>", "Amount")
    .option("--nonce <uint256>", "Capital call nonce")
    .option("--recipient <address>", "Capital call recipient")
    .option("--treasury-token <address>", "Treasury token address")
    .option("--token-amount <uint256>", "Capital call token amount")
    .option("--cash-amount <uint256>", "Capital call cash amount")
    .option("--capital-call-nonce <uint256>", "Child capital call nonce (DACDeal tranche requests)")
    .option("--capital-call-hash <bytes32>", "Child capital call hash (DACDeal tranche requests)")
    .option("--evaluator-id <uint256>", "Deal evaluator id")
    .option("--input <path>", "JSON input file for complex proposal/message payloads")
    .option("--from-request", "For add-stake proposals: source amount from request allowance");

  const resolverFactory = loadOptionResolver;

  registerDacCommands(program, resolverFactory);
  registerDealCommands(program, resolverFactory);

  return program;
}

async function main(): Promise<void> {
  const program = buildProgram();
  await program.parseAsync(process.argv);
}

main().catch((error: unknown) => {
  const message = formatViemError(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
