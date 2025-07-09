import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import Withdraw from "../models/Withdraw";
import Shop from "../models/Shop";
import sendMail from "../utils/sendMail";
import mongoose from "mongoose";

// create withdraw request --- only for seller
export const createWithdrawRequest = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount }: { amount: number } = req.body;

      // Validate seller
      if (!req.seller?._id || !req.seller.email || !req.seller.name) {
        return next(new ErrorHandler("Unauthorized: Seller not found", 401));
      }

      // Find shop
      const shop = await Shop.findById(req.seller._id);
      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      // Validate withdraw method
      if (!shop.withdrawMethod) {
        return next(new ErrorHandler("No withdraw method set", 400));
      }

      // Validate amount
      if (amount < 1000) {
        return next(
          new ErrorHandler("Minimum withdrawal amount is ₦1000", 400)
        );
      }
      if (amount > (shop.availableBalance || 0)) {
        return next(new ErrorHandler("Insufficient balance", 400));
      }

      // Create withdraw request
      const withdrawData = {
        seller: {
          _id: req.seller._id,
          name: req.seller.name,
          email: req.seller.email,
        },
        amount,
        status: "Processing",
        createdAt: new Date(),
      };

      const withdraw = await Withdraw.create(withdrawData);

      // Update shop balance and add transaction
      shop.availableBalance = (shop.availableBalance || 0) - amount;
      shop.transactions.push({
        amount: -amount,
        status: "Processing",
        createdAt: new Date(),
      });

      await shop.save();

      // Send email
      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          template: "withdraw-request-mail.ejs",
          data: {
            seller: {
              name: req.seller.name,
              email: req.seller.email,
            },
            amount,
          },
        });
      } catch (error: any) {
        console.error("Email sending failed:", error.message);
        // Optionally, you could undo the withdraw creation if email fails
      }

      res.status(201).json({
        success: true,
        message: `Withdraw request for ₦${amount} created successfully`,
        withdraw,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all withdraws --- admin
export const getAllWithdrawRequest = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update withdraw request ---- admin
export const updateWithdrawRequest = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sellerId, status } = req.body;
      const withdrawId = req.params.id;

      // Validate inputs
      if (!withdrawId) {
        return next(new ErrorHandler("Withdraw request ID is required", 400));
      }
      if (!sellerId) {
        return next(new ErrorHandler("Seller ID is required", 400));
      }
      if (!status || !["Processing", "Succeed"].includes(status)) {
        return next(
          new ErrorHandler(
            "Invalid status. Must be 'Processing' or 'Succeed'",
            400
          )
        );
      }

      // Start a MongoDB transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Find and update withdraw request
        const withdraw = await Withdraw.findByIdAndUpdate(
          withdrawId,
          {
            status,
            updatedAt: Date.now(),
          },
          { new: true, session }
        );

        if (!withdraw) {
          await session.abortTransaction();
          session.endSession();
          return next(new ErrorHandler("Withdraw request not found", 404));
        }

        // Verify sellerId matches withdraw.seller._id
        if (withdraw.seller._id !== sellerId) {
          await session.abortTransaction();
          session.endSession();
          return next(
            new ErrorHandler("Seller ID does not match withdraw request", 400)
          );
        }

        // Find seller
        const seller = await Shop.findById(sellerId).session(session);
        if (!seller) {
          await session.abortTransaction();
          session.endSession();
          return next(new ErrorHandler("Seller not found", 404));
        }

        // Add transaction to seller's transactions if status is "Succeed"
        if (status === "Succeed") {
          const transaction = {
            _id: withdraw._id,
            amount: withdraw.amount,
            status: "succeed",
            createdAt: withdraw.createdAt,
            updatedAt: withdraw.updatedAt || new Date(),
          };

          seller.transactions.push(transaction);
          await seller.save({ session });
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        // Send email only if status is "Succeed"
        if (status === "Succeed") {
          try {
            await sendMail({
              email: seller.email,
              subject: "Payment Confirmation",
              template: "withdraw-request-update-mail.ejs",
              data: {
                seller: {
                  name: seller.name,
                  email: seller.email,
                },
                amount: withdraw.amount,
              },
            });
          } catch (emailError: any) {
            console.error("Email sending failed:", emailError.message);
            // Note: Not rolling back since transaction is committed
          }
        }

        res.status(200).json({
          success: true,
          message: `Withdraw request for ₦${withdraw.amount} updated to ${status}`,
          withdraw,
        });
      } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// export const updateWithdrawRequest = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { sellerId } = req.body;

//       const withdraw = await Withdraw.findByIdAndUpdate(
//         req.params.id,
//         {
//           status: "succeed",
//           updatedAt: Date.now(),
//         },
//         { new: true }
//       );

//       const seller = await Shop.findById(sellerId);

//       const transaction = {
//         _id: withdraw?._id,
//         amount: withdraw?.amount ?? 0,
//         status: withdraw?.status ?? "processing",
//         createdAt: withdraw?.createdAt ?? new Date(),
//         updatedAt: withdraw?.updatedAt ?? new Date(),
//       };

//       if (!seller) {
//         return next(new ErrorHandler("Seller not found.", 404));
//       }

//       seller.transactions = [...seller.transactions, transaction];

//       await seller.save();

//       try {
//         await sendMail({
//           email: seller.email,
//           subject: 'Payment confirmation',
//           template: 'withdraw-request-update-mail.ejs',
//           data: {
//             name: seller.name,
//             amount: withdraw?.amount,
//           },
//         });
//         res.status(201).json({
//           success: true,
//           message: `An email has been sent to: ${req.seller?.email} to confirm request!`,
//         });

//       } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//       }
//       res.status(201).json({
//         success: true,
//         withdraw,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );
