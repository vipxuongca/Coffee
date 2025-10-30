import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(ShopContext);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4004/api/order/get-one/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(res.data);
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
      <h1 className="text-2xl font-semibold mb-4 text-center text-green-600">
        ✅ Đặt hàng thành công!
      </h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* --- Order Info --- */}
        <section>
          <h2 className="text-lg font-medium border-b pb-2 mb-2">
            Mã đơn hàng: {order.orderId}
          </h2>
          <p className="text-gray-600">
            Ngày tạo: {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-700 font-medium">
            Trạng thái: <span className="text-yellow-600">{order.status}</span>
          </p>
          <p className="text-gray-700 font-medium">
            Phương thức Thanh toán:{" "}
            <span className="text-yellow-600">{order.paymentMethod}</span>
          </p>
        </section>

        {/* --- Order Items --- */}
        <section>
          <h2 className="text-lg font-medium border-b pb-2 mb-2">
            Sản phẩm đã đặt
          </h2>
          <div className="divide-y">
            {order.items.map((item) => (
              <div
                key={item._id}
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
          <div className="flex justify-between text-lg font-semibold mt-2">
            <span>Thành tiền:</span>
            <span>{order.total.toLocaleString()} ₫</span>
          </div>
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
