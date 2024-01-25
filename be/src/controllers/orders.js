import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import OrderModel from '../models/order.js';
import ErrorData from '../utils/ErrorData.js';

export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { orderItems, shippingInfo, itemsPrice, taxAmount, shippingAmount, totalAmount, paymentMethod, paymentInfo } = req.body;

  const order = await OrderModel.create({
    orderItems, shippingInfo, itemsPrice, taxAmount, shippingAmount, totalAmount, paymentMethod, paymentInfo, user: userId,
  });

  res.status(200).json({
    order,
  });
});

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await OrderModel.findById(orderId).populate('user', 'name email');

  if (!order) {
    const errorData = new ErrorData(`Order with id ${orderId} was not found`, 404);
    return next(errorData);
  }

  res.status(200).json({
    order,
  });
});
