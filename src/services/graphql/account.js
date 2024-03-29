import { gql } from "@apollo/client";

export const LOAD_ACCOUNTS_FILTER = gql`
  query LoadAccounts($role: [Role!]) {
    accounts(first: 100, order: { id: ASC }, where: { role: { in: $role } }) {
      nodes {
        id
        name
        phone
        email
        avatarUrl
        isMale
        isActive
        prestigeScore
        supplier {
          imageUrl
          name
        }
      }
    }
  }
`;

export const LOAD_ACCOUNTS = gql`
  {
    accounts(first: 100, order: { id: ASC }) {
      nodes {
        id
        role
      }
    }
  }
`;

export const LOAD_DETAIL_ACCOUNT = gql`
  query GetAccountById($id: Int!) {
    accounts(where: { id: { eq: $id } }) {
      nodes {
        id
        name
        prestigeScore
        isMale
        avatarUrl
        phone
        email
        isActive
        plans {
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
          maxMember
          memberCount
          endDate
          status
        }
      }
    }
  }
`;

export const LOAD_ACCOUNTS_TRAVELER = gql`
  {
    accounts(
      first: 100
      order: { id: ASC }
      where: { role: { eq: TRAVELER } }
    ) {
      nodes {
        id
        role
      }
    }
  }
`;
