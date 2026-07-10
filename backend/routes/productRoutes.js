import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', protectAdmin, upload.single('pdf'), createProduct);
router.put('/:id', protectAdmin, upload.single('pdf'), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
