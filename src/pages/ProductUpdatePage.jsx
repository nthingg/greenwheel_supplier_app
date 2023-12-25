import "./productsingle.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

const ProductUpdatePage = ({ id }) => {
  const [file, setFile] = useState("");

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="datatableTitle">
          <p>Cơm gà xáo măng</p>
          <button className="link">
            <SaveIcon className="icon" /> Lưu
          </button>
        </div>
        <div className="image_container">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : "https://cdn.tgdd.vn/2021/11/CookRecipe/Avatar/1200(3).jpg"
            }
            alt=""
          />
          <div className="formInput imageAdd">
            <label htmlFor="file">
              <DriveFolderUploadOutlinedIcon className="icon" />
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="bottom">
          <div className="left">
            <form>
              <div className="formInput">
                <label>Tên hàng</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Nhập tên hàng"
                  value={"Cơm gà xáo măng"}
                />
              </div>
              <div className="formInput">
                <label>Giá bán</label>
                <input
                  name="originalPrice"
                  type="text"
                  placeholder="Nhập giá bán"
                  value={"75000"}
                />
              </div>
              <div className="formInput">
                <label>Giá khuyến mãi</label>
                <input
                  name="discountPrice"
                  type="text"
                  placeholder="Nhập giá khuyến mãi"
                  value={"60000"}
                />
              </div>
            </form>
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label>Nhóm</label>
                <input
                  name="partySize"
                  type="text"
                  placeholder="Nhập số lượng thành viên đề xuất"
                  value={"1"}
                />
              </div>
              <div className="formRatio">
                <div className="ratioTitle">
                  <label>Trạng thái</label>
                </div>
                <div className="ratioBox">
                  <label>
                    <input
                      type="radio"
                      name="discountStatus"
                      value="available"
                      checked
                    />
                    <span> Có sẵn</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="discountStatus"
                      value="notAvailable"
                    />
                    <span> Không có sẵn</span>
                  </label>
                </div>
              </div>
              <div className="formRatio">
                <div className="ratioTitle">
                  <label>Kiểu thanh toán</label>
                </div>
                <div className="ratioBox">
                  <label>
                    <input type="radio" name="paymentType" value="available" />
                    <span> Theo ngày</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentType"
                      value="notAvailable"
                      checked
                    />
                    <span> Theo sản phẩm</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdatePage;
