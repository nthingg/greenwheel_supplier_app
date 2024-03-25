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
  JOIN_PLAN_SIMULATOR,
  LOAD_PLANS_SIMULATOR,
  ORDER_CREATE_SIMULATOR,
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

  const emulatorOptions = [
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

  const [join, { data: dataJoin, error: errorJoin }] =
    useMutation(JOIN_PLAN_SIMULATOR);

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
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Tạo kế hoạch",
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
    for (let i = 0; i < loggedAcc?.length; i++) {
      localStorage.setItem("userToken", loggedAcc[i].token);
      for (let j = 0; j < 10; j++) {
        count++;
        const res = await handleCreatePlan(planData[0], count, loggedAcc[i]);
        response.push(res);
        setResponseMsg(response);
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
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Tham gia kế hoạch",
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
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Thay đổi phương thức mời",
        status: false,
        id: count,
      };
      return response;
    }
  };

  const simulateJoinAndChangeMethodPlan = async () => {
    const loggedAcc = JSON.parse(localStorage.getItem("loggedAcc"));

    localStorage.setItem("checkIsUserCall", "yes");
    let response = [];
    let count = 0;
    for (let i = 0; i < loggedAcc?.length; i++) {
      localStorage.setItem("userToken", loggedAcc[i].token);
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
          };
          let currentJoinMethod = "NONE";
          if (currentPlans[j].joinMethod === "NONE") {
            if (loggedAcc[i].id !== 44 && loggedAcc[i].id !== 45) {
              currentJoinMethod = "INVITE";
            } else {
              currentJoinMethod = "SCAN";
            }
          } else {
            currentJoinMethod = currentPlans[j].joinMethod;
          }
          const changeData = {
            joinMethod: currentJoinMethod,
            planId: currentPlans[j].id,
          };
          const resJoin = await handleJoinPlan(joinData, count, loggedAcc[i]);
          count++;
          const resChange = await handleChangeJoinMethod(
            changeData,
            count,
            loggedAcc[i]
          );
          response.push(resJoin);
          response.push(resChange);
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
    for (let i = 0; i < loggedAcc?.length; i++) {
      localStorage.setItem("userToken", loggedAcc[i].token);
      const { data } = await refetchLoadPlans({
        id: loggedAcc[i].id, // Always refetches a new list
      });
      let currentPlans = data["plans"]["nodes"];
      if (currentPlans.length > 0) {
        for (let j = 0; j < currentPlans?.length; j++) {
          for (let k = 0; k < loggedAcc?.length; k++) {
            if (loggedAcc[k].id !== loggedAcc[i].id) {
              if (currentPlans[j].joinMethod === "SCAN") {
                count++;
                localStorage.setItem("userToken", loggedAcc[k].token);
                const joinData = {
                  companions: null,
                  planId: currentPlans[j].id,
                  weight: 1,
                };
                const resJoin = await handleJoinPlan(
                  joinData,
                  count,
                  loggedAcc[k]
                );
                response.push(resJoin);
                setResponseMsg(response);
              }
            }
          }
        }
      }
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const handleConfirmMember = async (planId, count, acc) => {
    try {
      const { data } = await planConfirm({
        variables: {
          dto: planId,
        },
      });
      const response = {
        userName: acc.name,
        action: "Chốt kế hoạch",
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Chốt kế hoạch",
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
    for (let i = 0; i < loggedAcc?.length; i++) {
      localStorage.setItem("userToken", loggedAcc[i].token);
      const { data } = await refetchLoadPlans({
        id: loggedAcc[i].id, // Always refetches a new list
      });
      let currentPlans = data["plans"]["nodes"];
      if (currentPlans.length > 0) {
        for (let j = 0; j < currentPlans?.length; j++) {
          count++;
          const res = await handleConfirmMember(
            currentPlans[j].id,
            count,
            loggedAcc[i]
          );
          response.push(res);
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
        status: true,
        id: count,
      };
      return response;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
      const response = {
        userName: acc.name,
        action: "Đặt hàng cho kế hoạch",
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
    for (let i = 0; i < loggedAcc?.length; i++) {
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
          } else {
            temp = planData[0].tempOrders;
          }
          console.log(temp);
          for (let k = 0; k < temp.length; k++) {
            count++;
            const orderData = {
              cart: temp[k].cart,
              note: temp[k].note,
              planId: currentPlans[j].id,
              serveDates: temp[k].serveDates,
              type: temp[k].type,
              period: temp[k].period,
            };
            console.log(orderData);
            const res = await handleOrderPlan(orderData, count, loggedAcc[i]);
            response.push(res);
            setResponseMsg(response);
          }
        }
      }
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const [loginMsg, setLoginMsg] = useState("");

  const MassLogin = () => {
    for (let i = 0; i < accounts?.length; i++) {
      onSignIn(accounts[i].phone);
    }
  };
  // localStorage.setItem("checkIsUserCall", "no");

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
            <Select
              placeholder={"Chọn loại giả lập"}
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              name="color"
              options={emulatorOptions}
              onChange={(e) => {
                if (e != null) {
                  setSelectedSimulator(e.value);
                  setSelectLoading(false);
                } else {
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
            <button
              className={loadingState && selectState ? "linkDisabled" : "link"}
              // className={"link"}
              onClick={async () => {
                if (loginMsg === "") {
                  let res = "";
                  accounts.forEach(async (acc) => {
                    res += `[Đăng nhập] ${acc.name} \n`;
                  });
                  setLoginMsg(res);
                }

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
                }
              }}
              disabled={false}
            >
              <PlayArrowIcon /> <span>Chạy giả lập</span>
            </button>
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
