import React, { useEffect, useState } from "react";
import "../../assets/scss/sidebar.scss";
import "../../assets/scss/announce-table.scss";
import Dashboard from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TerminalIcon from "@mui/icons-material/Terminal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MapIcon from "@mui/icons-material/Map";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  LOAD_DETAIL_PROVIDER,
  LOAD_DETAIL_STAFF,
} from "../../services/graphql/provider";
import { Fastfood } from "@mui/icons-material";
import { REFRESH_AUTH } from "../../services/graphql/auth";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  LOAD_ANNOUNCEMENT,
  MARK_ALL_ANNOUNCE,
  MARK_SINGLE_ANNOUNCE,
} from "../../services/graphql/announcement";

const SideBar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const providerId = localStorage.getItem("providerId");
  const [now, setNow] = useState(new Date());
  const [provider, setProvider] = useState(null);
  const [staff, setStaff] = useState(null);
  const [announcement, setAnnouncement] = useState([]);

  const [open, setOpen] = useState(false);

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
          <span className="logo">BTSS</span>
        </Link>
      </div>
      <div className="center">
        <ul>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <li>
              <Dashboard className="icon" />
              <span>Trang chủ</span>
            </li>
          </NavLink>
          {(role === "STAFF" || role === "PROVIDER") && ( // Conditional rendering for STAFF role
            <>
              <NavLink to="/orders" style={{ textDecoration: "none" }}>
                <li>
                  <CreditCardIcon className="icon" />
                  <span>Quản lý đơn hàng</span>
                </li>
              </NavLink>
            </>
          )}
          {!providerId && (
            <>
              <NavLink to="/providers" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span>Quản lý nhà cung cấp</span>
                </li>
              </NavLink>
            </>
          )}
          {providerId && (
            <>
              <NavLink to="/profile" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span>Hồ sơ nhà cung cấp</span>
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
                  <span className="name">Staff</span>
                  <span className="role">{staff?.name}</span>
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
                  <span className="name">Provider</span>
                  <span className="role">{provider?.name}</span>
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
    </div>
  );
};

export default SideBar;
