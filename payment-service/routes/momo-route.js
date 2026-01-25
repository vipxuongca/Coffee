// routes/payment.js
import express from "express";
// import CartModel from "../models/cart-model.js";
import { momoClient, momoCallback, momoVerifyTransaction } from "../controllers/momo-controller.js";
import { verifyToken } from "../middleware/jwt-verify.js";
import { callbackLog } from "../middleware/callback-log.js";

const router = express.Router();
// 4008/api/momo

router.post("/create", momoClient);
router.post("/callback", callbackLog, momoCallback);
router.post("/verify-transaction", momoVerifyTransaction);


export default router;
