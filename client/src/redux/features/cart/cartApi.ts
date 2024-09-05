import { apiSlice } from '../api/apiSlice';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => 'cart',
    }),
    addToCart: builder.mutation({
      query: (item) => ({
        url: 'cart',
        method: 'POST',
        body: item,
      }),
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('cartItems', JSON.stringify(data));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `cart/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const cartItems = JSON.parse(
            localStorage.getItem('cartItems') || '[]'
          );
          const updatedCartItems = cartItems.filter(
            (item: any) => item._id !== id
          );
          localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        } catch (error: any) {
          console.log(error);
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
