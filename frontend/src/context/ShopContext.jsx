import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₫";
  const delivery_fee = 30000;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    getProductsData();
  },[]);
  useEffect(() => {
    getCategoriesData();
  },[]);

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
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
