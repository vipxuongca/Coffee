// routes/payment.js
import express from "express";
import paypalClient from "../config/paypal.js";
import CartModel from "../models/cart-model.js";
import { verifyToken } from "../controllers/auth/jwt-verify.js";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: "http://localhost:3000/payment/success", // frontend success page
        cancel_url: "http://localhost:3000/payment/cancel",
      },
    });

    const order = await paypalClient().execute(request);
    const approvalUrl = order.result.links.find(link => link.rel === "approve").href;

    res.json({ approvalUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

export default router;
