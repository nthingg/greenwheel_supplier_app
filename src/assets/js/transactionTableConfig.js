import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

export const transactionsColumns = [
  {
    field: "id",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderHeader: () => <span>Mã HĐ</span>,
  },
  {
    field: "name",
    width: 400,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={
              params.row.traveler.account.avatarUrl === null
                ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                : params.row.traveler.account.avatarUrl
            }
            alt="avatar"
          />
          {params.row.traveler.account.name}
        </div>
      );
    },
    renderHeader: () => <span>Khách hàng</span>,
  },
  {
    field: "modifiedAt",
    width: 220,
    renderCell: (params) => {
      const date = new Date(params.row.statusLog[0].modifiedAt);

      const formattedDateTime = date.toLocaleString("en-GB");

      return (
        <div>
          <span>{formattedDateTime}</span>
        </div>
      );
    },
    renderHeader: () => <span>Ngày tạo</span>,
  },
  {
    field: "total",
    width: 220,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => {
      const amount = params.row.total;
      const formattedPrice = amount.toLocaleString("vi-VN") + "đ";
      return <div className="prodPrice">{formattedPrice}</div>;
    },
    renderHeader: () => <span>Tổng</span>,
  },
  {
    field: "status",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      let statusLog = null;
      params.row.statusLog.forEach((log) => {
        if (log.status !== "RESERVED") {
          statusLog = log;
        }
      });

      if (statusLog === null) {
        return (
          <div className={`cellWithStatus reserved`}>
            <HourglassTopIcon />
          </div>
        );
      } else {
        switch (statusLog.status) {
          case "CONFIRMED":
            return (
              <div className={`cellWithStatus confirmed`}>
                <CheckCircleIcon />
              </div>
            );
          case "CANCELLED":
            return (
              <div className={`cellWithStatus cancelled`}>
                <CancelIcon />
              </div>
            );
          default:
            // Handle default case or unknown status
            break;
        }
      }
    },
    renderHeader: () => <span>Trạng thái</span>,
  },
];
