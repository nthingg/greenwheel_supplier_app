import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($input: StaffAuthorizeInput!) {
    authorize(model: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation cancel($input: OrderCancelInput!) {
    cancelOrder(dto: $input) {
      id
    }
  }
`;

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
