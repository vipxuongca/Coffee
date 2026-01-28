import express from 'express';
import { getReport } from '../controllers/report-controller.js';
import adminAuth from '../middleware/admin-auth.js';

const router = express.Router();

// http://locahost:4000/api/report
router.get('/get', adminAuth, getReport);

export default router;