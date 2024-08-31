import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the CouponCode document
export interface ICouponCode extends Document {
  name: string;
  value: number;
  minAmount?: number;
  maxAmount?: number;
  shopId: string;
  selectedProduct?: string;
}

// Create the schema with types
const CouponCodeSchema: Schema<ICouponCode> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your coupon code name!'],
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
    minAmount: {
      type: Number,
    },
    maxAmount: {
      type: Number,
    },
    shopId: {
      type: String,
      required: true,
    },
    selectedProduct: {
      type: String,
    },
  },
  { timestamps: true }
);

const CouponCode: Model<ICouponCode> = mongoose.model(
  'CouponCode',
  CouponCodeSchema
);
export default CouponCode;
