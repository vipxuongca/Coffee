import express from 'express';
import {
  cartGet,
  cartAdd,
  cartClear,
  cartRemoveItem,
  cartUpdateItemIncrease,
  cartUpdateItemDecrease,
  cartUpdateQuantity,
} from '../controllers/cart-controller.js'
import { verifyToken } from '../controllers/jwt-verify.js';

const router = express.Router();

// http://localhost:4003/api/cart

// Routes
router.get('/', verifyToken, cartGet);
router.post('/add/:productId', verifyToken, cartAdd);
router.delete('/clear', verifyToken, cartClear);
router.delete('/remove/:productId', verifyToken, cartRemoveItem);
router.put('/update/decrease/:productId', verifyToken, cartUpdateItemDecrease);
router.put('/update/:productId', verifyToken, cartUpdateItemIncrease);
router.put('/update/quantity/:productId', verifyToken, cartUpdateQuantity);

export default router;