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
import { TOKEN } from "./services/constant";
import ProductDetailPage from "./pages/ProductDetailPage";
import EmulatorPage from "./pages/EmulatorPage";
import ProductEditPage from "./pages/ProductEditPage";
import SupplierPage from "./pages/SupplierPage";
import SupplierDetailPage from "./pages/SupplierDetailPage";
import DestinationPage from "./pages/DestinationPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import SupplierCreatePage from "./pages/SupplierCreatePage";
import Test from "./pages/TestPage";
import { LoadScript } from "@react-google-maps/api";
import PlanPage from "./pages/PlanPage";
import PlanDetailPage from "./pages/PlanDetailPage";
import AccountPage from "./pages/AccountPage";
import TravelerProfilePage from "./pages/TravelerProfilePage";
import AdminHomePage from "./pages/AdminHomePage";

function App() {
  const role = localStorage.getItem("role");

  return (
    <ApolloProvider client={client}>
      <LoadScript
        googleMapsApiKey="AIzaSyAERCSiCGfcuVAjDib-6JWN5T7Agni47yU"
        libraries={["places"]}
      >
        <div className="app">
          <SideBar />
          <main className={TOKEN ? "content" : "loginContent"}>
            {/* <main className={"content"}> */}
            <Routes>
              {role === "ADMIN" && (
                <Route
                  path="/"
                  element={TOKEN ? <AdminHomePage /> : <Navigate to="/login" />}
                ></Route>
              )}
              {role !== "ADMIN" && (
                <Route
                  path="/"
                  element={TOKEN ? <HomePage /> : <Navigate to="/login" />}
                ></Route>
              )}
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
                <Route path=":productId" element={<ProductDetailPage />} />
                <Route path="detail">
                  <Route path=":productId" element={<ProductDetailPage />} />
                </Route>
                <Route path="edit">
                  <Route path=":productId" element={<ProductEditPage />} />
                </Route>
              </Route>
              <Route path="suppliers">
                <Route
                  index
                  element={TOKEN ? <SupplierPage /> : <Navigate to="/login" />}
                />
                <Route path=":supplierId" element={<SupplierDetailPage />} />
                <Route path="new" element={<SupplierCreatePage />} />
                <Route path="add-product">
                  <Route path=":supplierId" element={<ProductCreatePage />} />
                </Route>
              </Route>
              <Route path="orders">
                <Route
                  index
                  element={
                    TOKEN ? <TransactionPage /> : <Navigate to="/login" />
                  }
                />
                <Route path=":orderId" element={<TransactionDetailPage />} />
              </Route>
              <Route path="destinations">
                <Route
                  index
                  element={
                    TOKEN ? <DestinationPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path=":destinationId"
                  element={<DestinationDetailPage />}
                />
              </Route>
              <Route path="plans">
                <Route
                  index
                  element={TOKEN ? <PlanPage /> : <Navigate to="/login" />}
                />
                <Route path=":planId" element={<PlanDetailPage />} />
                <Route path="traveler-info">
                  <Route path=":travelerId" element={<TravelerProfilePage />} />
                </Route>
              </Route>
              <Route path="accounts">
                <Route
                  index
                  element={TOKEN ? <AccountPage /> : <Navigate to="/login" />}
                />
              </Route>
              <Route
                path="emulator"
                element={TOKEN ? <EmulatorPage /> : <Navigate to="/login" />}
              ></Route>
              <Route
                path="test"
                element={TOKEN ? <Test /> : <Navigate to="/login" />}
              ></Route>
            </Routes>
          </main>
        </div>
      </LoadScript>
    </ApolloProvider>
  );
}

export default App;
