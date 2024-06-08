import "../../assets/scss/providers.scss";
import "../../assets/scss/shared.scss";
import "../../assets/scss/dialog.scss";
import CustomMap from "../../components/map/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import getLocations from "../../services/apis/getLocations";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import MapIcon from "@mui/icons-material/Map";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import Select from "react-select";
import { addPosts } from "../../services/apis/imageUploader";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_PROVIDER,
  LOAD_DETAIL_PROVIDER,
  UPDATE_PROVIDER,
} from "../../services/graphql/provider";
import * as turf from "@turf/turf";
import { regionData } from "../../services/location/region";

const ProviderProfileUpdatePage = () => {
  const providerLogId = localStorage.getItem("providerId");
  const { providerId } = useParams();
  const navigate = useNavigate();

  const typeOptions = [
    { value: "EMERGENCY", label: "Cứu hộ" },
    { value: "FOOD_STALL", label: "Quán ăn" },
    { value: "GROCERY", label: "Tạp hóa" },
    { value: "HOTEL", label: "Khách sạn" },
    { value: "MOTEL", label: "Nhà nghỉ" },
    { value: "REPAIR", label: "Tiệm sửa" },
    { value: "RESTAURANT", label: "Nhà hàng" },
    { value: "TAXI", label: "Taxi" },
    { value: "VEHICLE_RENTAL", label: "Thuê xe" },
  ];

  const standardOptions = [
    { value: 2, label: "Hai sao" },
    { value: 3, label: "Ba sao" },
    { value: 4, label: "Bốn sao" },
    { value: 5, label: "Năm sao" },
  ];

  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [standard, setStandard] = useState(null);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrMsg] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [standardVisible, setStandardVisible] = useState(false);
  const [addressDetail, setAddressDetail] = useState("");
  const [provider, setProvider] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [appliedTime, setAppliedTime] = useState("");
  //error
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressHelperText, setAddressHelperText] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelperText, setPhoneHelperText] = useState("");
  const [nameFinErr, setNameFinErr] = useState(false);
  const [addressFinErr, setAddressFinErr] = useState(false);
  const [phoneFinErr, setPhoneFinErr] = useState(false);
  const [standardFinErr, setStandardFinErr] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [openRedirect, setOpenRedirect] = useState(false);
  //redirect
  const handleClickOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClick = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnack = () => {
    setSnackbarOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    error: errProvider,
    loading: loadingProvider,
    data: dataProvider,
  } = useQuery(LOAD_DETAIL_PROVIDER, {
    variables: {
      id: parseInt(providerId, 10),
    },
  });

  useEffect(() => {
    if (
      !loadingProvider &&
      !errProvider &&
      dataProvider &&
      dataProvider["providers"] &&
      dataProvider["providers"]["nodes"]
    ) {
      setProvider(dataProvider["providers"]["nodes"][0]);

      setAddress({
        streetAndNumber: dataProvider["providers"]["nodes"][0].address,
        latitude:
          dataProvider["providers"]["nodes"][0].coordinate.coordinates[1],
        longitude:
          dataProvider["providers"]["nodes"][0].coordinate.coordinates[0],
      });

      const loc = {
        lng: dataProvider["providers"]["nodes"][0].coordinate.coordinates[0],
        lat: dataProvider["providers"]["nodes"][0].coordinate.coordinates[1],
      };
      localStorage.setItem("loc", JSON.stringify(loc));

      setAddressDetail(dataProvider["providers"]["nodes"][0].address);
      setName(dataProvider["providers"]["nodes"][0].name);
      setPhone(dataProvider["providers"]["nodes"][0].phone);

      setFile({
        file: null,
        url: `https://d38ozmgi8b70tu.cloudfront.net${dataProvider["providers"]["nodes"][0].imagePath}`,
      });

      const standard = dataProvider["providers"]["nodes"][0].standard;
      let standardInit = null;
      for (let j = 0; j < standardOptions.length; j++) {
        if (standardOptions[j].value === standard) {
          standardInit = standardOptions[j];
        }
      }
      setStandard(standardInit);
      if (standardInit !== null) {
        setStandardVisible(true);
      }

      let d = new Date();
      d.setMonth(d.getMonth() + 1, 1);
      d.setHours(7, 0, 0, 0);

      setAppliedTime(
        d.toLocaleTimeString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      );
    }
  }, [dataProvider, loadingProvider, errProvider]);

  const [update, { data: dataUpdate, error: errorUpdate }] =
    useMutation(UPDATE_PROVIDER);

  const handleConfirmClick = async () => {
    let imagePath = "";
    if (file.file !== null) {
      const imgName = await addPosts(file.file);
      imagePath = imgName;
    } else {
      imagePath = file.url;
    }

    const loc = JSON.parse(localStorage.getItem("loc"));

    let finStandart = null;
    if (standard !== null) {
      finStandart = standard.value;
    }

    const dataProvider = {
      phone: phone,
      address: addressDetail,
      coordinate: [loc.lng, loc.lat],
      imageUrl: imagePath,
      name: name,
      standard: finStandart,
      providerId: parseInt(providerId, 10),
    };

    try {
      const { data } = await update({
        variables: {
          dto: dataProvider,
        },
      });

      navigate(`/providers/${providerId}`);
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
    }
  };

  const TOKEN =
    "pk.eyJ1IjoicGhhbmR1eSIsImEiOiJjbGswaDQzNjgwbGJlM2Z0NXd2c2V0eTgxIn0.mu5cOmm7meqqmT7eicLbKA";

  const [address, setAddress] = useState({
    streetAndNumber: "",
    latitude: 10.842033810975172,
    longitude: 106.80996883068278,
  });

  const updateCoordinates = (latitude, longitude) => {
    setAddress({ ...address, latitude, longitude });
  };

  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (event) => {
    handleInputChange(event.target.value);
  };

  const handleInputChange = async (query) => {
    const suggestions = await getLocations(query, TOKEN);

    let res = [];

    for (let index = 0; index < suggestions.length; index++) {
      let points = turf.points([
        [suggestions[index].center[0], suggestions[index].center[1]],
      ]);

      let searchWithin = turf.polygon(
        regionData.features[0].geometry.coordinates[0]
      );

      var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);

      if (ptsWithin.features.length > 0) {
        res.push(suggestions[index]);
      }
    }

    setSuggestions(res);
  };

  const handleSuggestionClick = (suggestion) => {
    // const streetAndNumber = suggestion.place_name.split(",")[0];

    if (suggestion.place_name.length < 20) {
      setAddressError(true);
      setAddressHelperText("Vị trí địa điểm gồm ít nhất 20 kí tự");
    } else if (suggestion.place_name.length > 100) {
      setAddressError(true);
      setAddressHelperText("Vị trí địa điểm gồm nhiều nhất 100 kí tự");
    } else {
      setAddressError(false);
      setAddressHelperText("");
    }

    const streetAndNumber = suggestion.place_name;
    const latitude = suggestion.center[1];
    const longitude = suggestion.center[0];

    const address = {
      streetAndNumber,
      latitude,
      longitude,
    };

    suggestion.context.forEach((element) => {
      const identifier = element.id.split(".")[0];

      address[identifier] = element.text;
    });

    const loc = {
      lng: address.longitude,
      lat: address.latitude,
    };
    localStorage.setItem("loc", JSON.stringify(loc));

    console.log(address);
    console.log(loc);

    setAddress(address);
    setAddressDetail(address.streetAndNumber);
    setSuggestions([]);
  };

  return (
    <div className="provider-create">
      <div className="shared-title">
        <div className="navigation">
          <div className="left">
            <div className="return-btn">
              <Link to="/profile" className="navigateButton">
                <ArrowCircleLeftIcon />
                <p>Trở về</p>
              </Link>
            </div>
            <div className="return-title">
              <div className="return-header">
                Chỉnh sửa thông tin nhà cung cấp
              </div>
              <div className="return-body">
                <p>Hồ sơ nhà cung cấp</p>
                <ArrowForwardIosIcon />
                <p>{provider?.name}</p>
                <ArrowForwardIosIcon />
                <p>Chỉnh sửa nhà cung cấp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="provider-add-cont">
        <div className="provider-create-cont">
          <div className="left">
            <div className="image_container">
              <img
                src={
                  file
                    ? file.url
                    : "https://vinhphucwater.com.vn/wp-content/uploads/2023/05/no-image.jpg"
                }
              />
              <div className="img-btns">
                <button
                  className="link reset"
                  onClick={async () => {
                    setFile(null);
                    setImgError(true);
                  }}
                >
                  <RotateLeftIcon />
                  <span>Đặt lại</span>
                </button>
                <div className="formInput imageAdd">
                  <label htmlFor="file">
                    <DriveFolderUploadOutlinedIcon className="icon" />
                    <span>Thêm ảnh</span>
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => {
                      setImgError(false);
                      setFile(e.target.files[0]);
                    }}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="details">
              <div className="left">
                <div className="detailItem">
                  <span className="itemKey">Tên:</span>
                  <TextField
                    id="outlined-disabled"
                    className="basic-single"
                    type="text"
                    placeholder="Nhập tên nhà cung cấp"
                    size="small"
                    name="name"
                    value={name}
                    error={nameError}
                    helperText={nameHelperText}
                    onChange={(e) => {
                      if (e.target.value.length < 10) {
                        setNameError(true);
                        setNameHelperText("Tên địa điểm gồm ít nhất 10 kí tự");
                        setNameFinErr(true);
                      } else if (e.target.value.length > 50) {
                        setNameError(true);
                        setNameHelperText(
                          "Tên địa điểm gồm nhiều nhất 50 kí tự"
                        );
                        setNameFinErr(true);
                      } else {
                        setNameError(false);
                        setNameHelperText("");
                        setNameFinErr(false);
                      }
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="detailItem">
                  <span className="itemKey">Số điện thoại:</span>
                  <TextField
                    id="outlined-disabled"
                    className="basic-single"
                    type="text"
                    placeholder="Nhập số điện thoại"
                    size="small"
                    name="phone"
                    value={phone}
                    error={phoneError}
                    helperText={phoneHelperText}
                    onChange={(e) => {
                      if (!e.target.validity.valid) {
                        setPhoneError(true);
                        setPhoneHelperText("SĐT theo định dạng '84xxxxxxxxx'");
                        setPhoneFinErr(true);
                      } else {
                        setPhoneError(false);
                        setPhoneHelperText("");
                        setPhoneFinErr(false);
                      }
                      setPhone(e.target.value);
                    }}
                    inputProps={{
                      pattern: "^84[0-9]{9}$",
                    }}
                  />
                </div>
              </div>
              <div className="right">
                <div className="detailItem">
                  <span className="itemKey">Địa điểm:</span>
                  <div className="address-cont autoCompleteInputContainer">
                    <TextField
                      id="address"
                      className="basic-single"
                      size="small"
                      type="text"
                      placeholder="Nhập địa điểm"
                      error={addressError}
                      helperText={addressHelperText}
                      value={addressDetail}
                      onChange={(e) => {
                        setAddressDetail(e.target.value);
                        if (e.target.value.length < 20) {
                          setAddressError(true);
                          setAddressFinErr(true);
                          setAddressHelperText(
                            "Vị trí địa điểm gồm ít nhất 20 kí tự"
                          );
                        } else if (e.target.value.length > 100) {
                          setAddressError(true);
                          setAddressFinErr(true);
                          setAddressHelperText(
                            "Vị trí địa điểm gồm nhiều nhất 100 kí tự"
                          );
                        } else {
                          setAddressError(false);
                          setAddressFinErr(false);
                          setAddressHelperText("");
                        }
                        handleChange(e);
                      }}
                      sx={{
                        width: "15%",
                      }}
                      onBlur={() => {
                        setTimeout(function () {
                          setSuggestions([]);
                        }, 500);
                      }}
                    />
                    <ul className="addressSuggestions">
                      {suggestions?.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            handleSuggestionClick(suggestion);
                            console.log("alo");
                          }}
                        >
                          {suggestion.place_name}
                        </li>
                      ))}
                    </ul>
                    <IconButton
                      className="mapBtn"
                      color="info"
                      onClick={handleClickOpen}
                    >
                      <MapIcon />
                    </IconButton>
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
                        Chi tiết địa điểm:
                      </DialogContentText>
                      {address.longitude && address.latitude && (
                        <CustomMap
                          longitude={address.longitude}
                          latitude={address.latitude}
                          updateCoordinates={updateCoordinates}
                        />
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Đóng</Button>
                    </DialogActions>
                  </Dialog>
                </div>
                {standardVisible && (
                  <div className="detailItem">
                    <span className="itemKey">Tiêu chuẩn:</span>
                    <Select
                      placeholder={"Chọn tiêu chuẩn nhà cung cấp"}
                      className="basic-single"
                      classNamePrefix="select"
                      isDisabled={false}
                      isClearable={true}
                      value={standard}
                      name="standard"
                      options={standardOptions}
                      onChange={(e) => {
                        if (e === null) {
                          setStandard(null);
                          setStandardFinErr(true);
                          return;
                        }
                        if (e.value) {
                          setStandardFinErr(false);
                        } else {
                          setStandardFinErr(true);
                        }
                        setStandard(e);
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: "#2c3d50",
                        },
                      })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="btn-group">
          {!nameFinErr &&
            !imgError &&
            !addressFinErr &&
            !phoneFinErr &&
            !standardFinErr && (
              <button
                className="link confirm"
                onClick={async () => {
                  handleClickOpenConfirm();
                }}
              >
                <ThumbUpAltIcon />
                <span>Xác nhận</span>
              </button>
            )}

          {(nameFinErr ||
            imgError ||
            addressFinErr ||
            phoneFinErr ||
            standardFinErr) && (
            <button className="link deny">
              <ThumbUpAltIcon />
              <span>Xác nhận</span>
            </button>
          )}
        </div>
      </div>
      <Dialog
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        maxWidth={false}
      >
        <DialogTitle
          backgroundColor={"#2c3d50"}
          color={"white"}
          fontWeight={600}
        >
          Xác nhận cập nhật {provider?.name}
        </DialogTitle>
        <DialogContent style={{ width: 620, height: 180 }}>
          <p className="alert-price-change">
            Bạn có chắc muốn chỉnh sửa nhà cung cấp? Các thay đổi sẽ được áp
            dụng vào: {appliedTime}
          </p>

          <div className="btns-group-dialog">
            <button
              className="link deny"
              onClick={() => {
                setOpenConfirm(false);
              }}
            >
              <span>Hủy</span>
            </button>
            <button
              className="link confirm"
              onClick={() => {
                setOpenConfirm(false);
                handleConfirmClick();
              }}
            >
              <span>Xác nhận</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openRedirect}
        onClose={() => {
          setOpenRedirect(false);
        }}
        maxWidth={false}
      >
        <DialogTitle
          backgroundColor={"#2c3d50"}
          color={"white"}
          fontWeight={600}
        >
          Cập nhật thành công
        </DialogTitle>
        <DialogContent style={{ width: 400, height: 180 }}>
          <p className="alert-price-change">
            Các thay đổi về nhà cung cấp sẽ được áp dụng vào: {appliedTime}
          </p>

          <div className="btns-group-dialog">
            <button
              className="link confirm"
              onClick={() => {
                if (providerLogId) {
                  navigate(`/profile`);
                } else {
                  navigate(`/providers/${providerId}`);
                }
              }}
            >
              <span>Xác nhận</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbarOpen}
        onClose={handleCloseSnack}
        autoHideDuration={2000}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleCloseSnack}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProviderProfileUpdatePage;
