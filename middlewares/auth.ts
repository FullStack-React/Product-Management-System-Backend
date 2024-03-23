import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Authorization denied, please log in' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET || 'test');
    req.body.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const vendorAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET || 'test') as {
      role: string;
    };
    if (decoded.role === 'vendor') {
      req.body.user = decoded;
      return next();
    } else {
      return res.status(401).json({ message: 'Only Vendors Can Do This' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Authentification Failed' });
  }
};
