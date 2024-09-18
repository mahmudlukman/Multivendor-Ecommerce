import { apiSlice } from '../api/apiSlice';

interface CartItem {
  qty: any;
  discountPrice: any;
  _id: string;
  // Add other properties of your cart item
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
      query: () => 'cart',
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          setLocalCart(data);
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      },
    }),
    addToCart: builder.mutation<CartItem[], CartItem>({
      query: (item) => ({
        url: 'cart',
        method: 'POST',
        body: item,
      }),
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            draft.push(item);
          })
        );
        try {
          const { data } = await queryFulfilled;
          setLocalCart(data);
        } catch (error) {
          patchResult.undo();
          console.error('Failed to add item to cart:', error);
        }
      },
    }),
    removeFromCart: builder.mutation<CartItem[], string>({
      query: (id) => ({
        url: `cart/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            return draft.filter((item) => item._id !== id);
          })
        );
        try {
          const { data } = await queryFulfilled;
          setLocalCart(data);
        } catch (error) {
          patchResult.undo();
          console.error('Failed to remove item from cart:', error);
        }
      },
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
} = cartApi;