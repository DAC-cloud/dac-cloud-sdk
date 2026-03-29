import type {Command} from "commander";

interface CliOptionSpec {
  flags: string;
  description: string;
}

const OPTION_SPECS = {
  config: {flags: "--config <path>", description: "Path to .env config file"},
  "private-key": {flags: "--private-key <hex>", description: "EOA private key"},
  "chain-id": {flags: "--chain-id <number>", description: "Chain id"},
  "rpc-url": {flags: "--rpc-url <url>", description: "RPC URL"},
  "contracts-root": {flags: "--contracts-root <path>", description: "Path to dac-cloud-contracts repo"},
  "indexer-url": {flags: "--indexer-url <url>", description: "Indexer GraphQL endpoint"},

  name: {flags: "--name <string>", description: "Name of the entity"},
  description: {flags: "--description <string>", description: "Description of the entity"},
  symbol: {flags: "--symbol <string>", description: "Symbol of the DAC tokens"},
  "underlying-token": {flags: "--underlying-token <address>", description: "Existing-token DAC underlying ERC-20"},
  "treasury-seed-amount": {flags: "--treasury-seed-amount <uint256>", description: "Initial wrapped treasury seed amount"},
  "oracle-admin": {flags: "--oracle-admin <address>", description: "Governance oracle admin address"},
  "initial-oracle-publisher": {flags: "--initial-oracle-publisher <address>", description: "Initial governance oracle publisher"},
  commitment: {flags: "--commitment <uint256>", description: "Founder commitment (in treasury token)"},
  allocation: {flags: "--allocation <uint256>", description: "Founder allocation of main tokens"},
  "max-supply": {flags: "--max-supply <uint256>", description: "Max DAC main token supply"},
  "default-quorum": {flags: "--default-quorum <uint256>", description: "Default DAC quorum"},
  "quorum-percent": {flags: "--quorum-percent <uint256>", description: "Governance quorum percent"},
  "blocking-percent": {flags: "--blocking-percent <uint256>", description: "Governance blocking quorum percent"},
  "high-quorum-percent": {flags: "--high-quorum-percent <uint256>", description: "Governance high quorum percent"},
  "voting-duration": {flags: "--voting-duration <uint256>", description: "Governance voting duration in seconds"},
  qualification: {flags: "--qualification <uint256>", description: "Proposal qualification threshold"},
  "execution-validity-duration": {flags: "--execution-validity-duration <uint256>", description: "Execution validity duration in seconds"},
  "oracle-publish-deadline": {flags: "--oracle-publish-deadline <uint256>", description: "Hybrid oracle publish deadline in seconds"},
  "fallback-warmup-duration": {flags: "--fallback-warmup-duration <uint256>", description: "Hybrid fallback warmup duration in seconds"},
  "fallback-duration": {flags: "--fallback-duration <uint256>", description: "Hybrid fallback voting duration in seconds"},
  "dividends-enabled": {flags: "--dividends-enabled", description: "Enable dividends at DAC creation"},
  "defer-birth-role": {flags: "--defer-birth-role <address>", description: "Optional defer birth role address"},

  "dac-id": {flags: "--dac-id <id>", description: "DAC id in indexer"},
  "cell-address": {flags: "--cell-address <address>", description: "DACCell address"},
  "dac-address": {flags: "--dac-address <address>", description: "Alias for DACCell address"},
  dac: {flags: "--dac <address>", description: "Alias for DACCell address"},
  "deal-id": {flags: "--deal-id <id>", description: "Deal id in indexer"},
  "deal-address": {flags: "--deal-address <address>", description: "Deal contract address"},
  deal: {flags: "--deal <address>", description: "Alias for deal contract address"},
  "deal-cell": {flags: "--deal-cell <address>", description: "DealCell contract address"},
  id: {flags: "--id <id>", description: "Generic id alias for view commands"},
  address: {flags: "--address <address>", description: "Generic address alias for view commands"},
  limit: {flags: "--limit <number>", description: "Alias for query limit"},
  offset: {flags: "--offset <number>", description: "Alias for query offset"},
  "query-limit": {flags: "--query-limit <number>", description: "Indexer query limit"},
  "query-offset": {flags: "--query-offset <number>", description: "Indexer query offset"},
  "pre-vote-advance-seconds": {flags: "--pre-vote-advance-seconds <number>", description: "Optional EVM time advance before voting"},
  "advance-seconds": {flags: "--advance-seconds <number>", description: "Optional EVM time advance before execute"},
  "auto-delegate": {flags: "--auto-delegate", description: "Auto-delegate after create/stake"},
  "auto-approve": {flags: "--auto-approve", description: "Auto-approve ERC20 allowance for join/deposit"},
  delegatee: {flags: "--delegatee <address>", description: "Vote delegate target"},
  token: {flags: "--token <address>", description: "Token address"},
  amount: {flags: "--amount <uint256>", description: "Amount"},
  nonce: {flags: "--nonce <uint256>", description: "Capital call nonce"},
  recipient: {flags: "--recipient <address>", description: "Capital call recipient"},
  "treasury-token": {flags: "--treasury-token <address>", description: "Treasury token address"},
  "token-amount": {flags: "--token-amount <uint256>", description: "Capital call token amount"},
  "cash-amount": {flags: "--cash-amount <uint256>", description: "Capital call cash amount"},
  "capital-call-nonce": {flags: "--capital-call-nonce <uint256>", description: "Child capital call nonce (DACDeal tranche requests)"},
  "capital-call-hash": {flags: "--capital-call-hash <bytes32>", description: "Child capital call hash (DACDeal tranche requests)"},
  "evaluator-id": {flags: "--evaluator-id <uint256>", description: "Deal evaluator id"},
  "stake-token": {flags: "--stake-token <address>", description: "Deal stake token override"},
  input: {flags: "--input <path>", description: "JSON input file for complex proposal/message payloads"},
  "from-request": {flags: "--from-request", description: "For add-stake proposals: source amount from request allowance"},
} satisfies Record<string, CliOptionSpec>;

