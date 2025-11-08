import mongoose from "mongoose";
import { PAYMENT_METHOD } from "../config/paymentMethod.js";

// --- Order Item ---
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String },
  longDescription: { type: String },
  price: { type: Number, required: true },
  image: { type: [String], default: [] },
  category: { type: String },
  subCategory: { type: String },
  variant: { type: [String], default: [] },
  brand: { type: String },
  discount: { type: Number, default: 0 },
  stock: { type: Number }, // useful for historical data integrity
  quantity: { type: Number, required: true },
  packageType: { type: String },
  packageDetail: { type: String },
  warranty: { type: String }
});

// --- Shipping / User Detail ---
const orderUserSchema = new mongoose.Schema({
  receiverName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  ward: { type: String, required: true },
  city: { type: String, required: true },
  isDefault: { type: Boolean, required: true }
});

// --- Order Schema ---
const orderSchema = new mongoose.Schema(
  {
    // orderBusinessCode: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userEmail: { type: String, required: true },
    userDetail: { type: orderUserSchema, required: true },
    items: { type: [orderItemSchema], required: true },

    total: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: "COD",
    },
    notes: { type: String },

    status: {
      type: String,
      enum: ["PENDING_PAYMENT", "PAID", "FAILED", "CANCELLED"],
      default: "PENDING_PAYMENT",
    },
    failureReason: { type: String }
  },
  { timestamps: true }
);

// --- Indexes ---
orderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
