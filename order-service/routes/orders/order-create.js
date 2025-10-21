import express from "express";
import Order from "../../models/order-model.js";
import { verifyToken } from "../../controllers/auth/jwt-verify.js";

const router = express.Router();

// POST /api/orders
router.post("", verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user.id; // from verifyToken middleware

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ error: "Total amount is required" });
    }

    // Create order
    const order = new Order({
      userId,
      items,
      total,
      status: "PENDING_PAYMENT"
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      id: order._id,
      status: order.status
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

export default router;
