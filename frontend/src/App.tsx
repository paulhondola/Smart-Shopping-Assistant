import { Box } from "@mui/material";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Products from "./components/Products";
import Categories from "./components/Categories";
import Promotions from "./components/Promotions";
import Cart from "./components/Cart";
import { Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
