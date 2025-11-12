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
      required: function () {
        return !this.googleId; // password required only if not Google OAuth
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple users without googleId
    },
    oauthProvider: {
      type: String,
      enum: ['google'],
    },
    name: {
      type: String,
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const userModel =
  mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
