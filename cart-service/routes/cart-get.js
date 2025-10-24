import express from 'express';
import CartModel from '../models/cart-model.js';
import { verifyToken } from '../controllers/jwt-verify.js';
import axios from 'axios';

const router = express.Router();

// GET /api/cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user's cart
    const cart = await CartModel.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.json({ message: 'Giỏ hàng trống.', items: [] });
    }

    // Fetch product details for each item
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const fetchURI = `${process.env.PRODUCT_GET_ONE}/${item.productId}`;
          const productRes = await axios.get(fetchURI);
          // console.log('Fetched product:', productRes.data);
          return {
            ...item.toObject(),
            product: productRes.data
          };
        } catch {
          return {
            ...item.toObject(),
            product: null
          };
        }
      })
    );

    res.json({
      message: 'Giỏ hàng của bạn:',
      items: itemsWithDetails
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không thể tải giỏ hàng.' });
  }
});

export default router;
