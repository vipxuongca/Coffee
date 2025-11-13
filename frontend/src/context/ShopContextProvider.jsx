import { ShopContext } from "./ShopContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const ShopContextProvider = (props) => {
  const currency = "₫";
  const delivery_fee = 30000;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendCartUrl = import.meta.env.VITE_BACKEND_CART_URL;
  const backendOrderUrl = import.meta.env.VITE_BACKEND_ORDER_URL;
  const backendUserUrl = import.meta.env.VITE_BACKEND_USER_URL;
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [reloadAddress, setReloadAddress] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const [statusFilter, setStatusFilter] = useState({
    PAID: true,
    PENDING_PAYMENT: true,
    CANCELLED: true,
    PROCESSING: true,
    FAILED: true,
    REFUNDED: true,
  });

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowLoading(true), 500);
      // show spinner after 0.5s
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const getProductsData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/product/get`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const getCategoriesData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/category/get`
      );
      if (response.data.success) {
        setCategories(response.data.category);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);
  useEffect(() => {
    getCategoriesData();
  }, []);

  const value = {
    products,
    categories,
    currency,
    delivery_fee,
    search,
    setSearch,
    backendUrl,
    backendCartUrl,
    backendOrderUrl,
    backendUserUrl,
    token,
    setToken,
    setLoading,
    reloadAddress,
    setReloadAddress,
    defaultAddress,
    setDefaultAddress,
    statusFilter,
    setStatusFilter,
  };

  return (
    <ShopContext.Provider value={value}>
      {showLoading && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6  shadow-lg flex flex-col items-center">
            <ClipLoader color="#3e2723" size={60} />
            <p className="text-gray-700 font-medium mt-2">Loading...</p>
          </div>
        </div>
      )}
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
