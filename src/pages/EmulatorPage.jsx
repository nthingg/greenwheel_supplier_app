import { useEffect, useState } from "react";
import "../assets/scss/emulator.scss";
import "../assets/scss/shared.scss";
import Select from "react-select";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { FILTER_AVAILABLE_TRAVELER } from "../services/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Alert, Snackbar, TextField } from "@mui/material";
import {
  CREATE_PLAN_SIMULATOR,
  GEN_MEM_SIMULATOR,
  JOIN_PLAN_SIMULATOR,
  LOAD_PLANS_SIMULATOR,
} from "../services/graphql/simulator";
import { GraphQLError } from "graphql";
import { onError } from "@apollo/client/link/error";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../services/firebase/setup";
import { jwtDecode } from "jwt-decode";

const EmulatorPage = () => {
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMsg, setErrMsg] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [responseMsg, setResponseMsg] = useState("");
  const [user, setUser] = useState(null);

  const emulatorOptions = [
    { value: 1, label: "Giả lập tạo 50 kế hoạch." },
    {
      value: 2,
      label: "Giả lập 50 trưởng nhóm tham gia kế hoạch của bản thân.",
    },
    {
      value: 3,
      label: "Giả lập 50 trưởng nhóm tham gia kế hoạch của bản thân.",
    },
    {
      value: 4,
      label: "Giả lập người được mời tham gia 40 kế hoạch.",
    },
    {
      value: 5,
      label: "Giả lập chốt 30 kế hoạch.",
    },
    {
      value: 6,
      label: "Giả lập đặt đồ cho 30 kế hoạch.",
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

  const [join, { data: dataJoin, error: errorJoin }] =
    useMutation(JOIN_PLAN_SIMULATOR);

  const [create, { data: dataCreate, error: errorCreate }] = useMutation(
    CREATE_PLAN_SIMULATOR
  );

  const handleCreatePlan = async (plan) => {
    try {
      const { data } = await create({
        variables: {
          dto: {
            departAt: plan.departAt,
            departure: plan.departure,
            destinationId: plan.destinationId,
            gcoinBudgetPerCapita: plan.gcoinBudgetPerCapita,
            memberLimit: plan.memberLimit,
            name: plan.name,
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

      return `${data["createPlan"]["accounts"]["name"]} tham gia thành công`;
    } catch (e) {
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      return null;
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

      // setAccounts(data["testAccounts"]["nodes"]);
      setAccounts(res);
      console.log(res);
    }
  }, [data, loading, error]);

  // useEffect(() => {
  //   if (
  //     !plansLoading &&
  //     !plansError &&
  //     plansData &&
  //     plansData["plans"] &&
  //     plansData["plans"]["nodes"]
  //   ) {
  //     const options = plansData["plans"]["nodes"].map(
  //       ({ id, status, maxMember, memberCount, account }) => ({
  //         value: id,
  //         label: `ID: ${id}, host: ${account.name}, status: ${status}, member: ${memberCount}/${maxMember}`,
  //       })
  //     );
  //     setPlansOptions(options);
  //     setListPlan(plansData["plans"]["nodes"]);
  //   }
  // }, [plansData, plansLoading, plansError]);

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
    console.log(appVerifier);
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
        console.log(res.user["accessToken"]);
        const decoded = jwtDecode(res.user["accessToken"]);
        accounts.map((account) => {
          if (account.phone === decoded["phone_number"]) {
            account.token = res.user["accessToken"];
          }
        });
        setAccounts(accounts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
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
                console.log(e.value);
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
            // className={emulatorStatus ? "link" : "linkDisabled"}
            className="link"
            onClick={async () => {
              // const plan = listPlan.find((plan) => plan.id == currentPlan);
              // // const data = await handleGenMem(plan.id, numberJoin);
              // // if (data !== null) {
              // //   console.log(data);
              // // }
              // refetch();
              // if (accounts.length < numberJoin) {
              //   const msg = "Số lượng account test không đủ.";
              //   setErrMsg(msg);
              //   handleClick();
              //   return null;
              // } else {
              //   let response = "";
              //   for (let index = 0; index < numberJoin; index++) {
              //     console.log(accounts[index]);
              //     const data = await handleAddMem(plan.id, accounts[index].id);
              //     // setResponseMsg(data);
              //     response += data + "\n";
              //   }
              //   setResponseMsg(response);
              // }
              accounts.map((account) => {
                onSignIn(account.phone);
              });

              console.log(accounts);
            }}
            disabled={false}
          >
            <PlayArrowIcon /> <span>Chạy giả lập</span>
          </button>
          <div className="resultTable">
            <p className="title">Kết quả</p>
            <div className="body">{responseMsg}</div>
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
  );
};

export default EmulatorPage;
