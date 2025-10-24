import express from "express";
import {
  addDetail,
  getAllDetails,
  getDefaultDetail,
  updateDetail,
  deleteDetail,
  setDefaultDetail,
} from "../controllers/user-detail-controller.js";

const router = express.Router();

// /api/user-detail
router.post("/", addDetail);
router.get("/:userId", getAllDetails);
router.get("/default/:userId", getDefaultDetail);
router.put("/:id", updateDetail);
router.delete("/:id", deleteDetail);
router.patch("/:id/default", setDefaultDetail);

export default router;
