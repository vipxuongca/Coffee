import express from 'express';
import {
  orderCreateCOD,
  orderGetOne,
  orderGetUser,
  orderCancel,
  orderCreateStripe,
  orderCreateTransfer
} from '../controllers/order-controller.js'
import { verifyToken } from '../controllers/jwt-verify.js';

const router = express.Router();

// /api/order
router.post('/create/cod', verifyToken, orderCreateCOD);
router.post('/create/stripe', verifyToken, orderCreateStripe);
router.post('/create/transfer', verifyToken, orderCreateTransfer);
router.get('/get-one/:orderid', verifyToken, orderGetOne);
router.get('/get-user', verifyToken, orderGetUser);
router.put("/cancel/:orderid", verifyToken, orderCancel);

export default router;