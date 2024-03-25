import { gql } from "@apollo/client";

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
        coordinate {
          coordinates
        }
        emergencyContacts {
          imageUrl
          name
          phone
          address
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
          imageUrl
          name
          phone
          address
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
