import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['customer', 'vendor'],
  },
  numProductsInCart: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPricesInCart: {
    type: Number,
    required: true,
    default: 0,
  },
  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ],

  // only for vendors
  ownedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

const User = mongoose.model('User', UserSchema);

export default User;
