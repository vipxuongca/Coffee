import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    provider: {
      type: String,
      enum: ["MOMO", "PAYPAL", "STRIPE"],
      required: true
    },

    // MoMo: transId
    // Stripe/PayPal: chargeId / captureId
    providerPaymentId: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "REFUNDED"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      uppercase: true,
      default: "VND"
    },

    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

// Idempotency guarantee
paymentSchema.index(
  { provider: 1, providerPaymentId: 1 },
  { unique: true }
);

export default mongoose.model("Payment", paymentSchema);
