import Product from '../models/product.ts';
import User from '../models/user.ts';
import type { Request, Response } from 'express';

const Order = ['-updatedAt', '-price', 'price'];

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Create new product
    // vendor ID get from decoding jwt
    req.body.vendor = req.body.user.id;
    console.log(req.body);
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
    console.log(product);
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

export const getProductCount = async (req: Request, res: Response) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getVendorProductCount = async (req: Request, res: Response) => {
  try {
    const count = await Product.countDocuments({ vendor: req.body.user.id });
    res.status(200).json({ success: true, count });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getPagedProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const order = Order[parseInt(req.query.sort as string)];

    const startIndex = (page - 1) * limit;

    const results = await Product.find()
      .sort(order)
      .skip(startIndex)
      .limit(limit);
    res.status(200).json({ success: true, results });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getPagedVendorProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const order = Order[parseInt(req.query.sort as string)];

    const startIndex = (page - 1) * limit;

    const results = await Product.find()
      .sort(order)
      .skip(startIndex)
      .limit(limit);
    res.status(200).json({ success: true, results });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// get products list;
export const getProducts = async (req: Request, res: Response) => {
  if (req.query.page && req.query.limit) {
    return getPagedProducts(req, res);
  }
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
// get all products owned by a specific vendor;
export const getVendorProducts = async (req: Request, res: Response) => {
  if (req.query.page && req.query.limit) {
    return getPagedVendorProducts(req, res);
  }
  try {
    const user = await User.findById(req.body.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    if (user.role !== 'vendor') {
      return res
        .status(400)
        .json({ success: false, message: 'User is not a vendor' });
    }
    const products = await Product.find({ vendor: req.body.user.id });
    res.status(200).json({ success: true, products });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// update product by id;
export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (req.body.vendor !== req.body.user.id) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized access' });
    }
    req.body.updatedAt = Date.now();
    const product = await Product.findByIdAndUpdate(req.body._id, req.body);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product updated' });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
