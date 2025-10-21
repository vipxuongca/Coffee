import express from 'express';
import { addProduct, removeProduct, getProducts, getOneProduct, updateProduct } from '../controllers/product-controller.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/add', upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 }
]), addProduct);
router.get('/get', getProducts);
router.get('/fetch', getOneProduct);
router.put('/update', updateProduct);
router.delete('/delete', removeProduct);

export default router;