#!/usr/bin/env node
import {formatViemError} from "@dac-cloud/core";
import {Command} from "commander";
import {registerDacCommands} from "./actions/dac";
import {registerDealCommands} from "./actions/deal";
import {applyOptions, GLOBAL_OPTION_KEYS} from "./cli/options";
import {loadOptionResolver} from "./runtime/config";

function buildProgram(): Command {
  const program = new Command();

  program
    .name("dac")
    .description("DAC Cloud CLI")
    .showHelpAfterError();
  program.configureHelp({showGlobalOptions: true});
  applyOptions(program, GLOBAL_OPTION_KEYS);
  program.addHelpText("after", `
Config resolution order:
  1) CLI flags
  2) --config <path> (.env format)
  3) ./config.env
  4) process environment

Option keys support both plain and DAC_ prefixed env names.
Example: --rpc-url resolves from RPC_URL or DAC_RPC_URL.

Defaults:
  --chain-id 31337
  --rpc-url http://127.0.0.1:8545
  --indexer-url http://127.0.0.1:8080/v1/graphql
  --private-key anvil account #0

Dry-run mode:
  --dry-run --from <address>   Return unsigned tx data instead of broadcasting.
  Useful for managed wallets, multisig, and agent harnesses.

All command outputs are JSON. Bigint values are serialized as decimal strings.
`);

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
