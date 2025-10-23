import express from 'express';
import CartModel from '../models/cart-model.js';
import { verifyToken } from '../controllers/jwt-verify.js';
import axios from 'axios';

const router = express.Router();

// POST /api/cart/add/:productId

/*
Expected Payload:
{

  "quantity": 2
}
*/
router.post('/:productId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(req.user);
    console.log(req.user.id);
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Số lượng sản phẩm không hợp lệ.' });
    }

    const fetchURI = `${process.env.PRODUCT_GET_ONE}/${productId}`;
    console.log('Fetch URI:', fetchURI);
    const productResponse = await axios.get(fetchURI);
    const productData = productResponse.data;

    if (!productData) {
      return res.status(404).json({ error: 'Không có sản phẩm này.' });
    }

    // Stock check
    if (quantity > productData.stock) {
      return res.status(400).json({ error: 'Không đủ hàng tồn kho.' });
    }

    // create cart if this user does not have one at the moment
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.json({
      message: 'Thêm sản phẩm vào giỏ hàng thành công.',
      cart
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Thêm sản phẩm thất bại.' });
  }
});

export default router;
