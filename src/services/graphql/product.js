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