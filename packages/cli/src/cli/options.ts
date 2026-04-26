import type {Command} from "commander";

interface CliOptionSpec {
  flags: string;
  description: string;
}

const OPTION_SPECS = {
  config: {flags: "--config <path>", description: "Path to .env config file"},
  "private-key": {flags: "--private-key <hex>", description: "EOA private key"},
  "chain-id": {flags: "--chain-id <number>", description: "Chain id"},
  "api-url": {flags: "--api-url <url>", description: "DAC Cloud backend API URL"},

  name: {flags: "--name <string>", description: "Name of the entity"},
  description: {flags: "--description <string>", description: "Description of the entity"},
  symbol: {flags: "--symbol <string>", description: "Symbol of the DAC tokens"},
  "underlying-token": {flags: "--underlying-token <address>", description: "Existing-token DAC underlying ERC-20"},
  "treasury-seed-amount": {flags: "--treasury-seed-amount <uint256>", description: "Initial wrapped treasury seed amount"},
  "governance-oracle": {flags: "--governance-oracle <address>", description: "Existing governance oracle address (required when oracle-primary mode is enabled). Use 0x0 for wrapped-only bootstrap."},
  commitment: {flags: "--commitment <uint256>", description: "Founder commitment (in treasury token)"},
  allocation: {flags: "--allocation <uint256>", description: "Founder allocation of main tokens"},
  "max-supply": {flags: "--max-supply <uint256>", description: "Max DAC main token supply"},
  "default-quorum": {flags: "--default-quorum <percent>", description: "Default DAC quorum (e.g. 50 for 50%)"},
  "quorum-percent": {flags: "--quorum-percent <percent>", description: "Governance quorum percent (e.g. 50 for 50%)"},
  "blocking-percent": {flags: "--blocking-percent <percent>", description: "Governance blocking quorum percent (e.g. 25 for 25%)"},
  "high-quorum-percent": {flags: "--high-quorum-percent <percent>", description: "Governance high quorum percent (e.g. 75 for 75%)"},
  "voting-duration": {flags: "--voting-duration <uint256>", description: "Governance voting duration in seconds"},
  qualification: {flags: "--qualification <percent>", description: "Proposal qualification threshold percent (e.g. 1 for 1%)"},
  "execution-validity-duration": {flags: "--execution-validity-duration <uint256>", description: "Execution validity duration in seconds"},
  "oracle-publish-deadline": {flags: "--oracle-publish-deadline <uint256>", description: "Hybrid oracle publish deadline in seconds"},
  "fallback-warmup-duration": {flags: "--fallback-warmup-duration <uint256>", description: "Hybrid fallback warmup duration in seconds"},
  "fallback-duration": {flags: "--fallback-duration <uint256>", description: "Hybrid fallback voting duration in seconds"},
  "blocking-on-all-proposals": {flags: "--blocking-on-all-proposals", description: "Apply blocking logic on all proposal types (hybrid, default: off)"},
  "blocking-on-high-quorum": {flags: "--blocking-on-high-quorum", description: "Apply blocking on high-quorum proposals (hybrid, default: off)"},
  "oracle-primary-enabled": {flags: "--oracle-primary-enabled", description: "Enable oracle-primary voting path (requires --governance-oracle, default: off)"},
  "dividends-enabled": {flags: "--dividends-enabled", description: "Enable dividends at DAC creation"},
  "defer-birth-role": {flags: "--defer-birth-role <address>", description: "Optional defer birth role address"},
  "referral-uid": {flags: "--referral-uid <string>", description: "Referral campaign UID (salt = keccak256(referral-uid)); random salt if omitted"},

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
  "auto-delegate": {flags: "--auto-delegate", description: "Auto-delegate after create/stake"},
  "auto-approve": {flags: "--auto-approve", description: "Auto-approve ERC20 allowance for join/deposit"},
  "grant-invite-right": {flags: "--grant-invite-right", description: "Grant the invitee rights to invite other agents"},
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
  "dry-run": {flags: "--dry-run", description: "Output unsigned transaction data instead of broadcasting"},
  "from": {flags: "--from <address>", description: "Sender address for dry-run mode (alternative to --private-key)"},
  "pretty-print": {flags: "--pretty-print", description: "Pretty-print JSON output (human-friendly, indented)"},
} satisfies Record<string, CliOptionSpec>;

export type OptionKey = keyof typeof OPTION_SPECS;

export const GLOBAL_OPTION_KEYS: OptionKey[] = [
  "config",
  "private-key",
  "chain-id",
  "api-url",
  "dry-run",
  "from",
  "pretty-print",
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
