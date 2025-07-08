import { NextFunction, Response, Request } from "express";
import axios from "axios";
import config from "../config";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import Order from "../models/Order";
import User from "../models/User";
import { v4 as uuidv4 } from "uuid";

const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(config.FLW_PUBLIC_KEY, config.FLW_SECRET_KEY);

interface InitiatePaymentParams {
  orderId: string;
  amount: number;
  redirect_url: string;
}

interface PaymentVerificationParams {
  status: string;
  tx_ref: string;
  transaction_id: string;
}

// INITIALIZE PAYMENT
export const initializePayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, amount, redirect_url } =
        req.body as InitiatePaymentParams;
      const userId = req.user?._id;

      // Validate required fields
      if (!orderId || !amount || !redirect_url) {
        return next(
          new ErrorHandler(
            "Missing required fields: orderId, amount, redirect_url",
            400
          )
        );
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const tx_ref = `ORDER_${uuidv4()}`;

      // Get product names from cart for customization
      const productNames = order.cart.map((item: any) => item.name).join(", ");

      const paymentData = {
        tx_ref,
        amount: amount,
        currency: "NGN",
        redirect_url,
        customer: {
          email: user.email,
          name: user.name,
          user_id: userId,
        },
        customizations: {
          title: `Purchase - ${productNames.substring(0, 50)}${
            productNames.length > 50 ? "..." : ""
          }`,
          description: `Purchase for Order #${orderId}`,
        },
        meta: {
          orderId,
          userId,
          originalAmount: amount,
        },
        payment_options: "card,banktransfer,ussd",
      };

      const response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${config.FLW_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.status === "success") {
        // Update existing order with payment details
        await Order.findByIdAndUpdate(orderId, {
          paymentId: tx_ref,
          status: "pending_payment",
          "paymentInfo.type": "flutterwave",
        });

        res.status(200).json({
          success: true,
          paymentUrl: response.data.data.link,
          orderId: orderId,
          tx_ref,
        });
      } else {
        return next(new ErrorHandler("Payment initialization failed", 400));
      }
    } catch (error: any) {
      console.error(
        "Payment initialization error:",
        error.response?.data || error.message
      );
      return next(
        new ErrorHandler(error.message || "Payment initialization failed", 500)
      );
    }
  }
);

// VERIFY PAYMENT
export const verifyPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, tx_ref, transaction_id } =
        req.query as unknown as PaymentVerificationParams;

      if (!status || !tx_ref || !transaction_id) {
        return next(new ErrorHandler("Missing required query parameters", 400));
      }

      if (status === "successful") {
        const response = await flw.Transaction.verify({ id: transaction_id });

        if (
          response.data.status === "successful" &&
          response.data.amount &&
          response.data.currency === "NGN"
        ) {
          const { orderId, userId } = response.data.meta;

          // Update existing order instead of creating new one
          const order = await Order.findOneAndUpdate(
            { paymentId: tx_ref },
            {
              status: "paid",
              "paymentInfo.id": transaction_id,
              "paymentInfo.status": "successful",
              "paymentInfo.type": "flutterwave",
              paidAt: new Date(),
            },
            { new: true }
          );

          if (!order) {
            return next(new ErrorHandler("Order not found", 400));
          }

          return res.status(200).json({
            success: true,
            orderId: order._id,
            order: order,
            message: "Payment verified successfully",
          });
        } else {
          // Payment verification failed - update order status
          await Order.findOneAndUpdate(
            { paymentId: tx_ref },
            {
              status: "payment_failed",
              "paymentInfo.status": "failed",
            }
          );

          return res.status(400).json({
            success: false,
            message: "Payment verification failed",
          });
        }
      } else {
        // Payment status not successful - update order status
        await Order.findOneAndUpdate(
          { paymentId: tx_ref },
          {
            status: "payment_failed",
            "paymentInfo.status": "failed",
          }
        );

        return res.status(400).json({
          success: false,
          message: "Payment was not successful",
        });
      }
    } catch (error: any) {
      console.error(
        "Payment verification error:",
        error.response?.data || error.message
      );
      return next(
        new ErrorHandler(error.message || "Payment verification failed", 500)
      );
    }
  }
);

// WEBHOOK HANDLER (Recommended for production)
// export const handleWebhook = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const signature = req.headers["verif-hash"];

//       if (!signature || signature !== config.FLW_WEBHOOK_HASH) {
//         return res.status(401).json({ message: "Unauthorized webhook" });
//       }

//       const payload = req.body;

//       if (
//         payload.event === "charge.completed" &&
//         payload.data.status === "successful"
//       ) {
//         const tx_ref = payload.data.tx_ref;

//         // Update order status
//         const order = await Order.findOneAndUpdate(
//           { paymentId: tx_ref },
//           {
//             status: "paid",
//             "paymentInfo.id": payload.data.id,
//             "paymentInfo.status": "successful",
//             "paymentInfo.type": "flutterwave",
//             paidAt: new Date(),
//           },
//           { new: true }
//         );

//         if (order) {
//           console.log(`Order ${order._id} payment confirmed via webhook`);
//         }
//       }

//       res.status(200).json({ status: "success" });
//     } catch (error: any) {
//       console.error("Webhook handling error:", error.message);
//       return next(
//         new ErrorHandler(error.message || "Webhook handling failed", 500)
//       );
//     }
//   }
// );

// GET PAYMENT STATUS
export const getPaymentStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      res.status(200).json({
        success: true,
        paymentStatus: order.paymentInfo?.status || "pending",
        orderStatus: order.status,
        paymentId: order.paymentId,
        paidAt: order.paidAt,
      });
    } catch (error: any) {
      console.error("Get payment status error:", error.message);
      return next(
        new ErrorHandler(error.message || "Failed to get payment status", 500)
      );
    }
  }
);

// REFUND PAYMENT (Optional)
export const refundPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, amount } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      if (order.paymentInfo?.status !== "successful") {
        return next(
          new ErrorHandler("Payment not successful, cannot refund", 400)
        );
      }

      const refundData = {
        amount: amount || order.totalPrice,
        currency: "NGN",
        reference: `REFUND_${uuidv4()}`,
        meta: {
          orderId,
          reason: "Customer refund request",
        },
      };

      const response = await axios.post(
        `https://api.flutterwave.com/v3/transactions/${order.paymentInfo.id}/refund`,
        refundData,
        {
          headers: {
            Authorization: `Bearer ${config.FLW_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        // Update order status
        await Order.findByIdAndUpdate(orderId, {
          status: "refunded",
          "paymentInfo.status": "refunded",
        });

        res.status(200).json({
          success: true,
          message: "Refund processed successfully",
          refundData: response.data.data,
        });
      } else {
        return next(new ErrorHandler("Refund processing failed", 400));
      }
    } catch (error: any) {
      console.error("Refund error:", error.response?.data || error.message);
      return next(
        new ErrorHandler(error.message || "Refund processing failed", 500)
      );
    }
  }
);
