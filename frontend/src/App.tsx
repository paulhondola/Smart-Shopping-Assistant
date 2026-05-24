import './App.css'
import NavBar from './components/NavBar/NavBar'
import Home from './components/Home/Home'
import Products from './components/Products/Products'
import Categories from './components/Categories/Categories'
import Promotions from './components/Promotions/Promotions'
import Cart from './components/Cart/Cart'
import { Routes, Route, Navigate } from 'react-router-dom'

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
