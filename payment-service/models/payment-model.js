import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    enum: ["paypal", "stripe"],
    required: true,
    default: "paypal"
  },
  providerPaymentId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ["CREATED", "APPROVED", "CAPTURED", "FAILED", "REFUNDED"],
    default: "CREATED"
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    uppercase: true,
    default: "USD"
  },
  payerEmail: {
    type: String
  },
  payerId: {
    type: String
  },
  rawResponse: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true // createdAt, updatedAt
});

export default mongoose.model("Payment", paymentSchema);