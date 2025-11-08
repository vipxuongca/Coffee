import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../../api/order-api";

const Orders = () => {
  const { token } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState({
    PAID: true,
    PENDING_PAYMENT: true,
    CANCELLED: true,
    PROCESSING: true,
    FAILED: true,
    REFUNDED: true,
  });
  const toggleStatus = (status) => {
    setStatusFilter((prev) => ({ ...prev, [status]: !prev[status] }));
  };
  const filteredOrders = orders.filter((o) => statusFilter[o.status]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getAllOrder();
        if (res.data && res.data.orders) {
          setOrders(res.data.orders);
        }
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
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "FAILED":
        return "bg-black-100 text-white-800";
      case "REFUNDED":
        return "bg-purple-100 text-white-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h2>

      {/* ------------------Filter----------------- */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(statusFilter).map((status) => {
          const active = statusFilter[status];

          return (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`px-3 py-1 text-xs rounded-md border transition
          ${
            active
              ? "bg-[#3e2723] text-white border-[#3e2723]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
            >
              {status.replace("_", " ")}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Sản phẩm</th>
              <th className="px-4 py-3">Đơn giá</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {[...filteredOrders].reverse().map((order, index) => (
              <tr
                key={order.orderId}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-600 font-medium">
                  {index + 1}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {order.orderId.slice(0, 10)}...
                </td>
                <td className="px-4 py-3">
                  {order.items
                    .map((item) => item.name)
                    .slice(0, 2)
                    .join(", ")}
                  {order.items.length > 2 && (
                    <span className="text-gray-400">
                      {" "}
                      +{order.items.length - 2} more
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">
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
                <td className="px-4 py-3 text-gray-600">
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
                  className="text-center py-6 text-gray-500 italic"
                >
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
