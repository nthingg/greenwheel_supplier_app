import { gql } from "@apollo/client";

export const LOAD_ORDERS_FILTER = gql`
  query LoadOrders($status: [OrderStatus!]) {
    orders(
      first: 100
      order: { id: DESC }
      where: { currentStatus: { in: $status } }
    ) {
      nodes {
        id
        total
        currentStatus
        createdAt
        traces {
          status
          modifiedAt
        }
        provider {
          name
        }
        account {
          name
          phone
          avatarPath
        }
      }
    }
  }
`;

export const LOAD_ORDERS_FILTER_SEARCH = gql`
  query LoadOrders($status: [OrderStatus!], $id: Int) {
    orders(
      first: 100
      order: { id: DESC }
      where: { currentStatus: { in: $status }, id: { eq: $id } }
    ) {
      nodes {
        id
        total
        currentStatus
        createdAt
        traces {
          status
          modifiedAt
        }
        provider {
          name
        }
        account {
          name
          phone
          avatarPath
        }
      }
    }
  }
`;

export const LOAD_ORDERS = gql`
  {
    orders(first: 100, order: { id: ASC }) {
      nodes {
        id
        currentStatus
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
        currentStatus
        createdAt
        account {
          phone
          name
        }
        traces {
          description
          isClientAction
          modifiedAt
          status
        }
        plan {
          startDate
        }
        serveDates
        details {
          product {
            provider {
              id
              name
              address
            }
            id
            name
            imagePath
            price
          }
          quantity
          price
        }
        note
      }
    }
  }
`;

export const LOAD_NUMBERS_COMPLAINED = gql`
  {
    orders(where: { currentStatus: { eq: COMPLAINED } }) {
      edges {
        node {
          id
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
export const LOAD_NUMBERS_FINISHED = gql`
  {
    orders(where: { currentStatus: { eq: FINISHED } }) {
      edges {
        node {
          id
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
export const LOAD_NUMBERS_PREPARED = gql`
  {
    orders(where: { currentStatus: { eq: PREPARED } }) {
      edges {
        node {
          id
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

export const LOAD_NUMBERS_CANCELLED = gql`
  {
    orders(where: { currentStatus: { eq: CANCELLED } }) {
      edges {
        node {
          id
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
export const LOAD_NUMBERS_RESERVED = gql`
  {
    orders(where: { currentStatus: { eq: RESERVED } }) {
      edges {
        node {
          id
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
export const LOAD_NUMBERS_SERVED = gql`
  {
    orders(where: { currentStatus: { eq: SERVED } }) {
      edges {
        node {
          id
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

export const CANCEL_ORDER = gql`
  mutation cancel($input: OrderCancelInput!) {
    cancelOrder(dto: $input) {
      id
    }
  }
`;

export const CHANGE_STATUS_ORDER = gql`
  mutation changeStatus($input: OrderChangeStatusInput!) {
    changeOrderStatus(dto: $input) {
      id
    }
  }
`;
