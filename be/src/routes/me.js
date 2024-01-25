import express from 'express';
import {
  updateProfile,
  getUserProfile,
  getUserOrders,
  uploadAvatar,
  updatePassword
} from '../controllers/me.js';

const router = express.Router();

router.route('/').get(getUserProfile);
router.route('/update').put(updateProfile);
router.route('/orders').get(getUserOrders);
router.route('/upload-avatar').put(uploadAvatar);
router.route('/update-password').put(updatePassword);

export default router;
