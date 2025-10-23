import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING_PAYMENT", "PAID", "FAILED", "CANCELLED"],
      default: "PENDING_PAYMENT"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
