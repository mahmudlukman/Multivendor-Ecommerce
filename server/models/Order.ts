import mongoose, { Document, Schema, Model } from 'mongoose';

interface CartItem {
  _id: string; // Product ID
  name: string;
  qty: number;
  price: number;
  shopId: string; // Add shopId to the cart item
  // Add other fields as needed (e.g., image, description)
}

interface PaymentInfo {
  id?: string;
  status?: string;
  type?: string;
}

export interface IOrder extends Document {
  cart: CartItem[];
  shippingAddress: object;
  user: mongoose.Types.ObjectId;
  totalPrice: number;
  status?: string;
  paymentInfo?: PaymentInfo;
  paymentId?: string;
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    paymentId: {
    type: String,
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
