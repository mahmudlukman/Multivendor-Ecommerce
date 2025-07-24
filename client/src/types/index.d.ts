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
  orders: string;
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
  zipCode: string;
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
  wishlist: WishListItem[];
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EventData {
  _id: string;
  name: string;
  description: string;
  category: string;
  start_Date: string | Date; 
  Finish_Date: string | Date;
  status?: string;
  tags?: string;
  originalPrice?: number;
  discountPrice: number;
  stock: number;
  images: Image[];
  shopId: string;
  shop: Shop;
  sold_out?: number;
}

export interface CartItem {
  _id: string;
  name: string;
  images: { url: string }[];
  discountPrice: number;
  qty: number;
  description?: string;
  stock?: number;
  shopId?: string;
  isReviewed?: boolean;
}

export interface CouponCode {
  _id: string;
  name: string;
  value: number;
  shopId: string;
}

export interface PaymentInfo {
  id?: string;
  status?: string;
  type?: string;
}

export interface Order {
  _id: string;
  cart: CartItem[];
  shippingAddress: Address;
  user: User;
  totalPrice: number;
  status?: string;
  paymentInfo?: PaymentInfo;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: string;
}

export interface OrderData {
  _id?: string;
  cart: CartItem[];
  totalPrice: number;
  subTotalPrice: number;
  shipping: number;
  discountPrice: number | null;
  shippingAddress: Address;
  user: User | null;
}

export interface Transaction {
  // Define based on your usage, e.g.:
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  members: string[];
  lastMessage?: string;
  lastMessageId?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}