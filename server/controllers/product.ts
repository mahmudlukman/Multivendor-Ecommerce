import { Request, Response, NextFunction } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';
import Shop from '../models/Shop';
import cloudinary from 'cloudinary';
import Product, { IProduct } from '../models/Product';
import Order from '../models/Order';
import { Types } from 'mongoose';

// Create product
interface ICreateProduct {
  shopId: string;
  images: string | string[];
}

export const createProduct = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shopId, images, ...productData } = req.body as ICreateProduct;

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler('Shop ID is invalid', 400));
      }

      const imagesLinks = await Promise.all(
        (Array.isArray(images) ? images : [images]).map(async (image) => {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: 'products',
          });
          return {
            public_id: result.public_id,
            url: result.secure_url,
          };
        })
      );

      const product = await Product.create({
        ...productData,
        images: imagesLinks,
        shop,
        shopId,
      });

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all products of a shop
export const getAllProductsInShop = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      res.status(200).json({ success: true, products });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete product of a shop
export const deleteProductInShop = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorHandler('Product not found with this id', 404));
      }

      await Promise.all(
        product.images.map((image) =>
          cloudinary.v2.uploader.destroy(image.public_id)
        )
      );

      await product.deleteOne();

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully!',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all products -- seller
export const getAllProducts = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, products });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Review product
interface ReviewProductBody {
  user: object;
  rating: number;
  comment: string;
  productId: string;
  orderId: string;
}

export const reviewProduct = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, rating, comment, productId, orderId } =
        req.body as ReviewProductBody;

      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler('Product not found', 404));
      }

      const review: any = {
        user: user,
        rating,
        comment,
        productId,
        createdAt: new Date(),
      };

      const existingReviewIndex = product.reviews.findIndex(
        (rev) => rev.user._id.toString() === (req.user as any)?._id.toString()
      );

      if (existingReviewIndex > -1) {
        product.reviews[existingReviewIndex] = review;
      } else {
        product.reviews.push(review);
      }

      product.ratings =
        product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
        product.reviews.length;

      await product.save();

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { 'cart.$[elem].isReviewed': true } },
        { arrayFilters: [{ 'elem._id': productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Reviewed successfully!',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
