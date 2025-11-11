import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { CartContext } from "../context/CartContext";
import Swal from "sweetalert2";
import { PackageCheck, ShoppingCart, CreditCard } from "lucide-react";
import UserDefaultAddress from "../components/user/UserDefaultAddress";
import PaymentMethod from "../components/PaymentMethod";
import { orderApi } from "../../api/order-api";

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

      if (!defaultAddress) {
        Swal.fire({
          icon: "warning",
          title: "Bạn chưa thêm địa chỉ mặc định",
          confirmButtonColor: "#3e2723",
          width: "300px",
          customClass: { title: "text-sm", popup: "p-2" },
        });
        return;
      }

      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        defaultAddress,
      };

      let res;

      switch (paymentMethod) {
        case "COD":
          // Backend: standard createOrder
          res = await orderApi.createOrderCOD(orderPayload);
          break;
        case "TRANSFER":
          res = await orderApi.createOrderTransfer(orderPayload);
          break;
        case "STRIPE":
          // Backend: stripe order endpoint, returns checkout URL
          res = await orderApi.createOrderStripe(orderPayload);
          break;

        default:
          return toast.error("Phương thức thanh toán không hợp lệ.");
      }

      if (!res.data.success) {
        return toast.error(res.data.message || "Đặt hàng thất bại.");
      }

      // NAVIGATION TO ORDER SUCCESS
      if (paymentMethod === "COD") {
        toast.success("Đặt hàng thành công!");
        clearCart();
        return navigate(`/place-order/${res.data.orderId}`);
      }

      if (paymentMethod === "TRANSFER") {
        toast.success("Đặt hàng thành công!");
        clearCart();
        return navigate(`/place-order/${res.data.orderId}`);
      }

      // STRIPE flow: redirect to external payment page
      if (paymentMethod === "STRIPE") {
        toast.info("Tạo đơn hàng thanh toán với STRIPE");
        return navigate(`/stripe`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra.");
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

      <PaymentMethod
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

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
