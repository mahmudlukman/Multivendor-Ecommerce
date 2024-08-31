import mongoose, { Document, Schema, Model } from 'mongoose';

interface Image {
  public_id: string;
  url: string;
}

interface Review {
  user: object;
  rating: number;
  comment: string;
  productId: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  tags?: string;
  originalPrice?: number;
  discountPrice: number;
  stock: number;
  images: Image[];
  reviews: Review[];
  ratings?: number;
  shopId: string;
  shop: object;
  sold_out: number;
  createdAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your product name!'],
    },
    description: {
      type: String,
      required: [true, 'Please enter your product description!'],
    },
    category: {
      type: String,
      required: [true, 'Please enter your product category!'],
    },
    tags: {
      type: String,
    },
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      required: [true, 'Please enter your product price!'],
    },
    stock: {
      type: Number,
      required: [true, 'Please enter your product stock!'],
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
    reviews: [
      {
        user: {
          type: Object,
        },
        rating: {
          type: Number,
        },
        comment: {
          type: String,
        },
        productId: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    ratings: {
      type: Number,
    },
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

const Product: Model<IProduct> = mongoose.model('Product', ProductSchema);
export default Product;
