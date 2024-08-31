import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the Event document
export interface IEvent extends Document {
  name: string;
  description: string;
  category: string;
  start_Date: Date;
  Finish_Date: Date;
  status?: string;
  tags?: string;
  originalPrice?: number;
  discountPrice: number;
  stock: number;
  images: {
    public_id: string;
    url: string;
  }[];
  shopId: string;
  shop: object;
  sold_out?: number;
}

// Create the schema with types
const EventSchema: Schema<IEvent> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your event product name!'],
    },
    description: {
      type: String,
      required: [true, 'Please enter your event product description!'],
    },
    category: {
      type: String,
      required: [true, 'Please enter your event product category!'],
    },
    start_Date: {
      type: Date,
      required: true,
    },
    Finish_Date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: 'Running',
    },
    tags: {
      type: String,
    },
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      required: [true, 'Please enter your event product price!'],
    },
    stock: {
      type: Number,
      required: [true, 'Please enter your event product stock!'],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    shopId: {
      type: String,
      required: true,
    },
    shop: {
      type: Object,
      required: true,
    },
    sold_out: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = mongoose.model('Event', EventSchema);
export default Event;
