//models/Product.js
import mongoose from 'mongoose';

const PriceVariationSchema = new mongoose.Schema({
  price: Number,
  date: String,
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  url: { type: String, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  lowestPrice: { type: Number, required: true },
  highestPrice: { type: Number, required: true },
  rating: { type: Number },
  website: { type: String, required: true },
  priceVariations: [PriceVariationSchema],
  desc: { type: String }  // Added 'desc' field
}, { collection: 'products' });


export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
