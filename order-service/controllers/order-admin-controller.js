import axios from 'axios';
import OrderModel from '../models/order-model.js';

const orderGet = async (req, res) => {
  // GET  http://localhost:4004/order/admin/get
  // with JWT of ADMIN

  try {
    const adminId = req.admin.id;
    console.log(adminId);

    // some authorisation here

    // 1️⃣ Find all orders for this user
    const orders = await OrderModel.find();
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


export { orderGet, orderGetOne, orderCancel };