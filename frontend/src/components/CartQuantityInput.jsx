import debounce from "lodash.debounce";
import axios from "axios";
import { useRef, useContext } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { CartContext } from "../context/CartContext";

const CartQuantityInput = ({ currentQuantity, cartId, productId }) => {
  const { token } = useContext(ShopContext);
  const { updateCartContext, verifyStockCount, setCartItems } =
    useContext(CartContext);
  const debouncedUpdateQty = useRef(
    debounce(async (productId, quantity) => {
      try {
        // Verify stock before committing
        const stockAvailable = await verifyStockCount(productId, quantity);
        if (!stockAvailable.success) {
          toast.warning(`Không đủ hàng trong kho. `), await updateCartContext();
          return;
        }

        // Sync with backend
        await axios.put(
          `http://localhost:4003/api/cart/update/quantity/${productId}`,
          { quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await updateCartContext();
      } catch (err) {
        console.error("Error updating quantity:", err);
        toast.error("Có lỗi xảy ra khi thay đổi số lượng");
      }
    }, 500)
  ).current;

  const handleQtyChange = (cartId, value) => {
    const quantity = parseInt(value, 10);
    if (Number.isNaN(quantity) || quantity <= 0) return;

    setCartItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
    );

    if (productId) debouncedUpdateQty(productId, quantity);
  };

  return (
    <input
      type="number"
      min="1"
      value={currentQuantity}
      onChange={(e) => handleQtyChange(cartId, e.target.value)}
      className="w-12 text-center border border-[#bcaaa4] rounded-md text-[#3e2723] 
             [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
};

export default CartQuantityInput;
