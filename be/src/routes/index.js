import express from 'express';
import productsRoutes from './products.js ';
import adminRoutes from './admin.js';
import authRoutes from './auth.js';
import ordersRoutes from './orders.js';
import meRoutes from './me.js';
import paymentsRoutes from './payments.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use('/admin', isAuthenticatedUser, authorizeRoles({ allowedRoles: ['admin'] }), adminRoutes);
router.use('/me', isAuthenticatedUser, meRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/auth', authRoutes);
router.use('/payments', paymentsRoutes);

export default router;
