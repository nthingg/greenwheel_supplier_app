import { tracesColumns } from "../assets/js/tracesTableConfig";
import "../assets/scss/shared.scss";
import "../assets/scss/transactionTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const TracesTable = ({ traces }) => {
  return (
    <div className="traceTable">
      <DataGrid
        rows={traces}
        columns={tracesColumns}
        rowSelection={false}
        pagination
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

export default TracesTable;
