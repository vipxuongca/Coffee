import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₫";
  const delivery_fee = 30000;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendCartUrl = import.meta.env.VITE_BACKEND_CART_URL;
  const backendOrderUrl = import.meta.env.VITE_BACKEND_ORDER_URL;
  const backendUserUrl = import.meta.env.VITE_BACKEND_USER_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/get`);
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
      const response = await axios.get(`${backendUrl}/api/category/get`);
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
  const fetchCartCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendCartUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const totalItems = res.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(totalItems);
    } catch (err) {
      console.error("Failed to fetch cart count:", err.message);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [token]);

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
    showSearch,
    setShowSearch,
    backendUrl,
    backendCartUrl,
    backendOrderUrl,
    backendUserUrl,
    fetchCartCount,
    token,
    setToken,
    cartCount,
    setCartCount,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
