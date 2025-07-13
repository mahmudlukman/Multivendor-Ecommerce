import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import { ORDER_STATUSES, OrderStatus } from "../utils/order";
import Order, { IOrder } from "../models/Order";
import Product from "../models/Product";
import Shop from "../models/Shop";
import User from "../models/User";

interface ICreateOrder {
  cart: IOrder["cart"];
  shippingAddress: IOrder["shippingAddress"];
  user: string;
  totalPrice: number;
  paymentInfo: IOrder["paymentInfo"];
}

export const createOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        cart,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      }: ICreateOrder = req.body;

      if (!cart || !shippingAddress || !user || !totalPrice) {
        return next(new ErrorHandler("Missing required fields", 400));
      }

      // Group cart items by shopId
      const shopItemsMap = new Map<string, IOrder["cart"]>();

      for (const item of cart) {
        const shopId = (item as any).shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId)!.push(item);
      }

      // Create an order for each shop
      const orders: IOrder[] = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
          status: ORDER_STATUSES.PROCESSING,
          paidAt: new Date(),
        });
        // Add order to user's orders array
        await User.findByIdAndUpdate(
          user,
          { $push: { orders: order._id } },
          { new: true }
        );

        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders, // Ensure response has success and orders
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
      const userId = req.user?._id;

      if (!userId) {
        return next(new ErrorHandler("User ID is required", 400));
      }

      // Get user with populated orders
      const user = await User.findById(userId).populate({
        path: "orders",
        options: { sort: { createdAt: -1 } },
      });

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        success: true,
        orders: user.orders,
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
        "cart.shopId": req.params.shopId,
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


export const updateOrderStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, status } = req.body;

      if (!id || !status) {
        return next(new ErrorHandler("Missing order ID or status", 400));
      }

      if (!Object.values(ORDER_STATUSES).includes(status)) {
        return next(new ErrorHandler(`Invalid status: ${status}`, 400));
      }

      const order = await Order.findById(id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
      }

      const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        [ORDER_STATUSES.PROCESSING]: [
          ORDER_STATUSES.PENDING_PAYMENT,
          ORDER_STATUSES.TRANSFERRED_TO_DELIVERY_PARTNER,
          ORDER_STATUSES.SHIPPING,
          ORDER_STATUSES.RECEIVED,
          ORDER_STATUSES.ON_THE_WAY,
          ORDER_STATUSES.DELIVERED,
          ORDER_STATUSES.PROCESSING_REFUND,
        ],
        [ORDER_STATUSES.PENDING_PAYMENT]: [
          ORDER_STATUSES.PAID,
          ORDER_STATUSES.PAYMENT_FAILED,
        ],
        [ORDER_STATUSES.PAID]: [
          ORDER_STATUSES.TRANSFERRED_TO_DELIVERY_PARTNER,
          ORDER_STATUSES.SHIPPING,
          ORDER_STATUSES.RECEIVED,
          ORDER_STATUSES.ON_THE_WAY,
          ORDER_STATUSES.DELIVERED,
        ],
        [ORDER_STATUSES.PAYMENT_FAILED]: [ORDER_STATUSES.PROCESSING],
        [ORDER_STATUSES.TRANSFERRED_TO_DELIVERY_PARTNER]: [
          ORDER_STATUSES.PROCESSING,
          ORDER_STATUSES.SHIPPING,
          ORDER_STATUSES.RECEIVED,
          ORDER_STATUSES.ON_THE_WAY,
          ORDER_STATUSES.DELIVERED,
          ORDER_STATUSES.PROCESSING_REFUND,
        ],
        [ORDER_STATUSES.SHIPPING]: [
          ORDER_STATUSES.PROCESSING,
          ORDER_STATUSES.TRANSFERRED_TO_DELIVERY_PARTNER,
          ORDER_STATUSES.RECEIVED,
          ORDER_STATUSES.ON_THE_WAY,
          ORDER_STATUSES.DELIVERED,
          ORDER_STATUSES.PROCESSING_REFUND,
        ],
        [ORDER_STATUSES.RECEIVED]: [
          ORDER_STATUSES.PROCESSING,
          ORDER_STATUSES.TRANSFERRED_TO_DELIVERY_PARTNER,
          ORDER_STATUSES.SHIPPING,
          ORDER_STATUSES.ON_THE_WAY,
          ORDER_STATUSES.DELIVERED,
          ORDER_STATUSES.PROCESSING_REFUND,
        ],
        [ORDER_STATUSES.ON_THE_WAY]: [
          ORDER_STATUSES.PROCESSING,
          ORDER_STATUSES.TRANSFERRED_TO_DELIVERY_PARTNER,
          ORDER_STATUSES.SHIPPING,
          ORDER_STATUSES.RECEIVED,
          ORDER_STATUSES.DELIVERED,
          ORDER_STATUSES.PROCESSING_REFUND,
        ],
        [ORDER_STATUSES.DELIVERED]: [ORDER_STATUSES.PROCESSING_REFUND],
        [ORDER_STATUSES.PROCESSING_REFUND]: [
          ORDER_STATUSES.REFUND_SUCCESS,
          ORDER_STATUSES.REFUND_REJECTED,
        ],
        [ORDER_STATUSES.REFUND_SUCCESS]: [],
        [ORDER_STATUSES.REFUND_REJECTED]: [],
      };

      if (
        validTransitions[order.status] &&
        !validTransitions[order.status].includes(status)
      ) {
        return next(
          new ErrorHandler(
            `Cannot transition from ${order.status} to ${status}`,
            400
          )
        );
      }

      // Handle stock updates for delivery partner transfer
      if (status === ORDER_STATUSES.TRANSFERRED_TO_DELIVERY_PARTNER) {
        for (const item of order.cart) {
          await updateOrder((item as any)._id, (item as any).qty);
        }
      }

      // Handle stock restoration for refund success
      if (status === ORDER_STATUSES.REFUND_SUCCESS) {
        for (const item of order.cart) {
          await restoreProductStock((item as any)._id, (item as any).qty);
        }
      }

      order.status = status;

      // Handle delivered order completion
      if (status === ORDER_STATUSES.DELIVERED) {
        order.deliveredAt = new Date();
        if (order.paymentInfo) {
          order.paymentInfo.status = "Succeeded";
        }
        const serviceCharge = order.totalPrice * 0.1;
        await updateSellerInfo(
          order.cart[0]?.shopId,
          order.totalPrice - serviceCharge
        );
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: `Order status updated to ${status}`,
      });

      // Helper function to reduce stock when transferring to delivery partner
      async function updateOrder(id: string, qty: number) {
        const product = await Product.findById(id);
        if (product) {
          product.stock -= qty;
          product.sold_out += qty;
          await product.save({ validateBeforeSave: false });
        }
      }

      // Helper function to restore stock when refund is successful
      async function restoreProductStock(id: string, qty: number) {
        const product = await Product.findById(id);
        if (product) {
          product.stock += qty;
          product.sold_out = Math.max(0, product.sold_out - qty);
          await product.save({ validateBeforeSave: false });
        }
      }

      // Helper function to update seller balance
      async function updateSellerInfo(shopId: string, amount: number) {
        const seller = await Shop.findById(shopId);
        if (seller) {
          seller.availableBalance += amount;
          await seller.save();
        }
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// give a refund ----- user
// export const orderRefundRequest = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const order = await Order.findById(req.params.id);

//       if (!order) {
//         return next(new ErrorHandler("Order not found with this id", 400));
//       }

//       order.status = req.body.status;

//       await order.save({ validateBeforeSave: false });

//       res.status(200).json({
//         success: true,
//         order,
//         message: "Order Refund Request successfully!",
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

export const orderRefundRequest = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, status }: { id: string; status: OrderStatus } = req.body;

      if (!id || status !== ORDER_STATUSES.PROCESSING_REFUND) {
        return next(
          new ErrorHandler(
            `Invalid or missing parameters. Status must be ${ORDER_STATUSES.PROCESSING_REFUND}`,
            400
          )
        );
      }

      const order = await Order.findById(id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
      }

      const validRefundStatuses: OrderStatus[] = [
        ORDER_STATUSES.PAID,
        ORDER_STATUSES.PROCESSING,
      ];
      if (!validRefundStatuses.includes(order.status)) {
        return next(
          new ErrorHandler(
            `Cannot request refund for order in ${order.status} status`,
            400
          )
        );
      }

      order.status = ORDER_STATUSES.PROCESSING_REFUND;
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// accept the refund ---- seller
// export const orderRefundSuccess = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const order = await Order.findById(req.params.id);

