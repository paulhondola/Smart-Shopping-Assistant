import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import Categories from "./components/Categories/Categories";
import Promotions from "./components/Promotions/Promotions";
import Cart from "./components/Cart/Cart";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Box className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Box>
  );
}

export default App;
