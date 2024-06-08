import { gql } from "@apollo/client";

export const LOAD_ANNOUNCEMENT = gql`
  {
    announcements(first: 40, order: { id: DESC }) {
      nodes {
        id
        body
        title
        provider {
          name
        }
        isRead
        order {
          id
        }
      }
    }
  }
`;

export const MARK_ALL_ANNOUNCE = gql`
  mutation markAll {
    markAllAnnouncementsAsRead
  }
`;

export const MARK_SINGLE_ANNOUNCE = gql`
  mutation markSingle($id: Int!) {
    markAnnouncementAsRead(announcementId: $id)
  }
`;
