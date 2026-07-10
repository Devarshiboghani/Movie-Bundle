import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  paymentId: { type: String }, // Stripe Checkout Session ID or Local Mock ID
  downloadToken: { type: String, unique: true }, // secure UUID token sent via email
  emailSent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
