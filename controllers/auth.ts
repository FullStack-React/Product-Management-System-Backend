import User from '../models/user.ts';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserResponse {
  id: string;
  email: string;
  role: string;
  token: string;
  numberProductsInCart?: number;
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } else if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.SECRET || 'test',
      { expiresIn: '1h' },
    );
    const userWithToken: UserResponse = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      numberProductsInCart: user.numProductsInCart,
      token,
    };
    return res.status(200).json(userWithToken);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
