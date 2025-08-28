// src/config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:29017/mernshop';
  console.log('[DB] Using MONGO_URI =', uri);   // <--- TEŞHİS LOGU
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB error', err.message);
    process.exit(1);
  }
};
