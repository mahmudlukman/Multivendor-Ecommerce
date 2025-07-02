import { apiSlice } from "../api/apiSlice";

export const withdrawApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWithdrawRequest: builder.mutation({
      query: (data) => ({
        url: "create-withdraw-request",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllWithdrawRequest: builder.query({
      query: () => ({
        url: "get-all-withdraw-request",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateWithdrawRequest: builder.mutation({
      query: (sellerId) => ({
        url: `update-withdraw-request/${sellerId}`,
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateWithdrawRequestMutation,
  useGetAllWithdrawRequestQuery,
  useUpdateWithdrawRequestMutation,
} = withdrawApi;
