import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  if (loading) return <div className="p-6 text-gray-600">Loading dashboard...</div>;

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">Profile Details</h2>
            <p><strong>Name:</strong> {userInfo?.name}</p>
            <p><strong>Email:</strong> {userInfo?.email}</p>
          </div>
        );
      case "shipping":
        return (
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">Shipping Details</h2>
            <p>Address: {userInfo?.address || "No address saved"}</p>
            <p>Phone: {userInfo?.phone || "N/A"}</p>
          </div>
        );
      case "password":
        return (
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">Change Password</h2>
            <form className="space-y-3 max-w-sm">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full border rounded-lg p-2"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border rounded-lg p-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Password
              </button>
            </form>
          </div>
        );
      case "logout":
        localStorage.removeItem("token");
        window.location.href = "/";
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <nav className="space-y-2">
          {["profile", "shipping", "password", "logout"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`block w-full text-left px-3 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {tab === "profile" && "Profile Details"}
              {tab === "shipping" && "Shipping Detail"}
              {tab === "password" && "Change Password"}
              {tab === "logout" && "Log Out"}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default UserDashboard;
