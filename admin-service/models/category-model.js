import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: Array, required: true },
  productCount: { type: Number, default: 0 }
}, { timestamps: true })

const categoryModel = mongoose.models.category || mongoose.model('Category', categorySchema);

export default categoryModel;