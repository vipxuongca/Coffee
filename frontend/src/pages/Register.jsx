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
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f3ef] px-4">
      <div className="bg-[#fff8f0] border border-[#d7ccc8] rounded-xl shadow-inner w-full max-w-md p-8">
        <h1 className="text-3xl font-semibold mb-6 text-center text-[#4e342e] tracking-wide">
          ĐĂNG KÝ TÀI KHOẢN
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              type="password"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Nhập lại mật khẩu<span className="text-red-500">*</span>
            </label>

            <input
              onChange={(e) => setPassword2(e.target.value)}
              value={password2}
              className="w-full border border-[#a1887f] rounded-lg p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              type="password"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          <button
            className="w-full py-2 rounded-md text-white bg-[#6d4c41] hover:bg-[#5d4037] transition-all shadow-md"
            type="submit"
          >
            Đăng ký
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-2 rounded-md border border-[#d7ccc8] text-[#4e342e] hover:bg-[#efebe9] transition-all"
          >
            Quay lại Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
