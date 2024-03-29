import express from 'express';
import {
  createProduct,
  getProductCount,
  getVendorProductCount,
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
router.get('/get_vendor_products/', vendorAuth, getVendorProducts);
router.get('/get_products_count', getProductCount);
router.get('/get_vendor_products_count/', vendorAuth, getVendorProductCount);
export default router;
