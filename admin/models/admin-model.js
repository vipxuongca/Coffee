import mongoose from 'mongoose';
import validator from 'validator';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Invalid email'],
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    minimize: false,
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const adminModel =
  mongoose.models.admin || mongoose.model('admin', adminSchema);

export default adminModel;
