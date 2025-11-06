import express from 'express';
import { orderGet, orderCancel, orderGetOne, orderConfirmPayment } from '../controllers/order-admin-controller.js';
import { verifyAdminToken } from '../controllers/jwt-admin-verify.js';

const router = express.Router();

// /api/order/admin
router.get('/get', verifyAdminToken, orderGet);
router.put("/cancel/:orderid", verifyAdminToken, orderCancel);
router.put("/confirm-payment/:orderid", verifyAdminToken, orderConfirmPayment);
router.get('/get-one/:orderid', verifyAdminToken, orderGetOne);

export default router;