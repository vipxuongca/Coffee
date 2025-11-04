import mongoose from "mongoose";
const userDetailItemSchema = new mongoose.Schema({
  receiverName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  ward: { type: String, required: true},
  city: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
})
const userDetailSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    item: {
      type: [userDetailItemSchema], default: []
    }
  },
  { timestamps: true }
);

// For faster lookup of default shipping info per user
userDetailSchema.index({ userId: 1, isDefault: -1 });

export default mongoose.model("userDetail", userDetailSchema);
