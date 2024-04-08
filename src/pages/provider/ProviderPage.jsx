import { Link } from "react-router-dom";
import "../../assets/scss/providers.scss";
import "../../assets/scss/header.scss";
import "../../assets/scss/filter.scss";
import "../../assets/scss/shared.scss";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ProviderTable from "../../components/tables/ProviderTable";
import { LOAD_SUPPLIERS_FILTER } from "../../services/graphql/provider";
import { IconButton } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import BedIcon from "@mui/icons-material/Bed";
import BuildIcon from "@mui/icons-material/Build";
import Slider from "react-slick";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const ProviderPage = () => {
  const suppType = [
    "EMERGENCY",
    "FOOD_STALL",
    "GROCERY",
    "HOTEL",
    "MOTEL",
    "REPAIR",
    "RESTAURANT",
    "TAXI",
    "VEHICLE_RENTAL",
  ];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectStatus, setSelectedStatus] = useState(suppType);
  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedStatus(suppType);
        break;
      case 1:
        setSelectedStatus([suppType[0]]);
        break;
      case 2:
        setSelectedStatus([suppType[1]]);
        break;
      case 3:
        setSelectedStatus([suppType[2]]);
        break;
      case 4:
        setSelectedStatus([suppType[3]]);
        break;
      case 5:
        setSelectedStatus([suppType[4]]);
        break;
      case 6:
        setSelectedStatus([suppType[5]]);
        break;
      case 7:
        setSelectedStatus([suppType[6]]);
        break;
      case 8:
        setSelectedStatus([suppType[7]]);
        break;
      case 9:
        setSelectedStatus([suppType[8]]);
        break;
      default:
        break;
    }
    refetch();
  };

  const { error, loading, data, refetch } = useQuery(LOAD_SUPPLIERS_FILTER, {
    variables: {
      status: selectStatus,
    },
  });
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["providers"]["nodes"]) {
      let res = data.providers.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setSuppliers(res);
    }
  }, [data, loading, error]);

  var settings = {
    dots: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 2,
    centerPadding: "60px",
  };

  return (
    <div className="provider">
      <div className="shared-title">
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
          <Link to="/providers/add" className="link">
            <AddCircleIcon />
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
        <div className="icon-row">
          <Slider {...settings}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
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
                  <FormatListBulletedIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 1 && <LocalDiningIcon sx={{ color: "#3498DB" }} />}
                {index === 2 && <BedIcon sx={{ color: "#3498DB" }} />}
                {index === 3 && (
                  <EmojiFoodBeverageIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 4 && <BuildIcon sx={{ color: "#3498DB" }} />}
                {index === 5 && (
                  <DirectionsCarFilledIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 6 && (
                  <DirectionsCarFilledIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 7 && (
                  <DirectionsCarFilledIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 8 && (
                  <DirectionsCarFilledIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 9 && (
                  <DirectionsCarFilledIcon sx={{ color: "#3498DB" }} />
                )}
                <span>
                  {index === 0 && "Tất cả"}
                  {index === 1 && "Cứu hộ"}
                  {index === 2 && "Quán ăn"}
                  {index === 3 && "Tạp hóa"}
                  {index === 4 && "Khách sạn"}
                  {index === 5 && "Nhà nghỉ"}
                  {index === 6 && "Tiệm sửa"}
                  {index === 7 && "Nhà hàng"}
                  {index === 8 && "Taxi"}
                  {index === 9 && "Thuê xe"}
                </span>
              </div>
            ))}
          </Slider>
        </div>
        <ProviderTable providers={suppliers} />
      </div>
    </div>
  );
};

export default ProviderPage;
