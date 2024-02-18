import "../assets/scss/transactionPage.scss";
import TransacionTable from "../components/TransactionTable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOAD_ORDERS } from "../services/queries";

const TransactionPage = () => {
  const { error, loading, data, refetch } = useQuery(LOAD_ORDERS);
  const [orders, setOrders] = useState([]);
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
        <p>Danh sách hóa đơn</p>
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
        <TransacionTable orders={orders} />
      </div>
    </div>
  );
};

export default TransactionPage;
