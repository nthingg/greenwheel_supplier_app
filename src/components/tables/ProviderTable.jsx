import "../../assets/scss/providers.scss";
import { DataGrid } from "@mui/x-data-grid";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  IconButton,
  Switch,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { providersColumns } from "../../assets/configs/providers/providers";
import { providerTotalColumns } from "../../assets/configs/providers/providerTotal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMutation } from "@apollo/client";
import { CHANGE_PROVIDER_STATUS } from "../../services/graphql/provider";

const ProviderTable = ({ providers, totalProviders, refetch, fetchTotalProvider }) => {
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const [errorMsg, setErrMsg] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [okMsg, setOkMsg] = useState(false);
  const [snackbarOkOpen, setSnackbarOkOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState([false]);

  const handleClick = () => {
    setSnackbarOpen(true);
  };
  const handleCloseSnack = () => {
    setSnackbarOpen(false);
  };

  const handleClickOk = () => {
    setSnackbarOkOpen(true);
  };
  const handleCloseSnackOk = () => {
    setSnackbarOkOpen(false);
  };

  const handleClickOpenConfirm = (id) => {
    openConfirm[id] = true;
    setOpenConfirm([...openConfirm]);
  };

  const handleCloseConfirm = (id) => {
    openConfirm[id] = false;
    setOpenConfirm([...openConfirm]);
  };

  const [change, { }] = useMutation(CHANGE_PROVIDER_STATUS);

  const handleChangeStatus = async (id) => {
    try {
      const { data } = await change({
        variables: {
          id: id,
        },
      });
      setOkMsg(
        `Thay đổi thành công trạng thái của: ${data.changeProviderStatus.name}`
      );
      refetch();
      fetchTotalProvider();
      handleClickOk();
      handleCloseConfirm(id);
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
    }
  }

  const actionColumn = [
    {
      field: "status",
      headerName: "Trạng thái",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="provider-status">
            <a className="status active" title={params.row.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}>
              <Switch
                checked={params.row.isActive}
                color={params.row.isActive ? "success" : "error"}
                onClick={() => {
                  handleClickOpenConfirm(params.row.id);
                }}
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
            </a>
            <Dialog
              open={openConfirm[params.row.id]}
              onClose={() => {
                handleCloseConfirm(params.row.id);
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              className="confirmDialog"
            >
              <DialogTitle id="alert-dialog-title">
                {"Xác nhận"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Bạn có xác nhận muốn đổi trạng thái hiển thị của {params.row.name} không?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <button
                  className="btn-change-status-cancel"
                  onClick={() => {
                    handleCloseConfirm(params.row.id);
                  }}
                  style={{
                    textDecoration: "none",
                    color: "rgb(44, 61, 80)",
                    backgroundColor: "white",
                    fontSize: "16px",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: "1px solid",
                    transition: "0.4s"
                  }}>
                  Hủy bỏ
                </button>
                <button className="btn-change-status-confirm"
                  onClick={() => {
                    handleChangeStatus(params.row.id);
                  }}
                  autoFocus
                  style={{
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#2c3d50",
                    fontSize: "16px",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: "none",
                    transition: "0.4s"
                  }}>
                  Đồng ý
                </button>
              </DialogActions>
            </Dialog>
          </div>
          // <Switch
          //   checked={params.row.isActive}
          //   onChange={() => {}}
          //   inputProps={{ "aria-label": "controlled" }}
          //   sx={{
          //     "& .MuiSwitch-switchBase.Mui-checked": {
          //       color: "#2c3d50",
          //     },
          //     "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          //       backgroundColor: "#2c3d50",
          //     },
          //   }}
          // />
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
          <div className="provider-status">
            <a className="status active" title={params.row.node.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}>
              <Switch
                checked={params.row.node.isActive}
                color={params.row.node.isActive ? "success" : "error"}
                onClick={() => {
                  handleClickOpenConfirm(params.row.node.id);
                }}
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
            </a>
            <Dialog
              open={openConfirm[params.row.node.id]}
              onClick={() => {
                handleCloseConfirm(params.row.node.id);
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              className="confirmDialog"
            >
              <DialogTitle id="alert-dialog-title">
                {"Xác nhận"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Bạn có xác nhận muốn đổi trạng thái hiển thị của {params.row.node.name} không?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <button
                  className="btn-change-status-cancel"
                  onClose={() => {
                    handleCloseConfirm(params.row.node.id);
                  }}
                  style={{
                    textDecoration: "none",
                    color: "rgb(44, 61, 80)",
                    backgroundColor: "white",
                    fontSize: "16px",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: "1px solid",
                    transition: "0.4s"
                  }}>
                  Hủy bỏ
                </button>
                <button className="btn-change-status-confirm"
                  onClick={() => {
                    handleChangeStatus(params.row.node.id);
                  }}
                  autoFocus
                  style={{
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#2c3d50",
                    fontSize: "16px",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: "none",
                    transition: "0.4s"
                  }}>
                  Đồng ý
                </button>
              </DialogActions>
            </Dialog>
          </div>
          // <Switch
          //   checked={params.row.node.isActive}
          //   onChange={() => { }}
          //   inputProps={{ "aria-label": "controlled" }}
          //   sx={{
          //     "& .MuiSwitch-switchBase.Mui-checked": {
          //       color: "#2c3d50",
          //     },
          //     "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          //       backgroundColor: "#2c3d50",
          //     },
          //   }}
          // />
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
                  `${from} - ${to} trong ${count === -1 ? `nhiều hơn ${to}` : count
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
                  `${from} - ${to} trong ${count === -1 ? `nhiều hơn ${to}` : count
                  }`,
              },
              noRowsLabel: "Không có dữ liệu",
            }}
          />
        </div>
      )}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbarOpen}
        onClose={handleCloseSnack}
        autoHideDuration={2000}
        key={"alert"}
      >
        <Alert
          onClose={handleCloseSnack}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbarOkOpen}
        onClose={handleCloseSnackOk}
        autoHideDuration={2000}
        key={"success"}
      >
        <Alert
          onClose={handleCloseSnackOk}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {okMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProviderTable;
