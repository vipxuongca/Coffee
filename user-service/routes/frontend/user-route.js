import express from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  singleUser,
  refreshAccessToken,
  changePassword,
  resetPassword,
} from '../../controllers/frontend/user-controller.js';
import verifyToken from '../../middleware/verifyToken.js'
import verifyResetToken from '../../middleware/verifyResetToken.js';

const router = express.Router();

// public
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/register', registerUser);
router.post('/refresh', refreshAccessToken);

// protected
router.get('/single', verifyToken, singleUser);
router.put('/change-password', verifyToken, changePassword);
router.put('/reset-password', verifyToken, resetPassword);

export default router;