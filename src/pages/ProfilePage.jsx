import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import SaveIcon from "@mui/icons-material/Save";
import { Link } from "react-router-dom";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: 10.779784,
  lng: 106.695418,
};

const defaultAddress =
  "Dinh Độc Lập, 135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Thành phố Hồ Chí Minh";

function ProfileUpdate() {
  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState(center);
  const [address, setAddress] = useState(defaultAddress);

  const handleToggleMap = () => {
    setShowMap(!showMap);
  };

  const handleMapClick = (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setPosition({ lat, lng });
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCzYlFQ9BHxHZRRYS2RFMz-ofS_lWw_XLo`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          setAddress(data.results[0].formatted_address);
        } else {
          setAddress("Không có địa chỉ");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setShowMap(false);
  };

  return (
    <div className="profile">
      <div className="profileContainer">
        <div className="left">
          <img
            src="https://phongcachmoc.vn/upload/images/tin-tuc/20%20mau%20nha%20hang%20dep/update-07-2022/Sushi-World-Ton-That-Thiep-12.JPG"
            alt=""
            className="itemImg"
          />
          <div className="sharedTitle">
            <input value="Nhà Hàng Ông Sáu"></input>
          </div>

          <div className="item">
            <div className="details">
              <h1 className="itemTitle"></h1>
              <div className="detailItem">
                <span className="itemKey">Loại hình dịch vụ:</span>
                <span className="itemValue">Nhà hàng</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Số điện thoại:</span>
                <span className="itemValue">
                  <input value="0987123123"></input>
                </span>
              </div>
              <div style={{ display: "flex" }}>
                <div>
                  <div className="detailItem">
                    <span className="itemKey">Địa chỉ:</span>
                    <span className="itemValue">{address}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Toạ độ :</span>
                    <span className="itemValue">
                      {position.lat}, {position.lng}
                    </span>
                  </div>
                </div>
                <div>
                  <button className="detailsButton" onClick={handleToggleMap}>
                    <EditLocationAltIcon />
                    {showMap ? "Ẩn bản đồ" : "Chỉnh sửa"}
                  </button>
                  {/* {showMap && (
                    <LoadScript googleMapsApiKey="AIzaSyCzYlFQ9BHxHZRRYS2RFMz-ofS_lWw_XLo">
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={position}
                        zoom={15}
                        onClick={handleMapClick}
                      >
                        <Marker position={position} />
                      </GoogleMap>
                    </LoadScript>
                  )} */}
                  <LoadScript googleMapsApiKey="AIzaSyCzYlFQ9BHxHZRRYS2RFMz-ofS_lWw_XLo">
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={position}
                      zoom={15}
                      onClick={handleMapClick}
                    >
                      <Marker position={position} />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>
            </div>
          </div>
          <div className="sharedTitle">
            <Link to="/profile" className="link">
              <SaveIcon />
              <p>Lưu</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate;
