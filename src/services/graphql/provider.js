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

export const LOAD_DETAIL_SUPPLIER = gql`
  query GetSupplierById($id: Int!) {
    suppliers(where: { id: { eq: $id } }) {
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

export const GET_PRODUCT_BY_SUPPLIER = gql`
  query GetProductBySupplierId($id: Int!) {
    products(where: { provider: { id: { eq: $id } } }) {
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
