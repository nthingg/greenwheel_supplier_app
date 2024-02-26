import React from "react";
import "../assets/scss/sidebar.scss";
import Dashboard from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TerminalIcon from "@mui/icons-material/Terminal";
import MapIcon from "@mui/icons-material/Map";
import { Link, NavLink, useNavigate } from "react-router-dom";
import FastfoodIcon from "@mui/icons-material/Fastfood";

const SideBar = () => {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
    navigate(0);
  }
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Greenwheels</span>
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
          {/* <NavLink to="/profile" style={{ textDecoration: "none" }}>
            <li>
              <PersonIcon className="icon" />
              <span>Hồ sơ</span>
            </li>
          </NavLink> */}
          <NavLink to="/plans" style={{ textDecoration: "none" }}>
            <li>
              <MapIcon className="icon" />
              <span>Quản lý kế hoạch</span>
            </li>
          </NavLink>
          <NavLink to="/destinations" style={{ textDecoration: "none" }}>
            <li>
              <MapIcon className="icon" />
              <span>Quản lý địa điểm</span>
            </li>
          </NavLink>
          <NavLink to="/suppliers" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Quản lý nhà cung cấp</span>
            </li>
          </NavLink>
          {/* <NavLink to="/products" style={{ textDecoration: "none" }}>
            <li>
              <FastfoodIcon className="icon" />
              <span>Quản lý dịch vụ</span>
            </li>
          </NavLink> */}
          <NavLink to="/orders" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Quản lý đơn hàng</span>
            </li>
          </NavLink>
          <NavLink to="/emulator" style={{ textDecoration: "none" }}>
            <li>
              <TerminalIcon className="icon" />
              <span>Giả lập</span>
            </li>
          </NavLink>
        </ul>
      </div>
      <div className="bottom" style={{ marginTop: "auto" }}>
        <div className="user_container">
          <div className="left">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa3bFIMl8a3khsqlib3IMlYzC_jEi0ul-b_Q&usqp=CAU  "
              className="user_image"
              alt="Profile"
            ></img>

            <div className="user_info">
              <span className="name">Administrator</span>
              <span className="role">Admin</span>
            </div>
          </div>
          <div>
            <button
              className="btn btn-lg text-uppercase fw-bold"
              type="button"
              onClick={logout}
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
