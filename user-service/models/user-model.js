import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
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

const userModel =
  mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
