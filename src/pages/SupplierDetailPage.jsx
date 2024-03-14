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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  const [phone, setPhone] = useState("");

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
      setPhone(data["suppliers"]["nodes"][0].phone);
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

  function formatPhoneNumber(phoneNumber) {
    // Replace leading "+84" with "0" (if present)
    phoneNumber = phoneNumber.replace(/^\+84/, "0");

    let part1, part2, part3;
    switch (phoneNumber.length) {
      case 9:
        part1 = phoneNumber.slice(0, 3);
        part2 = phoneNumber.slice(3, 6);
        part3 = phoneNumber.slice(6);
        break;
      case 10:
        part1 = phoneNumber.slice(0, 4);
        part2 = phoneNumber.slice(4, 7);
        part3 = phoneNumber.slice(7);
        break;
      case 11:
        part1 = phoneNumber.slice(0, 4); // Handle potential country code (adjust as needed)
        part2 = phoneNumber.slice(4, 7);
        part3 = phoneNumber.slice(7);
        break;
      default:
        // Handle invalid lengths (optional)
        console.warn(`Invalid phone number length: ${phoneNumber}`);
        return phoneNumber;
    }

    // Combine parts with spaces
    return `${part1} ${part2} ${part3}`;
  }

  return (
    <div className="supplierDetailContainer">
      <div className="sharedTitle">
        <div className="navigation">
          <div className="left">
            <div className="return-btn">
              <Link to="/suppliers" className="navigateButton">
                <ArrowCircleLeftIcon />
                <p>Trở về</p>
              </Link>
            </div>
            <div className="return-title">
              <div className="return-header">
                Thông tin chi tiết nhà cung cấp
              </div>
              <div className="return-body">
                <p>Danh sách nhà cung cấp</p>
                <ArrowForwardIosIcon />
                <p>Chi tiết nhà cung cấp</p>
              </div>
            </div>
          </div>
          <div className="right">
            <Link to="/suppliers/new-product" className="modify-supplier">
              <EditIcon />
              <p>Chỉnh sửa</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="detailContainer">
        <div className="prodTitle">
          <div className="supplier-header">
            <p>{supplier?.name}</p>
            <div className="supplier-name"></div>
            <div className="supplier-status">
              {supplier?.isActive === false && (
                <p className="status cancelled">Ngưng hoạt động</p>
              )}
              {supplier?.isActive === true && (
                <p className="status confirmed">Đang hoạt động</p>
              )}
            </div>
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
                <span className="itemValue">{formatPhoneNumber(phone)}</span>
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
              <div className="detailItem">
                <span className="itemKey">Danh mục:</span>
                <span className="itemValue">
                  {(() => {
                    switch (supplier?.type) {
                      case "RESTAURANT":
                        return "Nhà hàng";
                      case "GROCERY_STORE":
                        return "Tạp hóa";
                      case "HOTEL":
                        return "Khách sạn";
                      case "REPAIR_SHOP":
                        return "Cửa hàng sửa chữa";
                      case "VEHICLE_RENTAL":
                        return "Dịch vụ thuê xe";
                      default:
                        return "Khác";
                    }
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="tableProducts">
          <div className="bottom">
            {/* {(supplier?.type == "REPAIR_SHOP" ||
              supplier?.type == "VEHICLE_RENTAL") && (
              <Accordion disabled>
                <AccordionSummary
                  sx={{
                    fontSize: 24,
                    minWidth: 1400,
                  }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  Các dịch vụ hiện có
                </AccordionSummary>
              </Accordion>
            )} */}
            {supplier?.type != "REPAIR_SHOP" &&
              supplier?.type != "VEHICLE_RENTAL" && (
                <Accordion>
                  <AccordionSummary
                    sx={{
                      fontSize: 24,
                    }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    Các dịch vụ hiện có
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      minWidth: 1400,
                    }}
                  >
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
                    <div className="detail-table">
                      <ProductTable products={products} />
                    </div>
                  </AccordionDetails>
                </Accordion>
              )}
          </div>
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
