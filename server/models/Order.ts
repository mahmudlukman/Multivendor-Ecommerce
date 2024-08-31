import mongoose, { Document, Schema, Model } from 'mongoose';

interface PaymentInfo {
  id?: string;
  status?: string;
  type?: string;
}

export interface IOrder extends Document {
  cart: object[];
  shippingAddress: object;
  user: object;
  totalPrice: number;
  status?: string;
  paymentInfo?: PaymentInfo;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    cart: {
      type: [{ type: Object }],
      required: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Processing',
    },
    paymentInfo: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
      type: {
        type: String,
      },
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);


const Order: Model<IOrder> = mongoose.model('Order', OrderSchema);
export default Order;
