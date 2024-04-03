import { gql } from "@apollo/client";

export const LOAD_SUPPLIERS = gql`
  {
    suppliers(first: 100, order: { id: ASC }) {
      nodes {
        id
        name
        phone
        address
        imageUrl
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

export const LOAD_SUPPLIERS_FILTER = gql`
  query LoadProviders($status: [ProviderType!]) {
    providers(
      first: 100
      order: { id: ASC }
      where: { type: { in: $status } }
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

export const GET_PRODUCT_BY_PROVIDER_FILTER = gql`
  query GetProductByProviderId($id: Int!, $type: [ProductType!]) {
    products(where: { provider: { id: { eq: $id } }, type: { in: $type } }) {
      nodes {
        id
        name
        isAvailable
        price
        imagePath
        type
        partySize
        periods
      }
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
