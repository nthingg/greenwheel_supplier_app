import "../assets/scss/supplierDetail.scss";
import "../assets/scss/shared.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  GET_PRODUCT_BY_SUPPLIER,
  LOAD_DETAIL_SUPPLIER,
} from "../services/queries";
import { useQuery } from "@apollo/client";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import EditIcon from "@mui/icons-material/Edit";
import ProductTable from "../components/ProductTable";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

const SupplierDetailPage = () => {
  const containerStyle = {
    width: "400px",
    height: "400px",
  };
  const defaultAddress =
    "Dinh Độc Lập, 135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Thành phố Hồ Chí Minh";

  const navigate = useNavigate();
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState(defaultAddress);

  //supplier
  const { error, loading, data } = useQuery(LOAD_DETAIL_SUPPLIER, {
    variables: {
      id: parseInt(supplierId, 10),
    },
  });
  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      data["suppliers"] &&
      data["suppliers"]["nodes"]
    ) {
      setSupplier(data["suppliers"]["nodes"][0]);
      const center = {
        lat: data["suppliers"]["nodes"][0].coordinate.coordinates[1],
        lng: data["suppliers"]["nodes"][0].coordinate.coordinates[0],
      };
      setPosition(center);
    }
  }, [data, loading, error]);

  //products
  const {
    error: errorProducts,
    loading: loadingProducts,
    data: dataProducts,
  } = useQuery(GET_PRODUCT_BY_SUPPLIER, {
    variables: {
      id: parseInt(supplierId, 10),
    },
  });
  useEffect(() => {
    if (
      !loadingProducts &&
      !errorProducts &&
      dataProducts &&
      dataProducts["products"] &&
      dataProducts["products"]["nodes"]
    ) {
      let res = dataProducts.products.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setProducts(res);
    }
  }, [dataProducts, loadingProducts, errorProducts]);

  return (
    <div className="supplierDetailContainer">
      <div className="sharedTitle">
        <div className="navigation">
          <Link to="/suppliers" className="navigateButton">
            <ArrowCircleLeftIcon />
            <p>Trở về</p>
          </Link>
          <p>Danh sách nhà cung cấp</p>
          <ArrowForwardIosIcon />
          <p> Thông tin nhà cung cấp</p>
        </div>
      </div>
      <div className="detailContainer">
        <div className="prodTitle">
          <p>{supplier?.name}</p>
          <div className="">
            <Link to="/suppliers/new-product" className="link mb-3">
              <EditIcon />
              <p>Chỉnh sửa</p>
            </Link>
            {/* <Link to="/suppliers/new-product" className="link">
              <AddBoxIcon />
              <p>Thêm dịch vụ</p>
            </Link> */}
          </div>
        </div>
        <div className="supplierDetail">
          <div className="left">
            <div className="image_container">
              <img src={supplier?.imageUrl} alt="" />
            </div>
          </div>
          <div className="right">
            <div className="details">
              <div className="detailItem">
                <span className="itemKey">Số điện thoại:</span>
                <span className="itemValue">{supplier?.phone}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Địa chỉ:</span>
                <span className="itemValue">{supplier?.address}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Số dư:</span>
                <span className="itemValue">
                  {supplier?.balance.toLocaleString("vi-VN") + "đ"}
                </span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Trạng thái:</span>
                <span className="itemValue">
                  {(() => {
                    switch (supplier?.isActive) {
                      case true:
                        return "Đang hoạt động";
                      case false:
                        return "Ngưng hoạt động";
                      default:
                        return "Khác";
                    }
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="rowTitle">
          <p>{"Danh sách dịch vụ"}</p>
          <div className="">
            <Link
              to={`/suppliers/add-product/${supplierId}`}
              className="link mb-3"
            >
              <AddCircleIcon />
              <p>Thêm dịch vụ</p>
            </Link>
            {/* <Link to="/suppliers/new-product" className="link">
              <AddBoxIcon />
              <p>Thêm dịch vụ</p>
            </Link> */}
          </div>
        </div>
        <div className="tableProducts">
          <ProductTable products={products} />
        </div>
        <div className="rowTitle">
          <p>{"Vị trí"}</p>
        </div>
        <div className="mapContainer">
          <LoadScript googleMapsApiKey="AIzaSyCzYlFQ9BHxHZRRYS2RFMz-ofS_lWw_XLo">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={position}
              zoom={15}
              // onClick={handleMapClick}
            >
              <MarkerF position={position} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailPage;
