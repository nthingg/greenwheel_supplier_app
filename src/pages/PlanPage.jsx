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
import NoCrashIcon from "@mui/icons-material/NoCrash";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
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
import Slider from "react-slick";

const PlanPage = () => {
  const planStat = [
    "REGISTERING",
    "READY",
    "VERIFIED",
    "CANCELED",
    "COMPLETED",
    "FLAWED",
  ];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(planStat[0]);
  const [isHidden, setIsHidden] = useState(false);
  const [isReadyHidden, setIsReadyHidden] = useState(true);
  const [isVeriHidden, setIsVeriHidden] = useState(true);
  const [registerReadyStatus, setRegisterReadyStatus] = useState("incoming");
  const [registerVeriStatus, setRegisterVeriStatus] = useState("happening");

  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedStatus(planStat[0]);
        break;
      case 1:
        setSelectedStatus(planStat[1]);
        break;
      case 2:
        setSelectedStatus(planStat[2]);
        break;
      case 3:
        setSelectedStatus(planStat[3]);
        break;
      case 4:
        setSelectedStatus(planStat[4]);
        break;
      case 5:
        setSelectedStatus(planStat[5]);
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

  const [registeringPlans, setRegisteringPlans] = useState(0);
  const [canceledPlans, setCanceled] = useState(0);
  const [completedPlans, setCompletedPlans] = useState(0);
  const [readyPlans, setReady] = useState(0);
  const [flawedPlans, setFlawedPlans] = useState(0);
  const [verified, setVerifiedPlans] = useState(0);
  useEffect(() => {
    if (
      !loadingTotal &&
      !errorTotal &&
      dataTotal &&
      dataTotal["plans"]["nodes"]
    ) {
      let countRegistering = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "REGISTERING") {
          countRegistering++;
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

      let countCompleted = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "COMPLETED") {
          countCompleted++;
        }
      }

      let countFlawed = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "FLAWED") {
          countFlawed++;
        }
      }

      let countVeri = 0;
      for (const item of dataTotal["plans"]["nodes"]) {
        if (item["status"] === "VERIFIED") {
          countVeri++;
        }
      }

      setRegisteringPlans(countRegistering);
      setReady(countReady);
      setCanceled(countCanceled);
      setCompletedPlans(countCompleted);
      setFlawedPlans(countFlawed);
      setVerifiedPlans(countVeri);
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

  var settings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 2,
    centerPadding: "60px",
  };

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
              refetchTotal();
            }}
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
      <div className="planContainer">
        <div className="icon-row">
          <Slider {...settings}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`icon-item ${
                  selectedDiv === index ? "selected" : ""
                }`}
                onClick={() => {
                  // if (index == 0) {
                  //   setIsHidden(false);
                  //   setIsReadyHidden(true);
                  //   setIsVeriHidden(true);
                  // } else if (index == 1) {
                  //   setIsReadyHidden(false);
                  //   setIsHidden(true);
                  //   setIsVeriHidden(true);
                  // } else if (index == 3) {
                  //   setIsReadyHidden(true);
                  //   setIsHidden(true);
                  //   setIsVeriHidden(false);
                  // } else {
                  //   setIsHidden(true);
                  //   setIsReadyHidden(true);
                  //   setIsVeriHidden(true);
                  // }
                  handleClick(index);
                }}
              >
                {/* Replace with appropriate icons */}
                {index === 0 && (
                  <AppRegistrationIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 1 && (
                  <PlaylistAddCheckIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 2 && <NoCrashIcon sx={{ color: "#3498DB" }} />}
                {index === 3 && <CancelIcon sx={{ color: "#E74C3C" }} />}
                {index === 4 && <CheckCircleIcon color="success" />}
                {index === 5 && <BuildCircleIcon sx={{ color: "#3498DB" }} />}
                <span>
                  {index === 0 && `Chờ chốt (${registeringPlans})`}
                  {index === 1 && `Sẵn sàng (${readyPlans})`}
                  {index === 2 && `Check-in (${verified})`}
                  {index === 3 && `Đã hủy (${canceledPlans})`}
                  {index === 4 && `Đã hoàn thành (${completedPlans})`}
                  {index === 5 && `Có vấn đề (${flawedPlans})`}
                </span>
              </div>
            ))}
          </Slider>
        </div>
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

        <PlanTable plans={plans} />
      </div>
    </div>
  );
};

export default PlanPage;
