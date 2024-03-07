import { Link } from "react-router-dom";
import "../assets/scss/supplierPage.scss";
import "../assets/scss/shared.scss";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import SupplierTable from "../components/SupplierTable";
import { LOAD_SUPPLIERS_FILTER } from "../services/graphql/supplier";
import { IconButton } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import BedIcon from "@mui/icons-material/Bed";
import BuildIcon from "@mui/icons-material/Build";

const SupplierPage = () => {
  const suppType = [
    "RESTAURANT",
    "HOTEL",
    "GROCERY_STORE",
    "REPAIR_SHOP",
    "VEHICLE_RENTAL",
  ];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectStatus, setSelectedStatus] = useState(suppType);
  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedStatus(suppType);
        refetch();
        break;
      case 1:
        setSelectedStatus([suppType[0]]);
        refetch();
        break;
      case 2:
        setSelectedStatus([suppType[1]]);
        refetch();
        break;
      case 3:
        setSelectedStatus([suppType[2]]);
        refetch();
        break;
      case 4:
        setSelectedStatus([suppType[3]]);
        refetch();
        break;
      case 5:
        setSelectedStatus([suppType[4]]);
        refetch();
        break;
      default:
        break;
    }
  };

  const { error, loading, data, refetch } = useQuery(LOAD_SUPPLIERS_FILTER, {
    variables: {
      status: selectStatus,
    },
  });
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["suppliers"]["nodes"]) {
      let res = data.suppliers.nodes.map(({ __typename, ...rest }) => rest);
      setSuppliers(res);
    }
  }, [data, loading, error]);

  return (
    <div className="supplier">
      <div className="sharedTitle">
        <div>
          <p className="title">Nhà cung cấp</p>
          <p className="sub-title">Danh sách nhà cung cấp</p>
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
          <Link to="/suppliers/new" className="link">
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
      <div className="supplierContainer">
        <div className="icon-row ic-r-ml">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`icon-item ${selectedDiv === index ? "selected" : ""}`}
              onClick={() => {
                handleClick(index);
              }}
            >
              <IconButton color={"success"}>
                {/* Replace with appropriate icons */}
                {index === 0 && <FormatListBulletedIcon />}
                {index === 1 && <LocalDiningIcon />}
                {index === 2 && <BedIcon />}
                {index === 3 && <EmojiFoodBeverageIcon />}
                {index === 4 && <BuildIcon />}
                {index === 5 && <DirectionsCarFilledIcon />}
              </IconButton>
              <span>
                {index === 0 && "Tất cả"}
                {index === 1 && "Nhà hàng"}
                {index === 2 && "Khách sạn"}
                {index === 3 && "Tạp hóa"}
                {index === 4 && "Sữa chữa"}
                {index === 5 && "Xe cộ"}
              </span>
            </div>
          ))}
        </div>
        <SupplierTable suppliers={suppliers} />
      </div>
    </div>
  );
};

export default SupplierPage;
