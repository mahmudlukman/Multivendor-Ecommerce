import express from 'express';
import { isAuthenticated, isSeller } from '../middleware/auth';
import {
  allUserConversations,
  createConversation,
  allSellerConversations,
  updateLastMessage,
} from '../controllers/conversation';

const conversationRouter = express.Router();

conversationRouter.post('/create-conversation', createConversation);
conversationRouter.get('/seller-conversations/:id', isSeller, allSellerConversations);
conversationRouter.get(
  '/user-conversations/:id',
  isAuthenticated,
  allUserConversations
);
conversationRouter.put('/update-last-message/:id', updateLastMessage);

export default conversationRouter;
