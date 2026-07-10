import Stripe from 'stripe';
import crypto from 'crypto';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { sendDownloadEmail } from '../config/mailer.js';

const getStripeInstance = () => {
  if (process.env.STRIPE_SECRET_KEY) {
    return new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return null;
};

// Helper function to handle order fulfillment
export const fulfillOrder = async (orderId, customerEmail, customerName, productName) => {
  try {
    const order = await Order.findById(orderId).populate('product');
    if (!order) return { success: false, message: 'Order not found' };
    
    if (order.status === 'Paid') {
      return { success: true, message: 'Order already fulfilled', order };
    }

    order.status = 'Paid';
    
    // Generate secure unique token if not existing
    if (!order.downloadToken) {
      order.downloadToken = crypto.randomUUID();
    }
    
    await order.save();

    // Trigger Email delivery
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const downloadUrl = `${frontendUrl}/download/${order.downloadToken}`;

    const mailResult = await sendDownloadEmail({
      to: customerEmail,
      customerName,
      productName,
      downloadUrl
    });

    if (mailResult.success) {
      order.emailSent = true;
      await order.save();
    }

    return { success: true, order, emailSent: mailResult.success, previewUrl: mailResult.previewUrl };
  } catch (err) {
    console.error('Fulfillment error:', err);
    return { success: false, error: err.message };
  }
};

export const createCheckoutSession = async (req, res) => {
  const { productId, customerName, customerEmail } = req.body;

  try {
    if (!productId || !customerName || !customerEmail) {
      return res.status(400).json({ message: 'Product ID, customer name, and email are required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const stripe = getStripeInstance();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const downloadToken = crypto.randomUUID();

    if (stripe) {
      console.log('Stripe configuration detected, starting Stripe Checkout Session...');
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: Math.round(product.price * 100), // Stripe expects cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: customerEmail,
        success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/checkout/cancel`,
        metadata: {
          productId: product._id.toString(),
          customerName,
          customerEmail,
        },
      });

      // Save order as pending
      const order = new Order({
        customerName,
        customerEmail,
        product: product._id,
        amount: product.price,
        status: 'Pending',
        paymentId: session.id,
        downloadToken,
      });
      await order.save();

      res.json({ id: session.id, url: session.url });
    } else {
      console.log('Stripe key missing. Simulating sandbox payment checkout...');
      // Simulated sandbox mode
      const mockSessionId = 'mock_stripe_session_' + Date.now();
      const order = new Order({
        customerName,
        customerEmail,
        product: product._id,
        amount: product.price,
        status: 'Pending',
        paymentId: mockSessionId,
        downloadToken,
      });
      await order.save();

      // Return a frontend URL that will redirect to success page directly with mockSessionId
      const sandboxSuccessUrl = `${frontendUrl}/checkout/success?session_id=${mockSessionId}&sandbox=true`;
      res.json({
        id: mockSessionId,
        url: sandboxSuccessUrl,
        sandbox: true,
        message: 'Sandbox Mode Active: Stripe Keys are not configured. Redirecting to sandbox success page.'
      });
    }
  } catch (error) {
    console.error('Create Checkout Session Error:', error);
    res.status(500).json({ message: 'Server error initializing checkout.' });
  }
};

export const verifyCheckoutSession = async (req, res) => {
  const { session_id, sandbox } = req.query;

  try {
    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required.' });
    }

    // Find order
    const order = await Order.findOne({ paymentId: session_id }).populate('product');
    if (!order) {
      return res.status(404).json({ message: 'Order for this session not found.' });
    }

    // If sandbox parameter is set or session_id is a mock one, immediately fulfill the order
    if (sandbox === 'true' || session_id.startsWith('mock_stripe_session_')) {
      console.log(`Fulfilling mock/sandbox payment for session: ${session_id}`);
      const fulfillment = await fulfillOrder(order._id, order.customerEmail, order.customerName, order.product.name);
      return res.json({
        success: true,
        message: 'Mock payment fulfilled.',
        order: fulfillment.order,
        emailSent: fulfillment.emailSent,
        previewUrl: fulfillment.previewUrl,
        sandbox: true
      });
    }

    const stripe = getStripeInstance();
    if (!stripe) {
      return res.status(400).json({ message: 'Stripe keys are not configured. Use Sandbox payment mode.' });
    }

    // Retrieve real session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      console.log(`Fulfilling real Stripe payment for session: ${session_id}`);
      const fulfillment = await fulfillOrder(order._id, order.customerEmail, order.customerName, order.product.name);
      res.json({
        success: true,
        message: 'Stripe payment successfully verified and fulfilled.',
        order: fulfillment.order,
        emailSent: fulfillment.emailSent,
        previewUrl: fulfillment.previewUrl
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment has not been completed on Stripe.',
        status: session.payment_status
      });
    }
  } catch (error) {
    console.error('Verify Checkout Session Error:', error);
    res.status(500).json({ message: 'Server error verifying payment session.' });
  }
};

// Stripe Webhook handler for production deploy
export const stripeWebhook = async (req, res) => {
  const stripe = getStripeInstance();
  if (!stripe) {
    return res.status(400).send('Webhook Error: Stripe is not configured');
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    // If webhook secret isn't provided, parse raw event
    if (!endpointSecret) {
      event = req.body;
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`Webhook: Payment received for Stripe Session: ${session.id}`);

    try {
      const order = await Order.findOne({ paymentId: session.id }).populate('product');
      if (order) {
        await fulfillOrder(order._id, order.customerEmail, order.customerName, order.product.name);
      }
    } catch (err) {
      console.error('Webhook order processing error:', err.message);
    }
  }

  res.json({ received: true });
};
