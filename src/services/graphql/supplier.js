import { gql } from "@apollo/client";

export const LOAD_SUPPLIERS_FILTER = gql`
  query LoadProviders($status: [ProviderType!]) {
    providers(
      first: 100
      order: { id: ASC }
      where: { type: { in: $status } }
    ) {
      nodes {
        id
        name
        phone
        address
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
