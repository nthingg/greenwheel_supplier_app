import "../../assets/scss/products.scss";
import "../../assets/scss/shared.scss";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Alert, InputAdornment, Snackbar, TextField } from "@mui/material";
import Select from "react-select";
import { addPosts } from "../../services/apis/imageUploader";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT } from "../../services/graphql/product";

const ProductAddPage = () => {
  const providerLogId = localStorage.getItem("providerId");
  const { providerId } = useParams();
  const navigate = useNavigate();

  const typeOptions = [
    { value: "BEVERAGE", label: "Đồ uống" },
    { value: "CAMP", label: "Lều trại" },
    { value: "FOOD", label: "Thức ăn" },
    { value: "ROOM", label: "Phòng nghỉ" },
    { value: "VEHICLE", label: "Phương tiện" },
  ];

  const periodsOptions = [
    { value: "MORNING", label: "Sáng" },
    { value: "NOON", label: "Trưa" },
    { value: "AFTERNOON", label: "Chiều" },
    { value: "EVENING", label: "Tối" },
  ];

  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [party, setParty] = useState(0);
  const [type, setType] = useState("");
  const [periods, setPeriods] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [errorMsg, setErrMsg] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnack = () => {
    setSnackbarOpen(false);
  };

  const [add, { data: dataAdd, error: errorAdd }] = useMutation(ADD_PRODUCT);

  const handleConfirmClick = async () => {
    const imgName = await addPosts(file);

    let per = [];
    for (let index = 0; index < periods.length; index++) {
      per.push(periods[index].value);
    }

    const dataProduct = {
      description: description,
      partySize: parseInt(party, 10),
      periods: per,
      imageUrl: imgName,
      name: name,
      providerId: parseInt(providerId, 10),
      type: type,
      price: parseInt(price, 10),
    };

    try {
      const { data } = await add({
        variables: {
          dto: dataProduct,
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

  return (
    <div className="product-create">
      <div className="shared-title">
        <div className="navigation">
          <div className="left">
            <div className="return-btn">
              {providerLogId && (
                <Link to={`/profile`} className="navigateButton">
                  <ArrowCircleLeftIcon />
                  <p>Trở về</p>
                </Link>
              )}
              {!providerLogId && (
                <Link
                  to={`/providers/${providerId}`}
                  className="navigateButton"
                >
                  <ArrowCircleLeftIcon />
                  <p>Trở về</p>
                </Link>
              )}
            </div>
            <div className="return-title">
              <div className="return-header">Thêm dịch vụ</div>
              {providerLogId && (
                <div className="return-body">
                  <p>Hồ sơ nhà cung cấp</p>
                  <ArrowForwardIosIcon />
                  <p>Thêm dịch vụ</p>
                </div>
              )}
              {!providerLogId && (
                <div className="return-body">
                  <p>Danh sách nhà cung cấp</p>
                  <ArrowForwardIosIcon />
                  <p>Chi tiết nhà cung cấp</p>
                  <ArrowForwardIosIcon />
                  <p>Thêm dịch vụ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="product-add-cont">
        <div className="product-create-cont">
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
                    className="basic-single"
                    type="text"
                    placeholder="Nhập tên dịch vụ"
                    size="small"
                    name="name"
                    sx={{
                      width: "15%",
                    }}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="detailItem">
                  <span className="itemKey">Loại:</span>
                  <Select
                    placeholder={"Chọn loại dịch vụ"}
                    className="basic-single"
                    classNamePrefix="select"
                    isDisabled={false}
                    isClearable={true}
                    name="type"
                    options={typeOptions}
                    onChange={(e) => {
                      setType(e.value);
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
                <div className="detailItem">
                  <span className="itemKey">Số người đề xuất:</span>
                  <TextField
                    id="outlined-disabled"
                    className="basic-single"
                    type="text"
                    placeholder="Nhập số người đề xuất"
                    size="small"
                    name="partySize"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">người</InputAdornment>
                      ),
                    }}
                    sx={{
                      width: "15%",
                    }}
                    onChange={(e) => {
                      setParty(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="right">
                <div className="detailItem">
                  <span className="itemKey">Thời điểm phục vụ:</span>
                  <Select
                    placeholder={"Chọn thời điểm phục vụ dịch vụ"}
                    className="basic-single"
                    classNamePrefix="select"
                    isDisabled={false}
                    isClearable={true}
                    name="periods"
                    isMulti
                    options={periodsOptions}
                    onChange={(e) => {
                      setPeriods(e);
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
                <div className="detailItem">
                  <span className="itemKey">Giá:</span>
                  <TextField
                    id="outlined-disabled"
                    className="basic-single"
                    type="text"
                    placeholder="Nhập giá tiền dịch vụ"
                    size="small"
                    name="price"
                    value={price}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">đ</InputAdornment>
                      ),
                      inputProps: { max: 10000000 },
                    }}
                    sx={{
                      width: "15%",
                    }}
                    onChange={(e) => {
                      let it = parseInt(e.target.value);
                      const formattedPrice = e.target.value.toLocaleString(
                        "vi-VN",
                        {
                          style: "currency",
                          currency: "VND",
                        }
                      );
                      console.log(formattedPrice);
                      setPrice(formattedPrice);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="details">
              <div className="detailItem description">
                <span className="itemKey">Mô tả:</span>
                <TextField
                  id="outlined-disabled"
                  className="textarea"
                  multiline
                  rows={6}
                  type="text"
                  placeholder="Nhập mô tả"
                  size="small"
                  name="description"
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
                    setDescription(e.target.value);
                  }}
                />
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

export default ProductAddPage;
