import { gql } from "@apollo/client";

export const LOAD_ORDERS_FILTER_INIT = gql`
  query LoadOrdersInit($status: [OrderStatus!]) {
    orders(
      first: 100
      order: { id: DESC }
      where: { currentStatus: { in: $status } }
    ) {
      edges {
        node {
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
            account {
              id
            }
          }
          account {
            name
            phone
            avatarPath
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const LOAD_ORDERS_FILTER = gql`
  query LoadOrders($status: [OrderStatus!], $cursor: String) {
    orders(
      first: 100
      after: $cursor
      order: { id: DESC }
      where: { currentStatus: { in: $status } }
    ) {
      edges {
        node {
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
            account {
              id
            }
          }
          account {
            name
            phone
            avatarPath
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const LOAD_ORDERS_FILTER_SEARCH = gql`
  query LoadOrdersSearch($status: [OrderStatus!], $id: Int) {
    orders(where: { currentStatus: { in: $status }, id: { eq: $id } }) {
      edges {
        node {
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
            account {
              id
            }
          }
          account {
            name
            phone
            avatarPath
          }
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
          utcStartAt
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
          total
          date
        }
        note
      }
    }
  }
`;

export const LOAD_NUMBERS_ORDERS = gql`
  query OrderType($status: OrderStatus) {
    orders(where: { currentStatus: { eq: $status } }) {
      totalCount
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

export const SEND_CANCEL_OTP = gql`
  mutation SendCancelOTP($input: OrderCancelOTPInput!) {
    orderCancelOTP(dto: $input)
  }
`

export const CANCEL_ORDER = gql`
  mutation cancel($input: OrderCancelInput!) {
    cancelOrder(dto: $input) {
      id
    }
  }
`;

export const PREPARE_ORDER = gql`
  mutation prepOrder($id: Int!) {
    prepareOrder(orderId: $id) {
      id
    }
  }
`;
