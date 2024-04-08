import { Link } from "react-router-dom";
import "../../assets/scss/productPage.scss";
import "../../assets/scss/filter.scss";
import "../../assets/scss/shared.scss";
import ProductTable from "../../components/tables/ProductTable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import BedIcon from "@mui/icons-material/Bed";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import InventoryIcon from "@mui/icons-material/Inventory";
import { IconButton } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { LOAD_PRODUCTS_FILTER } from "../../services/graphql/product";

const ProductPage = () => {
  const productType = ["BEVERAGE", "CAMP", "FOOD", "OTHER", "ROOM", "VEHICLE"];

  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectType, setSelectedType] = useState(productType);

  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedType(productType);
        break;
      case 1:
        setSelectedType(["FOOD"]);
        break;
      case 2:
        setSelectedType(["BEVERAGE"]);
        break;
      case 3:
        setSelectedType(["CAMP"]);
        break;
      case 4:
        setSelectedType(["ROOM"]);
        break;
      case 5:
        setSelectedType(["VEHICLE"]);
        break;
      case 6:
        setSelectedType(["OTHER"]);
        break;
      default:
        break;
    }
    refetch();
  };

  const { error, loading, data, refetch } = useQuery(LOAD_PRODUCTS_FILTER, {
    variables: {
      type: selectType,
    },
  });

  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["products"]["nodes"]) {
      let res = data.products.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setProducts(res);
    }
  }, [data, loading, error]);

  return (
    <div className="product">
      <div className="sharedTitle">
        <p>Danh sách dịch vụ</p>
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
            {/* <Link to="/products/new" className="link">
              <AddIcon />
              <span>Thêm dịch vụ</span>
            </Link> */}
            <button className="link">
              <span>Tải xuống file Excel</span>
              <CloudDownloadIcon />
            </button>
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
        <div className="icon-row">
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className={`icon-item ${selectedDiv === index ? "selected" : ""}`}
              onClick={() => {
                handleClick(index);
              }}
            >
              <IconButton color="success">
                {/* Replace with appropriate icons */}
                {index === 0 && <FormatListBulletedIcon />}
                {index === 1 && <LocalDiningIcon />}
                {index === 2 && <EmojiFoodBeverageIcon />}
                {index === 3 && <HolidayVillageIcon />}
                {index === 4 && <BedIcon />}
                {index === 5 && <DirectionsCarFilledIcon />}
                {index === 6 && <InventoryIcon />}
              </IconButton>
              <span>
                {index === 0 && "Tất cả"}
                {index === 1 && "Thức ăn"}
                {index === 2 && "Đồ uống"}
                {index === 3 && "Lều trại"}
                {index === 4 && "Phòng xá"}
                {index === 5 && "Xe cộ"}
                {index === 6 && "Khác"}
              </span>
            </div>
          ))}
        </div>
        <ProductTable products={products} />
      </div>
    </div>
  );
};

export default ProductPage;
