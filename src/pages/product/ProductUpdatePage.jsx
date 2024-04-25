import "../../assets/scss/products.scss";
import "../../assets/scss/shared.scss";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import Select from "react-select";
import { addPosts } from "../../services/apis/imageUploader";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_PRODUCT,
  LOAD_DETAIL_PRODUCT,
  UDPATE_PRODUCT,
} from "../../services/graphql/product";

const ProductUpdatePage = () => {
  const providerLogId = localStorage.getItem("providerId");
  const { providerId, productId } = useParams();
  const navigate = useNavigate();

  const typeOptions = [
    { value: "FOOD", label: "Thức ăn" },
    { value: "BEVERAGE", label: "Đồ uống" },
    { value: "CAMP", label: "Lều trại" },
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
  const [tenPercent, setTenPercent] = useState(0);

  //error
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState("");
  const [nameFinErr, setNameFinErr] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionHelperText, setDescriptionHelperText] = useState("");
  const [descriptionFinErr, setDescriptionFinErr] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [periodsError, setPeriodsError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [priceHelperText, setPriceHelperText] = useState("");
  const [priceFinErr, setPriceFinErr] = useState(false);
  const [partyError, setPartyError] = useState(false);
  const [partyHelperText, setPartyHelperText] = useState("");
  const [partyFinErr, setPartyFinErr] = useState(false);
  const [periodVisible, setPeriodVisible] = useState(false);
  const [openRedirect, setOpenRedirect] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [time, setTime] = useState("");
  const [appliedTime, setAppliedTime] = useState("");

  const handleClickOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClickOpenRedirect = () => {
    setOpenRedirect(true);
  };

  const handleCloseRedirect = () => {
    setOpenRedirect(false);
  };

  const handleClick = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnack = () => {
    setSnackbarOpen(false);
  };

  const {
    error: errProduct,
    loading: loadingProduct,
    data: dataProduct,
  } = useQuery(LOAD_DETAIL_PRODUCT, {
    variables: {
      id: parseInt(productId, 10),
    },
  });

  const [product, setProduct] = useState();
  useEffect(() => {
    if (
      !errProduct &&
      !loadingProduct &&
      dataProduct &&
      dataProduct["products"] &&
      dataProduct["products"]["nodes"]
    ) {
      setProduct(dataProduct["products"]["nodes"][0]);

      setName(dataProduct["products"]["nodes"][0].name);

      setFile({
        file: null,
        url: `https://d38ozmgi8b70tu.cloudfront.net${dataProduct["products"]["nodes"][0].imagePath}`,
      });

      const type = dataProduct["products"]["nodes"][0].type;
      let typeInit = null;
      for (let j = 0; j < typeOptions.length; j++) {
        if (typeOptions[j].value === type) {
          typeInit = typeOptions[j];
        }
      }
      setType(typeInit);

      setParty(dataProduct["products"]["nodes"][0].partySize);

      setDescription(dataProduct["products"]["nodes"][0].description);

      setPrice(dataProduct["products"]["nodes"][0].price);

      setTenPercent((dataProduct["products"]["nodes"][0].price * 110) / 100);

      const per = dataProduct["products"]["nodes"][0].periods;
      let perInit = [];
      for (let i = 0; i < per.length; i++) {
        for (let j = 0; j < periodsOptions.length; j++) {
          if (periodsOptions[j].value === per[i]) {
            perInit.push(periodsOptions[j]);
          }
        }
      }
      setPeriods(perInit);

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
  }, [dataProduct, loadingProduct, errProduct]);

  const [update, {}] = useMutation(UDPATE_PRODUCT);

  const handleConfirmClick = async () => {
    let imagePath = "";
    if (file.file !== null) {
      const imgName = await addPosts(file.file);
      imagePath = imgName;
    } else {
      imagePath = file.url;
    }

    let per = [];
    for (let index = 0; index < periods.length; index++) {
      per.push(periods[index].value);
    }

    const dataProduct = {
      description: description,
      partySize: parseInt(party, 10),
      periods: per,
      imageUrl: imagePath,
      name: name,
      productId: parseInt(productId, 10),
      type: type.value,
      price: parseInt(price, 10),
    };

    try {
      const { data } = await update({
        variables: {
          dto: dataProduct,
        },
      });
      const date = new Date(data.updateProduct);
      setTime(
        date.toLocaleTimeString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      );
      setOpenRedirect(true);
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
                <Link
                  to={`/profile/product/${productId}`}
                  className="navigateButton"
                >
                  <ArrowCircleLeftIcon />
                  <p>Trở về</p>
                </Link>
              )}
              {!providerLogId && (
                <Link
                  to={`/providers/${providerId}/product/${productId}`}
                  className="navigateButton"
                >
                  <ArrowCircleLeftIcon />
                  <p>Trở về</p>
                </Link>
              )}
            </div>
            <div className="return-title">
              <div className="return-header">Chỉnh sửa thông tin</div>
              {providerLogId && (
                <div className="return-body">
                  <p>Hồ sơ nhà cung cấp</p>
                  <ArrowForwardIosIcon />
                  <p>{product?.name}</p>
                </div>
              )}
              {!providerLogId && (
                <div className="return-body">
                  <p>Danh sách nhà cung cấp</p>
                  <ArrowForwardIosIcon />
                  <p>Chi tiết nhà cung cấp</p>
                  <ArrowForwardIosIcon />
                  <p>{product?.name}</p>
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
                    ? file.url
                    : "https://vinhphucwater.com.vn/wp-content/uploads/2023/05/no-image.jpg"
                }
              />
              <div className="img-btns">
                <button
                  className="link reset"
                  onClick={async () => {
                    setFile({
                      file: null,
                      url: `https://d38ozmgi8b70tu.cloudfront.net${product?.imagePath}`,
                    });
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
                      const imgData = {
                        file: e.target.files[0],
                        url: URL.createObjectURL(e.target.files[0]),
                      };
                      setFile(imgData);
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
                    placeholder="Nhập tên dịch vụ"
                    size="small"
                    name="name"
                    value={name}
                    error={nameError}
                    helperText={nameHelperText}
                    sx={{
                      width: "15%",
                    }}
                    onChange={(e) => {
                      if (e.target.value.length < 3) {
                        setNameError(true);
                        setNameHelperText("Tên dịch vụ gồm ít nhất 3 kí tự");
                        setNameFinErr(true);
                      } else if (e.target.value.length > 30) {
                        setNameError(true);
                        setNameHelperText(
                          "Tên dịch vụ gồm nhiều nhất 30 kí tự"
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
                  <span className="itemKey">Loại:</span>
                  <Select
                    placeholder={"Chọn loại dịch vụ"}
                    className="basic-single"
                    classNamePrefix="select"
                    isDisabled={false}
                    isClearable={true}
                    name="type"
                    options={typeOptions}
                    value={type}
                    onChange={(e) => {
                      if (e === null) {
                        setType("");
                        setPeriodVisible(false);
                        setPeriodsError(false);
                        setTypeError(true);
                        return;
                      }
                      if (e.value === "FOOD" || e.value === "BEVERAGE") {
                        setPeriodVisible(true);
                        setPeriodsError(true);
                      } else {
                        setPeriodVisible(false);
                        setPeriodsError(false);
                      }
                      setType(e);

                      if (
                        e.value === "ROOM" ||
                        e.value === "CAMP" ||
                        e.value === "VEHICLE"
                      ) {
                        setPeriods(periodsOptions);
                      } else {
                        setPeriods([]);
                      }
                      setTypeError(false);
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
                    type="number"
                    placeholder="Nhập số người đề xuất"
                    size="small"
                    name="partySize"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">người</InputAdornment>
                      ),
                    }}
                    value={party}
                    error={partyError}
                    helperText={partyHelperText}
                    sx={{
                      width: "15%",
                    }}
                    onChange={(e) => {
                      if (e.target.value < 1) {
                        setPartyError(true);
                        setPartyHelperText("Số người đề xuất ít nhất là 1");
                        setPartyFinErr(true);
                      } else if (e.target.value > 10) {
                        setPartyError(true);
                        setPartyHelperText("Số người đề xuất nhiều nhất là 10");
                        setPartyFinErr(true);
                      } else {
                        setPartyError(false);
                        setPartyHelperText("");
                        setPartyFinErr(false);
                      }
                      setParty(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="right">
                <div className="detailItem">
                  <span className="itemKey">Giá:</span>
                  <TextField
                    id="outlined-disabled"
                    className="basic-single"
                    type="number"
                    placeholder="Nhập giá tiền dịch vụ"
                    size="small"
                    name="price"
                    value={price}
                    error={priceError}
                    helperText={priceHelperText}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">đ</InputAdornment>
                      ),
                      //   inputProps: { max: 10000000 },
                    }}
                    sx={{
                      width: "15%",
                    }}
                    onChange={(e) => {
                      const formattedPrice =
                        tenPercent.toLocaleString("vi-VN") + "đ";
                      if (e.target.value < 10000) {
                        setPriceError(true);
                        setPriceHelperText(
                          "Giá dịch vụ không thấp hơn 10.000đ"
                        );
                        setPriceFinErr(true);
                      } else if (e.target.value >= tenPercent) {
                        setPriceError(true);
                        setPriceHelperText(
                          `Giá dịch vụ không được tăng quá 10% (${formattedPrice})`
                        );
                        setPriceFinErr(true);
                      } else {
                        setPriceError(false);
                        setPriceHelperText("");
                        setPriceFinErr(false);
                      }
                      setPrice(e.target.value);
                    }}
                  />
                </div>
                {periodVisible && (
                  <div className="detailItem">
                    <span className="itemKey">Thời điểm phục vụ:</span>
                    <Select
                      placeholder={"Chọn thời điểm phục vụ dịch vụ"}
                      className="basic-single"
                      classNamePrefix="select"
                      isDisabled={false}
                      isClearable={true}
                      value={periods}
                      name="periods"
                      isMulti
                      options={periodsOptions}
                      onChange={(e) => {
                        if (e.length > 0) {
                          setPeriods(e);
                          setPeriodsError(false);
                        } else {
                          setPeriods([]);
                          setPeriodsError(true);
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
                )}
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
                  value={description}
                  error={descriptionError}
                  helperText={descriptionHelperText}
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
                    if (e.target.value.length < 3) {
                      setDescriptionError(true);
                      setDescriptionHelperText(
                        "Chi tiết dịch vụ gồm ít nhất 3 kí tự"
                      );
                      setDescriptionFinErr(true);
                    } else if (e.target.value.length > 100) {
                      setDescriptionError(true);
                      setDescriptionHelperText(
                        "Chi tiết dịch vụ gồm nhiều nhất 100 kí tự"
                      );
                      setDescriptionFinErr(true);
                    } else {
                      setDescriptionError(false);
                      setDescriptionHelperText("");
                      setDescriptionFinErr(false);
                    }
                    setDescription(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="btn-group">
          {!nameFinErr &&
            !imgError &&
            !priceFinErr &&
            !typeError &&
            !periodsError &&
            !partyFinErr &&
            !descriptionFinErr && (
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

          {(priceFinErr ||
            imgError ||
            nameFinErr ||
            typeError ||
            periodsError ||
            partyFinErr ||
            descriptionFinErr) && (
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
          Xác nhận cập nhật {product?.name}
        </DialogTitle>
        <DialogContent style={{ width: 620, height: 180 }}>
          <p className="alert-price-change">
            Bạn có chắc muốn chỉnh sửa dịch vụ? Các thay đổi sẽ được áp dụng
            vào: {appliedTime}
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
            Sự thay đổi giá dịch vụ sẽ được áp dụng vào: {time}
          </p>

          <div className="btns-group-dialog">
            <button
              className="link confirm"
              onClick={() => {
                if (providerLogId) {
                  navigate(`/profile/product/${productId}`);
                } else {
                  navigate(`/providers/${providerId}/product/${productId}`);
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

export default ProductUpdatePage;
