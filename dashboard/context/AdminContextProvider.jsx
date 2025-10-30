import { AdminContext } from "./AdminContext";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import ReactDOM from "react-dom";

const AdminContextProvider = (props) => {
  const currency = "₫";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

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
  };

  return (
    <AdminContext.Provider value={value}>
      {showLoading &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm z-[99999]">
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
              <ClipLoader color="#3e2723" size={60} />
              <p className="text-gray-700 font-medium mt-3">Loading...</p>
            </div>
          </div>,
          document.body
        )}

      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
