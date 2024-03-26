import Product from '../models/product.ts';
import User from '../models/user.ts';
import type { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Create new product
    // vendor ID get from decoding jwt
    req.body.vendor = req.body.user.id;
    const product = new Product(req.body);
    await product.save();

    // Put product to corresponding vendor
    const user = await User.findById(req.body.vendor);
    if (user) {
      user.ownedProducts.push(product._id);
      await user.save();
    }

    // Create token
    res.status(201).json({ success: true, message: 'Product created' });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// get product by id;
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// get products list;
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// update product by id;
// get all products owned by a specific vendor;
