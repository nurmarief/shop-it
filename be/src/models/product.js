import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    maxLength: [200, 'Product name cannot exceed 200 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [5, 'Product price cannot exceed 5 digits'],
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      }, // will come from cloudinary
      url: {
        type: String,
        required: true,
      }, // will come from cloudinary
    }
  ],
  category: {
    type: String,
    required: [true, 'Please enter product category'],
    enum: {
      values: ['Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Food', 'Books', 'Sports', 'Outdoor', 'Home'],
      message: 'Please select correct category',
    },
  },
  seller: {
    type: String,
    required: [true, 'Please enter product seller'],
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    }
  ],
}, { timestamps: true });

productSchema.methods.updateReviewsStat = async function () {
  // Reviews stat: numOfReviews, ratings
  const newReviewsCount = this.reviews.length;
  this.numOfReviews = newReviewsCount;
  if (newReviewsCount === 0) {
    this.ratings = 0;
  } else {
    const newRatings = (this.reviews.reduce((acc, review) => review.rating + acc, 0) / newReviewsCount).toFixed(1); // Return number with one decimal
    this.ratings = newRatings;
  }
  await this.save();
  return this;
};

productSchema.methods.addProductReview = async function ({ productReview }) {
  this.reviews.push(productReview);
  await this.save();
  await this.updateReviewsStat();
  return this;
};

productSchema.methods.deleteProductReviews = async function ({ productReviewIdToBeDeleted }) {
  const productReviewsSnapshot = this.reviews;
  const newProductReviews = productReviewsSnapshot.filter(review => review._id.toString() !== productReviewIdToBeDeleted.toString());

  this.reviews = newProductReviews;
  await this.save();
  await this.updateReviewsStat();
  return this;
};

productSchema.methods.updateProductReview = async function ({ userId, comment, rating }) {
  let oldRating;
  this.reviews.forEach(async (review) => {
    if (review.user.toString() === userId.toString()) {
      oldRating = review.rating;
      review.comment = comment;
      review.rating = rating;
    }
  });
  await this.save();
  if (!(oldRating == rating)) {
    await this.updateReviewsStat();
  }
  return this;
};

productSchema.methods.updateProductStock = async function ({ quantity }) {
  this.stock += quantity;
  await this.save();
  return this;
};

export default mongoose.model('Product', productSchema);
