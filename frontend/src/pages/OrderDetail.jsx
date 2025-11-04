import React from "react";

const OrderDetail = ({ orders }) => {
  if (!orders || orders.length === 0)
    return <p className="text-center text-gray-500 mt-4">Không có đơn hàng nào.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Danh sách đơn hàng</h2>

      {orders.map((order) => (
        <div
          key={order.orderId}
          className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700">
              Mã đơn: {order.orderId}
            </h3>
            <span
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                order.status === "PENDING_PAYMENT"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.status === "PENDING_PAYMENT"
                ? "Chờ thanh toán"
                : order.status}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            Ngày tạo: {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>

          <div className="border-t border-gray-200 mt-2 pt-3 space-y-3">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-4 border-b border-gray-100 pb-3 last:border-b-0"
              >
                <img
                  src={item.image?.[0]}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Số lượng: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    Giá: {item.price.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right mt-3 font-semibold text-gray-800">
            Tổng cộng: {order.total.toLocaleString("vi-VN")}₫
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetail;
