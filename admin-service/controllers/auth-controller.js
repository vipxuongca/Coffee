import jwt from "jsonwebtoken";
import adminModel from "../models/admin-model.js";
import { generateAccessToken } from "../utils/jwt.js";

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ success: false, message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const admin = await adminModel.findById(decoded.id);

    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({ id: admin._id });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

import adminModel from "../models/admin-model.js";
import { verifyRefreshToken } from "../utils/jwt.js";

/**
 * Logout admin
 * Xóa refresh token khỏi DB để hủy session đăng nhập
 */
export const logoutAdmin = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(400).json({
      success: false,
      message: "No refresh token provided",
    });

  try {
    // Giải mã refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired refresh token",
      });

    // Tìm admin theo id
    const admin = await adminModel.findById(decoded.id);
    if (!admin)
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });

    // Xóa refresh token khỏi database
    admin.refreshToken = null;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};



