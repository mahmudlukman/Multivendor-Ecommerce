import express from 'express';
import {
  createEvent,
  deleteShopEvent,
  getAllEvents,
  getEvents,
  getShopEvents,
} from '../controllers/event';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const eventRouter = express.Router();

eventRouter.post('/create-event', createEvent);
eventRouter.get('/events', getEvents);
eventRouter.get('/shop-events/:id', getShopEvents);
eventRouter.delete('/delete-shop-event/:id', deleteShopEvent);
eventRouter.get(
  '/all-events',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllEvents
);

export default eventRouter;
