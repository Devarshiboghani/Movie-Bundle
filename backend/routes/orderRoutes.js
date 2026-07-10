import express from 'express';
import {
  getOrders,
  getCustomers,
  resendOrderEmail
} from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protectAdmin, getOrders);
router.get('/customers', protectAdmin, getCustomers);
router.post('/resend-email', protectAdmin, resendOrderEmail);

export default router;
