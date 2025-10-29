import CartModel from '../models/cart-model.js';
import axios from 'axios';
import { productApi } from '../config/api.js';

const cartGet = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user's cart
    const cart = await CartModel.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.json({ message: 'Giỏ hàng trống.', items: [] });
    }

    // Fetch product details for each item
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const fetchURI = `${productApi.getOneProduct}/${item.productId}`;
          const productRes = await axios.get(fetchURI);
          // console.log('Fetched product:', productRes.data);
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

    res.json({
      message: 'Giỏ hàng của bạn:',
      items: itemsWithDetails
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không thể tải giỏ hàng.' });
  }
};

const cartAdd = async (req, res) => {
  /*
  POST
  http://localhost:4003/api/cart/:productId
  User Token needed
  Expected Payload:
  {
    "quantity": 2
  }
  */

  try {
    const userId = req.user.id;
    console.log(req.user);
    console.log(req.user.id);
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Số lượng sản phẩm không hợp lệ.' });
    }

    const fetchURI = `${productApi.getOneProduct}/${productId}`;
    console.log('Fetch URI:', fetchURI);
    const productResponse = await axios.get(fetchURI);
    const productData = productResponse.data;

    if (!productData) {
      return res.status(404).json({ error: 'Không có sản phẩm này.' });
    }

    // Stock check
    if (quantity > productData.stock) {
      return res.status(400).json({ error: 'Không đủ hàng tồn kho.' });
    }

    // create cart if this user does not have one at the moment
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.json({
      message: 'Thêm sản phẩm vào giỏ hàng thành công.',
      cart
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Thêm sản phẩm thất bại.' });
  }
};

const cartClear = async (req, res) => {
  /*
  DELETE
  http://localhost:4003/api/cart/:productId
  User Token needed
  Expected Payload:
  {
    "quantity": 2
  }
  */
  try {
    const userId = req.user.id;

    // Find user's cart
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Giỏ hàng không tồn tại.' });
    }

    // Clear all items
    cart.items = [];
    await cart.save();

    res.json({ message: 'Giỏ hàng đã được xóa thành công.', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Xóa giỏ hàng thất bại.' });
  }
};

const cartRemoveItem = async (req, res) => {
  // DELETE /api/cart/remove/:productId
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Find user's cart
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Giỏ hàng không tồn tại.' });
    }

    // Filter out product
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId !== productId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại trong giỏ.' });
    }

    await cart.save();
    res.json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công.', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Xóa sản phẩm thất bại.' });
  }
};

const cartUpdateItemDecrease = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Giỏ hàng trống.' });

    // Find item by matching ObjectId correctly
    const item = cart.items.find(i => i.productId.toString() === productId);
    if (!item)
      return res.status(404).json({ error: 'Sản phẩm không có trong giỏ hàng.' });

    // If quantity is 1 or less, remove the item
    if (item.quantity <= 1) {
      cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    } else {
      item.quantity -= 1;
    }

    await cart.save();
    res.json({ message: 'Giảm số lượng sản phẩm thành công.', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Giảm số lượng thất bại.' });
  }
};

const cartUpdateItemIncrease = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Check product exists and stock
    const productResponse = await axios.get(`http://localhost:4000/api/product/fetch/${productId}`);
    const productData = productResponse.data;
    if (!productData) {
      return res.status(404).json({ error: 'Không có sản phẩm này.' });
    }

    let cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Giỏ hàng trống.' });

    const item = cart.items.find(i => i.productId === productId);
    if (!item) return res.status(404).json({ error: 'Sản phẩm không có trong giỏ hàng.' });

    if (item.quantity + 1 > productData.stock) {
      return res.status(400).json({ error: 'Không đủ hàng tồn kho.' });
    }

    item.quantity += 1;
    await cart.save();

    res.json({ message: 'Tăng số lượng sản phẩm thành công.', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Tăng số lượng thất bại.' });
  }
};

const cartUpdateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quantity } = req.body
    const { productId } = req.params;

    let cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Giỏ hàng trống.' });

    const item = cart.items.find(i => i.productId === productId);
    if (!item) return res.status(404).json({ error: 'Sản phẩm không có trong giỏ hàng.' });
    item.quantity = quantity;
    await cart.save();
    res.json({ message: 'Thay đổi số lượng sản phẩm thành công.', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Thay đổi số lượng thất bại.' });
  }
};

export {
  cartGet,
  cartAdd,
  cartClear,
  cartRemoveItem,
  cartUpdateItemDecrease,
  cartUpdateItemIncrease,
  cartUpdateQuantity
}