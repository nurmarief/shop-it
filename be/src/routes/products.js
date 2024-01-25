import express from 'express';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import {
  canUserReview,
  getProduct,
  getProductReviews,
  getProducts,
  postProductReview
} from '../controllers/products.js';

const router = express.Router();

router.route('/')
  .get(getProducts);

router.route('/:productId')
  .get(getProduct);

router.route('/:productId/reviews')
  .get(isAuthenticatedUser, getProductReviews)
  .post(isAuthenticatedUser, postProductReview);

router.route('/:productId/can-review')
  .get(isAuthenticatedUser, canUserReview);

export default router;
