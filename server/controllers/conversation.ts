import { Request, Response, NextFunction } from 'express';
import Conversation, { IConversation } from '../models/Converstion';
import ErrorHandler from '../utils/errorHandler';
import { catchAsyncError } from '../middleware/catchAsyncErrors';

// Create a new conversation
export const createConversation = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;

      const isConversationExist = await Conversation.findOne({ groupTitle });

      if (isConversationExist) {
        const conversation = isConversationExist;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        const conversation: IConversation = await Conversation.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });

        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  }
);

// Get seller conversations
export const getAllConversations = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(200).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  }
);

// Get user conversations
export const allUserConversations = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(200).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  }
);

// Update the last message
export const updateLastMessage = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        lastMessage,
        lastMessageId,
      }, { new: true }); // Return the updated document

      if (!conversation) {
        return next(new ErrorHandler('Conversation not found', 404));
      }

      res.status(200).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  }
);
