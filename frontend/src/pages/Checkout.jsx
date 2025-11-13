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
    <div className="w-full bg-[#faf6f3] min-h-screen py-10 px-8">
      <div className="max-w-7xl mx-auto">
        {/* PAGE TITLE */}
        {/* PAGE TITLE + ACTION BUTTONS */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 border-b border-[#d7ccc8] pb-4">
          <h1 className="text-3xl font-semibold text-[#3e2723] flex items-center gap-3">
            <PackageCheck className="w-7 h-7 text-[#4e342e]" />
            Xác nhận đơn hàng
          </h1>

          <div className="flex gap-3 mt-4 lg:mt-0">
            <button
              onClick={() => navigate("/cart")}
              className="bg-[#6d4c41] text-white px-5 py-2   hover:bg-[#5d4037] transition"
            >
              Quay lại giỏ hàng
            </button>
            <button
              onClick={handleOrderPlacement}
              className="bg-[#3e2723] text-white px-5 py-2   hover:bg-[#4e342e] flex items-center gap-2 transition"
            >
              <CreditCard size={16} />
              XÁC NHẬN ĐẶT HÀNG
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LEFT SIDE: Address + Cart */}
          <div className="lg:col-span-1 space-y-4">
            {/* ADDRESS SECTION */}
            <div className="bg-white shadow-sm border border-[#e0d6d2] p-6">
              <UserDefaultAddress />
            </div>

            {/* CART SECTION */}
            <div className="bg-white   shadow-sm border border-[#e0d6d2] p-6">
              <h2 className="text-lg font-semibold text-[#4e342e] mb-4">
                Sản phẩm trong đơn hàng
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex items-center justify-between border-b border-[#f0e6e2] pb-3"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover   border border-[#d7ccc8]"
                      />
                      <div>
                        <h3 className="font-medium text-[#3e2723]">
                          {item.name}
                        </h3>
                        <p className="text-sm text-[#6d4c41]">
                          {item.price.toLocaleString()}₫ × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-[#4e342e]">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center border-t border-[#e0d6d2] pt-4">
                <span className="text-lg font-medium text-[#3e2723]">
                  Tổng cộng:
                </span>
                <span className="text-xl font-bold text-[#4e342e]">
                  {totalAmount.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Payment + Action */}
          <div className="lg:col-span-1">
            <div className="bg-white   shadow-sm border border-[#e0d6d2] p-6 sticky top-10">
              <h2 className="text-lg font-semibold text-[#4e342e] mb-4">
                Phương thức thanh toán
              </h2>

              <PaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
