import React, { useEffect, useState } from "react";
import "../../assets/scss/sidebar.scss";
import "../../assets/scss/pwd-dialog.scss";
import "../../assets/scss/announce-table.scss";
import Dashboard from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import TerminalIcon from "@mui/icons-material/Terminal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MapIcon from "@mui/icons-material/Map";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { useLazyQuery, useMutation } from "@apollo/client";
import LockResetIcon from "@mui/icons-material/LockReset";
import {
  LOAD_DETAIL_PROVIDER,
  LOAD_DETAIL_STAFF,
} from "../../services/graphql/provider";
import { Fastfood } from "@mui/icons-material";
import { CHANGE_PWD, REFRESH_AUTH } from "../../services/graphql/auth";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  LOAD_ANNOUNCEMENT,
  MARK_ALL_ANNOUNCE,
  MARK_SINGLE_ANNOUNCE,
} from "../../services/graphql/announcement";

const SideBar = () => {
  const navigate = useNavigate();
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");

  const role = localStorage.getItem("role");
  const providerId = localStorage.getItem("providerId");
  const [now, setNow] = useState(new Date());
  const [provider, setProvider] = useState(null);
  const [staff, setStaff] = useState(null);
  const [announcement, setAnnouncement] = useState([]);
  const [open, setOpen] = useState(false);
  const [openPwd, setOpenPwd] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrMsg] = useState(false);
  //error
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [pwdError, setPwdError] = useState(false);
  const [pwdHelperText, setPwdHelperText] = useState("");
  const [newError, setNewError] = useState(false);
  const [newHelperText, setNewHelperText] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  const [confirmHelperText, setConfirmHelperText] = useState("");
  const [pwdFinErr, setPwdFinErr] = useState(true);
  const [newFinErr, setNewFinErr] = useState(true);
  const [confirmFinErr, setConfirmFinErr] = useState(true);

  const handleCloseSucessSnack = () => {
    setSnackbarSuccessOpen(false);
  };

  const handleClick = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnack = () => {
    setSnackbarOpen(false);
  };

  const handleClickOpenPwd = () => {
    setOpenPwd(true);
  };

  const handleClosePwd = async () => {
    setOpenPwd(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  const [getProvider, { error, loading, data }] =
    useLazyQuery(LOAD_DETAIL_PROVIDER);

  const [getAnnouncements, {}] = useLazyQuery(LOAD_ANNOUNCEMENT, {
    fetchPolicy: "no-cache",
  });

  const [
    getStaff,
    { error: errorStaff, loading: loadingStaff, data: dataStaff },
  ] = useLazyQuery(LOAD_DETAIL_STAFF);

  const refreshToken = localStorage.getItem("refreshToken");

  const [refresh, { data: dataRf, loading: loadingRf, error: errorRf }] =
    useMutation(REFRESH_AUTH);

  const [markAll, { data: dataAll, loading: loadingAll, error: errorAll }] =
    useMutation(MARK_ALL_ANNOUNCE);

  const [
    markSingle,
    { data: dataSingle, loading: loadingSingle, error: errorSingle },
  ] = useMutation(MARK_SINGLE_ANNOUNCE);

  const markSingleRead = async (id) => {
    try {
      const { data } = await markSingle({
        variables: {
          id: id,
        },
      });
      fetchAnnouncements();
    } catch (error) {
      console.log(error);
    }
  };

  const markAllRead = async () => {
    try {
      const { data } = await markAll();
      fetchAnnouncements();
    } catch (error) {
      console.log(error);
    }
  };

  const refreshAuth = async (e) => {
    try {
      const { data } = await refresh({
        variables: {
          token: refreshToken,
        },
      });

      localStorage.setItem("adminToken", data["refreshAuth"]["accessToken"]);
      localStorage.setItem("refreshToken", data["refreshAuth"]["refreshToken"]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      let providerId = localStorage.getItem("providerId");
      let staffId = localStorage.getItem("staffId");

      if (providerId) {
        const { data: dataProvider } = await getProvider({
          variables: {
            id: parseInt(providerId, 10),
          },
        });
        setProvider(dataProvider["providers"]["nodes"][0]);
      } else {
        const { data: dataStaff } = await getStaff({
          variables: {
            id: parseInt(staffId, 10),
          },
        });
        setStaff(dataStaff["accounts"]["nodes"][0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data } = await getAnnouncements();
      setAnnouncement(data["announcements"]["nodes"]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    if (refreshToken) {
      refreshAuth();
      fetchAnnouncements();
    }
  }, []);

  const [changePwd, { data: dataPwd, error: errorPwd }] =
    useMutation(CHANGE_PWD);

  const handleConfirmClick = async () => {
    const dataPwd = {
      oldPassword: oldPwd,
      newPassword: confirmPwd,
    };

    try {
      const { data } = await changePwd({
        variables: {
          dto: dataPwd,
        },
      });
      setSuccessMsg("Đổi mật khẩu thành công!");
      setSnackbarSuccessOpen(true);
      handleClosePwd();
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
    }
  };

  return (
    <div className="sidebar">
      <div className="top">
        <div className="img-cont">
          <img
            src="https://btss-uploads.s3.ap-southeast-2.amazonaws.com/logo.png"
            className="user_image"
            alt="Profile"
          ></img>
        </div>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo label">BTSS</span>
        </Link>
      </div>
      <div className="center">
        <ul>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <li>
              <Dashboard className="icon" />
              <span className="label">Trang chủ</span>
            </li>
          </NavLink>
          {(role === "STAFF" || role === "PROVIDER") && ( // Conditional rendering for STAFF role
            <>
              <NavLink to="/orders" style={{ textDecoration: "none" }}>
                <li>
                  <CreditCardIcon className="icon" />
                  <span className="label">Quản lý đơn hàng</span>
                </li>
              </NavLink>
            </>
          )}
          {!providerId && (
            <>
              <NavLink to="/providers" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span className="label">Quản lý nhà cung cấp</span>
                </li>
              </NavLink>
            </>
          )}
          {providerId && (
            <>
              <NavLink to="/profile" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span className="label">Hồ sơ nhà cung cấp</span>
                </li>
              </NavLink>
            </>
          )}
        </ul>
      </div>
      <div className="bottom" style={{ marginTop: "auto" }}>
        <div className="user_container">
          <div className="left">
            {role === "STAFF" && (
              <div className="left">
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  className="user_image"
                  alt="Profile"
                ></img>
                <div className="user_info">
                  <div className="pwd_block">
                    <span className="name label">Staff</span>
                    <Tooltip title="Đổi mật khẩu">
                      <LockResetIcon
                        onClick={() => {
                          handleClickOpenPwd();
                        }}
                      />
                    </Tooltip>
                  </div>
                  <span className="role label">{staff?.name}</span>
                </div>
              </div>
            )}
            {role === "PROVIDER" && (
              <div className="left">
                <img
                  src={`https://d38ozmgi8b70tu.cloudfront.net${provider?.imagePath}`}
                  className="user_image"
                  alt="Profile"
                ></img>
                <div className="user_info">
                  <div className="pwd_block">
                    <span className="name label">Provider</span>
                    <Tooltip title="Đổi mật khẩu">
                      <LockResetIcon
                        onClick={() => {
                          handleClickOpenPwd();
                        }}
                      />
                    </Tooltip>
                  </div>
                  <span className="role label">{provider?.name}</span>
                </div>
              </div>
            )}
            <button
              className="user_logout"
              type="button"
              onClick={(e) => {
                localStorage.removeItem("staffToken");
                localStorage.removeItem("providerId");
                localStorage.removeItem("staffId");
                localStorage.removeItem("refreshToken");
                navigate("/");
                navigate(0);
              }}
            >
              <ExitToAppIcon className="logout" />
            </button>
          </div>
        </div>
      </div>
      <Fab
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            setOpen(true);
          }
        }}
        sx={{ color: "#2c3d50" }}
        style={{ right: 10, bottom: 10, position: "fixed", zIndex: 1600 }}
      >
        <NotificationsActiveIcon />
      </Fab>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        PaperProps={{
          sx: { position: "fixed", bottom: -20, right: 50, width: 500 },
        }}
      >
        <DialogTitle backgroundColor={"#2c3d50"} color={"white"}>
          <div className="mark">
            <div className="left">
              <p>Thông báo đơn hàng</p>
            </div>
            <div className="right">
              <Tooltip title="Đã đọc tất cả">
                <button
                  onClick={() => {
                    markAllRead();
                  }}
                >
                  <FactCheckIcon />
                </button>
              </Tooltip>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="announce-table">
            <div className="body">
              {announcement.map((message, index) => (
                <div
                  key={index}
                  className="response-item"
                  onClick={() => {
                    markSingleRead(message.id);
                    navigate(`/orders/${message.order.id}`);
                  }}
                >
                  <p className="response-msg">
                    {message.title}{" "}
                    {message.isRead === false && (
                      <span style={{ color: "red", fontSize: 18 }}>!</span>
                    )}
                  </p>
                  <p className="response-detail">{message.body}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openPwd}
        onClose={() => {
          setOpenPwd(false);
        }}
      >
        <DialogTitle backgroundColor={"#2c3d50"} color={"white"}>
          <div className="mark">
            <div className="left">
              <p>Thay đổi mật khẩu</p>
            </div>
            <div className="right"></div>
          </div>
        </DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <div className="password-cont">
            <div className="body">
              <div className="detailItem">
                <span className="itemKey">Mật khẩu cũ:</span>
                <TextField
                  id="outlined-disabled"
                  className="basic-single"
                  type="password"
                  placeholder="Nhập mật khẩu cũ"
                  size="small"
                  name="oldPwd"
                  error={pwdError}
                  helperText={pwdHelperText}
                  sx={{
                    width: "15%",
                  }}
                  onChange={(e) => {
                    if (e.target.value.length < 8) {
                      setPwdError(true);
                      setPwdHelperText("Độ dài mật khẩu ít nhất 8 kí tự");
                      setPwdFinErr(true);
                    } else if (e.target.value.length > 20) {
                      setPwdError(true);
                      setPwdHelperText("Độ dài mật khẩu nhiều nhất 20 kí tự");
                      setPwdFinErr(true);
                    } else {
                      setPwdError(false);
                      setPwdHelperText("");
                      setPwdFinErr(false);
                      setOldPwd(e.target.value);
                    }
                  }}
                />
              </div>
              <div className="detailItem">
                <span className="itemKey">Mật khẩu mới:</span>
                <TextField
                  id="outlined-disabled"
                  className="basic-single"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  size="small"
                  name="newPwd"
                  error={newError}
                  helperText={newHelperText}
                  sx={{
                    width: "15%",
                  }}
                  onChange={(e) => {
                    if (e.target.value.length < 8) {
                      setNewError(true);
                      setNewHelperText("Độ dài mật khẩu ít nhất 8 kí tự");
                      setNewFinErr(true);
                    } else if (e.target.value.length > 20) {
                      setNewError(true);
                      setNewHelperText("Độ dài mật khẩu nhiều nhất 20 kí tự");
                      setNewFinErr(true);
                    } else {
                      setNewError(false);
                      setNewHelperText("");
                      setNewFinErr(false);
                      setNewPwd(e.target.value);
                    }
                  }}
                />
              </div>
              <div className="detailItem">
                <span className="itemKey">Xác nhận mật khẩu:</span>
                <TextField
                  id="outlined-disabled"
                  className="basic-single"
                  type="password"
                  placeholder="Xác nhận lại mật khẩu"
                  size="small"
                  name="confirmPwd"
                  error={confirmError}
                  helperText={confirmHelperText}
                  sx={{
                    width: "15%",
                  }}
                  onChange={(e) => {
                    if (e.target.value !== newPwd) {
                      setConfirmError(true);
                      setConfirmHelperText("Mật khẩu xác nhận không đúng");
                      setConfirmFinErr(true);
                    } else {
                      setConfirmError(false);
                      setConfirmHelperText("");
                      setConfirmFinErr(false);
                      setConfirmPwd(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="confirm-btn">
              {/* <button className="btn-modal-filter" onClick={() => {}}>
                Xác nhận
              </button> */}
              {!pwdFinErr && !newFinErr && !confirmFinErr && (
                <button
                  className="btn-modal-filter"
                  onClick={async () => {
                    handleConfirmClick();
                  }}
                >
                  <ThumbUpAltIcon />
                  <span>Xác nhận</span>
                </button>
              )}

              {(pwdFinErr || newFinErr || confirmFinErr) && (
                <button className="btn-modal-filter bg-gray">
                  <ThumbUpAltIcon />
                  <span>Xác nhận</span>
                </button>
              )}
            </div>
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
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbarSuccessOpen}
        onClose={handleCloseSucessSnack}
        autoHideDuration={2000}
        key={vertical + horizontal + "success"}
      >
        <Alert
          onClose={handleCloseSucessSnack}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SideBar;
