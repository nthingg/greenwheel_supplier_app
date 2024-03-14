export const accountPlansColumns = [
  {
    field: "index",
    width: 80,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.index}</div>;
    },
    renderHeader: () => <span>#</span>,
  },
  {
    field: "name",
    width: 310,
    renderCell: (params) => {
      return <div>{params.row.name}</div>;
    },
    renderHeader: () => <span>Kế hoạch</span>,
  },
  {
    field: "destination",
    width: 260,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.destination.name}</div>;
    },
    renderHeader: () => <span>Địa điểm</span>,
  },
  {
    field: "memberCount",
    width: 160,
    align: "right",
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return (
        <div>
          {params.row.memberCount} / {params.row.memberLimit}
        </div>
      );
    },
    renderHeader: () => <span>Thành viên</span>,
  },
  {
    field: "departAt",
    width: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const date = new Date(params.row.departAt);

      const formattedDateTime = date.toLocaleDateString("vi-VN", {
        timeZone: "UTC",
      });

      return (
        <div>
          <span>{formattedDateTime}</span>
        </div>
      );
    },
    renderHeader: () => <span>Ngày khởi hành</span>,
  },
  {
    field: "endDate",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const date = new Date(params.row.endDate);

      const dateOnly = date.toLocaleDateString("vi-VN", {
        timeZone: "UTC",
      });

      return (
        <div>
          <span>{dateOnly}</span>
        </div>
      );
    },
    renderHeader: () => <span>Ngày kết thúc</span>,
  },
];
