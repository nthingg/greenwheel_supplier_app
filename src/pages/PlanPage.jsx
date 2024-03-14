import "../assets/scss/planPage.scss";
import "../assets/scss/planTable.scss";
import "../assets/scss/filter.scss";
import "../assets/scss/shared.scss";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LanguageIcon from "@mui/icons-material/Language";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PlanTable from "../components/PlanTable";
import { LOAD_PLANS, LOAD_PLANS_FILTER } from "../services/graphql/plan";

const PlanPage = () => {
  const planStat = [
    "CANCELED",
    "PRIVATE",
    "PUBLIC",
    "PUBLISHED",
    "READY",
    "VERIFIED",
  ];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(planStat[1]);
  const [isHidden, setIsHidden] = useState(false);
  const [isReadyHidden, setIsReadyHidden] = useState(true);
  const [isVeriHidden, setIsVeriHidden] = useState(true);
  const [registerStatus, setRegisterStatus] = useState("private");
  const [registerReadyStatus, setRegisterReadyStatus] = useState("incoming");
  const [registerVeriStatus, setRegisterVeriStatus] = useState("happening");

  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 1:
        setSelectedStatus(planStat[4]);
        break;
      case 2:
        setSelectedStatus(planStat[0]);
        break;
      case 3:
        setSelectedStatus(planStat[5]);
        break;
      case 4:
        setSelectedStatus(planStat[3]);
        break;
      case 5:
        setSelectedStatus(planStat[2]);
        break;
      case 6:
        setSelectedStatus(planStat[1]);
        break;
      default:
        break;
    }
    refetch();
  };

  const { error, loading, data, refetch } = useQuery(LOAD_PLANS_FILTER, {
    variables: {
      status: selectedStatus,
    },
  });
  const {
    error: errorTotal,
    loading: loadingTotal,
    data: dataTotal,
    refetch: refetchTotal,
  } = useQuery(LOAD_PLANS);

  const [privatePlans, setPrivate] = useState(0);
  const [publicPlans, setPublic] = useState(0);
  const [canceledPlans, setCanceled] = useState(0);
  const [verifiedPlans, setVerified] = useState(0);
  const [readyPlans, setReady] = useState(0);
  const [publishedPlans, setPublished] = useState(0);
  useEffect(() => {
    if (
      !loadingTotal &&
      !errorTotal &&
      dataTotal &&
      dataTotal["plans"]["nodes"]
    ) {
      let countPrivate = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "PRIVATE") {
          countPrivate++;
        }
      }

      let countPublic = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "PUBLIC") {
          countPublic++;
        }
      }

      let countReady = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "READY") {
          countReady++;
        }
      }

      let countCanceled = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "CANCELED") {
          countCanceled++;
        }
      }

      let countVerified = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "VERIFIED") {
          countVerified++;
        }
      }

      let countPublished = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "PUBLISHED") {
          countPublished++;
        }
      }

      setPrivate(countPrivate);
      setPublic(countPublic);
      setReady(countReady);
      setCanceled(countCanceled);
      setVerified(countVerified);
      setPublished(countPublished);
    }
  }, [dataTotal, loadingTotal, errorTotal]);

  const [plans, setPlans] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["plans"]["nodes"]) {
      let res = data.plans.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setPlans(res);
    }
  }, [data, loading, error]);

  return (
    <div className="plan">
      <div className="sharedTitle">
        <div>
          <p className="title">Kế hoạch</p>
          <p className="sub-title">Danh sách kế hoạch</p>
        </div>
      </div>
      <div className="header">
        <div className="left">
          <input
            type="text"
            className={"form-control"}
            id="floatingValue"
            name="value"
            placeholder="Tìm kiếm ..."
          />
        </div>
        <div className="right">
          {/* <Link to="/products/new" className="link">
              <AddIcon />
              <span>Thêm dịch vụ</span>
            </Link> */}
          <button className="link">
            <span>Tải xuống file Excel</span>
            <CloudDownloadIcon />
          </button>
          <button className="link">
            <FilterAltIcon />
          </button>
          <button
            className="link"
            onClick={() => {
              refetch();
            }}
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
      <div className="planContainer">
        <div className="icon-row">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`icon-item ${selectedDiv === index ? "selected" : ""}`}
              onClick={() => {
                if (index == 0) {
                  setIsHidden(false);
                  setIsReadyHidden(true);
                  setIsVeriHidden(true);
                  if (registerStatus === "private") {
                    console.log("check private");
                    handleClick(6);
                  } else {
                    console.log("check public");
                    handleClick(5);
                  }
                  setSelectedDiv(0);
                } else if (index == 1) {
                  setIsReadyHidden(false);
                  setIsHidden(true);
                  setIsVeriHidden(true);
                } else if (index == 3) {
                  setIsReadyHidden(true);
                  setIsHidden(true);
                  setIsVeriHidden(false);
                } else {
                  setIsHidden(true);
                  setIsReadyHidden(true);
                  setIsVeriHidden(true);
                }
                handleClick(index);
              }}
            >
              {/* Replace with appropriate icons */}
              {index === 0 && <AppRegistrationIcon sx={{ color: "#3498DB" }} />}
              {index === 1 && (
                <PlaylistAddCheckIcon sx={{ color: "#3498DB" }} />
              )}
              {index === 2 && <CancelIcon sx={{ color: "#E74C3C" }} />}
              {index === 3 && <CheckCircleIcon color="success" />}
              {index === 4 && <LanguageIcon sx={{ color: "#3498DB" }} />}
              <span>
                {index === 0 && "Chờ chốt"}
                {index === 1 && `Sẵn sàng (${readyPlans})`}
                {index === 2 && `Đã hủy (${canceledPlans})`}
                {index === 3 && `Đã xác nhận (${verifiedPlans})`}
                {index === 4 && `Xuất bản (${publishedPlans})`}
              </span>
            </div>
          ))}
        </div>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={"private"}
            sx={{ marginBottom: 2, marginLeft: 2 }}
            hidden={isHidden}
            onClick={(e) => {
              setRegisterStatus(e.target.value);
              if (e.target.value === "private") {
                handleClick(6);
                setSelectedDiv(0);
              } else {
                handleClick(5);
                setSelectedDiv(0);
              }
            }}
          >
            <FormControlLabel
              value="private"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label={`Riêng tư (${privatePlans})`}
            />
            <FormControlLabel
              value="public"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label={`Công khai (${publicPlans})`}
            />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={"incoming"}
            sx={{ marginBottom: 2, marginLeft: 2 }}
            hidden={isReadyHidden}
            onClick={(e) => {}}
          >
            <FormControlLabel
              value="incoming"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label="Sắp tới"
            />
            <FormControlLabel
              value="happening"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label="Đang diễn ra"
            />
            <FormControlLabel
              value="ended"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label="Kết thúc"
            />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={"happening"}
            sx={{ marginBottom: 2, marginLeft: 2 }}
            hidden={isVeriHidden}
            onClick={(e) => {}}
          >
            <FormControlLabel
              value="happening"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label="Đang diễn ra"
            />
            <FormControlLabel
              value="ended"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label="Kết thúc"
            />
          </RadioGroup>
        </FormControl>

        <PlanTable plans={plans} />
      </div>
    </div>
  );
};

export default PlanPage;
