import "../assets/scss/productTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { plansColumns } from "../assets/js/planConfig";
import { accountPlansColumns } from "../assets/js/accountPlanConfig";

const PlanTable = ({ plans, accountPlans }) => {
  const navigate = useNavigate();

  const actionColumn = [
    {
      field: "action",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let check = params.row.status;
        switch (check) {
          case "PUBLISHED":
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
          case "READY":
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
          case "CANCELED":
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
          case "VERIFIED":
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
          default:
            return (
              <IconButton color="info" disabled={true}>
                <VisibilityOffIcon />
              </IconButton>
            );
        }
      },
      renderHeader: () => <span>Chi tiết</span>,
    },
  ];
  return (
    <div>
      {plans && (
        <div className="planTable">
          <DataGrid
            rows={plans}
            columns={plansColumns.concat(actionColumn)}
            rowSelection={false}
            pagination
            pageSizeOptions={8}
            autoHeight={true}
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
      )}
      {accountPlans && (
        <div className="planTable">
          <DataGrid
            rows={accountPlans}
            columns={accountPlansColumns}
            rowSelection={false}
            pagination
            autoPageSize={true}
            pageSizeOptions={[]}
            showColumnVerticalBorder={true}
            sx={{
              height: 320,
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
      )}
    </div>
  );
};

export default PlanTable;
