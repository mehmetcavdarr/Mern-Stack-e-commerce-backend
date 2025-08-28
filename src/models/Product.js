import mongoose from 'mongoose';


const productSchema = new mongoose.Schema(
{
title: { type: String, required: true, index: 'text' },
description: { type: String, default: '' },
price: { type: Number, required: true },
images: [{ type: String }],
category: { type: String, index: true },
brand: { type: String },
countInStock: { type: Number, default: 0 },
rating: { type: Number, default: 0 },
numReviews: { type: Number, default: 0 }
},
{ timestamps: true }
);


productSchema.index({ title: 'text', description: 'text' });


export default mongoose.model('Product', productSchema);