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
});

const User = mongoose.model('User', UserSchema);

export default User;
