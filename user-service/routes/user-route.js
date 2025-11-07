import express from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  singleUser,
  refreshAccessToken
} from '../controllers/user-controller.js';
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.post('/register', registerUser);
router.get('/single', verifyToken, singleUser);
router.post('/refresh', refreshAccessToken);

export default router;