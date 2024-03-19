import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET || 'test');
    req.body.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth;
