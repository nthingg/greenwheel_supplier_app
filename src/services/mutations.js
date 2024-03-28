import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation createProduct($input: ProductCreateInput!) {
    createProduct(dto: $input) {
      id
      name
    }
  }
`;

export const JOIN_PLAN_SIMULATOR = gql`
  mutation joinPlanSimulator($plan: Int!, $traveler: Int!) {
    joinPlanSimulation(planId: $plan, travelerId: $traveler) {
      id
    }
  }
`;
