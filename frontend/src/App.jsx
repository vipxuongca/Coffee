import React, { useState, useEffect } from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Collection from "./pages/Collection.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import Order from "./pages/Order.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Register from "./pages/Register.jsx";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="px-4 lg:px-[9vw]">
      <ToastContainer />
      <Navbar token={token} setToken={setToken} />

      <SearchBar></SearchBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Collection />} />
        <Route path="/product/:productId" element={<Product token={token} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/order" element={<Order />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
};

export default App;
