import { Request, Response, NextFunction } from 'express';
import Message, { IMessage } from '../models/Message';
import ErrorHandler from '../utils/errorHandler';
import { catchAsyncError } from '../middleware/catchAsyncErrors';
import cloudinary from 'cloudinary';


export const createNewMessage = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messageData: IMessage = req.body;

      if (req.body.images) {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
          folder: 'messages',
        });
        messageData.images = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const message = new Message({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all messages with conversation id
export const getAllMessages = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.id,
      });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);