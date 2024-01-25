import express from 'express';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  getAllOrders,
  updateOrder,
  deleteOrder,
  deleteProductReview,
  getSales,
  getAllProducts,
  uploadProductImages,
  deleteProductImage
} from '../controllers/admin.js';

const router = express.Router();

router.route('/products')
  .get(getAllProducts)
  .post(addProduct);

router.route('/products/:productId')
  .put(updateProduct)
  .delete(deleteProduct);

router.route('/products/:productId/images/add')
  .put(uploadProductImages)

router.route('/products/:productId/images/delete')
  .put(deleteProductImage);

router.route('/products/:productId/reviews/:reviewId')
  .delete(deleteProductReview);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:userId')
  .get(getUserDetails)
  .put(updateUser)
  .delete(deleteUser);

router.route('/orders')
  .get(getAllOrders);

router.route('/orders/get-sales')
  .get(getSales);

router.route('/orders/:orderId')
  .put(updateOrder)
  .delete(deleteOrder);


export default router;
