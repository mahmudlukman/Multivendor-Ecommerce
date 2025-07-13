import { OrderData } from "../../../types";
import { apiSlice } from "../api/apiSlice";

interface OrderResponse {
  success: boolean;
  orders?: OrderData[];
  message?: string;
}

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponse, OrderData>({
      query: (orderData) => ({
        url: "create-order",
        method: "POST",
        body: {
          cart: orderData.cart,
          shippingAddress: orderData.shippingAddress,
          user: orderData.user?._id,
          totalPrice: orderData.totalPrice,
          paymentInfo: { type: "flutterwave" },
        },
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    getAllUserOrders: builder.query({
      query: () => ({
        url: "user-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getAllSellerOrders: builder.query({
      query: (shopId) => ({
        url: `seller-orders/${shopId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `update-order-status/${id}`,
        method: "PUT",
        body: { id, status },
        credentials: "include" as const,
      }),
    }),
    orderRefundRequest: builder.mutation({
      query: ({ id, status }) => ({
        url: `order-refund/${id}`,
        method: "PUT",
        body: { id, status },
        credentials: "include" as const,
      }),
    }),
    orderRefundSuccess: builder.mutation({
      query: ({ id, status }) => ({
        url: `order-refund-success/${id}`,
        method: "PUT",
        body: { id, status },
        credentials: "include" as const,
      }),
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "all-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `delete-order/${id}`,
        method: "DELETE",
        credentials: "include" as const,
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
  useUpdateOrderStatusMutation,
} = orderApi;
