import mongoose from "mongoose";
import config from "../config";
// import type { ConnectOptions } from 'mongoose';

// const clientOptions: ConnectOptions = {
//   dbName: 'E_shop',
//   appName: 'E_shop API',
//   serverApi: {
//     version: '1',
//     strict: true,
//     deprecationErrors: true,
//   },
// };

// export const connectDB = async (): Promise<void> => {
//   if (!config.DB_URL) {
//     throw new Error('MongoDB URI is not defined in the configuration.');
//   }
//   try {
//     await mongoose.connect(config.DB_URL, clientOptions);
//     console.log(`Database connected successfully at ${config.DB_URL}`);
//   } catch (err) {
//     if (err instanceof Error) {
//       throw err;
//     }
//   }
// };

// export const disconnectDB = async (): Promise<void> => {
//   try {
//     await mongoose.disconnect();
//     console.log('Database disconnected successfully');
//   } catch (err) {
//     if (err instanceof Error) {
//       throw new Error(err.message);
//     }
//   }
// };
const dbUrl: string = config.DB_URL || "";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`Database connected with ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
