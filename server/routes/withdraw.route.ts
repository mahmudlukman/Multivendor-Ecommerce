import express from "express";
import { authorizeRoles, isAuthenticated, isSeller } from "../middleware/auth";
import {
  createWithdrawRequest,
  getAllWithdrawRequest,
  updateWithdrawRequest,
} from "../controllers/withdraw";

const withdrawRouter = express.Router();

withdrawRouter.post(
  "/create-withdraw-request",
  isAuthenticated,
  isSeller,
  createWithdrawRequest
);
withdrawRouter.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllWithdrawRequest
);
withdrawRouter.put(
  "/update-withdraw-request/:sellerId",
  isAuthenticated,
  authorizeRoles("admin"),
  updateWithdrawRequest
);
withdrawRouter.delete(
  "/delete-withdraw-request/:id",
  isAuthenticated,
  isSeller,
  updateWithdrawRequest
);

export default withdrawRouter;
