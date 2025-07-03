import { Response } from "express";
import { IUser } from "../models/User";
import config from "../config";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse environment variables to integrates with fallback values
const accessTokenExpire = parseInt(
  config.JWT_EXPIRES || "300",
  10
);

// options for cookies
 export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.getJwtToken();

  // Only set secure to true in production
  if (config.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
