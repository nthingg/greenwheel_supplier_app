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
    field: "supplierName",
    width: 300,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      if (params.row.supplier === null) {
        return <div>Không có</div>;
      } else {
        return (
          <div className="cellWithImg">
            <img
              className="cellImg"
              src={
                params.row.supplier.imageUrl === null
                  ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  : params.row.supplier.imageUrl
              }
              alt="avatar"
            />
            {params.row.supplier.name}
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

      if (params.row.phone !== null) {
        let phoneVisibility = false;
        let phone = formatPhoneNumber(params.row.phone);
        let phoneHide = formatPhoneNumberCen(params.row.phone);
        function change() {
          phoneVisibility = !phoneVisibility;
        }

        return (
          <div>
            {phoneVisibility === false ? (
              <span className="itemValue">
                {phoneHide}
                <IconButton className="mapBtn" color="info" onClick={change}>
                  <VisibilityOffIcon />
                </IconButton>
              </span>
            ) : (
              <span className="itemValue">
                {phone}
                <IconButton className="mapBtn" color="info" onClick={change}>
                  <VisibilityIcon />
                </IconButton>
              </span>
            )}
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
