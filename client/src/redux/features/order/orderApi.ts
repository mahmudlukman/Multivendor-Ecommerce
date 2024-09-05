import { apiSlice } from '../api/apiSlice';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: 'create-order',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    getAllUserOrders: builder.query({
      query: (userId) => ({
        url: `user-orders/${userId}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getAllSellerOrders: builder.query({
      query: (shopId) => ({
        url: `seller-orders/${shopId}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    updateOrderStatus: builder.mutation({
      query: (id) => ({
        url: `update-order-status/${id}`,
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),
    orderRefundRequest: builder.mutation({
      query: (id) => ({
        url: `order-refund/${id}`,
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),
    orderRefundSuccess: builder.mutation({
      query: (id) => ({
        url: `order-refund-success/${id}`,
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: 'all-orders',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `delete-order/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetAllSellerOrdersQuery,
  useGetAllUserOrdersQuery,
  useOrderRefundRequestMutation,
  useOrderRefundSuccessMutation,
  useUpdateOrderStatusMutation
} = orderApi;
