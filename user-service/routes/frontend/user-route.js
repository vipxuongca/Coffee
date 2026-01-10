import express from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  singleUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  confirmResetToken
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

// protected
router.get('/single', verifyToken, singleUser);
router.post('/reset-password', verifyResetToken, resetPassword);
router.get('/verify-reset-token', verifyResetToken, confirmResetToken);

export default router;