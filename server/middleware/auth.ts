import { NextFunction, Request, Response } from 'express';
import { catchAsyncError } from './catchAsyncErrors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ErrorHandler from '../utils/errorHandler';
import User from '../models/User';
import Shop from '../models/Shop';

// authenticated user
export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(
        new ErrorHandler('Please login to access this resources', 400)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler('Access token is not valid', 400));
    }

    req.user = await User.findById(decoded.id);

    next();
  }
);

export const isSeller = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const seller_token = req.cookies.seller_token as string;

    if (!seller_token) {
      return next(new ErrorHandler('Please login to continue', 401));
    }

    const decoded = jwt.verify(
      seller_token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    req.seller = await Shop.findById(decoded.id);

    next();
  }
);

// validate user role
export const isAdmin = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resources`,
          403
        )
      );
    }
    next();
  };
};
