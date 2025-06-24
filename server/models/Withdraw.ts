import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface for the Withdraw document
export interface IWithdraw extends Document {
  seller: object;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Create the schema with types
const WithdrawSchema: Schema<IWithdraw> = new Schema(
  {
    seller: {
      type: Object,
      required: true,
    },
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
    default: Date.now(),
  },
  updatedAt:{
    type: Date,
  }
  },
);

const Withdraw: Model<IWithdraw> = mongoose.model("Withdraw", WithdrawSchema);
export default Withdraw;
