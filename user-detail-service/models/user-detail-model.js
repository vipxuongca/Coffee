import mongoose from "mongoose";

const shippingDetailSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    receiverName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "Vietnam" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// For faster lookup of default shipping info per user
shippingDetailSchema.index({ userId: 1, isDefault: -1 });

export default mongoose.model("ShippingDetail", shippingDetailSchema);
