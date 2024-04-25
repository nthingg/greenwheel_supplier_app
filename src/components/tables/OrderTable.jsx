import { ordersColumns } from "../../assets/configs/orders/orders";
import "../../assets/scss/shared.scss";
import "../../assets/scss/transactionTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { VisibilityOff } from "@mui/icons-material";

const OrderTable = ({ orders }) => {
  const actionColumn = [
    {
      field: "action",
      headerName: "Chi tiết",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row.node.provider.account) {
          return (
            <NavLink
              to={`/orders/${params.row.node.id}`}
              style={{ textDecoration: "none" }}
            >
              <IconButton color="info">
                <VisibilityIcon />
              </IconButton>
            </NavLink>
          );
        }
        return (
          <IconButton color="info" disabled={true}>
            <VisibilityOff />
          </IconButton>
        );
      },
      renderHeader: () => <span>CHI TIẾT</span>,
    },
  ];

  return (
    <div className="transactionTable">
      <DataGrid
        rows={orders}
        columns={ordersColumns.concat(actionColumn)}
        rowSelection={false}
        pagination
        autoPageSize
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
              `${from} - ${to} trong ${count === -1 ? `nhiều hơn ${to}` : count
              }`,
          },
          noRowsLabel: "Không có dữ liệu",
        }}
      />
    </div>
  );
};

export default OrderTable;
