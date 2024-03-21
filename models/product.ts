import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const ProductSchema = new Schema({
  vendor: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
