import express from 'express';
import CartModel from '../models/cart-model.js';
import { verifyToken } from '../controllers/jwt-verify.js';

const router = express.Router();

// DELETE /api/cart/clear
router.delete('', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

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
});

export default router;
