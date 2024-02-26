import "../assets/scss/productTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { plansColumns } from "../assets/js/planConfig";

const PlanTable = ({ plans }) => {
  const navigate = useNavigate();

  const actionColumn = [
    {
      field: "action",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let check = params.row.isPublic;
        switch (check) {
          case true:
            return (
              <IconButton
                color="info"
                onClick={() => {
                  navigate(`/plans/${params.row.id}`);
                }}
              >
                <VisibilityIcon />
              </IconButton>
            );
          case false:
            return (
              <IconButton color="info" disabled={true}>
                <VisibilityOffIcon />
              </IconButton>
            );
          default:
            return (
              <IconButton color="info">
                <VisibilityOffIcon />
              </IconButton>
            );
        }
      },
      renderHeader: () => <span>Chi tiết</span>,
    },
  ];
  return (
    <div className="planTable">
      <DataGrid
        rows={plans}
        columns={plansColumns.concat(actionColumn)}
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

export default PlanTable;
