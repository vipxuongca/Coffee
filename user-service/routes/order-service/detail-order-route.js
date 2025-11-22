import express from 'express';
import { verifyOrderKey } from '../../middleware/orderkey-verify.js'
import { getDefaultDetail } from "../../controllers/order-service/detail-order-controller.js";


const router = express.Router();

// http: <site>/api/user-detail/order
router.post("/default", verifyOrderKey, getDefaultDetail);


export default router;