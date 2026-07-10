import express from 'express';
import {
  createCheckoutSession,
  verifyCheckoutSession,
  stripeWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-session', createCheckoutSession);
router.get('/verify-session', verifyCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
