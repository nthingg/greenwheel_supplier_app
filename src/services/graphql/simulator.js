import { gql } from "@apollo/client";

export const GEN_MEM_SIMULATOR = gql`
  mutation joinPlanSimulator($dto: PlanJoinSimulateInput!) {
    joinPlanSimulate(dto: $dto) {
      id
    }
  }
`;

export const JOIN_PLAN_SIMULATOR = gql`
  mutation joinPlan($dto: PlanJoinInput!) {
    joinPlan(dto: $dto) {
      id
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
