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

// get cart basic info;
export const getCartBasicInfo = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id);
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
    const product = await Product.findById(req.params?.id);
    // console.log(user?.totalPricesInCart);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const productIn = user.cart.find((item: any) =>
      item.product.equals(req.params?.id),
    );

    if (productIn) {
      if (productIn.quantity === product.stock) {
        return res.status(400).json({ message: 'Product out of stock' });
      } else {
        productIn.quantity += 1;
      }
    } else {
      const newInCart = { product: req.params.id, quantity: 1 };
      user.cart.push(newInCart);
    }

    user.numProductsInCart += 1;
    await user.save();

    const userCart = await User.findById(req.body.user.id).populate(
      'cart.product',
    );

    if (userCart) {
      let total = 0;
      userCart.cart.forEach((item: any) => {
        total += item.product.price * item.quantity;
        // console.log("item", item, "total", total);
      });

      user.totalPricesInCart = total;
      // console.log("total", total);
      await user.save();
    } else {
      return res.status(404).json({ message: 'User cart not found' });
    }

    res.status(200).json({
      numProductsInCart: user.numProductsInCart,
      totalPricesInCart: user.totalPricesInCart,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// decrease product quantity in user's cart;
export const decreaseProduct = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id).populate('cart.product');
    // console.log(user?.totalPricesInCart);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const productIn = user.cart.find((item: any) =>
      item.product.equals(req.params?.id),
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

    let total = 0;
    user.cart.forEach((item: any) => {
      total += item.product.price * item.quantity;
    });

    user.totalPricesInCart = total;

    // console.log("user", user, "total", total)

    await user.save();

    res.status(200).json({
      numProductsInCart: user.numProductsInCart,
      totalPricesInCart: user.totalPricesInCart,
    });
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
      item.product.equals(req.params?.id),
    );
    if (!productIn) {
      return res.status(404).json({ message: 'Product not found' });
    }
    user.numProductsInCart -= productIn.quantity;
    user.cart.pull({ product: req.params?.id });
    await user.save();

    const userCart = await User.findById(req.body.user.id).populate(
      'cart.product',
    );

    if (userCart) {
      let total = 0;
      userCart.cart.forEach((item: any) => {
        total += item.product.price * item.quantity;
        // console.log("item", item, "total", total);
      });

      user.totalPricesInCart = total;
      // console.log("total", total);
      await user.save();
    } else {
      return res.status(404).json({ message: 'User cart not found' });
    }
    res.status(200).json({
      numProductsInCart: user.numProductsInCart,
      totalPricesInCart: user.totalPricesInCart,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// // get total price and tax of products in user's cart;
// export const getCartTotalAndTax = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findById(req.body.user.id).populate('cart.product');
//     console.log(user);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     let total = 0;
//     user.cart.forEach((item: any) => {
//       total += item.product.price * item.quantity;
//     });
//     user.totalPricesInCart = total;
//     await user.save();
//     const tax = total * 0.08;
//     res.status(200).json({ total, tax });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (typeof query !== 'string') {
      return res
        .status(400)
        .json({ message: 'Query parameter "query" is required' });
    }

    // Search for products based on name or description containing the query string
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search for name
        // { description: { $regex: query, $options: 'i' } }, // Case-insensitive search for description
      ],
    });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
