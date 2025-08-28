import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';


dotenv.config();
const app = express();


// DB
await connectDB();


// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));


// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


// Errors
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API running on :${PORT}`));