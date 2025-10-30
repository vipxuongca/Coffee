import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { CartContext } from "../context/CartContext";
import EmptyCart from "../components/EmptyCart";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Package,
} from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { token, setLoading } = useContext(ShopContext);
  const {
    updateCartContext,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    cartItems,
    totalAmount,
    setCartItems,
    handleQtyChange,
  } = useContext(CartContext);

  const [tempQty, setTempQty] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLocalChange = (cartId, value) => {
    setTempQty((prev) => ({ ...prev, [cartId]: value }));
  };

  const handleOrderPlacement = async () => {
    try {
      setLoading(true);
      if (!token) return toast.error("Bạn cần đăng nhập để đặt hàng.");

      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const res = await axios.post(
        "http://localhost:4004/api/order/create",
        orderPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Đặt hàng thành công!");
        setCartItems([]);
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

  return (
    <div className="p-8 max-w-4xl mx-auto bg-[#f8f3ef] rounded-xl shadow-inner border border-[#d7ccc8]">
      <h1 className="text-2xl font-bold mb-6 text-[#3e2723] border-b border-[#a1887f] pb-2 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-[#4e342e]" />
        Giỏ hàng
      </h1>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cartId}
              className="flex items-center justify-between bg-[#fff8f0] border border-[#d7ccc8] shadow-sm rounded-xl p-4 hover:shadow-md transition"
            >
              <Link to={`/product/${item.productId}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-[#bcaaa4]"
                />
              </Link>

              <div className="flex-1 ml-4">
                <Link to={`/product/${item.productId}`}>
                  <h2 className="font-semibold text-[#4e342e]">{item.name}</h2>
                  <p className="text-sm text-[#6d4c41]">
                    {item.price.toLocaleString()}₫
                  </p>
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => decreaseQty(item.cartId)}
                  className="bg-[#efebe9] border border-[#bcaaa4] rounded-full w-7 h-7 flex items-center justify-center text-[#4e342e] hover:bg-[#d7ccc8]"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={tempQty[item.cartId] ?? item.quantity}
                  onChange={(e) =>
                    handleLocalChange(item.cartId, e.target.value)
                  }
                  onBlur={(e) => handleQtyChange(item.cartId, e.target.value)}
                  className="w-12 text-center border border-[#bcaaa4] rounded-md text-[#3e2723]
     [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
     [&::-webkit-outer-spin-button]:appearance-none"
                />

                <button
                  onClick={() => increaseQty(item.cartId)}
                  className="bg-[#efebe9] border border-[#bcaaa4] rounded-full w-7 h-7 flex items-center justify-center text-[#4e342e] hover:bg-[#d7ccc8]"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex items-center space-x-4 ml-6">
                <p className="font-semibold w-20 text-right text-[#3e2723]">
                  {(item.price * item.quantity).toLocaleString()}₫
                </p>
                <button
                  onClick={() => removeItem(item.cartId)}
                  className="text-[#b71c1c] hover:text-[#d32f2f] flex items-center gap-1 text-sm"
                >
                  <Trash2 size={14} />
                  Xóa
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6 border-t border-[#a1887f] pt-4">
            <p className="text-lg font-semibold text-[#3e2723]">
              Tổng cộng: {totalAmount.toLocaleString()}₫
            </p>
            <div className="mt-4 space-x-3">
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-[#6d4c41] text-white px-4 py-2 rounded-md hover:bg-[#5d4037]"
              >
                Xóa toàn bộ
              </button>

              <button
                className="bg-[#3e2723] text-white px-4 py-2 rounded-md hover:bg-[#4e342e]"
                onClick={handleOrderPlacement}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#fff8f0] border border-[#bcaaa4] p-6 rounded-2xl shadow-lg text-center max-w-sm mx-auto">
            <h2 className="text-lg font-semibold text-[#3e2723] mb-3">
              Xóa toàn bộ giỏ hàng?
            </h2>
            <p className="text-sm text-[#6d4c41] mb-6">
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  clearCart();
                  setShowConfirm(false);
                  toast.info("Đã xóa toàn bộ giỏ hàng.");
                }}
                className="bg-[#b71c1c] text-white px-4 py-2 rounded-md hover:bg-[#d32f2f]"
              >
                Xóa
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-[#efebe9] text-[#3e2723] px-4 py-2 rounded-md border border-[#bcaaa4] hover:bg-[#d7ccc8]"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
