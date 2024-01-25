import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import ProductModel from '../models/product.js';
import OrderModel from '../models/order.js';
import ErrorData from '../utils/ErrorData.js';
import ProductFilter from '../utils/ProductFilter.js';

export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const queryStr = req.query;
  const productsPerPage = 4;

  // Search and filter products
  const productFilters = new ProductFilter({
    collectionToBeQueried: ProductModel,
    queryStr
  }).search().filter();

  let productsFound = await productFilters.collectionToBeQueried;
  const totalProductsFound = productsFound.length;

  // Limit products
  productFilters.pagination({ productsPerPage });
  productsFound = await productFilters.collectionToBeQueried.clone();

  let productsFoundCount = productsFound.length;

  // Send Response
  res.status(200).json({
    totalProductsFound,
    productsPerPage,
    productsFound,
    productsFoundCount,
  });
});

export const getProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const product = await ProductModel.findById(productId).populate('reviews.user');

  if (!product) {
    const errorData = new ErrorData('Product not found', 404);
    return next(errorData);
  }

  res.status(200).json({
    product,
  });
});

export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const product = await ProductModel.findById(productId).populate('reviews.user');

  if (!product) {
    const errorData = new ErrorData(`Product with id ${productId} was not found`, 404);
    return next(errorData);
  }

  res.status(200).json({
    reviews: product.reviews,
  });
});

export const postProductReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const { _id: userId } = req.user;

  const review = {
    user: userId,
    rating: Number(rating),
    comment,
  }

  const product = await ProductModel.findById(productId);

  if (!product) {
    const errorData = new ErrorData(`Add Product review was failed, product with id ${id} was not found`, 404);
    return next(errorData);
  }

  const isReviewed = product.reviews.find(review => review.user.toString() === userId.toString());

  if (isReviewed) {
    await product.updateProductReview({ userId, comment, rating });
    return res
      .status(200)
      .json({ message: `Product review of id ${productId} was successfully updated` });
  }

  await product.addProductReview({ productReview: review });
  res
    .status(200)
    .json({ message: `Product review was successfully added` });
});

export const canUserReview = catchAsyncErrors(async (req, res, next) => {
  // Check if user has purchased a product, if yes then user is allowed to give his/her review
  const { _id: userId } = req.user;
  const { productId } = req.params;

  const orders = await OrderModel.find({
    user: userId,
    'orderItems.product': productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({
      canReview: false,
    })
  }

  res.status(200).json({
    canReview: true,
  })
});
