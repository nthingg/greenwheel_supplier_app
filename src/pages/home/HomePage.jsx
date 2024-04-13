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
  LOAD_NUMBERS_COMPLAINED,
  LOAD_NUMBERS_FINISHED,
  LOAD_NUMBERS_PREPARED,
  LOAD_NUMBERS_RESERVED,
  LOAD_NUMBERS_SERVED,
} from "../../services/graphql/order";
import { useEffect, useState } from "react";
import { LOAD_SUPPLIERS } from "../../services/graphql/provider";

const HomePage = () => {
  const { error, loading, data, refetch } = useQuery(LOAD_NUMBERS_RESERVED);
  const [reserved, setReserved] = useState(0);
  useEffect(() => {
    if (!loading && !error && data && data["orders"]) {
      setReserved(data["orders"].totalCount);
    }
  }, [data, loading, error]);

  const {
    error: errorCancelled,
    loading: loadingCancelled,
    data: dataCancelled,
    refetch: refetchCancelled,
  } = useQuery(LOAD_NUMBERS_CANCELLED);
  const [cancelled, setCancelled] = useState(0);
  useEffect(() => {
    if (
      !loadingCancelled &&
      !errorCancelled &&
      dataCancelled &&
      dataCancelled["orders"]
    ) {
      setCancelled(dataCancelled["orders"].totalCount);
    }
  }, [dataCancelled, loadingCancelled, errorCancelled]);

  const {
    error: errorPrep,
    loading: loadingPrep,
    data: dataPrep,
    refetch: refetchPrep,
  } = useQuery(LOAD_NUMBERS_PREPARED);
  const [prep, setPrep] = useState(0);
  useEffect(() => {
    if (!loadingPrep && !errorPrep && dataPrep && dataPrep["orders"]) {
      setPrep(dataPrep["orders"].totalCount);
    }
  }, [dataPrep, loadingPrep, errorPrep]);

  const {
    error: errorComplained,
    loading: loadingComplained,
    data: dataComplained,
    refetch: refetchComplained,
  } = useQuery(LOAD_NUMBERS_COMPLAINED);
  const [complained, setComplained] = useState(0);
  useEffect(() => {
    if (
      !loadingComplained &&
      !errorComplained &&
      dataComplained &&
      dataComplained["orders"]
    ) {
      setComplained(dataComplained["orders"].totalCount);
    }
  }, [dataComplained, loadingComplained, errorComplained]);

  const {
    error: errorFin,
    loading: loadingFin,
    data: dataFin,
    refetch: refetchFin,
  } = useQuery(LOAD_NUMBERS_FINISHED);
  const [fin, setFin] = useState(0);
  useEffect(() => {
    if (!loadingFin && !errorFin && dataFin && dataFin["orders"]) {
      setFin(dataFin["orders"].totalCount);
    }
  }, [dataFin, loadingFin, errorFin]);

  const {
    error: errorTemp,
    loading: loadingTemp,
    data: dataTemp,
    refetch: refetchTemp,
  } = useQuery(LOAD_NUMBERS_SERVED);
  const [temp, setTemp] = useState(0);
  useEffect(() => {
    if (!loadingTemp && !errorTemp && dataTemp && dataTemp["orders"]) {
      setTemp(dataTemp["orders"].totalCount);
    }
  }, [dataTemp, loadingTemp, errorTemp]);

  const {
    error: errorSupp,
    loading: loadingSupp,
    data: dataSupp,
    refetch: refetchSupp,
  } = useQuery(LOAD_SUPPLIERS);
  const [supp, setSupp] = useState(0);
  useEffect(() => {
    if (!loadingSupp && !errorSupp && dataSupp && dataSupp["providers"]) {
      setSupp(dataSupp["providers"].totalCount);
    }
  }, [dataSupp, loadingSupp, errorSupp]);

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
                refetchComplained();
                refetchPrep();
                refetchFin();
              }}
            >
              <RefreshIcon />
            </button>
          </div>
        </div>
        <div className="item-list">
          <div className="item-container info">
            <div className="item-top">
              <div className="item-title">Số đơn hàng được đặt</div>
              <div className="item-body">
                <div className="left">
                  <p>{reserved}</p>
                </div>
                <div className="right">
                  <div className="btn info">
                    <InfoIcon sx={{ color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-container temp">
            <div className="item-top">
              <div className="item-title">Số đơn hàng chuẩn bị</div>
              <div className="item-body">
                <div className="left">
                  <p>{prep}</p>
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
              <div className="item-title">Số đơn hàng phục vụ</div>
              <div className="item-body">
                <div className="left">
                  <p>{temp}</p>
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
              <div className="item-title">Số đơn hàng bị hủy</div>
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
              <div className="item-title">Số đơn hàng bị phản ánh</div>
              <div className="item-body">
                <div className="left">
                  <p>{complained}</p>
                </div>
                <div className="right">
                  <div className="btn info">
                    <InfoIcon sx={{ color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-container success">
            <div className="item-top">
              <div className="item-title">Số đơn hàng hoàn tất</div>
              <div className="item-body">
                <div className="left">
                  <p>{fin}</p>
                </div>
                <div className="right">
                  <div className="btn success">
                    <CheckCircleOutlineOutlinedIcon sx={{ color: "white" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-container info">
            <div className="item-top">
              <div className="item-title">Số lượng nhà cung cấp</div>
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
          <div className="item-container info" style={{ border: "none" }}></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
