import { useEffect, useState } from "react";
import "../assets/scss/emulator.scss";
import "../assets/scss/shared.scss";
import Select from "react-select";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { FILTER_AVAILABLE_TRAVELER, LOAD_PLANS } from "../services/queries";
import { useMutation, useQuery } from "@apollo/client";
import { TextField } from "@mui/material";
import { JOIN_PLAN_SIMULATOR } from "../services/mutations";

const EmulatorPage = () => {
  const [plansOptions, setPlansOptions] = useState([]);
  const [listResponse, setListResponse] = useState([]);
  const [listPlan, setListPlan] = useState([]);
  const [numberJoin, setNumberJoin] = useState(0);
  const [isNumberDisabled, setIsNumberDisabled] = useState(true);
  const [isPlanDisabled, setIsPlanDisabled] = useState(true);
  const [emulatorStatus, setEmulatorStatus] = useState(false);
  const [currentTraveler, setCurrentTraveler] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [listMember, setListMember] = useState([]);
  const [listAvailable, setListAvailable] = useState([]);

  const emulatorOptions = [
    { value: 1, label: "Thêm 10 traveler vào plan chỉ định." },
    { value: 2, label: "Thêm 10 plan với địa chỉ chỉ định." },
  ];

  const {
    error: plansError,
    loading: plansLoading,
    data: plansData,
    refetch: plansRefect,
  } = useQuery(LOAD_PLANS);

  const [join, { data, loading }] = useMutation(JOIN_PLAN_SIMULATOR, {
    onError: (error) => {
      console.error("Mutation error:", error);
      const errorMessage =
        error?.graphQLErrors?.[0]?.message || "Something went wrong.";
      console.log(errorMessage);
      let list = listResponse.slice(); // Create a shallow copy of the array
      list.push(currentTraveler.account.name + " tham gia kế hoạch thất bại!");
      setListResponse(list);
      // Handle the error as needed
    },
  });

  const {
    error: filterError,
    loading: filterLoading,
    data: filterData,
    refetch: filterRefect,
  } = useQuery(FILTER_AVAILABLE_TRAVELER, {
    variables: {
      ids: listMember,
    },
  });

  useEffect(() => {
    if (!loading && data) {
      let list = listResponse.slice(); // Create a shallow copy of the array
      list.push(
        currentTraveler.account.name + " tham gia kế hoạch thành công!"
      );
      setListResponse(list);
      console.log(listResponse);
    }
  }, [data, loading]);

  useEffect(() => {
    if (
      !plansLoading &&
      !plansError &&
      plansData &&
      plansData["plans"] &&
      plansData["plans"]["nodes"]
    ) {
      const options = plansData["plans"]["nodes"].map(
        ({ id, status, memberLimit, joinMethod, members }) => ({
          value: id,
          label: `ID: ${id}, ${status}, limit: ${memberLimit}, ${joinMethod}, current: ${members.length}`,
        })
      );
      setPlansOptions(options);
      setListPlan(plansData["plans"]["nodes"]);
    }
  }, [plansData, plansLoading, plansError]);

  useEffect(() => {
    if (
      !filterLoading &&
      !filterError &&
      filterData &&
      filterData["travelers"] &&
      filterData["travelers"]["nodes"]
    ) {
      //   console.log(filterData["travelers"]["nodes"]);
      setListAvailable(filterData["travelers"]["nodes"]);
    }
  }, [filterData, filterLoading, filterError]);

  //   console.log(listResponse);

  return (
    <div className="emulator">
      <div className="sharedTitle">
        <p>Giả lập hệ thống</p>
      </div>
      <div className="emulatorContainer">
        <div className="emulatorTitle">
          <p>Chi tiết</p>
        </div>
        <div className="details">
          <Select
            placeholder={"Chọn loại giả lập"}
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            name="color"
            options={emulatorOptions}
            onChange={(e) => {
              if (e != null) {
                plansRefect();
                setIsPlanDisabled(false);
              } else {
                setIsPlanDisabled(true);
              }
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#58D68D",
                primary: "#28B463",
              },
            })}
          />
          <div className="option">
            <div className="left">
              <Select
                placeholder={"Chọn plan có sẵn"}
                className="basic-single"
                classNamePrefix="select"
                isDisabled={isPlanDisabled}
                isClearable={true}
                name="color"
                options={plansOptions}
                onChange={(e) => {
                  if (e != null) {
                    setCurrentPlan(e.value);
                    setIsNumberDisabled(false);
                    setEmulatorStatus(true);
                    setNumberJoin(10);
                  } else {
                    setIsNumberDisabled(true);
                    setEmulatorStatus(false);
                    setNumberJoin(0);
                  }
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#58D68D",
                    primary: "#28B463",
                  },
                })}
              />
            </div>
            <div className="right">
              <TextField
                disabled={isNumberDisabled}
                id="outlined-disabled"
                label="Số người"
                type="number"
                defaultValue={10}
                placeholder="Nhập số người tham gia"
                size="small"
                onChange={(e) => {
                  if (e.target.value <= 0) {
                    setEmulatorStatus(false);
                  } else {
                    setNumberJoin(e.target.value);
                    setEmulatorStatus(true);
                  }
                }}
              />
            </div>
          </div>
          <button
            className={emulatorStatus ? "link" : "linkDisabled"}
            onClick={() => {
              const plan = listPlan.find((plan) => plan.id == currentPlan);
              const listTravelerId = plan.members.map(
                ({ travelerId }) => travelerId
              );
              setListMember(listTravelerId);
              filterRefect();
              if (!filterLoading) {
                if (numberJoin <= filterData["travelers"]["nodes"].length) {
                  filterData["travelers"]["nodes"]
                    .slice(0, numberJoin)
                    .forEach((traveler) => {
                      setCurrentTraveler(traveler);
                      console.log(traveler.id);
                      console.log(currentPlan);
                      console.log(numberJoin);
                      try {
                        join({
                          variables: {
                            plan: parseInt(currentPlan),
                            traveler: parseInt(traveler.id),
                          },
                        });
                      } catch (e) {
                        console.log(e);
                      }
                    });
                } else {
                  filterData["travelers"]["nodes"].forEach((traveler) => {
                    setCurrentTraveler(traveler);
                    join({
                      variables: {
                        input: {
                          plan: parseInt(currentPlan),
                          traveler: parseInt(traveler.id),
                        },
                      },
                    });
                  });
                }
              }
            }}
            disabled={false}
          >
            <PlayArrowIcon /> <span>Chạy giả lập</span>
          </button>
          <div className="resultTable">
            <p className="title">Kết quả</p>
            <div className="body">
              {listResponse.map((response, index) => (
                <p key={index}>{response}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmulatorPage;
