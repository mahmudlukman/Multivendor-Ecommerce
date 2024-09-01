import { Request, Response, NextFunction } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';
import CouponCode from '../models/CouponCode';

// create coupon code
export const createCouponCode = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCouponCodeExists = await CouponCode.find({ name: req.body.name });

      if (isCouponCodeExists.length !== 0) {
        return next(new ErrorHandler('Coupon code already exists!', 400));
      }

      const couponCode = await CouponCode.create(req.body);

      res.status(201).json({
        success: true,
        couponCode,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all coupons of a shop
export const getCoupon = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const couponCodes = await CouponCode.find({ shopId: req.seller?.id });

      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete coupon code of a shop
export const deleteCoupon = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const couponCode = await CouponCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code doesn't exist!", 400));
      }

      res.status(200).json({
        success: true,
        message: 'Coupon code deleted successfully!',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get coupon code value by its name
export const getCouponValue = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const couponCode = await CouponCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
