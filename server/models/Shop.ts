import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";

interface Transaction {
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface WithdrawMethod {
  bankName: string;
  bankCountry: string;
  bankSwiftCode: string;
  bankAccountNumber: string;
  bankHolderName: string;
  bankAddress: string;
}

export interface IShop extends Document {
  name: string;
  email: string;
  password: string;
  description?: string;
  address: string;
  phoneNumber: number;
  role: string;
  avatar: {
    public_id: string;
    url: string;
  };
  zipCode: number;
  withdrawMethod?: WithdrawMethod | null;
  availableBalance: number;
  transactions: Transaction[];
  resetPasswordToken?: string;
  resetPasswordTime?: Date;
  getJwtToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const ShopSchema: Schema<IShop> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your shop name!"],
    },
    email: {
      type: String,
      required: [true, "Please enter your shop email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Password should be greater than 6 characters"],
      select: false,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "seller",
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    zipCode: {
      type: Number,
      required: true,
    },
    withdrawMethod: {
      bankName: { type: String },
      bankCountry: { type: String },
      bankSwiftCode: { type: String },
      bankAccountNumber: { type: String },
      bankHolderName: { type: String },
      bankAddress: { type: String },
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        amount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          default: "Processing",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
        },
      },
    ],
    resetPasswordToken: String,
    resetPasswordTime: Date,
  },
  { timestamps: true }
);

// Hash password
ShopSchema.pre<IShop>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT token
ShopSchema.methods.getJwtToken = function (): string {
  return jwt.sign({ id: this._id }, config.JWT_SECRET_KEY as string, {
    expiresIn: config.JWT_EXPIRES,
  });
};

// Compare password
ShopSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Shop: Model<IShop> = mongoose.model("Shop", ShopSchema);
export default Shop;
