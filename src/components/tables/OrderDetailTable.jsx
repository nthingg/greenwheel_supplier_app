import "../../assets/scss/transactionDetailTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { detailsColumns } from "../../assets/configs/orders/orderDetails";
import { useEffect, useState } from "react";

const OrderDetailTable = ({ details }) => {
  const [list, setDetails] = useState([]);

  useEffect(() => {
    if (details) {
      setDetails(details);
      const sum = details.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.product.price * currentValue.quantity,
        0
      );
    }
  });

  return (
    <div className="detailTable">
      <DataGrid
        className="tableDetail"
        rows={list}
        columns={detailsColumns}
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
        getRowId={(row) => row.index}
      />
    </div>
  );
};

export default OrderDetailTable;
