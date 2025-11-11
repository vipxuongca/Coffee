import mongoose from "mongoose";

const orderFailureSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    paymentProvider: { type: String, required: true }, // e.g. STRIPE, PAYPAL
    failureCode: { type: String }, // same value stored in order.failureReason
    failureMessage: { type: String },
    rawPayload: { type: Object }, // Stripe webhook payload
  },
  { timestamps: true }
);

export default mongoose.model("OrderFailure", orderFailureSchema);
