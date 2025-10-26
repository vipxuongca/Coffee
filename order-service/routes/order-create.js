import express from "express";
import Order from "../models/order-model.js";
import { verifyToken } from "../controllers/jwt-verify.js";
import { buildOrderData } from "../controllers/order-build.js";

const router = express.Router();

// POST /api/order/create
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    const token = req.headers.authorization.split(" ")[1];

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    const orderData = await buildOrderData(items, token);
    console.log(orderData);

    // await orderData.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      id: order._id,
      status: order.status
    });

  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: err.message,
    });
  }
});

export default router;
