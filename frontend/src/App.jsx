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
  NotFound,
  Policy,
} from "./pages";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SearchBar from "./components/SearchBar.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopContext } from "./context/ShopContext";
import { useContext } from "react";
import TopScroll from "./components/TopScroll.jsx";

const App = () => {
  const { token, setToken } = useContext(ShopContext);
  return (
    <div className="px-4 lg:px-[9vw] relative">
      <ToastContainer position="top-left" autoClose={1500} />

      <Navbar />
      <SearchBar />
      <TopScroll />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Collection />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart token={token} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/place-order/:orderId"
          element={<PlaceOrder token={token} />}
        />
        <Route path="/order" element={<Order />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/user" element={<UserDashboard />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
