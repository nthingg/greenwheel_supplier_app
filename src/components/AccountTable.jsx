import "../assets/scss/accountTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Switch } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { accountsColumn } from "../assets/js/accountTableConfig";
import { supplierAccountsColumn } from "../assets/js/accountSupplierConfig";
import { staffAccountsColumn } from "../assets/js/accountStaffConfig";

const AccountTable = ({ travelers, suppliers, staffs }) => {
  const navigate = useNavigate();

  const actionColumn = [
    {
      field: "action",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Switch
            checked={params.row.isActive}
            onChange={() => {}}
            inputProps={{ "aria-label": "controlled" }}
            color="success"
          />
        );
      },
      renderHeader: () => <span>Thao tác</span>,
    },
  ];
  return (
    <div>
      {travelers && (
        <div className="accountTable">
          <DataGrid
            rows={travelers}
            columns={accountsColumn.concat(actionColumn)}
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
              boxShadow: 2,
            }}
          />
        </div>
      )}
      {suppliers && (
        <div className="accountTable">
          <DataGrid
            rows={suppliers}
            columns={supplierAccountsColumn.concat(actionColumn)}
            rowSelection={false}
            pagination
            pageSizeOptions={[]}
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
      {staffs && (
        <div className="accountTable">
          <DataGrid
            rows={staffs}
            columns={staffAccountsColumn.concat(actionColumn)}
            rowSelection={false}
            pagination
            pageSizeOptions={[]}
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
    </div>
  );
};

export default AccountTable;
