import express from 'express';
import { isSeller, authorizeRoles, isAuthenticated } from '../middleware/auth';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getAllSellerOrders,
  getAllUserOrders,
  orderRefundRequest,
  orderRefundSuccess,
  updateOrderStatus,
} from '../controllers/order';

const orderRouter = express.Router();

orderRouter.post('/create-order', createOrder);
orderRouter.get('/user-orders',isAuthenticated, getAllUserOrders);
orderRouter.get('/seller-orders/:shopId', getAllSellerOrders);
orderRouter.put('/update-order-status/:id', isSeller, updateOrderStatus);
orderRouter.put('/order-refund/:id', orderRefundRequest);
orderRouter.put('/order-refund-success/:id', isSeller, orderRefundSuccess);
orderRouter.get('/all-orders', isAuthenticated, authorizeRoles('admin'), getAllOrders);
orderRouter.delete('/delete-order/:id', deleteOrder);

export default orderRouter;
