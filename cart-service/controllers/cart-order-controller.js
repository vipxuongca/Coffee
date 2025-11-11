import CartModel from '../models/cart-model.js';

const cartClearFromOrder = async (req, res) => {
  /*
  PUT
  http://localhost:4003/api/cart/order/clear
  User Token needed
  Expected Payload:
  {
    "userId": "useridnumber"
  }
  */
  try {
    const { userId } = req.body;

    // Find user's cart
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Giỏ hàng không tồn tại.' });
    }

    // Clear all items
    cart.items = [];
    await cart.save();

    res.json({ message: 'Giỏ hàng đã được xóa thành công.', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Xóa giỏ hàng thất bại.' });
  }
};

export {
  cartClearFromOrder
}