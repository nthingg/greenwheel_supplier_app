import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($input: StaffAuthInput!) {
    staffRequestAuthorize(dto: $input) {
      accessToken
      refreshToken
    }
  }
`;
