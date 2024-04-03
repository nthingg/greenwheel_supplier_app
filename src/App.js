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

function App() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

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
            </Route>
            <Route path="orders">
              <Route
                index
                element={token ? <OrderPage /> : <Navigate to="/login" />}
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
}

export default App;
