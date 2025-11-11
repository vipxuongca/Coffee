import { paymentApi } from '../api/payment-api.js'
import { cartApi } from '../api/cart-api.js';
import axios from 'axios';
import jwt from 'jsonwebtoken'
import { buildOrderData } from "../controllers/order-build.js";
import Order from '../models/order-model.js';

const orderCreateStripe = async (req, res) => {
  /*
Expected payload:

   */
  try {
    const { items, defaultAddress, notes } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    console.log(defaultAddress)

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
        receiverName: defaultAddress.receiverName,
        phone: defaultAddress.phone,
        addressLine1: defaultAddress.addressLine1,
        ward: defaultAddress.ward,
        city: defaultAddress.city,
        isDefault: defaultAddress.isDefault,
      },
      items: orderData.products.map((p) => ({
        productId: p._id,
        name: p.name,
        description: p.description,
        longDescription: p.longDescription,
        image: p.image,
        category: p.category,
        subCategory: p.subCategory,
        variant: p.variant,
        brand: p.brand,
        discount: p.discount,
        quantity: p.quantity,
        price: p.price,
        warranty: p.warranty,
        packageType: p.packageType,
        packageDetail: p.packageDetail
      })),
      total,
      paymentMethod: "STRIPE",
      shippingFee: 0,
      notes: notes || "",
      status: "PROCESSING",
    });

    await newOrder.save();
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;


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
};

const verifyStripe = async (req, res) => {
  try {

  } catch (error) {

  }
}

const orderAbandon = async (req, res) => {

}

export { orderCreateStripe, orderAbandon }