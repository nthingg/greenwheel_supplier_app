import "../../assets/scss/providers.scss";
import "../../assets/scss/shared.scss";
import "../../assets/scss/header.scss";
import "../../assets/scss/loading.scss";
import StaticMap from "../../components/map/StaticMap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import EditIcon from "@mui/icons-material/Edit";
import ProductTable from "../../components/tables/ProductTable";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
import "../../assets/scss/filter.scss";
import Slider from "react-slick";
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
import {
  LOAD_DETAIL_PROVIDER,
  GET_PRODUCT_BY_PROVIDER_FILTER,
} from "../../services/graphql/provider";

const ProviderProfilePage = () => {
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [products, setProducts] = useState([]);
  const [position, setPosition] = useState(null);
  const [open, setOpen] = useState(false);
  const [phoneHide, setPhoneHide] = useState("");

  function formatPhoneNumberCen(phoneNumber) {
    // Replace leading "+84" with "0" (if present)
    phoneNumber = phoneNumber.replace(/^\84/, "0"); // Replace leading "+84" with "0"

    let formattedParts;
    switch (phoneNumber.length) {
      case 9:
        formattedParts = [
          phoneNumber.slice(0, 3),
          "*".repeat(4),
          phoneNumber.slice(6),
        ];
        break;
      case 10:
        formattedParts = [
          phoneNumber.slice(0, 3),
          "*".repeat(4),
          phoneNumber.slice(7),
        ];
        break;
      case 11:
        formattedParts = [
          phoneNumber.slice(0, 3),
          "*".repeat(4),
          phoneNumber.slice(8),
        ];
        break;
      default:
        // Handle invalid lengths (optional)
        return phoneNumber;
    }

    return formattedParts.join("");
  }

  const prodType = ["BEVERAGE", "CAMP", "FOOD", "ROOM", "VEHICLE"];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectStatus, setSelectedStatus] = useState(prodType);
  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedStatus(prodType);
        fetchData();
        break;
      case 1:
        setSelectedStatus([prodType[0]]);
        fetchData();
        break;
      case 2:
        setSelectedStatus([prodType[1]]);
        fetchData();
        break;
      case 3:
        setSelectedStatus([prodType[2]]);
        fetchData();
        break;
      case 4:
        setSelectedStatus([prodType[3]]);
        fetchData();
        break;
      case 4:
        setSelectedStatus([prodType[4]]);
        fetchData();
        break;
      default:
        break;
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  var settings = {
    dots: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 2,
    centerPadding: "60px",
  };

  //supplier
  const [getProvider, { error, loading, data }] =
    useLazyQuery(LOAD_DETAIL_PROVIDER);
  //   useEffect(() => {
  //     if (
  //       !loading &&
  //       !error &&
  //       data &&
  //       data["providers"] &&
  //       data["providers"]["nodes"]
  //     ) {
  //       setProvider(data["providers"]["nodes"][0]);
  //       const center = {
  //         lat: data["providers"]["nodes"][0].coordinate.coordinates[1],
  //         lng: data["providers"]["nodes"][0].coordinate.coordinates[0],
  //       };
  //       setPosition(center);
  //       setPhoneHide(
  //         formatPhoneNumberCen(data["providers"]["nodes"][0]["phone"])
  //       );
  //     }
  //   }, [data, loading, error]);

  //products
  const [
    getProducts,
    { error: errorProducts, loading: loadingProducts, data: dataProducts },
  ] = useLazyQuery(GET_PRODUCT_BY_PROVIDER_FILTER);
  //   useEffect(() => {
  //     if (
  //       !loadingProducts &&
  //       !errorProducts &&
  //       dataProducts &&
  //       dataProducts["products"] &&
  //       dataProducts["products"]["nodes"]
  //     ) {
  //       let res = dataProducts.products.nodes.map((node, index) => {
  //         const { __typename, ...rest } = node;
  //         return { ...rest, index: index + 1 }; // Add the index to the object
  //       });
  //       setProducts(res);
  //     }
  //   }, [dataProducts, loadingProducts, errorProducts]);

  const fetchData = async () => {
    try {
      let providerId = localStorage.getItem("providerId");

      const { data: dataProvider } = await getProvider({
        variables: {
          id: parseInt(providerId, 10),
        },
      });
      setProvider(dataProvider["providers"]["nodes"][0]);
      const center = {
        lat: dataProvider["providers"]["nodes"][0].coordinate.coordinates[1],
        lng: dataProvider["providers"]["nodes"][0].coordinate.coordinates[0],
      };
      setPosition(center);
      setPhoneHide(
        formatPhoneNumberCen(dataProvider["providers"]["nodes"][0]["phone"])
      );

      const { data: dataProducts } = await getProducts({
        variables: {
          id: parseInt(providerId, 10),
          type: selectStatus,
        },
      });
      let res = dataProducts.products.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setProducts(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {provider === null && (
        <div className="loading">
          <RestartAltIcon
            sx={{
              fontSize: 80,
              color: "#2c3d50",
            }}
          />
        </div>
      )}
      {provider !== null && (
        <div className="providerDetailContainer">
          <div className="shared-title">
            <div className="navigation">
              <div className="left">
                <div className="return-title">
                  <div className="return-header">Hồ sơ nhà cung cấp</div>
                  <div className="return-body">
                    <p>Chi tiết hồ sơ</p>
                  </div>
                </div>
              </div>
              <div className="right">
                <Link to={`/profile/update/${provider?.id}`} className="link">
                  <EditIcon />
                  <p>Chỉnh sửa</p>
                </Link>
              </div>
            </div>
          </div>
          <div className="detailContainer">
            <div className="prodTitle">
              <div className="provider-header">
                <p>{provider?.name}</p>
                <div>
                  {provider?.isActive === false && (
                    <p className="status cancelled">Ngưng hoạt động</p>
                  )}
                  {provider?.isActive === true && (
                    <p className="status confirmed">Đang hoạt động</p>
                  )}
                </div>
              </div>
            </div>
            <div className="providerDetail">
              <div className="left">
                <div className="image_container">
                  <img
                    src={`https://d38ozmgi8b70tu.cloudfront.net${provider?.imagePath}`}
                    alt=""
                  />
                </div>
              </div>
              <div className="right">
                <div className="details">
                  <div className="detailItem">
                    <span className="itemKey">Số điện thoại:</span>
                    <span className="itemValue">{phoneHide}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Địa chỉ:</span>
                    <span className="itemValue">
                      {provider?.address}
                      <IconButton color="info" onClick={handleClickOpen}>
                        <MapIcon />
                      </IconButton>
                    </span>
                  </div>
                  {provider?.type !== "REPAIR" &&
                    provider?.type !== "TAXI" &&
                    provider?.type !== "EMERGENCY" &&
                    provider?.type !== "GROCERY" && (
                      <div className="detailItem">
                        <span className="itemKey">Số dư:</span>
                        <span className="itemValue">
                          {provider?.balance.toLocaleString("vi-VN") + "đ"}
                        </span>
                      </div>
                    )}
                  <div className="detailItem">
                    <span className="itemKey">Danh mục:</span>
                    <span className="itemValue">
                      {(() => {
                        switch (provider?.type) {
                          case "RESTAURANT":
                            return "Nhà hàng";
                          case "GROCERY":
                            return "Tạp hóa";
                          case "HOTEL":
                            return "Khách sạn";
                          case "REPAIR":
                            return "Tiệm sửa";
                          case "VEHICLE_RENTAL":
                            return "Thuê xe";
                          case "EMERGENCY":
                            return "Cứu hộ";
                          case "FOOD_STALL":
                            return "Quán ăn";
                          case "MOTEL":
                            return "Nhà nghỉ";
                          case "TAXI":
                            return "Taxi";
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
                {provider?.type !== "REPAIR" &&
                  provider?.type !== "TAXI" &&
                  provider?.type !== "EMERGENCY" &&
                  provider?.type !== "GROCERY" && (
                    <Accordion
                      sx={{ boxShadow: "none", width: 1400 }}
                      expanded={true}
                    >
                      <AccordionSummary
                        sx={{
                          fontSize: 24,
                          backgroundColor: "#2c3d50",
                          color: "white",
                          borderRadius: "10px",
                          fontWeight: "600",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        Các dịch vụ hiện có
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          backgroundColor: "#f8f9f9",
                        }}
                      >
                        <div className="header header-prod">
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
                            <Link to={`/profile/add-product`} className="link">
                              <AddCircleIcon />
                              <span>Thêm dịch vụ</span>
                            </Link>
                            <button className="link">
                              <CloudDownloadIcon />
                            </button>
                            <button className="link">
                              <FilterAltIcon />
                            </button>
                            <button
                              className="link"
                              onClick={() => {
                                fetchData();
                              }}
                            >
                              <RefreshIcon />
                            </button>
                          </div>
                        </div>
                        <div className="icon-row">
                          <Slider {...settings}>
                            {[0, 1, 2, 3, 4, 5].map((index) => (
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
                                  <FormatListBulletedIcon
                                    sx={{ color: "#3498DB" }}
                                  />
                                )}
                                {index === 1 && (
                                  <LocalDiningIcon sx={{ color: "#3498DB" }} />
                                )}
                                {index === 2 && (
                                  <BedIcon sx={{ color: "#3498DB" }} />
                                )}
                                {index === 3 && (
                                  <EmojiFoodBeverageIcon
                                    sx={{ color: "#3498DB" }}
                                  />
                                )}
                                {index === 4 && (
                                  <HolidayVillageIcon
                                    sx={{ color: "#3498DB" }}
                                  />
                                )}
                                {index === 5 && (
                                  <DirectionsCarFilledIcon
                                    sx={{ color: "#3498DB" }}
                                  />
                                )}
                                <span>
                                  {index === 0 && "Tất cả"}
                                  {index === 1 && "Thức uống"}
                                  {index === 2 && "Lều trại"}
                                  {index === 3 && "Thức ăn"}
                                  {index === 4 && "Phòng nghỉ"}
                                  {index === 5 && "Phương tiện"}
                                </span>
                              </div>
                            ))}
                          </Slider>
                        </div>
                        <ProductTable products={products} profile={1} />
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
            <DialogTitle
              backgroundColor={"#2c3d50"}
              color={"white"}
              fontWeight={600}
            >
              Bản đồ
            </DialogTitle>
            <DialogContent style={{ width: 1000, height: 600 }}>
              <DialogContentText style={{ padding: "20px 0 10px 0" }}>
                Chi tiết địa điểm của {provider?.name}:
              </DialogContentText>
              {position?.lng && position?.lat && (
                <StaticMap longitude={position?.lng} latitude={position?.lat} />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Đóng</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default ProviderProfilePage;
