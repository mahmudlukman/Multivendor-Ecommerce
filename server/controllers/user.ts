import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import User from "../models/User";
import ErrorHandler from "../utils/errorHandler";
import cloudinary from "cloudinary";

// get user info
export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user?._id);
      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user info
interface IUpdateUserInfo {
  phoneNumber?: number;
  name?: string;
  avatar?: string;
}

export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, name, avatar } = req.body as IUpdateUserInfo;

      const user = await User.findById(req.user?._id);

      if (name && user) {
        user.name = name;
      }

      if (phoneNumber && user) {
        user.phoneNumber = phoneNumber;
      }

      if (avatar && user) {
        if (user.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatar",
          width: 150,
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (user) {
        await user.save();
      }

      res.status(201).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IUpdatePassword {
  oldPassword?: string;
  newPassword?: string;
}

export const updatePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      const user = await User.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      // Verify the old password is correct
      const isOldPasswordValid = await user.comparePassword(oldPassword);
      if (!isOldPasswordValid) {
        return next(new ErrorHandler("Old password is incorrect", 400));
      }

      // Check if new password is different from current password
      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        return next(
          new ErrorHandler(
            "New password must be different from the previous one!",
            400
          )
        );
      }

      if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
        return next(
          new ErrorHandler(
            "Password must be at least 6 characters and no more than 20 characters!",
            400
          )
        );
      }

      user.password = newPassword.trim();
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user address
export const updateUserAddress = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user?._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const { country, city, address1, address2, zipCode, addressType, _id } =
        req.body;

      // Validate required fields
      if (!country || !city || !address1 || !addressType) {
        return next(
          new ErrorHandler("Please provide all required address fields", 400)
        );
      }

      // Check for duplicate addressType (excluding the address being updated)
      const sameTypeAddress = user.addresses.find(
        (address) =>
          address.addressType === addressType &&
          address._id &&
          address._id.toString() !== _id
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(
            `${req.body.addressType} address already exists`,
            400
          )
        );
      }

      const newAddress = {
        country,
        city,
        address1,
        address2: address2 || "",
        zipCode: zipCode || "",
        addressType: addressType,
      };

      if (_id) {
        // Update existing address
        const existsAddress = user.addresses.find(
          (address) => address._id && address._id.toString() === _id
        );
        if (!existsAddress) {
          return next(new ErrorHandler("Address not found", 404));
        }
        Object.assign(existsAddress, newAddress);
      } else {
        // Add new address
        user.addresses.push(newAddress);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user address
export const deleteUserAddress = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// find user information by Id
export const getUserById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// get all users --- only for admin
export const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user role --- only for admin
export const updateUserRole = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      const user = await User.findByIdAndUpdate(id, { role }, { new: true });

      res.status(201).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete user --- only for admin
export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 404)
        );
      }

      // Only delete avatar from cloudinary if it exists
      if (user.avatar && user.avatar.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        } catch (cloudinaryError) {
          console.log(
            "Failed to delete avatar from cloudinary:",
            cloudinaryError
          );
          // Continue with shop deletion even if avatar deletion fails
        }
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
