import { IconButton } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const ordersColumns = [
  {
    field: "index",
    width: 80,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.index}</div>;
    },
    renderHeader: () => <span>#</span>,
  },
  {
    field: "id",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.id.toString().padStart(9, "0")}</div>;
    },
    renderHeader: () => <span>MÃ ĐƠN</span>,
  },
  {
    field: "createdAt",
    width: 220,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const date = new Date(params.row.createdAt);

      const formattedDateTime = date.toLocaleString("en-GB");
      const formattedDate = formattedDateTime.substring(
        0,
        formattedDateTime.indexOf(", ")
      );

      return (
        <div>
          <span>{formattedDate}</span>
        </div>
      );
    },
    renderHeader: () => <span>NGÀY ĐẶT</span>,
  },
  {
    field: "name",
    width: 240,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={
              params.row.account.avatarPath === null
                ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                : `https://d38ozmgi8b70tu.cloudfront.net${params.row.account.avatarPath}`
            }
            alt="avatar"
          />
          {params.row.account.name}
        </div>
      );
    },
    renderHeader: () => <span>KHÁCH HÀNG</span>,
  },
  {
    field: "phone",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      function formatPhoneNumberCen(phoneNumber) {
        // Replace leading "+84" with "0" (if present)
        phoneNumber = phoneNumber.replace(/^\84/, "0"); // Replace leading "+84" with "0"

        let formattedParts;
        switch (phoneNumber.length) {
          case 9:
            formattedParts = [
              phoneNumber.slice(0, 3),
              "*".repeat(3),
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
              "*".repeat(5),
              phoneNumber.slice(7),
            ];
            break;
          default:
            // Handle invalid lengths (optional)
            return phoneNumber;
        }

        return formattedParts.join("");
      }

      if (params.row.account.phone !== null) {
        return <div>{formatPhoneNumberCen(params.row.account.phone)}</div>;
      } else {
        return <div>Không có</div>;
      }
    },
    renderHeader: () => <span>SĐT</span>,
  },
  // {
  //   field: "supplierName",
  //   width: 240,
  //   renderCell: (params) => {
  //     return <div>{params.row.supplier.name}</div>;
  //   },
  //   renderHeader: () => <span>Nhà cung cấp</span>,
  // },
  // {
  //   field: "status",
  //   width: 140,
  //   align: "center",
  //   headerAlign: "center",
  //   renderCell: (params) => {
  //     switch (params.row.currentStatus) {
  //       case "RESERVED":
  //         return <div className={`cellWithStatus confirmed`}>Đã chấp nhận</div>;
  //       case "CANCELLED":
  //         return <div className={`cellWithStatus cancelled`}>Đã hủy</div>;
  //       case "TEMPORARY":
  //         return <div className={`cellWithStatus temporary`}>Đang xử lý</div>;
  //       default:
  //         // Handle default case or unknown status
  //         break;
  //     }
  //   },
  //   renderHeader: () => <span>Trạng thái</span>,
  // },
  {
    field: "total",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const amount = params.row.total;
      const formattedPrice = amount.toLocaleString("vi-VN") + "đ";
      return <div className="prodPrice">{formattedPrice}</div>;
    },
    renderHeader: () => <span>TỔNG</span>,
  },
];
