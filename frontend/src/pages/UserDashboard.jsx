import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import UserOrders from "../components/user/UserOrder";
import UserDetail from "../components/user/UserDetail";
import UserProfile from "../components/user/UserProfile";
import UserChangePassword from "../components/user/UserChangePassword";
import Swal from "sweetalert2";
import { LogOut, MapPin, User, Receipt, Lock } from "lucide-react";
import { userApi } from "../../api/user-api";

const UserDashboard = () => {
  const baseLinkStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg border border-[#d7ccc8] bg-[#fffaf7] text-[#3e2723] font-medium transition-all duration-300 hover:bg-[#f3e5ab] hover:shadow-md";
  const activeLinkStyle =
    "bg-[#d7ccc8] text-[#3e2723] shadow-inner border-[#a1887f]";

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      text: "Bạn có muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      width: "300px",
    });

    if (!confirm.isConfirmed) return;

    try {
      await userApi.logout();
    } catch (_) {
      // Even if backend fails, still clear state
    }

    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[18%] min-h-screen border-r border-[#a1887f] bg-[#f8f3ef] shadow-inner flex flex-col">
        <div className="p-6 pb-4 border-b border-[#d7ccc8]">
          <h2 className="text-xl font-semibold tracking-wide text-[#4e342e] ">
            Tài Khoản
          </h2>
        </div>

        <div className="flex flex-col gap-3 px-4 pt-6 text-sm ">
          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
            }
          >
            <User className="w-5 h-5" />
            <span>Hồ sơ</span>
          </NavLink>

          <NavLink
            to="/user/details"
            className={({ isActive }) =>
              `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
            }
          >
            <MapPin className="w-5 h-5" />
            <span>Địa chỉ</span>
          </NavLink>

          <NavLink
            to="/user/orders"
            className={({ isActive }) =>
              `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
            }
          >
            <Receipt className="w-5 h-5" />
            <span>Đơn hàng</span>
          </NavLink>

          <NavLink
            to="/user/password"
            className={({ isActive }) =>
              `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
            }
          >
            <Lock className="w-5 h-5" />
            <span>Đổi mật khẩu</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className={`${baseLinkStyle} hover:bg-red-200 border-red-300`}
          >
            <LogOut className="w-5 h-5 opacity-80" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        <Routes>
          <Route path="/" element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="details" element={<UserDetail />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="password" element={<UserChangePassword />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserDashboard;
