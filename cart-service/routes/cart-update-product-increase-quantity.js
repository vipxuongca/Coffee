import express from 'express';
import CartModel from '../models/cart-model.js';
import { verifyToken } from '../controllers/jwt-verify.js';
import axios from 'axios';

const router = express.Router();

// PUT /api/cart/update/:productId
// with the quantity in body

/*
Expected Payload:
{
  "quantity": 3
}
*/
router.put('/:productId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Check product exists and stock
    const productResponse = await axios.get(`${process.env.PRODUCT_GET_ONE}/${productId}`);
    const productData = productResponse.data;
    if (!productData) {
      return res.status(404).json({ error: 'Không có sản phẩm này.' });
    }

    let cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Giỏ hàng trống.' });

    const item = cart.items.find(i => i.productId === productId);
    if (!item) return res.status(404).json({ error: 'Sản phẩm không có trong giỏ hàng.' });

    if (item.quantity + 1 > productData.stock) {
      return res.status(400).json({ error: 'Không đủ hàng tồn kho.' });
    }

    item.quantity += 1;
    await cart.save();

    res.json({ message: 'Tăng số lượng sản phẩm thành công.', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Tăng số lượng thất bại.' });
  }
});

export default router;
