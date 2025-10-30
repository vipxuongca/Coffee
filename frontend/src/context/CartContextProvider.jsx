import { CartContext } from "./CartContext";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "./ShopContext";

const CartContextProvider = (props) => {
  // import context
  const { token, backendCartUrl } = useContext(ShopContext);

  // states
  const [cartCountTotal, setCartCountTotal] = useState(0); // nav bar show
  const [cartItems, setCartItems] = useState([]);

  //function
  const updateCartContext = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:4003/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data.items || [];

      // total number of all products in the cart
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCountTotal(totalItems);

      // store structured cart item count list
      const itemList = items.map((item) => ({
        productId: item.productId,
        count: item.quantity,
      }));
      setCartItems(itemList);
    } catch (err) {
      console.error("Failed to fetch cart count:", err.message);
      setCartCountTotal(0);
      setCartItems([]);
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
  };

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
};

export default CartContextProvider;
