import express from 'express';
import CartModel from '../models/cart-model.js';
import { verifyToken } from '../controllers/jwt-verify.js';

const router = express.Router();

// PUT /api/cart/update/quantity/:productId
router.put('/:productId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Giỏ hàng trống.' });

    const item = cart.items.find(i => i.productId === productId);
    if (!item) return res.status(404).json({ error: 'Sản phẩm không có trong giỏ hàng.' });

    if (item.quantity <= 1) {
      // Optionally remove item
      cart.items = cart.items.filter(i => i.productId !== productId);
    } else {
      item.quantity -= 1;
    }

    await cart.save();

    res.json({ message: 'Thay đổi số lượng sản phẩm thành công.', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Thay đổi số lượng thất bại.' });
  }
});

export default router;
