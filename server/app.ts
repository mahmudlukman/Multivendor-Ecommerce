import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error";
import compression from "compression";
import helmet from "helmet";
import limiter from "./utils/rateLimiter";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import shopRouter from "./routes/shop.route";
import productRouter from "./routes/product.route";
import orderRouter from "./routes/order.route";
import eventRouter from "./routes/event.route";
import couponCodeRouter from "./routes/couponCode.route";
import conversationRouter from "./routes/conversation.route";
import withdrawRouter from "./routes/withdraw.route";

export const app = express();
// Load environment variables from .env file
dotenv.config();
// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => Cross Origin Resource Sharing
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  })
);

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

// routes
app.use(
  "/api/v1",
  authRouter,
  userRouter,
  shopRouter,
  productRouter,
  orderRouter,
  eventRouter,
  couponCodeRouter,
  conversationRouter,
  withdrawRouter
);

// testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: "API is working" });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(errorMiddleware);
