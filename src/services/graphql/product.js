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
    products(first: 100, order: { id: DESC }, where: { type: { in: $type } }) {
      nodes {
        id
        name
        isAvailable
        imageUrl
        price
        type
        partySize
        provider {
          id
        }
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
        imagePath
        type
        partySize
        periods
        description
      }
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation createProduct($dto: ProductCreateInput!) {
    createProduct(dto: $dto) {
      id
    }
  }
`;
