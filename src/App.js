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
            {/* <Route
                path="profile"
                element={token ? <ProfilePage /> : <Navigate to="/login" />}
              ></Route> */}
            <Route path="products">
              <Route
                index
                element={token ? <ProductPage /> : <Navigate to="/login" />}
              />
              <Route path=":productId" element={<ProductDetailPage />} />
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
              <Route path="add" element={<ProviderAddPage />} />
              <Route path="add-product">
                <Route path=":providerId" element={<ProductAddPage />} />
              </Route>
            </Route>
            <Route path="orders">
              <Route
                index
                element={token ? <OrderPage /> : <Navigate to="/login" />}
              />
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
        <Fab
          onClick={() => {
            if (open) {
              setOpen(false);
            } else {
              setOpen(true);
            }
          }}
          sx={{ color: "#2c3d50" }}
          style={{ right: 10, top: 10, position: "fixed", zIndex: 1600 }}
        >
          <NotificationsActiveIcon />
        </Fab>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          PaperProps={{
            sx: { position: "fixed", top: -20, right: 50, width: 500 },
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
