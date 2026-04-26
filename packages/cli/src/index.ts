#!/usr/bin/env node
import {formatViemError} from "@dac-cloud/core";
import {Command} from "commander";
import {registerDacCommands} from "./actions/dac";
import {registerDealCommands} from "./actions/deal";
import {registerAuthCommands} from "./auth/commands";
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
Example: --api-url resolves from API_URL or DAC_API_URL.

Defaults:
  --chain-id 31337
  --api-url https://api.dac.cloud
  --private-key anvil account #0

Authentication:
  dac auth login      Auto-login (requires private key in config)
  dac auth challenge  Request SIWE message for external signing
  dac auth verify     Complete auth with externally-signed message

Dry-run mode:
  --dry-run --from <address>   Return unsigned tx data instead of broadcasting.
  Requires a valid auth token (run 'dac auth challenge' + 'dac auth verify').

All command outputs are JSON. Bigint values are serialized as decimal strings.
`);

  const resolverFactory = loadOptionResolver;

  registerAuthCommands(program, resolverFactory);
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
  // Output structured JSON error to stdout so consumers always get parseable output
  const errorJson = JSON.stringify({error: message});
  process.stdout.write(`${errorJson}\n`);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
