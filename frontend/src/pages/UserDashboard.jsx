import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  // const [UserInfo, setUserInfo] = useState(null);
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

  if (loading) return <div className="p-6 text-gray-600">Đang Tải...</div>;

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">Thông tin Tài Khoản</h2>
            <p>
              <strong>Name:</strong> {userDetail?.name}
            </p>
            <p>
              <strong>Email:</strong> {userDetail?.email}
            </p>
          </div>
        );
      case "shipping":
        return (
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Thông Tin Người Nhận</h2>

            {userDetail?.data?.length > 0 ? (
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left font-medium border-b">
                      Receiver
                    </th>
                    <th className="p-2 text-left font-medium border-b">
                      Phone
                    </th>
                    <th className="p-2 text-left font-medium border-b">
                      Address
                    </th>
                    <th className="p-2 text-left font-medium border-b">City</th>
                    <th className="p-2 text-left font-medium border-b">
                      State
                    </th>
                    <th className="p-2 text-left font-medium border-b">
                      Postal Code
                    </th>
                    <th className="p-2 text-left font-medium border-b">
                      Country
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userDetail.data.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{item.receiverName || "N/A"}</td>
                      <td className="p-2">{item.phone || "N/A"}</td>
                      <td className="p-2">{item.addressLine1 || "N/A"}</td>
                      <td className="p-2">{item.city || "N/A"}</td>
                      <td className="p-2">{item.state || "N/A"}</td>
                      <td className="p-2">{item.postalCode || "N/A"}</td>
                      <td className="p-2">{item.country || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">
                Không tìm thấy thông tin người nhận.
              </p>
            )}
          </div>
        );

      case "password":
        return (
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">Thay Đổi Mật Khẩu</h2>
            <form className="space-y-3 max-w-sm">
              <input
                type="password"
                placeholder="Mật Khẩu Hiện Tại"
                className="w-full border rounded-lg p-2"
              />
              <input
                type="password"
                placeholder="Mật Khẩu Mới"
                className="w-full border rounded-lg p-2"
              />
              <input
                type="password"
                placeholder="Nhập Lại Mật Khẩu Mới"
                className="w-full border rounded-lg p-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Cập Nhật Mật Khẩu
              </button>
            </form>
          </div>
        );
      case "logout":
        localStorage.removeItem("token");
        globalThis.location.href = "/";
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold mb-6">Tài Khoản</h1>
        <nav className="space-y-2">
          {["profile", "shipping", "orders", "password", "logout"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`block w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {tab === "profile" && "Thông Tin Tài Khoản"}
                {tab === "shipping" && "Thông Tin Người Nhận"}
                {tab === "orders" && "Danh Sách Đơn Hàng"}
                {tab === "password" && "Thay Đổi Mật Khẩu"}
                {tab === "logout" && "Đăng Xuất"}
              </button>
            )
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default UserDashboard;
