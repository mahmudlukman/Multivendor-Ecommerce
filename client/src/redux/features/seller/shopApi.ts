import { apiSlice } from '../api/apiSlice';

export const shopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateShopAvatar: builder.mutation({
      query: (avatar) => ({
        url: 'update-shop-avatar',
        method: 'PUT',
        body: {
          avatar,
        },
        credentials: 'include' as const,
      }),
    }),
    updateShopInfo: builder.mutation({
      query: ({ name, email, phoneNumber, address, zipCode }) => ({
        url: 'update-shop-info',
        method: 'PUT',
        body: {
          name,
          email,
          phoneNumber,
          address,
          zipCode,
        },
        credentials: 'include' as const,
      }),
    }),
    updateShopPassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: 'update-shop-password',
        method: 'PUT',
        body: {
          oldPassword,
          newPassword,
        },
        credentials: 'include' as const,
      }),
    }),
    getAllShops: builder.query({
      query: () => ({
        url: 'get-shops',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getShop: builder.query({
      query: (id) => ({
        url: `shop-info${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    deleteShop: builder.mutation({
      query: (id) => ({
        url: `delete-shop/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
    deleteWithdrawMethod: builder.mutation({
      query: () => ({
        url: 'delete-withdraw-method',
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
    updateWithdrawMethod: builder.mutation({
      query: () => ({
        url: 'update-payment-methods',
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),
    updateUserAddress: builder.mutation({
      query: () => ({
        url: 'update-user-address',
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {} = shopApi;
