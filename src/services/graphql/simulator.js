import { gql } from "@apollo/client";

export const GEN_MEM_SIMULATOR = gql`
  {
    testAccounts(first: 100, order: { id: DESC }) {
      nodes {
        id
      }
    }
  }
`;

export const JOIN_PLAN_SIMULATOR = gql`
  mutation joinPlanSimulator($dto: PlanJoinSimulateInput!) {
    simulateJoinPlan(dto: $dto) {
      id
      account {
        name
      }
    }
  }
`;

export const LOAD_PLANS_SIMULATOR = gql`
  {
    plans(first: 100, order: { id: DESC }) {
      nodes {
        id
        name
        account {
          name
        }
        status
        memberCount
        maxMember
      }
    }
  }
`;