import express from 'express';
import {
  createUser,
  addAndIncreaseProduct,
  decreaseProduct,
  removeProduct,
  getCart,
  getCartBasicInfo,
  searchProducts,
} from '../controllers/user.ts';
import { auth } from '../middlewares/auth.ts';

const router = express.Router();

router.post('/signup', createUser);
router.post('/add_product/:id', auth, addAndIncreaseProduct);
router.post('/decrease_product/:id', auth, decreaseProduct);
router.post('/remove_product/:id', auth, removeProduct);
router.get('/get_cart', auth, getCart);
router.get('/get_cart_basic', auth, getCartBasicInfo);
router.get('/search_products', searchProducts);

export default router;
