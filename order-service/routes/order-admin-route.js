import express from 'express';
import { orderGet } from '../controllers/order-admin-controller.js';
import { verifyAdminToken } from '../controllers/jwt-admin-verify.js';

const router = express.Router();

// /api/order/admin
router.get('/get', verifyAdminToken, orderGet);

export default router;