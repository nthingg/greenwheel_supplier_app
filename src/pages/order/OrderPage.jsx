//scss
import "../../assets/scss/transactionPage.scss";
import "../../assets/scss/header.scss";
import "../../assets/scss/filter.scss";
import "../../assets/scss/shared.scss";
//icon
import OrderTable from "../../components/tables/OrderTable";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import DescriptionIcon from "@mui/icons-material/Description";
//graphql
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  LOAD_NUMBERS_CANCELLED,
  LOAD_NUMBERS_COMPLAINED,
  LOAD_NUMBERS_FINISHED,
  LOAD_NUMBERS_ORDERS,
  LOAD_NUMBERS_PREPARED,
  LOAD_NUMBERS_RESERVED,
  LOAD_NUMBERS_SERVED,
  LOAD_ORDERS_FILTER,
  LOAD_ORDERS_FILTER_INIT,
  LOAD_ORDERS_FILTER_SEARCH,
} from "../../services/graphql/order";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import { useParams } from "react-router-dom";
import FilterModal from "../../components/others/OrderFilterModal";

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
  const [selectedDiv, setSelectedDiv] = useState(sbs ? parseInt(sbs, 10) : 0);
  const [selectStatus, setSelectedStatus] = useState(
    orderStatus[sbs ? parseInt(sbs, 10) : 0]
  );
  const [orderQuery, setorderQuery] = useState(LOAD_ORDERS_FILTER);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrder(orderStatus[sbs ? parseInt(sbs, 10) : 0]);
    fetchOrderStatus();
  }, []);

  const handleClick = (index) => {
    setSelectedDiv(index);
    setIsLoading(true);
    switch (index) {
      case 0:
        setSelectedStatus([orderStatus[0]]);
        if (searchTerm) {
          searchOrder(orderStatus[0], searchTerm);
        } else {
          fetchOrder([orderStatus[0]]);
        }
        break;
      case 1:
        setSelectedStatus([orderStatus[1]]);
        if (searchTerm) {
          searchOrder(orderStatus[1], searchTerm);
        } else {
          fetchOrder(orderStatus[1], [orderStatus[1]]);
        }
        break;
      case 2:
        setSelectedStatus([orderStatus[2]]);
        if (searchTerm) {
          searchOrder(orderStatus[2], searchTerm);
        } else {
          fetchOrder([orderStatus[2]]);
        }
        break;
      case 3:
        setSelectedStatus([orderStatus[3]]);
        if (searchTerm) {
          searchOrder(orderStatus[3], searchTerm);
        } else {
          fetchOrder([orderStatus[3]]);
        }
        break;
      case 4:
        setSelectedStatus([orderStatus[4]]);
        if (searchTerm) {
          searchOrder(orderStatus[4], searchTerm);
        } else {
          fetchOrder([orderStatus[4]]);
        }
        break;
      case 5:
        setSelectedStatus([orderStatus[5]]);
        if (searchTerm) {
          searchOrder(orderStatus[5], searchTerm);
        } else {
          fetchOrder([orderStatus[5]]);
        }
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

  const [getOrderInit, {}] = useLazyQuery(LOAD_ORDERS_FILTER_INIT, {
    fetchPolicy: "no-cache",
  });
  const [getOrder, {}] = useLazyQuery(LOAD_ORDERS_FILTER, {
    fetchPolicy: "no-cache",
  });
  const [search, {}] = useLazyQuery(LOAD_ORDERS_FILTER_SEARCH, {
    fetchPolicy: "no-cache",
  });
  const [getOrderStatus, {}] = useLazyQuery(LOAD_NUMBERS_ORDERS, {
    fetchPolicy: "no-cache",
  });

  const fetchOrder = async (selectStatus) => {
    const { data } = await getOrderInit({
      variables: {
        status: selectStatus,
      },
    });
    let ordersData = data.orders.edges;

    if (data.orders.pageInfo.hasNextPage === true) {
      let check = true;
      let currentEndCursor = data.orders.pageInfo.endCursor;
      while (check) {
        const { data: dataRefetch } = await getOrder({
          variables: { cursor: currentEndCursor, status: selectStatus },
        });

        ordersData = ordersData.concat(dataRefetch.orders.edges);

        if (dataRefetch.orders.pageInfo.hasNextPage === true) {
          currentEndCursor = dataRefetch.orders.pageInfo.endCursor;
        } else {
          check = false;
        }
      }
    }

    let res = ordersData.map((node, index) => {
      const { __typename, ...rest } = node;
      return { ...rest, index: index + 1 }; // Add the index to the object
    });
    setOrders(res);
    setIsLoading(false);
  };

  const fetchOrderStatus = async () => {
    orderStatus.forEach(async (status, index) => {
      const { data } = await getOrderStatus({
        variables: {
          status: status,
        },
      });
      const totalCount = data.orders.totalCount;
      switch (index) {
        case 0: {
          setReserved(totalCount);
          break;
        }
        case 1: {
          setPrep(totalCount);
          break;
        }
        case 2: {
          setTemp(totalCount);
          break;
        }
        case 3: {
          setFin(totalCount);
          break;
        }
        case 4: {
          setComplained(totalCount);
          break;
        }
        case 5: {
          setCancelled(totalCount);
          break;
        }
      }
    });

    setIsLoading(false);
  };

  const searchOrder = async (selectStatus, searchTerm) => {
    const { data } = await search({
      variables: {
        status: selectStatus,
        id: searchTerm,
      },
    });

    const orders = data.orders.edges;

    let res = orders.map((node, index) => {
      const { __typename, ...rest } = node;
      return { ...rest, index: index + 1 };
    });

    setOrders(res);
    setIsLoading(false);
    return res;
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
  }, [dataReserve, loadingReserve, errReserve, searchTerm]);

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
  }, [dataCancelled, loadingCancelled, errorCancelled, searchTerm]);

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
  }, [dataPrep, loadingPrep, errorPrep, searchTerm]);

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
  }, [dataComplained, loadingComplained, errorComplained, searchTerm]);

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
  }, [dataFin, loadingFin, errorFin, searchTerm]);

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
  }, [dataTemp, loadingTemp, errorTemp, searchTerm]);

  const { error, loading, data, refetch } = useQuery(orderQuery, {
    variables: {
      status: selectStatus,
      id: searchTerm,
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

  const handleSearchSubmit = async () => {
    setIsLoading(true);
    const searchTerm = document.getElementById("floatingValue").value;
    if (!searchTerm) {
      setIsLoading(false);
      return;
    }
    if (!isNaN(searchTerm)) {
      const searchTermInt = parseInt(searchTerm, 10);
      setSearchTerm(searchTermInt);

      const res = await searchOrder(orderStatus, searchTermInt);
      if (res[0]) {
        const order = res[0].node;
        changeCount(order.currentStatus);
      } else {
        changeCount(null);
      }
      await searchOrder(selectStatus, searchTermInt);
    }
  };

  const changeCount = (status) => {
    setReserved(0);
    setPrep(0);
    setCancelled(0);
    setTemp(0);
    setComplained(0);
    refetchPrep(0);
    setFin(0);
    if (status) {
      switch (status) {
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
    }
  };

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
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
          />
          <button
            className="link"
            onClick={() => {
              handleSearchSubmit();
            }}
          >
            <SearchIcon />
          </button>
        </div>
        <div className="right">
          <FilterModal />
          {/* <button className="link">
            <CloudDownloadIcon />
          </button> */}
          <button
            className="link"
            onClick={() => {
              setSearchTerm(null);
              document.getElementById("floatingValue").value = "";
              setIsLoading(true);
              refetch();
              refetchCancelled();
              refetchTemp();
              refetchComplained();
              refetchPrep();
              refetchFin();
              refetchReserve();
              fetchOrder(selectStatus);
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
                {index === 0 && <DescriptionIcon sx={{ color: "#3498DB" }} />}
                {index === 1 && <MicrowaveIcon sx={{ color: "#F1C40F" }} />}
                {index === 2 && <CheckCircleIcon sx={{ color: "#28b463" }} />}
                {index === 3 && <PaidIcon sx={{ color: "#28b463" }} />}
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
        {!isLoading && <OrderTable orders={orders} />}
      </div>
    </div>
  );
};

export default OrderPage;
