import userModel from '../models/user-model.js';
import RefreshToken from '../models/refreshtoken-model.js';
import crypto from "crypto"
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createRefreshToken = () =>
  crypto.randomBytes(64).toString("hex");

const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30m',
  });
}

const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const stored = await RefreshToken.findOne({ token: hashed });
  if (!stored) return res.status(401).json({ message: "Invalid refresh" });

  const newAccessToken = createAccessToken(stored.userId);
  return res.json({ accessToken: newAccessToken });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Thông tin đăng nhập không đúng" });

  const token = createAccessToken(user._id);
  const refreshToken = createRefreshToken();

  await RefreshToken.create({
    userId: user._id,
    token: crypto.createHash("sha256").update(refreshToken).digest("hex"),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000
  });

  return res.json({ success: true, token });
};

const logoutUser = async (req, res) => {
  const tokenFromCookie = req.cookies.refreshToken;
  if (tokenFromCookie) {
    const hashed = crypto.createHash("sha256").update(tokenFromCookie).digest("hex");
    await RefreshToken.findOneAndDelete({ token: hashed });
  }
  console.log("Cookie received:", req.cookies.refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  });

  return res.json({ success: true });
};



const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Xin nhập tất cả các trường' });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Tài khoản đã tồn tại' });
    }

    // validation of email and strong pass
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Xin nhập Email hợp lệ' });
    } else if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password is not strong enough. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.' });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10); // 5 to 15, longer is more secure yet slower
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    console.log('Đăng ký tài khoản thành công:', user);

    res.json({ success: true })
  }
  catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ message: error.message });
  }
}

const singleUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user.id }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tài khoản không tồn tại',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sucessfully extract information',
      data: user,
    });

  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export { loginUser, registerUser, singleUser, logoutUser, refreshAccessToken };