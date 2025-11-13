import { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/user-api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await userApi.login(email, password);

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi đăng nhập. Vui lòng thử lại.");
    }
  };

  const onGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      "http://localhost:4001/auth/google/login",
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  useEffect(() => {
    const messageListener = (event) => {
      if (event.origin !== "http://localhost:4001") return;
      const { token, email } = event.data;
      if (token) {
        setToken(token);
        toast.success(`Logged in as ${email}`);
        navigate("/");
        window.removeEventListener("message", messageListener);
      }
    };

    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f3ef] px-4">
      <div className="bg-[#fff8f0] border border-[#d7ccc8]   shadow-inner w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-[#3e2723] mb-6 border-b border-[#a1887f] pb-2">
          ĐĂNG NHẬP
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full border border-[#a1887f]  p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
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
              className="w-full border border-[#a1887f]  p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              type="password"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            className="w-full py-2   bg-[#3e2723] hover:bg-[#4e342e] text-white font-medium transition-all"
            type="submit"
          >
            Đăng nhập
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-2   bg-[#d7ccc8] hover:bg-[#bcaaa4] text-[#3e2723] font-medium transition-all"
          >
            Đăng ký tài khoản
          </button>

          <button
            type="button"
            onClick={onGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-2   bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium shadow-sm transition-all mt-4"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              className="w-5 h-5"
            />
            Đăng nhập với Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
