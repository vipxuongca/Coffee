import axios from 'axios';
import jwt from 'jsonwebtoken'
import { buildOrderData } from "../controllers/order-build.js";
import Order from '../models/order-model.js';
import { paymentApi } from '../api/payment-api.js';
import { cartApi } from '../api/cart-api.js';


const orderCreateCOD = async (req, res) => {
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
      paymentMethod: "COD",
      shippingFee: 0,
      notes: notes || "",
      status: "PENDING_PAYMENT",
    });

    await newOrder.save();
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    // console.log("user id is", userId)
    // --- Clear user's cart after successful order creation ---
    try {
      await cartApi.clearCartFromOrder(userId);
      console.log("success placed COD")
    } catch (cartErr) {
      console.error("Failed to clear cart after order:", cartErr.message);
      // Do not fail the whole request if cart removal fails
    }

    res.status(201).json({
      success: true,
      message: "Order created COD successfully",
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

const orderCreateTransfer = async (req, res) => {
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
      paymentMethod: "TRANSFER",
      shippingFee: 0,
      notes: notes || "",
      status: "PENDING_PAYMENT",
    });

    await newOrder.save();
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    // console.log("user id is", userId)
    // --- Clear user's cart after successful order creation ---
    try {
      await cartApi.clearCartFromOrder(userId);
      console.log('delete cart success');
    } catch (cartErr) {
      console.error("Failed to clear cart after order:", cartErr.message);
      // Do not fail the whole request if cart removal fails
    }

    res.status(201).json({
      success: true,
      message: "Order created TRANSFER successfully",
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
      status: "PENDING_PAYMENT",
    });

    await newOrder.save();
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    // console.log("user id is", userId)
    // --- Clear user's cart after successful order creation ---
    try {
      await cartApi.clearCartFromOrder(userId);
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
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      userDetail: order.userDetail
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

// Cancel an order by ID
const orderCancel = async (req, res) => {
  try {
    const { orderid } = req.params;
    console.log("orderid", orderid)

    // Find the user's order
    const order = await Order.findById(orderid);
    console.log(order)
    if (!order) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng.' });
    }

    // Validate status
    if (order.status !== "PENDING_PAYMENT") {
      return res.status(400).json({ success: false, message: "Không thể hủy đơn hàng đã thanh toán hoặc đã xử lý." });
    }

    // Update status
    order.status = "CANCELLED";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Đơn hàng đã được hủy thành công.",
      order
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi khi hủy đơn hàng.", error: err.message });
  }
};

const verifyStripe = async (req, res) => {
  try {

  } catch (error) {

  }
}


export { orderGetOne, orderCreateCOD, orderGetUser, orderCancel, orderCreateStripe, orderCreateTransfer };