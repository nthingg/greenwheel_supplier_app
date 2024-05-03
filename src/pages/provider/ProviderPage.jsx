import { Link } from "react-router-dom";
import "../../assets/scss/providers.scss";
import "../../assets/scss/header.scss";
import "../../assets/scss/filter.scss";
import "../../assets/scss/shared.scss";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ProviderTable from "../../components/tables/ProviderTable";
import {
  LOAD_PROVIDERS_TOTAL,
  LOAD_PROVIDERS_TOTAL_INIT,
  LOAD_SUPPLIERS_FILTER,
  LOAD_NUMBERS_TOTAL,
  LOAD_NUMBER_TYPE,
} from "../../services/graphql/provider";
import { IconButton } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import BuildIcon from "@mui/icons-material/Build";
import Slider from "react-slick";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import { type } from "@testing-library/user-event/dist/type";

const ProviderPage = () => {
  const suppType = [
    "EMERGENCY",
    "FOOD_STALL",
    "GROCERY",
    "HOTEL",
    "MOTEL",
    "REPAIR",
    "RESTAURANT",
    // "TAXI",
    "VEHICLE_RENTAL",
  ];
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [selectStatus, setSelectedStatus] = useState(suppType);
  const [ememergency, setEmergency] = useState(0);
  const [foodStall, setFoodStall] = useState(0);
  const [grocery, setGrocery] = useState(0);
  const [hotel, setHotel] = useState(0);
  const [motel, setMotel] = useState(0);
  const [repair, setRepair] = useState(0);
  const [restaurant, setRestaurant] = useState(0);
  const [taxi, setTaxi] = useState(0);
  const [vehicleRental, setVehicleRental] = useState(0);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchTotalProvider(null);
    fetchProviderType(null);
  }, [])
  const handleClick = (index) => {
    setSelectedDiv(index);
    switch (index) {
      case 0:
        setSelectedStatus(suppType);
        break;
      case 1:
        setSelectedStatus([suppType[0]]);
        break;
      case 2:
        setSelectedStatus([suppType[1]]);
        break;
      case 3:
        setSelectedStatus([suppType[2]]);
        break;
      case 4:
        setSelectedStatus([suppType[3]]);
        break;
      case 5:
        setSelectedStatus([suppType[4]]);
        break;
      case 6:
        setSelectedStatus([suppType[5]]);
        break;
      case 7:
        setSelectedStatus([suppType[6]]);
        break;
      // case 8:
      //   setSelectedStatus([suppType[7]]);
      //   break;
      case 9:
        setSelectedStatus([suppType[7]]);
        break;
      default:
        break;
    }
    refetch();
  };

  const [totalProvider, setTotalProvider] = useState([]);
  const [getTotalProvider, { }] = useLazyQuery(LOAD_PROVIDERS_TOTAL);
  const [getTotalProviderInit, { }] = useLazyQuery(LOAD_PROVIDERS_TOTAL_INIT);
  const [getNumberProviderType, { }] = useLazyQuery(LOAD_NUMBER_TYPE);

  const fetchTotalProvider = async (searchTerm) => {
    const { data } = await getTotalProviderInit({
      variables: {
        searchTerm: searchTerm
      },
      fetchPolicy: "network-only"
    });
    let providerData = data.providers.edges;

    if (data.providers.pageInfo.hasNextPage === true) {
      let check = true;
      let currentEndCursor = data.providers.pageInfo.endCursor;
      while (check) {
        const { data: dataRefetch } = await getTotalProvider({
          variables: { cursor: currentEndCursor, searchTerm: searchTerm },
          fetchPolicy: "network-only"
        });

        providerData = providerData.concat(
          dataRefetch.providers.edges
        );

        if (dataRefetch.providers.pageInfo.hasNextPage === true) {
          currentEndCursor = dataRefetch.providers.pageInfo.endCursor;
        } else {
          check = false;
        }
      }
    }

    let res = providerData.map((node, index) => {
      const { __typename, ...rest } = node;
      return { ...rest, index: index + 1 }; // Add the index to the object
    });
    setTotalProvider(res);
    setIsLoading(false);
  }

  const fetchProviderType = async (searchTerm) => {
    suppType.forEach(async (type, index) => {
      const { data } = await getNumberProviderType({
        variables: {
          type: type,
          searchTerm: searchTerm
        },
        fetchPolicy: "network-only"
      });
      const totalCount = data.providers.totalCount;
      switch (index) {
        case 0: {
          setEmergency(totalCount);
          break;
        }
        case 1: {
          setFoodStall(totalCount);
          break;
        }
        case 2: {
          setGrocery(totalCount);
          break;
        }
        case 3: {
          setHotel(totalCount);
          break;
        }
        case 4: {
          setMotel(totalCount);
          break;
        }
        case 5: {
          setRepair(totalCount);
          break;
        }
        case 6: {
          setRestaurant(totalCount);
          break;
        }
        // case 7: {
        //   setTaxi(totalCount);
        //   break;
        // }
        case 7: {
          setVehicleRental(totalCount);
          break;
        }
      }
    });

    setIsLoading(false);
  }

  const { error, loading, data, refetch } = useQuery(LOAD_SUPPLIERS_FILTER, {
    variables: {
      status: selectStatus,
      searchTerm: searchTerm
    },
    fetchPolicy: "network-only"
  });
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    if (!loading && !error && data && data["providers"]["nodes"]) {
      let res = data.providers.nodes.map((node, index) => {
        const { __typename, ...rest } = node;
        return { ...rest, index: index + 1 }; // Add the index to the object
      });
      setSuppliers(res);
    }
  }, [data, loading, error]);

  const [totals, setTotals] = useState(0);
  const { error: errTotal, loading: loadTotal, data: dataTotal } = useQuery(LOAD_NUMBERS_TOTAL, {
    variables: {
      searchTerm: searchTerm
    }
  })
  useEffect(() => {
    if (!loadTotal && !errTotal && dataTotal && dataTotal["providers"]["totalCount"]) {
      setTotals(dataTotal.providers.totalCount);
    }
  }, [loadTotal, errTotal, dataTotal])

  const handleSearchSubmit = () => {
    setIsLoading(true);
    const searchTerm = document.getElementById('floatingValue').value;
    setSearchTerm(searchTerm);
    refetch();
    fetchTotalProvider(searchTerm);
    fetchProviderType(searchTerm);
  }

  var settings = {
    dots: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 2,
    centerPadding: "60px",
  };

  return (
    <div className="provider">
      <div className="shared-title">
        <div>
          <p className="title">Nhà cung cấp</p>
          <p className="sub-title">Danh sách nhà cung cấp</p>
        </div>
      </div>
      <div className="header">
        <div className="left">
          <input
            type="text"
            className={"form-control"}
            id="floatingValue"
            name="value"
            placeholder="Nhập tên nhà cung cấp..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
          />
          <button className="link" onClick={handleSearchSubmit}>
            <SearchIcon />
          </button>
        </div>
        <div className="right">
          <Link to="/providers/add" className="link">
            <AddCircleIcon />
            <span>Thêm nhà cung cấp</span>
          </Link>
          {/* <button className="link">
            <FilterAltIcon />
          </button> */}
          <button
            className="link"
            onClick={() => {
              setIsLoading(true);
              document.getElementById('floatingValue').value = "";
              setSearchTerm(null);
              refetch();
              fetchProviderType(null);
              fetchTotalProvider(null);
            }}
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
      <div className="supplierContainer">
        <div className="icon-row">
          <Slider {...settings}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 9].map((index) => (
              <div
                key={index}
                className={`icon-item ${selectedDiv === index ? "selected" : ""
                  }`}
                onClick={() => {
                  handleClick(index);
                }}
              >
                {/* Replace with appropriate icons */}
                {index === 0 && (
                  <FormatListBulletedIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 1 && <MedicalServicesIcon sx={{ color: "#aa3226" }} />}
                {index === 2 && <LocalDiningIcon sx={{ color: "#7f6d6b" }} />}
                {index === 3 && (
                  <StorefrontIcon sx={{ color: "#227d3a" }} />
                )}
                {index === 4 && <HotelIcon sx={{ color: "#3498DB" }} />}
                {index === 5 && (
                  <NightShelterIcon sx={{ color: "#3498DB" }} />
                )}
                {index === 6 && (
                  <BuildIcon sx={{ color: "#88939f" }} />
                )}
                {index === 7 && (
                  <RestaurantIcon sx={{ color: "#7f6d6b" }} />
                )}
                {/* {index === 8 && (
                  <LocalTaxiIcon sx={{ color: "#416f31" }} />
                )} */}
                {index === 9 && (
                  <TwoWheelerIcon sx={{ color: "#3498DB" }} />
                )}
                <span>
                  {index === 0 && `Tất cả (${totals})`}
                  {index === 1 && `Cứu hộ (${ememergency})`}
                  {index === 2 && `Quán ăn (${foodStall})`}
                  {index === 3 && `Tạp hóa (${grocery})`}
                  {index === 4 && `Khách sạn (${hotel})`}
                  {index === 5 && `Nhà nghỉ (${motel})`}
                  {index === 6 && `Tiệm sửa (${repair})`}
                  {index === 7 && `Nhà hàng (${restaurant})`}
                  {/* {index === 8 && `Taxi (${taxi})`} */}
                  {index === 9 && `Thuê xe (${vehicleRental})`}
                </span>
              </div>
            ))}
          </Slider>
        </div>
        {isLoading && (
          <div className="loading">
            <RestartAltIcon
              sx={{
                fontSize: 80,
                color: "#2c3d50",
              }}
            />
          </div>
        )}
        {!isLoading && selectedDiv === 0 &&
          <ProviderTable totalProviders={totalProvider} />}
        {!isLoading && selectedDiv !== 0 &&
          <ProviderTable providers={suppliers} />}
      </div>
    </div>
  );
};

export default ProviderPage;
