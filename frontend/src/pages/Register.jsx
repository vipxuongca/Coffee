import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { backendUserUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password !== password2) {
        toast.error("Nhập lại mật khẩu không đúng");
        return;
      }

      const response = await axios.post(`${backendUserUrl}/api/user/register`, {
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Đăng ký tài khoản thành công");
        navigate("/");
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
        <h1 className="text-2xl font-bold mb-4 text-center">
          ĐĂNG KÝ TÀI KHOẢN
        </h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm foint-medium text-gray-700 mb-2">Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none "
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm foint-medium text-gray-700 mb-2">Mật Khẩu</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none "
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm foint-medium text-gray-700 mb-2">
              Nhập Lại Mật Khẩu
            </p>
            <input
              onChange={(e) => setPassword2(e.target.value)}
              value={password2}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none "
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <button
            className="mt-2 w-full py-2 px-4 rounded md text-white bg-black"
            type="submit"
          >
            ĐĂNG KÝ
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
