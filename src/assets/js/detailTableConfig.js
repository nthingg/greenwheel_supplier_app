export const detailsColumns = [
  {
    field: "id",
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
    width: 300,
    renderCell: (params) => {
      return <div>{params.row.product.name}</div>;
    },
    renderHeader: () => <span>Tên dịch vụ</span>,
  },
  {
    field: "quantity",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.quantity}</div>;
    },
    renderHeader: () => <span>Số lượng</span>,
  },
  {
    field: "price",
    width: 200,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => {
      const formattedPrice =
        params.row.product.price.toLocaleString("vi-VN") + "đ";
      return <div className="prodPrice">{formattedPrice}</div>;
    },
    renderHeader: () => <span>Đơn giá</span>,
  },
  {
    field: "total",
    width: 200,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => {
      const formattedPrice =
        (params.row.product.price * params.row.quantity).toLocaleString(
          "vi-VN"
        ) + "đ";
      return <div className="prodPrice">{formattedPrice}</div>;
    },
    renderHeader: () => <span>Thành tiền</span>,
  },
];
