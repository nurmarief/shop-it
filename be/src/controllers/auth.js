import process from 'node:process';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import UserModel from '../models/user.js';
import ErrorData from '../utils/ErrorData.js';
import { hashToken, sendToken } from '../utils/token.js';
import { getResetPasswordTemplate } from '../utils/emailHTMLTemplate.js';
import sendEmail from '../utils/sendEmail.js';

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await UserModel.create({ name, email, password });

  sendToken({ user, statusCode: 201, res });
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: false,
  });

  res.status(200).json({
    message: 'Logged out',
  });
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const errorData = new ErrorData('Please enter email and password', 400);
    return next(errorData);
  }

  // Check user existence
  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    const errorData = new ErrorData(`login failed, user with email ${email} was not found`, 401);
    return next(errorData);
  }

  // Check if password is correct
  const isPasswordMatch = await user.comparePassword({ enteredPassword: password });

  if (!isPasswordMatch) {
    const errorData = new ErrorData('Login failed, password does not match', 401);
    return next(errorData);
  }

  sendToken({ user, statusCode: 200, res });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    const errorData = new ErrorData(`Cannot send password recovery link, user with email ${email} was not found`, 404);
    return next(errorData);
  }

  const resetToken = await user.getResetPasswordToken();

  const { FRONT_END_URL } = process.env;
  const resetURL = `${FRONT_END_URL}/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate({ username: user.name, resetURL });

  try {
    await sendEmail({ receiverEmail: user.email, subject: 'ShopIt Password Recovery', message });
    return res.status(200).json({
      message: `Email was sent to: ${user.email}`
    });
  } catch (error) {
    await user.setPasswordChangerProperty({ resetPasswordToken: undefined, resetPasswordExpire: undefined });
    const errorData = new ErrorData(error.message, 500);
    return next(errorData);
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmedPassword } = req.body;
  const { RESET_PASSWORD_HASH_ALGORITHM, RESET_PASSWORD_ENCODING } = process.env;

  // Check user existence based on reset password property
  const hashedResetPasswordToken = hashToken({ algorithm: RESET_PASSWORD_HASH_ALGORITHM, token, encoding: RESET_PASSWORD_ENCODING });

  const user = await UserModel.findOne({
    resetPasswordToken: hashedResetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    const errorData = new ErrorData(`Password reset token was not found or has been expired`, 400);
    return next(errorData);
  }

  if (password !== confirmedPassword) {
    const errorData = new ErrorData('Password does not match', 400);
    return next(errorData);
  }

  await user.setPassword({ password });

  sendToken({ user, statusCode: 200, res });
});
