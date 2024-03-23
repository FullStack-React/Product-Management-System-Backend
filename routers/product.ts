import express from 'express';
import { createProduct } from '../controllers/product.ts';
import { vendorAuth } from '../middlewares/auth.ts';

const router = express.Router();

// router.post('/create_product', createProduct);
router.post('/create_product', vendorAuth, createProduct);
router.post;

export default router;
