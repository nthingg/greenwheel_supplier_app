import React, { useEffect, useState } from "react";
import "../../assets/scss/sidebar.scss";
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
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  LOAD_DETAIL_PROVIDER,
  LOAD_DETAIL_STAFF,
} from "../../services/graphql/provider";
import { Fastfood } from "@mui/icons-material";
import { REFRESH_AUTH } from "../../services/graphql/auth";

const SideBar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const providerId = localStorage.getItem("providerId");
  const [provider, setProvider] = useState(null);
  const [staff, setStaff] = useState(null);

  const [getProvider, { error, loading, data }] =
    useLazyQuery(LOAD_DETAIL_PROVIDER);

  const [
    getStaff,
    { error: errorStaff, loading: loadingStaff, data: dataStaff },
  ] = useLazyQuery(LOAD_DETAIL_STAFF);

  const refreshToken = localStorage.getItem("refreshToken");

  const [refresh, { data: dataRf, loading: loadingRf, error: errorRf }] =
    useMutation(REFRESH_AUTH);

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

  useEffect(() => {
    fetchData();
    if (refreshToken) {
      refreshAuth();
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
    </div>
  );
};

export default SideBar;
