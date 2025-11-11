// middlewares/check-stock.js
import Product from '../models/product-model.js';

export const checkStock = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body; // default to 1 if not specified

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (product.stock < quantity)
    return res.status(400).json({ message: 'Insufficient stock' });

  next();
};
