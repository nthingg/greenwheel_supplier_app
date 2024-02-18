import { Switch } from "@mui/material";

export const productsColumns = [
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
  // {
  //   field: "id",
  //   headerClassName: "prodHeader",
  //   width: 70,
  //   align: "center",
  //   headerAlign: "center",
  //   // renderCell: (params) => params.rowIndex + 1,
  //   renderHeader: () => <span>STT</span>,
  // },
  {
    field: "name",
    width: 400,
    renderCell: (params) => {
      return <div>{params.row.name}</div>;
    },
    renderHeader: () => <span>Tên dịch vụ</span>,
  },
  {
    field: "price",
    width: 220,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => {
      const formattedPrice = params.row.price.toLocaleString("vi-VN") + "đ";
      return <div className="prodPrice">{formattedPrice}</div>;
    },
    renderHeader: () => <span>Đơn giá</span>,
  },
  {
    field: "paymentType",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      let typeText = "";

      switch (params.row.paymentType) {
        case "PER_DAY":
          typeText = "Theo ngày";
          break;
        case "PER_UNIT":
          typeText = "Theo sản phẩm";
          break;
        default:
          // Handle default case or unknown status
          break;
      }
      return <div>{typeText}</div>;
    },
    renderHeader: () => <span>Cách thức thanh toán</span>,
  },
  {
    field: "partySize",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.partySize}</div>;
    },
    renderHeader: () => <span>Số người phù hợp</span>,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return (
        <Switch
          checked={params.row.isAvailable}
          onChange={() => {}}
          inputProps={{ "aria-label": "controlled" }}
          color="success"
        />
      );
    },
    renderHeader: () => <span>Trạng thái</span>,
  },
];
