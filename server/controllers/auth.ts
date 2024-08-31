require('dotenv').config();
import User, { IUser } from '../models/User';
import ErrorHandler from '../utils/errorHandler';
import { catchAsyncError } from '../middleware/catchAsyncErrors';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../utils/sendMail';
import { sendToken } from '../utils/jwtToken';

// register user
interface ICreateUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const createUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler('Email already exist', 400));
      }

      const user: ICreateUser = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);

      const activationUrl = `http://localhost:3000/new-verification?token=${activationToken}`;

      const data = { user: { name: user.name }, activationUrl };
      const html = await ejs.renderFile(
        path.join(__dirname, '../mails/activation-mail.ejs'),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: 'Activate your account',
          template: 'activation-mail.ejs',
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
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
export const createActivationToken = (user: any): string => {
  const token = jwt.sign({ user }, process.env.ACTIVATION_SECRET as Secret, {
    expiresIn: '5m',
  });
  return token;
};

// activate user
interface IActivationRequest {
  activation_token: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token } = req.body as IActivationRequest;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser };

      if (!newUser) {
        return next(new ErrorHandler('Invalid token', 400));
      }
      const { name, email, password } = newUser.user;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler('User already exist', 400));
      }

      user = await User.create({
        name,
        email,
        password,
      });
      res
        .status(201)
        .json({
          success: true,
          message: 'Email verified & user created successfully',
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

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
      }
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return next(new ErrorHandler('Invalid credentials', 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid credentials', 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie('access_token', '', { maxAge: 1 });
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
      const user = await User.findOne({ email: emailLowerCase });
      if (!user) {
        return next(new ErrorHandler('User not found, invalid request!', 400));
      }

      const resetToken = createActivationToken(user);

      const resetUrl = `http://localhost:3000/new-password?token=${resetToken}&id=${user._id}`;

      const data = { user: { name: user.name }, resetUrl };
      const html = await ejs.renderFile(
        path.join(__dirname, '../mails/forgot-password-mail.ejs'),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: 'Reset your password',
          template: 'forgot-password-mail.ejs',
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to reset your password!`,
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

      const user = await User.findById(id).select('+password');

      if (!user) {
        return next(new ErrorHandler('user not found!', 400));
      }

      const isSamePassword = await user.comparePassword(newPassword);
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

      user.password = newPassword.trim();
      await user.save();

      res.status(201).json({
        success: true,
        message: `Password Reset Successfully', 'Now you can login with new password!`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
