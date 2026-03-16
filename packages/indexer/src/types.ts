export interface ListQueryArgs {
  limit?: number;
  offset?: number;
}

export interface IndexerClientConfig {
  url: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
}
