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
  {
    field: "name",
    width: 300,
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
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#2c3d50",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#2c3d50",
            },
          }}
        />
      );
    },
    renderHeader: () => <span>Trạng thái</span>,
  },
];
