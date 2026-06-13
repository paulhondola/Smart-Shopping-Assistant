import { Box, CircularProgress } from "@mui/material";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import CartDrawer from "./components/CartDrawer";
import Shop from "./components/Shop";
import Login from "./components/Login";
import Register from "./components/Register";
import RequireAuth from "./components/common/RequireAuth";
import RequireAdmin from "./components/common/RequireAdmin";
import { Routes, Route, useLocation } from "react-router-dom";
import NotFound from "./components/NotFound";
import AuthProvider from "./context/AuthContext/AuthProvider";
import CartProvider from "./context/CartContext/CartProvider";
import { lazy, Suspense } from "react";
import {
  ErrorBoundary,
  RouteFallback,
} from "./components/common/ErrorBoundary";

const Products = lazy(() => import("./components/Products"));
const Categories = lazy(() => import("./components/Categories"));
const Promotions = lazy(() => import("./components/Promotions"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const Profile = lazy(() => import("./components/Profile"));

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <CartProvider>
        <Box
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <NavBar />
          <CartDrawer />
          <Box component="main" sx={{ flex: 1 }}>
            <Suspense
              fallback={
                <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                  <CircularProgress />
                </Box>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/shop"
                  element={
                    <ErrorBoundary
                      FallbackComponent={RouteFallback}
                      resetKeys={[location.pathname]}
                    >
                      <RequireAuth>
                        <Shop />
                      </RequireAuth>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ErrorBoundary
                      FallbackComponent={RouteFallback}
                      resetKeys={[location.pathname]}
                    >
                      <RequireAdmin>
                        <Products />
                      </RequireAdmin>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <ErrorBoundary
                      FallbackComponent={RouteFallback}
                      resetKeys={[location.pathname]}
                    >
                      <RequireAdmin>
                        <Categories />
                      </RequireAdmin>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/promotions"
                  element={
                    <ErrorBoundary
                      FallbackComponent={RouteFallback}
                      resetKeys={[location.pathname]}
                    >
                      <RequireAdmin>
                        <Promotions />
                      </RequireAdmin>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/shop/:productId"
                  element={
                    <ErrorBoundary
                      FallbackComponent={RouteFallback}
                      resetKeys={[location.pathname]}
                    >
                      <RequireAuth>
                        <ProductDetail />
                      </RequireAuth>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ErrorBoundary
                      FallbackComponent={RouteFallback}
                      resetKeys={[location.pathname]}
                    >
                      <RequireAuth>
                        <Profile />
                      </RequireAuth>
                    </ErrorBoundary>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
