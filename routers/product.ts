import express from 'express';
import {
  createProduct,
  getProduct,
  getProducts,
} from '../controllers/product.ts';
import { vendorAuth } from '../middlewares/auth.ts';

const router = express.Router();

router.post('/create_product', vendorAuth, createProduct);
router.get('/get_product/:id', getProduct);
router.get('/get_products', getProducts);
export default router;
