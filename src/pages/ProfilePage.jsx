import "../assets/scss/profile.scss";
import "../assets/scss/shared.scss";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const ProfilePage = () => {
  return (
    <div className="profile">
      <div className="profileContainer">
        <div className="left">
          <div className="sharedTitle">
            <p>Nhà Hàng Ông Sáu</p>
            <Link to="/products/new" className="link">
              <EditIcon />
              <p>Chỉnh sửa</p>
            </Link>
          </div>
          <img
            src="https://phongcachmoc.vn/upload/images/tin-tuc/20%20mau%20nha%20hang%20dep/update-07-2022/Sushi-World-Ton-That-Thiep-12.JPG"
            alt=""
            className="itemImg"
          />
          <div className="item">
            <div className="details">
              <h1 className="itemTitle">Thông tin</h1>
              <div className="detailItem">
                <span className="itemKey">Địa chỉ:</span>
                <span className="itemValue">
                  Tỉnh Quảng Nam, huyện Điện Bàn, xã Điện Phương, thôn Triêm Nam
                </span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Loại hình dịch vụ:</span>
                <span className="itemValue">Nhà hàng</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Số điện thoại:</span>
                <span className="itemValue">0987123123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
