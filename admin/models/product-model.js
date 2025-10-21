import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  weight: { type: Array, required: true },
  bestseller: { type: Boolean },
}, { timestamps: true })

const productModel = mongoose.models.product || mongoose.model('Products', productSchema);
// if available, use the product model, if that is not available, create it using the product schema

export default productModel;