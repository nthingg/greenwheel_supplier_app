import "../assets/scss/transactionPage.scss";
import TransacionTable from "../components/TransactionTable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOAD_ORDERS_FILTER } from "../services/queries";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton } from "@mui/material";

const TransactionPage = () => {
  const iconColors = ["success", "error"]; // Define colors based on index
  const orderStatus = ["RESERVED", "CANCELLED"];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectStatus, setSelectedStatus] = useState(orderStatus[0]);
  const [orders, setOrders] = useState([]);

  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedStatus([orderStatus[0]]);
        refetch();
        break;
      case 1:
        setSelectedStatus([orderStatus[1]]);
        refetch();
        break;
      default:
        break;
    }
  };

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
        <p>Danh sách đơn hàng</p>
      </div>
      <div className="transactionContainer">
        <div className="tableHeader">
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
        <div className="icon-row">
          {[0, 1].map((index) => (
            <div
              key={index}
              className={`icon-item ${selectedDiv === index ? "selected" : ""}`}
              onClick={() => {
                handleClick(index);
              }}
            >
              <IconButton color={iconColors[index]}>
                {/* Replace with appropriate icons */}
                {index === 0 && <CheckBoxIcon />}
                {index === 1 && <CancelIcon />}
              </IconButton>
              <span>
                {index === 0 && "Đã chấp nhận"}
                {index === 1 && "Đã hủy"}
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
