import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton, Switch } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const providersColumns = [
  {
    field: "id",
    headerClassName: "prodHeader",
    width: 70,
    align: "center",
    headerAlign: "center",
    // renderCell: (params) => params.rowIndex + 1,
    renderHeader: () => <span>#</span>,
    renderCell: (params) => {
      return <div>{params.row.index}</div>;
    },
  },
  {
    field: "name",
    width: 380,
    renderCell: (params) => {
      return (
        // <div className="cellWithImg">
        //   <img className="cellImg" src={params.row.imageUrl} alt="avatar" />
        //   {params.row.name}
        // </div>
        <div>{params.row.name}</div>
      );
    },
    renderHeader: () => <span>TÊN</span>,
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

      if (params.row.phone !== null) {
        return (
          <div>
            <span className="itemValue">
              {formatPhoneNumberCen(params.row.phone)}
            </span>
          </div>
        );
      } else {
        return <div>Không có</div>;
      }
    },
    renderHeader: () => <span>SĐT</span>,
  },
  // {
  //   field: "balance",
  //   width: 200,
  //   align: "right",
  //   headerAlign: "center",
  //   renderCell: (params) => {
  //     const formattedPrice = params.row.balance.toLocaleString("vi-VN") + "đ";
  //     return <div className="prodPrice">{formattedPrice}</div>;
  //   },
  //   renderHeader: () => <span>Số dư</span>,
  // },
  {
    field: "paymentType",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      if (params.row.account != null) {
        return (
          <div className="cellWithStatus AVAILABLE">{<CheckCircleIcon />}</div>
        );
      } else {
        return (
          <div className="cellWithStatus PERMANENT_STOP">{<CancelIcon />}</div>
        );
      }
    },
    renderHeader: () => <span>TRUY CẬP</span>,
  },
];
