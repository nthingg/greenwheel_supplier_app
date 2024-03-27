import { gql } from "@apollo/client";

export const LOAD_PLANS_FILTER = gql`
  query LoadPlans($status: [PlanStatus!]) {
    plans(first: 100, order: { id: DESC }, where: { status: { in: $status } }) {
      nodes {
        id
        name
        account {
          name
        }
        destination {
          name
        }
        departAt
        startDate
        memberCount
        maxMember
        endDate
        status
      }
    }
  }
`;

export const LOAD_PLANS = gql`
  {
    plans(first: 100, order: { id: ASC }) {
      nodes {
        id
        status
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
          id
          name
          phone
        }
        regClosedAt
        createdAt
        currentGcoinBudget
        memberCount
        maxMember
        status
        departAt
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
        startDate
        endDate
        gcoinBudgetPerCapita
        members {
          account {
            name
            phone
          }
          weight
          status
        }
        orders {
          id
          total
          currentStatus
          createdAt
          account {
            id
            name
            avatarUrl
          }
          type
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

export const LOAD_NUMBERS_CANCELED = gql`
  {
    plans(first: 100, where: { status: { eq: CANCELED } }) {
      nodes {
        id
      }
    }
  }
`;

export const LOAD_NUMBERS_COMPLETED = gql`
  {
    plans(first: 100, where: { status: { eq: COMPLETED } }) {
      nodes {
        id
      }
    }
  }
`;

export const LOAD_NUMBERS_FLAWED = gql`
  {
    plans(first: 100, where: { status: { eq: FLAWED } }) {
      nodes {
        id
      }
    }
  }
`;

export const LOAD_NUMBERS_PENDING = gql`
  {
    plans(first: 100, where: { status: { eq: PENDING } }) {
      nodes {
        id
      }
    }
  }
`;

export const LOAD_NUMBERS_READY = gql`
  {
    plans(first: 100, where: { status: { eq: READY } }) {
      nodes {
        id
      }
    }
  }
`;

export const LOAD_NUMBERS_REGISTERING = gql`
  {
    plans(first: 100, where: { status: { eq: REGISTERING } }) {
      nodes {
        id
      }
    }
  }
`;
