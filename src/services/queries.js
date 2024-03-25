import { gql } from "@apollo/client";

export const LOAD_PRODUCTS = gql`
  {
    products(first: 100, order: { id: ASC }) {
      nodes {
        id
        name
        isAvailable
        imageUrl
        price
        type
      }
    }
  }
`;

export const LOAD_PRODUCTS_FILTER = gql`
  query LoadProducts($type: [ProductType!]) {
    products(first: 100, order: { id: ASC }, where: { type: { in: $type } }) {
      nodes {
        id
        name
        isAvailable
        imageUrl
        price
        type
        paymentType
        partySize
      }
    }
  }
`;

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

export const LOAD_TRAVELERS = gql`
  {
    travelers(first: 100) {
      nodes {
        id
        account {
          name
        }
        phone
      }
    }
  }
`;

export const LOAD_PROFILE = gql`
  {
    suppliers(where: { id: { eq: 3 } }) {
      nodes {
        name
        address
        thumbnailUrl
        type
        phone
      }
    }
  }
`;

export const LOAD_DETAIL_PRODUCT = gql`
  query GetProductById($id: Int!) {
    products(where: { id: { eq: $id } }) {
      nodes {
        id
        name
        isAvailable
        price
        imageUrl
        type
        partySize
        periods
        paymentType
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
        imageUrl
        balance
        isActive
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
    products(where: { supplier: { id: { eq: $id } } }) {
      nodes {
        id
        name
        isAvailable
        price
        imageUrl
        type
        partySize
        periods
        paymentType
        supplierId
      }
    }
  }
`;

export const FILTER_AVAILABLE_TRAVELER = gql`
  query FilterTraveler($ids: [Int]!) {
    travelers(first: 100, order: { id: DESC }, where: { id: { nin: $ids } }) {
      nodes {
        id
        account {
          name
        }
      }
    }
  }
`;
