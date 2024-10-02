import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../auth/authSlice';
import { sellerLoggedIn } from '../sellerAuth/sellerAuthSlice';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_SERVER_URI,
  }),
  tagTypes: ['User', 'Seller', 'Product', 'Order', 'Cart', 'Conversation', 'CouponCode', 'Message', 'Event', 'Wishlist'],
  endpoints: (builder) => ({
    loadUser: builder.query({
      query: () => ({
        url: 'me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loadSeller: builder.query({
      query: () => ({
        url: 'my-shop',
        method: 'GET',
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            sellerLoggedIn({
              sellerToken: result.data.accessToken,
              seller: result.data.seller,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useLoadUserQuery } = apiSlice;
