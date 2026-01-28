import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
    index: true
  },
  token: {
    type: String,  // store hashed token here
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const reportModel = mongoose.model("Report", ReportSchema);

export default reportModel;