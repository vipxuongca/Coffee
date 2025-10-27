import express from 'express';
import { orderCreate, orderGetOne, orderGetUser } from '../controllers/order-controller.js'
import { verifyToken } from '../controllers/jwt-verify.js';

const router = express.Router();

// /api/order
router.post('/create', verifyToken, orderCreate);
router.get('/get-one/:orderid', verifyToken, orderGetOne);
router.get('/get-user', verifyToken, orderGetUser);

export default router;