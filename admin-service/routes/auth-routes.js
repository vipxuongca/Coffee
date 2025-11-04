import express from "express";
import { refreshToken, logoutAdmin } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/refresh-token", refreshToken);
router.post("/logout", logoutAdmin);

export default router;
