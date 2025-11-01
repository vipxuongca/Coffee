import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
  const { token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4004/api/order/get-user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.orders) setOrders(data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [token]);

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (date) =>
    new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#f8f3ef] rounded-xl shadow-inner border border-[#d7ccc8] mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-[#3e2723]">Đơn hàng của bạn</h2>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-[#fff8f0] text-[#4e342e] uppercase text-xs border-b border-[#d7ccc8]">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Mã đơn</th>
              <th className="px-4 py-3 text-left">Sản phẩm</th>
              <th className="px-4 py-3 text-left">Tổng cộng</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-left">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.orderId}
                className="border-b border-[#e0d6d1] hover:bg-[#fff8f0] transition"
              >
                <td className="px-4 py-3 text-[#5d4037]">{index + 1}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#4e342e]">
                  {order.orderId.slice(0, 10)}...
                </td>
                <td className="px-4 py-3 text-[#3e2723]">
                  {order.items
                    .map((item) => item.name)
                    .slice(0, 2)
                    .join(", ")}
                  {order.items.length > 2 && (
                    <span className="text-[#8d6e63]">
                      {" "}
                      +{order.items.length - 2} sản phẩm
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-[#3e2723]">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#5d4037]">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                    className="px-3 py-1 text-xs bg-[#3e2723] hover:bg-[#4e342e] text-white rounded-md transition"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-[#5d4037] italic bg-[#fff8f0]"
                >
                  Bạn chưa có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrders;
