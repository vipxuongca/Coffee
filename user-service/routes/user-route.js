import express from 'express';
import {
  loginUser,
  registerUser,
  singleUser
} from '../controllers/user-controller.js';
import userAuth from '../middleware/user-auth.js'

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/single', userAuth, singleUser);

export default router;