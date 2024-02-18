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

const SupplierCreatePage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");

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

export default SupplierCreatePage;