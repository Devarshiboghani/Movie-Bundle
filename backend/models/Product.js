import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String }, // Base64 or local URL
  pdfPath: { type: String, required: true }, // Path to the secure PDF file in backend/uploads
  features: [{ type: String }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
