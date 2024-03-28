import { gql } from "@apollo/client";

export const GEN_MEM_SIMULATOR = gql`
  {
    accounts(where: { name: { startsWith: "test-account" } }) {
      nodes {
        id
        name
        phone
      }
    }
  }
`;

export const REQUEST_OTP_SIMULATOR = gql`
  mutation requestOTP($dto: TravelerRequestOTPInput!) {
    travelerRequestOTP(dto: $dto)
  }
`;

export const REQUEST_AUTH_SIMULATOR = gql`
  mutation auth($dto: TravelerAuthInput!) {
    travelerRequestAuthorize(dto: $dto) {
      accessToken
      refreshToken
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
    plans(
      first: 20
      order: { id: DESC }
      where: { account: { id: { eq: $id } } }
    ) {
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

export const LOAD_PLANS_BY_ID_SIMULATOR = gql`
  query LoadPlans($id: Int!) {
    plans(first: 20, order: { id: DESC }, where: { id: { eq: $id } }) {
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

export const LOAD_REGISTERING_PLANS_SIMULATOR = gql`
  query plan($id: Int!) {
    plans(
      first: 10
      where: { accountId: { eq: $id }, status: { eq: REGISTERING } }
    ) {
      nodes {
        id
      }
    }
  }
`;

export const ORDER_CREATE_SIMULATOR = gql`
  mutation createNewOrder($dto: OrderCreateInput!) {
    createOrder(dto: $dto) {
      type
    }
  }
`;

export const INVITE_PLANS_SIMULATOR = gql`
  mutation inviteToPlan($dto: PlanInviteInput!) {
    inviteToPlan(dto: $dto) {
      id
    }
  }
`;

export const SET_TIME_SIMULATOR = gql`
  mutation setTime($time: DateTime!) {
    setSystemTime(time: $time)
  }
`;
