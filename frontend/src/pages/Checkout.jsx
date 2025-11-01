import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { CartContext } from "../context/CartContext";
import {
  PackageCheck,
  ShoppingCart,
  CreditCard,
  MapPin,
  Pencil,
} from "lucide-react";
import UserDefaultAddress from "../components/user/UserDefaultAddress";

const Checkout = () => {
  const navigate = useNavigate();
  const { token, setLoading, defaultAddress } = useContext(ShopContext);
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // console.log(defaultAddress);
  const handleOrderPlacement = async () => {
    try {
      setLoading(true);
      if (!token) return toast.error("Bạn cần đăng nhập để đặt hàng.");

      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod,
        defaultAddress,
      };

      const res = await axios.post(
        "http://localhost:4004/api/order/create",
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Đặt hàng thành công!");
        clearCart();
        navigate(`/place-order/${res.data.orderId}`);
      } else {
        toast.error(
          "Đặt hàng thất bại: " + (res.data.message || "Lỗi không xác định.")
        );
      }
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <ShoppingCart className="w-12 h-12 mb-4" />
        <p>Giỏ hàng của bạn đang trống.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#3e2723] border-b border-[#a1887f] pb-2 flex items-center gap-2 mb-6">
        <PackageCheck className="w-6 h-6 text-[#4e342e]" />
        Xác nhận đơn hàng
      </h1>

      <UserDefaultAddress />
      <div className="max-w-3xl mx-auto p-8 bg-[#f8f3ef] rounded-xl shadow-inner border border-[#d7ccc8] mt-10">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cartId}
              className="flex items-center justify-between bg-[#fff8f0] border border-[#d7ccc8] shadow-sm rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border border-[#bcaaa4]"
                />
                <div>
                  <h2 className="font-semibold text-[#4e342e]">{item.name}</h2>
                  <p className="text-sm text-[#6d4c41]">
                    {item.price.toLocaleString()}₫ × {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-[#3e2723]">
                {(item.price * item.quantity).toLocaleString()}₫
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-[#a1887f] pt-4 flex justify-between text-[#3e2723]">
          <span className="font-semibold text-lg">Tổng cộng:</span>
          <span className="font-bold text-lg">
            {totalAmount.toLocaleString()}₫
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8 bg-[#f8f3ef] rounded-xl shadow-inner border border-[#d7ccc8] mt-10">
        <div className="mb-6">
          <label className="block text-[#4e342e] font-semibold mb-2">
            Phương thức thanh toán
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-[#a1887f] rounded-lg p-2 bg-white text-[#3e2723]"
          >
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="CARD">Thẻ tín dụng / ghi nợ</option>
            <option value="TRANSFER">Chuyển khoản ngân hàng</option>
            <option value="PAYMENT_GATEWAY">Cổng Thanh Toán</option>
          </select>
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-3">
        <button
          onClick={() => navigate("/cart")}
          className="bg-[#6d4c41] text-white px-5 py-2 rounded-md hover:bg-[#5d4037]"
        >
          Quay lại giỏ hàng
        </button>
        <button
          onClick={handleOrderPlacement}
          className="bg-[#3e2723] text-white px-5 py-2 rounded-md hover:bg-[#4e342e] flex items-center gap-2"
        >
          <CreditCard size={16} />
          XÁC NHẬN ĐẶT HÀNG
        </button>
      </div>
    </div>
  );
};

export default Checkout;
