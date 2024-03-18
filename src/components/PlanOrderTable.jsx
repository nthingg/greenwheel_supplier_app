import "../assets/scss/planOrderTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { planOrdersColumn } from "../assets/js/planOrderTableConfig";

const PlanOrderTable = ({ orders }) => {
  return (
    <div className="planOrderTable">
      <DataGrid
        rows={orders}
        columns={planOrdersColumn}
        rowSelection={false}
        pagination
        autoPageSize={true}
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
          ".MuiTablePagination-displayedRows": {
            display: "none",
          },
          boxShadow: 2,
        }}
      />
    </div>
  );
};

export default PlanOrderTable;
