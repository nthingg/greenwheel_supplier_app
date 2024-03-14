import "../assets/scss/activityTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { activitiesColumn } from "../assets/js/activitiyTableConfig";

const ActivityTable = ({ activities }) => {
  return (
    <div className="activityTable">
      <DataGrid
        rows={activities}
        columns={activitiesColumn}
        rowSelection={false}
        pagination
        // pageSizeOptions={[]}
        // autoHeight={true}
        autoPageSize
        showColumnVerticalBorder={true}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#2ECC71",
            color: "white",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeader--withRightBorder": {
            borderRightWidth: "2px",
          },
          boxShadow: 2,
        }}
      />
    </div>
  );
};

export default ActivityTable;
