import "../../assets/scss/providers.scss";
import { DataGrid } from "@mui/x-data-grid";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem, Switch } from "@mui/material";
import { providersColumns } from "../../assets/configs/providers/providers";
import { providerTotalColumns } from "../../assets/configs/providers/providerTotal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ProviderTable = ({ providers, totalProviders }) => {
  const actionColumn = [
    {
      field: "status",
      headerName: "Trạng thái",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Switch
            checked={params.row.isActive}
            onChange={() => {}}
            inputProps={{ "aria-label": "controlled" }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#2c3d50",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#2c3d50",
              },
            }}
          />
        );
      },
      renderHeader: () => <span>TRẠNG THÁI</span>,
    },
    {
      field: "action",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <NavLink
            to={`/providers/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <IconButton color="info">
              <VisibilityIcon />
            </IconButton>
          </NavLink>
        );
      },
      renderHeader: () => <span>CHI TIẾT</span>,
    },
  ];
  const actionTotalColumn = [
    {
      field: "status",
      headerName: "Trạng thái",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Switch
            checked={params.row.node.isActive}
            onChange={() => {}}
            inputProps={{ "aria-label": "controlled" }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#2c3d50",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#2c3d50",
              },
            }}
          />
        );
      },
      renderHeader: () => <span>TRẠNG THÁI</span>,
    },
    {
      field: "action",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <NavLink
            to={`/providers/${params.row.node.id}`}
            style={{ textDecoration: "none" }}
          >
            <IconButton color="info">
              <VisibilityIcon />
            </IconButton>
          </NavLink>
        );
      },
      renderHeader: () => <span>CHI TIẾT</span>,
    },
  ];
  return (
    <div>
      {providers && (
        <div className="provider-table">
          <DataGrid
            rows={providers}
            columns={providersColumns.concat(actionColumn)}
            rowSelection={false}
            pagination
            autoPageSize={true}
            showColumnVerticalBorder={true}
            sx={{
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#2c3d50",
                color: "white",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-columnHeader--withRightBorder": {
                borderRightStyle: "none",
              },
            }}
            localeText={{
              MuiTablePagination: {
                labelDisplayedRows: ({ from, to, count }) =>
                  `${from} - ${to} trong ${
                    count === -1 ? `nhiều hơn ${to}` : count
                  }`,
              },
              noRowsLabel: "Không có dữ liệu",
            }}
          />
        </div>
      )}
      {totalProviders && (
        <div className="provider-table">
          <DataGrid
            rows={totalProviders}
            columns={providerTotalColumns.concat(actionTotalColumn)}
            rowSelection={false}
            pagination
            autoPageSize={true}
            showColumnVerticalBorder={true}
            getRowId={(row) => row.node.id}
            sx={{
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#2c3d50",
                color: "white",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-columnHeader--withRightBorder": {
                borderRightStyle: "none",
              },
            }}
            localeText={{
              MuiTablePagination: {
                labelDisplayedRows: ({ from, to, count }) =>
                  `${from} - ${to} trong ${
                    count === -1 ? `nhiều hơn ${to}` : count
                  }`,
              },
              noRowsLabel: "Không có dữ liệu",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProviderTable;
