import "../assets/scss/planPage.scss";
import "../assets/scss/planTable.scss";
import "../assets/scss/filter.scss";
import "../assets/scss/shared.scss";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import PublicIcon from "@mui/icons-material/Public";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LanguageIcon from "@mui/icons-material/Language";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import {
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PlanTable from "../components/PlanTable";
import { LOAD_PLANS_FILTER } from "../services/graphql/plan";

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
  const [registerStatus, setRegisterStatus] = useState("public");
  const [registerReadyStatus, setRegisterReadyStatus] = useState("incoming");
  const [registerVeriStatus, setRegisterVeriStatus] = useState("happening");

  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 1:
        setSelectedStatus(planStat[4]);
        refetch();
        break;
      case 2:
        setSelectedStatus(planStat[0]);
        refetch();
        break;
      case 3:
        setSelectedStatus(planStat[5]);
        refetch();
        break;
      case 4:
        setSelectedStatus(planStat[3]);
        refetch();
        break;
      case 5:
        setSelectedStatus(planStat[2]);
        refetch();
        break;
      case 6:
        setSelectedStatus(planStat[1]);
        refetch();
        break;
      default:
        break;
    }
  };

  const { error, loading, data, refetch } = useQuery(LOAD_PLANS_FILTER, {
    variables: {
      status: selectedStatus,
    },
  });

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
                    handleClick(6);
                    setSelectedDiv(0);
                  } else {
                    handleClick(5);
                    setSelectedDiv(0);
                  }
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
                {index === 1 && "Sẵn sàng"}
                {index === 2 && "Đã hủy"}
                {index === 3 && "Đã xác nhận"}
                {index === 4 && "Xuất bản"}
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
              if (e.target.value === "private") {
                handleClick(6);
                setSelectedDiv(0);
              } else {
                handleClick(5);
                setSelectedDiv(0);
              }
              setRegisterStatus(e.target.value);
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
              label="Riêng tư"
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
              label="Công khai"
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
