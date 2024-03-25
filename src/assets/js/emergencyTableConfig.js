export const emergenciesColumns = [
  {
    field: "index",
    width: 80,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.id}</div>;
    },
    renderHeader: () => <span>#</span>,
  },
  {
    field: "name",
    width: 300,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img
            className="cellImg"
            src={
              params.row.imageUrl != null
                ? params.row.imageUrl
                : "https://vinhphucwater.com.vn/wp-content/uploads/2023/05/no-image.jpg"
            }
            alt="avatar"
          /> */}
          {params.row.name}
        </div>
      );
    },
    renderHeader: () => <span>Tên</span>,
  },
  {
    field: "host",
    width: 180,
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
      return <div>{formatPhoneNumberCen(params.row.phone)}</div>;
    },
    renderHeader: () => <span>Số điện thoại</span>,
  },
  {
    field: "address",
    width: 650,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      return <div>{params.row.address}</div>;
    },
    renderHeader: () => <span>Địa chỉ</span>,
  },
  {
    field: "type",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      switch (params.row.type) {
        case "MEDICAL":
          return <div>Trạm xá</div>;
        case "RESCUE":
          return <div>Cứu hộ</div>;
        case "FIRE":
          return <div>Cứu hỏa</div>;
        case "GROCERY":
          return <div>Tạp hóa</div>;
        case "SECURITY":
          return <div>Bảo an</div>;
        case "VEHICLE":
          return <div>Xe cộ</div>;
        default:
          // Handle default case or unknown status
          break;
      }
    },
    renderHeader: () => <span>Loại</span>,
  },
];
