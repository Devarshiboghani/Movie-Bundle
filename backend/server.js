import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedDefaultAdmin } from './controllers/authController.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  // Seed default admin account
  seedDefaultAdmin();
});

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// We only use express.json() for non-webhook routes or handle it carefully, 
// but stripe webhook raw body parser is registered inside the payment routes before standard json parsing
app.use((req, res, next) => {
  if (req.originalUrl === '/api/checkout/webhook') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Expose public folder (if any, e.g. for uploads thumbnails if needed)
// Note: We do NOT serve the "uploads" directory statically, to prevent direct PDF access!
// We only serve secure tokenized endpoints for PDF retrieval.

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/downloads', downloadRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Digital Bundle Marketplace API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'An internal server error occurred.'
  });
});

// Listen
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
