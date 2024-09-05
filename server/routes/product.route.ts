import express from 'express';
import {
  createProduct,
  deleteProductInShop,
  getAllProducts,
  getAllProductsInShop,
  getProduct,
  reviewProduct,
} from '../controllers/product';
import { isSeller, isAuthenticated } from '../middleware/auth';

const productRouter = express.Router();

productRouter.post('/create-product', createProduct);
productRouter.get('/all-products-shop/:id', getAllProductsInShop);
productRouter.delete('/delete-shop-product/:id', isSeller, deleteProductInShop);
productRouter.get('/all-products', getAllProducts);
productRouter.get('/product/:id', getProduct);
productRouter.put('/review-product', isAuthenticated, reviewProduct);

export default productRouter;
