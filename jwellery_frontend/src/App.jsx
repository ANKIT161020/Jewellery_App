import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import History from './pages/History';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminOrders from "./pages/AdminOrders";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbarFooter = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ If user is NOT logged in, redirect them to login (except for `/register`)
    if (!token && location.pathname !== "/register" && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate, location.pathname]); // ✅ Now only runs when location changes

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/history" element={<History />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
      </Routes>
    </>
  );
}

export default App;
