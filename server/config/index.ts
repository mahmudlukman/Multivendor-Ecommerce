import dotenv from 'dotenv';
import type ms from 'ms';
dotenv.config();

const config = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: ['http://localhost:5173'],
  DB_URL: process.env.DB_URL!,
  ACTIVATION_SECRET: process.env.ACTIVATION_SECRET!,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
  JWT_EXPIRES: process.env.JWT_EXPIRES as ms.StringValue,
  defaultResLimit: 20,
  defaultResOffset: 0,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  SMTP_PORT: process.env.SMTP_PORT!,
  SMTP_SERVICE: process.env.SMTP_SERVICE!,
  SMTP_MAIL: process.env.SMTP_MAIL!,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
};

export default config;