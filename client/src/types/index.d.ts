export interface RootState {
  auth: {
    user: User | null;
  };
}

export interface User {
  _id: string;
  name: string;
  avatar: Image;
  email: string;
  phoneNumber: number;
  role: string;
  addresses: Address[];
}

export interface SellerState {
  sellerAuth: {
    seller: Seller | null;
  };
}

export interface WithdrawMethod {
  _id: string;
  bankName: string;
  bankCountry: string;
  bankSwiftCode: string;
  bankAccountNumber: string;
  bankHolderName: string;
  bankAddress: string;
}

interface Seller {
  _id: string;
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
  withdrawMethod?: WithdrawMethod;
  availableBalance?: number;
  transactions: Transaction[];
  withdrawMethod?: WithdrawMethod;
}

export interface ServerError {
  status?: number;
  data?: {
    message?: string;
  };
  message?: string;
}

export interface Address {
  country: string;
  city: string;
  address1: string;
  address2: string;
  zipCode: number;
  addressType: string;
  _id: string;
}

export interface Image {
  public_id: string;
  url: string;
}

export interface Shop {
  _id: string;
  name: string;
  avatar: Image;
  description: string;
  createdAt: string;
}

export interface Review {
  user: {
    name: string;
    avatar: Image;
  };
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface WishListItem {
  productId: string;
  _id: string;
  name: string;
  images: { url: string }[];
  discountPrice: number;
  qty: number;
  stock: number;
}

export interface ProductData {
  _id: string;
  name: string;
  description: string;
  images: Image[];
  shop: Shop;
  discountPrice: number;
  originalPrice?: number;
  stock: number;
  reviews: Review[];
  ratings: number;
  wishlist: WishlistItem[];
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EventData {
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
  images: Image;
  shopId: string;
  shop: object;
  sold_out?: number;
}

export interface CartItem {
  _id: string;
  name: string;
  images: { url: string }[];
  discountPrice: number;
  qty: number;
  isReviewed?: boolean;
}

export interface Order {
  _id: string;
  cart: CartItem[];
  shippingAddress: object;
  user: User;
  totalPrice: number;
  status?: string;
  paymentInfo?: PaymentInfo;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: string;
}
