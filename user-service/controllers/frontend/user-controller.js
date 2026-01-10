import userModel from '../../models/user-model.js';
import RefreshToken from '../../models/refreshtoken-model.js';
import ResetToken from '../../models/resettoken-model.js';
import crypto from "crypto"
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import transporter from '../../config/nodemailer.js';

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

  const newAccessToken = createAccessToken(stored.userId);
  console.log("access token sent to frontend: ", newAccessToken);
  return res.json({ accessToken: newAccessToken });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).json({ success: false, message: "Tài khoản không tồn tại" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ success: false, message: "Email hoặc mật khẩu không đúng" });

  const token = createAccessToken(user._id);
  const refreshToken = createRefreshToken();

  await RefreshToken.create({
    userId: user._id,
    token: crypto.createHash("sha256").update(refreshToken).digest("hex"),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  });

  // const isProd = process.env.NODE_ENV === "production";

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
    sameSite: "strict",
    path: '/',
    // domain: process.env.COOKIE_DOMAIN
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
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không đúng." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ success: true, message: "Mật khẩu đã được cập nhật." });
  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
    }

    // 1. Clean up: Delete any existing tokens for this user
    await ResetToken.deleteMany({ userId: user._id });

    // 2. Token generation
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. Save to ResetToken Model
    await ResetToken.create({
      userId: user._id,
      token: resetToken
    });

    // 4. Create the URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 5. Send the Email
    const mailOptions = {
      from: `"Hỗ trợ Khách hàng" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3e2723;">Yêu cầu đặt lại mật khẩu</h2>
          <p>Chào bạn,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để tiếp tục:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3e2723; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p style="font-size: 12px; color: #777;">Liên kết này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        </div>
      `
    };

    // Use await to ensure mail is sent before responding
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Hướng dẫn đặt lại mật khẩu đã được gửi vào email của bạn. Vui lòng kiểm tra hộp thư đến.",
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

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    console.log("Received token:", token);
    console.log("Received new password:", password);

    // 1. Find the token
    const tokenDoc = await ResetToken.findOne({ token });

    // 2. If tokenDoc is null, it means it expired (deleted by MongoDB) or never existed
    if (!tokenDoc) {
      return res.status(400).json({
        success: false,
        message: "Liên kết đã hết hạn hoặc không hợp lệ."
      });
    }

    // 3. Find user and update password
    const user = await userModel.findById(tokenDoc.userId);
    console.log("User found for password reset:", user);
    if (!user) return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });

    const salt = await bcrypt.genSalt(10); // 5 to 15, longer is more secure yet slower
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword; // Ensure your User model hashes this on 'save'
    await user.save();

    // 4. Delete the token immediately after use (One-time use security)
    await ResetToken.deleteOne({ _id: tokenDoc._id });

    return res.status(200).json({ success: true, message: "Mật khẩu đã được cập nhật." });
  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const confirmResetToken = async (req, res) => {
  try {
    const { token } = req.params; // Grabbing it from the URL: /api/verify-token/:token

    // 1. Look for the token in the ResetToken collection
    const tokenDoc = await ResetToken.findOne({ token });

    // 2. If it's not found, it's either fake, used, or expired (automatically deleted by MongoDB)
    if (!tokenDoc) {
      return res.status(400).json({
        success: false,
        message: "Liên kết không hợp lệ hoặc đã hết hạn."
      });
    }

    // 3. If found, the link is still "alive"
    return res.status(200).json({
      success: true,
      message: "Token hợp lệ."
    });

  } catch (error) {
    console.error('Lỗi xác thực token:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


export { loginUser, registerUser, singleUser, logoutUser, refreshAccessToken, forgotPassword, resetPassword, confirmResetToken, changePassword };