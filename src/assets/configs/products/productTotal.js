import { Switch } from "@mui/material";

const providerId = localStorage.getItem("providerId");

export const productTotalColumns = [
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
    field: "type",
    width: 100,
    align: "center",
    renderCell: (params) => {
      const productType = {
        "BEVERAGE": "Thức uống",
        "CAMP": "Lều trại",
        "FOOD": "Đồ ăn",
        "ROOM": "Phòng nghỉ",
        "VEHICLE": "Phương tiện",
      }
      return <div>{productType[params.row.type]}</div>;
    },
    renderHeader: () => <span>Loại dịch vụ</span>,
  },
  {
    field: "price",
    width: 220,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => {
      const formattedPrice = params.row.price.toLocaleString("vi-VN") + "đ";
      if (params.row.provider.account && !providerId) {
        return <div className="prodPrice" style={{ paddingRight: "74px" }}>*******</div>;
      }
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