//       if (!order) {
//         return next(new ErrorHandler("Order not found with this id", 400));
//       }

//       order.status = req.body.status;

//       await order.save();

//       res.status(200).json({
//         success: true,
//         message: "Order Refund successful!",
//       });

//       if (req.body.status === "Refund Success") {
//         order.cart.forEach(async (o: any) => {
//           await updateOrder(o._id, o.qty);
//         });
//       }

//       async function updateOrder(id: string, qty: number) {
//         const product = await Product.findById(id);
//         if (product) {
//           product.stock += qty;
//           product.sold_out -= qty;
//           await product.save({ validateBeforeSave: false });
//         }
//       }
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

export const orderRefundSuccess = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get id from route params and status from body
      const { id } = req.params;
      const { status } = req.body;

      // Validate parameters
      if (!id || status !== ORDER_STATUSES.REFUND_SUCCESS) {
        return next(
          new ErrorHandler(
            `Invalid or missing parameters. Status must be ${ORDER_STATUSES.REFUND_SUCCESS}`,
            400
          )
        );
      }

      // Find the order
      const order = await Order.findById(id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
      }

      // Check if order can be transitioned to refund success
      if (order.status !== ORDER_STATUSES.PROCESSING_REFUND) {
        return next(
          new ErrorHandler(
            `Cannot transition to ${ORDER_STATUSES.REFUND_SUCCESS} from ${order.status}`,
            400
          )
        );
      }

      // Update order status
      order.status = ORDER_STATUSES.REFUND_SUCCESS;

      // Restore product stock
      for (const item of order.cart) {
        await updateProductStock((item as any)._id, (item as any).qty);
      }

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order refund processed successfully!",
        order: {
          _id: order._id,
          status: order.status,
          totalPrice: order.totalPrice,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Helper function to update product stock
async function updateProductStock(productId: string, quantity: number) {
  try {
    const product = await Product.findById(productId);
    if (product) {
      product.stock += quantity;
      product.sold_out = Math.max(0, product.sold_out - quantity);
      await product.save({ validateBeforeSave: false });
    }
  } catch (error) {
    console.error(`Error updating product stock for ${productId}:`, error);
  }
}

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
          new ErrorHandler("Order is not available with this id", 404)
        );
      }

      await Order.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Order deleted successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
