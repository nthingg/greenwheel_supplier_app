import "../assets/scss/supplierDetail.scss";

import "../assets/scss/shared.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  GET_PRODUCT_BY_SUPPLIER,
  LOAD_DETAIL_SUPPLIER,
} from "../services/queries";
import { useQuery } from "@apollo/client";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import EditIcon from "@mui/icons-material/Edit";
import ProductTable from "../components/ProductTable";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import BedIcon from "@mui/icons-material/Bed";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import InventoryIcon from "@mui/icons-material/Inventory";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";

const SupplierDetailPage = () => {
  const containerStyle = {
    width: "950px",
    height: "400px",
  };
  const defaultAddress =
    "Dinh Độc Lập, 135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Thành phố Hồ Chí Minh";

  const navigate = useNavigate();
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [position, setPosition] = useState(null);
  const [open, setOpen] = useState(false);

  const [address, setAddress] = useState(defaultAddress);
  const [showMap, setShowMap] = useState(false);

  const handleClick = (index) => {
    setSelectedDiv(index);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //supplier
  const { error, loading, data } = useQuery(LOAD_DETAIL_SUPPLIER, {
    variables: {
      id: parseInt(supplierId, 10),
    },
  });
  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      data["suppliers"] &&
      data["suppliers"]["nodes"]
    ) {
      setSupplier(data["suppliers"]["nodes"][0]);
      const center = {
        lat: data["suppliers"]["nodes"][0].coordinate.coordinates[1],
        lng: data["suppliers"]["nodes"][0].coordinate.coordinates[0],
      };
      setPosition(center);
    }
  }, [data, loading, error]);

  //products
  const {
    error: errorProducts,
    loading: loadingProducts,
    data: dataProducts,
  } = useQuery(GET_PRODUCT_BY_SUPPLIER, {
    variables: {
      id: parseInt(supplierId, 10),
    },
  });
  useEffect(() => {
    if (
      !loadingProducts &&
      !errorProducts &&
      dataProducts &&
      dataProducts["products"] &&
      dataProducts["products"]["nodes"]
    ) {
      let res = dataProducts.products.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setProducts(res);
    }
  }, [dataProducts, loadingProducts, errorProducts]);

  return (
    <div className="supplierDetailContainer">
      <div className="sharedTitle">
        <div className="navigation">
          <Link to="/suppliers" className="navigateButton">
            <ArrowCircleLeftIcon />
            <p>Trở về</p>
          </Link>
          <p>Danh sách nhà cung cấp</p>
          <ArrowForwardIosIcon />
          <p> Thông tin nhà cung cấp</p>
        </div>
      </div>
      <div className="detailContainer">
        <div className="prodTitle">
          <div className="supplierHeader">
            <p>{supplier?.name}</p>
            {supplier?.isActive === false && (
              <p className="status cancelled">Ngưng hoạt động</p>
            )}
            {supplier?.isActive === true && (
              <p className="status confirmed">Đang hoạt động</p>
            )}
          </div>

          <div className="">
            <Link to="/suppliers/new-product" className="link mb-3">
              <EditIcon />
              <p>Chỉnh sửa</p>
            </Link>
            {/* <Link to="/suppliers/new-product" className="link">
              <AddBoxIcon />
              <p>Thêm dịch vụ</p>
            </Link> */}
          </div>
        </div>
        <div className="supplierDetail">
          <div className="left">
            <div className="image_container">
              <img src={supplier?.imageUrl} alt="" />
            </div>
          </div>
          <div className="right">
            <div className="details">
              <div className="detailItem">
                <span className="itemKey">Số điện thoại:</span>
                <span className="itemValue">{supplier?.phone}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Địa chỉ:</span>
                <span className="itemValue">
                  {supplier?.address}
                  <IconButton color="info" onClick={handleClickOpen}>
                    <MapIcon />
                  </IconButton>
                </span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Số dư:</span>
                <span className="itemValue">
                  {supplier?.balance.toLocaleString("vi-VN") + "đ"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="rowTitle">
          <p>{"Danh sách dịch vụ"}</p>
        </div>
        <div className="tableProducts">
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
              <Link
                to={`/suppliers/add-product/${supplierId}`}
                className="link"
              >
                <AddCircleIcon />
                <span>Thêm dịch vụ</span>
              </Link>
              <button className="link">
                <span>Tải xuống file Excel</span>
                <CloudDownloadIcon />
              </button>
              <button className="link">
                <FilterAltIcon />
              </button>
              <button
                className="link"
                // onClick={() => {
                //   refetch();
                // }}
              >
                <RefreshIcon />
              </button>
            </div>
          </div>
          <div className="icon-row">
            {[0, 1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className={`icon-item ${
                  selectedDiv === index ? "selected" : ""
                }`}
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
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        maxWidth={false}
      >
        <DialogTitle backgroundColor={"#239b56"} color={"white"}>
          Bản đồ
        </DialogTitle>
        <DialogContent style={{ width: 1000 }}>
          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Chi tiết địa điểm của {supplier?.name}:
          </DialogContentText>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={15}
          >
            <MarkerF position={position} />
          </GoogleMap>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SupplierDetailPage;
