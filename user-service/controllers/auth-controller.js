import jwt from "jsonwebtoken";
import userModel from "../models/user-model.js";
import { generateAccessToken } from "../utils/jwt.js";

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ success: false, message: "No refresh token provided" });

  try {
    // 1. Xác minh refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 2. Tìm user trong DB và kiểm tra trùng token
    const user = await userModel.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    // 3. Tạo access token mới
    const newAccessToken = generateAccessToken({ id: user._id });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
};
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ success: false, message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Xóa refresh token khỏi DB
    user.refreshToken = null;
    await user.save();

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ success: false, message: "Error logging out" });
  }
};
