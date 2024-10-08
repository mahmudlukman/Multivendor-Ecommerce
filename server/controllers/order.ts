import { Request, Response, NextFunction } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';
import Order, { IOrder } from '../models/Order';
import Product from '../models/Product';
import Shop from '../models/Shop';

interface ICreateOrder {
  cart: IOrder['cart'];
  shippingAddress: IOrder['shippingAddress'];
  user: IOrder['user'];
  totalPrice: number;
  paymentInfo: IOrder['paymentInfo'];
}

// create order
export const createOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo }: ICreateOrder = req.body;

      // group cart items by shopId
      const shopItemsMap = new Map<string, IOrder['cart']>();

      for (const item of cart) {
        const shopId = (item as any).shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId)!.push(item);
      }

      // create an order for each shop
      const orders: IOrder[] = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all orders of user
export const getAllUserOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({
        'user._id': req.params.userId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all orders of seller
export const getAllSellerOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({
        'cart.shopId': req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update order status for seller
export const updateOrderStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler('Order not found with this id', 400));
      }
      if (req.body.status === 'Transferred to delivery partner') {
        order.cart.forEach(async (o: any) => {
          await updateOrder(o._id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === 'Delivered') {
        order.deliveredAt = new Date();
        if (order.paymentInfo) {
          order.paymentInfo.status = 'Succeeded';
        }
        const serviceCharge = order.totalPrice * 0.1;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id: string, qty: number) {
        const product = await Product.findById(id);
        if (product) {
          product.stock -= qty;
          product.sold_out += qty;
          await product.save({ validateBeforeSave: false });
        }
      }

      async function updateSellerInfo(amount: number) {
        const seller = await Shop.findById((req as any).seller.id);
        if (seller) {
          seller.availableBalance = amount;
          await seller.save();
        }
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// give a refund ----- user
export const orderRefundRequest = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler('Order not found with this id', 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: 'Order Refund Request successfully!',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// accept the refund ---- seller
export const orderRefundSuccess = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler('Order not found with this id', 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Order Refund successful!',
      });

      if (req.body.status === 'Refund Success') {
        order.cart.forEach(async (o: any) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id: string, qty: number) {
        const product = await Product.findById(id);
        if (product) {
          product.stock += qty;
          product.sold_out -= qty;
          await product.save({ validateBeforeSave: false });
        }
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// all orders --- for admin
export const getAllOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete user --- only for admin
export const deleteOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(
          new ErrorHandler('Order is not available with this id', 404)
        );
      }

      await Order.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: 'Order deleted successfully!',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);