import express from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  singleUser,
  refreshAccessToken
} from '../controllers/user-controller.js';
import userAuth from '../middleware/user-auth.js'

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', userAuth, logoutUser);
router.post('/register', registerUser);
router.get('/single', userAuth, singleUser);
router.post('/refresh', refreshAccessToken);

export default router;