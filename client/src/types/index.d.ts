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
    _id: string;
    addedAt?: string;
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