import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import { Switch } from "@mui/material";

export const destinationsColumns = [
  {
    field: "id",
    headerClassName: "prodHeader",
    width: 70,
    align: "center",
    headerAlign: "center",
    // renderCell: (params) => params.rowIndex + 1,
    renderHeader: () => <span>STT</span>,
  },
  {
    field: "name",
    width: 380,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.imageUrls[0]} alt="avatar" />
          {params.row.name}
        </div>
      );
    },
    renderHeader: () => <span>Tên địa điểm</span>,
  },
  {
    field: "province",
    width: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.province.name}</div>;
    },
    renderHeader: () => <span>Thuộc tỉnh</span>,
  },
  {
    field: "comments",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.comments.length}</div>;
    },
    renderHeader: () => <span>Lượt đánh giá</span>,
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
          checked={params.row.isVisible}
          onChange={() => {}}
          inputProps={{ "aria-label": "controlled" }}
          color="success"
        />
      );
    },
    renderHeader: () => <span>Trạng thái</span>,
  },
];
