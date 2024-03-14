export const transactionsColumns = [
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
    renderHeader: () => <span>Mã đơn</span>,
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
    renderHeader: () => <span>Ngày đặt</span>,
  },
  {
    field: "name",
    width: 240,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={
              params.row.account.avatarUrl === null
                ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                : params.row.account.avatarUrl
            }
            alt="avatar"
          />
          {params.row.account.name}
        </div>
      );
    },
    renderHeader: () => <span>Khách hàng</span>,
  },
  {
    field: "phone",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      // function formatPhoneNumber(phoneNumber) {
      //   // Replace leading "+84" with "0" (if present)
      //   phoneNumber = phoneNumber.replace(/^\+84/, "0");

      //   let part1, part2, part3;
      //   switch (phoneNumber.length) {
      //     case 9:
      //       part1 = phoneNumber.slice(0, 3);
      //       part2 = phoneNumber.slice(3, 6);
      //       part3 = phoneNumber.slice(6);
      //       break;
      //     case 10:
      //       part1 = phoneNumber.slice(0, 4);
      //       part2 = phoneNumber.slice(4, 7);
      //       part3 = phoneNumber.slice(7);
      //       break;
      //     case 11:
      //       part1 = phoneNumber.slice(0, 4); // Handle potential country code (adjust as needed)
      //       part2 = phoneNumber.slice(4, 7);
      //       part3 = phoneNumber.slice(7);
      //       break;
      //     default:
      //       // Handle invalid lengths (optional)
      //       console.warn(`Invalid phone number length: ${phoneNumber}`);
      //       return phoneNumber;
      //   }

      //   // Combine parts with spaces
      //   return `${part1} ${part2} ${part3}`;
      // }
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

      return <div>{formatPhoneNumber(params.row.account.phone)}</div>;
    },
    renderHeader: () => <span>Điện thoại</span>,
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
    renderHeader: () => <span>Tổng</span>,
  },
];
