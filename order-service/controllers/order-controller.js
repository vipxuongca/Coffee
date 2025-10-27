import axios from 'axios';
import { buildOrderData } from "../controllers/order-build.js";
import Order from '../models/order-model.js';

const orderCreate = async (req, res) => {
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
};


const orderGetOne = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const { orderid } = req.params;

    // 1️⃣ Find the order by ID and ensure it belongs to the current user
    const order = await Order.findOne({ _id: orderid, userId });
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
    }

    // 2️⃣ Fetch product details for each item
    const itemsWithDetails = await Promise.all(
      order.items.map(async (item) => {
        try {
          const productRes = await axios.get(
            `http://localhost:4000/api/products/get-one/${item.productId}`
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
};


const orderGetUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    // 1️⃣ Find all orders for this user
    const orders = await Order.find({ userId });
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
                `${process.env.PRODUCT_URL}/api/products/get-one/${item.productId}`
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
};

export { orderGetOne, orderCreate, orderGetUser };