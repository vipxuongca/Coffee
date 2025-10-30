import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const { token, setLoading } = useContext(ShopContext);
  const { updateCartContext } = useContext(CartContext);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4003/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.items.map((item) => ({
          cartId: item._id,
          productId: item.product.product._id,
          name: item.product.product.name,
          price: item.product.product.price,
          quantity: item.quantity,
          image: item.product.product.image[0],
        }));

        setCartItems(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCart();
  }, [token]);

  const increaseQty = async (cartId) => {
    try {
      const item = cartItems.find((i) => i.cartId === cartId);
      if (!item) return;

      setCartItems((prev) =>
        prev.map((i) =>
          i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );

      await axios.put(
        `http://localhost:4003/api/cart/update/${item.productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await updateCartContext();
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  const decreaseQty = async (cartId) => {
    try {
      const item = cartItems.find((i) => i.cartId === cartId);
      if (!item || item.quantity <= 1) return;

      setCartItems((prev) =>
        prev.map((i) =>
          i.cartId === cartId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );

      await axios.put(
        `http://localhost:4003/api/cart/update/decrease/${item.productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await updateCartContext();
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  };

  const handleQtyChange = async (cartId, value) => {
    try {
      const item = cartItems.find((i) => i.cartId === cartId);
      const quantity = Number.parseInt(value, 10);
      if (!item) return;
      if (!Number.isNaN(quantity) & (quantity > 0)) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.cartId === cartId ? { ...item, quantity: quantity } : item
          )
        );
      }

      await axios.put(
        `http://localhost:4003/api/cart/update/quantity/${item.productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await updateCartContext();
    } catch (err) {
      toast.error("Có lỗi xảy ra khi thay đổi số lượng");
      console.error("Error changing quantity:", err);
    }
  };

  const removeItem = async (cartId) => {
    try {
      const item = cartItems.find((i) => i.cartId === cartId);
      if (!item) return;

      setCartItems((prev) => prev.filter((i) => i.cartId !== cartId));

      await axios.delete(
        `http://localhost:4003/api/cart/remove/${item.productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await updateCartContext();
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:4003/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
      await updateCartContext();
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
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

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-8 max-w-4xl mx-auto bg-[#f8f3ef] rounded-xl shadow-inner border border-[#d7ccc8]">
      <h1 className="text-2xl font-bold mb-6 text-[#3e2723] border-b border-[#a1887f] pb-2">
        Giỏ hàng
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-[#6d4c41] italic">Giỏ hàng trống.</p>
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
                  className="bg-[#efebe9] border border-[#bcaaa4] rounded-full w-7 h-7 text-[#4e342e] hover:bg-[#d7ccc8]"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQtyChange(item.cartId, e.target.value)}
                  className="w-12 text-center border border-[#bcaaa4] rounded-md text-[#3e2723] 
             [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  onClick={() => increaseQty(item.cartId)}
                  className="bg-[#efebe9] border border-[#bcaaa4] rounded-full w-7 h-7 text-[#4e342e] hover:bg-[#d7ccc8]"
                >
                  +
                </button>
              </div>

              <div className="flex items-center space-x-4 ml-6">
                <p className="font-semibold w-20 text-right text-[#3e2723]">
                  {(item.price * item.quantity).toLocaleString()}₫
                </p>
                <button
                  onClick={() => removeItem(item.cartId)}
                  className="text-[#b71c1c] hover:underline text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6 border-t border-[#a1887f] pt-4">
            <p className="text-lg font-semibold text-[#3e2723]">
              Tổng cộng: {total.toLocaleString()}₫
            </p>
            <div className="mt-4 space-x-3">
              <button
                onClick={clearCart}
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
    </div>
  );
};

export default Cart;
