import { apiSlice } from "../api/apiSlice";

export const withdrawApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWithdrawRequest: builder.mutation({
      query: (withdrawAmount) => ({
        url: "create-withdraw-request",
        method: "POST",
        body: { amount: withdrawAmount },
        credentials: "include" as const,
      }),
      invalidatesTags: [{type:'Withdraw', id: 'LIST'}],
    }),
    getAllWithdrawRequest: builder.query({
      query: () => ({
        url: "get-all-withdraw-request",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{type:'Withdraw', id: 'LIST'}],
    }),
    updateWithdrawRequest: builder.mutation({
      query: ({ withdrawId, sellerId, status }) => ({
        url: `update-withdraw-request/${withdrawId}`,
        method: "PUT",
        body: { sellerId, status },
        credentials: "include" as const,
      }),
      invalidatesTags: [{type:'Withdraw', id: 'LIST'}],
    }),
  }),
});

export const {
  useCreateWithdrawRequestMutation,
  useGetAllWithdrawRequestQuery,
  useUpdateWithdrawRequestMutation,
} = withdrawApi;
