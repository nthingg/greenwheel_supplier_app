import "../assets/scss/destinationDetail.scss";
import "../assets/scss/shared.scss";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LOAD_DETAIL_DESTINATION,
  LOAD_DETAIL_PRODUCT,
} from "../services/queries";
import { useQuery } from "@apollo/client";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

const DestinationDetailPage = () => {
  const { destinationId } = useParams();
  const [destination, setDestination] = useState(null);
  const { error, loading, data } = useQuery(LOAD_DETAIL_DESTINATION, {
    variables: {
      id: parseInt(destinationId, 10),
    },
  });
  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      data["destinations"] &&
      data["destinations"]["nodes"]
    ) {
      setDestination(data["destinations"]["nodes"][0]);
    }
  }, [data, loading, error]);

  return (
    <div className="detail">
      <div className="sharedTitle">
        <div className="navigation">
          <Link to="/destinations" className="navigateButton">
            <ArrowCircleLeftIcon />
            <p>Trở về</p>
          </Link>
          <p>Danh sách địa điểm</p>
          <ArrowForwardIosIcon />
          <p> Thông tin địa điểm</p>
        </div>
      </div>
      <div className="detailContainer">
        <div className="prodTitle">
          <p>{destination?.name}</p>
          <Link to="/destination/update/" className="link">
            <EditIcon />
            <p>Chỉnh sửa</p>
          </Link>
        </div>

        <div className="destinationDetail">
          <div className="left">
            <div className="image_container">
              <img src={destination?.imageUrls[0]} alt="" />
            </div>
          </div>
          <div className="right">
            <div className="details">
              <div className="detailItem">
                <span className="itemKey">Địa chỉ:</span>
                <span className="itemValue">{destination?.address}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Trạng thái:</span>
                <span className="itemValue">
                  {(() => {
                    switch (destination?.isVisible) {
                      case false:
                        return "Tạm ẩn";
                      case true:
                        return "Đang hiển thị";
                      default:
                        return "Khác";
                    }
                  })()}
                </span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Thuộc tỉnh:</span>
                <span className="itemValue">{destination?.province.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="destination">
          <div className="item">
            <div className="reasonTable">
              <p className="title">Thông tin chi tiết</p>
              <div className="body">
                <p>{destination?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;
