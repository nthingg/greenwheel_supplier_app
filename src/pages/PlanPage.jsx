import "../assets/scss/productPage.scss";
import "../assets/scss/planTable.scss";
import "../assets/scss/filter.scss";
import "../assets/scss/shared.scss";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOAD_PLANS_FILTER } from "../services/queries";
import PublicIcon from "@mui/icons-material/Public";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import { IconButton } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PlanTable from "../components/PlanTable";
import { Lock } from "@mui/icons-material";

const PlanPage = () => {
  const iconColors = ["info", "disable"];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(true);

  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedStatus(true);
        refetch();
        break;
      case 1:
        setSelectedStatus(false);
        refetch();
        break;
      default:
        break;
    }
  };

  const { error, loading, data, refetch } = useQuery(LOAD_PLANS_FILTER, {
    variables: {
      type: selectedStatus,
    },
  });

  const [plans, setPlans] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["plans"]["nodes"]) {
      let res = data.plans.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setPlans(res);
      console.log(res);
    }
  }, [data, loading, error]);

  return (
    <div className="product">
      <div className="sharedTitle">
        <p>Danh sách kế hoạch</p>
      </div>
      <div className="productContainer">
        <div className="tableHeader">
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
        <div className="icon-row">
          {[0, 1].map((index) => (
            <div
              key={index}
              className={`icon-item ${selectedDiv === index ? "selected" : ""}`}
              onClick={() => {
                handleClick(index);
              }}
            >
              <IconButton color={iconColors[index]}>
                {/* Replace with appropriate icons */}
                {index === 0 && <PublicIcon color="success" />}
                {index === 1 && <Lock color="success" />}
              </IconButton>
              <span>
                {index === 0 && "Công khai"}
                {index === 1 && "Riêng tư"}
              </span>
            </div>
          ))}
        </div>
        <PlanTable plans={plans} />
      </div>
    </div>
  );
};

export default PlanPage;
