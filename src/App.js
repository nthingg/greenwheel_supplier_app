import "./index.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
} from "@mui/material";
import { useEffect, useState } from "react";
import ProviderUpdatePage from "./pages/provider/ProviderUpdatePage";
import ProviderProfilePage from "./pages/profile/ProviderProfilePage";
import ProviderProfileUpdatePage from "./pages/profile/ProviderProfileUpdatePage";
import ProductUpdatePage from "./pages/product/ProductUpdatePage";

const App = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("staffToken");

  useEffect(() => {
    if (token) {
      const decode = JSON.parse(atob(token.split(".")[1]));
      if (decode.exp * 1000 < new Date().getTime()) {
        localStorage.removeItem("staffToken");
        localStorage.removeItem("providerId");
        localStorage.removeItem("staffId");
        localStorage.removeItem("refreshToken");
        navigate("/");
        navigate(0);
      }
    }
  }, []);

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
      </div>
    </ApolloProvider>
  );
};

export default App;
