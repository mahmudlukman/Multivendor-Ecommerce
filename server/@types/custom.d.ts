import { Request } from 'express';
import { IUser } from '../models/User';
import { IShop } from '../models/Shop';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
      seller?: IShop | null;
    }
  }
}
