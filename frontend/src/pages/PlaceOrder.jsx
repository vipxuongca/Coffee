import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PlaceOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4004/api/order/${orderId}`
        );
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading)
    return <div className="p-8 text-center">Đang tải đơn hàng...</div>;
  if (!order)
    return (
      <div className="p-8 text-center text-red-600">
        Không tìm thấy đơn hàng.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Xác nhận đơn hàng
      </h1>
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* --- User Detail --- */}
        <section>
          <h2 className="text-lg font-medium border-b pb-2 mb-2">
            Thông tin giao hàng
          </h2>
          <div className="text-gray-700 space-y-1">
            <p>
              <strong>Tên người nhận:</strong> {order.userDetail.receiverName}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {order.userDetail.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.userDetail.addressLine1},{" "}
              {order.userDetail.city}, {order.userDetail.state},{" "}
              {order.userDetail.country}, {order.userDetail.postalCode}
            </p>
            <p>
              <strong>Email:</strong> {order.userEmail}
            </p>
          </div>
        </section>

        {/* --- Order Items --- */}
        <section>
          <h2 className="text-lg font-medium border-b pb-2 mb-2">
            Sản phẩm đã đặt
          </h2>
          <div className="divide-y">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="py-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image?.[0]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.brand} • {item.category}
                    </p>
                    <p className="text-sm">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {(item.price * item.quantity).toLocaleString()} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Summary --- */}
        <section className="border-t pt-4">
          <div className="flex justify-between text-gray-700">
            <span>Tổng cộng:</span>
            <span>{order.total.toLocaleString()} ₫</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Phí vận chuyển:</span>
            <span>{order.shippingFee.toLocaleString()} ₫</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-2">
            <span>Thành tiền:</span>
            <span>{(order.total + order.shippingFee).toLocaleString()} ₫</span>
          </div>
        </section>

        {/* --- Payment and Status --- */}
        <section className="border-t pt-4">
          <p>
            <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Trạng thái:</strong> {order.status}
          </p>
          {order.notes && (
            <p>
              <strong>Ghi chú:</strong> {order.notes}
            </p>
          )}
        </section>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
