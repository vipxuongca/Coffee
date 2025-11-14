import adminModel from '../models/admin-model.js';
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

  const newAccessToken = createAccessToken(stored.adminId);
  return res.json({ accessToken: newAccessToken });
};

const loginAdmin = async (req, res) => {

  /* expected payload:
    {
      "email": "sample@gmail.com",
      "password": "Sample@1234"
    }  
  */
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin does not exist' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    } else {
      const token = createAccessToken(admin._id);
      const refreshToken = createRefreshToken();

      await RefreshToken.create({
        adminId: admin._id,
        token: crypto.createHash("sha256").update(refreshToken).digest("hex"),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      });

      const isProd = process.env.NODE_ENV === "production";

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "strict" : "none",
        maxAge: 14 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({ success: true, token });
    }
  }
  catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: error.message });
  }
}

const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }

    const exists = await adminModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    // validation of email and strong pass
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' });
    } else if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password is not strong enough. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.' });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10); // 5 to 15, longer is more secure yet slower
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({
      email,
      password: hashedPassword,
    });

    const admin = await newAdmin.save();
    console.log('Admin registered successfully:', admin);

    res.json({ success: true })
  }
  catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: error.message });
  }
}

const logoutAdmin = async (req, res) => {
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

export { loginAdmin, registerAdmin, logoutAdmin, refreshAccessToken };