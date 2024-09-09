import { NextFunction, Request, Response } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncErrors';
import Shop, { IShop } from '../models/Shop';
import ErrorHandler from '../utils/errorHandler';
import cloudinary from 'cloudinary';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../utils/sendMail';
import { sendShopToken } from '../utils/shopToken';

// register user
interface ICreateShop {
  name: string;
  email: string;
  password: string;
  phoneNumber?: number;
  address?: string;
  zipCode?: string;
}

export const createShop = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, address, phoneNumber, zipCode } = req.body;

      const isEmailExist = await Shop.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler('Email already exist', 400));
      }

      const shop: ICreateShop = {
        name,
        email,
        password,
        phoneNumber,
        address,
        zipCode,
      };
      const activationToken = createActivationToken(shop);

      const activationUrl = `http://localhost:3000/new-verification?token=${activationToken}`;

      const data = { shop: { name: shop.name }, activationUrl };
      const html = await ejs.renderFile(
        path.join(__dirname, '../mails/shop-activation-mail.ejs'),
        data
      );

      try {
        await sendMail({
          email: shop.email,
          subject: 'Activate your account',
          template: 'activation-mail.ejs',
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${shop.email} to activate your account!`,
          activationToken: activationToken,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Function to create an activation token
export const createActivationToken = (shop: any): string => {
  const token = jwt.sign({ shop }, process.env.ACTIVATION_SECRET as Secret, {
    expiresIn: '5m',
  });
  return token;
};

// activate user
interface IActivationRequest {
  activation_token: string;
}

export const activateShop = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token } = req.body as IActivationRequest;

      const newShop = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { shop: IShop };

      if (!newShop) {
        return next(new ErrorHandler('Invalid token', 400));
      }
      const { name, email, password, address, phoneNumber, zipCode } =
        newShop.shop;

      let shop = await Shop.findOne({ email });

      if (shop) {
        return next(new ErrorHandler('User already exist', 400));
      }

      shop = await Shop.create({
        name,
        email,
        password,
        phoneNumber,
        address,
        zipCode,
      });
      res.status(201).json({
        success: true,
        message: 'Email verified & Shop created successfully',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginShop = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
      }
      const shop = await Shop.findOne({ email }).select('+password');

      if (!shop) {
        return next(new ErrorHandler('Invalid credentials', 400));
      }

      const isPasswordMatch = await shop.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid credentials', 400));
      }
      sendShopToken(shop, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const logoutShop = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie('seller_token', '', { maxAge: 1 });
      res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// forgot password
export const forgotPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) {
        return next(new ErrorHandler('Please provide a valid email!', 400));
      }

      const emailLowerCase = email.toLowerCase();
      const shop = await Shop.findOne({ email: emailLowerCase });
      if (!shop) {
        return next(new ErrorHandler('Shop not found, invalid request!', 400));
      }

      const resetToken = createActivationToken(shop);

      const resetUrl = `http://localhost:3000/new-password?token=${resetToken}&id=${shop._id}`;

      const data = { shop: { name: shop.name }, resetUrl };
      const html = await ejs.renderFile(
        path.join(__dirname, '../mails/forgot-password-mail.ejs'),
        data
      );

      try {
        await sendMail({
          email: shop.email,
          subject: 'Reset your password',
          template: 'forgot-password-mail.ejs',
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${shop.email} to reset your password!`,
          resetToken: resetToken,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IResetPassword {
  newPassword: string;
}

// reset password
export const resetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword } = req.body as IResetPassword;
      const { id } = req.params;

      if (!id) {
        return next(new ErrorHandler('No user ID provided!', 400));
      }

      const shop = await Shop.findById(id).select('+password');

      if (!shop) {
        return next(new ErrorHandler('user not found!', 400));
      }

      const isSamePassword = await shop.comparePassword(newPassword);
      if (isSamePassword)
        return next(
          new ErrorHandler(
            'New password must be different from the previous one!',
            400
          )
        );

      if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
        return next(
          new ErrorHandler(
            'Password must be between at least 6 characters!',
            400
          )
        );
      }

      shop.password = newPassword.trim();
      await shop.save();

      res.status(201).json({
        success: true,
        message: `Password Reset Successfully', 'Now you can login with new password!`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user info
export const getShopInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shop = await Shop.findById(req.seller?._id);
      if (!shop) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user info
interface IUpdateShopInfo {
  email?: string;
  phoneNumber?: number;
  name?: string;
  address?: string;
  zipCode?: number;
}

export const updateShopInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, phoneNumber, name, address, zipCode } =
        req.body as IUpdateShopInfo;

      const shop = await Shop.findById(req.seller?._id);

      if (email && shop) {
        const isEmailExist = await Shop.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler('Email already exist', 400));
        }
        shop.email = email;
      }

      if (name && shop) {
        shop.name = name;
      }

      if (phoneNumber && shop) {
        shop.phoneNumber = phoneNumber;
      }

      if (address && shop) {
        shop.address = address;
      }

      if (zipCode && shop) {
        shop.zipCode = zipCode;
      }

      await shop?.save();

      res.status(201).json({ success: true, shop });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IUpdateShopPassword {
  oldPassword?: string;
  newPassword?: string;
}
export const updateShopPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdateShopPassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler('Please enter old and new password', 400));
      }

      const shop = await Shop.findById(req.seller?._id).select('+password');

      if (shop?.password === undefined) {
        return next(new ErrorHandler('Invalid shop', 400));
      }

      const isSamePassword = await shop.comparePassword(newPassword);
      if (isSamePassword)
        return next(
          new ErrorHandler(
            'New password must be different from the previous one!',
            400
          )
        );

      if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
        return next(
          new ErrorHandler(
            'Password must be between at least 6 characters!',
            400
          )
        );
      }

      shop.password = newPassword.trim();

      await shop.save();

      res.status(201).json({
        success: true,
        message: `Password Updated Successfully'!`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user avatar
interface IUpdateShopAvatar {
  avatar: string;
}
export const updateShopAvatar = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateShopAvatar;

      const shop = await Shop.findById(req.seller?._id);

      if (avatar && shop) {
        if (shop?.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(shop?.avatar?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
          });
          shop.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
          });
          shop.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await shop?.save();

      res.status(200).json({ success: true, shop });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// find user information by Id
export const getShopById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users --- only for admin
export const getAllShops = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shops = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        shops,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// export const getAllShops = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {

//       let shops;

//       if (req.user?.role === 'admin') {
//         // Admins can see all shops
//         shops = await Shop.find().sort({ createdAt: -1 });
//       } else if (req.user?.role === 'seller') {
//         // Sellers can only see their own shop
//         shops = await Shop.find({ _id: req.seller?._id });
//       } else {
//         return next(
//           new ErrorHandler('You are not allowed to access this resource', 403)
//         );
//       }

//       res.status(200).json({
//         success: true,
//         shops,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// Delete user --- only for admin
export const deleteShop = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        return next(
          new ErrorHandler('User is not available with this id', 404)
        );
      }

      const imageId = shop.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: 'Shop deleted successfully!',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update seller withdraw methods --- sellers
export const updateWithdrawMethod = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { withdrawMethod } = req.body;

      const shop = await Shop.findByIdAndUpdate(
        req.seller?._id,
        { withdrawMethod },
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete seller withdraw methods --- only seller
export const deleteWithdrawMethod = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shop = await Shop.findById(req.seller?._id);

      if (!shop) {
        return next(new ErrorHandler('Shop not found with this id', 400));
      }

      shop.withdrawMethod = null;

      await shop.save();

      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
