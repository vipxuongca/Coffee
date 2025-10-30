import React, { useState, useEffect } from "react";
import axios from "axios";
import UserOrders from "../components/user/UserOrder";
import UserDetail from "../components/user/UserDetail";
import UserProfile from "../components/user/UserProfile";
import UserChangePassword from "../components/user/UserChangePassword";
import { User, MapPin, Lock, List, LogOut } from "lucide-react";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userDetail, setUserDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:4010/api/user-detail", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetail(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <UserProfile userDetail={userDetail} />;
      case "details":
        return <UserDetail userDetail={userDetail} />;
      case "password":
        return <UserChangePassword />;
      case "orders":
        return <UserOrders />;
      case "logout":
        localStorage.removeItem("token");
        globalThis.location.href = "/";
        return null;

      default:
        return null;
    }
  };

  const tabs = [
    { key: "profile", label: "Thông Tin Tài Khoản", icon: <User size={16} /> },
    {
      key: "details",
      label: "Thông Tin Người Nhận",
      icon: <MapPin size={16} />,
    },
    { key: "orders", label: "Danh Sách Đơn Hàng", icon: <List size={16} /> },
    { key: "password", label: "Đổi Mật Khẩu", icon: <Lock size={16} /> },
    { key: "logout", label: "Đăng Xuất", icon: <LogOut size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Fixed-width sidebar: w-64 + flex-none prevents shrinking */}
      <aside className="w-64 flex-none bg-base-100 shadow-lg p-4">
        <h1 className="text-xl font-semibold mb-6 text-center">Tài Khoản</h1>
        <ul className="menu rounded-box">
          {tabs.map((tab) => (
            <li key={tab.key}>
              <button
                onClick={() => setActiveTab(tab.key)}
                className={activeTab === tab.key ? "active" : ""}
                aria-current={activeTab === tab.key ? "page" : undefined}
              >
                <span className="inline-flex items-center gap-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content: flexible and scrollable */}
      <main className="flex-1 overflow-auto p-8">{renderContent()}</main>
    </div>
  );
};

export default UserDashboard;
