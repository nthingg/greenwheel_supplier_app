import "../assets/scss/memberTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { membersColumn } from "../assets/js/memberTableConfig";

const MemberTable = ({ members }) => {
  return (
    <div className="planTable">
      <DataGrid
        rows={members}
        columns={membersColumn}
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
  );
};

export default MemberTable;
