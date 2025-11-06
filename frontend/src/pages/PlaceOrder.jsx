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
  }, [orderId, token]);

  if (loading)
    return <div className="p-8 text-center text-[#5d4037]">Đang tải đơn hàng...</div>;
  if (!order)
    return (
      <div className="p-8 text-center text-red-600">
        Không tìm thấy đơn hàng.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4 text-center text-[#4e342e]">
        ✅ Đặt hàng thành công!
      </h1>

      <div className="bg-[#f8f3ef] border border-[#d7ccc8] rounded-xl shadow-inner p-6 space-y-6 text-[#3e2723]">
        <section>
          <h2 className="text-lg font-medium border-b border-[#d7ccc8] pb-2 mb-2 text-[#4e342e]">
            Mã đơn hàng: {order.orderId}
          </h2>
          <p className="text-sm text-[#6d4c41]">
            Ngày tạo: {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-sm font-medium">
            Trạng thái: <span className="text-[#6d4c41]">{order.status}</span>
          </p>
          <p className="text-sm font-medium">
            Phương thức thanh toán: <span className="text-[#6d4c41]">{order.paymentMethod}</span>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium border-b border-[#d7ccc8] pb-2 mb-2 text-[#4e342e]">
            Sản phẩm đã đặt
          </h2>
          <div className="divide-y divide-[#d7ccc8]">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="py-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image?.[0]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border border-[#d7ccc8]"
                  />
                  <div>
                    <p className="font-semibold text-[#4e342e]">{item.name}</p>
                    <p className="text-xs text-[#6d4c41]">
                      {item.brand} • {item.category}
                    </p>
                    <p className="text-xs">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right font-semibold text-[#4e342e]">
                  {(item.price * item.quantity).toLocaleString()} ₫
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[#d7ccc8] pt-4">
          <div className="flex justify-between text-lg font-semibold text-[#4e342e] mt-2">
            <span>Thành tiền:</span>
            <span>{order.total.toLocaleString()} ₫</span>
          </div>
        </section>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="bg-[#6d4c41] hover:bg-[#5d4037] text-white py-2 px-4 rounded shadow"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;