export const emergenciesColumns = [
  {
    field: "index",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.id}</div>;
    },
    renderHeader: () => <span>STT</span>,
  },
  {
    field: "name",
    width: 250,
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
      return <div>{formatPhoneNumber(params.row.phone)}</div>;
    },
    renderHeader: () => <span>Số điện thoại</span>,
  },
  {
    field: "memberCount",
    width: 700,
    align: "right",
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      return <div>{params.row.address}</div>;
    },
    renderHeader: () => <span>Địa chỉ</span>,
  },
];
