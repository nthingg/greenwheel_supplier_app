import "../assets/scss/transactionDetailTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { detailsColumns } from "../assets/js/detailTableConfig";
import { useEffect, useState } from "react";

const DetailTable = ({ details }) => {
  const [list, setDetails] = useState([]);

  useEffect(() => {
    if (details) {
      setDetails(details);
    }
  });

  return (
    <div className="detailTable">
      <DataGrid
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
