import mongoose from "mongoose";

const SalesPointSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sales: { type: Number, required: true }
  },
  { _id: false }
);

const BestSellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const ReportSchema = new mongoose.Schema(
  {
    metrics: {
      totalRevenue: { type: Number, required: true },
      totalOrders: { type: Number, required: true },
      pendingOrders: { type: Number, required: true },
      avgOrderValue: { type: Number, required: true }
    },

    salesData: {
      type: [SalesPointSchema],
      default: []
    },

    bestSellers: {
      type: [BestSellerSchema],
      default: []
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  },
  {
    timestamps: false
  }
);

const reportModel = mongoose.model("Report", ReportSchema);
export default reportModel;
