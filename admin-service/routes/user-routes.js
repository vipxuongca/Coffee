// routes/user-routes.js
import express from "express";
import { loginUser, registerUser, singleUser } from "../controllers/user-controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", authMiddleware, singleUser);

export default router;
    