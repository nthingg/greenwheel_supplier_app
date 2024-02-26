import "../assets/scss/planDetail.scss";
import "../assets/scss/traceTable.scss";
import "../assets/scss/shared.scss";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LOAD_DETAIL_PLAN } from "../services/queries";
import { useQuery } from "@apollo/client";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import MapIcon from "@mui/icons-material/Map";
import TransacionTable from "../components/TransactionTable";
import EmergencyTable from "../components/EmergencyTable";

const PlanDetailPage = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [orders, setOrders] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDepart, setOpenDepart] = useState(false);
  const [position, setPosition] = useState(false);
  const [positionDepart, setPositionDepart] = useState(false);
  const [departDate, setDepartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [closeRegDate, setCloseRegDate] = useState(false);
  const [schedule, setSchedule] = useState(null);

  const containerStyle = {
    width: "950px",
    height: "400px",
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenDepart = () => {
    setOpenDepart(true);
  };

  const handleCloseDepart = () => {
    setOpenDepart(false);
  };

  const { error, loading, data, refetch } = useQuery(LOAD_DETAIL_PLAN, {
    variables: {
      id: parseInt(planId, 10),
    },
  });

  useEffect(() => {
    if (!loading && !error && data && data["plans"] && data["plans"]["nodes"]) {
      setPlan(data["plans"]["nodes"][0]);

      let res = data["plans"]["nodes"][0]["orders"].map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setOrders(res);

      let resEmer = data["plans"]["nodes"][0]["savedContacts"].map(
        (node, id) => {
          const { __typename, ...rest } = node;
          return { ...rest, id: id + 1 }; // Add the index to the object
        }
      );
      setEmergencies(resEmer);

      const destination = {
        lat: data["plans"]["nodes"][0].destination.coordinate.coordinates[1],
        lng: data["plans"]["nodes"][0].destination.coordinate.coordinates[0],
      };
      setPosition(destination);
      const depart = {
        lat: data["plans"]["nodes"][0].departure.coordinates[1],
        lng: data["plans"]["nodes"][0].departure.coordinates[0],
      };
      setPositionDepart(depart);

      const departDate = new Date(data["plans"]["nodes"][0]["departDate"]);
      setDepartDate(departDate.toLocaleString("en-GB"));
      const closeRegDate = new Date(data["plans"]["nodes"][0]["closeRegDate"]);
      setCloseRegDate(closeRegDate.toLocaleString("en-GB"));
      const endDate = new Date(data["plans"]["nodes"][0]["endDate"]);
      setEndDate(endDate.toLocaleString("en-GB"));

      //Schedule
      console.log(data["plans"]["nodes"][0]["schedule"]);
    }
  }, [data, loading, error]);

  return (
    <div className="transactionDetail">
      <div className="sharedTitle">
        <div className="navigation">
          <Link to="/plans" className="navigateButton">
            <ArrowCircleLeftIcon />
            <p>Trở về</p>
          </Link>
          <p>Danh sách kế hoạch</p>
          <ArrowForwardIosIcon />
          <p> Thông tin kế hoạch</p>
        </div>
      </div>
      <div className="transactionContainer">
        <div className="top">
          <div className="sharedTitle">
            <div className="order-header">
              <p>{plan?.name}</p>
            </div>
          </div>
        </div>
        <div className="center">
          <div className="item">
            <h1 className="itemTitle">Thông tin chi tiết về kế hoạch</h1>
            <div className="details">
              <div className="left">
                <div className="detailItem">
                  <span className="itemKey">Trưởng nhóm:</span>
                  <span className="itemValue">{plan?.account.name}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Số điện thoại:</span>
                  <span className="itemValue">{plan?.account.phone}</span>
                </div>
                {/* <div className="detailItem">
                  <span className="itemKey">Ngày tạo:</span>
                  <span className="itemValue">{plan?.createAt}</span>
                </div> */}
                <div className="detailItem">
                  <span className="itemKey">Ngày chốt thành viên:</span>
                  <span className="itemValue">{closeRegDate}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Số thành viên tối đa:</span>
                  <span className="itemValue">
                    {plan?.memberLimit + " người"}
                  </span>
                </div>
              </div>
              <div className="right">
                <div className="detailItem">
                  <span className="itemKey">Ngày khởi hành:</span>
                  <span className="itemValue">
                    {departDate}
                    <IconButton
                      className="mapBtn"
                      color="info"
                      onClick={handleClickOpenDepart}
                    >
                      <MapIcon />
                    </IconButton>
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Ngày kết thúc:</span>
                  <span className="itemValue">{endDate}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Địa điểm:</span>
                  <span className="itemValue">
                    <a href={`/destinations/${plan?.destination.id}`}>
                      {plan?.destination.name}
                    </a>
                    <IconButton
                      className="mapBtn"
                      color="info"
                      onClick={handleClickOpen}
                    >
                      <MapIcon />
                    </IconButton>
                  </span>
                </div>
                {/* <div className="detailItem">
                  <span className="itemKey">Dịch vụ:</span>
                  <span className="itemValue">
                    {(() => {
                      switch (order?.details[0].product.supplier.type) {
                        case "CAMPING":
                          return "Cắm trại";
                        case "GROCERY":
                          return "Tạp hóa";
                        case "MOTEL":
                          return "Nhà nghỉ";
                        case "REPAIR":
                          return "Sửa xe";
                        case "RESTAURANT":
                          return "Nhà hàng";
                        case "TAXI":
                          return "Taxi";
                        case "VEHICLE_RENTING":
                          return "Thuê xe";
                        default:
                          return "Khác";
                      }
                    })()}
                  </span>
                </div> */}
                <div className="detailItem">
                  <span className="itemKey">Chi phí bình quân:</span>
                  <span className="itemValue">
                    {(plan?.gcoinBudgetPerCapita * 100).toLocaleString(
                      "vi-VN"
                    ) + "đ"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="item">
              <h1 className="itemTitle">Kế hoạch chi tiết</h1>
            </div>
          </div>
          <div className="bottom">
            <div className="item">
              <h1 className="itemTitle">Danh sách đơn hàng</h1>
              <TransacionTable orders={orders} />
            </div>
          </div>
          {/* <div className="bottom">
            <div className="item">
              <h1 className="itemTitle">Danh sách số khẩn cấp</h1>
              <EmergencyTable list={emergencies} />
            </div>
          </div> */}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        maxWidth={false}
      >
        <DialogTitle backgroundColor={"#239b56"} color={"white"}>
          Bản đồ
        </DialogTitle>
        <DialogContent style={{ width: 1000 }}>
          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Chi tiết địa điểm đến:
          </DialogContentText>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={15}
          >
            <MarkerF position={position} />
          </GoogleMap>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDepart}
        onClose={() => {
          setOpenDepart(false);
        }}
        maxWidth={false}
      >
        <DialogTitle backgroundColor={"#239b56"} color={"white"}>
          Bản đồ
        </DialogTitle>
        <DialogContent style={{ width: 1000 }}>
          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Chi tiết địa điểm khởi hành:
          </DialogContentText>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={positionDepart}
            zoom={15}
          >
            <MarkerF position={positionDepart} />
          </GoogleMap>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDepart}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlanDetailPage;
