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
  LOAD_ORDERS_FILTER_SEARCH,
} from "../../services/graphql/order";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import { useParams } from "react-router-dom";

const OrderPage = () => {
  const { sbs } = useParams();
  const orderStatus = [
    "RESERVED",
    "PREPARED",
    "SERVED",
    "FINISHED",
    "COMPLAINED",
    "CANCELLED",
  ];
  const [selectedDiv, setSelectedDiv] = useState(
    sbs ? parseInt(sbs, 10) : 0
  );
  const [selectStatus, setSelectedStatus] = useState(
    orderStatus[sbs ? parseInt(sbs, 10) : 0]
  );
  const [orderQuery, setorderQuery] = useState(LOAD_ORDERS_FILTER);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
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

  const { error, loading, data, refetch } = useQuery(orderQuery, {
    variables: {
      status: selectStatus,
      id: searchTerm
    },
  });

  useEffect(() => {
    if (!loading && !error && data.orders && data.orders.nodes) {
      let res = data.orders.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setOrders(res);
    }
  }, [data, loading, error]);

  const handleSearchSubmit = () => {
    const searchTerm = document.getElementById('floatingValue').value;
    const searchTermInt = parseInt(searchTerm);
    setorderQuery(LOAD_ORDERS_FILTER_SEARCH);
    setSearchTerm(searchTermInt);
    refetch();
    setReserved(0);
    setPrep(0);
    setCancelled(0);
    setTemp(0);
    setComplained(0);
    refetchPrep(0);
    setFin(0);
    console.log(selectStatus[0]);
    switch (selectStatus) {
      case "RESERVED": {
        setReserved(1);
        break;
      }
      case "PREPARED": {
        setPrep(1);
        break;
      }
      case "SERVED": {
        setTemp(1);
        break;
      }
      case "FINISHED": {
        setFin(1);
        break;
      }
      case "COMPLAINED": {
        setComplained(1);
        break;
      }
      case "CANCELLED": {
        setCancelled(1);
        break;
      }
    }
    setIsLoading(false);
  }

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
            placeholder="Nhập mã đơn hàng..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsLoading(true);
                handleSearchSubmit();
              }
            }}
          />
          <button className="link" 
          onClick={() => {
            setIsLoading(true);
            handleSearchSubmit();
          }}>
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
              setSearchTerm(null);
              setIsLoading(true);
              refetch();
              refetchCancelled();
              refetchTemp();
              refetchComplained();
              refetchPrep();
              refetchFin();
              refetchReserve();
              setTimeout(() => {
                setIsLoading(false);
              }, 3000);
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
                className={`icon-item ${selectedDiv === index ? "selected" : ""
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
                {index === 2 && <CheckCircleIcon sx={{ color: "#28b463" }} />}
                {index === 3 && <BeenhereIcon sx={{ color: "#28b463" }} />}
                {index === 4 && <FeedbackIcon sx={{ color: "#3498DB" }} />}
                {index === 5 && <CancelIcon sx={{ color: "#e74c3c" }} />}
                <span>
                  {index === 0 && `Đã đặt (${reserved})`}
                  {index === 1 && `Chuẩn bị (${prep})`}
                  {index === 2 && `Phục vụ (${temp})`}
                  {index === 3 && `Hoàn tất (${fin})`}
                  {index === 4 && `Bị phản ánh (${complained})`}
                  {index === 5 && `Bị hủy (${cancelled})`}
                </span>
              </div>
            ))}
          </Slider>
        </div>
        {isLoading && (
          <div className="loading">
            <RestartAltIcon
              sx={{
                fontSize: 80,
                color: "#2c3d50",
              }}
            />
          </div>
        )}
        {!isLoading && (
          <OrderTable orders={orders} />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
