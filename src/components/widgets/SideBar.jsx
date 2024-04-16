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
import { useLazyQuery } from "@apollo/client";
import { LOAD_DETAIL_PROVIDER } from "../../services/graphql/provider";

const SideBar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const providerId = localStorage.getItem("providerId");
  const [provider, setProvider] = useState(null);

  const [getProvider, { error, loading, data }] =
    useLazyQuery(LOAD_DETAIL_PROVIDER);

  const fetchData = async () => {
    try {
      let providerId = localStorage.getItem("providerId");

      const { data: dataProvider } = await getProvider({
        variables: {
          id: parseInt(providerId, 10),
        },
      });
      setProvider(dataProvider["providers"]["nodes"][0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="sidebar">
      <div className="top">
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
          {/* <NavLink to="/products" style={{ textDecoration: "none" }}>
            <li>
              <FastfoodIcon className="icon" />
              <span>Quản lý dịch vụ</span>
            </li>
          </NavLink> */}
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
                  <span className="name">Provider</span>
                  <span className="role">BTSS Provider</span>
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
