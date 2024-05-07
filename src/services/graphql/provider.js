import { gql } from "@apollo/client";

export const LOAD_SUPPLIERS = gql`
  query {
    providers {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const LOAD_NUMBER_TYPE = gql`
  query ProviderType($type: ProviderType!, $searchTerm: String) {
    providers(where: { type: { eq: $type } }, searchTerm: $searchTerm) {
      totalCount
    }
  }
`;

export const LOAD_NUMBERS_TOTAL = gql`
  query NumOfTotalProvider($searchTerm: String) {
    providers(searchTerm: $searchTerm) {
      totalCount
    }
  }
`;

export const LOAD_PROVIDERS_TOTAL_INIT = gql`
  query LoadInitTotalProviders($searchTerm: String) {
    providers(first: 100, order: { id: DESC }, searchTerm: $searchTerm) {
      edges {
        node {
          id
          name
          phone
          address
          balance
          isActive
          account {
            isMale
            isActive
            createdAt
          }
          type
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const LOAD_PROVIDERS_TOTAL = gql`
  query LoadTotalProviders($searchTerm: String, $cursor: String) {
    providers(
      first: 100
      after: $cursor
      order: { id: DESC }
      searchTerm: $searchTerm
    ) {
      edges {
        node {
          id
          name
          phone
          address
          balance
          isActive
          account {
            isMale
            isActive
            createdAt
          }
          type
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const LOAD_SUPPLIERS_FILTER = gql`
  query LoadProviders($status: [ProviderType!], $searchTerm: String) {
    providers(
      first: 100
      order: { id: DESC }
      where: { type: { in: $status } }
      searchTerm: $searchTerm
    ) {
      nodes {
        id
        name
        phone
        address
        balance
        isActive
        account {
          isMale
          isActive
          createdAt
        }
      }
    }
  }
`;

export const LOAD_DETAIL_PROVIDER = gql`
  query GetProviderById($id: Int!) {
    providers(where: { id: { eq: $id } }) {
      nodes {
        id
        name
        phone
        address
        balance
        isActive
        imagePath
        type
        standard
        account {
          isMale
          isActive
          createdAt
        }
        coordinate {
          coordinates
        }
      }
    }
  }
`;

export const LOAD_DETAIL_STAFF = gql`
  query GetProviderById($id: Int!) {
    accounts(where: { id: { eq: $id } }) {
      nodes {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCT_BY_PROVIDER_FILTER = gql`
  query GetProductByProviderId(
    $id: Int!
    $type: [ProductType!]
    $searchTerm: String
  ) {
    products(
      order: { id: DESC }
      where: { provider: { id: { eq: $id } }, type: { in: $type } }
      searchTerm: $searchTerm
    ) {
      nodes {
        id
        name
        isAvailable
        price
        imagePath
        type
        partySize
        periods
        provider {
          id
          account {
            id
          }
        }
      }
    }
  }
`;

export const LOAD_PROVIDERS_OPTIONS = gql`
  query ProviderOptions {
    providers(
      first: 100
      order: { id: DESC }
      where: { orders: { any: true } }
    ) {
      nodes {
        id
        name
        phone
      }
      totalCount
    }
  }
`;

export const ADD_PROVIDER = gql`
  mutation createProvider($dto: ProviderCreateInput!) {
    createProvider(dto: $dto) {
      id
    }
  }
`;

export const UPDATE_PROVIDER = gql`
  mutation updateProvider($dto: ProviderUpdateInput!) {
    updateProvider(dto: $dto) {
      id
    }
  }
`;
