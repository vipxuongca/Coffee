import React from "react";
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

const App = () => {
  return <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} /> 
      <Route path="/collection" element={<Collection />} /> 
      <Route path="/product/:productId" element={<Product />} /> 
      <Route path="/cart" element={<Cart />} /> 
      <Route path="/login" element={<Login />} /> 
      <Route path="/place-order" element={<PlaceOrder />} />
      <Route path="/order" element={<Order />} />  
    </Routes>
    </div>;
};

export default App;
