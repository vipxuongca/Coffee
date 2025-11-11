import express from 'express';
import { verifyToken } from '../middleware/jwt-verify.js';
import {
  orderCreateCOD,
  orderGetOne,
  orderGetUser,
  orderCancel,
  orderCreateTransfer
} from '../controllers/order-controller.js'
import {
  orderCreateStripe,
  orderAbandon
} from '../controllers/order-stripe-controller.js'


const router = express.Router();

// /api/order
router.post('/create/cod', verifyToken, orderCreateCOD);
router.post('/create/stripe', verifyToken, orderCreateStripe);
router.post('/create/transfer', verifyToken, orderCreateTransfer);
router.get('/get-one/:orderid', verifyToken, orderGetOne);
router.get('/get-user', verifyToken, orderGetUser);
router.put("/cancel/:orderid", verifyToken, orderCancel);
router.put("/abandon/:orderid", verifyToken, orderAbandon);

export default router;