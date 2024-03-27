import "../assets/scss/home.scss";
import "../assets/scss/shared.scss";

import Widget from "../components/Widget";
import Featured from "../components/Featured";
import Chart from "../components/Chart";
import Table from "../components/Table";
import ForwardIcon from "@mui/icons-material/Forward";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useQuery } from "@apollo/client";

import { useEffect, useState } from "react";
import { LOAD_SUPPLIERS } from "../services/queries";
import {
  LOAD_NUMBERS_CANCELED,
  LOAD_NUMBERS_COMPLETED,
  LOAD_NUMBERS_FLAWED,
  LOAD_NUMBERS_READY,
  LOAD_NUMBERS_REGISTERING,
} from "../services/graphql/plan";
import { LOAD_DESTINATIONS } from "../services/graphql/destination";
import { LOAD_ACCOUNTS_TRAVELER } from "../services/graphql/account";

const AdminHomePage = () => {
  const { error, loading, data, refetch } = useQuery(LOAD_NUMBERS_REGISTERING);
  const [registering, setRegistering] = useState(0);
  useEffect(() => {
    if (!loading && !error && data && data["plans"]["nodes"]) {
      let res = data.plans.nodes.map(({ __typename, ...rest }) => rest);
      setRegistering(res.length);
    }
  }, [data, loading, error]);

  const {
    error: errorTravelers,
    loading: loadingTravelers,
    data: dataTravelers,
    refetch: refetchTravelers,
  } = useQuery(LOAD_ACCOUNTS_TRAVELER);
  const [travelers, setTravelers] = useState(0);
  useEffect(() => {
    if (
      !loadingTravelers &&
      !errorTravelers &&
      dataTravelers &&
      dataTravelers["accounts"]["nodes"]
    ) {
      let res = dataTravelers.accounts.nodes.map(
        ({ __typename, ...rest }) => rest
      );
      setTravelers(res.length);
    }
  }, [dataTravelers, loadingTravelers, errorTravelers]);

  const {
    error: errDestinations,
    loading: loadingDestinations,
    data: dataDestinations,
    refetch: refetchDestination,
  } = useQuery(LOAD_DESTINATIONS);
  const [destinations, setDestination] = useState(0);
  useEffect(() => {
    if (
      !loadingDestinations &&
      !errDestinations &&
      dataDestinations &&
      dataDestinations["destinations"]["nodes"]
    ) {
      let res = dataDestinations.destinations.nodes.map(
        ({ __typename, ...rest }) => rest
      );
      setDestination(res.length);
    }
  }, [dataDestinations, loadingDestinations, errDestinations]);

  const {
    errorCancelled,
    loadingCancelled,
    data: dataCancelled,
    refetch: refetchCancelled,
  } = useQuery(LOAD_NUMBERS_CANCELED);
  const [cancelled, setCancelled] = useState(0);
  useEffect(() => {
    if (
      !loadingCancelled &&
      !errorCancelled &&
      dataCancelled &&
      dataCancelled["plans"]["nodes"]
    ) {
      let res = dataCancelled.plans.nodes.map(
        ({ __typename, ...rest }) => rest
      );
      setCancelled(res.length);
    }
  }, [dataCancelled, loadingCancelled, errorCancelled]);

  const {
    error: errComplete,
    loading: loadingComplete,
    data: dataComplete,
    refetch: refetchComplete,
  } = useQuery(LOAD_NUMBERS_COMPLETED);
  const [completed, setCompleted] = useState(0);
  useEffect(() => {
    if (
      !loadingComplete &&
      !errComplete &&
      dataComplete &&
      dataComplete["plans"]["nodes"]
    ) {
      let res = dataComplete.plans.nodes.map(({ __typename, ...rest }) => rest);
      setCompleted(res.length);
    }
  }, [dataComplete, loadingComplete, errComplete]);

  const {
    errorTemp,
    loadingTemp,
    data: dataTemp,
    refetch: refetchTemp,
  } = useQuery(LOAD_NUMBERS_READY);
  const [temp, setTemp] = useState(0);
  useEffect(() => {
    if (!loadingTemp && !errorTemp && dataTemp && dataTemp["plans"]["nodes"]) {
      let res = dataTemp.plans.nodes.map(({ __typename, ...rest }) => rest);
      setTemp(res.length);
    }
  }, [dataTemp, loadingTemp, errorTemp]);

  const {
    error: errorFlawed,
    loading: loadingFlawed,
    data: dataFlawed,
    refetch: refetchFlawed,
  } = useQuery(LOAD_NUMBERS_FLAWED);
  const [flawed, setFlawed] = useState(0);
  useEffect(() => {
    if (
      !loadingFlawed &&
      !errorFlawed &&
      dataFlawed &&
      dataFlawed["plans"]["nodes"]
    ) {
      let res = dataFlawed.plans.nodes.map(({ __typename, ...rest }) => rest);
      setFlawed(res.length);
    }
  }, [dataFlawed, loadingFlawed, errorFlawed]);

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup function to stop the timer when the component unmounts
  }, []);

  return (
    <div className="home">
      <div className="sharedTitle">
        <div>
          <p className="title">Trang chủ</p>
          <p className="sub-title">Thông tin hệ thống </p>
        </div>
      </div>
      <div className="home_container">
        <div className="refresh-container">
          <div className="left">
            <p>Hôm nay: {date.toLocaleString()}</p>
          </div>
          <div className="right">
            <button
              className="link"
              onClick={() => {
                refetch();
                refetchCancelled();
                refetchFlawed();
                refetchTemp();
                refetchDestination();
                refetchComplete();
                refetchTravelers();
              }}
            >
              <RefreshIcon />
            </button>
          </div>
        </div>
        <div className="item-list">
          <div className="item-container temp">
            <div className="item-top">
              <div className="item-title">Số kế hoạch chờ chốt</div>
              <div className="item-body">
                <div className="left">
                  <p>{registering}</p>
                </div>
                <div className="right">
                  <div className="btn temp">
                    <ErrorOutlineOutlinedIcon
                      sx={{ fontSize: 90, color: "white" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="item-bottom temp">
              <a href="">
                Xem chi tiết <ForwardIcon />
              </a>
            </div>
          </div>
          <div className="item-container info">
            <div className="item-top">
              <div className="item-title">Số kế hoạch đã sẵn sàng</div>
              <div className="item-body">
                <div className="left">
                  <p>{temp}</p>
                </div>
                <div className="right">
                  <div className="btn info">
                    <InfoIcon sx={{ fontSize: 90, color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="item-bottom info">
              <a href="">
                Xem chi tiết <ForwardIcon />
              </a>
            </div>
          </div>
          <div className="item-container success">
            <div className="item-top">
              <div className="item-title">Số kế hoạch đã hoàn thành</div>
              <div className="item-body">
                <div className="left">
                  <p>{completed}</p>
                </div>
                <div className="right">
                  <div className="btn success">
                    <CheckCircleOutlineOutlinedIcon
                      sx={{ fontSize: 90, color: "white" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="item-bottom success">
              <a href="">
                Xem chi tiết <ForwardIcon />
              </a>
            </div>
          </div>
          <div className="item-container info">
            <div className="item-top">
              <div className="item-title">Số kế hoạch lỗi</div>
              <div className="item-body">
                <div className="left">
                  <p>{flawed}</p>
                </div>
                <div className="right">
                  <div className="btn info">
                    <InfoIcon sx={{ fontSize: 90, color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="item-bottom info">
              <a href="">
                Xem chi tiết <ForwardIcon />
              </a>
            </div>
          </div>
          <div className="item-container cancel">
            <div className="item-top">
              <div className="item-title">Số kế hoạch đã hủy</div>
              <div className="item-body">
                <div className="left">
                  <p>{cancelled}</p>
                </div>
                <div className="right">
                  <div className="btn cancel">
                    <CancelOutlinedIcon sx={{ fontSize: 90, color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="item-bottom cancel">
              <a href="">
                Xem chi tiết <ForwardIcon />
              </a>
            </div>
          </div>
          <div className="item-container info">
            <div className="item-top">
              <div className="item-title">Số địa điểm trong hệ thống</div>
              <div className="item-body">
                <div className="left">
                  <p>{destinations}</p>
                </div>
                <div className="right">
                  <div className="btn info">
                    <InfoIcon sx={{ fontSize: 90, color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="item-bottom info">
              <a href="">
                Xem chi tiết <ForwardIcon />
              </a>
            </div>
          </div>
          <div className="item-container info">
            <div className="item-top">
              <div className="item-title">Số phượt thủ hiện tại</div>
              <div className="item-body">
                <div className="left">
                  <p>{travelers}</p>
                </div>
                <div className="right">
                  <div className="btn info">
                    <InfoIcon sx={{ fontSize: 90, color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="item-bottom info">
              <a href="">
                Xem chi tiết <ForwardIcon />
              </a>
            </div>
          </div>
        </div>
        {/* <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={3 / 1} />
        </div> */}
        {/* <div className="list_container">
          <div className="list_title">Latest Transaction</div>
          <Table />
        </div> */}
      </div>
    </div>
  );
};

export default AdminHomePage;
