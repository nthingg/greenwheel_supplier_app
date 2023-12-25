import { gql } from "@apollo/client";

export const LOAD_PRODUCTS = gql`
  {
    products(first: 100) {
      nodes {
        id
        name
        status
        thumbnailUrl
        price
        type
      }
    }
  }
`;

export const LOAD_TRANSACTIONS = gql`
  {
    orders(first: 100, order: { id: DESC }) {
      nodes {
        id
        total
        statusLog {
          modifiedAt
          status
        }
        traveler {
          account {
            name
            avatarUrl
          }
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

export const LOAD_DETAIL_ORDER = gql`
  query GetOrderById($id: Int!) {
    orders(where: { id: { eq: $id } }) {
      nodes {
        id
        total
        deposit
        period
        servingDates
        statusLog {
          modifiedAt
          status
          description
        }
        traveler {
          phone
          account {
            name
          }
        }
        details {
          product {
            supplier {
              name
              type
              address
            }
            id
            name
            thumbnailUrl
            price
          }
          quantity
          price
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
        status
        price
        thumbnailUrl
        type
        partySize
        periods
        paymentType
      }
    }
  }
`;

export const LOAD_PLANS = gql`
  {
    plans(first: 100, order: { id: DESC }) {
      nodes {
        id
        members(where: { status: { eq: JOINED } }) {
          travelerId
        }
        status
        memberLimit
        joinMethod
        startDate
        endDate
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
