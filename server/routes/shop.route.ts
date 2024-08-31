import express from 'express';
import { isAdmin, isAuthenticated, isSeller } from '../middleware/auth';
import {
  activateShop,
  createShop,
  deleteShop,
  deleteWithdrawMethod,
  getAllShops,
  getShopInfo,
  loginShop,
  logoutShop,
  updateShopAvatar,
  updateShopInfo,
  updateShopPassword,
  updateWithdrawMethod,
} from '../controllers/shop';

const shopRouter = express.Router();

shopRouter.post('/create-shop', createShop);
shopRouter.post('/activate-shop', activateShop);
shopRouter.post('/login-shop', loginShop);
shopRouter.get('/seller', isSeller, getShopInfo);
shopRouter.get('/logout-shop', isAuthenticated, logoutShop);
shopRouter.get('/shop-info/:id', getShopInfo);
shopRouter.put('/update-shop-info', isSeller, updateShopInfo);
shopRouter.put('/update-shop-password', isSeller, updateShopPassword);

shopRouter.put('/update-shop-avatar', isSeller, updateShopAvatar);

shopRouter.get('/get-shops', isAuthenticated, isAdmin('admin'), getAllShops);

shopRouter.delete(
  '/delete-shop/:id',
  isAuthenticated,
  isAdmin('admin'),
  deleteShop
);

shopRouter.put('/update-payment-methods', isSeller, updateWithdrawMethod);

shopRouter.delete('/delete-withdraw-method', isSeller, deleteWithdrawMethod);

export default shopRouter;
