import SideBar from "./components/SideBar";
import "./index.css";
import {
  useParams,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
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
import ProductEditPage from "./pages/ProductEditPage";
import SupplierPage from "./pages/SupplierPage";
import SupplierDetailPage from "./pages/SupplierDetailPage";
import DestinationPage from "./pages/DestinationPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import ProductCreatePage from "./pages/ProductCreatePage";

function App() {
  const { productId } = useParams();

  return (
    <ApolloProvider client={client}>
      <div className="app">
        <SideBar />
        <main className={TOKEN ? "content" : "loginContent"}>
          {/* <main className={"content"}> */}
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
              <Route path="detail">
                <Route
                  path=":productId"
                  element={<ProductDetailPage productId={productId} />}
                />
              </Route>
              <Route path="edit">
                <Route
                  path=":productId"
                  element={<ProductEditPage id={productId} />}
                />
              </Route>
            </Route>
            <Route path="suppliers">
              <Route
                index
                element={TOKEN ? <SupplierPage /> : <Navigate to="/login" />}
              />
              <Route path=":supplierId" element={<SupplierDetailPage />} />
              <Route path="add-product">
                <Route path=":supplierId" element={<ProductCreatePage />} />
              </Route>
            </Route>
            <Route path="transactions">
              <Route
                index
                element={TOKEN ? <TransactionPage /> : <Navigate to="/login" />}
              />
              <Route path=":orderId" element={<TransactionDetailPage />} />
            </Route>
            <Route path="destinations">
              <Route
                index
                element={TOKEN ? <DestinationPage /> : <Navigate to="/login" />}
              />
              <Route
                path=":destinationId"
                element={<DestinationDetailPage />}
              />
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
