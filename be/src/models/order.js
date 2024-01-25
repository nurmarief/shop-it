import mongoose from 'mongoose';
import ProductModel from './product.js';

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      }
    }
  ],
  paymentMethod: {
    type: String,
    required: [true, 'Please select payment method'],
    enum: {
      values: ['COD', 'Card'],
      message: 'Please select payment method'
    }
  },
  paymentInfo: {
    id: String,
    status: String,
  },
  itemsPrice: {
    type: Number,
    required: true,
  },
  taxAmount: {
    type: Number,
    required: true,
  },
  shippingAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    default: 'Processing',
    enum: {
      values: ['Processing', 'Shipped', 'Delivered'],
      message: 'Please select order status'
    }
  },
  deliveredAt: Date
}, { timestamps: true });

orderSchema.methods.updateOrderStatus = async function ({ status }) {
  this.orderStatus = status;
  this.deliveredAt = Date.now();
  await this.save();
  return this;
};

orderSchema.methods.updateProductStock = async function () {
  this.orderItems.forEach(async (item) => {
    const itemId = item.product.toString();
    const itemQuantity = item.quantity;

    const product = await ProductModel.findById(itemId);

    // Shouldn't be bothered by not found product
    if (product) {
      await product.updateProductStock({ quantity: -itemQuantity });
    }

    return this;
  });
};

export default mongoose.model('Order', orderSchema);
