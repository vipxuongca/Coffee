import express from "express";
import {
  addDetail,
  getAllDetails,
  getDefaultDetail,
  updateDetail,
  deleteDetail,
  setDefaultDetail,
} from "../controllers/user-detail-controller.js";
import { verifyToken } from "../middleware/user-auth.js"

const router = express.Router();

// all user details must be accommodated with a middleware

// /api/user-detail
router.post("/", verifyToken, addDetail);
/*
payload: 
{

}
*/

router.get("/", verifyToken, getAllDetails);
router.get("/default", verifyToken, getDefaultDetail);
router.put("/", verifyToken, updateDetail);
router.delete("/", verifyToken, deleteDetail);
router.patch("/default", verifyToken, setDefaultDetail);

export default router;
