import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Orders from "./pages/Orders.jsx";
import List from "./pages/List.jsx";
import ListCategory from "./pages/ListCategory.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Add from "./pages/Add.jsx";
import Edit from "./pages/Edit.jsx";
import AddCategory from "./pages/AddCategory.jsx";
import EditCategory from "./pages/EditCategory.jsx";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₫";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/edit" element={<Edit token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Orders token={token} />} />
                <Route
                  path="/add-category"
                  element={<AddCategory token={token} />}
                />
                <Route
                  path="/list-category"
                  element={<ListCategory token={token} />}
                />
                <Route
                  path="/edit-category"
                  element={<EditCategory token={token} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
