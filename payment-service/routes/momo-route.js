// routes/payment.js
import express from "express";
// import CartModel from "../models/cart-model.js";
import { momoClient, momoCallback, momoVerifyTransaction, momoVerifiedCallback } from "../controllers/momo-controller.js";
import { verifyToken } from "../middleware/jwt-verify.js";

const router = express.Router();
// 4008/api/momo

router.post("/create", momoClient);
router.post("/callback", momoCallback);
router.post("/verify-transaction", momoVerifyTransaction);
router.post("/verified-callback", momoVerifiedCallback);


export default router;
