import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import OrderModel from '../models/order.js';
import UserModel from '../models/user.js';
import ErrorData from '../utils/ErrorData.js';
import { deleteFile, uploadFile } from '../utils/cloudinary.js';

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { _id: userId } = req.user;
  const user = await UserModel.findById(userId);

  if (!user) {
    const errorData = new ErrorData(`User with id ${id} was not found`, 404);
    return next(errorData);
  }

  res.status(200).json({
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { _id: userId } = req.user;
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await UserModel.findByIdAndUpdate(userId, newUserData, {
    new: true
  });

  if (!user) {
    const errorData = new ErrorData(`Update user data failed, user with id ${id} was not found`, 404);
    return next(errorData);
  }

  res.status(200).json({
    message: `User data with id ${userId} has successfully updated`,
    user,
  });
});

export const getUserOrders = catchAsyncErrors(async (req, res, next) => {
  const { _id: userId } = req.user;
  const orders = await OrderModel.find({ user: userId });

  res.status(200).json({
    orders,
  });
});

export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  // delete prev avatar file first
  if (req?.user?.avatar?.url) {
    await deleteFile(req?.user?.avatar?.public_id);
  }

  const response = await uploadFile(avatar, 'ShopIT/avatars');
  const user = await UserModel.findByIdAndUpdate(userId, {
    avatar: response,
  });

  res.status(200).json({
    message: 'Avatar has been successfully uploaded',
    user,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  const user = await UserModel.findById(userId).select('+password');

  // Check the prev user password
  const isPasswordMatch = await user.comparePassword({ enteredPassword: oldPassword });

  if (!isPasswordMatch) {
    const errorData = new ErrorData('Password is not match with previous password', 400);
    return next(errorData);
  }

  await user.setPassword({ password: newPassword });

  res.status(200).json({
    message: 'Password was successfully changed',
  });
});
