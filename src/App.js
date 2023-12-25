import SideBar from "./components/SideBar";
import "./index.css";
import { useParams, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";
import { ApolloProvider } from "@apollo/client";
import TransactionPage from "./pages/TransactionPage";
import LoginPage from "./pages/LoginPage";
import client from "./services/config";
import TransactionDetailPage from "./pages/TransactionDetailPage";
import TOKEN from "./services/constant";
import ProductDetailPage from "./pages/ProductDetailPage";
import EmulatorPage from "./pages/EmulatorPage";

function App() {
  const { productId } = useParams();

  return (
    <ApolloProvider client={client}>
      <div className="app">
        <SideBar />
        <main className={TOKEN ? "content" : "loginContent"}>
          <Routes>
            <Route
              path="/"
              element={TOKEN ? <HomePage /> : <Navigate to="/login" />}
            ></Route>
            <Route path="login" element={<LoginPage />}></Route>
            <Route
              path="profile"
              element={TOKEN ? <ProfilePage /> : <Navigate to="/login" />}
            ></Route>
            <Route path="products">
              <Route
                index
                element={TOKEN ? <ProductPage /> : <Navigate to="/login" />}
              />
              <Route
                path=":productId"
                element={<ProductDetailPage id={productId} />}
              />
            </Route>
            <Route path="transactions">
              <Route
                index
                element={TOKEN ? <TransactionPage /> : <Navigate to="/login" />}
              />
              <Route path=":orderId" element={<TransactionDetailPage />} />
            </Route>
            <Route
              path="emulator"
              element={TOKEN ? <EmulatorPage /> : <Navigate to="/login" />}
            ></Route>
          </Routes>
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
