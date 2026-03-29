import {GraphQLClient} from "graphql-request";
import type {IndexerClientConfig, ListQueryArgs} from "./types";
import {
  GetAccountByAddressDocument,
  GetDacByAddressDocument,
  GetDacByIdDocument,
  GetDacProposalByProposalIdDocument,
  GetDealByAddressDocument,
  GetDealByIdDocument,
  GetDealProposalByProposalIdDocument,
  GetProposalByAddressDocument,
  GetProposalByIdDocument,
  ListCapitalCallsByDacDocument,
  ListDacProposalsByDacDocument,
  ListDacTreasuryDelegationsByDacDocument,
  ListDacsDocument,
  ListDealAgentPositionsByDealDocument,
  ListDealGovernanceAccountsByDealDocument,
  ListDealProposalsByDealDocument,
  ListDealRelatedContractsByDealDocument,
  ListDealsByDacDocument,
  ListGovernanceOraclesByDacDocument,
  ListProposalsByDacDocument,
  ListProposalsByDealDocument,
  ListTreasuryActionsByDealDocument,
  ListTreasuryHoldingsByDacDocument,
  ListTreasuryMovementsByDacDocument,
  ListWrapperActionsByDacDocument,
  type GetAccountByAddressQuery,
  type GetAccountByAddressQueryVariables,
  type GetDacByAddressQuery,
  type GetDacByAddressQueryVariables,
  type GetDacByIdQuery,
  type GetDacByIdQueryVariables,
  type GetDacProposalByProposalIdQuery,
  type GetDacProposalByProposalIdQueryVariables,
  type GetDealByAddressQuery,
  type GetDealByAddressQueryVariables,
  type GetDealByIdQuery,
  type GetDealByIdQueryVariables,
  type GetDealProposalByProposalIdQuery,
  type GetDealProposalByProposalIdQueryVariables,
  type GetProposalByAddressQuery,
  type GetProposalByAddressQueryVariables,
  type GetProposalByIdQuery,
  type GetProposalByIdQueryVariables,
  type ListCapitalCallsByDacQuery,
  type ListCapitalCallsByDacQueryVariables,
  type ListDacProposalsByDacQuery,
  type ListDacProposalsByDacQueryVariables,
  type ListDacTreasuryDelegationsByDacQuery,
  type ListDacTreasuryDelegationsByDacQueryVariables,
  type ListDacsQuery,
  type ListDacsQueryVariables,
  type ListDealAgentPositionsByDealQuery,
  type ListDealAgentPositionsByDealQueryVariables,
  type ListDealGovernanceAccountsByDealQuery,
  type ListDealGovernanceAccountsByDealQueryVariables,
  type ListDealProposalsByDealQuery,
  type ListDealProposalsByDealQueryVariables,
  type ListDealRelatedContractsByDealQuery,
  type ListDealRelatedContractsByDealQueryVariables,
  type ListDealsByDacQuery,
  type ListDealsByDacQueryVariables,
  type ListGovernanceOraclesByDacQuery,
  type ListGovernanceOraclesByDacQueryVariables,
  type ListProposalsByDacQuery,
  type ListProposalsByDacQueryVariables,
  type ListProposalsByDealQuery,
  type ListProposalsByDealQueryVariables,
  type ListTreasuryActionsByDealQuery,
  type ListTreasuryActionsByDealQueryVariables,
  type ListTreasuryHoldingsByDacQuery,
  type ListTreasuryHoldingsByDacQueryVariables,
  type ListTreasuryMovementsByDacQuery,
  type ListTreasuryMovementsByDacQueryVariables,
  type ListWrapperActionsByDacQuery,
  type ListWrapperActionsByDacQueryVariables,
} from "./generated/graphql";

function normalizeListArgs(args?: ListQueryArgs): {limit: number; offset: number} {
  return {
    limit: args?.limit ?? 25,
    offset: args?.offset ?? 0,
  };
}

