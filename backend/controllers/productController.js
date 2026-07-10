import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';

// Helper to remove files safely
const deleteFileSafe = (filePath) => {
  if (!filePath) return;
  try {
    const resolvedPath = path.resolve(filePath);
    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
      console.log(`Deleted file: ${resolvedPath}`);
    }
  } catch (err) {
    console.error(`Error deleting file at ${filePath}:`, err.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const { all } = req.query; // Admin can request inactive ones too
    const filter = all === 'true' ? {} : { active: true };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ message: 'Server error retrieving products list.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get Product By Id Error:', error);
    res.status(500).json({ message: 'Server error retrieving product details.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, thumbnail, features } = req.body;

    if (!name || !description || !price) {
      // If a file was uploaded by multer, clean it up before returning error
      if (req.file) deleteFileSafe(req.file.path);
      return res.status(400).json({ message: 'Name, description, and price are required.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'A PDF eBook file upload is required.' });
    }

    // parse features array from string if sent as JSON string
    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (err) {
        parsedFeatures = String(features).split(',').map(f => f.trim());
      }
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      thumbnail: thumbnail || '', // holds data URL or image URL
      pdfPath: req.file.path, // Multer saved path
      features: parsedFeatures,
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully!', product });
  } catch (error) {
    console.error('Create Product Error:', error);
    if (req.file) deleteFileSafe(req.file.path);
    res.status(500).json({ message: 'Server error creating product.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, thumbnail, features, active } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      if (req.file) deleteFileSafe(req.file.path);
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (active !== undefined) product.active = active === 'true' || active === true;

    if (features) {
      try {
        product.features = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (err) {
        product.features = String(features).split(',').map(f => f.trim());
      }
    }

    if (req.file) {
      // User uploaded a new PDF, delete the old one
      deleteFileSafe(product.pdfPath);
      product.pdfPath = req.file.path;
    }

    await product.save();
    res.json({ message: 'Product updated successfully!', product });
  } catch (error) {
    console.error('Update Product Error:', error);
    if (req.file) deleteFileSafe(req.file.path);
    res.status(500).json({ message: 'Server error updating product.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Delete PDF file from storage
    deleteFileSafe(product.pdfPath);

    // Delete document
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: 'Server error deleting product.' });
  }
};
