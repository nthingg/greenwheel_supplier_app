export const detailsColumns = [
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
    headerName: "TÊN DỊCH VỤ",
    width: 250,
    renderCell: (params) => {
      return <div>{params.row.product.name}</div>;
    },
    renderHeader: () => <span>DỊCH VỤ</span>,
  },
  {
    field: "servesDate",
    headerName: "NGÀY PHỤC VỤ",
    width: 200,
    renderCell: (params) => {
      const date = new Date(params.row.date);

      const formattedDateTime = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return <div>{formattedDateTime}</div>;
    },
    renderHeader: () => <span>NGÀY PHỤC VỤ</span>,
  },
  {
    field: "quantity",
    width: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.quantity}</div>;
    },
    renderHeader: () => <span>SỐ LƯỢNG</span>,
  },
  {
    field: "price",
    width: 200,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => {
      const formattedPrice =
        params.row.price.toLocaleString("vi-VN") + "đ";
      return <div className="prodPrice">{formattedPrice}</div>;
    },
    renderHeader: () => <span>ĐƠN GIÁ</span>,
  },
  {
    field: "total",
    width: 200,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => {
      const formattedPrice =
        (params.row.total).toLocaleString(
          "vi-VN"
        ) + "đ";
      return <div className="prodPrice">{formattedPrice}</div>;
    },
    renderHeader: () => <span>THÀNH TIỀN</span>,
  },
];
