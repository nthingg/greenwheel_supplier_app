import { useState } from "react";
import "../../assets/scss/transactionDetail.scss";
import "../../assets/scss/shared.scss";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Typography,
  AppBar,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function OrderCancelDialog({
  open,
  setOpen,
  setReason,
  setMainReason,
  handleTravelerCancelClose,
  handleProviderCancelClose,
  sendCancelOtp,
}) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle backgroundColor={"#2c3d50"} color={"white"}>
        Xác nhận hủy đơn
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: 500 }}>
          <AppBar position="static">
            <Tabs
              value={tabValue}
              onChange={handleChange}
              // indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                border: "none",
              }}
            >
              <Tab label="Phượt thủ hủy đơn" {...a11yProps(0)} />
              <Tab label="Nhà cung cấp hủy đơn" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={tabValue} index={0} dir={theme.direction}>
            <DialogContentText style={{ padding: "20px 0 10px 0" }}>
              Gửi OTP cho phượt thủ để xác nhận việc hủy đơn:
            </DialogContentText>
            <div className="otp-field">
              <TextField
                autoFocus
                margin="dense"
                id="otp"
                name="otp"
                label="Nhập OTP"
                type="text"
                size="small"
                sx={{
                  width: "70%",
                }}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              />
              <button
                className="otp-btn"
                onClick={sendCancelOtp}
                style={{ cursor: "pointer" }}
              >
                Gửi OTP
              </button>
            </div>

            <DialogContentText style={{ padding: "20px 0 10px 0" }}>
              Nhà cung cấp có thể đưa thêm nguyên nhân hủy bỏ.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="reason"
              name="reason"
              label="Nguyên nhân khác"
              type="text"
              size="small"
              fullWidth
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
            <DialogActions>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  const otp = document.getElementById("otp").value;
                  handleTravelerCancelClose(otp);
                }}
              >
                Xác nhận
              </Button>
            </DialogActions>
          </TabPanel>
          <TabPanel value={tabValue} index={1} dir={theme.direction}>
            <DialogContentText style={{ padding: "20px 0 10px 0" }}>
              Hãy cung cấp nguyên nhân hủy đơn của bạn:
            </DialogContentText>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                defaultValue="Hết hàng"
                onChange={(e) => {
                  setMainReason(e.target.value);
                }}
              >
                <FormControlLabel
                  value="Hết hàng"
                  control={<Radio />}
                  label="Hết hàng"
                />
                <FormControlLabel
                  value="Thời gian nhận hàng quá lâu/sớm"
                  control={<Radio />}
                  label="Thời gian nhận hàng quá lâu/sớm"
                />
                <FormControlLabel
                  value="Cửa hàng đóng cửa"
                  control={<Radio />}
                  label="Cửa hàng đóng cửa"
                />
                <FormControlLabel
                  value="Không liên hệ được với khách"
                  control={<Radio />}
                  label="Không liên hệ được với khách"
                />
                <FormControlLabel
                  value="Nghi vấn lừa đảo"
                  control={<Radio />}
                  label="Nghi vấn lừa đảo"
                />
              </RadioGroup>
            </FormControl>
            <DialogContentText style={{ padding: "20px 0 10px 0" }}>
              Nguyên nhân khác:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="reason"
              name="reason"
              label="Chi tiết"
              type="text"
              size="small"
              fullWidth
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
            <DialogActions>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleProviderCancelClose}>Xác nhận</Button>
            </DialogActions>
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default OrderCancelDialog;
