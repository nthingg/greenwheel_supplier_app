import { gql } from "@apollo/client";

export const LOAD_DETAIL_DESTINATION = gql`
  query GetDestinationById($id: Int!) {
    destinations(where: { id: { eq: $id } }) {
      nodes {
        id
        name
        description
        imagePaths
        isVisible
        address
        coordinate {
          coordinates
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
        imagePaths
        isVisible
        address
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
          }
        }
      }
    }
  }
`;
