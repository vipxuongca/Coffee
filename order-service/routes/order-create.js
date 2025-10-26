import express from "express";
import Order from "../models/order-model.js";
import { verifyToken } from "../controllers/jwt-verify.js";
import { buildOrderData } from "../controllers/order-build.js";
import axios from 'axios'

const router = express.Router();

// POST /api/order/create
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, paymentMethod, notes } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    // it is working up to this verifyToken. So the token is successfully passed to this point. At least in Postman

    // So it is entirely front end error. Backend works. Front end never send tokens
    // console.log("token for order is: " + token);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    const orderData = await buildOrderData(items, token);
    if (!orderData?.user || !orderData?.userDetail || !orderData?.products) {
      return res.status(400).json({
        success: false,
        message: "Failed to build order data",
      });
    }

    // Calculate total (sum of item price * quantity)
    const total = orderData.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId: orderData.user._id,
      userEmail: orderData.user.email,
      userDetail: {
        receiverName: orderData.userDetail.receiverName,
        phone: orderData.userDetail.phone,
        addressLine1: orderData.userDetail.addressLine1,
        city: orderData.userDetail.city,
        state: orderData.userDetail.state,
        country: orderData.userDetail.country,
        postalCode: orderData.userDetail.postalCode,
      },
      items: orderData.products.map((p) => ({
        productId: p._id,
        name: p.name,
        description: p.description,
        image: p.image,
        category: p.category,
        subCategory: p.subCategory,
        variant: p.variant,
        brand: p.brand,
        discount: p.discount,
        quantity: p.quantity,
        price: p.price,
      })),
      total,
      paymentMethod: paymentMethod || "COD",
      shippingFee: 0,
      notes: notes || "",
      status: "PENDING_PAYMENT",
    });

    await newOrder.save();

    // --- Clear user's cart after successful order creation ---
    try {
      await axios.delete("http://localhost:4003/api/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (cartErr) {
      console.error("Failed to clear cart after order:", cartErr.message);
      // Do not fail the whole request if cart removal fails
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: newOrder._id,
      status: newOrder.status,
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
