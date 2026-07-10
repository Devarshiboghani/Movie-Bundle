import Order from '../models/Order.js';
import DownloadHistory from '../models/DownloadHistory.js';
import fs from 'fs';
import path from 'path';

export const validateDownloadToken = async (req, res) => {
  const { token } = req.params;

  try {
    const order = await Order.findOne({ downloadToken: token }).populate('product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Invalid or expired download token.' });
    }

    if (order.status !== 'Paid') {
      return res.status(403).json({ success: false, message: 'Order payment is incomplete. Access denied.' });
    }

    res.json({
      success: true,
      order: {
        id: order._id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        createdAt: order.createdAt,
      },
      product: {
        name: order.product.name,
        description: order.product.description,
        thumbnail: order.product.thumbnail,
      }
    });
  } catch (error) {
    console.error('Validate Download Token Error:', error);
    res.status(500).json({ success: false, message: 'Server error validating download link.' });
  }
};

export const downloadFile = async (req, res) => {
  const { token } = req.params;

  try {
    const order = await Order.findOne({ downloadToken: token }).populate('product');
    if (!order) {
      return res.status(404).json({ message: 'Invalid download link.' });
    }

    if (order.status !== 'Paid') {
      return res.status(403).json({ message: 'Payment verification failed. Cannot download file.' });
    }

    const product = order.product;
    if (!product || !product.pdfPath) {
      return res.status(404).json({ message: 'Product file resource not found.' });
    }

    const resolvedFilePath = path.resolve(product.pdfPath);

    // Security Check: Ensure file exists
    if (!fs.existsSync(resolvedFilePath)) {
      console.error(`Secure PDF file not found on disk at: ${resolvedFilePath}`);
      return res.status(404).json({ message: 'File is currently unavailable on the server.' });
    }

    // Register Download History
    const downloadRecord = new DownloadHistory({
      order: order._id,
      downloadToken: token,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    await downloadRecord.save();

    // Stream File
    const stat = fs.statSync(resolvedFilePath);
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`
    });

    const readStream = fs.createReadStream(resolvedFilePath);
    readStream.pipe(res);
  } catch (error) {
    console.error('Download File Error:', error);
    res.status(500).json({ message: 'Server error initiating secure file stream.' });
  }
};

export const getDownloadHistory = async (req, res) => {
  try {
    const history = await DownloadHistory.find()
      .populate({
        path: 'order',
        populate: { path: 'product' }
      })
      .sort({ downloadedAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('Get Download History Error:', error);
    res.status(500).json({ message: 'Server error retrieving download history.' });
  }
};
