import "../assets/scss/accountPage.scss";
import "../assets/scss/filter.scss";
import "../assets/scss/shared.scss";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import { LOAD_ACCOUNTS_FILTER } from "../services/graphql/account";
import AccountTable from "../components/AccountTable";

const AccountPage = () => {
  const accountRole = ["TRAVELER", "SUPPLIER", "STAFF"];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(accountRole[0]);
  const [isVeriHidden, setIsVeriHidden] = useState(true);

  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedStatus(accountRole[0]);
        refetch();
        break;
      case 1:
        setSelectedStatus(accountRole[1]);
        refetch();
        break;
      case 2:
        setSelectedStatus(accountRole[2]);
        refetch();
        break;
      default:
        break;
    }
  };

  const { error, loading, data, refetch } = useQuery(LOAD_ACCOUNTS_FILTER, {
    variables: {
      role: selectedStatus,
    },
  });

  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["accounts"]["nodes"]) {
      let res = data.accounts.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setAccounts(res);
      console.log(res);
    }
  }, [data, loading, error]);

  return (
    <div className="account">
      <div className="sharedTitle">
        <div>
          <p className="title">Tài khoản</p>
          <p className="sub-title">Danh sách tài khoản</p>
        </div>
      </div>
      <div className="header">
        <div className="left">
          <input
            type="text"
            className={"form-control"}
            id="floatingValue"
            name="value"
            placeholder="Tìm kiếm ..."
          />
        </div>
        <div className="right">
          {/* <Link to="/products/new" className="link">
              <AddIcon />
              <span>Thêm dịch vụ</span>
            </Link> */}
          <button className="link">
            <span>Tải xuống file Excel</span>
            <CloudDownloadIcon />
          </button>
          <button className="link">
            <FilterAltIcon />
          </button>
          <button
            className="link"
            onClick={() => {
              refetch();
            }}
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
      <div className="accountContainer">
        <div className="icon-row ic-r-ml">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`icon-item ${selectedDiv === index ? "selected" : ""}`}
              onClick={() => {
                handleClick(index);
              }}
            >
              {/* Replace with appropriate icons */}
              {index === 0 && <PersonRoundedIcon sx={{ color: "#3498DB" }} />}
              {index === 1 && (
                <StorefrontRoundedIcon sx={{ color: "#3498DB" }} />
              )}
              {index === 2 && (
                <ManageAccountsRoundedIcon sx={{ color: "#3498DB" }} />
              )}
              <span>
                {index === 0 && "Nhà du lịch"}
                {index === 1 && "Nhà cung cấp"}
                {index === 2 && "Quản lý"}
              </span>
            </div>
          ))}
        </div>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={"happening"}
            sx={{ marginBottom: 2, marginLeft: 2 }}
            hidden={isVeriHidden}
            onClick={(e) => {
              // handleClick(3);
              // setSelectedDiv(3);
              // setRegisterVeriStatus(e.target.value);
            }}
          >
            <FormControlLabel
              value="happening"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label="Đang diễn ra"
            />
            <FormControlLabel
              value="ended"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label="Kết thúc"
            />
          </RadioGroup>
        </FormControl>
        {selectedStatus === "TRAVELER" && <AccountTable travelers={accounts} />}
        {selectedStatus === "SUPPLIER" && <AccountTable suppliers={accounts} />}
        {selectedStatus === "STAFF" && <AccountTable staffs={accounts} />}
      </div>
    </div>
  );
};

export default AccountPage;
