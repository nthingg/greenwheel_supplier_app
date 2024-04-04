import "../../assets/scss/transactionDetail.scss";
import "../../assets/scss/shared.scss";
import { Link, useParams } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import OrderDetailTable from "../../components/tables/OrderDetailTable";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  StepContent,
  Snackbar,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  CANCEL_ORDER,
  CHANGE_STATUS_ORDER,
  LOAD_DETAIL_ORDER,
} from "../../services/graphql/order";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import FeedbackIcon from "@mui/icons-material/Feedback";

const OrderDetailPage = () => {
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState(null);
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);
  const [traces, setTraces] = useState([]);
  const [openReason, setOpenReason] = useState(false);
  const [openTraces, setOpenTraces] = useState(false);
  const [reason, setReason] = useState("");
  const [mainReason, setMainReason] = useState("Hết hàng");
  const [reasonCancelled, setReasonCancelled] = useState(null);
  const [highlightedDays, setHighlitedDays] = useState([]);
  const [cancellable, setCancellable] = useState(false);
  const [servable, setServable] = useState(false);
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [finalCancellable, setFinalCancellable] = useState("");
  const [finalServable, setFinalServable] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMsg, setErrMsg] = useState(false);

  const handleClick = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnack = () => {
    setSnackbarOpen(false);
  };

  const [
    change,
    { data: changeData, loading: changeLoading, error: changeError },
  ] = useMutation(CHANGE_STATUS_ORDER);

  const [
    cancel,
    { data: cancelData, loading: cancelLoading, error: cancelError },
  ] = useMutation(CANCEL_ORDER);

  const { error, loading, data, refetch } = useQuery(LOAD_DETAIL_ORDER, {
    variables: {
      id: parseInt(orderId, 10),
    },
  });

  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      data["orders"] &&
      data["orders"]["nodes"]
    ) {
      setOrder(data["orders"]["nodes"][0]);

      let resDetail = data["orders"]["nodes"][0]["details"].map(
        (node, index) => {
          const { __typename, ...rest } = node;
          return { ...rest, index: index + 1 }; // Add the index to the object
        }
      );
      setDetails(resDetail);

      const date = new Date(data["orders"]["nodes"][0]["createdAt"]);
      setDate(
        date.toLocaleDateString("vi-VN", {
          timeZone: "UTC",
        })
      );

      const serveDayIndexes = data["orders"]["nodes"][0]["serveDates"];

      console.log(serveDayIndexes);

      // const newDatesList = serveDayIndexes.map((index) => {
      //   const newDate = new Date(startDate);
      //   newDate.setDate(newDate.getDate() + index);
      //   return newDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
      // });

      setHighlitedDays(serveDayIndexes);

      const threeDaysLater = new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000); // Add 3 days in milliseconds
      const today = new Date();
      setCancellable(threeDaysLater > today);
      setFinalCancellable(
        threeDaysLater.toLocaleDateString("vi-VN", {
          timeZone: "UTC",
        })
      );

      const start = new Date(data["orders"]["nodes"][0]["plan"]["startDate"]);
      setServable(start <= today);
      setFinalServable(
        start.toLocaleDateString("vi-VN", {
          timeZone: "UTC",
        })
      );

      if (data["orders"]["nodes"][0].traces.length > 1) {
        const reason = data["orders"]["nodes"][0].traces[1].description;
        setReasonCancelled(
          data["orders"]["nodes"][0].traces.length === 0 ? null : reason
        );
      }

      let res = data["orders"]["nodes"][0].traces.map((node, id) => {
        const { __typename, ...rest } = node;
        return { ...rest, id: id + 1 }; // Add the index to the object
      });
      setTraces(res);

      //phone
      setPhone(data["orders"]["nodes"][0].account.phone);

      setStatus(data["orders"]["nodes"][0]["currentStatus"]);
      console.log(status);
    }
  }, [data, loading, error]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenReason = () => {
    setOpenReason(true);
  };

  const handleClickOpenTraces = () => {
    setOpenTraces(true);
  };

  const handleClose = async () => {
    let finalReason = "";
    if (reason !== "") {
      finalReason += reason.charAt(0).toUpperCase() + reason.slice(1);
      finalReason += `, ${mainReason}`;
    } else {
      finalReason = mainReason;
    }

    setOpen(false);

    try {
      const { data } = await cancel({
        variables: {
          input: {
            id: parseInt(orderId, 10),
            reason: finalReason,
          },
        },
      });
      refetch();
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
    }
  };

  const handleChangeStatus = async () => {
    let stat = "";
    switch (status) {
      case "RESERVED":
        stat = "RESERVED";
        break;
      case "PREPARED":
        stat = "PREPARED";
        break;
      default:
        break;
    }

    try {
      const { data } = await change({
        variables: {
          input: {
            orderId: parseInt(orderId, 10),
            status: stat,
          },
        },
      });
      refetch();
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
    }
  };

  const handleCloseReason = () => {
    setOpenReason(false);
  };

  const handleCloseTraces = () => {
    setOpenTraces(false);
  };

  const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  }));

  //higlight the dates in highlightedDays arra
  const ServerDay = (props) => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.includes(day.format("YYYY-MM-DD"));

    return (
      <HighlightedDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        selected={isSelected}
      />
    );
  };

  function formatPhoneNumberCen(phoneNumber) {
    // Replace leading "+84" with "0" (if present)
    phoneNumber = phoneNumber.replace(/^\84/, "0"); // Replace leading "+84" with "0"

    let formattedParts;
    switch (phoneNumber.length) {
      case 9:
        formattedParts = [
          phoneNumber.slice(0, 3),
          "*".repeat(4),
          phoneNumber.slice(6),
        ];
        break;
      case 10:
        formattedParts = [
          phoneNumber.slice(0, 3),
          "*".repeat(4),
          phoneNumber.slice(7),
        ];
        break;
      case 11:
        formattedParts = [
          phoneNumber.slice(0, 3),
          "*".repeat(4),
          phoneNumber.slice(8),
        ];
        break;
      default:
        // Handle invalid lengths (optional)
        return phoneNumber;
    }

    return formattedParts.join("");
  }

  return (
    <div className="transactionDetail">
      <div className="shared-title">
        <div className="navigation">
          <div className="left">
            <div className="return-btn">
              <Link to="/orders" className="navigateButton">
                <ArrowCircleLeftIcon />
                <p>Trở về</p>
              </Link>
            </div>
            <div className="return-title">
              <div className="return-header">Thông tin chi tiết đơn hàng</div>
              <div className="return-body">
                <p>Danh sách đơn hàng</p>
                <ArrowForwardIosIcon />
                <p>Chi tiết đơn hàng</p>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="order-modify">
              <div className="groupBtn">
                {cancellable === true && status !== "COMPLAINED" && (
                  <button className="remove" onClick={handleClickOpen}>
                    <CancelIcon />
                    <p>Huỷ đơn</p>
                  </button>
                )}
                {(status === "RESERVED" || status === "PREPARED") &&
                  cancellable === true && (
                    <p className="sepa">
                      <FiberManualRecordIcon
                        sx={{ fontSize: 20, color: "#2c3d50" }}
                      />
                    </p>
                  )}
                {status === "RESERVED" && (
                  <button className="prepare" onClick={handleChangeStatus}>
                    <MicrowaveIcon />
                    <p>Chuẩn bị</p>
                  </button>
                )}
                {status === "PREPARED" && servable && (
                  <button className="edit" onClick={handleChangeStatus}>
                    <CheckCircleIcon />
                    <p>Phục vụ</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="transactionContainer">
        <div className="top">
          <div className="sharedTitle">
            <div className="order-header">
              <div className="order-id">
                <p>Mã đơn #{order?.id.toString().padStart(9, "0")}</p>
              </div>
              <div className="order-status">
                {order?.currentStatus === "CANCELLED" && (
                  <p className="status cancelled">Đã hủy</p>
                )}
                {order?.currentStatus === "CANCELLED" && (
                  <a className="reason" onClick={handleClickOpenReason}>
                    Lí do hủy bỏ
                  </a>
                )}
                {order?.currentStatus === "RESERVED" && (
                  <a className="status reserved" title="Đã đặt">
                    <HourglassTopRoundedIcon sx={{ color: "#3498DB" }} />
                  </a>
                )}
                {order?.currentStatus === "PREPARED" && (
                  <a className="status prepared" title="Đã chuẩn bị">
                    <MicrowaveIcon sx={{ color: "#3498DB" }} />
                  </a>
                )}
                {order?.currentStatus === "SERVED" && (
                  <a className="status served" title="Đã phục vụ">
                    <CheckCircleIcon sx={{ color: "#3498DB" }} />
                  </a>
                )}
                {order?.currentStatus === "COMPLAINED" && (
                  <a className="status complained" title="Bị phàn nàn">
                    <FeedbackIcon sx={{ color: "#3498DB" }} />
                  </a>
                )}
                {order?.currentStatus === "FINISHED" && (
                  <a className="status reserved" title="Hoàn thành">
                    <BeenhereIcon sx={{ color: "#3498DB" }} />
                  </a>
                )}
                {order?.currentStatus === "CANCELLED" && (
                  <a className="status reserved" title="Đã hủy">
                    <CancelIcon sx={{ color: "#3498DB" }} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="center">
          <div className="item">
            <h1 className="itemTitle">Thông tin chi tiết về đơn hàng</h1>
            <div className="details">
              <div className="left">
                <div className="detailItem">
                  <span className="itemKey">Tài khoản đặt:</span>
                  <span className="itemValue">{order?.account.name}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Số điện thoại:</span>
                  <span className="itemValue">
                    {formatPhoneNumberCen(phone)}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Ngày tạo:</span>
                  <span className="itemValue">{date}</span>
                </div>
                {cancellable && (
                  <div className="detailItem">
                    <span className="itemKey">Hạn hủy đơn:</span>
                    <span className="itemValue">{finalCancellable}</span>
                  </div>
                )}
                {servable && (
                  <div className="detailItem">
                    <span className="itemKey">Bắt đầu phục vụ:</span>
                    <span className="itemValue">{finalServable}</span>
                  </div>
                )}
              </div>
              <div className="right">
                <div className="detailItem">
                  <span className="itemKey">Nhà cung cấp:</span>
                  <span className="itemValue">
                    <a
                      href={`/providers/${order?.details[0].product.provider.id}`}
                    >
                      {order?.details[0].product.provider.name}
                    </a>
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Địa chỉ:</span>
                  <span
                    className="itemValue"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {order?.details[0]?.product?.provider?.address}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Lịch sử thay đổi:</span>
                  <span className="itemValue">
                    <a
                      href="#"
                      className="reason"
                      onClick={handleClickOpenTraces}
                    >
                      Chi tiết
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <Accordion sx={{ boxShadow: "none", width: 1400 }}>
              <AccordionSummary
                sx={{
                  fontSize: 24,
                  backgroundColor: "#2c3d50",
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: "600",
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Thông tin thêm
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: "#f8f9f9",
                }}
              >
                <OrderDetailTable details={details} />
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="bottom">
            <Accordion sx={{ boxShadow: "none", width: 1400 }}>
              <AccordionSummary
                sx={{
                  fontSize: 24,
                  backgroundColor: "#2c3d50",
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: "600",
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {(() => {
                  switch (order?.period) {
                    case "MORNING":
                      return "Các ngày phục vụ (buổi sáng)";
                    case "NOON":
                      return "Các ngày phục vụ (buổi trưa)";
                    case "AFTERNOON":
                      return "Các ngày phục vụ (buổi chiều)";
                    case "EVENING":
                      return "Các ngày phục vụ (buổi tối)";
                    default:
                      return `Check-in vào ${order?.period}`;
                  }
                })()}
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: "#f8f9f9",
                }}
              >
                <div className="calendar">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p>Lịch phục vụ</p>
                    <DateCalendar
                      value={
                        highlightedDays[0] ? dayjs(highlightedDays[0]) : dayjs()
                      }
                      readOnly
                      slots={{
                        day: ServerDay,
                      }}
                      slotProps={{
                        day: {
                          highlightedDays,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="bottom">
            <Accordion sx={{ boxShadow: "none", width: 1400 }}>
              <AccordionSummary
                sx={{
                  fontSize: 24,
                  backgroundColor: "#2c3d50",
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: "600",
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Mô tả
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: "#f8f9f9",
                }}
              >
                {order?.note === "" ? "Không có ghi chú" : order?.note}
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle backgroundColor={"#2c3d50"} color={"white"}>
          Xác nhận hủy bỏ
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Gửi OTP cho phượt thủ để xác nhận việc hủy đơn:
          </DialogContentText>
          <div className="otp-field">
            <TextField
              autoFocus
              margin="dense"
              id="otp"
              name="otp"
              label="Nhập OTP"
              type="text"
              size="small"
              sx={{
                width: "80%",
                margin: 0,
                "& label.Mui-focused": {
                  color: "black",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "black",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gainsboro",
                  },
                  "&:hover fieldset": {
                    borderColor: "black",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black",
                  },
                },
              }}
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
            <button className="otp-btn" onClick={() => {}}>
              Gửi OTP
            </button>
          </div>

          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Để đảm bảo tính xác minh của yêu cầu hủy bỏ, nhà cung cấp có thể đưa
            thêm lý do phù hợp.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            name="reason"
            label="Lý do khác cho việc hủy bỏ"
            type="text"
            size="small"
            fullWidth
            sx={{
              margin: 0,
              "& label.Mui-focused": {
                color: "black",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "black",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gainsboro",
                },
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
            onChange={(e) => {
              setReason(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleClose}>Xác nhận</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReason}
        onClose={() => {
          setOpenReason(false);
        }}
      >
        <DialogTitle backgroundColor={"#2c3d50"} color={"white"}>
          Lý do hủy bỏ
        </DialogTitle>
        <DialogContent style={{ width: 500 }}>
          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Lý do cụ thể được đưa ra cho việc hủy đơn hàng:
          </DialogContentText>
          <DialogContentText
            style={{ padding: "20px 0 10px 0", fontWeight: "bold" }}
          >
            {reasonCancelled == null ? "Không có" : reasonCancelled}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReason}>Xác nhận</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openTraces}
        onClose={() => {
          setOpenTraces(false);
        }}
        maxWidth={false}
      >
        <DialogTitle backgroundColor={"#2c3d50"} color={"white"}>
          Lịch sử thay đổi
        </DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Trạng thái đơn hàng #{order?.id}:
          </DialogContentText>
          <Box>
            <Stepper orientation="vertical">
              {traces?.map((trace) => (
                <Step key={trace} active={true}>
                  <StepLabel>
                    <Typography>
                      {(() => {
                        switch (trace.status) {
                          case "RESERVED":
                            return "Khách đặt thành công";
                          case "CANCELLED":
                            if (trace.isClientAction == true) {
                              return "Khách đã hủy";
                            } else {
                              return "Nhà cung cấp đã hủy";
                            }
                          case "PREPARED":
                            return "Nhà cung cấp đã chuẩn bị";
                          case "SERVED":
                            return "Nhà cung cấp đã phục vụ";
                          case "COMPLAINED":
                            return "Đơn hàng bị phàn nàn";
                          case "FINISHED":
                            return "Đơn hàng hoàn tất";
                          default:
                            return "Khác";
                        }
                      })()}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <div className="resultTable">
                      <p className="title">
                        {(() => {
                          const date = new Date(trace.modifiedAt);

                          const formattedDateTime =
                            date.toLocaleString("en-GB");
                          return formattedDateTime;
                        })()}
                      </p>
                      <div className="body">
                        <div className="response-item">
                          <p>
                            {trace.description ? trace.description : "Không có"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
              <Step key={null}>
                <StepLabel>
                  <Typography>Đang chờ xử lý</Typography>
                </StepLabel>
                <StepContent>
                  <p className="trace-date">N/A</p>
                </StepContent>
              </Step>
            </Stepper>
          </Box>
          {/* <TracesTable traces={traces} /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTraces}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbarOpen}
        onClose={handleCloseSnack}
        autoHideDuration={2000}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleCloseSnack}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderDetailPage;
