import "./index.css";
import { useParams, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import SideBar from "./components/widgets/SideBar";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import client from "./services/apollo/config";
import OrderPage from "./pages/order/OrderPage";
import OrderDetailPage from "./pages/order/OrderDetailPage";
import ProductPage from "./pages/product/ProductPage";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import ProviderPage from "./pages/provider/ProviderPage";
import ProviderDetailPage from "./pages/provider/ProviderDetailPage";
import Test from "./pages/home/TestPage";
import ProviderAddPage from "./pages/provider/ProviderAddPage";
import ProductAddPage from "./pages/product/ProductAddPage";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
} from "@mui/material";
import { useState } from "react";
import ProviderUpdatePage from "./pages/provider/ProviderUpdatePage";
import ProviderProfilePage from "./pages/profile/ProviderProfilePage";
import ProviderProfileUpdatePage from "./pages/profile/ProviderProfileUpdatePage";
import ProductUpdatePage from "./pages/product/ProductUpdatePage";

const App = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("staffToken");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  return (
    <ApolloProvider client={client}>
      <div className="app">
        <div style={!token ? { display: "none" } : { display: "block" }}>
          <SideBar />
        </div>
        <main className={token ? "content" : "loginContent"}>
          <Routes>
            <Route
              path="/"
              element={token ? <HomePage /> : <Navigate to="/login" />}
            ></Route>
            <Route path="login" element={<LoginPage />}></Route>
            <Route path="profile">
              <Route
                index
                element={
                  token ? <ProviderProfilePage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="update/:providerId"
                element={<ProviderProfileUpdatePage />}
              />
              <Route
                path="product/:productId"
                element={<ProductDetailPage />}
              />
              <Route
                path="product/:productId/update"
                element={<ProductUpdatePage />}
              />
              <Route path="add-product" element={<ProductAddPage />} />
            </Route>
            <Route path="providers">
              <Route
                index
                element={token ? <ProviderPage /> : <Navigate to="/login" />}
              />
              <Route path=":providerId" element={<ProviderDetailPage />} />
              <Route
                path=":providerId/product/:productId"
                element={<ProductDetailPage />}
              />
              <Route
                path=":providerId/product/:productId/update"
                element={<ProductUpdatePage />}
              />
              <Route path="add" element={<ProviderAddPage />} />
              <Route
                path="update/:providerId"
                element={<ProviderUpdatePage />}
              />
              <Route
                path=":providerId/add-product"
                element={<ProductAddPage />}
              />
            </Route>
            <Route path="orders">
              <Route
                index
                element={token ? <OrderPage /> : <Navigate to="/login" />}
              />
              <Route path="status/:sbs" element={<OrderPage />} />
              <Route
                path=":orderId/provider/:providerId"
                element={<ProviderDetailPage />}
              />
              <Route path=":orderId" element={<OrderDetailPage />} />
            </Route>
            <Route
              path="test"
              element={token ? <Test /> : <Navigate to="/login" />}
            ></Route>
          </Routes>
        </main>
        {/* <Fab
          onClick={() => {
            if (open) {
              setOpen(false);
            } else {
              setOpen(true);
            }
          }}
          sx={{ color: "#2c3d50" }}
          style={{ right: 10, bottom: 10, position: "fixed", zIndex: 1600 }}
        >
          <NotificationsActiveIcon />
        </Fab> */}
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          PaperProps={{
            sx: { position: "fixed", bottom: -20, right: 50, width: 500 },
          }}
        >
          <DialogTitle backgroundColor={"#2c3d50"} color={"white"}>
            Thông báo đơn hàng
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ padding: "20px 0 10px 0" }}>
              Danh sách thông báo:
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    </ApolloProvider>
  );
};

export default App;
