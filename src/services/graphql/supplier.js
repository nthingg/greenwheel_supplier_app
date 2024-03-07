import { gql } from "@apollo/client";

export const LOAD_SUPPLIERS_FILTER = gql`
  query LoadSuppliers($status: [SupplierType!]) {
    suppliers(
      first: 100
      order: { id: ASC }
      where: { type: { in: $status } }
    ) {
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
