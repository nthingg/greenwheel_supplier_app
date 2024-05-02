import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Select from "react-select";
import { FormLabel } from "@mui/material";
import { useQuery } from "@apollo/client";
import "../../assets/scss/dialog-filter.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 430,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function FilterModal({
  filterOrder,
  handleChangeFilter,
  accountId,
  setAccountId,
  handleModalSubmit,
}) {
  const [open, setOpen] = React.useState(false);
  const [travelersOptions, setOptions] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

//   const { data, loading, error } = useQuery(LOAD_ACCOUNT_TRAVELERS_OPTIONS);

//   React.useEffect(() => {
//     if (!loading && !error && data && data["accounts"]["nodes"]) {
//       let res = data.accounts.nodes.map((account, index) => {
//         const phoneFormatted = account.phone.toString();
//         return {
//           value: account.id,
//           label: `${index + 1}. ${account.name} - 0${phoneFormatted.substring(2).replace(/(\d{3})\d*(\d{3})/, '$1****$2')}`,
//         };
//       });
//       setOptions(res);
//     }
//   }, [data, loading, error]);

  return (
    <div>
      <button className="link" onClick={handleOpen}>
        <FilterAltIcon />
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Bộ Lọc
          </Typography>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "2rem",
            }}
          >
            <FormControl>
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                className="label-filter"
              >
                Đơn hàng
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={filterOrder}
                onChange={(e) => {
                  handleChangeFilter(e);
                }}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="Tất cả"
                />
                <FormControlLabel
                  value="haveOrders"
                  control={<Radio />}
                  label="Có đơn hàng"
                />
                <FormControlLabel
                  value="noOrders"
                  control={<Radio />}
                  label="Không có đơn hàng"
                />
              </RadioGroup>
            </FormControl>
          </div> */}
          <div style={{ marginTop: "1rem" }}>
            <FormLabel className="label-filter">Tên nhà cung cấp</FormLabel>
            <Select
              placeholder={"Không có dữ liệu"}
              className="basic-single"
              id="traveler-id-select"
              classNamePrefix="select"
              isDisabled={false}
              isClearable={true}
              name="account"
              options={[]}
            //   onChange={async (e) => {
            //     if (e) {
            //       setAccountId(e.value);
            //     } else {
            //       setAccountId(null);
            //     }
            //   }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#2c3d50",
                },
              })}
            />
          </div>
          <button
            className="btn-modal-filter"
            onClick={() => {
            //   handleModalSubmit(filterOrder, accountId);
            //   handleClose();
            }}
          >
            Tìm kiếm
          </button>
        </Box>
      </Modal>
    </div>
  );
}