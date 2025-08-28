import mongoose from 'mongoose';


const orderItemSchema = new mongoose.Schema(
{
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
title: String,
image: String,
price: Number,
qty: Number
},
{ _id: false }
);


const orderSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
items: [orderItemSchema],
shippingAddress: {
fullName: String,
address: String,
city: String,
country: String,
postalCode: String
},
paymentMethod: { type: String, enum: ['stripe', 'iyzico', 'cod'], default: 'stripe' },
paymentResult: {},
itemsPrice: Number,
taxPrice: Number,
shippingPrice: Number,
totalPrice: Number,
status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
paidAt: Date,
deliveredAt: Date
},
{ timestamps: true }
);


export default mongoose.model('Order', orderSchema);