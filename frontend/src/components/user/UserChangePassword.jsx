import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../../api/user-api";
import { ShopContext } from "../../context/ShopContext";
import { useContext, useState } from "react";
import Swal from "sweetalert2";

const UserChangePassword = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(ShopContext);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Nhập lại mật khẩu không đúng.");
    }

    try {
      const res = await userApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Đổi mật khẩu thành công",
          text: "Vui lòng đăng nhập lại.",
          confirmButtonText: "Đăng nhập",
          confirmButtonColor: "#3e2723",
          width: "320px",
          customClass: {
            title: "text-base",
            popup: "p-4",
            confirmButton: "text-sm px-3 py-2",
            cancelButton: "text-sm px-3 py-2",
          },
        }).then(() => {
          // ví dụ: điều hướng về trang đăng nhập
          navigate("/login");
        });
        setToken(""); // Clear frontend token
        navigate("/login");
      } else {
        toast.error(res.data.message || "Không thể đổi mật khẩu.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi máy chủ.");
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="bg-[#fff8f0] border border-[#d7ccc8] shadow-inner w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-[#3e2723] mb-6 border-b border-[#a1887f] pb-2">
          THAY ĐỔI MẬT KHẨU
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Nhập mật khẩu hiện tại"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border border-[#a1887f] p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              required
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Nhập mật khẩu mới"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border border-[#a1887f] p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              required
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Nhập lại mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-[#a1887f] p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#3e2723] hover:bg-[#4e342e] text-white font-medium transition-all"
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserChangePassword;
