import { Box } from "@mui/material";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Products from "./components/Products";
import Categories from "./components/Categories";
import Promotions from "./components/Promotions";
import CartDrawer from "./components/CartDrawer";
import Shop from "./components/Shop";
import { Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import CartProvider from "./context/CartContext/CartProvider";

function App() {
  return (
    <CartProvider>
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <NavBar />
        <CartDrawer />
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </CartProvider>
  );
}

export default App;
