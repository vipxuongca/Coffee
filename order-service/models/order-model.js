import mongoose from "mongoose";

// --- Order Item  ---
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  variant: { type: [String] },
  brand: { type: String, required: true },
  discount: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
});

// --- Order Schema ---
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    receiverName: { type: String, required: true },

    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "CARD", "TRANSFER"], default: "COD" },
    shippingFee: { type: Number, default: 0 },
    notes: { type: String },

    status: {
      type: String,
      enum: ["PENDING_PAYMENT", "PAID", "FAILED", "CANCELLED"],
      default: "PENDING_PAYMENT"
    }
  },
  { timestamps: true }
);

// --- Indexes ---
orderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
