import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendDownloadEmail } from '../config/mailer.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ message: 'Server error retrieving orders.' });
  }
};

export const getCustomers = async (req, res) => {
  try {
    // Unique list of customers grouped by email
    const customers = await Order.aggregate([
      { $match: { status: 'Paid' } },
      {
        $group: {
          _id: '$customerEmail',
          name: { $first: '$customerName' },
          totalSpent: { $sum: '$amount' },
          ordersCount: { $sum: 1 },
          lastPurchase: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);
    res.json(customers);
  } catch (error) {
    console.error('Get Customers Error:', error);
    res.status(500).json({ message: 'Server error retrieving customers.' });
  }
};

export const resendOrderEmail = async (req, res) => {
  const { orderId } = req.body;

  try {
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }

    const order = await Order.findById(orderId).populate('product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.status !== 'Paid') {
      return res.status(400).json({ message: 'Cannot resend download link for an unpaid order.' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const downloadUrl = `${frontendUrl}/download/${order.downloadToken}`;

    const mailResult = await sendDownloadEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      productName: order.product.name,
      downloadUrl
    });

    if (mailResult.success) {
      order.emailSent = true;
      await order.save();
      res.json({
        success: true,
        message: 'Order download email resent successfully!',
        previewUrl: mailResult.previewUrl
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email via SMTP service.',
        error: mailResult.error
      });
    }
  } catch (error) {
    console.error('Resend Order Email Error:', error);
    res.status(500).json({ message: 'Server error during email dispatch.' });
  }
};
