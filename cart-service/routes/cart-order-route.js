import express from 'express';
import {
  cartClearFromOrder,
} from '../controllers/cart-order-controller.js'
import { verifyOrderKey } from '../middleware/orderkey-verify.js';

const router = express.Router();

// http://localhost:4003/api/cart/order

// Routes

router.put('/clear', verifyOrderKey, cartClearFromOrder);

export default router;