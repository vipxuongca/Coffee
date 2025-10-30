import { CartContext } from "./CartContext";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "./ShopContext";

const CartContextProvider = (props) => {
  // import context
  const { token, backendCartUrl, setLoading } = useContext(ShopContext);

  // states
  const [cartCountTotal, setCartCountTotal] = useState(0); // nav bar show
  const [cartItems, setCartItems] = useState([]);

  const verifyStockCount = async (productId, quantity) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/product/stock/${productId}`,
        { quantity },
        {}
      );
      // console.log("message:", res.data.message);
      return res.data;
    } catch (err) {
      console.error("Cart API error:", err.response?.data || err.message);
    }
  };

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

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const getQuantityByProductId = (productId) => {
    // console.log("function input productId:", productId);
    // console.log("typeof input:", typeof productId);
    // console.log("typeof item.productId:", typeof cartItems[0].productId);

    const item = cartItems.find((i) => i.productId == productId);
    // console.log("here is the current items: ", cartItems);
    // console.log(item);

    return item ? item.quantity : 0;
  };

  //function
  const updateCartContext = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:4003/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data.items || [];
      // console.log("item is: ", items);

      // total number of all products in the cart
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCountTotal(totalItems);

      //store structured cart item count list
      const itemList = items.map((item) => ({
        cartId: item._id,
        productId: item.productId,
        name: item.product.product.name,
        quantity: item.quantity,
        image: item.product.product.image[0],
        price: item.product.product.price,
      }));
      setCartItems(itemList);
    } catch (err) {
      console.error("Failed to fetch cart count:", err.message);
      setCartCountTotal(0);
      setCartItems([]);
    }
  };

  //   useEffect(() => {
  //   console.log("cartItems updated:", cartItems);
  // }, [cartItems]);

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

  const cartAdd = async (productId, quantity) => {
    const stockAvailable = await verifyStockCount(productId, quantity);
    if (!stockAvailable.success) {
      toast.error("Không đủ hàng trong kho");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:4003/api/cart/add/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Cart updated:", res.data);
      await updateCartContext();
      toast.success("Thêm vào giỏ hàng thành công");
    } catch (err) {
      console.error("Cart API error:", err.response?.data || err.message);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  useEffect(() => {
    updateCartContext();
  }, [token]);

  const value = {
    cartCountTotal,
    setCartCountTotal,
    updateCartContext,
    cartItems,
    setCartItems,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    totalAmount,
    verifyStockCount,
    getQuantityByProductId,
    cartAdd,
  };

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
};

export default CartContextProvider;
