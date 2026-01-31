import jwt from 'jsonwebtoken'
import { buildOrderData } from "./order-build.js";
import Order from '../models/order-model.js';
import { cartApi } from '../api/cart-api.js';
import { productApi } from '../api/product-api.js';

const orderCreateMomo = async (req, res) => {
  const PAYMENT_TTL_MINUTES = 15;

  try {
    const { items, defaultAddress, notes } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    /* ---------- STOCK CHECK (CRITICAL FIX) ---------- */
    try {
      await productApi.checkStockBulk(items);
    } catch (err) {
      return res
        .status(err.response?.status || 409)
        .json(
          err.response?.data || {
            success: false,
            code: "STOCK_UNAVAILABLE",
            message: "Một số sản phẩm không có đủ hàng trong kho",
          }
        );
    }

    /* ---------- BUILD ORDER DATA ---------- */
    const orderData = await buildOrderData(items, userId);

    if (!orderData?.products) {
      return res.status(400).json({
        success: false,
        message: "Failed to build order data",
      });
    }

    /* ---------- CALCULATE TOTAL ---------- */
    const total = orderData.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    /* ---------- CREATE ORDER ---------- */
    const newOrder = new Order({
      userId: orderData.user._id,
      userEmail: orderData.user.email,
      userDetail: defaultAddress,
      items: orderData.products,
      total,
      paymentMethod: "MOMO",
      shippingFee: 0,
      notes: notes || "",
      status: "PROCESSING",
      paymentExpiry: new Date(
        Date.now() + PAYMENT_TTL_MINUTES * 60 * 1000
      ),
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: newOrder._id,
      status: newOrder.status,
    });

  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};


const handleMomoResult = async (req, res) => {
  const { orderId, status } = req.body;

  console.log('MOMO RESULT RECEIVED -- ', req.body);

  if (!orderId || !status) {
    return res.status(400).end();
  }
  if (status !== "SUCCESS") {
    return res.status(400).end();
  }
  const order = await Order.findById(orderId);
  if (!order) return res.status(200).end();

  // Idempotency guard
  if (order.status === "PAID") {
    return res.status(200).end();
  }

  // Only PROCESSING orders can be paid
  if (order.status !== "PROCESSING") {
    return res.status(200).end();
  }

  // Transition
  order.status = "PAID";
  await order.save();

  // Side effects (must be idempotent)
  console.log('Clearing cart for user: -- ', order.userId);
  await cartApi.clearCartFromOrder(order.userId);
  console.log('Updating product stock for order items -- ', order.items);
  await productApi.deduceStock(order.items);

  return res.status(200).end();
};



export { orderCreateMomo, handleMomoResult }