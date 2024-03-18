import "../assets/scss/planDetail.scss";
import "../assets/scss/traceTable.scss";
import "../assets/scss/shared.scss";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  styled,
} from "@mui/material";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import MapIcon from "@mui/icons-material/Map";
import TransacionTable from "../components/TransactionTable";
import EmergencyTable from "../components/EmergencyTable";
import { LOAD_DETAIL_PLAN } from "../services/graphql/plan";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers";
import ActivityTable from "../components/ActivityTable";
import MemberTable from "../components/MemberTable";
import PlanOrderTable from "../components/PlanOrderTable";

const PlanDetailPage = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [orders, setOrders] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDepart, setOpenDepart] = useState(false);
  const [position, setPosition] = useState(null);
  const [positionDepart, setPositionDepart] = useState(null);
  const [departDate, setDepartDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [closeRegDate, setCloseRegDate] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [phone, setPhone] = useState("");
  const [dates, setDates] = useState([]);
  const [eventIndex, setEventIndex] = useState(-1);
  const [activities, setActivities] = useState(null);
  const [members, setMembers] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [phoneHide, setPhoneHide] = useState("");
  const [phoneVisibility, setPhoneVisibility] = useState(false);

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

      const departDate = new Date(data["plans"]["nodes"][0]["departAt"]);
      setDepartDate(
        departDate.toLocaleDateString("vi-VN", {
          timeZone: "UTC",
        })
      );
      const closeRegDate = new Date(data["plans"]["nodes"][0]["regClosedAt"]);
      setCloseRegDate(
        closeRegDate.toLocaleDateString("vi-VN", {
          timeZone: "UTC",
        })
      );
      const endDate = new Date(data["plans"]["nodes"][0]["endDate"]);
      setEndDate(
        endDate.toLocaleDateString("vi-VN", {
          timeZone: "UTC",
        })
      );
      const startDate = new Date(data["plans"]["nodes"][0]["startDate"]);
      setStartDate(
        startDate.toLocaleDateString("vi-VN", {
          timeZone: "UTC",
        })
      );
      const createdAt = new Date(data["plans"]["nodes"][0]["createdAt"]);
      setCreatedAt(
        createdAt.toLocaleDateString("vi-VN", {
          timeZone: "UTC",
        })
      );

      //Schedule
      setSchedule(data["plans"]["nodes"][0]["schedule"]);

      setPhone(formatPhoneNumber(data["plans"]["nodes"][0].account.phone));
      setPhoneHide(
        formatPhoneNumberCen(data["plans"]["nodes"][0].account.phone)
      );

      const startDateFormat = new Date(startDate);
      const endDateFormat = new Date(endDate);

      const dateArray = [];
      let currentDate = startDate;

      while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().slice(0, 10)); // Extract YYYY-MM-DD format
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setDates(dateArray);

      let resMem = data["plans"]["nodes"][0]["members"].map((node, id) => {
        const { __typename, ...rest } = node;
        return { ...rest, id: id + 1 }; // Add the index to the object
      });
      setMembers(resMem);
    }
  }, [data, loading, error]);

  const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  }));

  //higlight the dates in highlightedDays arra
  const ServerDay = (props) => {
    const { dates = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth && dates.includes(day.format("YYYY-MM-DD"));

    return (
      <HighlightedDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        selected={isSelected}
      />
    );
  };

  return (
    <div className="planDetail">
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
              <div className="return-header">Thông tin chi tiết kế hoạch</div>
              <div className="return-body">
                <p>Danh sách kế hoạch</p>
                <ArrowForwardIosIcon />
                <p>Chi tiết kế hoạch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="planDetailContainer">
        <div className="top">
          <div className="detail-title">
            <p>{plan?.name}</p>
          </div>
        </div>
        <div className="center">
          <div className="item">
            <h1 className="itemTitle">Thông tin chi tiết</h1>
            <div className="details">
              <div className="left">
                <div className="detailItem">
                  <span className="itemKey">Trưởng nhóm:</span>
                  <span className="itemValue">
                    <a href={`/plans/traveler-info/${plan?.account.id}`}>
                      {plan?.account.name}
                    </a>
                  </span>
                </div>
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
                        <VisibilityOffIcon />
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
                        <VisibilityIcon />
                      </IconButton>
                    </span>
                  )}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Thành viên:</span>
                  <span className="itemValue">
                    {plan?.memberCount}/{plan?.memberLimit} người
                  </span>
                </div>
                {/* <div className="detailItem">
                  <span className="itemKey">Ngày bắt đầu:</span>
                  <span className="itemValue">{startDate}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Ngày kết thúc:</span>
                  <span className="itemValue">{endDate}</span>
                </div> */}
              </div>
              <div className="right">
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
                {/* <div className="detailItem">
                  <span className="itemKey">Thành viên hiện tại:</span>
                  <span className="itemValue">
                    {plan?.memberCount + " người"}
                  </span>
                </div> */}
                {/* <div className="detailItem">
                  <span className="itemKey">Thành viên tối đa:</span>
                  <span className="itemValue">
                    {plan?.memberLimit + " người"}
                  </span>
                </div>
                {plan?.status === "PUBLIC" && (
                  <div className="detailItem">
                    <span className="itemKey">Ngày chốt:</span>
                    <span className="itemValue">{closeRegDate}</span>
                  </div>
                )}

                <div className="detailItem">
                  <span className="itemKey">Chi phí bình quân:</span>
                  <span className="itemValue">
                    {(plan?.gcoinBudgetPerCapita * 100).toLocaleString(
                      "vi-VN"
                    ) + "đ"}
                  </span>
                </div> */}
                {/* {(plan?.status == "PUBLISHED" || plan?.status == "READY") && (
                  <div className="detailItem">
                    <span className="itemKey">Quỹ nhóm hiện có:</span>
                    <span className="itemValue">
                      {(plan?.currentGcoinBudget * 100).toLocaleString(
                        "vi-VN"
                      ) + "đ"}
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>
          {/* <div className="bottom">
            <Accordion>
              <AccordionSummary
                sx={{
                  fontSize: 24,
                }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Lịch trình ({startDate} - {endDate})
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  minWidth: 1400,
                }}
              >
                <div className="mix-table">
                  <div className="left">
                    <p className="activities-title">Ngày hoạt động</p>
                    <div className="calendar">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                          value={dates[0] ? dayjs(dates[0]) : dayjs()}
                          // readOnly
                          slots={{
                            day: ServerDay,
                          }}
                          slotProps={{
                            day: {
                              dates,
                            },
                          }}
                          onChange={(value) => {
                            // Create a date object
                            const date = new Date(value.$y, value.$M, value.$D);
                            date.setDate(date.getDate() + 1);
                            const dateConverted = date
                              .toISOString()
                              .slice(0, 10);
                            if (dates.indexOf(dateConverted) == -1) {
                              setActivities(null);
                            } else {
                              let list =
                                plan?.schedule[dates.indexOf(dateConverted)];

                              let res = list.events.map((node, id) => {
                                const { __typename, ...rest } = node;
                                return { ...rest, id: id + 1 }; // Add the index to the object
                              });
                              setActivities(res);
                            }

                            // console.log(activities);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className="right">
                    <p className="activities-title">Chi tiết hoạt động</p>
                    <div className="activities-container">
                      <div className="tbl">
                        {activities && (
                          <ActivityTable activities={activities} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="bottom">
            <Accordion>
              <AccordionSummary
                sx={{
                  fontSize: 24,
                }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Danh sách thành viên
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  minWidth: 1400,
                }}
              >
                <MemberTable members={members} />
              </AccordionDetails>
            </Accordion>
          </div> */}
          <div className="bottom">
            {/* <Accordion>
              <AccordionSummary
                sx={{
                  fontSize: 24,
                }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Danh sách đơn hàng
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  minWidth: 1400,
                }}
              >
                <PlanOrderTable orders={orders} />
              </AccordionDetails>
            </Accordion> */}
            <div className="bottom">
              <div className="item">
                <h1 className="itemTitle">Danh sách đơn hàng</h1>
                <PlanOrderTable orders={orders} />
              </div>
            </div>
          </div>
          {/* <div className="bottom">
            <Accordion>
              <AccordionSummary
                sx={{
                  fontSize: 24,
                }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Danh sách số khẩn cấp
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  minWidth: 1400,
                }}
              >
                <EmergencyTable list={emergencies} />
              </AccordionDetails>
            </Accordion>
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
