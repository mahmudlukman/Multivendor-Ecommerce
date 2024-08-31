require("dotenv").config();
import { Response } from "express";
import { IShop } from "../models/Shop";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse environment variables to integrates with fallback values
const sellerTokenExpire = parseInt(
  process.env.JWT_EXPIRES || "300",
  10
);

// options for cookies
 export const sellerTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + sellerTokenExpire * 60 * 60 * 1000),
  maxAge: sellerTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendShopToken = (user: IShop, statusCode: number, res: Response) => {
  const sellerToken = user.getJwtToken();

  // Only set secure to true in production
  if (process.env.NODE_ENV === "production") {
    sellerTokenOptions.secure = true;
  }

  res.cookie("seller_token", sellerToken, sellerTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    sellerToken,
  });
};
