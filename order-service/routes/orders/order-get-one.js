import express from 'express';
import OrderModel from '../../models/order-model.js';
import { verifyToken } from '../../controllers/auth/jwt-verify.js';
import axios from 'axios';

const router = express.Router();

// GET /api/order/:orderId
router.get('/:orderid', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const { orderid } = req.params;

    // 1️⃣ Find the order by ID and ensure it belongs to the current user
    const order = await OrderModel.findOne({ _id: orderid, userId });
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
    }

    // 2️⃣ Fetch product details for each item
    const itemsWithDetails = await Promise.all(
      order.items.map(async (item) => {
        try {
          const productRes = await axios.get(
            `http://localhost:6001/api/products/get-one/${item.productId}`
          );
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

    // 3️⃣ Respond with the order + product details
    res.json({
      message: 'Chi tiết đơn hàng:',
      orderId: order._id,
      items: itemsWithDetails,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không thể tải đơn hàng.' });
  }
});

export default router;
