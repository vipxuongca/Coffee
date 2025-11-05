import express from 'express';
import { orderCreate, orderGetOne, orderGetUser, orderCancel } from '../controllers/order-controller.js'
import { verifyToken } from '../controllers/jwt-verify.js';

const router = express.Router();

// /api/order
router.post('/create', verifyToken, orderCreate);
router.get('/get-one/:orderid', verifyToken, orderGetOne);
router.get('/get-user', verifyToken, orderGetUser);
router.put("/cancel/:orderid", verifyToken, orderCancel);

export default router;