//scss
import "../../assets/scss/transactionPage.scss";
import "../../assets/scss/header.scss";
import "../../assets/scss/filter.scss";
import "../../assets/scss/shared.scss";
//icon
import OrderTable from "../../components/tables/OrderTable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
//graphql
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  LOAD_NUMBERS_CANCELLED,
  LOAD_NUMBERS_COMPLAINED,
  LOAD_NUMBERS_FINISHED,
  LOAD_NUMBERS_PREPARED,
  LOAD_NUMBERS_RESERVED,
  LOAD_NUMBERS_SERVED,
  LOAD_ORDERS,
  LOAD_ORDERS_FILTER,
} from "../../services/graphql/order";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import BeenhereIcon from "@mui/icons-material/Beenhere";

const OrderPage = () => {
  const orderStatus = [
    "RESERVED",
    "PREPARED",
    "SERVED",
    "CANCELLED",
    "COMPLAINED",
    "FINISHED",
  ];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectStatus, setSelectedStatus] = useState(orderStatus[0]);
  const [orders, setOrders] = useState([]);

  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedStatus([orderStatus[0]]);
        break;
      case 1:
        setSelectedStatus([orderStatus[1]]);
        break;
      case 2:
        setSelectedStatus([orderStatus[2]]);
        break;
      case 3:
        setSelectedStatus([orderStatus[3]]);
        break;
      case 4:
        setSelectedStatus([orderStatus[4]]);
        break;
      case 5:
        setSelectedStatus([orderStatus[5]]);
        break;
      default:
        break;
    }
    refetch();
    refetchCancelled();
    refetchTemp();
    refetchComplained();
    refetchPrep();
    refetchFin();
    refetchReserve();
  };

  const {
    error: errReserve,
    loading: loadingReserve,
    data: dataReserve,
    refetch: refetchReserve,
  } = useQuery(LOAD_NUMBERS_RESERVED);
  const [reserved, setReserved] = useState(0);
  useEffect(() => {
    if (
      !loadingReserve &&
      !errReserve &&
      dataReserve &&
      dataReserve["orders"]
    ) {
      setReserved(dataReserve["orders"].totalCount);
    }
  }, [dataReserve, loadingReserve, errReserve]);

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
      setCancelled(dataPrep["orders"].totalCount);
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
      setCancelled(dataComplained["orders"].totalCount);
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
      setCancelled(dataFin["orders"].totalCount);
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

  const { error, loading, data, refetch } = useQuery(LOAD_ORDERS_FILTER, {
    variables: {
      status: selectStatus,
    },
  });

  useEffect(() => {
    if (!loading && !error && data.orders && data.orders.nodes) {
      let res = data.orders.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      console.log(res);
      setOrders(res);
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
    <div className="transaction">
      <div className="shared-title">
        <div>
          <p className="title">Đơn hàng</p>
          <p className="sub-title">Danh sách đơn hàng</p>
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
          <button className="link">
            <SearchIcon />
          </button>
        </div>
        <div className="right">
          <button className="link">
            <FilterAltIcon />
          </button>
          <button className="link">
            <CloudDownloadIcon />
          </button>
          <button
            className="link"
            onClick={() => {
              refetch();
              refetchCancelled();
              refetchTemp();
              refetchComplained();
              refetchPrep();
              refetchFin();
              refetchReserve();
            }}
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
      <div className="transactionContainer">
        <div className="icon-row">
          <Slider {...settings}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`icon-item ${
                  selectedDiv === index ? "selected" : ""
                }`}
                onClick={() => {
                  handleClick(index);
                }}
              >
                {/* Replace with appropriate icons */}
                {index === 0 && (
                  <HourglassTopRoundedIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 1 && <MicrowaveIcon sx={{ color: "#3498DB" }} />}
                {index === 2 && <CheckCircleIcon sx={{ color: "#3498DB" }} />}
                {index === 3 && <CancelIcon sx={{ color: "#3498DB" }} />}
                {index === 4 && <FeedbackIcon sx={{ color: "#3498DB" }} />}
                {index === 5 && <BeenhereIcon sx={{ color: "#3498DB" }} />}
                <span>
                  {index === 0 && `Đã đặt (${reserved})`}
                  {index === 1 && `Chuẩn bị (${prep})`}
                  {index === 2 && `Phục vụ (${temp})`}
                  {index === 3 && `Bị hủy (${cancelled})`}
                  {index === 4 && `Bị phản ánh (${complained})`}
                  {index === 5 && `Hoàn tất (${fin})`}
                </span>
              </div>
            ))}
          </Slider>
        </div>
        <OrderTable orders={orders} />
      </div>
    </div>
  );
};

export default OrderPage;
