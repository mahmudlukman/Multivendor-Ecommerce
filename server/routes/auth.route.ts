import express from 'express';
import {
  activateUser,
  forgotPassword,
  loginUser,
  logoutUser,
  resetPassword,
  createUser,
} from '../controllers/auth';
import { isAuthenticated } from '../middleware/auth';
const authRouter = express.Router();

authRouter.post('/create-user', createUser);
authRouter.post('/activate-user', activateUser);
authRouter.post('/login', loginUser);
authRouter.get('/logout', isAuthenticated, logoutUser);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/', resetPassword);

export default authRouter;
