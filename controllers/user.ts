import User from '../models/user.ts';
import type { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content can not be empty!' });
  }
  if (!req.body.email || !req.body.password || !req.body.role) {
    res.status(400).send({ message: 'Email, password, and role are required' });
  }
  if (req.body.role !== 'customer' && req.body.role !== 'vendor') {
    res.status(400).send({ message: 'Role must be either customer or vendor' });
  }
  const { email, password, role } = req.body;
  const user = new User({ email, password, role });
  try {
    await user.save();
    res.status(201).json(user);
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};
