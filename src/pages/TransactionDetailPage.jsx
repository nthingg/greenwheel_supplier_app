import "../assets/scss/transactionDetail.scss";
import "../assets/scss/traceTable.scss";
import "../assets/scss/shared.scss";
import { Link, useParams } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import DetailTable from "../components/TransactionDetailTable";
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
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  StepContent,
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
} from "../services/graphql/order";

const TransactionDetailPage = () => {
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
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");

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
      !changeLoading &&
      !changeError &&
      changeData &&
      changeData["changeOrderStatus"]["id"]
    ) {
      if (changeData.changeOrderStatus.id !== undefined) {
        refetch();
      }
    }
  }, [changeData, changeLoading, changeError]);

  useEffect(() => {
    if (
      !cancelLoading &&
      !cancelError &&
      cancelData &&
      cancelData["cancelOrder"]["id"]
    ) {
      if (cancelData.cancelOrder.id !== undefined) {
        refetch();
      }
    }
  }, [cancelData, cancelLoading, cancelError]);

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
      const threeDaysLater = new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000); // Add 3 days in milliseconds
      const today = new Date();

      setCancellable(threeDaysLater > today);

      const startDate = data["orders"]["nodes"][0]["plan"]["startDate"];
      const serveDayIndexes = data["orders"]["nodes"][0]["serveDateIndexes"];

      const newDatesList = serveDayIndexes.map((index) => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + index);
        return newDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
      });

      setHighlitedDays(newDatesList);

      if (data["orders"]["nodes"][0].traces.length > 1) {
        const reason = data["orders"]["nodes"][0].traces[1].description;
        setReasonCancelled(
          data["orders"]["nodes"][0].traces.length === 0 ? null : reason
        );
      }

      // console.log(data["orders"]["nodes"][0].traces);
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

  const handleClose = () => {
    let finalReason = "";
    if (reason !== "") {
      finalReason += reason.charAt(0).toUpperCase() + reason.slice(1);
      finalReason += `, ${mainReason}`;
    } else {
      finalReason = mainReason;
    }

    setOpen(false);
    cancel({
      variables: {
        input: {
          id: parseInt(orderId, 10),
          reason: finalReason,
        },
      },
    });
  };

  const handleChangeStatus = () => {
    switch (status) {
      case "RESERVED":
        change({
          variables: {
            input: {
              orderId: parseInt(orderId, 10),
              status: "PREPARED",
            },
          },
        });
        break;
      case "PREPARED":
        change({
          variables: {
            input: {
              orderId: parseInt(orderId, 10),
              status: "SERVED",
            },
          },
        });
        break;
      default:
        break;
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

  function formatPhoneNumber(phoneNumber) {
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

  return (
    <div className="transactionDetail">
      <div className="sharedTitle">
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
                {(status === "RESERVED" || status === "PREPARED") && (
                  <button className="sepa">
                    <FiberManualRecordIcon />
                  </button>
                )}
                {status === "RESERVED" && (
                  <button className="prepare" onClick={handleChangeStatus}>
                    <MicrowaveIcon />
                    <p>Chuẩn bị</p>
                  </button>
                )}
                {status === "PREPARED" && (
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
                  <p className="status reserved">Đã đặt</p>
                )}
                {order?.currentStatus === "PREPARED" && (
                  <p className="status prepared">Đã chuẩn bị</p>
                )}
                {order?.currentStatus === "SERVED" && (
                  <p className="status served">Đã phục vụ</p>
                )}
                {order?.currentStatus === "COMPLAINED" && (
                  <p className="status complained">Bị phàn nàn</p>
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
                  <span className="itemValue">{formatPhoneNumber(phone)}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Thời gian tạo:</span>
                  <span className="itemValue">{date}</span>
                </div>
                {/* <div className="detailItem">
                  <span className="itemKey">Tổng hóa đơn:</span>
                  <span className="itemValue">
                    {order?.total.toLocaleString("vi-VN") + "đ"}
                  </span>
                </div> */}
              </div>
              <div className="right">
                <div className="detailItem">
                  <span className="itemKey">Nhà cung cấp:</span>
                  <span className="itemValue">
                    <a
                      href={`/suppliers/${order?.details[0].product.supplier.id}`}
                    >
                      {order?.details[0].product.supplier.name}
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
                    {order?.details[0]?.product?.supplier?.address}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Lịch sử thay đổi:</span>
                  <span className="itemValue">
                    <a className="reason" onClick={handleClickOpenTraces}>
                      Chi tiết
                    </a>
                  </span>
                </div>
              </div>
            </div>
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
                Các dịch vụ đặt và ngày phục vụ
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  minWidth: 1400,
                }}
              >
                <div className="mix-table">
                  <div className="left">
                    <p className="table-title">Dịch vụ đã đặt</p>
                    <DetailTable details={details} />
                  </div>
                  <div className="right">
                    <p className="table-title">Các ngày phục vụ</p>
                    <div className="calendar">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <p>
                          {(() => {
                            switch (order?.period) {
                              case "MORNING":
                                return "Phục vụ vào buổi sáng";
                              case "NOON":
                                return "Phục vụ vào buổi trưa";
                              case "AFTERNOON":
                                return "Phục vụ vào buổi chiều";
                              case "EVENING":
                                return "Phục vụ vào buổi tối";
                              default:
                                return `Check-in vào ${order?.period}`;
                            }
                          })()}
                        </p>
                        <DateCalendar
                          value={
                            highlightedDays[0]
                              ? dayjs(highlightedDays[0])
                              : dayjs()
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
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
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
                Các ngày phục vụ
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  minWidth: 1400,
                }}
              >
                <div className="calendar">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p>
                      {(() => {
                        switch (order?.period) {
                          case "MORNING":
                            return "Phục vụ vào buổi sáng";
                          case "NOON":
                            return "Phục vụ vào buổi trưa";
                          case "AFTERNOON":
                            return "Phục vụ vào buổi chiều";
                          case "EVENING":
                            return "Phục vụ vào buổi tối";
                          default:
                            return `Check-in vào ${order?.period}`;
                        }
                      })()}
                    </p>
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
          </div> */}
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
                Ghi chú
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  minWidth: 1400,
                }}
              >
                <p>{order?.note === "" ? "Không có ghi chú" : order?.note}</p>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      <div className=""></div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle backgroundColor={"#239b56"} color={"white"}>
          Xác nhận hủy bỏ
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Để xác minh việc chủ động hủy bỏ yêu cầu, nhà cung cấp vui lòng đưa
            ra lý do phù hợp.
          </DialogContentText>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="Hết hàng"
              name="radio-buttons-group"
              onChange={(e) => {
                console.log(e.target.value);
                setMainReason(e.target.value);
              }}
            >
              <FormControlLabel
                value="Hết hàng"
                control={<Radio />}
                label="Hết hàng"
              />
              <FormControlLabel
                value="Thời gian nhận hàng quá lâu/sớm"
                control={<Radio />}
                label="Thời gian nhận hàng quá lâu/sớm"
              />
              <FormControlLabel
                value="Cửa hàng đóng cửa"
                control={<Radio />}
                label="Cửa hàng đóng cửa"
              />
              <FormControlLabel
                value="Không liên hệ được với khách"
                control={<Radio />}
                label="Không liên hệ được với khách"
              />
              <FormControlLabel
                value="Nghi vấn lừa đảo"
                control={<Radio />}
                label="Nghi vấn lừa đảo"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Lý do khác"
            type="text"
            fullWidth
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
        <DialogTitle backgroundColor={"#239b56"} color={"white"}>
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
        <DialogTitle backgroundColor={"#239b56"} color={"white"}>
          Lịch sử thay đổi
        </DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <DialogContentText style={{ padding: "20px 0 10px 0" }}>
            Trạng thái đơn hàng #{order?.id}:
          </DialogContentText>
          <Box sx={{ maxWidth: 400 }}>
            <Stepper activeStep={traces.length - 1} orientation="vertical">
              {traces?.map((trace) => (
                <Step key={trace}>
                  <StepLabel>
                    <Typography>
                      {(() => {
                        switch (trace.status) {
                          case "RESERVED":
                            return "Khách đặt thành công";
                          case "CANCELLED":
                            if (trace.isCustomerModification == true) {
                              return "Khách đã hủy";
                            } else {
                              return "Nhà cung cấp đã hủy";
                            }
                          default:
                            return "Khác";
                        }
                      })()}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <p className="trace-date">
                      {(() => {
                        const date = new Date(trace.modifiedAt);

                        const formattedDateTime = date.toLocaleString("en-GB");
                        return formattedDateTime;
                      })()}
                    </p>
                  </StepContent>
                </Step>
              ))}
              {traces.length === 1 && (
                <Step key={null}>
                  <StepLabel>
                    <Typography>Đang chờ xử lý</Typography>
                  </StepLabel>
                  <StepContent>
                    <p className="trace-date">N/A</p>
                  </StepContent>
                </Step>
              )}
            </Stepper>
          </Box>
          {/* <TracesTable traces={traces} /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTraces}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransactionDetailPage;
