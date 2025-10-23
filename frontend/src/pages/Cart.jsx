import React, { useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sản phẩm A",
      price: 120000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "Sản phẩm B",
      price: 85000,
      quantity: 2,
      image: "https://via.placeholder.com/80",
    },
  ]);

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleQtyChange = (id, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0) {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
    }
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
              {/* Product image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />

              {/* Product details */}
              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600 text-sm">{item.price}₫</p>
              </div>

              {/* Quantity controls */}
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

              {/* Total + remove */}
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

          {/* Cart total */}
          <div className="text-right mt-6 border-t pt-4">
            <p className="text-lg font-semibold">
              Tổng cộng: {total.toLocaleString()}₫
            </p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
