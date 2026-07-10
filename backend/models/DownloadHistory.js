import mongoose from 'mongoose';

const downloadHistorySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  downloadToken: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  downloadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('DownloadHistory', downloadHistorySchema);
