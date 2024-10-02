import { apiSlice } from '../api/apiSlice';

interface CartItem {
  _id: string;
  name: string;
  images: { url: string }[];
  discountPrice: number;
  qty: number;
  stock: number;
}

const getLocalCart = (): CartItem[] => {
  return JSON.parse(localStorage.getItem('cartItems') || '[]');
};

const setLocalCart = (cart: CartItem[]) => {
  localStorage.setItem('cartItems', JSON.stringify(cart));
};

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      queryFn: () => {
        const cart = getLocalCart();
        return { data: cart };
      },
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<CartItem[], CartItem>({
      queryFn: (newItem) => {
        const cart = getLocalCart();
        const existingItemIndex = cart.findIndex(item => item._id === newItem._id);
        
        if (existingItemIndex !== -1) {
          // Item exists, update quantity
          cart[existingItemIndex].qty += newItem.qty;
        } else {
          // New item, add to cart
          cart.push(newItem);
        }
        
        setLocalCart(cart);
        return { data: cart };
      },
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<CartItem[], string>({
      queryFn: (id) => {
        let cart = getLocalCart();
        cart = cart.filter(item => item._id !== id);
        setLocalCart(cart);
        return { data: cart };
      },
      invalidatesTags: ['Cart'],
    }),
    updateCartItemQuantity: builder.mutation<CartItem[], { id: string, qty: number }>({
      queryFn: ({ id, qty }) => {
        const cart = getLocalCart();
        const itemIndex = cart.findIndex(item => item._id === id);
        if (itemIndex !== -1) {
          cart[itemIndex].qty = qty;
          setLocalCart(cart);
        }
        return { data: cart };
      },
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
} = cartApi;