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
  const [responseMsg, setResponseMsg] = useState("");
  const [loadingState, setLoading] = useState(true);
  const [selectedSimulator, setSelectedSimulator] = useState(0);

  const emulatorOptions = [
    { value: 1, label: "Giả lập tạo kế hoạch." },
    {
      value: 2,
      label: "Giả lập trưởng nhóm tham gia kế hoạch của bản thân.",
    },
    {
      value: 3,
      label: "Giả lập phượt thủ tham gia kế hoạch.",
    },
    {
      value: 4,
      label: "Giả lập chốt kế hoạch.",
    },
  ];

  const handleClick = () => {
    setSnackbarOpen(true);
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const {
    error: plansError,
    loading: plansLoading,
    data: plansData,
    refetch: plansRefect,
  } = useQuery(LOAD_PLANS_SIMULATOR);

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

  const handleCreatePlan = async (plan, count) => {
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
      return `Người dùng [${data["createPlan"]["account"]["name"]}] tạo kế hoạch [${data["createPlan"]["name"]}] thành công`;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
      return "Tạo kế hoạch thất bại";
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const simulateCreatePlans = async () => {
    localStorage.setItem("checkIsUserCall", "yes");
    let response = "";
    let count = 0;
    for (let i = 0; i < accounts?.length; i++) {
      localStorage.setItem("userToken", accounts[i].token);
      for (let j = 0; j < 10; j++) {
        const res = await handleCreatePlan(planData[0], count);
        response += `${res}\n`;
        count++;
      }
      setResponseMsg(response);
    }
    // for (let i = 0; i < 2; i++) {
    //   localStorage.setItem("userToken", accounts[0].token);
    //   const res = await handleCreatePlan(planData[0]);
    //   response += `${res}\n`;
    //   setResponseMsg(response);
    // }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const handleJoinPlan = async (dto) => {
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
      return `Người dùng [${data["joinPlan"]["account"]["name"]}] tham gia kế hoạch [${data["joinPlan"]["plan"]["name"]}] thành công`;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
      return "Tham gia kế hoạch thất bại";
    }
  };

  const handleChangeJoinMethod = async (dto) => {
    try {
      const { data } = await changeJoinMethod({
        variables: {
          dto: {
            planId: dto.planId,
            joinMethod: dto.joinMethod,
          },
        },
      });
      // return `Người dùng [${data["changePlanJoinMethod"]["account"]["name"]}] thay đổi phương thức mời của kế hoạch [${data["changePlanJoinMethod"]["name"]}] thành [${data["changePlanJoinMethod"]["joinMethod"]}] thành công`;
      return `Người dùng thay đổi phương thức mời của kế hoạch [${data["changePlanJoinMethod"]["name"]}] thành [${data["changePlanJoinMethod"]["joinMethod"]}] thành công`;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
      return "Thay đổi phương thức mời của kế hoạch thất bại";
    }
  };

  const simulateJoinAndChangeMethodPlan = async () => {
    localStorage.setItem("checkIsUserCall", "yes");
    let response = "";
    for (let i = 0; i < accounts?.length; i++) {
      console.log(accounts[i].token);
      localStorage.setItem("userToken", accounts[i].token);
      const { data } = await refetchLoadPlans({
        id: accounts[i].id, // Always refetches a new list
      });
      let currentPlans = data["plans"]["nodes"];
      if (currentPlans.length > 0) {
        for (let j = 0; j < currentPlans?.length; j++) {
          const joinData = {
            companions: null,
            planId: currentPlans[j].id,
            weight: 1,
          };
          let currentJoinMethod = "SCAN";
          if (accounts[i].id !== 44 && accounts[i].id !== 45) {
            currentJoinMethod = "INVITE";
          }
          // if (currentPlans[j].joinMethod === "INVITE") {
          //   currentJoinMethod = "SCAN";
          // } else if (currentPlans[j].joinMethod === "SCAN") {
          //   currentJoinMethod = "INVITE";
          // }
          const changeData = {
            joinMethod: currentJoinMethod,
            planId: currentPlans[j].id,
          };
          const resJoin = await handleJoinPlan(joinData);
          const resChange = await handleChangeJoinMethod(changeData);
          response += `${resJoin}\n`;
          response += `${resChange}\n`;
        }
        setResponseMsg(response);
      }
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const simulateMassJoinPlan = async () => {
    localStorage.setItem("checkIsUserCall", "yes");
    let response = "";
    for (let i = 0; i < accounts?.length; i++) {
      localStorage.setItem("userToken", accounts[i].token);
      console.log(accounts[i].token);
      const { data } = await refetchLoadPlans({
        id: accounts[i].id, // Always refetches a new list
      });
      let currentPlans = data["plans"]["nodes"];
      console.log(currentPlans);
      if (currentPlans.length > 0) {
        for (let j = 0; j < currentPlans?.length; j++) {
          for (let k = 0; k < accounts?.length; k++) {
            if (accounts[k].id !== accounts[i].id) {
              if (currentPlans[j].joinMethod === "SCAN") {
                localStorage.setItem("userToken", accounts[k].token);
                const joinData = {
                  companions: null,
                  planId: currentPlans[j].id,
                  weight: 1,
                };
                const resJoin = await handleJoinPlan(joinData);
                response += `${resJoin}\n`;
              }
            }
          }
        }
        setResponseMsg(response);
      }
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

  const [planConfirm, { data: dataConfirm, error: errorConfirm }] = useMutation(
    CONFIRM_PLAN_SIMULATOR
  );

  const handleConfirmMember = async (planId) => {
    try {
      const { data } = await planConfirm({
        variables: {
          dto: planId,
        },
      });
      return `Kế hoạch [${data["confirmMembers"]["name"]}] chốt thành công.`;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
      return `Chốt kế hoạch ${planId} thất bại`;
    }
  };

  const simulateConfirmPlan = async () => {
    localStorage.setItem("checkIsUserCall", "yes");
    let response = "";
    for (let i = 0; i < accounts?.length; i++) {
      console.log(accounts[i].token);
      localStorage.setItem("userToken", accounts[i].token);
      const { data } = await refetchLoadPlans({
        id: accounts[i].id, // Always refetches a new list
      });
      let currentPlans = data["plans"]["nodes"];
      console.log(currentPlans);
      if (currentPlans.length > 0) {
        for (let j = 0; j < currentPlans?.length; j++) {
          const res = await handleConfirmMember(currentPlans[j].id);
          response += `${res}\n`;
        }
        setResponseMsg(response);
      }
    }
    localStorage.setItem("checkIsUserCall", "no");
  };

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
              className={loadingState ? "linkDisabled" : "link"}
              // className={"link"}
              onClick={async () => {
                if (selectedSimulator === 1) {
                  simulateCreatePlans();
                } else if (selectedSimulator === 2) {
                  simulateJoinAndChangeMethodPlan();
                } else if (selectedSimulator === 3) {
                  simulateMassJoinPlan();
                } else if (selectedSimulator === 4) {
                  simulateConfirmPlan();
                }
              }}
              disabled={false}
            >
              <PlayArrowIcon /> <span>Chạy giả lập</span>
            </button>
            <div className="resultTable">
              <p className="title">Kết quả</p>
              <div className="body">
                <span className="response">{responseMsg}</span>
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
