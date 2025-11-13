import express from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  singleUser,
  refreshAccessToken,
  changePassword
} from '../controllers/user-controller.js';
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router();

// public
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/register', registerUser);
router.post('/refresh', refreshAccessToken);

// protected
router.get('/single', verifyToken, singleUser);
router.put('/change-password', verifyToken, changePassword);

export default router;