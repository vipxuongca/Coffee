import express from 'express';
import { loginAdmin, registerAdmin, logoutAdmin, refreshAccessToken, getReport, fetchLiveReport, createReportRecord } from '../controllers/admin-controller.js';

const router = express.Router();

// 
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutAdmin);
router.get('/get-report', getReport);
router.get('/fetch-report', fetchLiveReport);
router.post('/create-report', createReportRecord);

export default router;