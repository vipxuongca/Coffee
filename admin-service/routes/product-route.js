import express from 'express';
import { addProduct, removeProduct, getProducts, getOneProduct, updateProduct, getOneStockProduct } from '../controllers/product-controller.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/admin-auth.js';

const router = express.Router();

// http://locahost:4000/api/product
router.get('/get', getProducts);
router.get('/fetch/:id', getOneProduct);

router.post('/add', adminAuth, upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 }
]), addProduct);
router.post('/stock/:id', getOneStockProduct);


router.put('/edit/:id', adminAuth, upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 }
]), updateProduct);


router.delete('/delete', adminAuth, removeProduct);

export default router;