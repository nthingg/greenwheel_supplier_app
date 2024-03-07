import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Switch } from "@mui/material";

export const suppliersColumns = [
  {
    field: "id",
    headerClassName: "prodHeader",
    width: 70,
    align: "center",
    headerAlign: "center",
    // renderCell: (params) => params.rowIndex + 1,
    renderHeader: () => <span>#</span>,
  },
  {
    field: "name",
    width: 380,
    renderCell: (params) => {
      return (
        // <div className="cellWithImg">
        //   <img className="cellImg" src={params.row.imageUrl} alt="avatar" />
        //   {params.row.name}
        // </div>
        <div>{params.row.name}</div>
      );
    },
    renderHeader: () => <span>Tên nhà cung cấp</span>,
  },
  {
    field: "phone",
    width: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.phone}</div>;
    },
    renderHeader: () => <span>SĐT</span>,
  },
  {
    field: "balance",
    width: 200,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => {
      const formattedPrice = params.row.balance.toLocaleString("vi-VN") + "đ";
      return <div className="prodPrice">{formattedPrice}</div>;
    },
    renderHeader: () => <span>Số dư</span>,
  },
  {
    field: "paymentType",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      if (params.row.account != null) {
        return (
          <div className="cellWithStatus AVAILABLE">{<CheckCircleIcon />}</div>
        );
      } else {
        return (
          <div className="cellWithStatus PERMANENT_STOP">{<CancelIcon />}</div>
        );
      }
    },
    renderHeader: () => <span>Quyền truy cập</span>,
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
          checked={params.row.isActive}
          onChange={() => {}}
          inputProps={{ "aria-label": "controlled" }}
          color="success"
        />
      );
    },
    renderHeader: () => <span>Trạng thái</span>,
  },
];
