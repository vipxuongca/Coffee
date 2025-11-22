import express from 'express';
import { verifyOrderKey } from '../../middleware/orderkey-verify.js'
import { singleUser } from '../../controllers/order-service/user-order-controller.js';


const router = express.Router();

// http: <site>/api/user/order
router.post('/single', verifyOrderKey, singleUser);


export default router;