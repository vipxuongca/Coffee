import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  About,
  Contact,
  Collection,
  Product,
  Cart,
  Login,
  PlaceOrder,
  Order,
  Register,
  UserDashboard,
} from "./pages";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SearchBar from "./components/SearchBar.jsx";
import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const fade = cssTransition({
    enter: "fadeIn",
    exit: "fadeOut",
    duration: 300,
  });

  return (
    <div className="px-4 lg:px-[9vw] relative">
      <ToastContainer position="top-left" autoClose={1200} />

      <Navbar token={token} setToken={setToken} />
      <SearchBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Collection />} />
        <Route path="/product/:productId" element={<Product token={token} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/order" element={<Order />} />
        <Route path="/user" element={<UserDashboard />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