function normalizeAddress(address: string): string {
  return address.toLowerCase();
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

  const client = {
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
          {address: normalizeAddress(address)},
        );
        return data.Dac[0] ?? null;
      },

      async list(args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListDacsQuery, ListDacsQueryVariables>(ListDacsDocument, {limit, offset});
        return data.Dac;
      },
    },

    deals: {
      async getById(id: string) {
        const data = await gql.request<GetDealByIdQuery, GetDealByIdQueryVariables>(GetDealByIdDocument, {id});
        return data.Deal[0] ?? null;
      },

      async getByAddress(address: string) {
        const normalized = normalizeAddress(address);
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

      async listRelatedContracts(dealId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListDealRelatedContractsByDealQuery, ListDealRelatedContractsByDealQueryVariables>(
          ListDealRelatedContractsByDealDocument,
          {dealId, limit, offset},
        );
        return data.DealRelatedContract;
      },

      async listGovernanceAccounts(dealId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListDealGovernanceAccountsByDealQuery, ListDealGovernanceAccountsByDealQueryVariables>(
          ListDealGovernanceAccountsByDealDocument,
          {dealId, limit, offset},
        );
        return data.DealGovernanceAccount;
      },

      async listAgentPositions(dealId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListDealAgentPositionsByDealQuery, ListDealAgentPositionsByDealQueryVariables>(
          ListDealAgentPositionsByDealDocument,
          {dealId, limit, offset},
        );
        return data.DealAgentPosition;
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
          {proposalAddress: normalizeAddress(proposalAddress)},
        );
        return data.Proposal[0] ?? null;
      },

      async getDacProposal(proposalId: string) {
        const data = await gql.request<GetDacProposalByProposalIdQuery, GetDacProposalByProposalIdQueryVariables>(
          GetDacProposalByProposalIdDocument,
          {proposalId},
        );
        return data.DacProposal[0] ?? null;
      },

      async getDealProposal(proposalId: string) {
        const data = await gql.request<GetDealProposalByProposalIdQuery, GetDealProposalByProposalIdQueryVariables>(
          GetDealProposalByProposalIdDocument,
          {proposalId},
        );
        return data.DealProposal[0] ?? null;
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

      async listDacProposalsByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListDacProposalsByDacQuery, ListDacProposalsByDacQueryVariables>(
          ListDacProposalsByDacDocument,
          {dacId, limit, offset},
        );
        return data.DacProposal;
      },

      async listDealProposalsByDeal(dealId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListDealProposalsByDealQuery, ListDealProposalsByDealQueryVariables>(
          ListDealProposalsByDealDocument,
          {dealId, limit, offset},
        );
        return data.DealProposal;
      },
    },

    accounts: {
      async getByAddress(address: string) {
        const data = await gql.request<GetAccountByAddressQuery, GetAccountByAddressQueryVariables>(
          GetAccountByAddressDocument,
          {address: normalizeAddress(address)},
        );
        return data.Account[0] ?? null;
      },
    },

    treasury: {
      async listCapitalCallsByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListCapitalCallsByDacQuery, ListCapitalCallsByDacQueryVariables>(
          ListCapitalCallsByDacDocument,
          {dacId, limit, offset},
        );
        return data.CapitalCall;
      },

      async listHoldingsByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListTreasuryHoldingsByDacQuery, ListTreasuryHoldingsByDacQueryVariables>(
          ListTreasuryHoldingsByDacDocument,
          {dacId, limit, offset},
        );
        return data.TreasuryHolding;
      },

      async listMovementsByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListTreasuryMovementsByDacQuery, ListTreasuryMovementsByDacQueryVariables>(
          ListTreasuryMovementsByDacDocument,
          {dacId, limit, offset},
        );
        return data.TreasuryMovement;
      },

      async listDelegationsByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListDacTreasuryDelegationsByDacQuery, ListDacTreasuryDelegationsByDacQueryVariables>(
          ListDacTreasuryDelegationsByDacDocument,
          {dacId, limit, offset},
        );
        return data.DacTreasuryDelegation;
      },

      async listActionsByDeal(dealId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListTreasuryActionsByDealQuery, ListTreasuryActionsByDealQueryVariables>(
          ListTreasuryActionsByDealDocument,
          {dealId, limit, offset},
        );
        return data.TreasuryAction;
      },
    },

    oracle: {
      async listByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListGovernanceOraclesByDacQuery, ListGovernanceOraclesByDacQueryVariables>(
          ListGovernanceOraclesByDacDocument,
          {dacId, limit, offset},
        );
        return data.GovernanceOracle;
      },
    },

    wrapper: {
      async listByDac(dacId: string, args?: ListQueryArgs) {
        const {limit, offset} = normalizeListArgs(args);
        const data = await gql.request<ListWrapperActionsByDacQuery, ListWrapperActionsByDacQueryVariables>(
          ListWrapperActionsByDacDocument,
          {dacId, limit, offset},
        );
        return data.WrapperAction;
      },
    },
  };

  return {
    ...client,
    capitalCalls: {
      listByDac: client.treasury.listCapitalCallsByDac,
    },
    treasuryActions: {
      listByDeal: client.treasury.listActionsByDeal,
    },
  };
}

export type IndexerClient = ReturnType<typeof createIndexerClient>;
