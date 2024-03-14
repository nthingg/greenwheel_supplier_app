export const membersColumn = [
  {
    field: "id",
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
    width: 250,
    renderCell: (params) => {
      return <div>{params.row.account.name}</div>;
    },
    renderHeader: () => <span>Tên</span>,
  },
  {
    field: "phone",
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
      return <div>{formatPhoneNumber(params.row.account.phone)}</div>;
    },
    renderHeader: () => <span>Số điện thoại</span>,
  },
  {
    field: "weight",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.weight} người</div>;
    },
    renderHeader: () => <span>Đại diện</span>,
  },
  {
    field: "status",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      switch (params.row.status) {
        case "BLOCKED":
          return <div>Đã chặn</div>;
        case "INVITED":
          return <div>Đã mời</div>;
        case "JOINED":
          return <div>Đã tham gia</div>;
        default:
          // Handle default case or unknown status
          break;
      }
    },
    renderHeader: () => <span>Trạng thái</span>,
  },
];
