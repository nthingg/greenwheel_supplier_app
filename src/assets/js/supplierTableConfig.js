import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton, Switch } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const suppliersColumns = [
  {
    field: "id",
    headerClassName: "prodHeader",
    width: 70,
    align: "center",
    headerAlign: "center",
    // renderCell: (params) => params.rowIndex + 1,
    renderHeader: () => <span>#</span>,
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
    renderHeader: () => <span>Tên nhà cung cấp</span>,
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
        let phone = formatPhoneNumber(params.row.phone);
        let phoneHide = formatPhoneNumberCen(params.row.phone);

        let phoneVisibility = false;

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
    renderHeader: () => <span>Quyền truy cập</span>,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      let check = false;
      if (params.row.account !== null) {
        check = true;
      }
      return (
        <Switch
          checked={params.row.isActive}
          onChange={() => {}}
          disabled={check}
          inputProps={{ "aria-label": "controlled" }}
          color="success"
        />
      );
    },
    renderHeader: () => <span>Trạng thái</span>,
  },
];
