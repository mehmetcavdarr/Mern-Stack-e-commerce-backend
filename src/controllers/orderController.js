// src/controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET ? new Stripe(process.env.STRIPE_SECRET) : null;

export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'No items' });

  // ürün fiyatlarını DB'den çek ve map oluştur
  const ids = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids } });
  const priceMap = new Map(products.map((p) => [String(p._id), p.price]));

  const normalized = items.map((i) => ({
    product: i.product,
    title: i.title,
    image: i.image,
    qty: i.qty,
    price: priceMap.get(String(i.product)) ?? i.price ?? 0,
  }));

  const itemsPrice = normalized.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
  const shippingPrice = itemsPrice > 1000 ? 0 : 49.9;
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

  const order = await Order.create({
    user: req.user.id,
    items: normalized,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  if (paymentMethod === 'stripe' && stripe) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: 'try',
      metadata: { orderId: String(order._id) },
    });
    return res.status(201).json({ order, clientSecret: paymentIntent.client_secret });
  }

  // iyzico veya kapıda ödeme için şimdilik direkt order döndür
  return res.status(201).json({ order });
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  return res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product', 'title price');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (String(order.user) !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return res.json(order);
};

export const markPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = 'paid';
  order.paidAt = new Date();
  order.paymentResult = req.body?.paymentResult || {};
  await order.save();
  return res.json(order);
};
