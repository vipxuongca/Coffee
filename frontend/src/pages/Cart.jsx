import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:4003/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.items.map((item) => ({
          id: item._id,
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

  // Increase quantity (+)
  const increaseQty = async (id) => {
    try {
      const item = cartItems.find((i) => i.id === id);
      if (!item) return;

      // Optimistic UI update
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
      );

      // Backend call (productId in URL)
      await axios.put(
        `http://localhost:4003/api/cart/update/${item.productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  // Decrease quantity (-)
  const decreaseQty = async (id) => {
    try {
      const item = cartItems.find((i) => i.id === id);
      if (!item || item.quantity <= 1) return;

      // Optimistic UI update
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
      );

      // Backend call (productId in URL)
      await axios.put(
        `http://localhost:4003/api/cart/update/decrease/${item.productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  };

  // Manual quantity change (optional)
  const handleQtyChange = (id, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0) {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
    }
  };

  // Remove item
  const removeItem = async (id) => {
    try {
      const item = cartItems.find((i) => i.id === id);
      if (!item) return;

      setCartItems((prev) => prev.filter((i) => i.id !== id));

      await axios.delete(
        `http://localhost:4003/api/cart/remove/${item.productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:4003/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]); // Clear UI
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) return <p className="text-center p-6">Đang tải...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Giỏ hàng trống.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow-md rounded-xl p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600 text-sm">
                  {item.price.toLocaleString()}₫
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="bg-gray-200 rounded-full w-7 h-7 text-center"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQtyChange(item.id, e.target.value)}
                  className="w-12 text-center border rounded-md"
                />
                <button
                  onClick={() => increaseQty(item.id)}
                  className="bg-gray-200 rounded-full w-7 h-7 text-center"
                >
                  +
                </button>
              </div>

              <div className="flex items-center space-x-4 ml-6">
                <p className="font-semibold w-20 text-right">
                  {(item.price * item.quantity).toLocaleString()}₫
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6 border-t pt-4">
            <p className="text-lg font-semibold">
              Tổng cộng: {total.toLocaleString()}₫
            </p>
            <div className="mt-4 space-x-3">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Xóa toàn bộ
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
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
