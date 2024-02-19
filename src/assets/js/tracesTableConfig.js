export const tracesColumns = [
  {
    field: "id",
    width: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.id}</div>;
    },
    renderHeader: () => <span>#</span>,
  },
  {
    field: "name",
    headerName: "Chi tiết",
    width: 500,
    renderCell: (params) => {
      let res = "";
      if (params.row.description == null) {
        res = "Không có";
      } else {
        res = params.row.description;
      }
      return <div>{res}</div>;
    },
    renderHeader: () => <span>Chi tiết</span>,
  },
  {
    field: "quantity",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const date = new Date(params.row.modifiedAt);

      const formattedDateTime = date.toLocaleString("en-GB");
      return (
        <div>
          <span>{formattedDateTime}</span>
        </div>
      );
    },
    renderHeader: () => <span>Thời gian</span>,
  },
  {
    field: "isCustomerModification",
    headerName: "Chi tiết",
    align: "center",
    headerAlign: "center",
    width: 200,
    renderCell: (params) => {
      let auth = "";
      if (params.row.isCustomerModification) {
        auth = "Khách hàng";
      } else {
        auth = "Nhà cung cấp";
      }
      return <div>{auth}</div>;
    },
    renderHeader: () => <span>Bên thay đổi</span>,
  },
  {
    field: "status",
    width: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      switch (params.row.status) {
        case "RESERVED":
          return <div className={`cellWithStatus confirmed`}>Đã chấp nhận</div>;
        case "CANCELLED":
          return <div className={`cellWithStatus cancelled`}>Đã hủy</div>;
        case "TEMPORARY":
          return <div className={`cellWithStatus temporary`}>Đang xử lý</div>;
        default:
          // Handle default case or unknown status
          break;
      }
    },
    renderHeader: () => <span>Trạng thái thay đổi</span>,
  },
];
