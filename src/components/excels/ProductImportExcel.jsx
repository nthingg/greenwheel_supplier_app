import { FileUpload } from "@mui/icons-material";
import { useState } from "react";
import { Snackbar, Alert, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import { useMutation } from "@apollo/client";
import { IMPORT_PRODUCTS_EXCEL } from "../../services/graphql/product";

export default function ProductImportExcel({ providerId, fetchProdCount, refetchProducts, setIsLoading }) {
    const [vertical] = useState("top");
    const [horizontal] = useState("right");
    const [errorMsg, setErrMsg] = useState(false);
    const [successMsg, setSucessMsg] = useState(false);
    const [snackBarErrorOpen, setsnackBarErrorOpen] = useState(false);
    const [snackBarSuccessOpen, setsnackBarSucessOpen] = useState(false);
    const [add] = useMutation(IMPORT_PRODUCTS_EXCEL);

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
        const minNameLength = 3;
        const maxNameLength = 30;
        const minPrice = 10000;
        const maxPrice = 10000000;
        const minPartySize = 1;
        const maxPartySize = 10;
        const minDescLength = 3;
        const maxDescLength = 100;
        const imageValidSource = "https://d38ozmgi8b70tu.cloudfront.net";
        const types = ["BEVERAGE", "CAMP", "FOOD", "ROOM", "VEHICLE"];
        const periods = ["MORNING", "NOON", "AFTERNOON", "EVENING"];
        let errorMsg = "Lỗi tại dòng " + (index + 1) + ":\n";
        let result = true;
        
        if (
            !data.name ||
            data.name.length < minNameLength ||
            data.name.length > maxNameLength
          ) {
            errorMsg +=
              `Tên không hợp lệ! Tên không được để trống và độ dài cho phép từ ${minNameLength} tới ${maxNameLength}!\n`;
          }
      
          if (
            !data.description ||
            data.description.length < minDescLength ||
            data.description.length > maxDescLength
          ) {
            errorMsg +=
              `Mô tả không hợp lệ! Mô tả không được để trống và độ dài cho phép từ ${minDescLength} tới ${maxDescLength}!\n`;
          }
      
          if (!data.imageUrl || !data.imageUrl.startsWith(imageValidSource)) {
              errorMsg += "Đường dẫn ảnh không được để trống và phải tới từ nguồn hợp lệ!\n";
            }
      
          if (
            !data.partySize ||
            data.partySize < minPartySize ||
            data.partySize > maxPartySize
          ) {
            errorMsg +=
              `Số người phù hợp không hợp lệ! Số người phù hợp không được để trống và cho phép từ ${minPartySize} tới ${maxPartySize}!\n`;
          }

          if (
            !data.price ||
            data.price < minPrice ||
            data.price > maxPrice
          ) {
            errorMsg +=
              `Giá tiền không hợp lệ! Giá tiền không được để trống và cho phép giá trị từ ${new Intl.NumberFormat("vi-VN").format(minPrice)} tới ${new Intl.NumberFormat("vi-VN").format(maxPrice)}!\n`;
          }
      
          if (!data.type || !types.some((t) => t.includes(data.type))) {
            errorMsg += "Loại sản phẩm không hợp lệ!\n";
          }
      
          if (!data.periods || !data.periods.every((p) => periods.includes(p))) {
            errorMsg += "Khung thời gian phục vụ không hợp lệ!\n";
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

                console.log(parsedData);

                const importData = [];
                parsedData.forEach((value) => {
                    importData.push({
                        description: value.Description,
                        imageUrl: value.ImageUrl,
                        name: value.Name,
                        partySize: value.PartySize,
                        periods: value.Periods.substring(
                            1,
                            value.Periods.length - 1
                          ).split(","),
                        price: value.Price,
                        providerId: parseInt(providerId.toString(), 10),
                        type: value.Type
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
                    setIsLoading(true);
                    fetchProdCount("");
                    refetchProducts();
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