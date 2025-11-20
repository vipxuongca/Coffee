import { ShopContext } from "./ShopContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { categoryApi, productApi } from "../../api/product-api";

const ShopContextProvider = (props) => {
  const currency = "₫";
  const delivery_fee = 30000;

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [reloadAddress, setReloadAddress] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

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
      const response = await productApi.getProduct(page, limit);
      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
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
      const response = await categoryApi.getCategory();
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
  }, [page, limit]);
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
    token,
    setToken,
    setLoading,
    reloadAddress,
    setReloadAddress,
    defaultAddress,
    setDefaultAddress,
    statusFilter,
    setStatusFilter,
    totalPages,
    setPage,
    setLimit,
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
