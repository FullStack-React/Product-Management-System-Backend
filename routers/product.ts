import express from 'express';
import {
  createProduct,
  getProduct,
  getProducts,
  getVendorProducts,
} from '../controllers/product.ts';
import { vendorAuth } from '../middlewares/auth.ts';

const router = express.Router();

router.post('/create_product', vendorAuth, createProduct);
// router.post('/create_product', createProduct);
router.get('/get_product/:id', getProduct);
router.get('/get_products', getProducts);
router.get('/get_vendor_products', vendorAuth, getVendorProducts);
export default router;
