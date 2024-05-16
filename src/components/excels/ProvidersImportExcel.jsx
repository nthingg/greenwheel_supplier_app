import { FileUpload } from "@mui/icons-material";
import { useState } from "react";
import { Snackbar, Alert, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import { useMutation } from "@apollo/client";
import { IMPORT_PROVIDERS_EXCEL } from "../../services/graphql/provider";

export default function ProviderImportExcel({ refetch, fetchProviderType, fetchTotalProvider }) {
    const [vertical, setVertical] = useState("top");
    const [horizontal, setHorizontal] = useState("right");
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

                // for (let i = 0; i < importData.length; i++) {
                //     if (!validateImportData(importData[i], i)) {
                //         isValidData = false;
                //         break;
                //     }
                // }

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