import "../assets/scss/productDetail.scss";
import "../assets/scss/shared.scss";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LOAD_DETAIL_PRODUCT } from "../services/queries";
import { useQuery } from "@apollo/client";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

const ProductDetailPage = () => {
  const { productId } = useParams();
  console.log(productId);
  const [product, setProduct] = useState(null);
  const { error, loading, data } = useQuery(LOAD_DETAIL_PRODUCT, {
    variables: {
      id: parseInt(productId, 10),
    },
  });
  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      data["products"] &&
      data["products"]["nodes"]
    ) {
      setProduct(data["products"]["nodes"][0]);
    }
  }, [data, loading, error]);

  return (
    <div className="detail">
      <div className="sharedTitle">
        <div className="navigation">
          <Link to="/products" className="navigateButton">
            <ArrowCircleLeftIcon />
            <p>Trở về</p>
          </Link>
          <p>Danh sách dịch vụ</p>
          <ArrowForwardIosIcon />
          <p> Thông tin dịch vụ</p>
        </div>
      </div>
      <div className="detailContainer">
        <div className="prodTitle">
          <p>{product?.name}</p>
          <Link to={`/products/edit/${product?.id}`} className="link">
            <EditIcon />
            <p>Chỉnh sửa</p>
          </Link>
        </div>
        <div className="productDetail">
          <div className="left">
            <div className="image_container">
              <img src={product?.imageUrl} alt="" />
            </div>
          </div>
          <div className="right">
            <div className="details">
              <div className="detailItem">
                <span className="itemKey">Loại dịch vụ:</span>
                <span className="itemValue">
                  {(() => {
                    switch (product?.type) {
                      case "FOOD":
                        return "Thức ăn";
                      case "BEVERAGE":
                        return "Đồ uống";
                      case "ROOM":
                        return "Phòng nghỉ";
                      case "TENT":
                        return "Lều trại";
                      case "VEHICLE":
                        return "Phương tiện";
                      default:
                        return "Khác";
                    }
                  })()}
                </span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Đơn giá:</span>
                <span className="itemValue">
                  {product?.price.toLocaleString("vi-VN") + "đ"} /{" "}
                  <span className="paymentType">
                    {product?.paymentType === "PER_DAY" ? "ngày" : "sản phẩm"}
                  </span>
                </span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Trạng thái:</span>
                <span className="itemValue">
                  {(() => {
                    switch (product?.isAvailable) {
                      case true:
                        return "Đang phục vụ";
                      case false:
                        return "Ngưng ngưng phục vụ";
                      default:
                        return "Khác";
                    }
                  })()}
                </span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Thời gian phục vụ:</span>
                <span className="itemValue">
                  <div className="period-container">
                    {product?.periods.map((period) => (
                      <div
                        key={period}
                        className={`period-item ${period.toLowerCase()}`}
                      >
                        <span className="period-text">
                          {(() => {
                            switch (period) {
                              case "MORNING":
                                return "Sáng";
                              case "NOON":
                                return "Trưa";
                              case "AFTERNOON":
                                return "Chiều";
                              case "EVENING":
                                return "Tối";
                              default:
                                return "Khác";
                            }
                          })()}
                        </span>
                      </div>
                    ))}
                  </div>
                </span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Phù hợp với:</span>
                <span className="itemValue">{product?.partySize} người</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
