import "../assets/scss/productCreate.scss";
import "../assets/scss/supplierCreate.scss";
import "../assets/scss/shared.scss";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addPosts, useAddProduct } from "../services/requests";
import {
  Autocomplete,
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import MapIcon from "@mui/icons-material/Map";

const SupplierCreatePage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();

  const containerStyle = {
    width: "950px",
    height: "400px",
  };

  const center = {
    lat: 10.779784,
    lng: 106.695418,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCzYlFQ9BHxHZRRYS2RFMz-ofS_lWw_XLo",
    libraries: ["places"], // Include the "places" library if using Autocomplete
  });

  const defaultAddress =
    "Dinh Độc Lập, 135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Thành phố Hồ Chí Minh";
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [position, setPosition] = useState(center);
  const [address, setAddress] = useState(defaultAddress);
  const [open, setOpen] = useState(false);
  const [searchResult, setSearchResult] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMapClick = (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setPosition({ lat, lng });
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCzYlFQ9BHxHZRRYS2RFMz-ofS_lWw_XLo`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          setAddress(data.results[0].formatted_address);
        } else {
          setAddress("Không có địa chỉ");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(address);
  };

  const { handleAddProduct, loadingAdd, errorAdd } = useAddProduct();

  const handleConfirmClick = async () => {
    // Example usage:
    const imgName = await addPosts(file);

    // // Add your specific code here
    // // Do something with the filename
    const convertPeriods = JSON.stringify();
    const productData = {
      //   name,
      //   type,
      //   paymentType, // Assuming you have a variable for status
      //   price: parseInt(price),
      //   periods: periods.map((item) => item.value),
      //   partySize: parseInt(partySize),
      //   imageUrl: imgName, // Use the uploaded file name as thumbnailUrl
      //   supplierId: parseInt(supplierId),
    };

    const prodCreated = await handleAddProduct(productData);
    if (prodCreated !== null) {
      navigate(`/suppliers/${supplierId}`);
    } else {
      // Handle product creation failure
      console.error("Product creation failed");
      // Display an error message to the user
    }
  };

  function onLoad(autocomplete) {
    setSearchResult(autocomplete);
  }

  function onPlaceChanged() {
    if (searchResult != null) {
      //variable to store the result
      const place = searchResult.getPlace();
      const formattedAddress = place.formatted_address;
      //console log all results
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
      console.log(`Formatted Address: ${formattedAddress}`);
      const center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setPosition(center);
    } else {
      alert("Please enter text");
    }
  }
  return (
    <div className="edit">
      <div className="sharedTitle">
        <div className="navigation">
          <Link to={`/suppliers/${supplierId}`} className="navigateButton">
            <ArrowCircleLeftIcon />
            <p>Trở về</p>
          </Link>
          <p>Danh sách nhà cung cấp</p>
          <ArrowForwardIosIcon />
          <p>Chi tiết nhà cung cấp</p>
          <ArrowForwardIosIcon />
          <p>Thêm dịch vụ</p>
        </div>
      </div>
      <div className="detailContainer">
        <div className="productCreate">
          <div className="left">
            <div className="image_container">
              <div className="formInput imageAdd">
                <label htmlFor="file">
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://vinhphucwater.com.vn/wp-content/uploads/2023/05/no-image.jpg"
                }
                alt=""
              />
            </div>
          </div>
          <div className="right">
            <div className="details">
              <div className="detailItem">
                <span className="itemKey">Tên nhà cung cấp:</span>
                <TextField
                  id="outlined-disabled"
                  color="success"
                  // label="Số người"
                  className="basic-single"
                  type="text"
                  // defaultValue={200000}
                  placeholder="Nhập tên nhà cung cấp"
                  size="small"
                  name="name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="detailItem">
                <span className="itemKey">Số điện thoại:</span>
                <TextField
                  id="outlined-disabled"
                  color="success"
                  // label="Số người"
                  className="basic-single"
                  type="text"
                  // defaultValue={200000}
                  placeholder="Nhập số điện thoại"
                  size="small"
                  name="name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="detailItem">
                <span className="itemKey">Địa chỉ:</span>
                <Autocomplete
                  options={{
                    componentRestrictions: { country: "vn" }, // Optional: Limit search to Vietnam
                  }}
                  onPlaceChanged={onPlaceChanged}
                  onLoad={onLoad}
                >
                  <TextField
                    id="outlined-disabled"
                    color="success"
                    className="basic-single"
                    type="text"
                  placeholder="Nhập địa chỉ"
                    size="small"
                    name="name"
                  />
                </Autocomplete>
                <IconButton color="info" onClick={handleClickOpen}>
                  <MapIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        <div className="prodTitle">
          <button
            className="link"
            onClick={async () => {
              handleConfirmClick();
            }}
          >
            <ThumbUpAltIcon />
            <p>Xác nhận</p>
          </button>
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
          Nhập địa chỉ
        </DialogTitle>
        <DialogContent style={{ width: 1000 }}>
          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Tìm kiếm địa điểm chính xác:
          </DialogContentText>
          <div>
            {isLoaded ? (
              <div>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={position}
                  zoom={15}
                  onClick={handleMapClick}
                >
                  <MarkerF position={position} />
                </GoogleMap>
              </div>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SupplierCreatePage;
