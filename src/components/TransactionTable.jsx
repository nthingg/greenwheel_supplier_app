import { transactionsColumns } from "../assets/js/transactionTableConfig";
import "../assets/scss/shared.scss";
import "../assets/scss/transactionTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";

const TransacionTable = ({ orders }) => {
  const navigate = useNavigate();
  const [anchorId, setAnchorId] = useState(null);
  const [anchorStatus, setAnchorStatus] = useState("");
  const [anchor, setAnchor] = useState(null);
  const options = ["Xem", "Hủy bỏ"];
  const viewOption = ["Xem"];
  const ITEM_HEIGHT = 48;

  const handleDetailClick = () => {
    navigate(`/transactions/${anchorId}`);
  };

  const handleCancelClick = () => {
    console.log("Hủy bỏ clicked");
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Chi tiết",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isSelected = anchorId === params.row.id; // Check if the current row is selected
        const handleClick = (event) => {
          setAnchorId(isSelected ? null : params.row.id); // Toggle the selected row
          setAnchorStatus(params.row.statusLog[0].status);
          setAnchor(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorId(null);
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
              {(params.row.statusLog[0].status === "RESERVED"
                ? options
                : viewOption
              ).map((option) => (
                <MenuItem
                  key={option}
                  selected={false}
                  onClick={() => {
                    handleClose();
                    switch (option) {
                      case "Xem":
                        handleDetailClick();
                        break;
                      case "Hủy bỏ":
                        handleCancelClick();
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
    <div className="transactionTable">
      <DataGrid
        rows={orders}
        columns={transactionsColumns.concat(actionColumn)}
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

export default TransacionTable;
