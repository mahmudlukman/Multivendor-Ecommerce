import { Request, Response, NextFunction } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncErrors';
import Shop from '../models/Shop';
import Event from '../models/Event';
import ErrorHandler from '../utils/errorHandler';
import cloudinary from 'cloudinary';

// Create event
export const createEvent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shopId, images: reqImages } = req.body;
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler('Shop Id is invalid!', 400));
      } else {
        let images: string[] = [];
        if (typeof reqImages === 'string') {
          images.push(reqImages);
        } else {
          images = reqImages;
        }

        const imagesLinks: { public_id: string; url: string }[] = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products',
          });
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const productData = {
          ...req.body,
          images: imagesLinks,
          shop,
        };

        const event = await Event.create(productData);

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all events
export const getEvents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await Event.find();
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all events of a shop
export const getShopEvents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await Event.find({ shopId: req.params.id });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete event of a shop
export const deleteShopEvent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return next(new ErrorHandler('Event is not found with this id', 404));
      }

      // Delete images from Cloudinary
      for (let i = 0; i < event.images.length; i++) {
        await cloudinary.v2.uploader.destroy(event.images[i].public_id);
      }

      await Event.findByIdAndDelete(req.params.id);;

      res.status(201).json({
        success: true,
        message: 'Event Deleted successfully!',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// All events --- for admin
export const getAllEvents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
