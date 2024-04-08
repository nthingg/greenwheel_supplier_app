import "../../assets/scss/providers.scss";
import "../../assets/scss/shared.scss";
import AddressForm from "../../components/map/AddressForm";
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
import { useMutation } from "@apollo/client";
import { ADD_PROVIDER } from "../../services/graphql/provider";
import * as turf from "@turf/turf";
import { regionData } from "../../services/location/region";

const ProviderAddPage = () => {
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
    { value: 1, label: "Một sao" },
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
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrMsg] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [standardVisible, setStandardVisible] = useState(false);
  const [addressDetail, setAddressDetail] = useState("");
  //error
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressHelperText, setAddressHelperText] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelperText, setPhoneHelperText] = useState("");
  const [nameFinErr, setNameFinErr] = useState(true);
  const [addressFinErr, setAddressFinErr] = useState(true);
  const [phoneFinErr, setPhoneFinErr] = useState(true);
  const [standardFinErr, setStandardFinErr] = useState(false);
  const [typeFinErr, setTypeFinErr] = useState(false);

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

  const [add, { data: dataAdd, error: errorAdd }] = useMutation(ADD_PROVIDER);

  const handleConfirmClick = async () => {
    const imgName = await addPosts(file);

    const loc = JSON.parse(localStorage.getItem("loc"));
    const address = localStorage.getItem("address");

    const dataProvider = {
      phone: phone,
      address: address,
      coordinate: [loc.lng, loc.lat],
      imageUrl: imgName,
      name: name,
      standard: standard,
      type: type,
    };

    try {
      const { data } = await add({
        variables: {
          dto: dataProvider,
        },
      });
      navigate("/providers");
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (address.streetAndNumber) {
      console.log("Selected address:", address);
      const result = await getLocations(address.streetAndNumber, TOKEN);
      updateCoordinates(result[0].center[1], result[0].center[0]);
    }
  };

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
              <Link to="/destinations" className="navigateButton">
                <ArrowCircleLeftIcon />
                <p>Trở về</p>
              </Link>
            </div>
            <div className="return-title">
              <div className="return-header">Thêm thông tin nhà cung cấp</div>
              <div className="return-body">
                <p>Danh sách nhà cung cấp</p>
                <ArrowForwardIosIcon />
                <p>Thêm nhà cung cấp</p>
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
                    ? URL.createObjectURL(file)
                    : "https://vinhphucwater.com.vn/wp-content/uploads/2023/05/no-image.jpg"
                }
              />
              <div className="formInput imageAdd">
                <label htmlFor="file">
                  <DriveFolderUploadOutlinedIcon className="icon" />
                  <span>Thêm ảnh</span>
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => {
                    // if (file !== null) {
                    //   setErrMsg("Đã thêm hình ảnh.");
                    //   handleClick();
                    //   localStorage.removeItem("errorMsg");
                    //   return;
                    // }
                    setFile(e.target.files[0]);
                  }}
                  style={{ display: "none" }}
                />
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
                    // label="Số người"
                    className="basic-single"
                    type="text"
                    // defaultValue={200000}
                    placeholder="Nhập tên nhà cung cấp"
                    size="small"
                    name="name"
                    sx={{
                      width: "15%",
                      "& label.Mui-focused": {
                        color: "black",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "black",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gainsboro",
                        },
                        "&:hover fieldset": {
                          borderColor: "black",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="detailItem">
                  <span className="itemKey">Số điện thoại:</span>
                  <TextField
                    id="outlined-disabled"
                    // label="Số người"
                    className="basic-single"
                    type="text"
                    // defaultValue={200000}
                    placeholder="Nhập số điện thoại"
                    size="small"
                    name="phone"
                    sx={{
                      width: "15%",
                      "& label.Mui-focused": {
                        color: "black",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "black",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gainsboro",
                        },
                        "&:hover fieldset": {
                          borderColor: "black",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                    onChange={(e) => {
                      setPhone("84" + e.target.value.slice(1));
                    }}
                  />
                </div>
              </div>
              <div className="right">
                <div className="detailItem">
                  <span className="itemKey">Địa điểm:</span>
                  <div className="address-cont">
                    <AddressForm
                      onSubmit={handleFormSubmit}
                      address={address}
                      setAddress={setAddress}
                    />
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
                <div className="detailItem">
                  <span className="itemKey">Loại hình:</span>
                  <Select
                    placeholder={"Chọn loại hình nhà cung cấp"}
                    className="basic-single"
                    classNamePrefix="select"
                    isDisabled={false}
                    isClearable={true}
                    name="type"
                    options={typeOptions}
                    onChange={(e) => {
                      if (e === null) {
                        setType("");
                        setStandardVisible(false);
                        return;
                      }
                      if (e.value === "HOTEL" || e.value === "RESTAURANT") {
                        setType(e.value);
                        setStandardVisible(true);
                      } else {
                        setType(e.value);
                        setStandardVisible(false);
                      }
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
                {standardVisible && (
                  <div className="detailItem">
                    <span className="itemKey">Tiêu chuẩn:</span>
                    <TextField
                      id="outlined-disabled"
                      // label="Số người"
                      className="basic-single"
                      type="text"
                      // defaultValue={200000}
                      placeholder="Nhập tiêu chuẩn xếp hạng sao"
                      size="small"
                      name="standard"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">sao</InputAdornment>
                        ),
                      }}
                      sx={{
                        width: "15%",
                        "& label.Mui-focused": {
                          color: "black",
                        },
                        "& .MuiInput-underline:after": {
                          borderBottomColor: "black",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "gainsboro",
                          },
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      onChange={(e) => {
                        setStandard(e.target.value);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="btn-group">
          <button
            className="link reset"
            onClick={async () => {
              setFile(null);
            }}
          >
            <RotateLeftIcon />
            <span>Đặt lại</span>
          </button>

          <button
            className="link confirm"
            onClick={async () => {
              handleConfirmClick();
            }}
          >
            <ThumbUpAltIcon />
            <span>Xác nhận</span>
          </button>
        </div>
      </div>
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

export default ProviderAddPage;
