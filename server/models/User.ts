import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";

interface Address {
  _id?: mongoose.Types.ObjectId;
  country: string;
  city: string;
  address1: string;
  address2?: string;
  zipCode?: string;
  addressType: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: number;
  addresses: Address[];
  role: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  orders: mongoose.Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordTime?: Date;
  getJwtToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name!"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [4, "Password should be greater than 4 characters"],
      select: false,
    },
    phoneNumber: {
      type: Number,
    },
    addresses: [
      {
        country: {
          type: String,
          required: [true, "Please provide a country"],
        },
        city: {
          type: String,
          required: [true, "Please provide a city"],
        },
        address1: {
          type: String,
          required: [true, "Please provide address line 1"],
        },
        address2: {
          type: String,
        },
        zipCode: {
          type: String, // Changed to String to support non-numeric ZIP codes
        },
        addressType: {
          type: String,
          required: [true, "Please provide an address type"],
        },
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    role: {
      type: String,
      default: "user",
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
  },
  { timestamps: true }
);

// Hash password
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT token
UserSchema.methods.getJwtToken = function (): string {
  return jwt.sign({ id: this._id }, config.JWT_SECRET_KEY as string, {
    expiresIn: config.JWT_EXPIRES,
  });
};

// Compare password
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model("User", UserSchema);
export default User;
