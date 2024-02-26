import "../assets/scss/emergencyTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { emergenciesColumns } from "../assets/js/emergencyTableConfig";

const EmergencyTable = ({ list }) => {
  return (
    <div className="productTable">
      <DataGrid
        rows={list}
        columns={emergenciesColumns}
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

export default EmergencyTable;
