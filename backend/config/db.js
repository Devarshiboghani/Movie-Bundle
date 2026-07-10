import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_bundle_db';
    console.log(`Attempting connection to MongoDB: ${connString}`);
    const conn = await mongoose.connect(connString);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Ensure MongoDB is installed and running locally, or supply a valid MONGODB_URI in your environment.');
    // Do not crash the server immediately so that it can still run or let devs debug
  }
};

export default connectDB;
