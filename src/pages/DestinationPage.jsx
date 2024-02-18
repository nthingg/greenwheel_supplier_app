import { Link } from "react-router-dom";
import "../assets/scss/productPage.scss";
import "../assets/scss/shared.scss";
import ProductTable from "../components/ProductTable";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOAD_DESTINATIONS, LOAD_PRODUCTS } from "../services/queries";
import DestinationTable from "../components/DestinationTable";

const DestinationPage = () => {
  const { error, loading, data, refetch } = useQuery(LOAD_DESTINATIONS);
  const [destinations, setDestinations] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["destinations"]["nodes"]) {
      let res = data.destinations.nodes.map(({ __typename, ...rest }) => rest);
      setDestinations(res);
    }
  }, [data, loading, error]);

  return (
    <div className="product">
      <div className="sharedTitle">
        <p>Danh sách địa điểm</p>
      </div>
      <div className="productContainer">
        <div className="tableHeader">
          <div className="left">
            <input
              type="text"
              className={"form-control"}
              id="floatingValue"
              name="value"
              placeholder="Tìm kiếm bằng STT, tên địa điểm, vị trí..."
            />
          </div>
          <div className="right">
            <Link to="/products/new" className="link">
              <AddIcon />
              <span>Thêm địa điểm</span>
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
        <DestinationTable destinations={destinations} />
      </div>
    </div>
  );
};

export default DestinationPage;
