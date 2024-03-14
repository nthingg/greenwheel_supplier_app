//scss
import "../assets/scss/transactionPage.scss";
//icon
import TransacionTable from "../components/TransactionTable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
//graphql
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { LOAD_ORDERS, LOAD_ORDERS_FILTER } from "../services/graphql/order";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";

const TransactionPage = () => {
  const iconColors = ["success", "error"]; // Define colors based on index
  const orderStatus = [
    "RESERVED",
    "PREPARED",
    "SERVED",
    "CANCELLED",
    "COMPLAINED",
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
      default:
        break;
    }
    refetch();
    refetchTotal();
  };

  const [reservedOrders, setReserved] = useState(0);
  const [prepOrders, setPrep] = useState(0);
  const [servedOrders, setServed] = useState(0);
  const [cancelledOrders, setCancelled] = useState(0);
  const [complainOrders, setComplain] = useState(0);
  const {
    error: errorTotal,
    loading: loadingTotal,
    data: dataTotal,
    refetch: refetchTotal,
  } = useQuery(LOAD_ORDERS);

  useEffect(() => {
    if (
      !loadingTotal &&
      !errorTotal &&
      dataTotal.orders &&
      dataTotal.orders.nodes
    ) {
      console.log(dataTotal);

      let countReserved = 0;
      for (const item of dataTotal["orders"]["nodes"]) {
        if (item["currentStatus"] === "RESERVED") {
          countReserved++;
        }
      }

      let countPrep = 0;
      for (const item of dataTotal["orders"]["nodes"]) {
        if (item["currentStatus"] === "PREPARED") {
          countPrep++;
        }
      }

      let countServed = 0;
      for (const item of dataTotal["orders"]["nodes"]) {
        if (item["currentStatus"] === "SERVED") {
          countServed++;
        }
      }

      let countCanceled = 0;
      for (const item of dataTotal["orders"]["nodes"]) {
        if (item["currentStatus"] === "CANCELLED") {
          countCanceled++;
        }
      }

      let countComplain = 0;
      for (const item of dataTotal["orders"]["nodes"]) {
        if (item["currentStatus"] === "COMPLAINED") {
          countComplain++;
        }
      }

      setReserved(countReserved);
      setPrep(countPrep);
      setServed(countServed);
      setCancelled(countCanceled);
      setComplain(countComplain);
    }
  }, [dataTotal, loadingTotal, errorTotal]);

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

  return (
    <div className="transaction">
      <div className="sharedTitle">
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
            <CloudDownloadIcon /> <span>Xuất file Excel</span>
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
      <div className="transactionContainer">
        <div className="icon-row ic-r-ml">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`icon-item ${selectedDiv === index ? "selected" : ""}`}
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
              <span>
                {index === 0 && `Đã đặt (${reservedOrders})`}
                {index === 1 && `Đã chuẩn bị (${prepOrders})`}
                {index === 2 && `Đã phục vụ (${servedOrders})`}
                {index === 3 && `Đã hủy (${cancelledOrders})`}
                {index === 4 && `Bị phản ánh (${complainOrders})`}
              </span>
            </div>
          ))}
        </div>
        <TransacionTable orders={orders} />
      </div>
    </div>
  );
};

export default TransactionPage;
