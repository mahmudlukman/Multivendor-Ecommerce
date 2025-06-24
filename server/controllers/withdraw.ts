import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import Withdraw from "../models/Withdraw";
import Shop from "../models/Shop";
import sendMail from "../utils/sendMail";

// create withdraw request --- only for seller
export const createWithdrawRequest = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      const data = {
        seller: req.seller,
        amount,
      };

      try {
        if (!req.seller?.email) {
          return next(new ErrorHandler("Seller email is required for withdraw request.", 400));
        }
        await sendMail({
          email: req.seller.email,
          subject: 'Withdraw Request',
          template: 'withdraw-request-mail.ejs',
          data,
        });
        res.status(201).json({
          success: true,
          message: `An email has been sent to: ${req.seller?.email} to confirm request!`,
        });

      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      const withdraw = await Withdraw.create(data);

      const shop = await Shop.findById(req.seller?._id);

      if (shop) {
        shop.availableBalance = (shop.availableBalance || 0) - amount;
      }

      if (shop) {
        await shop.save();
      }

      res.status(201).json({
        success: true,
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
      const { sellerId } = req.body;

      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      const seller = await Shop.findById(sellerId);

      const transaction = {
        _id: withdraw?._id,
        amount: withdraw?.amount ?? 0,
        status: withdraw?.status ?? "processing",
        createdAt: withdraw?.createdAt ?? new Date(),
        updatedAt: withdraw?.updatedAt ?? new Date(),
      };

      if (!seller) {
        return next(new ErrorHandler("Seller not found.", 404));
      }

      seller.transactions = [...seller.transactions, transaction];

      await seller.save();

      try {
        await sendMail({
          email: seller.email,
          subject: 'Payment confirmation',
          template: 'withdraw-request-update-mail.ejs',
          data: {
            name: seller.name,
            amount: withdraw?.amount,
          },
        });
        res.status(201).json({
          success: true,
          message: `An email has been sent to: ${req.seller?.email} to confirm request!`,
        });

      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
