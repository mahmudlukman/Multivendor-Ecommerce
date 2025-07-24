import { apiSlice } from "../api/apiSlice";

export const shopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateShopInfo: builder.mutation({
      query: ({
        name,
        email,
        phoneNumber,
        address,
        zipCode,
        avatar,
        description,
      }) => ({
        url: "update-shop-info",
        method: "PUT",
        body: {
          name,
          email,
          phoneNumber,
          address,
          zipCode,
          avatar,
          description,
        },
        credentials: "include" as const,
      }),
      invalidatesTags: [{type:'Seller', id: 'LIST'}],
    }),
    updateShopPassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-shop-password",
        method: "PUT",
        body: {
          oldPassword,
          newPassword,
        },
        credentials: "include" as const,
      }),
      invalidatesTags: [{type:'Seller', id: 'LIST'}],
    }),
    getAllShops: builder.query({
      query: () => ({
        url: "get-shops",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{type:'Seller', id: 'LIST'}],
    }),
    getShop: builder.query({
      query: (id) => ({
        url: `shop-info/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{type:'Seller', id: 'LIST'}],
    }),
    deleteShop: builder.mutation({
      query: (id) => ({
        url: `delete-shop/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{type:'Seller', id: 'LIST'}],
    }),
    deleteWithdrawMethod: builder.mutation({
      query: () => ({
        url: "delete-withdraw-method",
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{type:'Seller', id: 'LIST'}],
    }),
    updateWithdrawMethod: builder.mutation({
      query: (data) => ({
        url: "update-payment-method",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{type:'Seller', id: 'LIST'}],
    }),
  }),
});

export const {
  useDeleteShopMutation,
  useDeleteWithdrawMethodMutation,
  useGetAllShopsQuery,
  useGetShopQuery,
  useUpdateShopInfoMutation,
  useUpdateShopPasswordMutation,
  useUpdateWithdrawMethodMutation,
} = shopApi;
