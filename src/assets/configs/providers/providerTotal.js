import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Switch } from "@mui/material";

export const providerTotalColumns = [
    {
        field: "id",
        headerClassName: "prodHeader",
        width: 70,
        align: "center",
        headerAlign: "center",
        // renderCell: (params) => params.rowIndex + 1,
        renderHeader: () => <span>#</span>,
        renderCell: (params) => {
            return <div>{params.row.index}</div>;
        },
    },
    {
        field: "name",
        width: 300,
        renderCell: (params) => {
            return (
                // <div className="cellWithImg">
                //   <img className="cellImg" src={params.row.node.imageUrl} alt="avatar" />
                //   {params.row.node.name}
                // </div>
                <div>{params.row.node.name}</div>
            );
        },
        renderHeader: () => <span>TÊN</span>,
    },
    {
        field: "type",
        width: 150,
        renderCell: (params) => {
            const providerType = {
                "EMERGENCY": "Khẩn cấp",
                "FOOD_STALL": "Quán ăn",
                "GROCERY": "Tạp hóa",
                "HOTEL": "Khách sạn",
                "MOTEL": "Nhà nghỉ",
                "REPAIR": "Sửa xe",
                "RESTAURANT": "Nhà hàng",
                "TAXI": "Taxi",
                "VEHICLE_RENTAL": "Thuê xe",
            }

            return (
                <div>{providerType[params.row.node.type]}</div>
            );
        },
        renderHeader: () => <span>LOẠI DỊCH VỤ</span>,
    },
    {
        field: "phone",
        width: 200,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
            function formatPhoneNumberCen(phoneNumber) {
                // Replace leading "+84" with "0" (if present)
                phoneNumber = phoneNumber.replace(/^\84/, "0"); // Replace leading "+84" with "0"

                let formattedParts;
                switch (phoneNumber.length) {
                    case 9:
                        formattedParts = [
                            phoneNumber.slice(0, 3),
                            "*".repeat(4),
                            phoneNumber.slice(6),
                        ];
                        break;
                    case 10:
                        formattedParts = [
                            phoneNumber.slice(0, 3),
                            "*".repeat(4),
                            phoneNumber.slice(7),
                        ];
                        break;
                    case 11:
                        formattedParts = [
                            phoneNumber.slice(0, 3),
                            "*".repeat(4),
                            phoneNumber.slice(8),
                        ];
                        break;
                    default:
                        // Handle invalid lengths (optional)
                        return phoneNumber;
                }

                return formattedParts.join("");
            }

            if (params.row.node.phone !== null) {
                return (
                    <div>
                        <span className="itemValue">
                            {formatPhoneNumberCen(params.row.node.phone)}
                        </span>
                    </div>
                );
            } else {
                return <div>Không có</div>;
            }
        },
        renderHeader: () => <span>SĐT</span>,
    },
    // {
    //   field: "balance",
    //   width: 200,
    //   align: "right",
    //   headerAlign: "center",
    //   renderCell: (params) => {
    //     const formattedPrice = params.row.node.balance.toLocaleString("vi-VN") + "đ";
    //     return <div className="prodPrice">{formattedPrice}</div>;
    //   },
    //   renderHeader: () => <span>Số dư</span>,
    // },
    {
        field: "paymentType",
        width: 200,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
            if (params.row.node.account != null) {
                return (
                    <div className="cellWithStatus AVAILABLE">{<CheckCircleIcon />}</div>
                );
            } else {
                return (
                    <div className="cellWithStatus PERMANENT_STOP">{<CancelIcon />}</div>
                );
            }
        },
        renderHeader: () => <span>TRUY CẬP</span>,
    },
    {
        field: "status",
        headerName: "Trạng thái",
        width: 140,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
            let check = false;
            if (params.row.node.account !== null) {
                check = true;
            }
            return (
                <Switch
                    checked={params.row.node.isActive}
                    onChange={() => { }}
                    disabled={check}
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
            );
        },
        renderHeader: () => <span>TRẠNG THÁI</span>,
    },
];
