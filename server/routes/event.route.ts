import express from "express";
import {
  createEvent,
  deleteShopEvent,
  getAllEvents,
  getEvents,
  getShopEvents,
} from "../controllers/event";
import { authorizeRoles, isAuthenticated, isSeller } from "../middleware/auth";

const eventRouter = express.Router();

eventRouter.post("/create-event", isSeller, createEvent);
eventRouter.get("/events", getEvents);
eventRouter.get("/shop-events/:shopId", getShopEvents);
eventRouter.delete("/delete-shop-event/:id", isSeller, deleteShopEvent);
eventRouter.get(
  "/all-events",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllEvents
);

export default eventRouter;
