import { Link } from "react-router-dom";
import "../assets/scss/productPage.scss";
import "../assets/scss/shared.scss";
import ProductTable from "../components/ProductTable";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOAD_PRODUCTS } from "../services/queries";

const ProductPage = () => {
  const { error, loading, data, refetch } = useQuery(LOAD_PRODUCTS);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["products"]["nodes"]) {
      let res = data.products.nodes.map(({ __typename, ...rest }) => rest);
      setProducts(res);
    }
  }, [data, loading, error]);

  return (
    <div className="product">
      <div className="sharedTitle">
        <p>Danh sách dịch vụ</p>
      </div>
      <div className="productContainer">
        <div className="tableHeader">
          <div className="left">
            <input
              type="text"
              className={"form-control"}
              id="floatingValue"
              name="value"
              placeholder="Tìm kiếm bằng STT, tên phòng, đơn giá..."
            />
          </div>
          <div className="right">
            <Link to="/products/new" className="link">
              <AddIcon />
              <span>Thêm dịch vụ</span>
            </Link>
            <button className="link">
              <FilterAltIcon />
            </button>
            <button
              className="link"
              onClick={() => {
                refetch();
              }}
            >
              <RefreshIcon />
            </button>
          </div>
        </div>
        <ProductTable products={products} />
      </div>
    </div>
  );
};

export default ProductPage;
