import User from '../models/user.ts';
import Product from '../models/product.ts';
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

// get all products in user's cart;
export const getCart = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// add product to user's cart and increase quantity(we only do increase by 1 for now);
export const addAndIncreaseProduct = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id);
    const product = await Product.findById(req.body.product);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const productIn = user.cart.find((item: any) =>
      item.product.equals(req.body.product),
    );
    if (productIn && productIn.quantity < product.stock) {
      productIn.quantity += 1;
    } else {
      const newInCart = { product: req.body.product, quantity: 1 };
      user.cart.push(newInCart);
    }
    user.numProductsInCart += 1;
    await user.save();
    res.status(200).json(user.cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// decrease product quantity in user's cart;
export const decreaseProduct = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const productIn = user.cart.find((item: any) =>
      item.product.equals(req.body.product),
    );
    if (!productIn) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (productIn.quantity > 1) {
      productIn.quantity -= 1;
      user.numProductsInCart -= 1;
    } else {
      return res
        .status(400)
        .json({ message: 'Quantity cannot be less than 1' });
    }
    await user.save();
    res.status(200).json(user.cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// remove product
export const removeProduct = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const productIn = user.cart.find((item: any) =>
      item.product.equals(req.body.product),
    );
    if (!productIn) {
      return res.status(404).json({ message: 'Product not found' });
    }
    user.numProductsInCart -= productIn.quantity;
    user.cart.pull({ product: req.body.product });

    await user.save();
    res.status(200).json(user.cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// get total price and tax of products in user's cart;
export const getCartTotalAndTax = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let total = 0;
    user.cart.forEach((item: any) => {
      total += item.product.price * item.quantity;
    });
    const tax = total * 0.08;
    res.status(200).json({ total, tax });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
