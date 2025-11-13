import { AdminContext } from "./AdminContext";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

const AdminContextProvider = (props) => {
  const currency = "₫";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState({
    PAID: true,
    PENDING_PAYMENT: true,
    CANCELLED: true,
    PROCESSING: true,
    FAILED: true,
    REFUNDED: true,
  });

  // Effect for show loading
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowLoading(true), 500); // show spinner after 0.5s1s
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const value = {
    currency,
    token,
    setToken,
    loading,
    setLoading,
    statusFilter,
    setStatusFilter,
  };

  return (
    <AdminContext.Provider value={value}>
      {showLoading && (
        <div className="fixed inset-0 z-50 bg-black/30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6  shadow-lg flex flex-col items-center">
            <ClipLoader color="#3e2723" size={60} />
            <p className="text-gray-700 font-medium mt-2">Loading...</p>
          </div>
        </div>
      )}

      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
