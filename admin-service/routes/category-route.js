import express from 'express';
import { addCategory, removeCategory, getCategory, getOneCategory, updateCategory } from '../controllers/category-controller.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/admin-auth.js';

const router = express.Router();

router.post('/add', adminAuth, upload.fields([
  { name: "image1", maxCount: 1 },
]), addCategory);
router.get('/get', getCategory);
router.get('/fetch/:id', getOneCategory);
router.put('/update', adminAuth, updateCategory);
router.delete('/delete', adminAuth, removeCategory);

export default router;