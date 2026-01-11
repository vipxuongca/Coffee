// routes/payment.js
import express from "express";
// import CartModel from "../models/cart-model.js";
import { momoClient } from "../controllers/momo-controller.js";
import { verifyToken } from "../middleware/jwt-verify.js";

const router = express.Router();

router.post("/", momoClient);


export default router;
