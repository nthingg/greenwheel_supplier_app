import { Link } from "react-router-dom";
import "../assets/scss/supplierDetail.scss";
import "../assets/scss/shared.scss";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOAD_SUPPLIERS } from "../services/queries";
import SupplierTable from "../components/SupplierTable";

const SupplierPage = () => {
  const { error, loading, data, refetch } = useQuery(LOAD_SUPPLIERS);
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["suppliers"]["nodes"]) {
      let res = data.suppliers.nodes.map(({ __typename, ...rest }) => rest);
      setSuppliers(res);
    }
  }, [data, loading, error]);

  return (
    <div className="product">
      <div className="sharedTitle">
        <p>Danh sách nhà cung cấp</p>
      </div>
      <div className="productContainer">
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
            <Link to="/products/new" className="link">
              <AddIcon />
              <span>Thêm nhà cung cấp</span>
            </Link>
            <button className="link">
              <FilterAltIcon />
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
        <SupplierTable suppliers={suppliers} />
      </div>
    </div>
  );
};

export default SupplierPage;
