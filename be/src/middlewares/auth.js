import process from 'node:process';
import jwt from 'jsonwebtoken';
import catchAsyncErrors from './catchAsyncErrors.js';
import ErrorData from '../utils/ErrorData.js';
import UserModel from '../models/user.js';

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // Check token existence
  const { token } = req.cookies;

  if (!token) {
    const errorData = new ErrorData('Not authenticated', 401);
    return next(errorData);
  }

  // Find related user
  const { JWT_SECRET } = process.env;
  const { id } = jwt.verify(token, JWT_SECRET);

  req.user = await UserModel.findById(id); // Will throw an error if it finds none
  return next();
});

export const authorizeRoles = ({ allowedRoles }) => (req, res, next) => {
  const { role: userRole } = req.user;
  const isUserRoleAllowed = allowedRoles.includes(userRole);

  if (!isUserRoleAllowed) {
    const errorData = new ErrorData(`Role (${userRole}) is not allowed to access this resource`, 403);
    return next(errorData);
  }

  return next();
}
