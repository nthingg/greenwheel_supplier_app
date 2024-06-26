import { FileUpload } from "@mui/icons-material";
import { useState } from "react";
import { Snackbar, Alert, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import { useMutation } from "@apollo/client";
import { IMPORT_PROVIDERS_EXCEL } from "../../services/graphql/provider";

export default function ProviderImportExcel({ refetch, fetchProviderType, fetchTotalProvider }) {
    const [vertical] = useState("top");
    const [horizontal] = useState("right");
    const [errorMsg, setErrMsg] = useState(false);
    const [successMsg, setSucessMsg] = useState(false);
    const [snackBarErrorOpen, setsnackBarErrorOpen] = useState(false);
    const [snackBarSuccessOpen, setsnackBarSucessOpen] = useState(false);
    const [add] = useMutation(IMPORT_PROVIDERS_EXCEL);

    const openErrorSnackBar = () => {
        setsnackBarErrorOpen(true);
    };

    const openSuccessSnackBar = () => {
        setsnackBarSucessOpen(true);
    };

    const handleCloseSnack = () => {
        setsnackBarErrorOpen(false);
        setsnackBarSucessOpen(false);
    };

    const validateImportData = (data, index) => {
        const minNameLength = 6;
        const maxNameLength = 40;
        const minStandard = 1;
        const maxStandard = 5;
        const phoneFormat = new RegExp("^84[0-9]{9}$");
        const addressMinLength = 20;
        const addressMaxLength = 120;
        const type = ["EMERGENCY", "FOOD_STALL", "GROCERY", "HOTEL", "MOTEL", "REPAIR", "RESTAURANT", "VEHICLE_RENTAL"];
        const requireStandardType = ["RESTAURANT", "HOTEL"];
        const validImageSource = "https://d38ozmgi8b70tu.cloudfront.net";
        let errorMsg = "Lỗi tại dòng " + (index + 1) + ":\n";
        let result = true;

        if (!data.name ||
            data.name.length < minNameLength ||
            data.name.length > maxNameLength) {
            errorMsg += `Tên không hợp lệ! Tên không được để trống và độ dài cho phép từ ${minNameLength} tới ${maxNameLength}!\n`;
        }

        if (!data.phone ||
            !phoneFormat.test(data.phone)) {
            errorMsg += `Số điện thoại không hợp lệ! Số điện thoại phải có định dạng 84xxxxxxxxx!\n`;
        }

        if (!data.address ||
            data.address.length < addressMinLength ||
            data.address.length > addressMaxLength) {
            errorMsg += `Địa chỉ không hợp lệ! Địa chỉ không được để trống và độ dài cho phép từ ${addressMinLength} tới ${addressMaxLength}!\n`;
        }

        if (!data.type ||
            !type.some((t) => t.includes(data.type))) {
            errorMsg += `Loại dịch vụ không hợp lệ!\n`;
        } else if (requireStandardType.some((t) => t.includes(data.type))) {
            if (!data.standard ||
                data.standard < minStandard ||
                data.standard > maxStandard) {
                errorMsg += `Tiêu chuẩn không không hợp lệ! Loại dịch vụ này yêu cầu phải có tiêu chuẩn và chỉ cho phép từ ${minStandard} tới ${maxStandard}!\n`;
            }
        } else {
            if (data.standard) {
                errorMsg += `Loại dịch vụ này không được phép có tiêu chuẩn!\n`;
            }
        }

        if (!data.imageUrl ||
            !data.imageUrl.startsWith(validImageSource)) {
            errorMsg += `Đường dẫn ảnh không hợp lệ! Đường dẫn ảnh không được để trống và phải từ nguồn hợp lệ!\n`;
        }

        if (errorMsg !== "Lỗi tại dòng " + (index + 1) + ":\n") {
            setErrMsg(errorMsg);
            setsnackBarErrorOpen(true);
            result = false;
          }
      
          return result;
    }

    const handleImportExcel = (e) => {
        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onload = async (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet);

                const importData = [];
                parsedData.forEach((value) => {
                    importData.push({
                        address: value.Address,
                        coordinate: [value.Longitude, value.Latitude],
                        imageUrl: value.ImageUrl,
                        name: value.Name,
                        phone: value.Phone.toString(),
                        standard: value.Standard,
                        type: value.Type,
                    });
                });

                let isValidData = true;

                for (let i = 0; i < importData.length; i++) {
                    if (!validateImportData(importData[i], i)) {
                        isValidData = false;
                        break;
                    }
                }

                if (isValidData) {
                    await add({
                        variables: {
                            dto: importData,
                        },
                    });

                    setSucessMsg("Thêm thành công!");
                    openSuccessSnackBar();
                    refetch();
                    fetchProviderType(null);
                    fetchTotalProvider(null);
                }

                document.getElementById("upload-excel").value = "";
            };
        } catch (error) {
            document.getElementById("upload-excel").value = "";
            console.log(error);
            const msg = localStorage.getItem("errorMsg");
            setErrMsg(msg);
            openErrorSnackBar();
            localStorage.removeItem("errorMsg");
        }
    };

    return (
        <div>
            <input
                type="file"
                id="upload-excel"
                accept=".xlsx, .xls"
                onChange={handleImportExcel}
                hidden
            />
            <label
                htmlFor="upload-excel"
                className="link"
                style={{ marginLeft: "10px" }}
                onChange={handleImportExcel}
            >
                <FileUpload />
            </label>

            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={snackBarErrorOpen}
                onClose={handleCloseSnack}
                autoHideDuration={2000}
                key={vertical + horizontal + "error"}
            >
                <Alert
                    onClose={handleCloseSnack}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    <Typography whiteSpace="pre-line">{errorMsg}</Typography>
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={snackBarSuccessOpen}
                onClose={handleCloseSnack}
                autoHideDuration={2000}
                key={vertical + horizontal + "success"}
            >
                <Alert
                    onClose={handleCloseSnack}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {successMsg}
                </Alert>
            </Snackbar>
        </div>
    )
}