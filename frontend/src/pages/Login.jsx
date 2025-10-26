import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUserUrl, setToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUserUrl}/api/user/login`, {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">ĐĂNG NHẬP</h1>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800"
            type="submit"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mt-3 w-full py-2 px-4 rounded-md text-black border border-gray-400 hover:bg-gray-100"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
