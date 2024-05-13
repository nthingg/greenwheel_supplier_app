import { ordersColumns } from "../../assets/configs/orders/orders";
import "../../assets/scss/shared.scss";
import "../../assets/scss/transactionTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { VisibilityOff } from "@mui/icons-material";
import { orderTotalColumns } from "../../assets/configs/orders/orderTotal";

const OrderTable = ({ orders, orderTotal }) => {
  const providerId = localStorage.getItem("providerId");
  const tempOrderColumns = orders ? [...ordersColumns] : [...orderTotalColumns];
  tempOrderColumns.pop();

  const actionColumn = [
    {
      field: "action",
      headerName: "Chi tiết",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row.node.provider.account && !providerId) {
          return (
            <IconButton color="info" disabled={true}>
              <VisibilityOff />
            </IconButton>
          );
        }
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
      },
      renderHeader: () => <span>CHI TIẾT</span>,
    },
  ];

  const providerColumn = [{
    field: "providerName",
    width: 210,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.row.node.provider.name}</div>;
    },
    renderHeader: () => <span>NHÀ CUNG CẤP</span>,
  }];

  return (
    <div>
      {orders && (
        <div className="transactionTable">
          <DataGrid
            rows={orders}
            columns={providerId ? orderTotalColumns.concat(actionColumn) : tempOrderColumns.concat(providerColumn).concat(orderTotalColumns[orderTotalColumns.length - 1]).concat(actionColumn)}
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
        )}
      {
        orderTotal && (
<div className="transactionTable">
          <DataGrid
            rows={orderTotal}
            columns={providerId ? ordersColumns.concat(actionColumn) : tempOrderColumns.concat(providerColumn).concat(ordersColumns[ordersColumns.length - 1]).concat(actionColumn)}
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
        )}
    </div>
  );
};

export default OrderTable;
