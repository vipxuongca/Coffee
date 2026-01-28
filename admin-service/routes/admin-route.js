import express from 'express';
import { loginAdmin, registerAdmin, logoutAdmin, refreshAccessToken, getReport } from '../controllers/admin-controller.js';

const router = express.Router();

// 
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutAdmin);
router.get('/get', getReport);

export default router;