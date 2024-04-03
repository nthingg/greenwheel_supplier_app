import "../../assets/scss/home.scss";
import "../../assets/scss/shared.scss";
import ForwardIcon from "@mui/icons-material/Forward";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useQuery } from "@apollo/client";
import {
  LOAD_NUMBERS_CANCELLED,
  LOAD_NUMBERS_RESERVED,
  LOAD_NUMBERS_TEMPORARY,
} from "../../services/graphql/order";
import { useEffect, useState } from "react";
import { LOAD_SUPPLIERS } from "../../services/graphql/provider";

const HomePage = () => {
  const { error, loading, data, refetch } = useQuery(LOAD_NUMBERS_RESERVED);
  const [reserved, setReserved] = useState(0);
  useEffect(() => {
    if (!loading && !error && data && data["orders"]["nodes"]) {
      let res = data.orders.nodes.map(({ __typename, ...rest }) => rest);
      setReserved(res.length);
    }
  }, [data, loading, error]);

  const {
    errorCancelled,
    loadingCancelled,
    data: dataCancelled,
    refetch: refetchCancelled,
  } = useQuery(LOAD_NUMBERS_CANCELLED);
  const [cancelled, setCancelled] = useState(0);
  useEffect(() => {
    if (
      !loadingCancelled &&
      !errorCancelled &&
      dataCancelled &&
      dataCancelled["orders"]["nodes"]
    ) {
      let res = dataCancelled.orders.nodes.map(
        ({ __typename, ...rest }) => rest
      );
      setCancelled(res.length);
    }
  }, [dataCancelled, loadingCancelled, errorCancelled]);

  const {
    errorTemp,
    loadingTemp,
    data: dataTemp,
    refetch: refetchTemp,
  } = useQuery(LOAD_NUMBERS_TEMPORARY);
  const [temp, setTemp] = useState(0);
  useEffect(() => {
    if (!loadingTemp && !errorTemp && dataTemp && dataTemp["orders"]["nodes"]) {
      let res = dataTemp.orders.nodes.map(({ __typename, ...rest }) => rest);
      setTemp(res.length);
    }
  }, [dataTemp, loadingTemp, errorTemp]);

  const {
    errorSupp,
    loadingSupp,
    data: dataSupp,
    refetch: refetchSupp,
  } = useQuery(LOAD_SUPPLIERS);
  const [supp, setSupp] = useState(0);
  useEffect(() => {
    if (
      !loadingSupp &&
      !errorSupp &&
      dataSupp &&
      dataSupp["suppliers"]["nodes"]
    ) {
      let res = dataSupp.suppliers.nodes.map(({ __typename, ...rest }) => rest);
      setSupp(res.length);
    }
  }, [dataTemp, loadingTemp, errorTemp]);

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup function to stop the timer when the component unmounts
  }, []);

  return (
    <div className="home">
      <div className="shared-title">
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
                refetchSupp();
                refetchTemp();
              }}
            >
              <RefreshIcon />
            </button>
          </div>
        </div>
        <div className="item-list">
          <div className="item-container temp">
            <div className="item-top">
              <div className="item-title">Số đơn hàng tạm thời</div>
              <div className="item-body">
                <div className="left">
                  <p>{temp}</p>
                </div>
                <div className="right">
                  <div className="btn temp">
                    <ErrorOutlineOutlinedIcon sx={{ color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-container success">
            <div className="item-top">
              <div className="item-title">Số đơn hàng đã xác nhận</div>
              <div className="item-body">
                <div className="left">
                  <p>{reserved}</p>
                </div>
                <div className="right">
                  <div className="btn success">
                    <CheckCircleOutlineOutlinedIcon sx={{ color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-container cancel">
            <div className="item-top">
              <div className="item-title">Số đơn hàng đã hủy</div>
              <div className="item-body">
                <div className="left">
                  <p>{cancelled}</p>
                </div>
                <div className="right">
                  <div className="btn cancel">
                    <CancelOutlinedIcon sx={{ color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-container info">
            <div className="item-top">
              <div className="item-title">Số nhà cung cấp trong hệ thống</div>
              <div className="item-body">
                <div className="left">
                  <p>{supp}</p>
                </div>
                <div className="right">
                  <div className="btn info">
                    <InfoIcon sx={{ color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
