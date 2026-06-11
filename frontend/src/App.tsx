import { Box } from "@mui/material";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Products from "./components/Products";
import Categories from "./components/Categories";
import Promotions from "./components/Promotions";
import CartDrawer from "./components/CartDrawer";
import Shop from "./components/Shop";
import Login from "./components/Login";
import Register from "./components/Register";
import RequireAuth from "./components/common/RequireAuth";
import RequireAdmin from "./components/common/RequireAdmin";
import { Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import AuthProvider from "./context/AuthContext/AuthProvider";
import CartProvider from "./context/CartContext/CartProvider";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Box
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <NavBar />
          <CartDrawer />
          <Box component="main" sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/shop"
                element={
                  <RequireAuth>
                    <Shop />
                  </RequireAuth>
                }
              />
              <Route
                path="/products"
                element={
                  <RequireAdmin>
                    <Products />
                  </RequireAdmin>
                }
              />
              <Route
                path="/categories"
                element={
                  <RequireAdmin>
                    <Categories />
                  </RequireAdmin>
                }
              />
              <Route
                path="/promotions"
                element={
                  <RequireAdmin>
                    <Promotions />
                  </RequireAdmin>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
