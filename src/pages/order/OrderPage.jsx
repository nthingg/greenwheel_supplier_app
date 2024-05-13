//scss
import "../../assets/scss/transactionPage.scss";
import "../../assets/scss/header.scss";
import "../../assets/scss/filter.scss";
import "../../assets/scss/shared.scss";
//icon
import OrderTable from "../../components/tables/OrderTable";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import PaidIcon from "@mui/icons-material/Paid";
import DescriptionIcon from "@mui/icons-material/Description";
//graphql
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import FilterModal from "../../components/others/OrderFilterModal";
import client from "../../services/apollo/config";
import { FormatListBulleted } from "@mui/icons-material";

const OrderPage = () => {
  const { sbs } = useParams();
  const orderStatus = [
    "RESERVED",
    "PREPARED",
    "SERVED",
    "FINISHED",
    "COMPLAINED",
    "CANCELLED",
  ];
  const [selectedDiv, setSelectedDiv] = useState(sbs ? parseInt(sbs, 10) : 0);
  const [selectStatus, setSelectedStatus] = useState(
    sbs ?  orderStatus[parseInt(sbs, 10) - 1] : orderStatus
  );
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [providerId, setProviderId] = useState(null);
  //status count
  const [total, setTotal] = useState(0);
  const [reserved, setReserved] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [prep, setPrep] = useState(0);
  const [complained, setComplained] = useState(0);
  const [fin, setFin] = useState(0);
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    fetchOrderStatus();
    fetchOrder(sbs ? orderStatus[parseInt(sbs, 10) - 1] : `[${orderStatus}]`);
  }, []);

  const handleClick = (index) => {
    setSelectedDiv(index);
    setIsLoading(true);
    switch (index) {
      case 0:
        setSelectedStatus(orderStatus);
        fetchOrder(`[${orderStatus}]`, searchTerm, providerId);
        break;
      case 1:
        setSelectedStatus([orderStatus[0]]);
        fetchOrder([orderStatus[0]], searchTerm, providerId);
        break;
      case 2:
        setSelectedStatus([orderStatus[1]]);
        fetchOrder([orderStatus[1]], searchTerm, providerId);
        break;
      case 3:
        setSelectedStatus([orderStatus[2]]);
        fetchOrder([orderStatus[2]], searchTerm, providerId);
        break;
      case 4:
        setSelectedStatus([orderStatus[3]]);
        fetchOrder([orderStatus[3]], searchTerm, providerId);
        break;
      case 5:
        setSelectedStatus([orderStatus[4]]);
        fetchOrder([orderStatus[4]], searchTerm, providerId);
        break;
      case 6:
        setSelectedStatus([orderStatus[5]]);
        fetchOrder([orderStatus[5]], searchTerm, providerId);
        break;
      default:
        break;
    }
  };

  const queryOrderInit = async (statusQuery, searchQuery, providerQuery) => {
    console.log(`
    query LoadOrdersInit {
      orders(
        first: 100
        order: { id: DESC }
        where: { 
          ${statusQuery}
          ${searchQuery}
          ${providerQuery}
        }
      ) {
        edges {
          node {
            id
            total
            currentStatus
            createdAt
            traces {
              status
              modifiedAt
            }
            provider {
              name
              account {
                id
              }
            }
            account {
              name
              phone
              avatarPath
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }`)
    const query = gql`
      query LoadOrdersInit {
        orders(
          first: 100
          order: { id: DESC }
          where: { 
            ${statusQuery}
            ${searchQuery}
            ${providerQuery}
          }
        ) {
          edges {
            node {
              id
              total
              currentStatus
              createdAt
              traces {
                status
                modifiedAt
              }
              provider {
                name
                account {
                  id
                }
              }
              account {
                name
                phone
                avatarPath
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `

    try {
      const result = await client.query({ query, fetchPolicy: "network-only" });
      return result.data;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClickSnackBar();
      localStorage.removeItem("errorMsg");
    }
  }

  const queryOrder = async (cursor, statusQuery, searchQuery, providerQuery) => {
    const query = gql`
      query LoadOrders {
        orders(
          first: 100
          after: "${cursor}"
          order: { id: DESC }
          where: { 
            ${statusQuery}
            ${searchQuery}
            ${providerQuery}
          }
        ) {
          edges {
            node {
              id
              total
              currentStatus
              createdAt
              traces {
                status
                modifiedAt
              }
              provider {
                name
                account {
                  id
                }
              }
              account {
                name
                phone
                avatarPath
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `

    try {
      const result = await client.query({ query, fetchPolicy: "network-only" });
      return result.data;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClickSnackBar();
      localStorage.removeItem("errorMsg");
    }
  }

  const countOrder = async (status, searchQuery, providerQuery) => {
    const query = gql`
      query LoadOrdersInit {
        orders(
          first: 100
          order: { id: DESC }
          where: { 
            currentStatus: { in: ${status} }
            ${searchQuery}
            ${providerQuery}
          }
        ) {
          totalCount
        }
      }
    `

    try {
      const result = await client.query({ query, fetchPolicy: "network-only" });
      return result.data;
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      // setErrMsg(msg);
      // handleClickSnackBar();
      localStorage.removeItem("errorMsg");
    }
  }

  // const [getOrderInit, {}] = useLazyQuery(LOAD_ORDERS_FILTER_INIT, {
  //   fetchPolicy: "no-cache",
  // });
  // const [getOrder, {}] = useLazyQuery(LOAD_ORDERS_FILTER, {
  //   fetchPolicy: "no-cache",
  // });
  // const [search, {}] = useLazyQuery(LOAD_ORDERS_FILTER_SEARCH, {
  //   fetchPolicy: "no-cache",
  // });
  // const [getOrderStatus, { }] = useLazyQuery(LOAD_NUMBERS_ORDERS, {
  //   fetchPolicy: "no-cache",
  // });

  const fetchOrder = async (selectStatus, searchId, providerId) => {
    let statusQuery = `currentStatus: { in: ${selectStatus} }`;
    let searchQuery = "";
    let providerQuery = "";
    if (searchId) {
      searchQuery = `id: { eq: ${searchId} }`;
    }
    if (providerId) {
      console.log(providerId);
      providerQuery = `providerId: { eq: ${providerId} }`
    }
    const data = await queryOrderInit(statusQuery, searchQuery, providerQuery);
    let ordersData = data.orders.edges;

    if (data.orders.pageInfo.hasNextPage === true) {
      let check = true;
      let currentEndCursor = data.orders.pageInfo.endCursor;
      while (check) {
        const dataRefetch = await queryOrder(currentEndCursor, statusQuery, searchQuery, providerQuery)

        ordersData = ordersData.concat(dataRefetch.orders.edges);

        if (dataRefetch.orders.pageInfo.hasNextPage === true) {
          currentEndCursor = dataRefetch.orders.pageInfo.endCursor;
        } else {
          check = false;
        }
      }
    }

    let res = ordersData.map((node, index) => {
      const { __typename, ...rest } = node;
      return { ...rest, index: index + 1 }; // Add the index to the object
    });
    setOrders(res);
    setIsLoading(false);
  };

  const fetchOrderStatus = async (searchId, providerId) => {
    let searchQuery = "";
    let providerQuery = "";
    if (searchId) {
      searchQuery = `id: { eq: ${searchId} }`;
    }
    if (providerId) {
      providerQuery = `providerId: { eq: ${providerId} }`
    }
    const data = await countOrder(`[${orderStatus}]`, searchQuery, providerQuery);
    setTotal(data.orders.totalCount);
    orderStatus.forEach(async (status, index) => {
      const data = await countOrder(status, searchQuery, providerQuery);
      const totalCount = data.orders.totalCount;
      switch (index) {
        case 0: {
          setReserved(totalCount);
          break;
        }
        case 1: {
          setPrep(totalCount);
          break;
        }
        case 2: {
          setTemp(totalCount);
          break;
        }
        case 3: {
          setFin(totalCount);
          break;
        }
        case 4: {
          setComplained(totalCount);
          break;
        }
        case 5: {
          setCancelled(totalCount);
          break;
        }
      }
    });
  };

  // const searchOrder = async (selectStatus, searchTerm) => {
  //   const { data } = await search({
  //     variables: {
  //       status: selectStatus,
  //       id: searchTerm,
  //     },
  //   });

  //   const orders = data.orders.edges;

  //   let res = orders.map((node, index) => {
  //     const { __typename, ...rest } = node;
  //     return { ...rest, index: index + 1 };
  //   });

  //   setOrders(res);
  //   setIsLoading(false);
  //   return res;
  // };
  //
  // const {
  //   error: errReserve,
  //   loading: loadingReserve,
  //   data: dataReserve,
  //   refetch: refetchReserve,
  // } = useQuery(LOAD_NUMBERS_RESERVED);
  // useEffect(() => {
  //   if (
  //     !loadingReserve &&
  //     !errReserve &&
  //     dataReserve &&
  //     dataReserve["orders"]
  //   ) {
  //     setReserved(dataReserve["orders"].totalCount);
  //   }
  // }, [dataReserve, loadingReserve, errReserve, searchTerm]);
  //
  // const {
  //   error: errorCancelled,
  //   loading: loadingCancelled,
  //   data: dataCancelled,
  //   refetch: refetchCancelled,
  // } = useQuery(LOAD_NUMBERS_CANCELLED);
  // useEffect(() => {
  //   if (
  //     !loadingCancelled &&
  //     !errorCancelled &&
  //     dataCancelled &&
  //     dataCancelled["orders"]
  //   ) {
  //     setCancelled(dataCancelled["orders"].totalCount);
  //   }
  // }, [dataCancelled, loadingCancelled, errorCancelled, searchTerm]);

  // const {
  //   error: errorPrep,
  //   loading: loadingPrep,
  //   data: dataPrep,
  //   refetch: refetchPrep,
  // } = useQuery(LOAD_NUMBERS_PREPARED);
  // useEffect(() => {
  //   if (!loadingPrep && !errorPrep && dataPrep && dataPrep["orders"]) {
  //     setPrep(dataPrep["orders"].totalCount);
  //   }
  // }, [dataPrep, loadingPrep, errorPrep, searchTerm]);

  // const {
  //   error: errorComplained,
  //   loading: loadingComplained,
  //   data: dataComplained,
  //   refetch: refetchComplained,
  // } = useQuery(LOAD_NUMBERS_COMPLAINED);
  // useEffect(() => {
  //   if (
  //     !loadingComplained &&
  //     !errorComplained &&
  //     dataComplained &&
  //     dataComplained["orders"]
  //   ) {
  //     setComplained(dataComplained["orders"].totalCount);
  //   }
  // }, [dataComplained, loadingComplained, errorComplained, searchTerm]);

  // const {
  //   error: errorFin,
  //   loading: loadingFin,
  //   data: dataFin,
  //   refetch: refetchFin,
  // } = useQuery(LOAD_NUMBERS_FINISHED);
  // useEffect(() => {
  //   if (!loadingFin && !errorFin && dataFin && dataFin["orders"]) {
  //     setFin(dataFin["orders"].totalCount);
  //   }
  // }, [dataFin, loadingFin, errorFin, searchTerm]);

  // const {
  //   error: errorTemp,
  //   loading: loadingTemp,
  //   data: dataTemp,
  //   refetch: refetchTemp,
  // } = useQuery(LOAD_NUMBERS_SERVED);
  // useEffect(() => {
  //   if (!loadingTemp && !errorTemp && dataTemp && dataTemp["orders"]) {
  //     setTemp(dataTemp["orders"].totalCount);
  //   }
  // }, [dataTemp, loadingTemp, errorTemp, searchTerm]);

  // const { error, loading, data, refetch } = useQuery(orderQuery, {
  //   variables: {
  //     status: selectStatus,
  //     id: searchTerm,
  //   },
  // });
  // useEffect(() => {
  //   if (!loading && !error && data.orders && data.orders.nodes) {
  //     let res = data.orders.nodes.map((node, index) => {
  //       const { __typename, ...rest } = node;
  //       return { ...rest, index: index + 1 }; // Add the index to the object
  //     });
  //     setOrders(res);
  //   }
  // }, [data, loading, error]);

  const handleSearchSubmit = async () => {
    setIsLoading(true);
    const searchTerm = document.getElementById("floatingValue").value;
    if (!searchTerm) {
      setIsLoading(false);
      return;
    }
    if (!isNaN(searchTerm)) {
      const searchTermInt = parseInt(searchTerm, 10);
      setSearchTerm(searchTermInt);
      fetchOrder(`[${selectStatus}]`, searchTermInt, providerId);
      fetchOrderStatus(searchTermInt, providerId);
    } else {
      fetchOrder(`[${selectStatus}]`, "", providerId);
      fetchOrderStatus("", providerId);
    }
  };

  // const changeCount = (status) => {
  //   setReserved(0);
  //   setPrep(0);
  //   setCancelled(0);
  //   setTemp(0);
  //   setComplained(0);
  //   setFin(0);
  //   if (status) {
  //     switch (status) {
  //       case "RESERVED": {
  //         setReserved(1);
  //         break;
  //       }
  //       case "PREPARED": {
  //         setPrep(1);
  //         break;
  //       }
  //       case "SERVED": {
  //         setTemp(1);
  //         break;
  //       }
  //       case "FINISHED": {
  //         setFin(1);
  //         break;
  //       }
  //       case "COMPLAINED": {
  //         setComplained(1);
  //         break;
  //       }
  //       case "CANCELLED": {
  //         setCancelled(1);
  //         break;
  //       }
  //     }
  //   }
  // };

  var settings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 2,
    centerPadding: "60px",
  };

  const handleModalSubmit = async (providerId) => {
    setIsLoading(true);
    if (!providerId) {
      setIsLoading(false);
      return;
    }
    console.log(providerId)
    fetchOrderStatus(searchTerm, providerId)
    fetchOrder(`[${selectStatus}]`, searchTerm, providerId);
  }

  return (
    <div className="transaction">
      <div className="shared-title">
        <div>
          <p className="title">Đơn hàng</p>
          <p className="sub-title">Danh sách đơn hàng</p>
        </div>
      </div>
      <div className="header">
        <div className="left">
          <input
            type="text"
            className={"form-control"}
            id="floatingValue"
            name="value"
            placeholder="Nhập mã đơn hàng..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
          />
          <button
            className="link"
            onClick={() => {
              handleSearchSubmit();
            }}
          >
            <SearchIcon />
          </button>
        </div>
        <div className="right">
          <FilterModal providerId={providerId} setProviderId={setProviderId} handleModalSubmit={handleModalSubmit} />
          {/* <button className="link">
            <CloudDownloadIcon />
          </button> */}
          <button
            className="link"
            onClick={() => {
              setIsLoading(true);
              setSearchTerm(null);
              document.getElementById("floatingValue").value = "";
              setProviderId(null);
              fetchOrderStatus();
              fetchOrder(`[${selectStatus}]`);
            }}
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
      <div className="transactionContainer">
        <div className="icon-row">
          <Slider {...settings}>
            {[0, 1, 2, 3, 4, 5, 6].map((index) => (
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
                  <FormatListBulleted sx={{ color: "#3498DB" }} />
                )}
                {index === 1 && <DescriptionIcon sx={{ color: "#3498DB" }} />}
                {index === 2 && <MicrowaveIcon sx={{ color: "#F1C40F" }} />}
                {index === 3 && <CheckCircleIcon sx={{ color: "#28b463" }} />}
                {index === 4 && <PaidIcon sx={{ color: "#28b463" }} />}
                {index === 5 && <FeedbackIcon sx={{ color: "#3498DB" }} />}
                {index === 6 && <CancelIcon sx={{ color: "#e74c3c" }} />}
                <span>
                  {index === 0 && `Tất cả (${total})`}
                  {index === 1 && `Đã đặt (${reserved})`}
                  {index === 2 && `Chuẩn bị (${prep})`}
                  {index === 3 && `Phục vụ (${temp})`}
                  {index === 4 && `Hoàn tất (${fin})`}
                  {index === 5 && `Bị phản ánh (${complained})`}
                  {index === 6 && `Bị hủy (${cancelled})`}
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
        {!isLoading && selectedDiv === 0 && <OrderTable orderTotal={orders} />}
        {!isLoading && selectedDiv !== 0 && <OrderTable orders={orders} />}
      </div>
    </div>
  );
};

export default OrderPage;
