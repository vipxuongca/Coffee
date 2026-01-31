import express from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  singleUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  confirmResetToken,
  changePassword,
  sendEmail
} from '../../controllers/frontend/user-controller.js';
import verifyToken from '../../middleware/verifyToken.js'
import verifyResetToken from '../../middleware/verifyResetToken.js';

const router = express.Router();

// public
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/register', registerUser);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/send-email', sendEmail);

// protected
router.get('/single', verifyToken, singleUser);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-reset-token', verifyResetToken, confirmResetToken);
router.post('/change-password', verifyToken, changePassword);

export default router;