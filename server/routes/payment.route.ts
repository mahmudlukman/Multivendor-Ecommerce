import express from "express";
import {
  getPaymentStatus,
  initializePayment,
  refundPayment,
  verifyPayment,
} from "../controllers/payment";
import { isAuthenticated } from "../middleware/auth";

const paymentRouter = express.Router();

paymentRouter.post("/initialize-payment", isAuthenticated, initializePayment);
paymentRouter.get("/verify-payment", verifyPayment);
paymentRouter.get("/payment-status/:orderId", isAuthenticated, getPaymentStatus);
paymentRouter.post("/refund-payment", isAuthenticated, refundPayment);

export default paymentRouter;
