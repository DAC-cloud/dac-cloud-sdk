export interface QaConfig {
  /** Path to dac CLI binary */
  cliBin: string;
  /** Path to base config.env file */
  configPath: string;
  /** RPC URL (for direct JSON-RPC calls like evm_mine, evm_increaseTime) */
  rpcUrl: string;
  /** Indexer GraphQL URL */
  indexerUrl: string;
  /** Chain ID */
  chainId: number;
  /** Private keys for multi-wallet scenarios, keyed by role name */
  wallets: Record<string, WalletConfig>;
  /** Contracts root path (for manifest loading) */
  contractsRoot: string;
  /** Max time (ms) to wait for indexer to sync after a tx (default: 30000) */
  indexerSyncTimeoutMs: number;
  /** Polling interval (ms) for indexer sync (default: 1000) */
  indexerPollIntervalMs: number;
  /** Whether this is a local Hardhat chain (enables time manipulation) */
  isLocalChain: boolean;
  /** Agent reviewer config (optional) */
  reviewer?: ReviewerConfig;
}

export interface WalletConfig {
  privateKey: string;
  address: string;
  label: string;
}

export interface ReviewerConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface CliResult {
  /** Parsed JSON output from the CLI */
  data: Record<string, unknown>;
  /** Raw stdout */
  stdout: string;
  /** Raw stderr */
  stderr: string;
  /** Exit code */
  exitCode: number;
  /** Execution time in ms */
  durationMs: number;
}

export interface StepResult {
  /** Step label */
  label: string;
  /** CLI command that was run */
  command: string[];
  /** CLI output */
  cli: CliResult;
  /** Indexer state snapshot taken after the step (if requested) */
  indexerSnapshot?: Record<string, unknown>;
  /** Hard assertion results */
  assertions: AssertionResult[];
  /** Step timestamp */
  timestamp: string;
}

export interface AssertionResult {
  label: string;
  passed: boolean;
  expected?: unknown;
  actual?: unknown;
  message?: string;
}

export interface ScenarioResult {
  name: string;
  tags: string[];
  steps: StepResult[];
  passed: boolean;
  durationMs: number;
  error?: string;
  /** Agent review findings (populated after scenario completes) */
  review?: ReviewResult;
}

export interface ReviewResult {
  passed: boolean;
  findings: ReviewFinding[];
  summary: string;
}

export interface ReviewFinding {
  severity: "error" | "warning" | "info";
  step: string;
  field?: string;
  message: string;
}

export interface Scenario {
  name: string;
  description: string;
  tags: string[];
  run(harness: Harness): Promise<void>;
}

export interface Harness {
  config: QaConfig;
  /** Run a CLI command and return parsed output */
  cli(args: string[], opts?: CliOpts): Promise<CliResult>;
  /** Run CLI with a specific wallet role */
  cliAs(role: string, args: string[], opts?: CliOpts): Promise<CliResult>;
  /** Advance EVM time (local chain only) */
  advanceTime(seconds: number): Promise<void>;
  /** Mine a block (local chain only) */
  mineBlock(): Promise<void>;
  /** Wait for indexer to index up to a given block or just settle */
  syncIndexer(opts?: {timeoutMs?: number}): Promise<void>;
  /** Query indexer via CLI view command */
  view(resource: string, args: string[], opts?: CliOpts): Promise<CliResult>;
  /** Query indexer via CLI deal view command */
  dealView(resource: string, args: string[], opts?: CliOpts): Promise<CliResult>;
  /** Assert a condition — records result, throws on failure */
  assert: AssertApi;
  /** Record a step for the scenario log */
  recordStep(step: StepResult): void;
  /** Get all recorded steps */
  getSteps(): StepResult[];
  /** Log a message to the scenario output */
  log(message: string): void;
}

export interface CliOpts {
  /** Override config path */
  configPath?: string;
  /** Extra CLI flags as key-value pairs */
  flags?: Record<string, string | boolean>;
  /** Timeout in ms (default: 60000) */
  timeoutMs?: number;
  /** Don't throw on non-zero exit */
  allowFailure?: boolean;
}

export interface AssertApi {
  equal(actual: unknown, expected: unknown, label?: string): void;
  notEqual(actual: unknown, expected: unknown, label?: string): void;
  truthy(value: unknown, label?: string): void;
  falsy(value: unknown, label?: string): void;
  gt(actual: bigint | number, expected: bigint | number, label?: string): void;
  gte(actual: bigint | number, expected: bigint | number, label?: string): void;
  includes(haystack: string, needle: string, label?: string): void;
  match(value: string, pattern: RegExp, label?: string): void;
  defined(value: unknown, label?: string): void;
  isAddress(value: unknown, label?: string): void;
  deepIncludes(obj: Record<string, unknown>, subset: Record<string, unknown>, label?: string): void;
}
