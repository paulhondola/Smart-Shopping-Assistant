import "./App.css";
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
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
