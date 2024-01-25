import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import ProductModel from '../models/product.js';
import UserModel from '../models/user.js';
import OrderModel from '../models/order.js';
import ErrorData from '../utils/ErrorData.js';
import { deleteFile, uploadFile } from '../utils/cloudinary.js';

export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await ProductModel.find();

  res.status(200).json({
    products,
  });
});

export const addProduct = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  // Setup product data
  let productData = req.body;
  productData.user = userId;

  const product = await ProductModel.create(productData);

  res.status(200).json({
    product,
  });
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const productData = req.body;
  const product = await ProductModel.findByIdAndUpdate(productId, productData, { new: true });

  if (!product) {
    const errorData = new ErrorData(`Update product failed, product with id ${productId} was not found`, 404);
    return next(errorData);
  }

  res.status(200).json({
    product,
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const product = await ProductModel.findById(productId);

  if (!product) {
    const errorData = new ErrorData(`Delete product failed, product with id ${productId} was not found`, 404);
    return next(errorData);
  }

  // Delete all images associated with the product
  product.images.forEach(async image => {
    await deleteFile(image.public_id);
  })

  await product.deleteOne();

  res.status(200).json({
    message: `Product with id ${productId} was successfully deleted`
  });
});

export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const { productId, reviewId: productReviewId } = req.params;
  const product = await ProductModel.findById(productId);

  if (!product) {
    const errorData = new ErrorData(`Product with id ${id} was not found`, 404);
    return next(errorData);
  }
  await product.deleteProductReviews({ productReviewIdToBeDeleted: productReviewId });
  res
    .status(200)
    .json({ message: `Product review with id ${productReviewId} of product with id ${productId} was successfully deleted` });
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await UserModel.find();

  res.status(200).json({
    users,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId);

  if (!user) {
    const errorData = new ErrorData(`User with id ${userId} was not found`, 404);
    return next(errorData);
  }

  res.status(200).json({
    user,
  });
});

export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }

  const user = await UserModel.findByIdAndUpdate(userId, newUserData, { new: true });

  if (!user) {
    const errorData = new ErrorData(`User update failed, user wiith id ${userId} was not found`, 404);
    return next(errorData);
  }

  res.status(200).json({
    user,
  });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;

  const user = await UserModel.findById(userId);

  if (!user) {
    const errorData = new ErrorData(`User with id ${userId} was not found`, 404);
    return next(errorData);
  }

  // Delete user avatar assets in cloudinary
  if (user.avatar.public_id) {
    await deleteFile(user.avatar.public_id);
  }

  await user.deleteOne();

  res.status(200).json({
    message: `User with id ${userId} was successfully deleted`,
  });
});

export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await OrderModel.find();

  res.status(200).json({
    orders,
  });
});

export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await OrderModel.findById(orderId);

  if (!order) {
    const errorData = new ErrorData(`Order with id ${orderId} was not found`, 404);
    return next(errorData);
  }

  if (order.status === 'Delivered') {
    const errorData = new ErrorData(`Order with id ${orderId} has been delivered`, 400);
    return next(errorData);
  }

  await order.updateProductStock();
  await order.updateOrderStatus({ status });

  res.status(200).json({
    order,
  });
});

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await OrderModel.findById(orderId);

  if (!order) {
    const errorData = new ErrorData(`Delete order failed, order with id ${orderId} was not found`, 404);
    return next(errorData);
  }

  await order.deleteOne();

  res.status(200).json({
    messsage: `Order with id ${orderId} was successfully deleted`,
  });
});

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split('T')[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

async function getSalesData(startDate, endDate) {
  const salesData = await OrderModel.aggregate([
    {
      // Stage 1 - Filter results
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        }
      }
    },
    {
      // Stage 2 - Group data
      $group: {
        _id: {
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          }
        },
        totalSales: { $sum: '$totalAmount' },
        numOrders: { $sum: 1 }
      }
    }
  ]);

  // Map data
  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach(entry => {
    const date = entry._id.date;
    const sales = entry.totalSales;
    const numOrders = entry.numOrders;

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });

  // Generate an array of dates
  const datesBetween = getDatesBetween(startDate, endDate);

  // Create final sales data array, create sales data that included between start date and end date but not exist inside the DB
  const finalSalesData = datesBetween.map(date => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));

  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

export const getSales = catchAsyncErrors(async (req, res, next) => {
  const { start_date, end_date } = req.query;
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 100);

  const { salesData, totalSales, totalNumOrders } = await getSalesData(startDate, endDate);

  res.status(200).json({
    success: true,
    totalSales,
    totalNumOrders,
    sales: salesData,
  });
});

export const uploadProductImages = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req?.params;
  const body = req?.body;

  // Find product
  const product = await ProductModel.findById(productId);

  if (!product) {
    return next(new ErrorData('Product not found', 404));
  }

  // Upload image to cloudinary
  const uploader = async (image) => uploadFile(image, 'ShopIt/products');
  const urls = await Promise.all(body.images?.map(uploader));

  // Save changes to DB
  product?.images?.push(...urls);
  await product.save();

  // Send response
  res.status(200).json({
    product,
  });
});

export const deleteProductImage = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { imageId } = req.body;

  // Find product
  const product = await ProductModel.findById(productId);

  if (!product) {
    return next(new ErrorData('Product not found', 404));
  }

  // Delete image in cloudinary
  const isDeleted = await deleteFile(imageId);

  // Sync changes to DB
  if (isDeleted) {
    product.images = product.images.filter(img => img.public_id !== imageId);
    await product.save();
  }

  // Send response
  res.status(200).json({
    product,
  });
});
