import Product from '../models/Product.js';


export const createProduct = async (req, res) => {
const product = await Product.create(req.body);
res.status(201).json(product);
};


export const getProducts = async (req, res) => {
const page = Number(req.query.page || 1);
const limit = Number(req.query.limit || 12);
const skip = (page - 1) * limit;


const keyword = req.query.q?.trim();
const filters = {};
if (keyword) filters.$text = { $search: keyword };
if (req.query.category) filters.category = req.query.category;
if (req.query.min || req.query.max) filters.price = {
...(req.query.min ? { $gte: Number(req.query.min) } : {}),
...(req.query.max ? { $lte: Number(req.query.max) } : {})
};


let sort = { createdAt: -1 };
if (req.query.sort === 'price_asc') sort = { price: 1 };
if (req.query.sort === 'price_desc') sort = { price: -1 };
if (req.query.sort === 'rating_desc') sort = { rating: -1 };


const [items, total] = await Promise.all([
Product.find(filters).sort(sort).skip(skip).limit(limit),
Product.countDocuments(filters)
]);


res.json({ items, total, page, pages: Math.ceil(total / limit) });
};


export const getProduct = async (req, res) => {
const p = await Product.findById(req.params.id);
if (!p) return res.status(404).json({ message: 'Product not found' });
res.json(p);
};


export const updateProduct = async (req, res) => {
const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!p) return res.status(404).json({ message: 'Product not found' });
res.json(p);
};


export const deleteProduct = async (req, res) => {
const p = await Product.findByIdAndDelete(req.params.id);
if (!p) return res.status(404).json({ message: 'Product not found' });
res.json({ ok: true });
};