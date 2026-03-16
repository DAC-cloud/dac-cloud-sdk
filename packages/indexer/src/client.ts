import type {IndexerClientConfig, ListQueryArgs} from "./types";
import {GraphQLClient} from "graphql-request";
import {
  GetDacByAddressDocument,
  GetDacByIdDocument,
  GetDealByAddressDocument,
  GetDealByIdDocument,
  GetProposalByAddressDocument,
  GetProposalByIdDocument,
  ListDacsDocument,
  ListCapitalCallsByDacDocument,
  ListDealsByDacDocument,
  ListProposalsByDacDocument,
  ListProposalsByDealDocument,
  ListTreasuryActionsByDealDocument,
  type GetDacByAddressQuery,
  type GetDacByAddressQueryVariables,
  type GetDacByIdQuery,
  type GetDacByIdQueryVariables,
  type GetDealByAddressQuery,
  type GetDealByAddressQueryVariables,
  type GetDealByIdQuery,
  type GetDealByIdQueryVariables,
  type GetProposalByAddressQuery,
  type GetProposalByAddressQueryVariables,
  type GetProposalByIdQuery,
  type GetProposalByIdQueryVariables,
  type ListDacsQuery,
  type ListDacsQueryVariables,
  type ListCapitalCallsByDacQuery,
  type ListCapitalCallsByDacQueryVariables,
  type ListDealsByDacQuery,
  type ListDealsByDacQueryVariables,
  type ListProposalsByDacQuery,
  type ListProposalsByDacQueryVariables,
  type ListProposalsByDealQuery,
  type ListProposalsByDealQueryVariables,
  type ListTreasuryActionsByDealQuery,
  type ListTreasuryActionsByDealQueryVariables,
} from "./generated/graphql";

function normalizeListArgs(args?: ListQueryArgs): {limit: number; offset: number} {
  return {
    limit: args?.limit ?? 25,
    offset: args?.offset ?? 0,
  };
}

export function createIndexerClient(config: IndexerClientConfig) {
  const timeoutMs = config.timeoutMs ?? 15_000;
  const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await (config.fetchFn ?? fetch)(input, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  };

  const gql = new GraphQLClient(config.url, {
    headers: config.headers,
    fetch: customFetch,
  });

  return {
    rawQuery<TData = unknown>(query: string, variables?: Record<string, unknown>): Promise<TData> {
      return gql.request<TData>(query as never, variables as never);
    },

    dacs: {
      async getById(id: string) {
        const data = await gql.request<GetDacByIdQuery, GetDacByIdQueryVariables>(GetDacByIdDocument, {id});
        return data.Dac[0] ?? null;
      },

      async getByAddress(address: string) {
        const data = await gql.request<GetDacByAddressQuery, GetDacByAddressQueryVariables>(
          GetDacByAddressDocument,
          {
            address: address.toLowerCase(),
          },
        );
        return data.Dac[0] ?? null;
      },

      async list(args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListDacsQuery, ListDacsQueryVariables>(ListDacsDocument, {
          limit,
          offset,
        });
        return data.Dac;
      },
    },

    deals: {
      async getById(id: string) {
        const data = await gql.request<GetDealByIdQuery, GetDealByIdQueryVariables>(GetDealByIdDocument, {id});
        return data.Deal[0] ?? null;
      },

      async getByAddress(address: string) {
        const normalized = address.toLowerCase();
        const data = await gql.request<GetDealByAddressQuery, GetDealByAddressQueryVariables>(
          GetDealByAddressDocument,
          {dealAddress: normalized, cellAddress: normalized},
        );
        return data.byDealAddress[0] ?? data.byCellAddress[0] ?? null;
      },

      async listByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListDealsByDacQuery, ListDealsByDacQueryVariables>(
          ListDealsByDacDocument,
          {dacId, limit, offset},
        );
        return data.Deal;
      },
    },

    proposals: {
      async getById(id: string) {
        const data = await gql.request<GetProposalByIdQuery, GetProposalByIdQueryVariables>(GetProposalByIdDocument, {id});
        return data.Proposal[0] ?? null;
      },

      async getByAddress(proposalAddress: string) {
        const data = await gql.request<GetProposalByAddressQuery, GetProposalByAddressQueryVariables>(
          GetProposalByAddressDocument,
          {proposalAddress: proposalAddress.toLowerCase()},
        );
        return data.Proposal[0] ?? null;
      },

      async listByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListProposalsByDacQuery, ListProposalsByDacQueryVariables>(
          ListProposalsByDacDocument,
          {dacId, limit, offset},
        );
        return data.Proposal;
      },

      async listByDeal(dealId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListProposalsByDealQuery, ListProposalsByDealQueryVariables>(
          ListProposalsByDealDocument,
          {dealId, limit, offset},
        );
        return data.Proposal;
      },
    },

    capitalCalls: {
      async listByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListCapitalCallsByDacQuery, ListCapitalCallsByDacQueryVariables>(
          ListCapitalCallsByDacDocument,
          {dacId, limit, offset},
        );
        return data.CapitalCall;
      },
    },

    treasuryActions: {
      async listByDeal(dealId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListTreasuryActionsByDealQuery, ListTreasuryActionsByDealQueryVariables>(
          ListTreasuryActionsByDealDocument,
          {dealId, limit, offset},
        );
        return data.TreasuryAction;
      },
    },
  };
}

export type IndexerClient = ReturnType<typeof createIndexerClient>;
