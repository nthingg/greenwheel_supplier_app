import { gql } from "@apollo/client";

export const GEN_MEM_SIMULATOR = gql`
  {
    testAccounts(last: 4, order: { id: DESC }) {
      nodes {
        id
        name
        phone
      }
    }
  }
`;

export const JOIN_PLAN_SIMULATOR = gql`
 mutation joinPlanSimulator($dto: PlanJoinInput!) {
    joinPlan(dto: $dto) {
      id
      plan {
        name
      }
      account {
        name
      }
    }
  }
`;

export const LOAD_PLANS_SIMULATOR = gql`
  query LoadPlans($id: Int!) {
    plans(first: 20, order: { id: DESC }, where: {account: {id: {eq: $id}}}) {
      nodes {
        id
        name
        account {
          name
        }
        members {
          id 
          status
          account {
            name
          }
        }
        status
        memberCount
        maxMember
        joinMethod
      }
    }
  }
`;

export const CREATE_PLAN_SIMULATOR = gql`
  mutation createPlan($dto: PlanCreateInput!) {
    createPlan(dto: $dto) {
      id
      name
      account {
        name
      }
    }
  }
`;

export const CHANGE_JOIN_METHOD_SIMULATOR = gql`
  mutation updateJoinMethodSimulator($dto: JoinMethodUpdateInput!) {
    changePlanJoinMethod(dto: $dto) {
      id
      name
      joinMethod
    }
  }
`;

export const CONFIRM_PLAN_SIMULATOR = gql`
 mutation confirmMembers($dto: Int!) {
    confirmMembers(planId: $dto) {
      id
      name
    }
  }
`;

export const LOAD_REGISTERING_PLANS_SIMULATOR =
  `query plan($id: Int!) {
    plans(first: 10, where: {
      accountId: {
        eq: $id
      }
      status: {
        eq: REGISTERING
      }
    })
    {
      nodes {
        id
      }
    }
  }
`;

export const ORDER_SIMULATOR =
  `mutation orderPlan($dto: OrderCreateInput!) {
    createOrder(dto: $dto) {
      id
    }
  }
`;