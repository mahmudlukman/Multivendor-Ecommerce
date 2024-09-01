import express from 'express';
import { isAdmin, isAuthenticated, isSeller } from '../middleware/auth';
import {
  activateShop,
  createShop,
  deleteShop,
  deleteWithdrawMethod,
  getAllShops,
  getShopById,
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
shopRouter.get('/my-shop', isSeller, getShopInfo);
shopRouter.get('/logout-shop', isSeller, logoutShop);
shopRouter.get('/shop-info/:id', getShopById);
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
