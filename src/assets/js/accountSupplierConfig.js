import { IconButton } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const supplierAccountsColumn = [
  {
    field: "index",
    width: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.index}</div>;
    },
    renderHeader: () => <span>#</span>,
  },
  {
    field: "name",
    width: 300,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      return <div>{params.row.name}</div>;
    },
    renderHeader: () => <span>Tài khoản</span>,
  },
  {
    field: "providerName",
    width: 300,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      if (params.row.provider === null) {
        return <div>Không có</div>;
      } else {
        return (
          <div className="cellWithImg">
            {/* <img
              className="cellImg"
              src={
                params.row.supplier.imageUrl === null
                  ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  : params.row.supplier.imageUrl
              }
              alt="avatar"
            /> */}
            {params.row.provider.name}
          </div>
        );
      }
    },
    renderHeader: () => <span>Nhà cung cấp</span>,
  },
  {
    field: "phone",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      function formatPhoneNumberCen(phoneNumber) {
        // Replace leading "+84" with "0" (if present)
        phoneNumber = phoneNumber.replace(/^\+84/, "0"); // Replace leading "+84" with "0"

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
  {
    field: "email",
    width: 260,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.email}</div>;
    },
    renderHeader: () => <span>Email</span>,
  },
];
