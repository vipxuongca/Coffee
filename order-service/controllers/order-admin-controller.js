import axios from 'axios';
import OrderModel from '../models/order-model.js';
import { productApi } from '../api/product-api.js';

const orderGet = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Count total orders
    const totalOrders = await OrderModel.countDocuments();

    // Paginated query
    const orders = await OrderModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    // Attach product details
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
                product: productRes.data,
              };
            } catch {
              return {
                ...item.toObject(),
                product: null,
              };
            }
          })
        );

        return {
          orderId: order._id,
          items: itemsWithDetails,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        };
      })
    );

    res.json({
      message: "Danh sách đơn hàng:",
      page,
      limit,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      orders: ordersWithDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể tải đơn hàng." });
  }
};


const orderGetOne = async (req, res) => {
  try {
    const { orderid } = req.params;

    const order = await OrderModel.findOne({ _id: orderid });
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

const orderCancel = async (req, res) => {
  try {
    const { orderid } = req.params;
    console.log("orderid", orderid)

    // Find the user's order
    const order = await OrderModel.findById(orderid);
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

const orderConfirmPayment = async (req, res) => {
  try {
    const { orderid } = req.params;

    const order = await OrderModel.findById(orderid);
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    if (order.status !== "PENDING_PAYMENT") {
      return res.status(400).json({ success: false, message: "Đơn hàng không ở trạng thái chờ thanh toán." });
    }

    // Build payload exactly in correct form
    const items = order.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    // console.log(items)

    // Call stock deduction API
    await productApi.deduceStock(items);

    // Update order status
    order.status = "PAID";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Xác nhận thanh toán thành công và đã trừ tồn kho.",
      order
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi trong quá trình xử lý.", error: err.message });
  }
};


export { orderGet, orderGetOne, orderCancel, orderConfirmPayment };