export type OptionKey = keyof typeof OPTION_SPECS;

export const GLOBAL_OPTION_KEYS: OptionKey[] = [
  "config",
  "private-key",
  "chain-id",
  "rpc-url",
  "contracts-root",
  "indexer-url",
];

export interface RequirementSpec {
  mode: "allOf" | "oneOf";
  options: OptionKey[];
  label?: string;
}

export interface CommandHelpSpec {
  requirements?: RequirementSpec[];
  notes?: string[];
  examples?: string[];
}

function longFlag(flags: string): string {
  const parts = flags.split(/[ ,|]+/);
  const found = parts.find((entry) => entry.startsWith("--"));
  if (!found) {
    throw new Error(`Option flags missing long form: ${flags}`);
  }
  return found;
}

function formatFlags(options: OptionKey[], joiner: string): string {
  return options
    .map((key) => `\`${longFlag(OPTION_SPECS[key].flags)}\``)
    .join(joiner);
}

function formatRequirement(requirement: RequirementSpec): string {
  const label = requirement.label ? `${requirement.label}: ` : "";
  if (requirement.mode === "allOf") {
    return `${label}${formatFlags(requirement.options, ", ")} (all required)`;
  }
  return `${label}${formatFlags(requirement.options, " | ")} (provide one)`;
}

export function applyOptions(command: Command, optionKeys: OptionKey[]): void {
  const seen = new Set<OptionKey>();
  for (const key of optionKeys) {
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    const spec = OPTION_SPECS[key];
    command.option(spec.flags, spec.description);
  }
}

export function addCommandHelp(command: Command, spec: CommandHelpSpec): void {
  const lines: string[] = [];

  if (spec.requirements && spec.requirements.length > 0) {
    lines.push("Resolved requirements:");
    for (const requirement of spec.requirements) {
      lines.push(`  - ${formatRequirement(requirement)}`);
    }
  }

  if (spec.notes && spec.notes.length > 0) {
    if (lines.length > 0) {
      lines.push("");
    }
    lines.push("Notes:");
    for (const note of spec.notes) {
      lines.push(`  - ${note}`);
    }
  }

  if (spec.examples && spec.examples.length > 0) {
    if (lines.length > 0) {
      lines.push("");
    }
    lines.push("Examples:");
    for (const example of spec.examples) {
      lines.push(`  ${example}`);
    }
  }

  if (lines.length > 0) {
    command.addHelpText("after", `\n${lines.join("\n")}\n`);
  }
}
