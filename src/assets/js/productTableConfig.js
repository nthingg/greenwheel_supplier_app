import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import SellIcon from "@mui/icons-material/Sell";
import { Switch } from "@mui/material";

export const productsColumns = [
  // {
  //   field: "id",
  //   headerName: "ID",
  //   width: 70,
  //   align: "center",
  //   headerAlign: "center",
  // },
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
    width: 400,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.thumbnailUrl} alt="avatar" />
          {params.row.name}
        </div>
      );
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
    field: "type",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      let typeText = "";

      switch (params.row.type) {
        case "BEVERAGE":
          typeText = "Đồ uống";
          break;
        case "FOOD":
          typeText = "Thức ăn";
          break;
        case "OTHER":
          typeText = "Khác";
          break;
        case "ROOM":
          typeText = "Phòng xá";
          break;
        case "TENT":
          typeText = "Lều trại";
          break;
        default:
          // Handle default case or unknown status
          break;
      }
      return <div>{typeText}</div>;
    },
    renderHeader: () => <span>Loại sản phẩm</span>,
  },
  {
    field: "isHidden",
    headerName: "Trạng thái",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return (
        // <div className={`cellWithStatus ${params.row.isHidden}`}>
        //   {params.row.isHidden == false ? (
        //     <div className="viewButton">
        //       <SellIcon />
        //     </div>
        //   ) : (
        //     <div className="viewButton">
        //       <DoDisturbOnIcon />
        //     </div>
        //   )}
        // </div>
        <Switch
          checked={!params.row.isHidden}
          onChange={() => {}}
          inputProps={{ "aria-label": "controlled" }}
          color="success"
        />
      );
    },
    renderHeader: () => <span>Trạng thái</span>,
  },
];
