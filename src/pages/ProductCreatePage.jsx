import "../assets/scss/productCreate.scss";
import "../assets/scss/shared.scss";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { InputAdornment, TextField } from "@mui/material";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { addPosts, useAddProduct } from "../services/requests";

const ProductCreatePage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [price, setPrice] = useState(0);
  const [periods, setPeriods] = useState([]);
  const [partySize, setPartySize] = useState(0);

  const { handleAddProduct, loadingAdd, errorAdd } = useAddProduct();

  const serviceOptions = [
    { value: "FOOD", label: "Thức ăn" },
    { value: "BEVERAGE", label: "Đồ uống" },
    { value: "CAMP", label: "Lều trại" },
    { value: "ROOM", label: "Phòng nghỉ" },
    { value: "VEHICLE", label: "Xe cộ" },
    { value: "OTHER", label: "Khác" },
  ];

  const paymentOptions = [
    { value: "PER_DAY", label: "Thuê theo ngày" },
    { value: "PER_UNIT", label: "Mua sản phẩm" },
  ];

  const periodOptions = [
    { value: "MORNING", label: "Sáng" },
    { value: "NOON", label: "Trưa" },
    { value: "AFTERNOON", label: "Chiều" },
    { value: "EVENING", label: "Tối" },
  ];

  const handleConfirmClick = async () => {
    // Example usage:
    const imgName = await addPosts(file);

    // // Add your specific code here
    // // Do something with the filename
    const convertPeriods = JSON.stringify();
    const productData = {
      name,
      type,
      paymentType, // Assuming you have a variable for status
      price: parseInt(price),
      periods: periods.map((item) => item.value),
      partySize: parseInt(partySize),
      imageUrl: imgName, // Use the uploaded file name as thumbnailUrl
      supplierId: parseInt(supplierId),
    };

    console.log(productData);

    const prodCreated = await handleAddProduct(productData);
    if (prodCreated !== null) {
      navigate(`/suppliers/${supplierId}`);
    } else {
      // Handle product creation failure
      console.error("Product creation failed");
      // Display an error message to the user
    }
  };

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
                <span className="itemKey">Tên dịch vụ:</span>
                <TextField
                  id="outlined-disabled"
                  color="success"
                  // label="Số người"
                  className="basic-single"
                  type="text"
                  // defaultValue={200000}
                  placeholder="Nhập tên dịch vụ"
                  size="small"
                  name="name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>

              <div className="detailItem">
                <span className="itemKey">Loại dịch vụ:</span>
                <Select
                  placeholder={"Chọn loại dịch vụ"}
                  className="basic-single"
                  classNamePrefix="select"
                  isDisabled={false}
                  isClearable={false}
                  name="service"
                  options={serviceOptions}
                  onChange={(e) => {
                    setType(e.value);
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#58D68D",
                      primary: "#28B463",
                    },
                  })}
                />
              </div>

              <div className="detailItem">
                <span className="itemKey">Hình thức thanh toán:</span>
                <Select
                  placeholder={"Chọn hình thức thanh toán"}
                  className="basic-single"
                  classNamePrefix="select"
                  isDisabled={false}
                  isClearable={false}
                  name="paymentType"
                  options={paymentOptions}
                  onChange={(e) => {
                    setPaymentType(e.value);
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#58D68D",
                      primary: "#28B463",
                    },
                  })}
                />
              </div>
              <div className="detailItem">
                <span className="itemKey">Đơn giá:</span>
                <TextField
                  id="outlined-disabled"
                  // label="Số người"
                  className="basic-single"
                  type="text"
                  // defaultValue={200000}
                  placeholder="Nhập đơn giá"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">đ</InputAdornment>
                    ),
                  }}
                  name="price"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  color="success"
                />
              </div>
              <div className="detailItem">
                <span className="itemKey">Thời gian phục vụ:</span>
                <Select
                  placeholder={"Chọn thời gian phục vụ"}
                  className="basic-single"
                  classNamePrefix="select"
                  isDisabled={false}
                  isClearable={false}
                  name="periods"
                  isMulti
                  options={periodOptions}
                  onChange={(e) => {
                    setPeriods(e);
                    console.log(e);
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#58D68D",
                      primary: "#28B463",
                    },
                  })}
                />
              </div>
              <div className="detailItem">
                <span className="itemKey">Phù hợp với:</span>
                <TextField
                  id="outlined-disabled"
                  // label="Số người"
                  className="basic-single"
                  type="text"
                  // defaultValue={200000}
                  placeholder="Nhập số người phù hợp"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">người</InputAdornment>
                    ),
                  }}
                  size="small"
                  name="partySize"
                  onChange={(e) => {
                    setPartySize(e.target.value);
                  }}
                  color="success"
                />
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
    </div>
  );
};

export default ProductCreatePage;
