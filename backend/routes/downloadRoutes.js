import express from 'express';
import {
  validateDownloadToken,
  downloadFile,
  getDownloadHistory
} from '../controllers/downloadController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes for download processing
router.get('/validate/:token', validateDownloadToken);
router.get('/file/:token', downloadFile);

// Admin-only metrics
router.get('/history', protectAdmin, getDownloadHistory);

export default router;
