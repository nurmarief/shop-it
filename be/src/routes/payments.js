import express from 'express';
import { stripeCheckoutSession, stripeWebhook } from '../controllers/payments.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';

const router = express.Router();

router.route('/checkout-session').post(isAuthenticatedUser, stripeCheckoutSession);
router.route('/webhook').post(stripeWebhook);

export default router;
