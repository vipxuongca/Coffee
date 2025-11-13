import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { CartContext } from "../context/CartContext";
import EmptyCart from "../components/layout/EmptyCart";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const {
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    cartItems,
    totalAmount,
    handleQtyChange,
  } = useContext(CartContext);

  const [draftQty, setDraftQty] = useState({});

  useEffect(() => {
    // keep local values aligned when context updates
    setDraftQty(
      cartItems.reduce((acc, item) => {
        acc[item.cartId] = item.quantity;
        return acc;
      }, {})
    );
  }, [cartItems]);

  const handleDraftChange = (cartId, val) => {
    setDraftQty((prev) => ({ ...prev, [cartId]: val }));
  };

  const handleBlur = (cartId) => {
    const value = draftQty[cartId];
    handleQtyChange(cartId, value); // your existing stock check logic
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Xóa toàn bộ giỏ hàng?",
      text: "Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#b71c1c",
      cancelButtonColor: "#6d4c41",
      width: "320px",
      customClass: {
        title: "text-base",
        popup: "p-4",
        confirmButton: "text-sm px-3 py-2",
        cancelButton: "text-sm px-3 py-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        toast.info("Đã xóa toàn bộ giỏ hàng.");
      }
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-[#f8f3ef]   shadow-inner border border-[#d7ccc8]">
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
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
  bg-[#fff8f0] border border-[#d7ccc8] shadow-sm py-2 p-4 
  hover:shadow-md transition space-y-3 sm:space-y-0"
            >
              {/* Image */}
              <Link
                to={`/product/${item.productId}`}
                className="flex justify-center sm:block"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover  border border-[#bcaaa4]"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 sm:ml-4 text-center sm:text-left">
                <Link to={`/product/${item.productId}`}>
                  <h2 className="font-semibold text-[#4e342e] text-base">
                    {item.name}
                  </h2>
                  <p className="text-sm text-[#6d4c41]">
                    {item.price.toLocaleString()}₫
                  </p>
                </Link>
              </div>
              <div>
                {/* Quantity */}
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <button
                    onClick={() => decreaseQty(item.cartId)}
                    className="bg-[#efebe9] border border-[#bcaaa4]  w-7 h-7 flex items-center justify-center text-[#4e342e] hover:bg-[#d7ccc8]"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={draftQty[item.cartId] ?? item.quantity}
                    onChange={(e) =>
                      handleDraftChange(item.cartId, e.target.value)
                    }
                    onBlur={() => handleBlur(item.cartId)}
                    className="w-12 text-center border border-[#bcaaa4]  
      [appearance:textfield] 
      [&::-webkit-inner-spin-button]:appearance-none 
      [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => increaseQty(item.cartId)}
                    className="bg-[#efebe9] border border-[#bcaaa4] w-7 h-7 flex items-center justify-center text-[#4e342e] hover:bg-[#d7ccc8]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Total + Delete */}
              <div className="flex justify-between sm:justify-end items-center sm:space-x-4 mt-2 sm:mt-0">
                <p className="font-semibold text-[#3e2723]">
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
                onClick={handleClearCart}
                className="bg-[#6d4c41] text-white px-4 py-2   hover:bg-[#5d4037]"
              >
                Xóa toàn bộ
              </button>

              <button
                className="bg-[#3e2723] text-white px-4 py-2   hover:bg-[#4e342e]"
                onClick={() => navigate("/checkout")}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
