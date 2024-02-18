export const transactionsColumns = [
  {
    field: "index",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.index}</div>;
    },
    renderHeader: () => <span>STT</span>,
  },
  {
    field: "id",
    width: 360,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.id}</div>;
    },
    renderHeader: () => <span>Mã HĐ</span>,
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
    field: "createdAt",
    width: 220,
    renderCell: (params) => {
      const date = new Date(params.row.createdAt);

      const formattedDateTime = date.toLocaleString("en-GB");
      return (
        <div>
          <span>{formattedDateTime}</span>
        </div>
      );
    },
    renderHeader: () => <span>Ngày tạo</span>,
  },
  {
    field: "total",
    width: 220,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => {
      const amount = params.row.total;
      const formattedPrice = amount.toLocaleString("vi-VN") + "đ";
      return <div className="prodPrice">{formattedPrice}</div>;
    },
    renderHeader: () => <span>Tổng</span>,
  },
  {
    field: "status",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      switch (params.row.currentStatus) {
        case "RESERVED":
          return (
            <div className={`cellWithStatus confirmed`}>Đã hoàn thành</div>
          );
        case "CANCELLED":
          return <div className={`cellWithStatus cancelled`}>Đã hủy</div>;
        case "TEMPORARY":
          return <div className={`cellWithStatus temporary`}>Đang xử lý</div>;
        default:
          // Handle default case or unknown status
          break;
      }
    },
    renderHeader: () => <span>Trạng thái</span>,
  },
];
