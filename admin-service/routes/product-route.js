import express from 'express';
import { addProduct, removeProduct, getProducts, getOneProduct, updateProduct } from '../controllers/product-controller.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/admin-auth.js';

const router = express.Router();

router.post('/add', adminAuth, upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 }
]), addProduct);
router.get('/get', getProducts);
router.get('/fetch/:id', getOneProduct);
router.put('/edit/:id', adminAuth, updateProduct);
router.delete('/delete', adminAuth, removeProduct);

export default router;