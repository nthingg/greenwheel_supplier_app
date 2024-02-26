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

export const LOAD_PLANS_FILTER = gql`
  query LoadPlans($type: Boolean!) {
    plans(first: 100, order: { id: ASC }, where: { isPublic: { eq: $type } }) {
      nodes {
        id
        name
        account {
          name
        }
        memberCount
        destination {
          name
        }
        startDate
        isPublic
      }
    }
  }
`;

export const LOAD_ORDERS = gql`
  {
    orders(first: 100, order: { id: ASC }) {
      nodes {
        id
        total
        currentStatus
        createdAt
        account {
          name
          avatarUrl
        }
      }
    }
  }
`;

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
        account {
          name
          avatarUrl
        }
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

export const LOAD_DESTINATIONS = gql`
  {
    destinations(first: 100, order: { id: ASC }) {
      nodes {
        id
        name
        description
        imageUrls
        isVisible
        address
        emergencyContacts {
          name
          phone
          type
        }
        seasons
        topographic
        activities
        province {
          name
        }
        comments {
          comment
          createdAt
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

export const LOAD_DETAIL_PLAN = gql`
  query GetPlanById($id: Int!) {
    plans(where: { id: { eq: $id } }) {
      nodes {
        id
        name
        account {
          name
          phone
        }
        closeRegDate
        createdAt
        currentGcoinBudget
        isPublic
        memberCount
        memberLimit
        members {
          account {
            name
            phone
          }
          status
        }
        departDate
        departure {
          coordinates
        }
        destination {
          id
          name
          coordinate {
            coordinates
          }
        }
        endDate
        gcoinBudgetPerCapita
        orders {
          id
          total
          currentStatus
          createdAt
          account {
            name
            avatarUrl
          }
        }
        savedContacts {
          imageUrl
          name
          phone
          address
        }
        schedule {
          events {
            type
            shortDescription
            description
            duration
          }
        }
      }
    }
  }
`;

export const LOAD_DETAIL_ORDER = gql`
  query GetOrderById($id: UUID!) {
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
          isCustomerModification
          modifiedAt
          status
        }
        plan {
          startDate
        }
        serveDateIndexes
        details {
          product {
            supplier {
              id
              name
              address
            }
            id
            name
            imageUrl
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

export const LOAD_DETAIL_DESTINATION = gql`
  query GetDestinationById($id: Int!) {
    destinations(where: { id: { eq: $id } }) {
      nodes {
        id
        name
        description
        imageUrls
        isVisible
        address
        emergencyContacts {
          name
          phone
          type
        }
        seasons
        topographic
        activities
        province {
          name
        }
        comments {
          comment
          createdAt
          account {
            name
            avatarUrl
          }
        }
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


