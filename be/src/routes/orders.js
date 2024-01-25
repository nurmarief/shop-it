import express from 'express';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import { getOrderDetails, createOrder } from '../controllers/orders.js';

const router = express.Router();

router.route('/').post(isAuthenticatedUser, createOrder);
router.route('/:orderId').get(isAuthenticatedUser, getOrderDetails);

export default router;
