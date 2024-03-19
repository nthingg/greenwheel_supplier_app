import { useEffect, useState } from "react";
import "../assets/scss/emulator.scss";
import "../assets/scss/shared.scss";
import Select from "react-select";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { FILTER_AVAILABLE_TRAVELER } from "../services/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Alert, Snackbar, TextField } from "@mui/material";
import {
  GEN_MEM_SIMULATOR,
  JOIN_PLAN_SIMULATOR,
  LOAD_PLANS_SIMULATOR,
} from "../services/graphql/simulator";
import { GraphQLError } from "graphql";
import { onError } from "@apollo/client/link/error";

const EmulatorPage = () => {
  const [plansOptions, setPlansOptions] = useState([]);
  const [listResponse, setListResponse] = useState([]);
  const [listPlan, setListPlan] = useState([]);
  const [numberJoin, setNumberJoin] = useState(0);
  const [isNumberDisabled, setIsNumberDisabled] = useState(true);
  const [isPlanDisabled, setIsPlanDisabled] = useState(true);
  const [emulatorStatus, setEmulatorStatus] = useState(false);
  const [currentTraveler, setCurrentTraveler] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [listMember, setListMember] = useState([]);
  const [listAvailable, setListAvailable] = useState([]);
  const [planId, setPlanId] = useState(0);
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMsg, setErrMsg] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const emulatorOptions = [
    { value: 1, label: "Thêm thành viên vào kế hoạch." },
    // { value: 2, label: "Thêm 10 plan với địa chỉ chỉ định." },
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

  // const handleGenMem = async (id, numberJoin) => {
  //   try {
  //     const { data } = await join({
  //       variables: {
  //         dto: {
  //           planId: parseInt(id, 10),
  //           quantity: parseInt(numberJoin, 10),
  //         },
  //       },
  //     });
  //     return data["joinPlanSimulate"];
  //   } catch (e) {
  //     const msg = localStorage.getItem("errorMsg");
  //     setErrMsg(msg);
  //     handleClick();
  //     return null;
  //   }
  // };

  const handleAddMem = async (planId) => {
    try {
      let response = "";
      if (accounts.length < numberJoin) {
        const msg = "Số lượng account test không đủ.";
        setErrMsg(msg);
        handleClick();
        return null;
      }
      for (let index = 0; index < numberJoin; index++) {
        const element = accounts[index];
        const { data } = await join({
          variables: {
            dto: {
              accountId: parseInt(element["id"], 10),
              planId: parseInt(planId, 10),
            },
          },
        });

        if (data != null) {
          response += `${data["account"]["name"]} tham gia thành công`;
        }
      }

      return response;
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
      setAccounts(data["testAccounts"]["nodes"]);
    }
  }, [data, loading, error]);

  useEffect(() => {
    if (
      !plansLoading &&
      !plansError &&
      plansData &&
      plansData["plans"] &&
      plansData["plans"]["nodes"]
    ) {
      const options = plansData["plans"]["nodes"].map(
        ({ id, status, maxMember, memberCount, account }) => ({
          value: id,
          label: `ID: ${id}, host: ${account.name}, status: ${status}, member: ${memberCount}/${maxMember}`,
        })
      );
      setPlansOptions(options);
      setListPlan(plansData["plans"]["nodes"]);
    }
  }, [plansData, plansLoading, plansError]);

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
          <Select
            placeholder={"Chọn loại giả lập"}
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            name="color"
            options={emulatorOptions}
            onChange={(e) => {
              if (e != null) {
                plansRefect();
                setIsPlanDisabled(false);
              } else {
                setIsPlanDisabled(true);
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
          <div className="option">
            <div className="left">
              <Select
                placeholder={"Chọn plan có sẵn"}
                className="basic-single"
                classNamePrefix="select"
                isDisabled={isPlanDisabled}
                isClearable={true}
                name="color"
                options={plansOptions}
                onChange={(e) => {
                  if (e != null) {
                    setCurrentPlan(e.value);
                    setIsNumberDisabled(false);
                    setEmulatorStatus(true);
                    setNumberJoin(10);
                  } else {
                    setIsNumberDisabled(true);
                    setEmulatorStatus(false);
                    setNumberJoin(0);
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
            </div>
            <div className="right">
              <TextField
                disabled={isNumberDisabled}
                id="outlined-disabled"
                label="Số người"
                type="number"
                defaultValue={10}
                placeholder="Nhập số người tham gia"
                size="small"
                onChange={(e) => {
                  if (e.target.value <= 0) {
                    setEmulatorStatus(false);
                  } else {
                    setNumberJoin(e.target.value);
                    setEmulatorStatus(true);
                  }
                }}
              />
            </div>
          </div>
          <button
            className={emulatorStatus ? "link" : "linkDisabled"}
            onClick={async () => {
              const plan = listPlan.find((plan) => plan.id == currentPlan);
              // const data = await handleGenMem(plan.id, numberJoin);
              // if (data !== null) {
              //   console.log(data);
              // }
              refetch();
              const data = await handleAddMem(plan.id);
              console.log(data);
            }}
            disabled={false}
          >
            <PlayArrowIcon /> <span>Chạy giả lập</span>
          </button>
          <div className="resultTable">
            <p className="title">Kết quả</p>
            <div className="body">
              {listResponse.map((response, index) => (
                <p key={index}>{response}</p>
              ))}
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
  );
};

export default EmulatorPage;
