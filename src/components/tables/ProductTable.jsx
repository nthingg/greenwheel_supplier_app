import { productsColumns } from "../../assets/configs/products/products";
import "../../assets/scss/productTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { productTotalColumns } from "../../assets/configs/products/productTotal";

const ProductTable = ({ products, productTotal, profile }) => {
  const navigate = useNavigate();
  const [anchorId, setAnchorId] = useState(null);
  const [anchor, setAnchor] = useState(null);

  const options = ["Xem", "Chỉnh sửa"];
  const ITEM_HEIGHT = 48;

  const handleEditClick = () => {
    // Logic for "Xác nhận" option
    console.log("Xác nhận clicked");
    // Add your specific code here
  };

  const actionColumn = [
    {
      field: "action",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isSelected = anchorId === params.row.id; // Check if the current row is selected
        const handleClick = (event) => {
          setAnchorId(isSelected ? null : params.row.id); // Toggle the selected row
          setAnchor(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorId(null);
        };

        const handleDetailClick = () => {
          if (profile) {
            navigate(`/profile/product/${anchorId}`);
          } else {
            navigate(
              `/providers/${params.row.provider.id}/product/${anchorId}`
            );
          }
        };

        return (
          <div>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={isSelected ? "long-menu" : undefined}
              aria-expanded={isSelected ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchor}
              open={isSelected}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "12ch",
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={false}
                  onClick={() => {
                    handleClose();
                    switch (option) {
                      case "Xem":
                        handleDetailClick();
                        break;
                      case "Chỉnh sửa":
                        handleEditClick();
                        break;
                      default:
                        break;
                    }
                  }}
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        );
      },
      renderHeader: () => <span>Thao tác</span>,
    },
  ];
  return (
    <div className="productTable">
      {console.log(products)}
      {products && (
        <DataGrid
          rows={products}
          columns={products[0]?.provider.account ? productsColumns : productsColumns.concat(actionColumn)}
          rowSelection={false}
          pagination
          autoPageSize
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
            backgroundColor: "white",
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
      )}
      {productTotal && (
        <DataGrid
          rows={productTotal}
          columns={productTotal[0]?.provider.account ? productTotalColumns : productTotalColumns.concat(actionColumn)}
          rowSelection={false}
          pagination
          autoPageSize
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
            backgroundColor: "white",
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
      )}
    </div>
  );
};

export default ProductTable;
