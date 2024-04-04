import { gql } from "@apollo/client";

export const LOAD_ORDERS_FILTER = gql`
  query LoadOrders($status: [OrderStatus!]) {
    orders(
      first: 100
      order: { id: ASC }
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

export const LOAD_NUMBERS_CANCELLED = gql`
  {
    orders(first: 100, where: { currentStatus: { eq: CANCELLED } }) {
      nodes {
        id
      }
    }
  }
`;
export const LOAD_NUMBERS_TEMPORARY = gql`
  {
    orders(first: 100, where: { currentStatus: { eq: TEMPORARY } }) {
      nodes {
        id
      }
    }
  }
`;
export const LOAD_NUMBERS_RESERVED = gql`
  {
    orders(first: 100, where: { currentStatus: { eq: RESERVED } }) {
      nodes {
        id
      }
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
