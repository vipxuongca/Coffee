import { Routes, Route, useLocation } from "react-router-dom";
import {
  Home,
  About,
  Contact,
  Collection,
  Product,
  Cart,
  Login,
  PlaceOrder,
  OrderDetail,
  Register,
  UserDashboard,
  NotFound,
  Policy,
  Checkout,
} from "./pages";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SearchBar from "./components/SearchBar.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopScroll from "./components/TopScroll.jsx";

const App = () => {
  const location = useLocation();

  return (
    <div className="px-4 lg:px-[9vw] relative">
      <ToastContainer position="top-left" autoClose={1500} />
      <Navbar />
      <TopScroll />

      {location.pathname === "/shop" && <SearchBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Collection />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/place-order/:orderId" element={<PlaceOrder />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
