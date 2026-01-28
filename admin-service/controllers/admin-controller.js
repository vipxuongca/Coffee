import adminModel from '../models/admin-model.js';
import RefreshToken from '../models/refreshtoken-model.js';
import reportModel from '../models/report-model.js';
import crypto from "crypto"
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createRefreshToken = () =>
  crypto.randomBytes(64).toString("hex");
const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
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

      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: isProd,
      //   sameSite: isProd ? "strict" : "none",
      //   maxAge: 14 * 24 * 60 * 60 * 1000
      // });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 14 * 24 * 60 * 60 * 1000,
        path: '/',
        // domain: process.env.COOKIE_DOMAIN || 'localhost'
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
    sameSite: "strict",
    path: '/',
    // domain: process.env.COOKIE_DOMAIN
  });

  return res.json({ success: true });
};

const getOrderAndProcessData = async (req, res) => {
  try {
    const reports = await reportModel.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
}


const getReport = async (req, res) => {
  try {
    const latestReport = await reportModel
      .findOne()
      .sort({ createdAt: -1 })
      .lean();

    if (!latestReport) {
      return res.status(404).json({ success: false, message: 'No report found' });
    }

    res.status(200).json({
      success: true,
      data: latestReport
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest report', error });
  }
};

const fetchLiveReport = async (req, res) => {
  // this would first connect to order-service to fetch orders
  // then process orders, do 2 things:
  // 1. update the report database
  // 2. return the report data to frontend
  try {
    const reports = await reportModel.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};

const createReportRecord = async (req, res) => {
  try {
    const { metrics, salesData, bestSellers } = req.body;

    const report = await reportModel.create({
      metrics,
      salesData,
      bestSellers
    });

    // CHANGE THIS: Return the structure the frontend expects
    res.status(201).json({
      success: true,
      message: "Report Created Successfully",
      data: report
    });

  } catch (error) {
    // Log the actual error to your terminal so you can see WHY it fails
    console.error("Backend Error:", error);

    res.status(500).json({
      success: false,
      message: 'Error creating report record',
      error: error.message
    });
  }
};

export { loginAdmin, registerAdmin, logoutAdmin, refreshAccessToken, getReport, fetchLiveReport, createReportRecord };