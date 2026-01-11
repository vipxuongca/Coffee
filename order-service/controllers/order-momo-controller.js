import jwt from 'jsonwebtoken'
import { buildOrderData } from "./order-build.js";
import Order from '../models/order-model.js';

const orderCreateMomo = async (req, res) => {
  /*
Expected payload:

   */

  const PAYMENT_TTL_MINUTES = 15; // Payment expiration time
  try {
    const { items, defaultAddress, notes } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;

    console.log(defaultAddress)

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    const orderData = await buildOrderData(items, userId);
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
      paymentMethod: "MOMO",
      shippingFee: 0,
      notes: notes || "",
      status: "PROCESSING",
      paymentExpiry: new Date(Date.now() + PAYMENT_TTL_MINUTES * 60 * 1000)
    });

    await newOrder.save();



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

const handleMomoResult = async (req, res) => {
  const { orderId, status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(200).end();

  // Idempotency guard
  if (order.status === 'PAID') {
    return res.status(200).end();
  }

  if (status === 'SUCCESS') {
    order.status = 'PAID';
    await order.save();

    await postPaymentSuccess(order); // stock, cart, etc
  } else {
    order.status = 'PAYMENT_FAILED';
    await order.save();
  }

  return res.status(200).end();
};


export { orderCreateMomo, handleMomoResult }