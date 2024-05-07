import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($input: StaffAuthInput!) {
    staffRequestAuthorize(dto: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const REFRESH_AUTH = gql`
  mutation refresh($token: String!) {
    refreshAuth(refreshToken: $token) {
      accessToken
      refreshToken
      deviceToken
    }
  }
`;
