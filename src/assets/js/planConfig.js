import { Switch } from "@mui/material";

export const plansColumns = [
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
    width: 340,
    renderCell: (params) => {
      return <div>{params.row.name}</div>;
    },
    renderHeader: () => <span>Tên kế hoạch</span>,
  },
  {
    field: "host",
    width: 220,
    align: "right",
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.account.name}</div>;
    },
    renderHeader: () => <span>Tên trưởng nhóm</span>,
  },
  {
    field: "memberCount",
    width: 200,
    align: "right",
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.memberCount}</div>;
    },
    renderHeader: () => <span>Số người tham gia</span>,
  },
  {
    field: "destination",
    headerName: "Trạng thái",
    width: 260,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.destination.name}</div>;
    },
    renderHeader: () => <span>Địa điểm</span>,
  },
  {
    field: "createdAt",
    width: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const date = new Date(params.row.startDate);

      const formattedDateTime = date.toLocaleString("en-GB");
      const formattedDate = formattedDateTime.substring(
        0,
        formattedDateTime.indexOf(", ")
      );

      return (
        <div>
          <span>{formattedDate}</span>
        </div>
      );
    },
    renderHeader: () => <span>Ngày bắt đầu</span>,
  },
];
