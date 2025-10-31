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

///api/user-detail
router.post("/add", verifyToken, addDetail);
/*
payload: 
{

}
*/

router.get("/", verifyToken, getAllDetails);
router.get("/default", verifyToken, getDefaultDetail);
router.post("/edit/:id", verifyToken, updateDetail);
router.delete("/delete/:id", verifyToken, deleteDetail);
router.patch("/default/:id", verifyToken, setDefaultDetail);

export default router;
