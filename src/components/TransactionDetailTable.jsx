import "../assets/scss/transactionDetailTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { detailsColumns } from "../assets/js/detailTableConfig";
import { useEffect, useState } from "react";

const DetailTable = ({ details }) => {
  const [list, setDetails] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    if (details) {
      setDetails(details);
      const sum = details.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.product.price * currentValue.quantity,
        0
      );
      setSum(sum);
    }
  });

  return (
    <div className="detailTable">
      <div className="total">
        <p>Tổng: {sum.toLocaleString("vi-VN") + "đ"}</p>
      </div>
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
            backgroundColor: "#2ECC71",
            color: "white",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeader--withRightBorder": {
            borderRightWidth: "2px",
          },
          boxShadow: 2,
        }}
        getRowId={(row) => row.product.id}
      />
    </div>
  );
};

export default DetailTable;
