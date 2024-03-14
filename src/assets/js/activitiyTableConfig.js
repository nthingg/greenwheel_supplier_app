export const activitiesColumn = [
  {
    field: "id",
    width: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.id}</div>;
    },
    renderHeader: () => <span>#</span>,
  },
  {
    field: "type",
    headerName: "Chi tiết",
    width: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      switch (params.row.type) {
        case "ENTERTAIN":
          return <div>Giải trí</div>;
        case "EAT":
          return <div>Ăn uống</div>;
        case "GATHER":
          return <div>Hái lượm</div>;
        case "VISIT":
          return <div>Tham quan</div>;
        case "OTHER":
          return <div>Khác</div>;
        default:
          // Handle default case or unknown status
          break;
      }
    },
    renderHeader: () => <span>Loại hđ</span>,
  },
  {
    field: "shortDescription",
    width: 200,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      return (
        <div>
          <span>{params.row.shortDescription}</span>
        </div>
      );
    },
    renderHeader: () => <span>Tóm tắt</span>,
  },
  {
    field: "description",
    width: 460,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      return (
        <div>
          <span>{params.row.description}</span>
        </div>
      );
    },
    renderHeader: () => <span>Mô tả</span>,
  },
  {
    field: "duration",
    width: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      function convertTimeToHours(timeStr) {
        // Split the time string into hours, minutes, and (optional) seconds
        const [hours, minutes] = timeStr.split(":");

        // Convert minutes to decimal hours and add them to hours
        const decimalHours = parseFloat(hours) + parseFloat(minutes) / 60;

        // Return the result with one decimal place
        return decimalHours.toFixed(1);
      }
      return (
        <div>
          <span>{convertTimeToHours(params.row.duration)} tiếng</span>
        </div>
      );
    },
    renderHeader: () => <span>Thời gian</span>,
  },
];
