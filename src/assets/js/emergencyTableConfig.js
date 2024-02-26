export const emergenciesColumns = [
  {
    field: "index",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.id}</div>;
    },
    renderHeader: () => <span>STT</span>,
  },
  {
    field: "name",
    width: 340,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={
              params.row.imageUrl != null
                ? params.row.imageUrl
                : "https://vinhphucwater.com.vn/wp-content/uploads/2023/05/no-image.jpg"
            }
            alt="avatar"
          />
          {params.row.name}
        </div>
      );
    },
    renderHeader: () => <span>Tên</span>,
  },
  {
    field: "host",
    width: 220,
    align: "right",
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.phone}</div>;
    },
    renderHeader: () => <span>Số điện thoại</span>,
  },
  {
    field: "memberCount",
    width: 700,
    align: "right",
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      return <div>{params.row.address}</div>;
    },
    renderHeader: () => <span>Địa chỉ</span>,
  },
];
