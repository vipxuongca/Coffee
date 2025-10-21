import express from 'express';
import OrderModel from '../../models/order-model.js';
import { verifyToken } from '../../controllers/auth/jwt-verify.js';
import axios from 'axios';

const router = express.Router();

// GET /api/order/get-user
router.get('', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    // 1️⃣ Find all orders for this user
    const orders = await OrderModel.find({ userId });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
    }

    // 2️⃣ Fetch product details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
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

        return {
          orderId: order._id,
          items: itemsWithDetails,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt
        };
      })
    );

    // 3️⃣ Return all orders
    res.json({
      message: 'Danh sách đơn hàng:',
      orders: ordersWithDetails
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không thể tải đơn hàng.' });
  }
});

export default router;
