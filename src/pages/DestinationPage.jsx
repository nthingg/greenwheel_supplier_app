import { Link } from "react-router-dom";
import "../assets/scss/destinationPage.scss";
import "../assets/scss/shared.scss";
import ProductTable from "../components/ProductTable";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SearchIcon from "@mui/icons-material/Search";
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
    <div className="destination-page">
      <div className="sharedTitle">
        <div>
          <p className="title">Địa điểm</p>
          <p className="sub-title">Danh sách địa điểm</p>
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
      <div className="destinationContainer">
        <DestinationTable destinations={destinations} />
      </div>
    </div>
  );
};

export default DestinationPage;
