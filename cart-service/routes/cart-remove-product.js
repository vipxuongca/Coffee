import express from 'express';
import CartModel from '../models/cart-model.js';
import { verifyToken } from '../controllers/jwt-verify.js';

const router = express.Router();

// DELETE /api/cart/remove/:productId
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Find user's cart
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Giỏ hàng không tồn tại.' });
    }

    // Filter out product
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId !== productId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại trong giỏ.' });
    }

    await cart.save();
    res.json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công.', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Xóa sản phẩm thất bại.' });
  }
});

export default router;
