import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  variant: { type: Array },
  bestseller: { type: Boolean },
  stock: { type: Number, required: true },
  brand: { type: String, required: true },
  discount: { type: Number, default: 0 }
}, { timestamps: true })

const productModel = mongoose.models.product || mongoose.model('Products', productSchema);
// if available, use the product model, if that is not available, create it using the product schema

export default productModel;