import "../assets/scss/travelerProfile.scss";
import "../assets/scss/traceTable.scss";
import "../assets/scss/shared.scss";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, styled } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import { LOAD_DETAIL_ACCOUNT } from "../services/graphql/account";
import PlanTable from "../components/PlanTable";

const TravelerProfilePage = () => {
  const { travelerId } = useParams();
  const [traveler, setTraveler] = useState(null);
  const [plans, setPlans] = useState([]);
  const [phone, setPhone] = useState("");
  const [phoneHide, setPhoneHide] = useState("");
  const [phoneVisibility, setPhoneVisibility] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [isMale, setIsMale] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [prestigeScore, setPrestigeScore] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const containerStyle = {
    width: "950px",
    height: "400px",
  };

  const { error, loading, data, refetch } = useQuery(LOAD_DETAIL_ACCOUNT, {
    variables: {
      id: parseInt(travelerId, 10),
    },
  });

  const triggerPhone = () => {
    setPhoneVisibility(!phoneVisibility);
  };

  function formatPhoneNumber(phoneNumber) {
    // Replace leading "+84" with "0" (if present)
    phoneNumber = phoneNumber.replace(/^\+84/, "0");

    let part1, part2, part3;
    switch (phoneNumber.length) {
      case 9:
        part1 = phoneNumber.slice(0, 3);
        part2 = phoneNumber.slice(3, 6);
        part3 = phoneNumber.slice(6);
        break;
      case 10:
        part1 = phoneNumber.slice(0, 4);
        part2 = phoneNumber.slice(4, 7);
        part3 = phoneNumber.slice(7);
        break;
      case 11:
        part1 = phoneNumber.slice(0, 4); // Handle potential country code (adjust as needed)
        part2 = phoneNumber.slice(4, 7);
        part3 = phoneNumber.slice(7);
        break;
      default:
        // Handle invalid lengths (optional)
        console.warn(`Invalid phone number length: ${phoneNumber}`);
        return phoneNumber;
    }

    // Combine parts with spaces
    return `${part1} ${part2} ${part3}`;
  }

  function formatPhoneNumberCen(phoneNumber) {
    // Replace leading "+84" with "0" (if present)
    phoneNumber = phoneNumber.replace(/^\+84/, "0");

    let part1, part2;
    switch (phoneNumber.length) {
      case 9:
        part1 = "*".repeat(phoneNumber.length - 3);
        part2 = phoneNumber.slice(6);
        break;
      case 10:
        part1 = "*".repeat(phoneNumber.length - 3);
        part2 = phoneNumber.slice(7);
        break;
      case 11:
        part1 = "*".repeat(phoneNumber.length - 3);
        part2 = phoneNumber.slice(7);
        break;
      default:
        // Handle invalid lengths (optional)
        return phoneNumber;
    }

    // Combine parts with spaces
    return `${part1}${part2}`;
  }

  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      data["accounts"] &&
      data["accounts"]["nodes"]
    ) {
      setName(data["accounts"]["nodes"][0]["name"]);
      setPhone(formatPhoneNumber(data["accounts"]["nodes"][0]["phone"]));
      setPhoneHide(formatPhoneNumberCen(data["accounts"]["nodes"][0]["phone"]));
      let avt = data["accounts"]["nodes"][0]["avatarUrl"];
      let subAvt =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
      setAvatarUrl(avt != null ? avt : subAvt);
      setIsActive(data["accounts"]["nodes"][0]["isActive"]);
      let gender = data["accounts"]["nodes"][0]["isMale"];
      setIsMale(gender === true ? "Nam" : "Nữ");
      let gmail = data["accounts"]["nodes"][0]["email"];
      setEmail(gmail !== null ? gmail : "Không có");
      setPrestigeScore(data["accounts"]["nodes"][0]["prestigeScore"]);

      let res = data["accounts"]["nodes"][0]["plans"].map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setPlans(res);
      console.log();
    }
  }, [data, loading, error]);

  return (
    <div className="travelerProfile">
      <div className="sharedTitle">
        <div className="navigation">
          <div className="left">
            <div className="return-btn">
              <Link to="/plans" className="navigateButton">
                <ArrowCircleLeftIcon />
                <p>Trở về</p>
              </Link>
            </div>
            <div className="return-title">
              <div className="return-header">
                Thông tin chi tiết nhà du lịch
              </div>
              <div className="return-body">
                <p>Danh sách kế hoạch</p>
                <ArrowForwardIosIcon />
                <p>Chi tiết kế hoạch</p>
                <ArrowForwardIosIcon />
                <p>Thông tin nhà du lịch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="planDetailContainer">
        <div className="top">
          <div className="profile-header">
            <div className="profile-name">
              <img className="cellImg" src={avatarUrl} alt="avatar" />
              <p>{name}</p>
            </div>
            <div className="profile-status">
              {isActive === false && (
                <p className="status cancelled">Ngưng hoạt động</p>
              )}
              {isActive === true && (
                <p className="status confirmed">Đang hoạt động</p>
              )}
            </div>
          </div>
        </div>
        <div className="center">
          <div className="item">
            <h1 className="itemTitle">Thông tin chi tiết</h1>
            <div className="details">
              <div className="left">
                <div className="detailItem">
                  <span className="itemKey">Số điện thoại:</span>
                  {phoneVisibility === false ? (
                    <span className="itemValue">
                      {phoneHide}
                      <IconButton
                        className="mapBtn"
                        color="info"
                        onClick={triggerPhone}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </span>
                  ) : (
                    <span className="itemValue">
                      {phone}
                      <IconButton
                        className="mapBtn"
                        color="info"
                        onClick={triggerPhone}
                      >
                        <VisibilityOffIcon />
                      </IconButton>
                    </span>
                  )}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{email}</span>
                </div>
              </div>
              <div className="right">
                <div className="detailItem">
                  <span className="itemKey">Giới tính:</span>
                  <span className="itemValue">{isMale}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Điểm hàng hiệu:</span>
                  <span className="itemValue">{prestigeScore}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="item">
              <h1 className="itemTitle">Danh sách kế hoạch</h1>
              <PlanTable accountPlans={plans} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerProfilePage;
