import process from 'node:process';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Stripe from 'stripe';
import OrderModel from '../models/order.js';

const { STRIPE_SECRET_KEY, FRONT_END_URL, STRIPE_WEBHOOK_SECRET } = process.env;
const stripe = new Stripe(STRIPE_SECRET_KEY);

export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  const body = req.body;
  const lineItems = body.orderItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image],
        metadata: { productId: item.product }
      },
      unit_amount: item.price * 100
    },
    tax_rates: ['txr_1ObG7nKteTxxp26Is776FJG5'],
    quantity: item.quantity,
  }));
  const shippingRate = body.itemsPrice <= 200
    ? "shr_1ObFwhKteTxxp26IrmMRvzOA"
    : "shr_1ObFxIKteTxxp26ISK9hp5NW";
  const shippingInfo = body.shippingInfo;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${FRONT_END_URL}/me/orders?order-success=true`,
    cancel_url: `${FRONT_END_URL}/`,
    customer_email: user.email,
    client_reference_id: user._id.toString(),
    mode: 'payment',
    metadata: { ...shippingInfo, itemsPrice: body.itemsPrice },
    shipping_options: [
      {
        shipping_rate: shippingRate,
      }
    ],
    line_items: lineItems,
  });

  res.status(200).json({
    url: session.url,
  })
});

const getOrderItems = async (lineItems) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    lineItems.data.forEach(async item => {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      cartItems.push({
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      });

      if (cartItems.length === lineItems.data.length) {
        resolve(cartItems);
      }
    })
  })
}

export const stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  const rawBody = req.rawBody;
  const signature = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      // Create order in DB
      const orderItems = await getOrderItems(lineItems);
      const user = session.client_reference_id;
      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      const itemsPrice = session.metadata.itemsPrice;
      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        zipCode: session.metadata.zipCode,
        country: session.metadata.country,
      };
      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod: 'Card',
        user,
      }

      await OrderModel.create(orderData);

      res.status(200).json({
        success: true,
      })
    }
  } catch (error) {
    console.log(error)
  }
});
