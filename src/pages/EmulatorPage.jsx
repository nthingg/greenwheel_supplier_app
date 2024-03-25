import { useEffect, useState } from "react";
import "../assets/scss/emulator.scss";
import "../assets/scss/shared.scss";
import Select from "react-select";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useMutation, useQuery } from "@apollo/client";
import { Alert, Snackbar, TextField } from "@mui/material";
import {
  CHANGE_JOIN_METHOD_SIMULATOR,
  CONFIRM_PLAN_SIMULATOR,
  CREATE_PLAN_SIMULATOR,
  GEN_MEM_SIMULATOR,
  INVITE_PLANS_SIMULATOR,
  JOIN_PLAN_SIMULATOR,
  LOAD_PLANS_BY_ID_SIMULATOR,
  LOAD_PLANS_SIMULATOR,
  ORDER_CREATE_SIMULATOR,
  SET_TIME_SIMULATOR,
} from "../services/graphql/simulator";
import { GraphQLError } from "graphql";
import { onError } from "@apollo/client/link/error";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../services/firebase/setup";
import { jwtDecode } from "jwt-decode";
import { planData } from "../services/constant/plans";
import { companionData } from "../services/constant/companions";

const EmulatorPage = () => {
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMsg, setErrMsg] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [responseMsg, setResponseMsg] = useState([]);
  const [loadingState, setLoading] = useState(true);
  const [selectState, setSelectLoading] = useState(true);
  const [ini, setIni] = useState(true);
  const [selectedSimulator, setSelectedSimulator] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [idInputVisible, setIdInputVisible] = useState(false);
  const [joinId, setJoinId] = useState(0);
  const [dateVisible, setDateVisible] = useState(false);
  const [dateSimulator, setDateSimulator] = useState("");

  useEffect(() => {
    const loggedAcc = JSON.parse(localStorage.getItem("loggedAcc"));
    if (loggedAcc) {
      setLoading(false);
    }
    setIsEnabled(!loadingState && !selectState);
  }, [loadingState, selectState]);

  const emulatorOptions = [
    {
      value: 0,
      label: "Giả lập tham gia kế hoạch theo ID.",
    },
    { value: 1, label: "Giả lập tạo kế hoạch." },
    {
      value: 2,
      label: "Giả lập trưởng nhóm tham gia kế hoạch.",
    },
    {
      value: 3,
      label: "Giả lập phượt thủ tham gia kế hoạch.",
    },
    {
      value: 4,
      label: "Giả lập chốt kế hoạch.",
    },
    {
      value: 5,
      label: "Giả lập đặt hàng cho kế hoạch.",
    },
    {
      value: 6,
      label: "Giả lập chỉnh sửa thời gian hệ thống.",
    },
  ];

  const handleClick = () => {
    setSnackbarOpen(true);
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const [planConfirm, { data: dataConfirm, error: errorConfirm }] = useMutation(
    CONFIRM_PLAN_SIMULATOR
  );

  const { error, loading, data, refetch } = useQuery(GEN_MEM_SIMULATOR);

  const {
    error: errorLoadPlans,
    loading: loadingLoadPlans,
    data: dataLoadPlans,
    refetch: refetchLoadPlans,
  } = useQuery(LOAD_PLANS_SIMULATOR, {
    variables: {
      id: 0,
    },
  });

  const {
    error: errorLoadPlansId,
    loading: loadingLoadPlansId,
    data: dataLoadPlansId,
    refetch: refetchLoadPlansById,
  } = useQuery(LOAD_PLANS_BY_ID_SIMULATOR, {
    variables: {
      id: 0,
    },
  });

  const [join, { data: dataJoin, error: errorJoin }] =
    useMutation(JOIN_PLAN_SIMULATOR);

  const [invite, { data: dataInvite, error: errorInvite }] = useMutation(
    INVITE_PLANS_SIMULATOR
  );

  const [setTime, { data: dataSetTime, error: errorSetTime }] =
    useMutation(SET_TIME_SIMULATOR);

  const [changeJoinMethod, { data: dataJoinMethod, error: errorJoinMethod }] =
    useMutation(CHANGE_JOIN_METHOD_SIMULATOR);

  const [create, { data: dataCreate, error: errorCreate }] = useMutation(
    CREATE_PLAN_SIMULATOR
  );

  const [createOrder, { data: dataOrder, error: errorOrder }] = useMutation(
    ORDER_CREATE_SIMULATOR
  );

  const handleCreatePlan = async (plan, count, acc) => {
    try {
      const { data } = await create({
        variables: {
          dto: {
            departAt: plan.departAt,
            departure: plan.departure,
            destinationId: plan.destinationId,
            gcoinBudgetPerCapita: plan.gcoinBudgetPerCapita,
            maxMember: plan.maxMember,
            maxMemberWeight: plan.maxMemberWeight,
            departureAddress: plan.departureAddress,
            name: plan.name + count,
            note: plan.note,
            periodCount: plan.periodCount,
            savedContacts: plan.savedContacts,
            schedule: plan.schedule,
            surcharges: plan.surcharges,
            tempOrders: plan.tempOrders,
            travelDuration: plan.travelDuration,
          },
        },
      });
      const response = {
        userName: acc.name,
        action: "Tạo kế hoạch",
        detail: `[${acc.name}] tạo kế hoạch [${plan.name + count}]`,
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Tạo kế hoạch",
        detail: `${msg}`,
        status: false,
        id: count,
      };
      return response;
    }
  };

  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      data["testAccounts"] &&
      data["testAccounts"]["nodes"]
    ) {
      let res = data["testAccounts"]["nodes"].map((account) => {
        const { __typename, ...rest } = account;
        return { ...rest, token: "" };
      });
      setAccounts(res);
    }
  }, [data, loading, error]);

  const onCaptchaVerify = () => {
    if (!window.recaptchaVerifier) {
      auth.settings.appVerificationDisabledForTesting = true;

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignIn();
          },
          "expired-callback": () => {},
        }
      );
    }
  };

  const onSignIn = (phone) => {
    onCaptchaVerify();

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("OTP sended successfully!");
        onOTPVerified();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onOTPVerified = () => {
    window.confirmationResult
      .confirm("123123")
      .then((res) => {
        const decoded = jwtDecode(res.user["accessToken"]);
        for (let i = 0; i < accounts.length; i++) {
          if (accounts[i].phone === decoded["phone_number"]) {
            accounts[i].token = res.user["accessToken"];
            if (accounts[i].phone === accounts[accounts.length - 1].phone) {
              setLoading(false);
            }
            break;
          }
        }
        setAccounts(accounts);
        localStorage.setItem("loggedAcc", JSON.stringify(accounts));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const simulateCreatePlans = async () => {
    const loggedAcc = JSON.parse(localStorage.getItem("loggedAcc"));

    localStorage.setItem("checkIsUserCall", "yes");
    let response = [];
    let count = 0;
    let log = "";
    for (let i = 0; i < loggedAcc?.length; i++) {
      localStorage.setItem("userToken", loggedAcc[i].token);
      log += `[Đăng nhập] ${loggedAcc[i].name} \n`;
      for (let j = 0; j < 10; j++) {
        count++;
        const res = await handleCreatePlan(planData[0], count, loggedAcc[i]);
        response.push(res);
        setResponseMsg(response);
        log += `[Tạo kế hoạch] ${loggedAcc[i].name} \n`;
        setLoginMsg(log);
      }
    }
    // for (let i = 0; i < 2; i++) {
    //   localStorage.setItem("userToken", loggedAcc[0].token);
    //   const res = await handleCreatePlan(planData[0], 1, loggedAcc[i]);
    //   response.push(res);
    // }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const handleJoinPlan = async (dto, count, acc) => {
    try {
      const { data } = await join({
        variables: {
          dto: {
            companions: dto.companions,
            planId: dto.planId,
            weight: dto.weight,
          },
        },
      });
      const response = {
        userName: acc.name,
        action: "Tham gia kế hoạch",
        detail: `[${acc.name}] tham gia kế hoạch [${dto.planName}]`,
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Tham gia kế hoạch",
        detail: `${msg}`,
        status: false,
        id: count,
      };
      return response;
    }
  };

  const handleChangeJoinMethod = async (dto, count, acc) => {
    try {
      const { data } = await changeJoinMethod({
        variables: {
          dto: {
            planId: dto.planId,
            joinMethod: dto.joinMethod,
          },
        },
      });
      const response = {
        userName: acc.name,
        action: "Thay đổi phương thức mời",
        detail: `[${acc.name}] chuyển cách tham gia của [${dto.planName}] sang [${dto.joinMethod}]`,
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Thay đổi phương thức mời",
        detail: `${msg}`,
        status: false,
        id: count,
      };
      return response;
    }
  };

  const handleInvitePlan = async (dto, count, acc, guest) => {
    try {
      const { data } = await invite({
        variables: {
          dto: {
            accountId: dto.accountId,
            planId: dto.planId,
          },
        },
      });
      const response = {
        userName: acc.name,
        action: "Mời phượt thủ khác",
        detail: `[${acc.name}] mời [${guest.name}] tham gia kế hoạch [${dto.planName}]`,
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Mời phượt thủ khác",
        detail: `[${acc.name}] mời [${guest.name}] tham gia kế hoạch [${dto.planName}]`,
        status: false,
        id: count,
      };
      return response;
    }
  };

  const simulateJoinAndChangeMethodPlan = async () => {
    const loggedAcc = JSON.parse(localStorage.getItem("loggedAcc"));
    // console.log(loggedAcc);
    // return;

    localStorage.setItem("checkIsUserCall", "yes");
    let response = [];
    let count = 0;
    let log = "";
    for (let i = 0; i < loggedAcc?.length; i++) {
      localStorage.setItem("userToken", loggedAcc[i].token);
      log += `[Đăng nhập] ${loggedAcc[i].name} \n`;
      const { data } = await refetchLoadPlans({
        id: loggedAcc[i].id, // Always refetches a new list
      });
      let currentPlans = data["plans"]["nodes"];
      if (currentPlans.length > 0) {
        for (let j = 0; j < currentPlans?.length; j++) {
          count++;
          const joinData = {
            companions: null,
            planId: currentPlans[j].id,
            weight: 1,
            planName: currentPlans[j].name,
          };
          let currentJoinMethod = "NONE";
          if (currentPlans[j].joinMethod === "NONE") {
            if (loggedAcc[i].id !== 44 && loggedAcc[i].id !== 45) {
              currentJoinMethod = "INVITE";
            } else {
              currentJoinMethod = "SCAN";
            }
          } else if (currentPlans[j].joinMethod === "INVITE") {
            currentJoinMethod = "SCAN";
          } else {
            currentJoinMethod = "INVITE";
          }

          const changeData = {
            joinMethod: currentJoinMethod,
            planId: currentPlans[j].id,
            planName: currentPlans[j].name,
          };
          log += `[Tham gia kế hoạch] ${loggedAcc[i].name} \n`;
          const resJoin = await handleJoinPlan(joinData, count, loggedAcc[i]);
          count++;
          log += `[Thay đổi phương thức tham gia] ${loggedAcc[i].name} \n`;
          const resChange = await handleChangeJoinMethod(
            changeData,
            count,
            loggedAcc[i]
          );
          response.push(resJoin);
          response.push(resChange);

          if (currentJoinMethod === "INVITE") {
            for (let index = 0; index < loggedAcc?.length; index++) {
              count++;
              if (loggedAcc[index].id !== loggedAcc[i].id) {
                const inviteData = {
                  accountId: loggedAcc[index].id,
                  planId: currentPlans[j].id,
                  planName: currentPlans[j].name,
                };
                log += `[Mời thành viên khác] ${loggedAcc[i].name} \n`;
                const resInvite = await handleInvitePlan(
                  inviteData,
                  count,
                  loggedAcc[i],
                  loggedAcc[index]
                );
                response.push(resInvite);
              }
            }
          }

          setLoginMsg(log);
          setResponseMsg(response);
        }
      }
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const simulateMassJoinPlan = async () => {
    const loggedAcc = JSON.parse(localStorage.getItem("loggedAcc"));

    localStorage.setItem("checkIsUserCall", "yes");
    let response = [];
    let count = 0;
    let log = "";
    for (let i = 0; i < loggedAcc?.length; i++) {
      localStorage.setItem("userToken", loggedAcc[i].token);
      const { data } = await refetchLoadPlans({
        id: loggedAcc[i].id, // Always refetches a new list
      });
      let currentPlans = data["plans"]["nodes"];
      if (currentPlans.length > 0) {
        for (let j = 0; j < currentPlans?.length; j++) {
          let setThree = false;
          for (let k = 0; k < loggedAcc?.length; k++) {
            if (loggedAcc[k].id !== loggedAcc[i].id) {
              count++;
              log += `[Đăng nhập] ${loggedAcc[k].name} \n`;
              localStorage.setItem("userToken", loggedAcc[k].token);
              let tempCompanion = null;
              let tempWeight = 1;
              if (
                loggedAcc[i].id !== 44 &&
                loggedAcc[i].id !== 45 &&
                loggedAcc[i].id !== 46
              ) {
                if (!setThree) {
                  tempCompanion = [companionData[0], companionData[1]];
                  tempWeight = 3;
                  setThree = true;
                } else {
                  tempCompanion = [companionData[0]];
                  tempWeight = 2;
                }
              }
              const joinData = {
                companions: tempCompanion,
                planId: currentPlans[j].id,
                weight: tempWeight,
                planName: currentPlans[j].name,
              };
              log += `[Tham gia kế hoạch] ${loggedAcc[k].name} \n`;
              const resJoin = await handleJoinPlan(
                joinData,
                count,
                loggedAcc[k]
              );
              response.push(resJoin);
              setLoginMsg(log);
              setResponseMsg(response);
            }
          }
        }
      }
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const handleConfirmMember = async (planId, count, acc, planName) => {
    try {
      const { data } = await planConfirm({
        variables: {
          dto: planId,
        },
      });
      const response = {
        userName: acc.name,
        action: "Chốt kế hoạch",
        detail: `[${acc.name}] chốt kế hoạch [${planName}]`,
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Chốt kế hoạch",
        detail: `${msg}`,
        status: false,
        id: count,
      };
      return response;
    }
  };

  const simulateConfirmPlan = async () => {
    const loggedAcc = JSON.parse(localStorage.getItem("loggedAcc"));

    localStorage.setItem("checkIsUserCall", "yes");
    let response = [];
    let count = 0;
    let log = "";
    for (let i = 0; i < loggedAcc?.length; i++) {
      log += `[Đăng nhập] ${loggedAcc[i].name} \n`;
      localStorage.setItem("userToken", loggedAcc[i].token);
      const { data } = await refetchLoadPlans({
        id: loggedAcc[i].id, // Always refetches a new list
      });
      let currentPlans = data["plans"]["nodes"];
      if (currentPlans.length > 0) {
        for (let j = 0; j < currentPlans?.length; j++) {
          count++;
          log += `[Chốt kế hoạch] ${loggedAcc[i].name} \n`;
          const res = await handleConfirmMember(
            currentPlans[j].id,
            count,
            loggedAcc[i],
            currentPlans[j].name
          );
          response.push(res);
          setLoginMsg(log);
          setResponseMsg(response);
        }
      }
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const handleOrderPlan = async (dto, count, acc) => {
    try {
      const { data } = await createOrder({
        variables: {
          dto: {
            cart: dto.cart,
            note: dto.note,
            period: dto.period,
            planId: dto.planId,
            serveDates: dto.serveDates,
            type: dto.type,
          },
        },
      });
      const response = {
        userName: acc.name,
        action: "Đặt hàng cho kế hoạch",
        detail: `[${acc.name}] đặt hàng cho kế hoạch [${dto.planName}]`,
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Đặt hàng cho kế hoạch",
        detail: `${msg}`,
        status: false,
        id: count,
      };
      return response;
    }
  };

  const simulateOrderPlan = async () => {
    const loggedAcc = JSON.parse(localStorage.getItem("loggedAcc"));

    localStorage.setItem("checkIsUserCall", "yes");
    let response = [];
    let count = 0;
    let log = "";
    for (let i = 0; i < loggedAcc?.length; i++) {
      log += `[Đăng nhập] ${loggedAcc[i].name} \n`;
      localStorage.setItem("userToken", loggedAcc[i].token);
      const { data } = await refetchLoadPlans({
        id: loggedAcc[i].id, // Always refetches a new list
      });
      let currentPlans = data["plans"]["nodes"];
      if (currentPlans.length > 0) {
        for (let j = 0; j < currentPlans?.length; j++) {
          let temp = [];
          if (loggedAcc[i].id !== 44 && loggedAcc[i].id !== 45) {
            temp = [planData[0].tempOrders[0], planData[0].tempOrders[1]];
            console.log("half");
            console.log(temp);
          } else {
            temp = planData[0].tempOrders;
            console.log("full");
            console.log(temp);
          }
          for (let k = 0; k < temp.length; k++) {
            count++;
            const orderData = {
              cart: temp[k].cart,
              note: temp[k].note,
              planId: currentPlans[j].id,
              serveDates: temp[k].serveDates,
              type: temp[k].type,
              period: temp[k].period,
              planName: currentPlans[j].name,
            };
            // console.log("/////////////////////////////////////");
            // console.log(orderData);
            log += `[Đặt hàng cho kế hoạch] ${loggedAcc[i].name} \n`;
            const res = await handleOrderPlan(orderData, count, loggedAcc[i]);
            response.push(res);
            setResponseMsg(response);
            setLoginMsg(log);
          }
        }
      }
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const simulateJoinPlanByID = async (currentPlan) => {
    const loggedAcc = JSON.parse(localStorage.getItem("loggedAcc"));

    localStorage.setItem("checkIsUserCall", "yes");
    let response = [];
    let count = 0;
    let log = "";
    for (let i = 0; i < loggedAcc?.length; i++) {
      log += `[Đăng nhập] ${loggedAcc[i].name} \n`;
      count++;
      localStorage.setItem("userToken", loggedAcc[i].token);
      const joinData = {
        companions: null,
        planId: parseInt(joinId, 10),
        weight: 1,
        planName: currentPlan.name,
      };
      log += `[Tham gia kế hoạch] ${loggedAcc[i].name} \n`;
      const resJoin = await handleJoinPlan(joinData, count, loggedAcc[i]);
      response.push(resJoin);
      setResponseMsg(response);
      setLoginMsg(log);
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const handleChangeSystemTime = async (date) => {
    try {
      const { data } = await setTime({
        variables: {
          time: date,
        },
      });
      let dt = "";
      let st = false;
      if (data) {
        st = true;
        dt = `Quản trị hệ thống thay đổi thời gian đến ${date}`;
      } else {
        dt = `Quản trị hệ thống thay đổi thời gian thất bại`;
      }
      const response = {
        userName: "Quản trị hệ thống",
        action: "Thay đổi thời gian hệ thống",
        detail: dt,
        status: st,
        id: 1,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: "Quản trị hệ thống",
        action: "Thay đổi thời gian hệ thống",
        detail: `${msg}`,
        status: false,
        id: 1,
      };
      return response;
    }
  };

  const [loginMsg, setLoginMsg] = useState("");

  const MassLogin = () => {
    for (let i = 0; i < accounts?.length; i++) {
      onSignIn(accounts[i].phone);
    }
  };

  MassLogin();

  return (
    <div>
      <div className="emulator">
        <div className="sharedTitle">
          <div>
            <p className="title">Giả lập</p>
            <p className="sub-title">Giả lập hệ thống</p>
          </div>
        </div>
        <div className="emulatorContainer">
          <div className="emulatorTitle">
            <p>Chi tiết</p>
          </div>
          <div className="details">
            <div id="recaptcha-container"></div>
            <div className="input-field">
              <Select
                placeholder={"Chọn loại giả lập"}
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                name="color"
                size="small"
                options={emulatorOptions}
                onChange={(e) => {
                  if (e != null) {
                    setSelectedSimulator(e.value);
                    setSelectLoading(false);
                    if (e.value === 0) {
                      setIdInputVisible(true);
                      setDateVisible(false);
                    } else if (e.value === 6) {
                      setDateVisible(true);
                      setIdInputVisible(false);
                    } else {
                      setIdInputVisible(false);
                      setDateVisible(false);
                    }
                  } else {
                    setSelectLoading(true);
                    setIdInputVisible(false);
                    setDateVisible(false);
                  }
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#58D68D",
                    primary: "#28B463",
                  },
                })}
              />
              <TextField
                style={
                  idInputVisible ? { display: "block" } : { display: "none" }
                }
                sx={{
                  width: "15%",
                }}
                id="outlined-disabled"
                className="basic-text ml-2"
                type="text"
                placeholder="Nhập ID"
                size="small"
                name="id"
                onChange={(e) => {
                  setJoinId(e.target.value);
                }}
                color="success"
              />
              <TextField
                id="outlined-disabled"
                style={dateVisible ? { display: "block" } : { display: "none" }}
                sx={{
                  width: "15%",
                }}
                className="basic-text ml-2"
                type="date"
                // placeholder="Nhập ID"
                size="small"
                name="id"
                onChange={(e) => {
                  setDateSimulator(e.target.value);
                }}
                color="success"
              />
            </div>
            {!isEnabled && (
              <button className={"linkDisabled"} disabled>
                <PlayArrowIcon /> <span>Chạy giả lập</span>
              </button>
            )}
            {isEnabled && (
              <button
                className={"link"}
                onClick={async () => {
                  if (selectedSimulator === 1) {
                    simulateCreatePlans();
                  } else if (selectedSimulator === 2) {
                    simulateJoinAndChangeMethodPlan();
                  } else if (selectedSimulator === 3) {
                    simulateMassJoinPlan();
                  } else if (selectedSimulator === 4) {
                    simulateConfirmPlan();
                  } else if (selectedSimulator === 5) {
                    simulateOrderPlan();
                  } else if (selectedSimulator === 0) {
                    try {
                      const { data } = await refetchLoadPlansById({
                        id: parseInt(joinId, 10), // Always refetches a new list
                      });
                      let plan = data["plans"]["nodes"][0];
                      if (!plan) {
                        const msg = `Không có kế hoạch nào thuộc ID: ${joinId}`;
                        setErrMsg(msg);
                        handleClick();
                      } else {
                        simulateJoinPlanByID(plan);
                      }
                    } catch (error) {
                      console.log(error);
                      const msg = `Vui lòng nhập đúng định dạng số`;
                      setErrMsg(msg);
                      handleClick();
                    }
                  } else if (selectedSimulator === 6) {
                    let log = "";
                    log += "[Đăng nhập] Quản trị hệ thống \n";
                    log +=
                      "[Chỉnh sửa thời gian hệ thống] Quản trị hệ thống \n";
                    let response = [];
                    const res = await handleChangeSystemTime(dateSimulator);

                    response.push(res);
                    setResponseMsg(response);
                    setLoginMsg(log);
                  }
                }}
              >
                <PlayArrowIcon /> <span>Chạy giả lập</span>
              </button>
            )}

            <div className="response-table">
              <div className="resultTable">
                <p className="title">Đăng nhập</p>
                <div className="body login-res">
                  <span className="response">{loginMsg}</span>
                </div>
              </div>
              <div className="resultTable">
                <p className="title">Kết quả</p>
                <div className="body">
                  {responseMsg.map((message, index) => (
                    <div key={index} className="response-item">
                      <p className="response-msg">
                        {message.id}. {message.userName} - {message.action}
                      </p>
                      <p className="response-detail">{message.detail}</p>
                      {message.status && (
                        <p className="response-status success">Thành công</p>
                      )}
                      {!message.status && (
                        <p className="response-status fail">Thất bại</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={snackbarOpen}
          onClose={handleClose}
          autoHideDuration={2000}
          key={vertical + horizontal}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {errorMsg}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default EmulatorPage;
